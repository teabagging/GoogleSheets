---
title: C + JerryScript
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[JerryScript](https://jerryscript.net/) is a lightweight JavaScript engine. It
is designed for microcontrollers and similar environments.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses JerryScript and SheetJS to pull data from a spreadsheet and print
CSV rows. We'll explore how to load SheetJS in a JerryScript realm and process
spreadsheets from C programs.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading data from files.

:::caution pass

This demo requires a much larger heap size than is normally used in JerryScript
deployments! In local testing, the following sizes were needed:

- 8192 (8M) for https://docs.sheetjs.com/pres.xlsx
- 65536 (64M) for https://docs.sheetjs.com/pres.numbers

:::

:::note Tested Environments

This demo was tested in the following environments:

| Architecture | Commit    | Date       |
|:-------------|:----------|:-----------|
| `darwin-x64` | `35465ed` | 2024-05-25 |
| `darwin-arm` | `35465ed` | 2024-05-25 |
| `win10-x64`  | `47bd5d4` | 2024-04-14 |
| `win11-arm`  | `35465ed` | 2024-05-25 |
| `linux-x64`  | `cefd391` | 2024-03-21 |
| `linux-arm`  | `35465ed` | 2024-05-25 |

The Windows tests were run in WSL.

:::

## Integration Details

:::info pass

The official JerryScript documentation and examples are out of date. This
explanation was verified against the latest release (commit `514fa67`).

:::

### Initialize JerryScript

The global engine instance can be initialized with `jerry_init` and cleaned up
with `jerry_cleanup`:

```c
#include "jerryscript.h"

int main (int argc, char **argv) {
  /* Initialize engine */
/* highlight-next-line */
  jerry_init(JERRY_INIT_EMPTY);

  // ... use engine methods ...

  /* cleanup before exiting */
/* highlight-next-line */
  jerry_cleanup();
  return 0;
}
```

API methods use `jerry_value_t` values to represent JS values and miscellany.
Values representing errors can be distinguished using `jerry_value_is_error`.
`jerry_value_t` values can be freed with `jerry_value_free`.

### Evaluate Code

Evaluating code involves two steps:

- `jerry_parse` will parse the script
- `jerry_run` will run the parsed script object

:::note pass

The return value of `jerry_parse` is a `jerry_value_t` value that can be safely
freed after `jerry_run`.

:::

The following `eval_str` function parses and executes scripts. If parsing fails,
the function will return the parsing error. If parsing succeeds, the function
will return the result of executing the code.

```c
jerry_value_t eval_str(const char *code, size_t sz) {
  /* try to parse code */
  jerry_value_t parsed = jerry_parse(code, sz, NULL);
  /* return the parse error if parsing failed */
  if(jerry_value_is_error(parsed)) return parsed;

  /* run the code */
  jerry_value_t out = jerry_run(parsed);
  /* free the parsed representation */
  jerry_value_free(parsed);

  /* return the result */
  return out;
}
```

### Load SheetJS Scripts

[SheetJS Standalone scripts](/docs/getting-started/installation/standalone) can
be parsed and run in JerryScript.

Scripts can be read from the filesystem using standard C functions:

```c
static char *read_file(const char *filename, size_t *sz) {
  FILE *f = fopen(filename, "rb");
  if(!f) return NULL;
  long fsize; { fseek(f, 0, SEEK_END); fsize = ftell(f); fseek(f, 0, SEEK_SET); }
  char *buf = (char *)malloc(fsize * sizeof(char));
  *sz = fread((void *) buf, 1, fsize, f) - 1;
  fclose(f);
  return buf;
}
```

The shim script must be evaluated before the main library. In both cases, after
reading the script file, the previous `eval_str` function can run the code:

```c
  /* evaluate shim.min.js */
  {
    size_t sz; const jerry_char_t *script = (jerry_char_t *)read_file("shim.min.js", &sz);
    jerry_value_t result = eval_str(script, sz);
    if(jerry_value_is_error(result)) { // failed to parse / execute
      fprintf(stderr, "Failed to evaluate shim.min.js"); return 1;
    }
    jerry_value_free(result);
  }

  /* evaluate xlsx.full.min.js */
  {
    size_t sz; const jerry_char_t *script = (jerry_char_t *)read_file("xlsx.full.min.js", &sz);
    jerry_value_t result = eval_str(script, sz);
    if(jerry_value_is_error(result)) { // failed to parse / execute
      fprintf(stderr, "Failed to evaluate xlsx.full.min.js"); return 1;
    }
    jerry_value_free(result);
  }
```

### Reading Files

Binary file data can be passed from C to JerryScript with `ArrayBuffer` objects.

#### Creating ArrayBuffers

`jerry_arraybuffer` will generate an `ArrayBuffer` object of specified length.
After creating the array, `jerry_arraybuffer_write` will copy data.

The following `load_file` function reads a file from the filesystem and loads
the data into an `ArrayBuffer`:

```c
static jerry_value_t load_file(const char *filename) {
  /* read file */
  size_t len; char *buf = read_file(filename, &len);
  if(!buf) return 0;

  /* create ArrayBuffer */
  jerry_value_t out = jerry_arraybuffer(len);
  /* copy file data into ArrayBuffer */
  jerry_arraybuffer_write(out, 0, (const uint8_t*)buf, len);
  return out;
}
```

The process may fail. The result should be tested with `jerry_value_is_error`:

```c
  jerry_value_t ab = load_file("pres.xlsx");
  if(!ab || jerry_value_is_error(ab)) { // failed to create ArrayBuffer
    fprintf(stderr, "Failed to read pres.xlsx"); return 1;
  }
```

#### Creating Global Variable

The `ArrayBuffer` object must be bound to a variable before it can be used.

:::note pass

The goal is to bind the `ArrayBuffer` to the `buf` property in global scope.

:::

1) Get the global `this` variable (using `jerry_current_realm`):

