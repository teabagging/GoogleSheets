---
title: Databases and Stores
pagination_prev: demos/cli/index
pagination_next: demos/local/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

"Database" is a catch-all term referring to traditional RDBMS as well as K/V
stores, document databases, and other "NoSQL" storages. There are many external
database systems as well as browser APIs like WebSQL and `localStorage`

## Data Storage

### Structured Tables

Database tables are a common import and export target for spreadsheets.  One
common representation of a database table is an array of JS objects whose keys
are column headers and whose values are the underlying data values. For example,

| Name         | Index |
| :----------- | ----: |
| Barack Obama |    44 |
| Donald Trump |    45 |
| Joseph Biden |    46 |

is naturally represented as an array of objects

```js
[
  { Name: "Barack Obama", Index: 44 },
  { Name: "Donald Trump", Index: 45 },
  { Name: "Joseph Biden", Index: 46 }
]
```

The `sheet_to_json` and `json_to_sheet` helper functions work with objects of
similar shape, converting to and from worksheet objects.  The corresponding
worksheet would include a header row for the labels:

```
XXX|      A       |   B   |
---+--------------+-------+
 1 | Name         | Index |
 2 | Barack Obama |    44 |
 3 | Donald Trump |    45 |
 3 | Joseph Biden |    46 |
```

### Unstructured Data

"Schema-less" / "NoSQL" databases allow for arbitrary keys and values within the
entries in the database.  K/V stores and Objects add additional restrictions.

There is no natural way to translate arbitrarily shaped schemas to worksheets
in a workbook.  One common trick is to dedicate one worksheet to holding named
keys.  For example, considering the JS object:

```json
{
  "title": "SheetDB",
  "metadata": {
    "author": "SheetJS",
    "code": 7262
  },
  "data": [
    { "Name": "Barack Obama", "Index": 44 },
    { "Name": "Donald Trump", "Index": 45 },
  ]
}
```

A dedicated worksheet should store the one-off named values:

```
XXX|        A        |    B    |
---+-----------------+---------+
 1 | Path            | Value   |
 2 | title           | SheetDB |
 3 | metadata.author | SheetJS |
 4 | metadata.code   |    7262 |
```

## Data Interchange

### Exporting Data

There are NodeJS connector libraries for many popular RDBMS systems.  Libraries
have facilities for connecting to a database, executing queries, and obtaining
results as arrays of JS objects that can be passed to `json_to_sheet`.  The main
differences surround API shape and supported data types.

For example, `better-sqlite3` is a connector library for SQLite. The result of
a `SELECT` query is an array of objects suitable for `json_to_sheet`:

```js
var aoo = db.prepare("SELECT * FROM 'Presidents' LIMIT 100000").all();
// highlight-next-line
var worksheet = XLSX.utils.json_to_sheet(aoo);
```

Other databases will require post-processing.  For example, MongoDB results
include the Object ID (usually stored in the `_id` key).  This can be removed
before generating a worksheet:

```js
const aoo = await db.collection('coll').find({}).toArray();
// highlight-next-line
aoo.forEach((x) => delete x._id);
const ws = XLSX.utils.json_to_sheet(aoo);
```

### Importing Data

When a strict schema is needed, the `sheet_to_json` helper function generates
arrays of JS objects that can be scanned to determine the column "types".

:::note pass

Document databases like MongoDB tend not to require schemas. Arrays of objects
can be used directly without setting up a schema:

```js
const aoo = XLSX.utils.sheet_to_json(ws);
// highlight-next-line
await db.collection('coll').insertMany(aoo, { ordered: true });
```

:::

The ["SQL Connectors"](/docs/demos/data/sql) demo includes sample functions for
generating SQL CREATE TABLE and INSERT queries.

## DSV Interchange

Many databases offer utilities for reading and writing CSV, pipe-separated
documents, and other simple data files. They enable workflows where the library
generates CSV data for the database to process or where the library parses CSV
files created by the database.

#### Worksheet to CSV

CSV data can be generated from worksheets using `XLSX.utils.sheet_to_csv`.

```js
// starting from a worksheet object
const csv = XLSX.utils.sheet_to_json(ws);

// whole workbook conversion
const csv_arr = wb.SheetNames.map(n => XLSX.utils.sheet_to_json(wb.Sheets[n]));
```

#### CSV to Worksheet

`XLSX.read` can read strings with CSV data.  It will generate single-sheet
workbooks with worksheet name `Sheet1`.

Where supported, `XLSX.readFile` can read files.

```js
// starting from a CSV string
const ws_str = XLSX.read(csv_str, {type: "string"}).Sheets.Sheet1;

// starting from a CSV binary string (e.g. `FileReader#readAsBinaryString`)
const ws_bstr = XLSX.read(csv_bstr, {type: "binary"}).Sheets.Sheet1;

// starting from a CSV file in NodeJS or Bun or Deno
const ws_file = XLSX.readFile("test.csv").Sheets.Sheet1;
```

## Demos

### Web APIs

The following Web APIs are featured in separate demos:

<ul>{useCurrentSidebarCategory().items.filter(item => item.customProps?.type == "web").map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}
<li><a href="/docs/demos/local/websql">Web SQL Database</a></li>
<li><a href="/docs/demos/local/storageapi">Local Storage API</a></li>
<li><a href="/docs/demos/local/indexeddb">IndexedDB API</a></li>
</ul>

### SQL Databases

The following SQL-related topics are covered in separate demos:

<ul>{useCurrentSidebarCategory().items.filter(item => item.customProps?.sql).map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

### NoSQL Data Stores

Demos for the following "NoSQL" data stores apply structured access patterns:

<ul>{useCurrentSidebarCategory().items.filter(item => item.customProps?.type == "document").map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

Demos for the following "NoSQL" data stores apply unstructured access patterns:

<ul>{useCurrentSidebarCategory().items.filter(item => item.customProps?.type == "nosql").map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>
