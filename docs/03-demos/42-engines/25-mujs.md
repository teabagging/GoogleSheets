---
title: Munging Data in MuJS
sidebar_label: C + MuJS
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[MuJS](https://mujs.com/) is a C89-compatible embeddable JS engine.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses MuJS and SheetJS to pull data from a spreadsheet and print CSV
rows. We'll explore how to load SheetJS in a MuJS context and process
spreadsheets from a C program.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading data from files.

:::danger pass

The MuJS engine has a number of bugs that affect parsing in XLSX, XLML and other
XML and plaintext file formats. If software does not need to support legacy
systems or architecture, it is strongly recommended to use a modern engine such
as [Duktape](/docs/demos/engines/duktape).

:::

## Integration Details

:::info pass

Many MuJS functions are not documented. The explanation was verified against
version `1.3.4`.

:::

### Initialize MuJS

A MuJS engine instance is created with `js_newstate`:

```c
js_State *J = js_newstate(NULL, NULL, 0);
```

#### Error Messages

A special `report` callback should be used to display error messages. This
report function is used in official examples:

```c
static void report(js_State *J, const char *msg) { fprintf(stderr, "REPORT MSG: %s\n", msg); }
```

The `js_setreport` function attaches the reporter to the engine:

```c
js_setreport(J, report);
```

#### Global

MuJS does not expose a `global` variable. It can be obtained from a reference
to `this` in an unbound function. The following snippet will be evaluated:

```js
/* create global object */
var global = (function(){ return this; }).call(null);
```

In MuJS, `js_dostring` evaluates code stored in C strings:

```c
/* create `global` variable */
js_dostring(J, "var global = (function() { return this; })(null);");
```

#### Console

MuJS has no built-in method to print data. The official examples define the
following `print` method:

```c
static void jsB_print(js_State *J) {
  int i = 1, top = js_gettop(J);
  for (; i < top; ++i) {
    const char *s = js_tostring(J, i);
    if (i > 1) putchar(' ');
    /* note: the official example uses `fputs`, but `puts` makes more sense */
    puts(s);
  }
  putchar('\n');
  js_pushundefined(J);
}
```

This function can be exposed in the JS engine by using `js_newcfunction` to add
the function to the engine and `js_setglobal` to bind to a name:

```c
js_newcfunction(J, jsB_print, "print", 0);
js_setglobal(J, "print");
```

After adding `print` to the engine, the following JS snippet will create a
`console` object with a `log` method:

```js
/* create a fake `console` from the hermes `print` builtin */
var console = { log: function(x) { print(x); } };
```

In MuJS, `js_dostring` evaluates code stored in C strings:

```C
js_dostring(J, "var console = { log: print };");
```

### Load SheetJS Scripts

[SheetJS Standalone scripts](/docs/getting-started/installation/standalone) can
be parsed and evaluated in a C context.

The shim and main library can be loaded by with the MuJS `js_dofile` method. It
reads scripts from the filesystem and evaluates in the MuJS context:

```c
/* load scripts */
js_dofile(J, "shim.min.js");
js_dofile(J, "xlsx.full.min.js");
```

### Reading Files

MuJS does not expose a method to pass raw byte arrays into the engine. Instead,
the raw data should be encoded in Base64.

#### Reading File Bytes

File bytes can be read using standard C library methods. The example defines a
method `read_file` with the following signature:

```c
/* Read data from filesystem
 * `filename` - path to filename
 * `sz` - pointer to size_t
 * return value is a pointer to the start of the file data
 * the length of the data will be written to `sz`
 */
char *read_file(const char *filename, size_t *sz);
```

<details>
  <summary><b>File Reader Implementation</b> (click to show)</summary>

This function uses standard C API methods.

```c
/* -------------------- */
/* read file from filesystem */

static char *read_file(const char *filename, size_t *sz) {
  FILE *f = fopen(filename, "rb");
  if(!f) return NULL;
  long fsize; { fseek(f, 0, SEEK_END); fsize = ftell(f); fseek(f, 0, SEEK_SET); }
  char *buf = (char *)malloc(fsize * sizeof(char));
  *sz = fread((void *) buf, 1, fsize, f);
  fclose(f);
  return buf;
}

/* -------------------- */
```

</details>

The example program will accept an argument and read the specified file:

```c
/* read file */
size_t dlen; char *dbuf = read_file(argv[1], &dlen);
```

#### Base64 String

The example defines a method `Base64_encode` with the following signature:

```c
/* Encode data with Base64
 * `dst` - start of output buffer
 * `src` - start of input data
 * `len` - number of bytes to encode
 * return value is the number of bytes
 */
int Base64_encode(char *dst, const char *src, int len);
```

<details>
  <summary><b>Base64 Encoder Implementation</b> (click to show)</summary>

The method mirrors [the TypeScript implementation](https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/modules/04_base64.ts):

```c
/* -------------------- */
/* base64 encoder */

const char Base64_map[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

static int Base64_encode(char *dst, const char *src, int len) {
	unsigned char c1 = 0, c2 = 0, c3 = 0;
	char *p = dst;
	size_t i = 0;

	for(; i < len;) {
		c1 = src[i++];
		*p++ = Base64_map[(c1 >> 2)];

		c2 = src[i++];
		*p++ = Base64_map[((c1 & 3) << 4) | (c2 >> 4)];

		c3 = src[i++];
		*p++ = Base64_map[((c2 & 15) << 2) | (c3 >> 6)];
		*p++ = Base64_map[c3 & 0x3F];
	}

	if(i < len) {
		c1 = src[i++];
		*p++ = Base64_map[(c1 >> 2)];
		if(i == len) {
			*p++ = Base64_map[(c1 & 3) << 4];
			*p++ = '=';
		} else {
			c2 = src[i++];
			*p++ = Base64_map[((c1 & 3) << 4) | (c2 >> 4)];
			*p++ = Base64_map[(c2 & 15) << 2];
		}
		*p++ = '=';
	}

	*p++ = '\0';
	return p - dst;
}

/* -------------------- */
```

</details>

Typically C code will read files and encode to Base64 strings. The intermediate
string length is approximately 33% larger than the original length (3 raw bytes
are mapped to 4 Base64 characters).

```c
/* base64 encode the file */
int sz = ((dlen + 2) / 3) * 4 + 1;
char *b64 = malloc(sz+1);
sz = Base64_encode(b64, dbuf, dlen);
```

#### Passing Strings

The Base64 string can be added to the engine using `js_pushlstring`. After
adding to the engine, `js_setglobal` can bind the variable to the name `buf`:

```c
/* create `buf` global from the data */
js_pushlstring(J, b64, sz);
js_setglobal(J, "buf");
```

#### SheetJS Operations

In this example, the goal is to pull the first worksheet and generate CSV rows.

`XLSX.read`[^1] parses the Base64 string and returns a SheetJS workbook object:

```js
/* parse file */
js_dostring(J, "var wb = XLSX.read(buf, {type: 'base64'});");
```

The `SheetNames` property[^2] is an array of the sheet names in the workbook.
The first sheet name can be obtained with the following JS snippet:

```js
var first_sheet_name = wb.SheetNames[0];
```

The `Sheets` property[^3] is an object whose keys are sheet names and whose
corresponding values are worksheet objects.

```js
var first_sheet = wb.Sheets[first_sheet_name];
```

The `sheet_to_csv` utility function[^4] generates a CSV string from the sheet:

```js
var csv = XLSX.utils.sheet_to_csv(first_sheet);
```

_C integration code_

In this example, the `console.log` method will print the generated CSV:

```c
/* print CSV from first worksheet */
js_dostring(J, "var ws = wb.Sheets[wb.SheetNames[0]]");
js_dostring(J, "console.log(XLSX.utils.sheet_to_csv(ws));");
```

## Integration Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Version | Date       |
|:-------------|:--------|:-----------|
| `darwin-x64` | `1.3.4` | 2024-05-25 |
| `darwin-arm` | `1.3.4` | 2024-05-23 |
| `win10-x64`  | `1.3.4` | 2024-06-20 |
| `win11-arm`  | `1.3.4` | 2024-06-20 |
| `linux-x64`  | `1.3.4` | 2024-04-21 |
| `linux-arm`  | `1.3.4` | 2024-05-25 |

:::

:::caution pass

MuJS distributions do not include native Windows projects. The `win10-x64` and
`win11-arm` tests were run entirely within Windows Subsystem for Linux.

When building in WSL, `libreadline-dev` must be installed using `apt`:

```bash
sudo apt-get install libreadline-dev
```

:::

1) Make a project directory:

```bash
mkdir sheetjs-mu
cd sheetjs-mu
```

2) Build the MuJS shared library from source:

```bash
curl -LO https://mujs.com/downloads/mujs-1.3.4.zip
unzip mujs-1.3.4.zip
cd mujs-1.3.4
make release
cd ..
```

3) Copy the `mujs.h` header file and `libmujs.a` library to the project folder:

```bash
cp mujs-1.3.4/build/release/libmujs.a mujs-1.3.4/mujs.h .
```

4) Download [`SheetJSMu.c`](pathname:///mujs/SheetJSMu.c):

```bash
curl -LO https://docs.sheetjs.com/mujs/SheetJSMu.c
```

5) Build the application:

```bash
gcc -o SheetJSMu SheetJSMu.c -L. -lmujs -lm -lc -std=c89 -Wall
```

6) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsb">pres.xlsb</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.xlsb`}
</CodeBlock>

7) Run the application:

```bash
./SheetJSMu pres.xlsb
```

If successful, the app will print the contents of the first sheet as CSV rows.

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See ["Workbook Object"](/docs/csf/book)
[^3]: See ["Workbook Object"](/docs/csf/book)
[^4]: See [`sheet_to_csv` in "Utilities"](/docs/api/utilities/csv#csv-output)
