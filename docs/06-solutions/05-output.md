---
title: Data Export
sidebar_position: 5
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

:::tip pass

The ["Export Tutorial"](/docs/getting-started/examples/export) is a gentle
introduction to data processing and export.

:::

## Writing Workbooks

### API

_Generate spreadsheet bytes (file) from data_

```js
var data = XLSX.write(workbook, opts);
```

The `write` method attempts to package data from the workbook into a file in
memory.  By default, XLSX files are generated, but that can be controlled with
the `bookType` property of the `opts` argument.  Based on the `type` option,
the data can be stored as a "binary string", JS string, `Uint8Array` or Buffer.

The second `opts` argument is required.  ["Writing Options"](/docs/api/write-options)
covers the supported properties and behaviors.

_Generate and attempt to save file_

```js
XLSX.writeFile(workbook, filename, opts);
```

The `writeFile` method packages the data and attempts to save the new file.  The
export file format is determined by the extension of `filename` (`SheetJS.xlsx`
signals XLSX export, `SheetJS.xlsb` signals XLSB export, etc).

The second `opts` argument is optional.  ["Writing Options"](/docs/api/write-options)
covers the supported properties and behaviors.

_Generate and attempt to save an XLSX file_

```js
XLSX.writeFileXLSX(workbook, filename, opts);
```

The `writeFile` method embeds a number of different export functions.  This is
great for developer experience but not amenable to tree shaking using the
current developer tools.  When only XLSX exports are needed, this method avoids
referencing the other export functions.

The second `opts` argument is optional.  ["Writing Options"](/docs/api/write-options)
covers the supported properties and behaviors.

:::note pass

The `writeFile` and `writeFileXLSX` methods uses platform-specific APIs to save
files. The APIs do not generally provide feedback on whether files were created.

:::

#### Examples

Here are a few common scenarios (click on each subtitle to see the code).

The [demos](/docs/demos) cover special deployments in more detail.

### Example: Local File

`XLSX.writeFile` supports writing local files in platforms like NodeJS. In other
platforms like React Native, `XLSX.write` should be called with file data.

<Tabs>
  <TabItem value="browser" label="Browser">

`XLSX.writeFile` wraps a few techniques for triggering a file save:

- `URL` browser API creates an object URL for the file, which the library uses
  by creating a link and forcing a click. It is supported in modern browsers.
- `msSaveBlob` is an IE10+ API for triggering a file save.
- `IE_FileSave` uses VBScript and ActiveX to write a file in IE6+ for Windows
  XP and Windows 7.  The shim must be included in the containing HTML page.

There is no standard way to determine if the actual file has been downloaded.

```js
/* output format determined by filename */
XLSX.writeFile(workbook, "out.xlsb");
/* at this point, out.xlsb will have been downloaded */
```

:::caution Web Workers

None of the file writing APIs work from Web Workers.  To generate a file:

1) use `XLSX.write` with type `array` to generate a `Uint8Array`:

```js
// in the web worker, generate the XLSX file as a Uint8Array
const u8 = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
```

2) send the data back to the main thread:

```js
// in the web worker, send the generated data back to the main thread
postMessage({t: "export", v: u8 });
```

3) from the main thread, add an event listener to write to file:

```js
// in the main page
worker.addEventListener('message', function(e) {
  if(e && e.data && e.data.t == "export") {
    e.stopPropagation();
    e.preventDefault();
    // data will be the Uint8Array from the worker
    const data = e.data.v;

    var blob = new Blob([data], {type:"application/octet-stream"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.download = "SheetJSXPort.xlsx";
    a.href = url;
    document.body.appendChild(a);
    a.click();
  }
});
```

:::

<details>
  <summary><b>SWF workaround for Windows 95+</b> (click to show)</summary>

:::danger pass

Each moving part in this solution has been deprecated years ago:

- Adobe stopped supporting Flash Player at the end of 2020
- Microsoft stopped supporting IE8 in 2019 and stopped supporting IE9 in 2020
- `Downloadify` support ended in 2010 and `SWFObject` support ended in 2016

