---
title: Data Processing with QuickJS
sidebar_label: C + QuickJS
description: Process structured data in C programs. Seamlessly integrate spreadsheets into your program by pairing QuickJS and SheetJS. Supercharge programs with modern data tools.
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[QuickJS](https://bellard.org/quickjs/) is an embeddable JS engine written in C.
It has built-in support for reading and writing file data stored in memory.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses QuickJS and SheetJS to pull data from a spreadsheet and print CSV
rows. We'll explore how to load SheetJS in a QuickJS context and process
spreadsheets from C programs.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading data from files.

## Integration Details

:::note pass

Many QuickJS functions are not documented. The explanation was verified against
the latest release (commit `d378a9f`).

:::

### Initialize QuickJS

Most QuickJS API functions interact with a `JSContext` object[^1], which is
normally created with `JS_NewRuntime` and `JS_NewContext`:

```c
#include "quickjs.h"

/* initialize context */
JSRuntime *rt = JS_NewRuntime();
JSContext *ctx = JS_NewContext(rt);
```

QuickJS provides a `global` object through `JS_GetGlobalObject`:

```c
/* obtain reference to global object */
JSValue global = JS_GetGlobalObject(ctx);
```

<details>
  <summary><b>Cleanup</b> (click to show)</summary>

Once finished, programs are expected to cleanup by using `JS_FreeValue` to free
values, `JS_FreeContext` to free the context pointer, and `JS_FreeRuntime` to
free the runtime:

```c
/* global is a JSValue */
JS_FreeValue(ctx, global);

/* cleanup */
JS_FreeContext(ctx);
JS_FreeRuntime(rt);
```

The [Integration Example](#integration-example) frees JS values after use.

</details>

### Load SheetJS Scripts

[SheetJS Standalone scripts](/docs/getting-started/installation/standalone) can
be loaded and executed in QuickJS.

The main library can be loaded by reading the script from the file system and
evaluating in the QuickJS context using `JS_Eval`:

```c
static char *read_file(const char *filename, size_t *sz) {
  FILE *f = fopen(filename, "rb");
  if(!f) return NULL;
  long fsize; { fseek(f, 0, SEEK_END); fsize = ftell(f); fseek(f, 0, SEEK_SET); }
  char *buf = (char *)malloc(fsize * sizeof(char));
  *sz = fread((void *) buf, 1, fsize, f);
  fclose(f);
  return buf;
}

// ...
  {
    /* Read `xlsx.full.min.js` from the filesystem */
    size_t len; char *buf = read_file("xlsx.full.min.js", &len);
    /* evaluate from the QuickJS context */
    JS_Eval(ctx, buf, len, "<input>", 0);
    /* Free the file buffer */
    free(buf);
  }
```

If the library is loaded, `XLSX.version` will be a string. This string can be
pulled into the main C program.

1) Get the `XLSX` property of the global object using `JS_GetPropertyStr`:

```c
/* obtain reference to the XLSX object */
JSValue XLSX = JS_GetPropertyStr(ctx, global, "XLSX");
```

2) Get the `version` property of the `XLSX` object using `JS_GetPropertyStr`:

```c
/* obtain reference to `XLSX.version` */
JSValue version = JS_GetPropertyStr(ctx, XLSX, "version");
```

3) Pull the string into C code with `JS_ToCStringLen`:

```c
/* pull the version string into C */
size_t vlen; const char *vers = JS_ToCStringLen(ctx, &vlen, version);
printf("Version: %s\n", vers);
```

### Reading Files

`JS_NewArrayBuffer` can generate an `ArrayBuffer` from a C byte array. The
function signature expects `uint8_t *` instead of `char *`:

```c
/* read file */
size_t dlen; uint8_t * dbuf = (uint8_t *)read_file("pres.numbers", &dlen);

/* load data into array buffer */
JSValue ab = JS_NewArrayBuffer(ctx, dbuf, dlen, NULL, NULL, 0);
```

The `ArrayBuffer` will be parsed with the SheetJS `read` method[^2]. The CSV row
data will be generated with `sheet_to_csv`[^3].

#### Parse the ArrayBuffer

:::note pass

The goal is to run the equivalent of the following JavaScript code:

```js
/* `ab` is the `ArrayBuffer` from the previous step */
var wb = XLSX.read(ab);
```

:::

1) Get the `XLSX` property of the global object and the `read` property of `XLSX`:

```c
/* obtain reference to XLSX.read */
JSValue XLSX = JS_GetPropertyStr(ctx, global, "XLSX");
JSValue XLSX_read = JS_GetPropertyStr(ctx, XLSX, "read");
```

2) Create an array of arguments to pass to the function. In this case, the
`read` function will be called with one argument (`ArrayBuffer` data):

```c
/* prepare arguments */
JSValue args[] = { ab };
```

3) Use `JS_Call` to call the function with the arguments:

```c
/* call XLSX.read(ab) */
JSValue wb = JS_Call(ctx, XLSX_read, XLSX, 1, args);
```

#### Get First Worksheet

:::note pass

