---
title: Large Datasets
pagination_prev: demos/extensions/index
pagination_next: demos/engines/index
sidebar_custom_props:
  summary: Dense Mode + Incremental CSV / HTML / JSON / XLML Export
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

For maximal compatibility, SheetJS API functions read entire files into memory
and write files in memory. Browsers and other JS engines enforce tight memory
limits. The library offers alternate strategies to optimize for memory usage.

## Dense Mode

[Dense mode worksheets](/docs/csf/sheet#dense-mode), which store cells in arrays
of arrays, are designed to work around Google Chrome performance regressions.
For backwards compatibility, dense mode worksheets are not created by default.

`read`, `readFile` and `aoa_to_sheet` accept the `dense` option. When enabled,
the methods create worksheet objects that store cells in arrays of arrays:

```js
var dense_wb = XLSX.read(ab, {dense: true});

var dense_sheet = XLSX.utils.aoa_to_sheet(aoa, {dense: true});
```

<details>
  <summary><b>Historical Note</b> (click to show)</summary>

The earliest versions of the library aimed for IE6+ compatibility.  In early
testing, both in Chrome 26 and in IE6, the most efficient worksheet storage for
small sheets was a large object whose keys were cell addresses.

Over time, V8 (the engine behind Chrome and NodeJS) evolved in a way that made
the array of arrays approach more efficient but reduced the performance of the
large object approach.

In the interest of preserving backwards compatibility, the library opts to make
the array of arrays approach available behind a special `dense` option.

</details>

The various API functions will seamlessly handle dense and sparse worksheets.

## Streaming Write

The streaming write functions are available in the `XLSX.stream` object.  They
take the same arguments as the normal write functions:

- `XLSX.stream.to_csv` is the streaming version of `XLSX.utils.sheet_to_csv`.
- `XLSX.stream.to_html` is the streaming version of `XLSX.utils.sheet_to_html`.
- `XLSX.stream.to_json` is the streaming version of `XLSX.utils.sheet_to_json`.
- `XLSX.stream.to_xlml` is the streaming SpreadsheetML2003 workbook writer.

These functions are covered in the ["Stream Export"](/docs/api/stream) section.

:::tip pass

This feature was expanded in version `0.20.3`. It is strongly recommended to
[upgrade to the latest version](/docs/getting-started/installation/).

:::



### NodeJS

In a CommonJS context, NodeJS Streams and `fs` immediately work with SheetJS:

```js
const XLSX = require("xlsx"); // "just works"
```

:::danger ECMAScript Module Machinations

In NodeJS ESM, the dependency must be loaded manually:

```js
import * as XLSX from 'xlsx';
import { Readable } from 'stream';

XLSX.stream.set_readable(Readable); // manually load stream helpers
```

Additionally, for file-related operations in NodeJS ESM, `fs` must be loaded:

```js
import * as XLSX from 'xlsx';
import * as fs from 'fs';

XLSX.set_fs(fs); // manually load fs helpers
```

**It is strongly encouraged to use CommonJS in NodeJS whenever possible.**

:::

#### Text Streams

`to_csv`, `to_html`, and `to_xlml` emit strings. The data can be directly pushed
to a `Writable` stream. `fs.createWriteStream`[^1] is the recommended approach
for streaming to a file in NodeJS.

This example reads a worksheet passed as an argument to the script, pulls the
first worksheet, converts to CSV and writes to `SheetJSNodeJStream.csv`:

```js
var XLSX = require("xlsx"), fs = require("fs");

/* read file */
var wb = XLSX.readFile(process.argv[2]), {dense: true};

/* get first worksheet */
var ws = wb.Sheets[wb.SheetNames[0]];

/* create CSV stream */
var csvstream = XLSX.stream.to_csv(ws);

/* create output stream */
var ostream = fs.createWriteStream("SheetJSNodeJStream.csv");

/* write data from CSV stream to output file */
// highlight-next-line
csvstream.pipe(ostream);
```

#### Object Streams

`to_json` uses Object-mode streams[^2]. A `Transform` stream[^3] can be used to
generate a text stream for streaming to a file or the screen.

The following example prints data by writing to the `process.stdout` stream:

```js
var XLSX = require("xlsx"), Transform = require("stream").Transform;

/* read file */
var wb = XLSX.readFile(process.argv[2], {dense: true});

/* get first worksheet */
var ws = wb.Sheets[wb.SheetNames[0]];

/* this Transform stream converts JS objects to text */
var conv = new Transform({writableObjectMode:true});
conv._transform = function(obj, e, cb){ cb(null, JSON.stringify(obj) + "\n"); };

/* pipe `to_json` -> transformer -> standard output */
// highlight-next-line
XLSX.stream.to_json(ws, {raw: true}).pipe(conv).pipe(process.stdout);
```

#### BunJS

BunJS is directly compatible with NodeJS streams.

:::caution Bun support is considered experimental.

Great open source software grows with user tests and reports. Any issues should
be reported to the Bun project for further diagnosis.

:::

#### NodeJS Demo

:::note Tested Deployments

This demo was tested in the following deployments:

| Node Version | Date       | Node Status when tested |
|:-------------|:-----------|:------------------------|
| `0.12.18`    | 2024-07-18 | End-of-Life             |
| `4.9.1`      | 2024-07-18 | End-of-Life             |
| `6.17.1`     | 2024-07-18 | End-of-Life             |
| `8.17.0`     | 2024-07-18 | End-of-Life             |
| `10.24.1`    | 2024-07-18 | End-of-Life             |
| `12.22.12`   | 2024-07-18 | End-of-Life             |
| `14.21.3`    | 2024-07-18 | End-of-Life             |
| `16.20.2`    | 2024-07-18 | End-of-Life             |
| `18.20.4`    | 2024-07-18 | Maintenance LTS         |
| `20.15.1`    | 2024-07-18 | Active LTS              |
| `22.5.0`     | 2024-07-18 | Current                 |

While streaming methods work in End-of-Life versions of NodeJS, production
deployments should upgrade to a Current or LTS version of NodeJS.

This demo was also tested against BunJS `1.1.18` on 2024-07-18.

:::

1) Install the [NodeJS module](/docs/getting-started/installation/nodejs)

