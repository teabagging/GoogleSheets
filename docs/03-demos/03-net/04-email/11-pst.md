---
title: Sheets in PST Mailboxes
sidebar_label: PST Mailboxes
pagination_prev: demos/net/server/index
pagination_next: demos/net/headless/index
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

<head>
  <script src="/pst/pstextractor.js"></script>
</head>

PST (Personal Storage Table) is a common file format for storing messages.
Electronic discovery commonly involves extracting data from attached
spreadsheets in e-mail messages stored in PST archives.

`pst-extractor`[^1] is a NodeJS module designed for extracting objects from PST
files. It has been used to extract spreadsheets from the Enron Corpus[^2] and
other large mailboxes.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses `pst-extractor` and SheetJS to read spreadsheets. We'll explore
how to load SheetJS in a NodeJS script or website, extract spreadsheets files,
and generate HTML and CSV views of the underlying data.

The ["Live Demo"](#live-demo) reads PST files. Individual spreadsheets within
the file can be downloaded or previewed in the browser.

:::note Tested Deployments

This demo was last tested on 2024 March 11 against `pst-extractor` 1.9.0

:::

## Overview

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
imported from scripts that use `pst-extractor`.

### Parsing PST Files

The `pst-extractor` module exposes a `PSTFile` class. The constructor requires a
proper NodeJS buffer.

The following snippet reads and parses `enron.pst` from the local filesystem.
`fs.readFileSync`[^3] accepts a filename and returns a Buffer:

```js
const fs = require("fs"), PSTExtractor = require("pst-extractor");
const file = fs.readFileSync("enron.pst");
const pst = new (PSTExtractor.PSTFile)(file);
```

### Walking the Tree

`pst-extractor` presents a tree-like structure to inspect the contents of the
PST file. It is recommended to use recursive functions to walk the tree.

The following tree walker will collect all XLSX and XLS attachments:

```js
/* walk the PST file and add all attachments to the specified array */
function walk(f,arr) {
  if(f.hasSubfolders) for(let sf of f.getSubFolders()) walk(sf,arr);
  if(f.contentCount <= 0) return;
  for(let e = f.getNextChild(); e != null; e = f.getNextChild()) {
    for(let i = 0; i < e.numberOfAttachments; ++i) {
      var a = e.getAttachment(i);
      /* XLS spreadsheet test by filename */
      if(/.xls[xmb]?$/.test(a.filename)) arr.push(a);
    }
  }
}

/* generate a list of attachments */
const files = [];
walk(pst.getRootFolder(), files);
```

### Generating Buffers

The `PSTAttachment` class holds attachment metadata. To avoid loading everything
in memory, the raw data is exposed as a custom stream object. Since the SheetJS
`read` function requires data in a `Buffer` or `Uint8Array`, a helper function
is used to collect the data:

```js
/* collect data from the attachment into a "Buffer" */
function collect(file) {
  const strm = file.fileInputStream;
  const data = Buffer.alloc(strm._length.low);
  strm.readCompletely(data);
  return data;
}

/* collect data from the first attachment */
const buf0 = collect(files[0]);
```

### Processing Attachments

Given a NodeJS Buffer, the SheetJS `read` method[^4] parses the data and returns
a workbook object[^5]. Individual worksheets can be extracted from the workbook
and converted to CSV[^6] or HTML[^7].

The following example prints the contents of each worksheet in CSV form:

```js
const XLSX = require("xlsx");

/* parse workbook and print CSV contents of each sheet */
const wb = XLSX.read(buf0);
wb.SheetNames.forEach(n => {
  const ws = wb.Sheets[n];
  const csv = XLSX.utils.sheet_to_csv(ws);
  console.log(`#### ${file.filename} ! ${n}`);
  console.log(csv);
});
```

### Browser Caveats

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be loaded through a `SCRIPT` tag.

This demo uses [a special `pst-extractor` build](#browser-build) for the web.

Compared to the NodeJS build, browser scripts require special Buffer wrappers.
For example, the following function will fail since the library does not support
`ArrayBuffer` objects:

```js
async function error_fetch_and_parse_pst(url) {
  const ab = await (await fetch(url)).arrayBuffer();
  // this will throw an error
  return new (PSTExtractor.PSTFile)(ab);
}
```

The browser build exposes the `Buffer` object in the `PSTExtractor` global:

```js
async function correct_fetch_and_parse_pst(url) {
  const ab = await (await fetch(url)).arrayBuffer();
// highlight-next-line
  const buf = new PSTExtractor.Buffer(ab);
  return new (PSTExtractor.PSTFile)(buf);
}
```

### Browser Build

The `pst-extractor` library is designed for NodeJS. Parts of the library expect
a NodeJS `Buffer`, which does not exist in the browser. A fake `Buffer` can be
added and exposed in a script.

[`pstextractor.js`](pathname:///pst/pstextractor.js) is loaded in the demo page.

<details>
  <summary><b>Build instructions</b> (click to show)</summary>

1) Initialize a new NodeJS project and install the dependency:

```bash
mkdir pstextract
cd pstextract
npm init -y
npm i --save pst-extractor@1.9.0
```

2) Save the following to `shim.js`:

```js title="shim.js"
const PSTExtractor = require("pst-extractor");
module.exports = PSTExtractor;
module.exports.Buffer = Buffer;
```

3) Build the script:

```bash
npx browserify@17.0.0 -s PSTExtractor -o pstextractor.js shim.js
```

</details>

## Demos

### NodeJS

This demo will fetch a [test PST](pathnamme:///pst/enron.pst) and extract all
embedded spreadsheets. The script can be adapted to read local PST files or pull
PST files from a different URL.

:::caution pass

The demo uses `fetch` and requires NodeJS 18 or later.

:::

0) Initialize a new project:

```bash
mkdir sheetjs-pst
cd sheetjs-pst
npm init -y
```

2) Install the SheetJS NodeJS module and `pst-extractor`:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz pst-extractor`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz pst-extractor`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz pst-extractor`}
</CodeBlock>
  </TabItem>
