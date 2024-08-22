---
sidebar_position: 1
hide_table_of_contents: true
title: Overview
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

# SheetJS CE

SheetJS Community Edition offers battle-tested open-source solutions for
extracting useful data from almost any complex spreadsheet and generating new
spreadsheets that will work with legacy and modern software alike.

[SheetJS Pro](https://sheetjs.com/pro) offers solutions beyond data processing:
Edit complex templates with ease; let out your inner Picasso with styling; make
custom sheets with images/graphs/PivotTables; evaluate formula expressions and
port calculations to web apps; automate common spreadsheet tasks, and much more!

## Simple Examples

The code editors are live -- feel free to edit! They use ReactJS components and
run entirely in the web browser.

### Export an HTML Table to Excel XLSX

<details>
  <summary><b>How to add to your site</b> (click to show)</summary>

<Tabs groupId="deployment">
  <TabItem value="vanilla" label="HTML">

1) Make sure your table has an ID:

```html
<table id="TableToExport">
```

2) Include a reference to the SheetJS library in your page:

<CodeBlock language="html">{`\
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>`}
</CodeBlock>

3) Add a button that users will click to generate an export

```html
<button id="sheetjsexport"><b>Export as XLSX</b></button>
```

4) Add an event handler for the `click` event to export table data to XLSX:

```html
<script>
document.getElementById("sheetjsexport").addEventListener('click', function() {
  /* Create worksheet from HTML DOM TABLE */
  var wb = XLSX.utils.table_to_book(document.getElementById("TableToExport"));
  /* Export to file (start a download) */
  XLSX.writeFile(wb, "SheetJSTable.xlsx");
});
</script>
```

  </TabItem>
  <TabItem value="react" label="React">

:::note pass

This example assumes you have an existing project with an HTML TABLE element:

```jsx title="Sample Component"
function App() {
  return ( <>
    <h3>SheetJS Table</h3>
    <table>
      <tr><td colSpan="3">SheetJS Table Export</td></tr>
      <tr><td>Author</td><td>ID</td><td>你好!</td></tr>
      <tr><td>SheetJS</td><td>7262</td><td>வணக்கம்!</td></tr>
      <tr><td colSpan="3">
        <a href="//sheetjs.com">Powered by SheetJS</a>
      </td></tr>
    </table>
  </> )
}
export default App;
```

If you are starting from scratch, create a new ViteJS + ReactJS project:

```bash
npm create vite@latest -- sheetjs-react --template react --default
cd sheetjs-react
npm install
npm run dev
```

Replace `src/App.jsx` with the sample component.

:::

1) Install the SheetJS library using a package manager:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
</Tabs>

2) Ensure that your component script imports `useRef` from the `react` library:

```js
import { useRef } from "react";
```

3) Add the following line at the top of your component script:

```js
import { utils, writeFileXLSX } from "xlsx";
```

4) Create a ref in the body of your function component:

```jsx
function App() {
// highlight-next-line
  const tbl = useRef(null);
  // ...
```

5) Attach the ref to the table element:

```jsx
function App() {
  // ...
  return (
    {/*...*/}
// highlight-next-line
    <table ref={tbl}>
      {/*...*/}
```

6) Add a button with a click handler that will export table data to XLSX:

```jsx
function App() {
  // ...
  return (
    {/*...*/}
// highlight-start
    <button onClick={() => {
      // generate workbook from table element
      const wb = utils.table_to_book(tbl.current);
      // write to XLSX
      writeFileXLSX(wb, "SheetJSReactExport.xlsx");
    }}>Export XLSX</button>
// highlight-end
    {/*...*/}
```

  </TabItem>
</Tabs>

</details>

<details>
  <summary><b>How to automate with NodeJS</b> (click to show)</summary>

[The "Headless Automation" demo](/docs/demos/net/headless) includes complete examples
using the `puppeteer` and `playwright` browser automation frameworks.

</details>

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

