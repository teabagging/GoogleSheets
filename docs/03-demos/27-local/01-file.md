---
title: Local File Access
pagination_prev: demos/data/index
pagination_next: demos/cloud/index
sidebar_custom_props:
  summary: Reading and writing files using various platform APIs
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Reading from and writing to files requires native platform support.

SheetJS `readFile` and `writeFile` methods include support for some platforms.
Due to sandboxing and security settings, `readFile` does not work in the web
browser and `writeFile` is not guaranteed to work in all cases.

This demo looks at various web APIs for reading and writing files. We'll explore
how to pass data between SheetJS functions and various APIs.

:::note pass

Some snippets are also available in the "Common Use Cases" section:

- [Data Import](/docs/solutions/input)
- [Data Export](/docs/solutions/output)

Other demos cover APIs for local file access on special platforms:

- ["iOS and Android Apps"](/docs/demos/mobile/) covers mobile app frameworks
- ["Desktop Apps"](/docs/demos/desktop/) covers desktop apps
- ["Command-Line Tools"](/docs/demos/cli) covers standalone command-line tools

:::

## Binary Data

JavaScript engines represent binary data in a number of structures.

The `type` option for SheetJS `read` function[^1] controls how the data should
be interpreted. This parameter distinguishes [binary strings](#binary-strings)
from [Base64 strings](#base64-strings).

The `type` option for SheetJS `write` function[^2] controls the output storage.

### `Uint8Array` and `Buffer`

A `Uint8Array` is a Typed Array where each value is a 8-bit unsigned integer.
Server-side platforms including NodeJS typically use `Uint8Array`, or a subclass
such as `Buffer`[^3], to represent data from files.

The SheetJS `read` method can read data from `Uint8Array` without any options:

```js
const wb = XLSX.read(u8);
```

The SheetJS `write` method can generate workbooks stored in
`Uint8Array` structures with the option `type: "buffer"`:

```js
const u8 = XLSX.write(wb, {bookType: "xlsx", type: "buffer"});
```

:::note pass

In NodeJS, the `write` method will generate a `Buffer` instance.

:::


### `ArrayBuffer`

An `ArrayBuffer` represents an array of bytes. The `Uint8Array` constructor can
synchronously create a view without copying the underlying data:

```js
/* create a Uint8Array "view" */
const u8 = new Uint8Array(array_buffer);
```

The SheetJS `read` method can read data from `ArrayBuffer` without special
options, as it performs the aforementioned conversion. The SheetJS `write`
method can generate workbooks stored in `ArrayBuffer` structures with the
option `type: "array"`

### `Blob` and `File`

`Blob` is an opaque pointer to data. The data is not immediately accessible.

`File` extends `Blob` with support for storing file names and other metadata.

The SheetJS `read` method does not handle `Blob` or `File`. The underlying data
must be pulled into an `ArrayBuffer` before parsing. There are two approaches:

A) Modern browsers support the `arrayBuffer` method. It returns a promise that
resolves to `ArrayBuffer`:

```js
// usage: const wb = await blob_to_wb(blob);
async function blob_to_wb(blob) {
  const ab = await blob.arrayBuffer(); // pull data from Blob
  return XLSX.read(ab);                // parse ArrayBuffer
}
```

B) For broader browser support, the `FileReader` API can pull `ArrayBuffer` data
using the `readAsArrayBuffer` method:

```js
// usage: file_to_wb(file, function(wb) { /* wb is a workbook object */ });
function file_to_wb(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    /* e.target.result is an ArrayBuffer */
    callback(XLSX.read(e.target.result));
  };
  reader.readAsArrayBuffer(file);
}
```

<details>
  <summary><b>FileReaderSync in Web Workers</b> (click to show)</summary>

`FileReaderSync` is only available in Web Workers. It returns an `ArrayBuffer`:

```js
// assuming main thread called worker.postMessage({ file: file_object })
self.addEventListener('message', (e) => {
  /* get file object from message */
  var file = e.data.file;
  /* Read file data */
  const ab = new FileReaderSync().readAsArrayBuffer(file);
  /* Parse file */
  const wb = XLSX.read(ab);
  /* DO SOMETHING WITH wb HERE */
});
```

["User-Submitted File" example](/docs/demos/bigdata/worker#user-submitted-file)
includes a live demo.

</details>

The SheetJS `write` method can generate a `Uint8Array` which can be passed to
the `Blob` constructor:

```js
function wb_to_blob(wb, bookType) {
  /* write workbook to Uint8Array */
  const u8 = XLSX.write(wb, { bookType: bookType || "xlsx", type: "buffer" });
  /* create array of parts */
  const parts = [ u8 ]; // `Blob` constructor expects this
  /* create Blob */
  const blob = new Blob(parts, { type: "application/vnd.ms-excel" });
  return blob;
}
```

The `File` constructor accepts an additional `name` argument:

```js
function wb_to_file(wb, filename) {
  /* impute bookType from file extension */
  const ext = filename.slice(filename.lastIndexOf(".") + 1);
  /* write workbook to Uint8Array */
  const u8 = XLSX.write(wb, { bookType: ext, type: "buffer" });
  /* create array of parts */
  const parts = [ u8 ]; // `File` constructor expects this
  /* create File */
  const file = new File(parts, filename, { type: "application/vnd.ms-excel" });
  return file;
}
```

### Binary Strings

Binary strings are strings where each character code is between `0` and `255`.
This structure is generated from the `FileReader#readAsBinaryString` method.

The SheetJS `read` method supports binary strings with `type: "binary"`. The
following snippet shows how `readAsBinaryString` can be paired with SheetJS:

```js
// usage: file_bs_to_wb(file, function(wb) { /* wb is a workbook object */ });
function file_bs_to_wb(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    /* e.target.result is a binary string */
    callback(XLSX.read(e.target.result, { type: "binary" }));
  };
  reader.readAsBinaryString(file);
}
```

The SheetJS `write` method can generate binary strings using `type: "binary"`:

```js
/* write workbook to binary string */
const bstr = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
```

### Base64 Strings

Base64 strings are encoded using 64 display ASCII characters. This structure is
generated from `btoa`, the `FileReader#readAsDataURL` method, and many platform
APIs in mobile and desktop app frameworks.

The SheetJS `read` method supports Base64 strings with `type: "base64"`. The
following snippet shows how `readAsDataURL` can be paired with SheetJS:

```js
// usage: file_b64_to_wb(file, function(wb) { /* wb is a workbook object */ });
function file_b64_to_wb(file, callback) {
  var reader = new FileReader();
  reader.onload = function(e) {
    /* e.target.result is a base64 string */
    callback(XLSX.read(e.target.result, { type: "base64" }));
  };
  reader.readAsDataURL(file);
}
```

The SheetJS `write` method can generate Base64 strings using `type: "base64"`:

```js
/* write workbook to Base64 string */
const b64 = XLSX.write(wb, { bookType: "xlsx", type: "base64" });
```

### Arrays of Numbers

Some platforms represent binary data as arrays of numbers, where each number
represents one byte in the file.

The SheetJS `read` method supports arrays of unsigned bytes (where each value
is between `0` and `255`) with `type: "array"`.

:::caution Java and Signed Bytes

[Google Sheets](/docs/demos/extensions/gsheet) follows Java signed data type
conventions. Byte arrays include values from `-128` to `127`.

<details>
  <summary><b>How to Fix Signed Arrays</b> (click to show)</summary>

The unsigned value for a negative byte can be calculated with a bitwise AND
(`&`) operation against `0xFF`:

```js
const unsigned_byte = signed_byte & 0xFF;
```

For legacy platforms including [NetSuite](/docs/demos/cloud/netsuite) 2.0, the
bitwise AND assignment operator (`&=`) can rectify an array in place:

```js
/* convert a signed byte array to an unsigned byte array in place */
for(var i = 0; i < array.length; ++i) array[i] &= 0xFF;
```

For modern platforms, the `Uint8Array` constructor understands signed bytes:

```js
/* copy data into a new Uint8Array */
const u8 = new Uint8Array(array);
```

</details>

:::

## Web Browsers

:::danger pass

Not all web APIs are supported in all browsers.  For example, Firefox does not
support the "File System Access API".

Even when a browser technically supports a web API, it may be disabled in the
client browser. Some APIs do not give any feedback.

:::

:::caution pass

In insecure (HTTP) contexts, Google Chrome will block downloads by default. The
following screenshot was taken in Chrome 126.0.6478.127:

![Insecure download blocked](pathname:///files/dlblk.png)

This is a browser limitation and no pure JavaScript library can work around the
issue. See [Issue #3145](https://git.sheetjs.com/sheetjs/sheetjs/issues/3145) in
the SheetJS bug tracker for more details.

:::

### HTML5 Download Attribute

_Writing Files_

`writeFile` will attempt a download in the browser using the attribute.

```js
XLSX.writeFile(wb, "SheetJS.xlsx");
```

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

Under the hood, it creates a special URL and clicks a link. The library method
includes a few workarounds for legacy browsers

**`XLSX.writeFile(wb, "SheetJS.xlsx");`** is roughly equivalent to:

```js
/* write data -- `writeFile` infers bookType from filename but `write` cannot */
const u8 = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
/* create Blob */
const blob = new Blob([u8]);
/* create object URL */
const url = URL.createObjectURL(blob);

/* create `A` DOM element */
const a = document.createElement("a");
/* set export file name */
a.download = "SheetJS.xlsx";
/* wire up the object URL to the DOM element */
a.href = url;
/* add to the page */
document.body.appendChild(a);
/* click the link */
a.click();
/* remove the element from the page */
document.body.removeChild(a);
```

</details>

:::caution Web Workers

`XLSX.writeFile` requires DOM access and will not work in a Web Worker!

The workaround is to generate the file data from the Worker (using `XLSX.write`)
and send the data back to the main context for the actual download action.

["Creating a Local File"](/docs/demos/bigdata/worker#creating-a-local-file)
includes a live demo.

:::

#### Google Tag Manager

:::caution pass

Google Tag Manager is known to intercept and corrupt links. This issue will
manifest as UUID file names like `01234567-89ab-cdef-0123-456789abcdef` .

:::

For sites using GTM, it is recommended to patch `document.createElement` and
revert after performing the export.

<details>
  <summary><b>GTM Workaround</b> (click to show)</summary>

The workaround is to ensure new `A` elements created by `document.createElement`
have the `target` attribute set to `_blank`.

After calling `writeFile`, the old version of the method should be restored.

```js title="GTM Workaround"
/* preparation */
document.createElement2 = document.createElement;
document.createElement = function(...args) {
  if(args.length == 1 && args[0].toLowerCase() == "a") {
    const a = document.createElement2("a");
    a.target = "_blank";
    return a;
  }
  return document.createElement2.call(this, ...args);
};

/* export (XLSX.writeFile) */
XLSX.writeFile(wb, "SheetJS.xlsx");

/* cleanup */
setTimeout(() => {
  document.createElement = document.createElement2;
  delete document.createElement2;
}, 1000);
```

</details>

### File API

_Reading Files_

In the `change` event of `<input type="file">`, the event object will have a
`target` property. The `files` property of `target` is a list of `File` objects.

```js
async function handleFileAsync(e) {
  /* get first file */
  const file = e.target.files[0];
  /* get raw data */
  const data = await file.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);
  /* do something with the workbook here */
  console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
}
input_dom_element.addEventListener("change", handleFileAsync, false);
```

### HTML Drag and Drop API

_Reading Files_

The `dataTransfer` property of the `drop` event holds a list of `File` objects:

```js
/* suppress default behavior for drag and drop events */
function suppress(e) { e.stopPropagation(); e.preventDefault(); }

/* handle data from drop event */
async function handleDropAsync(e) {
  suppress(e);
  /* get first file */
  const f = e.dataTransfer.files[0];
  /* get raw data */
  const data = await f.arrayBuffer();
  /* data is an ArrayBuffer */
  const wb = XLSX.read(data);
  /* do something with the workbook here */
  console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
}

drop_dom_element.addEventListener("drop", handleDropAsync, false);
drop_dom_element.addEventListener("dragover", suppress, false);
drop_dom_element.addEventListener("dragenter", suppress, false);
```

### File System Access API

:::danger Limited Browser Support

At the time of writing, browser support was fairly limited.  Chrome introduced
the feature in version 86.  Safari did not support File System Access API.

The File System Access API is only available in secure (HTTPS) contexts.[^4]

:::

:::caution pass

When this demo was last tested, Google Chrome did not add an entry to the
"Downloads" list. Nevertheless the actual file was written correctly.

:::

:::note Tested Deployments

This browser demo was tested in the following environments:

| Browser     | Date       |
|:------------|:-----------|
| Chrome 122  | 2024-04-07 |

Some lesser-used browsers do not support File System Access API:

| Browser     | Date       |
|:------------|:-----------|
| Safari 17.4 | 2024-04-07 |
| Firefox 124 | 2024-04-07 |

:::

<details>
  <summary><b>Live Example</b> (click to show) </summary>

This live example reads a file then tries to save as XLSX. If the File System
Access API is not supported, the result will be a clear message.

```jsx live
function SheetJSRoundTripFileSystemAPI() { return window.showSaveFilePicker ? (
<button onClick={async () => {
  /* Show picker and get data */
  const [rFile] = await window.showOpenFilePicker({
    types: [{
      description: 'Spreadsheets',
      accept: { 'application/vnd.ms-excel': ['.xlsx', '.xls', '.xlsb', /*...*/] }
    }],
    excludeAcceptAllOption: true,
    multiple: false
  });
  const ab = await (await rFile.getFile()).arrayBuffer();

  /* parse */
  const wb = XLSX.read(ab);

  /* Show picker and get handle to file */
  const wFile = await window.showSaveFilePicker({
    suggestedName: "SheetJSRT.xlsx",
    types: [ { description: 'XLSX', accept: { 'application/vnd.ms-excel': ['.xlsx'] } } ]
  });
  const wstream = await wFile.createWritable();

  /* write */
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
  wstream.write(buf);

  /* close stream to commit file */
  wstream.close();

}}>Click to read then save as XLSX</button>
  ) : ( <b>This browser does not support File System Access API</b> ); }
```

</details>

_Reading Files_

`window.showOpenFilePicker` shows a file picker and resolves to an array of
file handles. When `multiple: false` is set, the array has one element.

The `getFile` method resolves to a `File` object whose data can be read with
the `arrayBuffer` method:

```js
/* Show picker and get data */
const [hFile] = await window.showOpenFilePicker({
  types: [{
    description: 'Spreadsheets',
    accept: { 'application/vnd.ms-excel': ['.xlsx', '.xls', '.xlsb', /*...*/] }
  }],
  excludeAcceptAllOption: true,
  multiple: false
});
const ab = await (await hFile.getFile()).arrayBuffer();

/* parse */
const wb = XLSX.read(ab);

/* do something with the workbook */
console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
```

_Writing Files_

`window.showSaveFilePicker` shows a file picker and resolves to a file handle.
The `createWritable` method resolves to a `FileSystemWritableFileStream`, which
readily accepts `Uint8Array` data from `XLSX.write`:

```js
/* Show picker and get handle to file */
const hFile = await window.showSaveFilePicker({
  suggestedName: "SheetJS.xlsx",
  types: [
    { description: 'Excel 2007+ (XLSX)', accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] } },
    { description: 'Excel 97-2004 (XLS)', accept: { 'application/vnd.ms-excel': ['.xls'] } },
    { description: 'Excel 2007+ Binary (XLSB)', accept: { 'application/vnd.ms-excel.sheet.binary.macroEnabled.12': ['.xlsb'] } },
    /* note that each MIME type must be unique! */
  ]
});
const wstream = await hFile.createWritable();

/* get extension */
const ext = hFile.name.slice(hFile.name.lastIndexOf(".")+1)
/* write */
wstream.write(XLSX.write(wb, { bookType: ext, type: "buffer" }))
/* close stream to commit file */
wstream.close();
```

### File and Directory Entries API

:::caution Deprecated

In the web browser, the File and Directory Entries API has been deprecated and
is not recommended for new applications.

`cordova-plugin-file` still uses the API patterns.

:::

_Writing Files_

The API is callback-based. At a high level:

1) `window.requestFileSystem` requests access to the filesystem. The callback
receives a `FileSystem` object.

2) A file is created using the `getFile` method. The callback receives a
`FileSystemFileEntry` object representing the file.

3) A writer is created using the `createWriter` method of the file object. The
callback receives a `FileWriter` object representing a file handle for writing.

4) Data is written using the `write` method of the `FileWriter` object. Unlike
the other methods, callbacks are attached to the `FileWriter` object directly.

