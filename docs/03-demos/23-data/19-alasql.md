---
title: Sheets with AlaSQL
sidebar_label: AlaSQL
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  sql: true
---

<head>
  <script src="/alasql/alasql.js"></script>
</head>

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[AlaSQL](https://alasql.org/) is a pure JavaScript in-memory SQL database. It
has built-in support for SheetJS through the `XLSX` target operator.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo covers basic concepts pertaining to data import and export.  The
official documentation includes advanced examples and deployment tips as well as
strategies for general data processing in AlaSQL expressions.

:::note Tested Deployments

This demo was tested in the following environments:

| Environment         | AlaSQL |    Date    |
|:--------------------|:-------|:----------:|
| NodeJS              | 3.1.0  | 2024-06-03 |
| Standalone (Chrome) | 3.1.0  | 2024-06-03 |

:::

## Live Demo

This demo fetches https://docs.sheetjs.com/pres.numbers, performs a `SELECT`
query using the built-in AlaSQL + SheetJS integration, then displays the result.
Using the result as a data source, the demo will write to a new spreadsheet.

<details>
  <summary><b>Demo AlaSQL Queries</b> (click to show)</summary>

```sql title="AlaSQL Query for reading data from a workbook"
SELECT `Index`,          -- "Index" field is the "Index" column of the sheet
  UPPER(`Name`) AS `Nom` -- "Nom" field will be uppercase of "Name" column
FROM XLSX(?, {           -- Parse the workbook bytes passed to alasql.promise
  autoExt: false         -- This option is required in the browser
})
```

```sql title="AlaSQL Query for writing data to a workbook"
SELECT *                 -- use every field from every row in dataset
INTO XLSX(               -- export data to file
  "SheetJSAlaSQL.xlsx"   -- filename for export
) FROM ?
```

</details>

:::caution pass

If the live demo shows a message

```
alasql undefined
```

please refresh the page.  This is a known bug in the documentation generator.

:::

```jsx live
function SheetJSAlaSQL() {
  const q1 = "SELECT `Index`, UPPER(`Name`) AS `Nom` FROM XLSX(?,{autoExt:false})";
  const q2 = `SELECT * INTO XLSX("SheetJSAlaSQL.xlsx") FROM ?`;
  const url = "https://docs.sheetjs.com/pres.numbers";
  const [rows, setRows] = React.useState([]);
  const loadURL = React.useCallback(async() => {
    if(typeof alasql=="undefined") return setRows([{Nom:"alasql undefined"}]);
    const blob = await (await fetch(url)).blob();
    const data = URL.createObjectURL(blob);
    const res = await alasql.promise(q1,[data]);
    setRows(res);
    await alasql.promise(q2, [res]);
  }, []);
  return ( <>
    <pre><b>URL: </b>{url}<br/><b>Import: </b>{q1}<br/><b>Export: </b>{q2}</pre>
    <table><tr><th>Index</th><th>Nom</th></tr>
      {rows.map(({Nom, Index}) => <tr><td>{Index}</td><td>{Nom}</td></tr>)}
    </table>
    <button onClick={loadURL}>Click to start</button>
  </> );
}
```

## Browser

#### Standalone Scripts

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
should be loaded before the `alasql` script:

<CodeBlock language="html">{`\
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/alasql"></script>`}
</CodeBlock>

#### Frameworks and Bundlers

`alasql` uses an older version of the library.  It can be overridden through a
`package.json` override. The lines should be added *before* installing `alasql`:

<CodeBlock language="json">{`\
{
  /* add this part before "name" */
  /* highlight-start */
  "overrides": {
    "xlsx": "https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz"
  },
  /* highlight-end */
  "name": "my-project",
  /* ... more fields ... */
`}
</CodeBlock>

After adding the override, AlaSQL can be installed through `npm`:

```bash
npm i --save alasql
```

In imports, the SheetJS library must be passed to AlaSQL as shown below:

```js
import * as alasql from 'alasql';
import * as XLSX from 'xlsx';
alasql.utils.isBrowserify = false;
alasql.utils.global.XLSX = XLSX;
```

### Reading Files

The `XLSX` "from" target expects a filename. In the browser, AlaSQL uses object
URLs which can be created from `Blob` or `File` objects.

The following snippet fetches data and passes to AlaSQL:

```js
const blob = await (await fetch("https://docs.sheetjs.com/pres.numbers")).blob();
const data = URL.createObjectURL(blob);
const res = await alasql.promise("SELECT * FROM XLSX(?, {autoExt: false}", [data]);
```

By default, the `XLSX` "from" target automatically adds a `.xlsx` extension.  To
read URLs, the `autoExt: false` option should be passed as the second argument:

```sql
SELECT `Name`, `Index` FROM XLSX(
  ? --<< this will be the URL passed into `alasql.promise`
// highlight-start
  , { --<< options are supplied as the second argument to XLSX operator
    autoExt: false --<< do not automatically add ".xlsx" extension!
  }
// highlight-end
) WHERE `Index` < 45
```

By default the workbook is parsed and `sheet_to_json` is used to pull data:

```js
(async() => {
  const blob = await (await fetch("https://docs.sheetjs.com/pres.numbers")).blob();
  const data = URL.createObjectURL(blob);
  const aoo = await alasql.promise("SELECT * FROM XLSX(?, {autoExt: false}", [data]);
  console.log(aoo); // [ { Name: "Bill Clinton", Index: 42 }, ...]
})();
```

### Writing Files

The `XLSX` "into" target calls `XLSX.writeFile` under the hood:

```js
(async() => {
  const data = [
    { Name: "Bill Clinton", Index: 42 },
    { Name: "SheetJS Dev", Index: 47 }
  ];
  await alasql.promise(`SELECT * INTO XLSX("PresMod5.xlsx") FROM ?`, [data]);
  /* PresMod5.xlsx will be created */
})();
```

## NodeJS

:::caution pass

`alasql` uses an older version of the library.  It can be overridden through a
`package.json` override in the latest versions of NodeJS:

<CodeBlock language="json">{`\
{
  "overrides": {
    "xlsx": "https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz"
  }
}`}
</CodeBlock>

:::

### Reading Files

By default, the `XLSX` "from" target automatically adds a `.xlsx` extension.  To
read files with an arbitrary filename, the `autoExt: false` option should be
passed as the second argument:

```sql
SELECT `Name`, `Index` FROM XLSX(
  "pres.numbers" --<< filename is "pres.numbers"
// highlight-start
  , { --<< options are supplied as the second argument to XLSX operator
    autoExt: false --<< do not automatically add ".xlsx" extension!
  }
// highlight-end
) WHERE `Index` < 45
```

By default the workbook is parsed and `sheet_to_json` is used to pull data:

```js
const { promise: alasql } = require("alasql");

(async() => {
  const aoo = await alasql(`SELECT * from XLSX("pres.xlsx", {autoExt: false})`);
  console.log(aoo); // [ { Name: "Bill Clinton", Index: 42 }, ...]
})();
```

### Writing Files

The `XLSX` "into" target calls `XLSX.writeFile` under the hood:

```js
const { promise: alasql } = require("alasql");

(async() => {
  const data = [
    { Name: "Bill Clinton", Index: 42 },
    { Name: "SheetJS Dev", Index: 47 }
  ];
  await alasql(`SELECT * INTO XLSX("PresMod5.xlsx") FROM ?`, [data]);
  /* PresMod5.xlsx will be created */
})();
```

### NodeJS Example

1) Create an empty folder for the project:

```bash
mkdir alasql
cd alasql
```

2) In the folder, create a stub `package.json` with the `xlsx` override:

<CodeBlock language="json" title="package.json">{`\
{
  "overrides": {
    "xlsx": "https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz"
  }
}`}
</CodeBlock>

3) Install SheetJS and AlaSQL:

<CodeBlock language="bash">{`\
npm i --save alasql@3.1.0 https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

4) Download the test file https://docs.sheetjs.com/pres.numbers :

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
```

5) Save the following test script to `SheetJSAlaSQL.js`:

```js title="SheetJSAlaSQL.js"
const { promise: alasql } = require("alasql");

(async() => {
  /* read data from spreadsheet to JS */
  const data = await alasql(`
    SELECT \`Name\`, \`Index\`
      FROM XLSX("pres.numbers", {autoExt:false})
      WHERE \`Index\` < 45
  `);
  console.log(data);

  /* write data from JS to spreadsheet */
  data.push({ Name: "SheetJS Dev", Index: 47 });
  await alasql(`SELECT * INTO XLSX("SheetJSAlaSQL1.xlsx") FROM ?`, [data]);
})();
```

6) Run the test script

```bash
node SheetJSAlaSQL.js
```

The output should display:

```js
[
  { Name: 'Bill Clinton', Index: 42 },
  { Name: 'GeorgeW Bush', Index: 43 },
  { Name: 'Barack Obama', Index: 44 }
]
```

The script should generate `SheetJSAlaSQL1.xlsx` with the additional row:

```csv
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
SheetJS Dev,47
```