This example uses a ReactJS `ref` to reference the HTML TABLE element. ReactJS
details are covered in the [ReactJS demo](/docs/demos/frontend/react#html)

```jsx live
/* The live editor requires this function wrapper */
function Table2XLSX(props) {
  /* reference to the table element */
  const tbl = React.useRef();

  /* Callback invoked when the button is clicked */
  const xport = React.useCallback(() => {
    /* Create worksheet from HTML DOM TABLE */
    const wb = XLSX.utils.table_to_book(tbl.current);

    /* Export to file (start a download) */
    XLSX.writeFile(wb, "SheetJSTable.xlsx");
  });

  return ( <>
    <table ref={tbl}><tbody>
      <tr><td colSpan="3">SheetJS Table Export</td></tr>
      <tr><td>Author</td><td>ID</td><td>你好!</td></tr>
      <tr><td>SheetJS</td><td>7262</td><td>வணக்கம்!</td></tr>
      <tr><td colSpan="3">
        <a href="//sheetjs.com">Powered by SheetJS</a>
      </td></tr>
    </tbody></table>
    <button onClick={xport}><b>Export XLSX!</b></button>
  </> );
}
```

<a href="https://sheetjs.com/pro">SheetJS Pro Basic</a> extends this export with
support for CSS styling and rich text.

</details>

### Download and Preview Apple Numbers Workbooks

<details>
  <summary><b>How to add to your site</b> (click to show)</summary>

1) Create a container DIV for the table:

```html
<div id="TableContainer"></div>
```

2) Include a reference to the SheetJS library in your page:

<CodeBlock language="html">{`\
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>`}
</CodeBlock>

3) Add a script block to download and update the page:

```html
<script>
(async() => {
  /* replace with the URL of the file */
  const URL_TO_DOWNLOAD = "https://docs.sheetjs.com/pres.numbers";
  const ab = await (await fetch(URL_TO_DOWNLOAD)).arrayBuffer();

  /* Parse file and get first worksheet */
  const wb = XLSX.read(ab);
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];

  /* Generate HTML */
  var output = document.getElementById("TableContainer");
  output.innerHTML = XLSX.utils.sheet_to_html(ws);
})();
</script>
```

</details>

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

This demo processes https://docs.sheetjs.com/pres.numbers

```jsx live
/* The live editor requires this function wrapper */
function Numbers2HTML(props) {
  const [__html, setHTML] = React.useState("");

  /* Fetch and update HTML */
  React.useEffect(() => { (async() => {
    /* Fetch file */
    const f = await fetch("https://docs.sheetjs.com/pres.numbers");
    const ab = await f.arrayBuffer();

    /* Parse file */
    const wb = XLSX.read(ab);
    const ws = wb.Sheets[wb.SheetNames[0]];

    /* Generate HTML */
    setHTML(XLSX.utils.sheet_to_html(ws));
  })(); }, []);

  return ( <div dangerouslySetInnerHTML={{ __html }}/> );
}
```

<a href="https://sheetjs.com/pro">SheetJS Pro Basic</a> extends this import with
support for CSS styling and rich text.

</details>

### Preview a workbook on your device

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

This example starts from a CSV string.  Use the File Input element to select
a workbook to load.  Use the "Export XLSX" button to write the table to XLSX.

```jsx live
/* The live editor requires this function wrapper */
function Tabeller(props) {
  const [__html, setHTML] = React.useState("");

  /* Load sample data once */
  React.useEffect(() => {
    /* Starting CSV data -- change data here */
    const csv = `\
This,is,a,Test
வணக்கம்,สวัสดี,你好,가지마
1,2,3,4`;

    /* Parse CSV into a workbook object */
    const wb = XLSX.read(csv, {type: "string"});

    /* Get the worksheet (default name "Sheet1") */
    const ws = wb.Sheets.Sheet1;

    /* Create HTML table */
    setHTML(XLSX.utils.sheet_to_html(ws, { id: "tabeller" }));
  }, []);

  return ( <>
    {/* Import Button */}
    <input type="file" onChange={async(e) => {
      /* get data as an ArrayBuffer */
      const file = e.target.files[0];
      const data = await file.arrayBuffer();

      /* parse and load first worksheet */
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      setHTML(XLSX.utils.sheet_to_html(ws, { id: "tabeller" }));
    }}/>

    {/* Export Button */}
    <button onClick={() => {

      /* Create worksheet from HTML DOM TABLE */
      const table = document.getElementById("tabeller");
      const wb = XLSX.utils.table_to_book(table);

      /* Export to file (start a download) */
      XLSX.writeFile(wb, "SheetJSIntro.xlsx");
    }}><b>Export XLSX!</b></button>

    {/* Show HTML preview */}
    <div dangerouslySetInnerHTML={{ __html }}/>
  </> );
}
```

</details>


### Browser Testing

[![Build Status](https://saucelabs.com/browser-matrix/sheetjs.svg)](https://saucelabs.com/u/sheetjs)

### Supported File Formats

![graph of format support](pathname:///formats.png)

![graph legend](pathname:///legend.png)
