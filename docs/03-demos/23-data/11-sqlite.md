---
title: Sheets with SQLite
sidebar_label: SQLite
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  sql: true
---

<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js"></script>
</head>

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[SQLite](https://sqlite.org/) is a lightweight embeddable SQL database engine.
There are connector libraries for many popular JavaScript server-side platforms.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SQLite and SheetJS to exchange data between spreadsheets and SQL
servers. We'll explore how to use save tables from a database to spreadsheets
and how to add data from spreadsheets into a database.

:::info pass

This demo covers SQLite `.db` file processing.

The [WebSQL demo](/docs/demos/local/websql) covers the Web SQL Database API, a
SQLite-compatible database built into Chromium and Google Chrome.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Platform         | Connector Library          | Date       |
|:-----------------|:---------------------------|:-----------|
| Chromium 122     | `sql.js` (`1.8.0`)         | 2024-04-09 |
| NodeJS `20.12.1` | `better-sqlite3` (`9.4.5`) | 2024-04-09 |
| BunJS `1.1.3`    | (built-in)                 | 2024-04-09 |
| Deno `1.42.1`    | `sqlite` (`3.8`)           | 2024-04-09 |

:::

## Demo

The following examples show how to query for each table in an SQLite database,
query for the data for each table, add each non-empty table to a workbook, and
export as XLSX.

#### Sample Database

The Chinook database is a MIT-licensed sample database. The original source code
repository `http://chinookdatabase.codeplex.com` is no longer available, so the
[raw SQL queries are mirrored here](pathname:///sqlite/chinook.sql).

### Exporting Data

Connector libraries typically provide a way to generate an array of objects from
the result of a `SELECT` query. For example, using `better-sqlite3` in NodeJS:

```js
import Database from "better-sqlite3";

/* open database */
var db = Database("chinook.db");

/* get data from the `Invoice` table */
var aoo = db.prepare("SELECT * FROM 'Invoice' LIMIT 100000").all();
```

The SheetJS `json_to_sheet` method[^1] can take the result and generate a
worksheet object[^2]. The `book_new` and `book_append_sheet` methods[^3] help
build a workbook object[^4]. The `writeFile` method[^5] generates a file:

```js
import * as XLSX from "xlsx";

/* Create Worksheet from the row objects */
var ws = XLSX.utils.json_to_sheet(aoo, {dense: true});

/* Add to Workbook */
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

/* Write File */
XLSX.writeFile(wb, "SheetJSQLiteNode.xlsx");
```

### Importing Data

The ["Generating Tables"](/docs/demos/data/sql#generating-tables) section
includes a code snippet for generating SQLite-compatible SQL queries from a
SheetJS worksheet object. Each query can be run sequentially.

## Browser

`sql.js`[^6] is a compiled version of SQLite into WebAssembly, making it usable
in web browsers.

SQLite database files can be `fetch`ed and loaded:

```js
/* Load sql.js library */
const SQL = await initSqlJs(config);
/* fetch sqlite database */
const ab = await (await fetch("/sqlite/chinook.db")).arrayBuffer();
/* connect to DB */
const db = new SQL.Database(new Uint8Array(ab));
```

The `sql.js` connector library uses an iterator-like interface. After preparing
a statement, `Statement#step` loops over the result and `Statement#getAsObject`
pulls each row as a row object:

```js
/* perform query and get iterator */
const sql = db.prepare("SELECT * FROM 'Invoice' LIMIT 100000").all();

/* create worksheet from the row objects */
let ws;

while(sql.step()) {
  const row = sql.getAsObject();

  if(!ws) ws = XLSX.utils.json_to_sheet([row], {dense: true, header});
  else XLSX.utils.sheet_add_json(ws, [row], { header, origin: -1, skipHeader: true});
}
```

### Demo

This demo fetches [`chinook.db`](pathname:///sqlite/chinook.db), loads into the
SQLite engine and performs a series of queries to extract the data. Worksheets
are created from the data. A workbook is created from the worksheets and
exported to a XLSX file.

```jsx live
function SheetJSQLJS() { return (<button onClick={async() => {
  /* Load sql.js library */
  const config = {
    locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
  }
  const SQL = await initSqlJs(config);

  /* Initialize database */
  const ab = await (await fetch("/sqlite/chinook.db")).arrayBuffer();
  const db = new SQL.Database(new Uint8Array(ab));

  /* Create new workbook */
  const wb = XLSX.utils.book_new();

  /* Get all table names */
  const sql = db.prepare("SELECT name FROM sqlite_master WHERE type='table'");
  while(sql.step()) {
    const row = sql.getAsObject();

    /* Get first 100K rows */
    const stmt = db.prepare("SELECT * FROM '" + row.name + "' LIMIT 100000");
    let header = [];
    let ws;
    while(stmt.step()) {
      /* create worksheet from headers */
      if(!ws) ws = XLSX.utils.aoa_to_sheet([header = stmt.getColumnNames()])

      const rowobj = stmt.getAsObject();
      /* add to sheet */
      XLSX.utils.sheet_add_json(ws, [rowobj], { header, origin: -1, skipHeader: true });
    }
    if(ws) XLSX.utils.book_append_sheet(wb, ws, row.name);
  }
  XLSX.writeFile(wb, "SheetJSQLJS.xlsx");
}}><b>Click here to start</b></button>) }
```

## Server-Side Platforms

### NodeJS

The `better-sqlite3`[^7] native module embeds the SQLite C library.
`Statement#all` runs a prepared statement and returns an array of objects:

```js
import Database from "better-sqlite3";
import * as XLSX from "xlsx";

/* open database */
var db = Database("chinook.db");

/* get data from the `Invoice` table */
var aoo = db.prepare("SELECT * FROM 'Invoice' LIMIT 100000").all();

/* create worksheet from the row objects */
var ws = XLSX.utils.json_to_sheet(aoo, {dense: true});
```

#### NodeJS Demo

0) Build `chinook.db` from [the SQL statements](pathname:///sqlite/chinook.sql):

```bash
curl -LO https://docs.sheetjs.com/sqlite/chinook.sql
sqlite3 chinook.db ".read chinook.sql"
```

1) Install the dependencies:

<CodeBlock language="bash">{`\
npm init -y
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz better-sqlite3@9.2.0`}
</CodeBlock>

2) Download [`SheetJSQLiteNode.mjs`](pathname:///sqlite/SheetJSQLiteNode.mjs):

```bash
curl -LO https://docs.sheetjs.com/sqlite/SheetJSQLiteNode.mjs
```

3) Run the script:

```bash
node SheetJSQLiteNode.mjs
```

Open `SheetJSQLiteNode.xlsx` with a spreadsheet editor.

### Bun

Bun ships with a built-in high-performance module `bun:sqlite`[^8]:

```js
import { Database } from "bun:sqlite";
import * as XLSX from "xlsx";

/* open database */
var db = Database.open("chinook.db");

/* get data from the `Invoice` table */
var aoo = db.prepare("SELECT * FROM 'Invoice' LIMIT 100000").all();

/* create worksheet from the row objects */
var ws = XLSX.utils.json_to_sheet(aoo, {dense: true});
```

#### BunJS Demo

0) Build `chinook.db` from [the SQL statements](pathname:///sqlite/chinook.sql):

```bash
curl -LO https://docs.sheetjs.com/sqlite/chinook.sql
sqlite3 chinook.db ".read chinook.sql"
```

1) Install the dependencies:

<CodeBlock language="bash">{`\
bun install https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

2) Download [`SheetJSQLiteBun.mjs`](pathname:///sqlite/SheetJSQLiteBun.mjs):

```bash
curl -LO https://docs.sheetjs.com/sqlite/SheetJSQLiteBun.mjs
```

3) Run the script:

```bash
bun run SheetJSQLiteBun.mjs
```

Open `SheetJSQLiteBun.xlsx` with a spreadsheet editor.

### Deno

Deno `sqlite` library[^9] returns raw arrays of arrays:

<CodeBlock language="ts">{`\
import { DB } from "https://deno.land/x/sqlite/mod.ts";
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from "https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs";
\n\
/* open database */
var db = new DB("chinook.db");
\n\
/* get data from the \`Invoice\` table */
var aoa = db.prepareQuery("SELECT * FROM 'Invoice' LIMIT 100000").all();
\n\
/* create worksheet from the row objects */
var data = [query.columns().map(x => x.name)].concat(aoa);
var ws = XLSX.utils.aoa_to_sheet(data, {dense: true});`}
</CodeBlock>

#### Deno Demo

0) Build `chinook.db` from [the SQL statements](pathname:///sqlite/chinook.sql):

```bash
curl -LO https://docs.sheetjs.com/sqlite/chinook.sql
sqlite3 chinook.db ".read chinook.sql"
```

1) Download [`SheetJSQLiteDeno.ts`](pathname:///sqlite/SheetJSQLiteDeno.ts):

```bash
curl -LO https://docs.sheetjs.com/sqlite/SheetJSQLiteDeno.ts
```

2) Run the script:

```bash
deno run --allow-read --allow-write SheetJSQLiteDeno.ts
```

Open `SheetJSQLiteDeno.xlsx` with a spreadsheet editor.

[^1]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^2]: See ["Sheet Objects"](/docs/csf/sheet) in "SheetJS Data Model" for more details.
[^3]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^4]: See ["Workbook Objects"](/docs/csf/book) in "SheetJS Data Model" for more details.
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^6]: See [the `sql.js` documentation](https://sql.js.org/documentation/)
[^7]: The [documentation](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md) can be found in the project repository.
[^8]: See ["SQLite"](https://bun.sh/docs/api/sqlite) in the BunJS documentation.
[^9]: See [the `sqlite` module](https://deno.land/x/sqlite) on the Deno module registry.