```js
// Request File System Access
window.requestFileSystem(window.PERSISTENT, 0, (fs) => {
  // Request a handle to "SheetJS.xlsx", making a new file if necessary
  fs.root.getFile("SheetJS.xlsx", {create: true}, entry => {
    // Request a FileWriter for writing data
    entry.createWriter(writer => {
      // The FileWriter API needs an actual Blob
      const u8 = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
      const data = new Blob([u8], { type: "application/vnd.ms-excel" });
      // `onwriteend` is called on success, `onerror` called on error
      writer.onwriteend = () => {}; writer.onerror = () => {};
      // write the data
      writer.write(data);
    });
  });
});
```

### Internet Explorer

Internet Explorer offered proprietary APIs that were not adopted by Chromium.

#### Blob API

_Writing Files_

IE10 and IE11 support `navigator.msSaveBlob`. `XLSX.writeFile` will use this
method if it is available.

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

**`XLSX.writeFile(wb, "SheetJS.xlsx");`** is roughly equivalent to:

```js
/* write data -- `writeFile` infers bookType from filename but `write` cannot */
const u8 = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
/* create Blob */
const blob = new Blob([u8]);
/* call msSaveBlob */
navigator.msSaveBlob(blob, "SheetJS.xlsx");
```

</details>

#### VBScript

