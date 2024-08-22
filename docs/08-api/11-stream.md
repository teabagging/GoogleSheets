---
title: Stream Export
sidebar_position: 11
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Many platforms offer methods to write files. These methods typically expect the
entire file to be generated before writing. Large workbook files may exceed
platform-specific size limits.

Some platforms also offer a "streaming" or "incremental" approach. Instead of
writing the entire file at once, these methods can accept small chunks of data
and incrementally write to the filesystem.

The [Streaming Write](/docs/demos/bigdata/stream#streaming-write) demo includes
live browser demos and notes for platforms that do not support SheetJS streams.

:::tip pass

This feature was expanded in version `0.20.3`. It is strongly recommended to
[upgrade to the latest version](/docs/getting-started/installation/).

:::

## Streaming Basics

SheetJS streams use the NodeJS push streams API. It is strongly recommended to
review the official NodeJS "Stream" documentation[^1].

<details>
  <summary><b>Historical Note</b> (click to show)</summary>

NodeJS push streams were introduced in 2012. The text streaming methods `to_csv`
and `to_html` are supported in NodeJS v0.10 and later while the object streaming
method `to_json` is supported in NodeJS v0.12 and later.

The first SheetJS streaming write function, `to_csv`, was introduced in 2017. It
used and still uses the battle-tested NodeJS streaming API.

Years later, browser vendors opted to standardize a different stream API.

For maximal compatibility, the library uses NodeJS push streams.

</details>

#### NodeJS ECMAScript Module Support

In CommonJS modules, libraries can load the `stream` module using `require`.
SheetJS libraries will load streaming support where applicable.

Due to ESM limitations, libraries cannot freely import the `stream` module.

:::danger ECMAScript Module Limitations

The original specification only supported top-level imports:

```js
import { Readable } from 'stream';
```

If a module is unavailable, there is no way for scripts to gracefully fail or
ignore the error.

---

Patches to the specification added two different solutions to the problem:

- "dynamic imports" will throw errors that can be handled by libraries. Dynamic
imports will taint APIs that do not use Promise-based methods.

```js
/* Readable will be undefined if stream cannot be imported */
const Readable = await (async() => {
  try {
    return (await import("stream"))?.Readable;
  } catch(e) { /* silently ignore error */ }
})();
```

- "import maps" control module resolution, allowing library users to manually
shunt unsupported modules.

**These patches were released after browsers adopted ESM!** A number of browsers
and other platforms support top-level imports but do not support the patches.

---

**Due to ESM woes, it is strongly recommended to use CommonJS when possible!**

:::

For maximal platform support, SheetJS libraries expose a special `set_readable`
method to provide a `Readable` implementation:

```js title="SheetJS NodeJS ESM streaming support"
import { stream as SheetJStream } from 'xlsx';
import { Readable } from 'stream';

SheetJStream.set_readable(Readable);
```

## Worksheet Export

The worksheet export methods accept a SheetJS worksheet object.

### CSV Export

**Export worksheet data in "Comma-Separated Values" (CSV)**

```js
var csvstream = XLSX.stream.to_csv(ws, opts);
```

`to_csv` creates a NodeJS text stream. The options mirror the non-streaming
[`sheet_to_csv`](/docs/api/utilities/csv#delimiter-separated-output) method.

The following NodeJS script fetches https://docs.sheetjs.com/pres.numbers and
streams CSV rows to the terminal.

<Tabs groupId="mod">
  <TabItem value="cjs" label="CommonJS">

```js title="Streaming CSV Print Example"
const XLSX = require("xlsx");

(async() => {
  var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
  var wb = XLSX.read(ab);
  var ws = wb.Sheets[wb.SheetNames[0]];
  XLSX.stream.to_csv(ws).pipe(process.stdout);
})();
```

  </TabItem>
  <TabItem value="esm" label="ESM">

```js title="Streaming CSV Print Example"
import { read, stream } from "xlsx";
import { Readable } from "stream";
stream.set_readable(Readable);

var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
var wb = read(ab);
var ws = wb.Sheets[wb.SheetNames[0]];
stream.to_csv(ws).pipe(process.stdout);
```

  </TabItem>
</Tabs>

### JSON Export

**Export worksheet data to "Arrays of Arrays" or "Arrays of Objects"**

```js
var jsonstream = XLSX.stream.to_json(ws, opts);
```

`to_json` creates a NodeJS object stream. The options mirror the non-streaming
[`sheet_to_json`](/docs/api/utilities/array#array-output) method.

The following NodeJS script fetches https://docs.sheetjs.com/pres.numbers and
streams JSON rows to the terminal. A `Transform`[^2] stream generates text from
the object streams.

<Tabs groupId="mod">
  <TabItem value="cjs" label="CommonJS">

```js title="Streaming Objects Print Example"
const XLSX = require("xlsx")
const { Transform } = require("stream");

/* this Transform stream converts JS objects to text */
var conv = new Transform({writableObjectMode:true});
conv._transform = function(obj, e, cb){ cb(null, JSON.stringify(obj) + "\n"); };

(async() => {
  var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
  var wb = XLSX.read(ab);
  var ws = wb.Sheets[wb.SheetNames[0]];
  XLSX.stream.to_json(ws, {raw: true}).pipe(conv).pipe(process.stdout);
})();
```

  </TabItem>
  <TabItem value="esm" label="ESM">

```js title="Streaming Objects Print Example"
import { read, stream } from "xlsx";
import { Readable, Transform } from "stream";
stream.set_readable(Readable);

/* this Transform stream converts JS objects to text */
var conv = new Transform({writableObjectMode:true});
conv._transform = function(obj, e, cb){ cb(null, JSON.stringify(obj) + "\n"); };

var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
var wb = read(ab);
var ws = wb.Sheets[wb.SheetNames[0]];
stream.to_json(ws, {raw: true}).pipe(conv).pipe(process.stdout);
```

  </TabItem>
</Tabs>

### HTML Export

**Export worksheet data to HTML TABLE**

```js
var htmlstream = XLSX.stream.to_html(ws, opts);
```

`to_html` creates a NodeJS text stream. The options mirror the non-streaming
[`sheet_to_html`](/docs/api/utilities/html#html-table-output) method.

The following NodeJS script fetches https://docs.sheetjs.com/pres.numbers and
streams HTML TABLE rows to the terminal.

<Tabs groupId="mod">
  <TabItem value="cjs" label="CommonJS">

```js title="Streaming HTML Print Example"
const XLSX = require("xlsx");

(async() => {
  var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
  var wb = XLSX.read(ab);
  var ws = wb.Sheets[wb.SheetNames[0]];
  XLSX.stream.to_html(ws).pipe(process.stdout);
})();
```

  </TabItem>
  <TabItem value="esm" label="ESM">

```js title="Streaming HTML Print Example"
import { read, stream } from "xlsx";
import { Readable } from "stream";
stream.set_readable(Readable);

var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
var wb = read(ab);
var ws = wb.Sheets[wb.SheetNames[0]];
stream.to_html(ws).pipe(process.stdout);
```

  </TabItem>
</Tabs>

## Workbook Export

The workbook export methods accept a SheetJS workbook object.

### XLML Export

**Export workbook data to SpreadsheetML2003 XML files**

```js
var xlmlstream = XLSX.stream.to_xlml(wb, opts);
```

`to_xlml` creates a NodeJS text stream. The options mirror the non-streaming
[`write`](/docs/api/write-options) method using the `xlml` book type.

The following NodeJS script fetches https://docs.sheetjs.com/pres.numbers and
writes a SpreadsheetML2003 workbook to `SheetJStream.xml.xls`:

<Tabs groupId="mod">
  <TabItem value="cjs" label="CommonJS">

```js title="Streaming XLML Write Example"
const XLSX = require("xlsx"), fs = require("fs");

(async() => {
  var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
  var wb = XLSX.read(ab);
  XLSX.stream.to_xlml(wb).pipe(fs.createWriteStream("SheetJStream.xml.xls"));
})();
```

  </TabItem>
  <TabItem value="esm" label="ESM">

```js title="Streaming XLML Write Example"
import { read, stream } from "xlsx";
import { Readable } from "stream";
stream.set_readable(Readable);
import { createWriteStream } from "fs";

var ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer()
var wb = read(ab);
stream.to_xlml(wb).pipe(createWriteStream("SheetJStream.xml.xls"));
```

  </TabItem>
</Tabs>

[^1]: See ["Stream"](https://nodejs.org/api/stream.html) in the NodeJS documentation.
[^2]: See [`Transform`](https://nodejs.org/api/stream.html#class-streamtransform) in the NodeJS documentation.