New projects should strongly consider requiring modern browsers.  This info is
provided on an "as is" basis and there is no realistic way to provide support
given that every related vendor stopped providing support for their software.

:::

`XLSX.writeFile` techniques work for most modern browsers as well as older IE.
For much older browsers, there are workarounds implemented by wrapper libraries.

[`Downloadify`](/docs/demos/frontend/legacy#download-strategies) uses a Flash SWF button
to generate local files, suitable for environments where ActiveX is unavailable:

```js
Downloadify.create(id,{
  /* other options are required! read the downloadify docs for more info */
  filename: "test.xlsx",
  data: function() { return XLSX.write(wb, {bookType:"xlsx", type:"base64"}); },
  append: false,
  dataType: "base64"
});
```

The [`oldie` demo](/docs/demos/frontend/legacy#internet-explorer) shows an IE-compatible fallback scenario.

</details>

  </TabItem>
  <TabItem value="nodejs" label="NodeJS">

`writeFile` uses `fs.writeFileSync` under the hood:

```js
var XLSX = require("xlsx");

/* output format determined by filename */
XLSX.writeFile(workbook, "out.xlsb");
```

For Node ESM, `fs` must be loaded manually:

```js
import * as fs from "fs";
import { writeFile, set_fs } from "xlsx";
set_fs(fs);

/* output format determined by filename */
writeFile(workbook, "out.xlsb");
```

  </TabItem>
  <TabItem value="bun" label="Bun">

As with Node ESM, `fs` must be loaded manually:

```js
import * as fs from "fs";
import { writeFile, set_fs } from "xlsx";
set_fs(fs);

/* output format determined by filename */
writeFile(workbook, "out.xlsb");
```

  </TabItem>
  <TabItem value="deno" label="Deno">

`writeFile` uses `Deno.writeFileSync` under the hood:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
XLSX.writeFile(workbook, "test.xlsx");`}
</CodeBlock>

:::note pass

Applications writing files must be invoked with the `--allow-write` flag.

:::

  </TabItem>
  <TabItem value="electron" label="Electron">

`writeFile` can be used in the renderer process:

```js
/* From the renderer process */
var XLSX = require("xlsx");

XLSX.writeFile(workbook, "out.xlsb");
```

Electron APIs have changed over time.  The [`electron` demo](/docs/demos/desktop/electron)
shows a complete example and details the required version-specific settings.

  </TabItem>
  <TabItem value="reactnative" label="React Native">

[The React Native Demo](/docs/demos/mobile/reactnative#rn-file-plugins) covers tested plugins.

  </TabItem>
  <TabItem value="extendscript" label="Photoshop">

`writeFile` wraps the `File` logic in Photoshop and other ExtendScript targets.
The specified path should be an absolute path:

```js
#include "xlsx.extendscript.js"

/* Ask user to select path */
var thisFile = File.saveDialog("Select an output file", "*.xlsx;*.xls");
/* output format determined by filename */
XLSX.writeFile(workbook, thisFile.absoluteURI);
```

The [`extendscript` demo](/docs/demos/extensions/extendscript) includes complete
examples for Photoshop and InDesign.

  </TabItem>
  <TabItem value="headless" label="Headless">

The [`headless` demo](/docs/demos/net/headless) includes complete
examples of converting HTML TABLE elements to XLSB workbooks using Puppeteer
and other headless automation tools.

Headless browsers may not have access to the filesystem, so `XLSX.writeFile`
may fail.  It is strongly recommended to generate the file bytes in the browser
context, send the bytes to the automation context, and write from automation.

Puppeteer and Playwright are NodeJS modules that support binary strings:

```js
/* from the browser context */
var bin = XLSX.write(workbook, { type:"binary", bookType: "xlsb" });

/* from the automation context */
fs.writeFileSync("SheetJSansHead.xlsb", bin, { encoding: "binary" });
```

PhantomJS `fs.write` supports writing files from the main process.  The mode
`wb` supports binary strings:

```js
/* from the browser context */
var bin = XLSX.write(workbook, { type:"binary", bookType: "xlsb" });

/* from the automation context */
fs.write("SheetJSansHead.xlsb", bin, "wb");
```

  </TabItem>
</Tabs>


### Example: Server Responses

This example focuses on responses to network requests in a server-side platform
like NodeJS. While files can be generated in the web browser, server-side file
generation allows for exact audit trails and has better mobile user support.

:::caution pass

Production deployments should use a server framework like ExpressJS.  These
snippets use low-level APIs for illustration purposes.

:::

The `Content-Type` header should be set to `application/vnd.ms-excel` for Excel
exports including XLSX. The default `application/octet-stream` can be used, but
iOS will not automatically suggest to open files in Numbers or Excel for iOS

The `Content-Disposition` header instructs browsers to download the response
into a file.  The header can also include the desired file name.

<Tabs>
  <TabItem value="nodejs" label="NodeJS">

NodeJS `http.ServerResponse#end` can accept `Buffer` objects. `XLSX.write` with
`buffer` type returns `Buffer` objects.

```js
/* generate Buffer */
const buf = XLSX.write(wb, { type:"buffer", bookType:"xlsx" });

/* prepare response headers */
res.statusCode = 200;
res.setHeader('Content-Disposition', 'attachment; filename="SheetJSNode.xlsx"');
res.setHeader('Content-Type', 'application/vnd.ms-excel');
res.end(buf);
```

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

Install the library with

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

Save the following script to `node.js` and run with `node node.js`:

```js title="node.js"
const http = require('http');
const XLSX = require('xlsx');

const hostname = '127.0.0.1';
const port = 7262;

/* fixed sample worksheet */
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
  ["a","b","c"], [1,2,3]
]), "Sheet1");

const server = http.createServer((req, res) => {
  const buf = XLSX.write(wb, { type:"buffer", bookType:"xlsx" });
  res.statusCode = 200;
  res.setHeader('Content-Disposition', 'attachment; filename="SheetJSNode.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.ms-excel');
  res.end(buf);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

</details>

  </TabItem>
  <TabItem value="deno" label="Deno">

Deno responses are expected to be `Response` objects. `XLSX.write` with `buffer`
type returns `Uint8Array` objects that can be used in the `Response`.

```js
/* generate Buffer */
const buf = XLSX.write(wb, { type:"buffer", bookType:"xlsx" });
/* return Response */
evt.respondWith(new Response(buf, {
  status: 200,
  headers: {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": 'attachment; filename="SheetJSDeno.xlsx"'
  }
}));
```

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

Save the following script to `deno.ts` and run with `deno run -A deno.ts`.  Open
a web browser and access `http://localhost:7262/` to download the workbook.

<CodeBlock language="ts" title="deno.ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
  ["a","b","c"], [1,2,3]
]), "Sheet1");
\n\
async function doNotAwaitThis(conn: Deno.Conn) {
  for await (const e of Deno.serveHttp(conn)) e.respondWith(new Response(
    XLSX.write(wb, {type:"buffer", bookType:"xlsx"}),
    {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": 'attachment; filename="SheetJSDeno.xlsx"'
      }
    }
  ));
}
\n\
/* standard Deno web server */
const server = Deno.listen({ port: 7262 });
console.log(\`HTTP webserver running.  Access it at:  http://localhost:7262/\`);
for await (const conn of server) doNotAwaitThis(conn);`}
</CodeBlock>