The goal is to get the first worksheet. In JavaScript, the `SheetNames` property
of the workbook is an array of strings and the `Sheets` property holds worksheet
objects[^4]. The desired action looks like:

```js
/* `wb` is the workbook from the previous step */
var wsname = wb.SheetNames[0];
var ws = wb.Sheets[wsname];
```

:::

4) Pull `wb.SheetNames[0]` into a C string using `JS_GetPropertyStr`:

```c
/* get `wb.SheetNames[0]` */
JSValue SheetNames = JS_GetPropertyStr(ctx, wb, "SheetNames");
JSValue Sheet1 = JS_GetPropertyStr(ctx, SheetNames, "0");

/* pull first sheet name into C code */
size_t wslen; const char *wsname = JS_ToCStringLen(ctx, &wslen, Sheet1);
```

5) Get the worksheet object:

```c
/* get wb.Sheets[wsname] */
JSValue Sheets = JS_GetPropertyStr(ctx, wb, "Sheets");
JSValue ws = JS_GetPropertyStr(ctx, Sheets, wsname);
```

#### Convert to CSV

:::note pass

The goal is to call `sheet_to_csv`[^5] and pull the result into C code:

```js
/* `ws` is the worksheet from the previous step */
var csv = XLSX.utils.sheet_to_csv(ws);
```

:::

6) Create a references to `XLSX.utils` and `XLSX.utils.sheet_to_csv`:

```c
/* obtain reference to XLSX.utils.sheet_to_csv */
JSValue utils = JS_GetPropertyStr(ctx, XLSX, "utils");
JSValue sheet_to_csv = JS_GetPropertyStr(ctx, utils, "sheet_to_csv");
```

7) Create arguments array:

```c
/* prepare arguments */
JSValue args[] = { ws };
```

8) Use `JS_Call` to call the function and use `JS_ToCStringLen` to pull the CSV:

```c
JSValue csv = JS_Call(ctx, sheet_to_csv, utils, 1, args);
size_t csvlen; const char *csvstr = JS_ToCStringLen(ctx, &csvlen, csv);
```

At this point, `csvstr` is a C string that can be printed to standard output.

## Complete Example

The "Integration Example" covers a traditional integration in a C application,
while the "CLI Test" demonstrates other concepts using the `quickjs` CLI tool.

### Integration Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Git Commit | Date       |
|:-------------|:-----------|:-----------|
| `darwin-x64` | `6a89d7c`  | 2024-03-15 |
| `darwin-arm` | `d378a9f`  | 2024-05-23 |
| `win10-x64`  | `9e561d5`  | 2024-03-04 |
| `win11-arm`  | `d378a9f`  | 2024-05-25 |
| `linux-x64`  | `3b45d15`  | 2024-04-25 |
| `linux-arm`  | `d378a9f`  | 2024-05-25 |

When the demo was tested, `d378a9f` was the HEAD commit on the `master` branch.

:::

:::caution pass

QuickJS does not officially support Windows. The `win10-x64` and `win11-arm`
tests were run entirely within Windows Subsystem for Linux.

:::

0) Build `libquickjs.a`:

```bash
git clone https://github.com/bellard/quickjs
cd quickjs
git checkout d378a9f
make
cd ..
```

1) Copy `libquickjs.a` and `quickjs.h` into the working directory:

```bash
cp quickjs/libquickjs.a .
cp quickjs/quickjs.h .
```

2) Download [`sheetjs.quick.c`](pathname:///quickjs/sheetjs.quick.c):

```bash
curl -LO https://docs.sheetjs.com/quickjs/sheetjs.quick.c
```

3) Build the sample application:

```bash
gcc -o sheetjs.quick -Wall sheetjs.quick.c libquickjs.a -lm
```

This program tries to parse the file specified by the first argument

4) Download the SheetJS Standalone script and test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

5) Run the test program:

```bash
./sheetjs.quick pres.numbers
```

If successful, the program will print the library version number, file size,
first worksheet name, and the contents of the first sheet as CSV rows.


### CLI Test

:::note Tested Deployments

This demo was tested in the following environments:

| Git Commit | Date       |
|:-----------|:-----------|
| `d378a9f`  | 2024-05-23 |

When the demo was tested, `d378a9f` was the HEAD commit on the `master` branch.

:::

0) Build the `qjs` command line utility from source:

```bash
git clone https://github.com/bellard/quickjs
cd quickjs
git checkout d378a9f
make
cd ..
cp quickjs/qjs .
```

1) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

2) Download [`SheetJSQuick.js`](pathname:///quickjs/SheetJSQuick.js)

```bash
curl -LO https://docs.sheetjs.com/quickjs/SheetJSQuick.js
```

3) Test the program:

```bash
./qjs SheetJSQuick.js
```

If successful, the script will print CSV rows and generate `SheetJSQuick.xlsx`.
The generated file can be opened in Excel or another spreadsheet editor.


[^1]: See ["Runtime and Contexts"](https://bellard.org/quickjs/quickjs.html#Runtime-and-contexts) in the QuickJS documentation
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^4]: See ["Workbook Object" in "SheetJS Data Model"](/docs/csf/book)
[^5]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