_Reading and Writing Files_

Internet Explorer 6-9 with VBScript support `Scripting.FileSystemObject`.  This
is not supported in modern browsers.

This approach is implemented in the library `readFile` and `writeFile` methods.
It requires the shim script to be loaded before the main library script:

```html
<!-- load the shim script first -->
<script src="shim.min.js"></script>
<!-- then load the main script -->
<script src="xlsx.full.min.js"></script>
```

## Other Platforms

### NodeJS

`fs.readFileSync` and `fs.writeFileSync` allow for reading and writing files.

When using `require`, these are supported in `readFile` and `writeFile`:

```js
var XLSX = require("xlsx");
var wb = XLSX.readFile("sheetjs.numbers");
XLSX.writeFile(wb, "sheetjs.xls");
```

[Installation](/docs/getting-started/installation/nodejs) has a special note for
use with NodeJS ECMAScript Modules:

```js
import { readFile, writeFile, set_fs } from 'xlsx';
import * as fs from 'fs';
set_fs(fs);

var wb = readFile("sheetjs.numbers");
writeFile(wb, "sheetjs.xlsx");
```

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

**`XLSX.readFile(filepath)`** is equivalent to:

_CommonJS_

```js
var fs = require("fs");
var buf = fs.readFileSync(filepath);
var wb = XLSX.read(buf);
```