</details>

  </TabItem>
  <TabItem value="bun" label="Bun">

Bun responses are expected to be `Response` objects. `XLSX.write` with `buffer`
type returns `Buffer` objects that can be used in the `Response` constructor.

```js
/* generate Buffer */
const buf = XLSX.write(wb, { type:"buffer", bookType:"xlsx" });
/* return Response */
return new Response(buf, {
  headers: {
    "Content-Type": "application/vnd.ms-excel",
    "Content-Disposition": 'attachment; filename="SheetJSBun.xlsx"'
  }
});
```

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

<p>Download <a href={`https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs`}><code>xlsx.mjs</code></a>.
Save the following script to <code>bun.js</code> and run with <code>bun bun.js</code>.   Open a web
browser and access <code>http://localhost:7262/</code> to download the exported workbook.</p>

```js title="bun.js"
import * as XLSX from "./xlsx.mjs";

/* fixed sample worksheet */
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([
  ["a","b","c"], [1,2,3]
]), "Sheet1");

export default {
  port: 7262,
  fetch(request) {
    /* generate Buffer */
    const buf = XLSX.write(wb, {type:"buffer", bookType:"xlsx"});
    /* return Response */
    return new Response(buf, {
      headers: {
        "Content-Type": "application/vnd.ms-excel",
        "Content-Disposition": 'attachment; filename="SheetJSBun.xlsx"'
      }
    });
  },
};
```

