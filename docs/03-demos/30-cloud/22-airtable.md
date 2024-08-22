---
title: Airtable
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Airtable](https://airtable.com/) is a collaborative dataset hosting service.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS to properly exchange data with spreadsheet files. We'll
explore how to use the `airtable` NodeJS library and SheetJS in two data flows:

- "Exporting data": Data in Airtable will be pulled into an array of objects and
exported to XLSB spreadsheets using SheetJS libraries.

- "Importing data": Data in an XLSX spreadsheet will be parsed using SheetJS
libraries and appended to a dataset in Airtable


## NodeJS Integration

### Installation

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required in NodeJS scripts that interact with Airtable.

The Airtable connector module is `airtable` and can be installed with `npm`:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz airtable`}
</CodeBlock>

### Authentication

Airtable recommends Personal Access Tokens ("PAT") for interacting with the API.

:::note pass

The ["Personal Access Token"](#personal-access-token) section walks through the
process of creating a PAT.

:::

The connector constructor accepts an options argument. The PAT should be passed
using the `apiKey` property:

```js
const Airtable = require("airtable");
const apiKey = "PAT..."; // personal access token
const conn = new Airtable({apiKey, /* see docs for other options ... */});
```

The `base` method opens a specified workspace. The internal workspace name is
the first fragment in the Airtable URL, typically starts with "app":

```js
const base = conn.base("app...");
```

The `table` method of the workspace object opens a specified table:

```js
const table = base.table("tablename...");
```

### Exporting Data

When querying data, a result set will be a simple array of Record objects. The
`fields` property of each record object is a simple JS object. Mapping over the
result set and picking the `fields` field yields a standard array of objects:

```js
/** Create array of objects from Airtable table */
async function airtable_to_aoo(table) {
  /* get all rows */
  const result = await table.select().all();

  /* pull raw objects from the result */
  // highlight-next-line
  const aoo = result.map(r => r.fields);
  return aoo;
}
```

The SheetJS `json_to_sheet` utility function[^1] can generate a worksheet object
from the array of objects:

```js
const XLSX = require("xlsx");

/** Create SheetJS worksheet from Airtable table */
async function airtable_to_worksheet(table) {
  /* get all rows */
  const result = await table.select().all();

  /* pull raw objects from the result */
  const aoo = result.map(r => r.fields);

  /* create a worksheet */
  // highlight-next-line
  const worksheet = XLSX.utils.json_to_sheet(aoo);
  return worksheet;
}
```

:::caution pass

The results are not guaranteed to be sorted.  The official API includes options
for sorting by fields.

:::

The worksheet object must be added to a new workbook object using the `book_new`
and `book_append_sheet` helper functions[^2]:

```js
/** Create SheetJS workbook from Airtable table */
async function airtable_to_workbook(table) {
  /* generate worksheet */
  const ws = await airtable_to_worksheet(table);
  /* create a new workbook */
  const wb = XLSX.utils.book_new();
  /* add worksheet to workbook */
  XLSX.utils.book_append_sheet(wb, ws, "ExportedData");
  return wb;
}
```

Local files can be created using the SheetJS `writeFile` method[^3]:

```js
(async() => {
  /* generate SheetJS workbook */
  const wb = await airtable_to_workbook(table);
  /* write to XLSX */
  XLSX.writeFile(wb, "SheetJSAirtableExport.xlsx");
})();
```

### Importing Data

The Airtable table `create` method expects an array of record objects. The
`fields` property of each object is expected to contain the raw record data.

Mapping over a standard array of objects can create Airtable-friendly data:

```js
/** Append records from an array of data objects to Airtable table */
async function airtable_load_aoo(table, aoo) {
  /* reshape to be compatible with Airtable API */
  // highlight-next-line
  const airtable_rows = aoo.map(fields => ({ fields }));

  /* upload data */
  return await table.create(airtable_rows);
}
```

Starting from a SheetJS worksheet object[^4], the `sheet_to_json` method[^5] can
generate normal arrays of objects:

```js
const XLSX = require("xlsx");

/** Append records from a SheetJS worksheet to Airtable table */
async function airtable_load_worksheet(table, worksheet) {
  /* generate normal array of objects */
  // highlight-next-line
  const aoo = XLSX.utils.sheet_to_json(worksheet);

  /* upload data */
  return await airtable_load_aoo(table, aoo);
}
```

A SheetJS worksheet object can be extracted from a workbook object[^6]:

```js
/** Append records from the first worksheet of a workbook to Airtable table */
async function airtable_load_workbook(table, workbook) {
  /* pull first worksheet from workbook object */
  // highlight-next-line
  const first_sheet_name = workbook.SheetNames[0];
  const ws = workbook.Sheets[first_sheet_name];

  /* upload data */
  return await airtable_load_worksheet(table, ws);
}
```

Local files can be read using the SheetJS `readFile` method[^7]:

```js
const wb = XLSX.readFile("SheetJSAirtableTest.xlsb");
(async() => {
  await airtable_load_workbook(table, wb);
})();
```

## Complete Example

:::note Tested Deployments

This demo was last tested on 2024 May 04. At the time, free accounts included
limited API access.

:::

0) Create a free Airtable account and verify the email address.

### Personal Access Token

:::note pass

In the past, Airtable offered API keys. They were officially deprecated on 2024
February 1. They recommend "Personal Access Tokens" for operations.

:::

API actions will require a PAT, which must be created through the developer hub:

1) Click on account icon (topright area of the page) and select "Developer Hub".

:::caution pass

The email address associated with the account must be verified before attempting
to create a token.

:::

2) Click the blue "Create Token" button.

3) In the form, make the following selections:

- Name: enter any name (for example, "SheetJS Test")
- Scopes: `data.records:read` and `data.records:write` (adding 2 scopes)
- Access: "All current and future bases in all current and future workspaces"

The form will look like the following screenshot:

![Airtable PAT Form](pathname:///airtable/pat.png)

4) Click "Create Token" and you will see a popup.  Copy the token and save it.

### Workspace

For the purposes of this demo, a sample workspace should be created:

5) Download https://docs.sheetjs.com/pres.xlsx

6) Click "Back to Home" to return to the home page.

7) Create a project in Airtable using "Quickly upload". Select "Microsoft Excel"
and select the downloaded file from step 1.  Click "Upload", then "Import".

8) A workspace will be created. The name will be found in the URL. For example:

```
https://airtable.com/appblahblah/tblblahblah/blahblah
--------------------/^^^^^^^^^^^/ workspace name
```

The first part after the `.com` will be the workspace name. Copy the name.

### New Project

9) Create a new project:

```bash
mkdir -p sheetjs-airtable
cd sheetjs-airtable
npm init -y
```

10) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz airtable`}
</CodeBlock>