_ECMAScript Modules_

```js
import { read } from "xlsx";
import { readFileSync } from "fs";

var buf = readFileSync(filepath);
var wb = read(buf);
```

**`XLSX.writeFile(wb, filepath)`** is equivalent to:

_CommonJS_

```js
var fs = require("fs"), path = require("path");
var buf = XLSX.write(wb, { bookType: path.extname(filepath).slice(1), type: "buffer" });
fs.writeFileSync(filepath, buf);
```

_ECMAScript Modules_

```js
import { write } from "xlsx";
import { writeFileSync } from "fs";
import { extname } from "path";

var buf = write(wb, { bookType: extname(filepath).slice(1), type: "buffer" });
writeFileSync(filepath, buf);
```

</details>

### ExtendScript

In Photoshop and other Adobe apps, `readFile` and `writeFile` use the `File`
object under the hood:

```js
#include "xlsx.extendscript.js"

var wb = XLSX.readFile("sheetjs.xlsx");
XLSX.writeFile(wb, "sheetjs.csv");
```

The [ExtendScript demo](/docs/demos/extensions/extendscript) also covers "Common
Extensibility Platform" (CEP) and "Unified Extensibility Platform" (UXP) details.

### Chrome Extensions

In Manifest v2 Chrome extensions, `writeFile` calls `chrome.downloads.download`.