</details>

  </TabItem>
</Tabs>


### Example: Remote File

This example focuses on uploading files ("Ajax" in browser parlance) using APIs
like `XMLHttpRequest` and `fetch` as well as third-party libraries.

<Tabs>
  <TabItem value="browser" label="Browser">

:::caution pass

Some platforms like Azure and AWS will attempt to parse POST request bodies as
UTF-8 strings before user code can see the data.  This will result in corrupt
data parsed by the server.  There are some workarounds, but the safest approach
is to adjust the server process or Lambda function to accept Base64 strings.

:::

The [HTTP Uploads demo](/docs/demos/net/upload) includes examples using browser
APIs and wrapper libraries.

Under normal circumstances, a `Blob` can be generated from the `array` output:

```js
/* in this example, send a Blob to the server */
var wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

/* prepare data for POST */
var blob = new Blob([new Uint8Array(wbout)], {type:"application/octet-stream"});
var formdata = new FormData();
formdata.append("file", blob, "test.xlsx");

/* perform POST request */
fetch("/upload", { method: 'POST', body: formdata });
```

When binary data is not supported, Base64 strings should be passed along.  This
will require the server to expect and decode the data:

```js
/* in this example, send a Base64 string to the server */
var wbout = XLSX.write(workbook, { bookType: "xlsx", type: "base64" });

/* prepare data for POST */
var formdata = new FormData();
formdata.append("file", "test.xlsx"); // <-- server expects `file` to hold name
formdata.append("data", wbout); // <-- `data` holds the data encoded in Base64

/* perform POST request */
var req = new XMLHttpRequest();
req.open("POST", "/upload", true);
req.send(formdata);
```

  </TabItem>
  <TabItem value="nodejs" label="NodeJS">

`XLSX.write` with `type: "buffer"` will generate a NodeJS `Buffer` which can be
used with standard NodeJS approaches for uploading data.

NodeJS releases starting from version 18.0 have native support for fetch:

```js
const XLSX = require("xlsx");

async function upload_wb(workbook, url, name="test.xlsx", field="file") {
  const buf = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  const blob = new Blob([buf], {type:"application/octet-stream"});
  const body = new FormData();
  body.append(field, blob, name);

  /* perform POST request */
  return fetch(url, { method: 'POST', body });
}
```

  </TabItem>
</Tabs>

## Generating JSON and JS Data

JSON and JS data tend to represent single worksheets. The utility functions in
this section work with single worksheets.

The ["Common Spreadsheet Format"](/docs/csf/general) section describes
the object structure in more detail.  `workbook.SheetNames` is an ordered list
of the worksheet names.  `workbook.Sheets` is an object whose keys are sheet
names and whose values are worksheet objects.

The "first worksheet" is stored at `workbook.Sheets[workbook.SheetNames[0]]`.

### API

_Create an array of JS objects from a worksheet_

```js
var jsa = XLSX.utils.sheet_to_json(worksheet, opts);
```

_Create an array of arrays of JS values from a worksheet_

```js
var aoa = XLSX.utils.sheet_to_json(worksheet, {...opts, header: 1});
```