</Tabs>

2) Download [`SheetJSPST.js`](pathname:///pst/SheetJSPST.js) into project folder:

```bash
curl -LO https://docs.sheetjs.com/pst/SheetJSPST.js
```

3) Run the script:

```js
node SheetJSPST.js
```

The process will fetch [the test PST](pathnamme:///pst/enron.pst) and extract
the embedded spreadsheets. The terminal will display info on the exported files.

:::note pass

Lines starting with `saving file` show how attachments correspond to files. The
following line states that the first attachment (index `0`) was originally named
`RedRockA.xls` and was saved to `file0.xls` on the file system:

```
saving file 0 |RedRockA.xls| to file0.xls
```

Lines starting with `####` show the attachment file name and the worksheet name.
The following line explains that there is a worksheet named `"Oneok at 2500"` in
the file `RedRockA.xls`:

```
#### RedRockA.xls ! Oneok at 2500
```

Every other line is a CSV row from the named worksheet. For example, the first
four lines of worksheet `"Oneok at 2500"` in `RedRockA.xls` are shown below:

```text
#### RedRockA.xls ! Oneok at 2500
// highlight-start
RED ROCK EXPANSION PROJECT,,,,,,,,
,,,,,,,,
,,REQUESTED,REQUESTED,,,,,
,,RECEIPT,DELIVERY,,,Allocation,,
// highlight-end
```

:::

### Live Demo

This demo reads PST mailboxes. Due to browser limitations, PST files larger than
100 MB may crash the browser.

After parsing the PST file, the "Attachments" table will list attached XLSX and
XLS spreadsheets in the file. The "preview" link will display a HTML table with
the data in the spreadsheet. The "download" link will download the attachment.

The [test file](pathname:///pst/enron.pst) was based on the EDRM clean extract
from the "Enron Corpus" and includes a few XLS attachments.

:::caution pass

If the live demo shows a message

```
Please reload the page
```

please refresh the page.  This is a known bug in the documentation generator.

:::

```jsx live
function SheetJSPreviewPSTSheets() {
  const [ files, setFiles ] = React.useState([]);
  const [ __html, setHTML ] = React.useState("");

  /* recursively walk PST and collect attachments */
  const walk = (f,arr) => {
    if(f.hasSubfolders) for(let sf of f.getSubFolders()) walk(sf,arr);
    if(f.contentCount <= 0) return;
    for(let e = f.getNextChild(); e != null; e = f.getNextChild()) {
      for(let i = 0; i < e.numberOfAttachments; ++i) {
        var a = e.getAttachment(i);
        /* XLS spreadsheet test by filename */
        if(/.xls[xmb]?$/.test(a.filename)) arr.push(a);
      }
    }
  }

  /* collect data from the attachment into a "Buffer" */
  const collect = (j) => {
    const strm = files[j].fileInputStream;
    const data = new PSTExtractor.Buffer(strm._length.low);
    strm.readCompletely(data);
    return data;
  }

  /* view selected attachment */
  const view = (j) => {
    const data = collect(j);

    /* parse */
    const wb = XLSX.read(data);

    /* convert first sheet to HTML */
    const ws = wb.Sheets[wb.SheetNames[0]];
    setHTML(XLSX.utils.sheet_to_html(ws));
  }

  /* process array buffer */
  const process_ab = (ab) => {
    const pst = new (PSTExtractor.PSTFile)(new PSTExtractor.Buffer(ab));
    const data = [];
    walk(pst.getRootFolder(), data);
    setFiles(data);
  };

  /* on click, fetch and process file */
  const doit = async() => {
    const ab = await (await fetch("/pst/enron.pst")).arrayBuffer();
    process_ab(ab);
  };
  const chg = async(e) => process_ab(await e.target.files[0].arrayBuffer());

  /* download selected attachment */
  const dl = (j) => {
    const a = document.createElement("a");
    a.download = files[j].filename;
    a.href = URL.createObjectURL(new Blob([collect(j)]));
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if(typeof PSTExtractor == "undefined") return <b>Please reload the page</b>;
  return ( <>
    <p>Use the file input to select a file, or click "Use a Sample PST"</p>
    <input type="file" accept=".pst" onChange={chg}/>
    <button onClick={doit}>Use a Sample PST!</button><br/><br/>
    <table><thead><tr><th colspan="3">Attachments</th></tr></thead>
      <tbody>{files.map((f,j) => (
        <tr key={j}><th>{f.filename}</th>
          <td><a onClick={()=>view(j)}>(preview)</a></td>
          <td><a onClick={()=>dl(j)}>(download)</a></td>
        </tr>
      ))}</tbody>
    </table>
    <b>Preview of first worksheet</b><br/>
    <div dangerouslySetInnerHTML={{__html}}></div>
  </> );
}
```

[^1]: The project has no official website. The official [repository](https://github.com/epfromer/pst-extractor) is hosted on GitHub.
[^2]: Extracted spreadsheets are [available on GitHub](https://github.com/SheetJS/enron_xls)
[^3]: See [`fs.readFileSync`](https://nodejs.org/api/fs.html#fsreadfilesyncpath-options) in the NodeJS documentation
[^4]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^5]: See ["Workbook Object"](/docs/csf/book)
[^6]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^7]: See [`sheet_to_html` in "Utilities"](/docs/api/utilities/html#html-table-output)