This approach uses `URL.createObjectURL`, an API that is not supported in a
Manifest v3 Background Service Worker. For small exports, raw Base64 URLs can be
generated and downloaded.

The [Chromium demo](/docs/demos/extensions/chromium) covers the details.

### Deno

`readFile` uses `Deno.readFileSync` and `writeFile` uses `Deno.writeFileSync`:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
const wb: XLSX.WorkBook = XLSX.readFile("sheetjs.numbers");
XLSX.writeFile(wb, "sheetjs.xlsx");`}
</CodeBlock>

:::caution Deno entitlements

Any Deno script using `XLSX.readFile` requires the `--allow-read` entitlement.

Any Deno script using `XLSX.writeFile` requires the `--allow-write` entitlement.

:::

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

**`XLSX.readFile(filepath)`** is equivalent to:

_ECMAScript Modules_

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
const u8: Uint8Array = Deno.readFileSync(filepath);
const wb: XLSX.WorkBook = XLSX.read(u8);`}
</CodeBlock>

**`XLSX.writeFile(wb, filepath)`** is equivalent to:

_ECMAScript Modules_

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
const u8 = XLSX.write(wb, { bookType: filepath.slice(filepath.lastIndexOf(".")+1), type: "buffer" });
Deno.writeFileSync(filepath, u8);`}
</CodeBlock>

</details>

### Bun

Bun requires the `fs` module:

```js
import { readFile, writeFile, set_fs } from 'xlsx';
import * as fs from 'fs';
set_fs(fs);

var wb = readFile("sheetjs.numbers");
writeFile(wb, "sheetjs.xlsx");
```

The implementation is identical to [NodeJS ECMAScript Modules](#nodejs).

### Apps

Desktop and mobile apps have their own specific APIs covered in separate demos:

- [Electron and other desktop apps](/docs/demos/desktop)
- [React Native and other mobile apps](/docs/demos/mobile)

[^1]: See ["Input Type" in "Reading Files"](/docs/api/parse-options#input-type)
[^2]: See ["Supported Output Formats" type in "Writing Files"](/docs/api/write-options#supported-output-formats)
[^3]: See ["Buffers and TypedArrays"](https://nodejs.org/api/buffer.html#buffers-and-typedarrays) in the NodeJS documentation.
[^4]: See [issue 3145 in the SheetJS bug tracker](https://git.sheetjs.com/sheetjs/sheetjs/issues/3145#issuecomment-11074) for more details. Special thanks to `@sjoenH`!