```c
  /* get the global variable */
  jerry_value_t this = jerry_current_realm();
  if(jerry_value_is_error(this)) { // failed to get global object
    fprintf(stderr, "Failed to get global object"); return 1;
  }
```

2) Create a JerryScript string (`"buf"`) for the property:

```c
  /* create a string "buf" for the property access */
  jerry_value_t prop = jerry_string_sz("buf");
  if(jerry_value_is_error(this)) { // failed to create "buf"
    fprintf(stderr, "Failed to create string"); return 1;
  }
```

3) Assign the property using `jerry_object_set`:

```c
  /* set global["buf"] to the ArrayBuffer */
  jerry_value_t set = jerry_object_set(this, prop, ab);
  if(jerry_value_is_error(set)) { // failed to set property
    fprintf(stderr, "Failed to assign ArrayBuffer"); return 1;
  }
```

#### Parsing Data

:::note pass

The goal is to run the equivalent of the following JavaScript code:

```js
/* `buf` is the `ArrayBuffer` from the previous step */
var wb = XLSX.read(buf);
```

:::

The `ArrayBuffer` from the previous step is available in the `buf` variable.
That `ArrayBuffer` can be passed to the SheetJS `read` method[^1], which will
parse the raw data and return a SheetJS workbook object[^2].

`var wb = XLSX.read(buf)` can be stored in a byte array and evaluated directly:

```c
  /* run `var wb = XLSX.read(buf)` */
  {
    const jerry_char_t code[] = "var wb = XLSX.read(buf);";
    jerry_value_t result = eval_str(code, sizeof(code) - 1);
    if(jerry_value_is_error(result)) {
      fprintf(stderr, "Failed to parse file"); return 1;
    }
    jerry_value_free(result);
  }
```

#### Generating CSV

:::note pass

The goal is to run the equivalent of the following JavaScript code:

```js
/* `wb` is the workbook from the previous step */
XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]])
```

:::

A SheetJS workbook object can contain multiple sheet objects[^3]. The `Sheets`
property is an object whose keys are sheet names and whose values are sheet
objects. The `SheetNames` property is an array of worksheet names.

The first sheet name can be found at `wb.SheetNames[0]`. The first sheet object
can be found at `wb.Sheets[wb.SheetNames[0]]`.

The SheetJS `sheet_to_csv` utility function[^4] accepts a sheet object and
generates a JS string.

Combining everything, `XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]])`
generates a CSV string based on the first worksheet in the workbook `wb`:

```c
  const jerry_char_t code[] = "XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]])";
  jerry_value_t csv = eval_str(code, sizeof(code) - 1);
  if(jerry_value_is_error(result)) { // CSV generation failed
    fprintf(stderr, "Failed to generate csv"); return 1;
  }
```

#### Pulling Strings

JerryScript exposes encoding-aware methods to pull JS strings into C. The
`JERRY_ENCODING_UTF8` encoding forces UTF8 interpretations.