### Exporting Data

11) Save the following to `SheetJSAirtableRead.js`:

```js title="SheetJSAirtableRead.js"
const Airtable = require("airtable"), XLSX = require("xlsx");
// highlight-start
/* replace the value with the personal access token */
const apiKey = "pat...";
/* replace the value with the workspace name */
const base = "app...";
// highlight-end
(async() => {
  const conn = new Airtable({ apiKey });
  const table = conn.base(base).table("Sheet1");
  const result = await table.select().all();
  const aoo = result.map(r => r.fields);
  const ws = XLSX.utils.json_to_sheet(aoo);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "SheetJSAirtable.xlsb");
})();
```

12) Replace the values in the highlighted lines with the PAT and workspace name.

13) Run the script:

```bash
node SheetJSAirtableRead.js
```

The script should write `SheetJSAirtable.xlsb`. The file can be opened in Excel.

### Importing Data

14) Download [`SheetJSAirpend.xlsx`](pathname:///airtable/SheetJSAirpend.xlsx)
to the project folder:

```bash
curl -LO https://docs.sheetjs.com/airtable/SheetJSAirpend.xlsx
```

15) Save the following to `SheetJSAirtableWrite.js`:

```js title="SheetJSAirtableWrite.js"
const Airtable = require("airtable"), XLSX = require("xlsx");
// highlight-start
/* replace the value with the personal access token */
const apiKey = "pat...";
/* replace the value with the workspace name */
const base = "app...";
// highlight-end
(async() => {
  const conn = new Airtable({ apiKey });
  const table = conn.base(base).table("Sheet1");
  const wb = XLSX.readFile("SheetJSAirpend.xlsx");
  const ws = wb.Sheets["Sheet1"];
  const aoo = XLSX.utils.sheet_to_json(ws);
  await table.create(aoo.map(fields => ({ fields })));
})();
```

16) Replace the values in the highlighted lines with the PAT and workspace name.

17) Run the script:

```bash
node SheetJSAirtableWrite.js
```

Open Airtable and verify the new row was added:

![Final Result in Airtable](pathname:///airtable/post.png)

[^1]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^2]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^3]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^4]: See ["Sheet Objects"](/docs/csf/sheet) for more details/
[^5]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^6]: See ["Workbook Object"](/docs/csf/book)
[^7]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