<Tabs groupId="plat">
  <TabItem value="node" label="NodeJS">

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

  </TabItem>
  <TabItem value="bun" label="BunJS">

<CodeBlock language="bash">{`\
bun i --save xlsx@https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

  </TabItem>
</Tabs>

2) Download [`SheetJSNodeJStream.js`](pathname:///stream/SheetJSNodeJStream.js):

```bash
curl -LO https://docs.sheetjs.com/stream/SheetJSNodeJStream.js
```

3) Download [the test file](https://docs.sheetjs.com/pres.xlsx):

```bash
curl -LO https://docs.sheetjs.com/pres.xlsx
```

4) Run the script:

<Tabs groupId="plat">
  <TabItem value="node" label="NodeJS">

```bash
node SheetJSNodeJStream.js pres.xlsx
```

  </TabItem>
  <TabItem value="bun" label="BunJS">

```bash
bun SheetJSNodeJStream.js pres.xlsx
```

  </TabItem>
</Tabs>

<details>
  <summary><b>Expected Output</b> (click to show)</summary>

The console will display a list of objects:

```json
{"Name":"Bill Clinton","Index":42}
{"Name":"GeorgeW Bush","Index":43}
{"Name":"Barack Obama","Index":44}
{"Name":"Donald Trump","Index":45}
{"Name":"Joseph Biden","Index":46}
```

The script will also generate `SheetJSNodeJStream.csv`:

```csv
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46
```

</details>

### Browser

:::note Tested Deployments

Each browser demo was tested in the following environments:

| Browser     | Date       |
|:------------|:-----------|
| Chrome 126  | 2024-07-18 |
| Safari 17.4 | 2024-07-18 |

:::

NodeJS streaming APIs are not available in the browser.  The following function
supplies a pseudo stream object compatible with the `to_csv` function:

```js
function sheet_to_csv_cb(ws, cb, opts, batch = 1000) {
  XLSX.stream.set_readable(() => ({
    __done: false,
    // this function will be assigned by the SheetJS stream methods
    _read: function() { this.__done = true; },
    // this function is called by the stream methods
    push: function(d) { if(!this.__done) cb(d); if(d == null) this.__done = true; },
    resume: function pump() { for(var i = 0; i < batch && !this.__done; ++i) this._read(); if(!this.__done) setTimeout(pump.bind(this), 0); }
  }));
  return XLSX.stream.to_csv(ws, opts);
}

// assuming `workbook` is a workbook, stream the first sheet
const ws = workbook.Sheets[workbook.SheetNames[0]];
const strm = sheet_to_csv_cb(ws, (csv)=>{ if(csv != null) console.log(csv); });
strm.resume();
```

#### Web Workers

For processing large files in the browser, it is strongly encouraged to use Web
Workers. The [Worker demo](/docs/demos/bigdata/worker#streaming-write) includes
examples using the File System Access API.

<details>
  <summary><b>Web Worker Details</b> (click to show)</summary>

Typically, the file and stream processing occurs in the Web Worker.  CSV rows
can be sent back to the main thread in the callback:

<CodeBlock language="js" title="worker.js">{`\
/* load standalone script from CDN */
importScripts("https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js");
\n\
function sheet_to_csv_cb(ws, cb, opts, batch = 1000) {
  XLSX.stream.set_readable(() => ({
    __done: false,
    // this function will be assigned by the SheetJS stream methods
    _read: function() { this.__done = true; },
    // this function is called by the stream methods
    push: function(d) { if(!this.__done) cb(d); if(d == null) this.__done = true; },
    resume: function pump() { for(var i = 0; i < batch && !this.__done; ++i) this._read(); if(!this.__done) setTimeout(pump.bind(this), 0); }
  }));
  return XLSX.stream.to_csv(ws, opts);
}
\n\
/* this callback will run once the main context sends a message */
self.addEventListener('message', async(e) => {
  try {
    postMessage({state: "fetching " + e.data.url});
    /* Fetch file */
    const res = await fetch(e.data.url);
    const ab = await res.arrayBuffer();
\n\
    /* Parse file */
    postMessage({state: "parsing"});
    const wb = XLSX.read(ab, {dense: true});
    const ws = wb.Sheets[wb.SheetNames[0]];
\n\
    /* Generate CSV rows */
    postMessage({state: "csv"});
    const strm = sheet_to_csv_cb(ws, (csv) => {
      if(csv != null) postMessage({csv});
      else postMessage({state: "done"});
    });
    strm.resume();
  } catch(e) {
    /* Pass the error message back */
    postMessage({error: String(e.message || e) });
  }
}, false);`}
</CodeBlock>

The main thread will receive messages with CSV rows for further processing:

```js title="main.js"
worker.onmessage = function(e) {
  if(e.data.error) { console.error(e.data.error); /* show an error message */ }
  else if(e.data.state) { console.info(e.data.state); /* current state */ }
  else {
    /* e.data.csv is the row generated by the stream */
    console.log(e.data.csv);
  }
};
```

</details>

### Live Demo

The following live demo fetches and parses a file in a Web Worker.  The `to_csv`
streaming function is used to generate CSV rows and pass back to the main thread
for further processing.

:::note pass

For Chromium browsers, the File System Access API provides a modern worker-only
approach. [The Web Workers demo](/docs/demos/bigdata/worker#streaming-write)
includes a live example of CSV streaming write.

:::

The demo has a URL input box.  Feel free to change the URL.  For example,

`https://raw.githubusercontent.com/SheetJS/test_files/master/large_strings.xls`
is an XLS file over 50 MB

`https://raw.githubusercontent.com/SheetJS/libreoffice_test-files/master/calc/xlsx-import/perf/8-by-300000-cells.xlsx`
is an XLSX file with 300000 rows (approximately 20 MB)

<CodeBlock language="jsx" live>{`\
function SheetJSFetchCSVStreamWorker() {
  const [__html, setHTML] = React.useState("");
  const [state, setState] = React.useState("");
  const [cnt, setCnt] = React.useState(0);
  const [url, setUrl] = React.useState("https://docs.sheetjs.com/test_files/large_strings.xlsx");
\n\
  return ( <>
    <b>URL: </b><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} size="80"/>
    <button onClick={() => {
      /* this mantra embeds the worker source in the function */
      const worker = new Worker(URL.createObjectURL(new Blob([\`\\
/* load standalone script from CDN */
importScripts("https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js");
\n\
function sheet_to_csv_cb(ws, cb, opts, batch = 1000) {
  XLSX.stream.set_readable(() => ({
    __done: false,
    // this function will be assigned by the SheetJS stream methods
    _read: function() { this.__done = true; },
    // this function is called by the stream methods
    push: function(d) { if(!this.__done) cb(d); if(d == null) this.__done = true; },
    resume: function pump() { for(var i = 0; i < batch && !this.__done; ++i) this._read(); if(!this.__done) setTimeout(pump.bind(this), 0); }
  }));
  return XLSX.stream.to_csv(ws, opts);
}
\n\
/* this callback will run once the main context sends a message */
self.addEventListener('message', async(e) => {
  try {
    postMessage({state: "fetching " + e.data.url});
    /* Fetch file */
    const res = await fetch(e.data.url);
    const ab = await res.arrayBuffer();
\n\
    /* Parse file */
    let len = ab.byteLength;
    if(len < 1024) len += " bytes"; else { len /= 1024;
      if(len < 1024) len += " KB"; else { len /= 1024; len += " MB"; }
    }
    postMessage({state: "parsing " + len});
    const wb = XLSX.read(ab, {dense: true});
    const ws = wb.Sheets[wb.SheetNames[0]];
\n\
    /* Generate CSV rows */
    postMessage({state: "csv"});
    const strm = sheet_to_csv_cb(ws, (csv) => {
      if(csv != null) postMessage({csv});
      else postMessage({state: "done"});
    });
    strm.resume();
  } catch(e) {
    /* Pass the error message back */
    postMessage({error: String(e.message || e) });
  }
}, false);
      \`])));
      /* when the worker sends back data, add it to the DOM */
      worker.onmessage = function(e) {
        if(e.data.error) return setHTML(e.data.error);
        else if(e.data.state) return setState(e.data.state);
        setHTML(e.data.csv);
        setCnt(cnt => cnt+1);
      };
      setCnt(0); setState("");
      /* post a message to the worker with the URL to fetch */
      worker.postMessage({url});
    }}><b>Click to Start</b></button>
    <pre>State: <b>{state}</b><br/>Number of rows: <b>{cnt}</b></pre>
    <pre dangerouslySetInnerHTML={{ __html }}/>
  </> );
}`}
</CodeBlock>

### Deno

Deno does not support NodeJS streams in normal execution, so a wrapper is used:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import { stream } from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
/* Callback invoked on each row (string) and at the end (null) */
const csv_cb = (d:string|null) => {
  if(d == null) return;
  /* The strings include line endings, so raw write ops should be used */
  Deno.stdout.write(new TextEncoder().encode(d));
};
\n\
/* Prepare \`Readable\` function */
const Readable = () => ({
  __done: false,
  // this function will be assigned by the SheetJS stream methods
  _read: function() { this.__done = true; },
  // this function is called by the stream methods
  push: function(d: any) {
    if(!this.__done) csv_cb(d);
    if(d == null) this.__done = true;
  },
  resume: function pump() {
    for(var i = 0; i < 1000 && !this.__done; ++i) this._read();
    if(!this.__done) setTimeout(pump.bind(this), 0);
  }
})
/* Wire up */
stream.set_readable(Readable);
\n\
/* assuming \`workbook\` is a workbook, stream the first sheet */
const ws = workbook.Sheets[workbook.SheetNames[0]];
stream.to_csv(wb.Sheets[wb.SheetNames[0]]).resume();`}
</CodeBlock>

:::note Tested Deployments

This demo was last tested on 2024-07-18 against Deno `1.45.2`.

:::

[`SheetJSDenoStream.ts`](pathname:///stream/SheetJSDenoStream.ts) is a small
example script that downloads https://docs.sheetjs.com/pres.numbers and prints
CSV row objects.

1) Run the script:

```bash
deno run -A https://docs.sheetjs.com/stream/SheetJSDenoStream.ts
```

This script will fetch [`pres.numbers`](https://docs.sheetjs.com/pres.numbers) and
generate CSV rows. The result will be printed to the terminal window.

[^1]: See [`fs.createWriteStream`](https://nodejs.org/api/fs.html#fscreatewritestreampath-options) in the NodeJS documentation.
[^2]: See ["Object mode"](https://nodejs.org/api/stream.html#object-mode) in the NodeJS documentation.
[^3]: See [`Transform`](https://nodejs.org/api/stream.html#class-streamtransform) in the NodeJS documentation.