The `sheet_to_json` utility function walks a workbook in row-major order,
generating an array of objects.  The second `opts` argument controls a number of
export decisions including the type of values (JS values or formatted text). The
["Array Output"](/docs/api/utilities/array#array-output) section describes
supported options.

By default, `sheet_to_json` scans the first row and uses the values as headers.
With the `header: 1` option, the function exports an array of arrays of values.

#### Examples

### Example: Data Grids

<Tabs>
  <TabItem value="js" label="Vanilla JS">

[`x-spreadsheet`](/docs/demos/grid/xs) is an interactive data grid for
previewing and modifying structured data in the web browser.

  </TabItem>
  <TabItem value="react" label="React">

[`react-data-grid`](/docs/demos/grid/rdg) is a data grid built for
React. It uses two properties: `rows` of data objects and `columns` which
describe the columns.  The grid API can play nice with an array of arrays.

This demo starts by fetching a remote file and using `XLSX.read` to extract:

```js
import { useEffect, useState } from "react";
import DataGrid from "react-data-grid";
import { read, utils } from "xlsx";

import 'react-data-grid/lib/styles.css';

const url = "https://docs.sheetjs.com/pres.xlsx";

export default function App() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  useEffect(() => {(async () => {
    const wb = read(await (await fetch(url)).arrayBuffer());

    /* use sheet_to_json with header: 1 to generate an array of arrays */
    const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });

    /* see react-data-grid docs to understand the shape of the expected data */
    setColumns(data[0].map((r) => ({ key: r, name: r })));
    setRows(data.slice(1).map((r) => r.reduce((acc, x, i) => {
      acc[data[0][i]] = x;
      return acc;
    }, {})));
  })(); });

  return <DataGrid columns={columns} rows={rows} />;
}
```

  </TabItem>
  <TabItem value="vue" label="VueJS">

[`vue3-table-lite`](/docs/demos/grid/vtl) is a VueJS 3 data table.

  </TabItem>
</Tabs>

### Example: Data Loading

["TensorFlow.js"](/docs/demos/math/tensorflow) covers strategies for
generating typed arrays and tensors from worksheet data.

<details>
  <summary><b>Populating a database (SQL or no-SQL)</b> (click to show)</summary>

The [`data` demo](/docs/demos/data/) includes examples of working with databases and query results.

</details>




## Generating HTML Tables

#### API

_Generate HTML Table from Worksheet_

```js
var html = XLSX.utils.sheet_to_html(worksheet);
```

The `sheet_to_html` utility function generates HTML code based on the worksheet
data.  Each cell in the worksheet is mapped to a `<TD>` element.
[Merged cells](/docs/csf/features/merges) are serialized using the TR and TH
`colspan` and `rowspan` attributes.

#### Examples

The `sheet_to_html` utility function generates HTML code that can be added to
any DOM element by setting the `innerHTML`:

```js
var container = document.getElementById("tavolo");
container.innerHTML = XLSX.utils.sheet_to_html(worksheet);
```

Combining with `fetch`, constructing a site from a workbook is straightforward:

<Tabs>
  <TabItem value="js" label="Vanilla JS">

This example assigns the `innerHTML` of a DIV element:

<CodeBlock language="html">{`\
<body>
  <style>TABLE { border-collapse: collapse; } TD { border: 1px solid; }</style>
  <div id="tavolo"></div>
  <script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
  <script type="text/javascript">
(async() => {
  /* fetch and parse workbook -- see the fetch example for details */
  const workbook = XLSX.read(await (await fetch("sheetjs.xlsx")).arrayBuffer());
\n\
  let output = [];
  /* loop through the worksheet names in order */
  workbook.SheetNames.forEach(name => {
\n\
    /* generate HTML from the corresponding worksheets */
    const worksheet = workbook.Sheets[name];
    const html = XLSX.utils.sheet_to_html(worksheet);
\n\
    /* add a header with the title name followed by the table */
    output.push(\`<H3>\${name}</H3>\${html}\`);
  });
  /* write to the DOM at the end */
  tavolo.innerHTML = output.join("\\n");
})();
  </script>
</body>`}
</CodeBlock>

  </TabItem>
  <TabItem value="react" label="React">

It is generally recommended to use a React-friendly workflow, but it is possible
to generate HTML and use it in React with `dangerouslySetInnerHTML`:

```jsx
import * as XLSX from 'xlsx';

function Tabeller(props) {
  /* the workbook object is the state */
  const [workbook, setWorkbook] = React.useState(XLSX.utils.book_new());

  /* fetch and update the workbook with an effect */
  React.useEffect(() => { (async() => {
    /* fetch and parse workbook -- see the fetch example for details */
    setWorkbook(XLSX.read(await (await fetch("sheetjs.xlsx")).arrayBuffer()));
  })(); }, []);

  return workbook.SheetNames.map(name => ( <>
    <h3>name</h3>
    <div dangerouslySetInnerHTML={{
      /* this __html mantra is needed to set the inner HTML */
      __html: XLSX.utils.sheet_to_html(workbook.Sheets[name])
    }} />
  </> ));
}
```

The [`react` demo](/docs/demos/frontend/react) includes more React examples.

  </TabItem>
  <TabItem value="vue" label="VueJS">

It is generally recommended to use a VueJS-friendly workflow, but it is possible
to generate HTML and use it in VueJS with the `v-html` directive:

```jsx
import { read, utils } from 'xlsx';
import { reactive } from 'vue';

const S5SComponent = {
  mounted() { (async() => {
    /* fetch and parse workbook -- see the fetch example for details */
    const workbook = read(await (await fetch("sheetjs.xlsx")).arrayBuffer());
    /* loop through the worksheet names in order */
    workbook.SheetNames.forEach(name => {
      /* generate HTML from the corresponding worksheets */
      const html = utils.sheet_to_html(workbook.Sheets[name]);
      /* add to state */
      this.wb.wb.push({ name, html });
    });
  })(); },
  /* this state mantra is required for array updates to work */
  setup() { return { wb: reactive({ wb: [] }) }; },
  template: `
  <div v-for="ws in wb.wb" :key="ws.name">
    <h3>{{ ws.name }}</h3>
    <div v-html="ws.html"></div>
  </div>`
};
```

The [`vuejs` demo](/docs/demos/frontend/vue) includes more React examples.

  </TabItem>
</Tabs>

## Generating Single-Worksheet Snapshots

The `sheet_to_*` functions accept a worksheet object.

#### API

_Generate a CSV from a single worksheet_

```js
var csv = XLSX.utils.sheet_to_csv(worksheet, opts);
```

This snapshot is designed to replicate the "CSV UTF-8 (`.csv`)" output type.
["CSV and Text"](/docs/api/utilities/csv) describes the function and the
optional `opts` argument in more detail.

_Generate "Text" from a single worksheet_

```js
var txt = XLSX.utils.sheet_to_txt(worksheet, opts);
```

This snapshot is designed to replicate the "UTF-16 Text (`.txt`)" output type.
["CSV and Text"](/docs/api/utilities/csv) describes the function and the
optional `opts` argument in more detail.

_Generate a list of formulae from a single worksheet_

```js
var fmla = XLSX.utils.sheet_to_formulae(worksheet);
```

This snapshot generates an array of entries representing the embedded formulae.
Array formulae are rendered in the form `range=formula` while plain cells are
rendered in the form `cell=formula or value`.  String literals are prefixed with
an apostrophe `'`, consistent with Excel's formula bar display.

["Formulae Output"](/docs/api/utilities/formulae) describes the function in more detail.

## Streaming Write

The streaming write functions are available in the `XLSX.stream` object.  They
take the same arguments as the normal write functions but return a NodeJS
Readable Stream.

- `XLSX.stream.to_csv` is the streaming version of `XLSX.utils.sheet_to_csv`.
- `XLSX.stream.to_html` is the streaming version of `XLSX.utils.sheet_to_html`.
- `XLSX.stream.to_json` is the streaming version of `XLSX.utils.sheet_to_json`.
- `XLSX.stream.to_xlml` is the streaming SpreadsheetML2003 workbook writer.

["Stream Export"](/docs/api/stream) describes the function in more detail.