The `jerry_string_size` function returns the number of bytes required to store
the string. After allocating memory, `jerry_string_to_buffer` will copy data.
The following `pull_str` function uses `malloc`:

```js
char *pull_str(jerry_value_t str, size_t *sz) {
  /* determine string size in bytes */
  jerry_size_t str_sz = jerry_string_size(str, JERRY_ENCODING_UTF8);

  /* allocate memory */
  jerry_char_t *buf = (jerry_char_t *)malloc(str_sz + 1);

  /* copy from JS string to C byte array */
  jerry_string_to_buffer(str, JERRY_ENCODING_UTF8, buf, str_sz + 1);

  /* pass back size and return the pointer */
  *sz = str_sz;
  return (char *)buf;
}
```

This function can be used to pull the `csv` value from the previous section:

```c
  size_t sz; char *buf = pull_str(result, &sz);
  printf("%s\n", buf);
```

## Complete Example

The "Integration Example" covers a traditional integration in a C application,
while the "CLI Test" demonstrates other concepts using the `jerry` CLI tool.

### Integration Example

<details>
  <summary><b>Build Dependencies</b> (click to show)</summary>

The JerryScript build system requires `cmake`.

Debian and WSL additionally require `python3` and `python-is-python3` packages.

</details>

1) Create a project folder:

```bash
mkdir SheetJSJerry
cd SheetJSJerry
```

2) Clone the repository and build the library with required options:

```bash
git clone --depth=1 https://github.com/jerryscript-project/jerryscript.git
cd jerryscript
python3 tools/build.py --error-messages=ON --logging=ON --mem-heap=8192 --cpointer-32bit=ON
cd ..
```

3) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the `SheetJSJerry` directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

4) Download [`sheetjs.jerry.c`](pathname:///jerryscript/sheetjs.jerry.c) into
the same folder:

```bash
curl -LO https://docs.sheetjs.com/jerryscript/sheetjs.jerry.c
```

5) Build the sample application:

```bash
gcc -o sheetjs.jerry -Ijerryscript/jerry-ext/include -Ijerryscript/jerry-math/include -Ijerryscript/jerry-core/include sheetjs.jerry.c -ljerry-core -ljerry-ext -ljerry-port -lm -Ljerryscript/build/lib -Wno-pointer-sign
```

6) Run the test program:

```bash
./sheetjs.jerry pres.xlsx
```

If successful, the program will print contents of the first sheet as CSV rows.

### CLI Test

:::note pass

Due to limitations of the standalone binary, this demo will encode a test file
as a Base64 string and directly add it to an amalgamated script.

:::

0) Build the library and command line tool with required options.

If the "Integration Example" was not tested, run the following commands:

```bash
git clone --depth=1 https://github.com/jerryscript-project/jerryscript.git
cd jerryscript
python3 tools/build.py --error-messages=ON --logging=ON --mem-heap=8192 --cpointer-32bit=ON
```

If the "Integration Example" was tested, enter the `jerryscript` folder:

```bash
cd jerryscript
```

1) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the `jerryscript` cloned repo directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

2) Bundle the test file and create `payload.js`:

```bash
node -e "fs.writeFileSync('payload.js', 'var payload = \"' + fs.readFileSync('pres.xlsx').toString('base64') + '\";')"
```

3) Create support scripts:

- `global.js` creates a `global` variable and defines a fake `console`:

```js title="global.js"
var global = (function(){ return this; }).call(null);
var console = { log: function(x) { print(x); } };
```

- `jerry.js` will call `XLSX.read` and `XLSX.utils.sheet_to_csv`:

```js title="jerry.js"
var wb = XLSX.read(payload, {type:'base64'});
console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
```

4) Create the amalgamation `xlsx.jerry.js`:

```bash
cat global.js xlsx.full.min.js payload.js jerry.js > xlsx.jerry.js
```

The final script defines `global` before loading the standalone library.  Once
ready, it will read the bundled test data and print the contents as CSV.

5) Run the script using the `jerry` standalone binary:

```bash
build/bin/jerry xlsx.jerry.js; echo $?
```

If successful, the contents of the test file will be displayed in CSV rows. The
status code `0` will be printed after the rows.

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See ["Workbook Object" in "SheetJS Data Model"](/docs/csf/book)
[^3]: See ["Sheet Objects"](/docs/csf/sheet)
[^4]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
