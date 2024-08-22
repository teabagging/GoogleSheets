---
title: Knex SQL Builder
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  sql: true
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[KnexJS](https://knexjs.org/) is a SQL query builder with support for a number
of SQL dialects.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses KnexJS and SheetJS to exchange data between spreadsheets and SQL
servers. We'll explore how to use save tables from a database to spreadsheets
and how to add data from spreadsheets into a database.

:::note Tested Deployments

This demo was tested in the following environments:

| Version   | Database | Connector Module | Date       |
|:----------|:---------|:-----------------|:-----------|
| `0.21.20` | SQLite   | `sqlite3`        | 2024-04-09 |
| `2.4.2`   | SQLite   | `better-sqlite3` | 2024-04-09 |
| `2.5.1`   | SQLite   | `better-sqlite3` | 2024-04-09 |
| `3.1.0`   | SQLite   | `better-sqlite3` | 2024-04-09 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
loaded in NodeJS scripts that use KnexJS.

### Exporting Data

The KnexJS `select` method[^1] creates a `SELECT` query. The return value is a
Promise that resolves to an array of objects.

The SheetJS `json_to_sheet` method[^2] can generate a worksheet object[^3] from
the array of objects:

```js
const table_name = "Tabeller1"; // name of table

/* fetch all data from specified table */
const aoo = await knex.select("*").from(table_name);

/* generate a SheetJS worksheet object from the data */
const worksheet = XLSX.utils.json_to_sheet(aoo);
```

A workbook object can be built from the worksheet using utility functions[^4].
The workbook can be exported using the SheetJS `writeFile` method[^5]:

```js
/* create a new workbook and add the worksheet */
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");

/* export workbook to XLSX */
XLSX.writeFile(wb, "SheetJSKnexJSExport.xlsx");
```

### Importing Data

The SheetJS `sheet_to_json` function[^6] takes a worksheet object and generates
an array of objects.

The KnexJS `insert` method[^7] creates `INSERT` queries. The return value is a
Promise that resolves when the query is executed:

```js
const table_name = "Blatte1"; // name of table

/* generate an array of arrays from the worksheet */
const aoo = XLSX.utils.sheet_to_json(ws);

/* insert every row into the specified database table */
await knex.insert(aoo).into(table_name);
```

### Creating a Table

The KnexJS Schema Builder supports creating tables with `createTable`[^8] and
dropping tables with `dropTableIfExists`[^9].

The array of objects can be scanned to determine column names and types.

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

The `aoo_to_knex_table` function:

- scans each row object to determine column names and types
- drops and creates a new table with the determined column names and types
- loads the entire dataset into the new table

```js
/* create table and load data given an array of objects and a Knex connection */
async function aoo_to_knex_table(knex, aoo, table_name) {
  /* define types that can be converted (e.g. boolean can be stored in float) */
  const T_FLOAT = ["float", "boolean"];
  const T_BOOL = ["boolean"];

  /* types is a map from column headers to Knex schema column type */
  const types = {};

  /* names is an ordered list of the column header names */
  const names = [];

  /* loop across each row object */
  aoo.forEach(row =>
    /* Object.entries returns a row of [key, value] pairs */
    Object.entries(row).forEach(([k,v]) => {

      /* If this is first occurrence, mark unknown and append header to names */
      if(!types[k]) { types[k] = ""; names.push(k); }

      /* skip null and undefined values */
      if(v == null) return;

      /* check and resolve type */
      switch(typeof v) {
        /* change type if it is empty or can be stored in a float */
        case "number": if(!types[k] || T_FLOAT.includes(types[k])) types[k] = "float"; break;
        /* change type if it is empty or can be stored in a boolean */
        case "boolean": if(!types[k] || T_BOOL.includes(types[k])) types[k] = "boolean"; break;
        /* no other type can hold strings */
        case "string": types[k] = "text"; break;
        default: types[k] = "text"; break;
      }
    })
  );

  /* Delete table if it exists in the DB */
  await knex.schema.dropTableIfExists(table_name);

  /* use column type info to create table */
  await knex.schema.createTable(table_name, (table) => {
    names.forEach(h => {
      /* call schema function e.g. table.text("Name"); table.float("Index"); */
      table[types[h] || "text"](h);
    });
  });

  /* insert each row */
  await knex.insert(aoo).into(table_name);
  return knex;
}
```

</details>

:::note pass

The `Knex` constructor may display a warning when connecting to SQLite:

```
sqlite does not support inserting default values. Set the `useNullAsDefault` flag to hide this warning. (see docs https://knexjs.org/guide/query-builder.html#insert).
```

That flag should be added to the options argument:

```js
const Knex = require('knex');
let knex = Knex({
  client: 'better-sqlite3',
  connection: { filename: "SheetJSKnex.db" },
  // highlight-next-line
  useNullAsDefault: true
});
```

:::

## Complete Example

1) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz knex better-sqlite3`}
</CodeBlock>

:::note pass

For KnexJS version `0.21.20`, the `sqlite3` module must be installed:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz knex sqlite3`}
</CodeBlock>

:::

2) Download the [test file](https://docs.sheetjs.com/pres.numbers)

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
```

3) Download [`SheetJSKnexTest.js`](pathname:///knex/SheetJSKnexTest.js):

```bash
curl -LO https://docs.sheetjs.com/knex/SheetJSKnexTest.js
```

This script will:
- read and parse the test file `pres.numbers`
- create a connection to a SQLite database stored at `SheetJSKnex.db`
- load data from the first worksheet into a table with name `Test_Table`
- disconnect and reconnect to the database
- dump data from the table `Test_Table`
- export the dataset to `SheetJSKnex.xlsx`

4) Run the script:

```bash
node SheetJSKnexTest.js
```

The script will generate two artifacts:

`SheetJSKnex.xlsx` can be opened in a spreadsheet app or tested in the terminal:

```bash
npx xlsx-cli SheetJSKnex.xlsx
```

`SheetJSKnex.db` can be verified with the `sqlite3` command line tool:

```bash
sqlite3 SheetJSKnex.db 'select * from Test_Table'
```

:::caution pass

Older versions of KnexJS will throw an error:

```
Error: knex: Unknown configuration option 'client' value better-sqlite3. Note that it is case-sensitive, check documentation for supported values.
```

Older versions of KnexJS do not support the `better-sqlite3` module. The
`SheetJSKnexTest.js` script must be edited to use `sqlite3`:

```js title="SheetJSKnexTest.js (edit highlighted lines)"
(async() => {
  /* open connection to SheetJSKnex.db */
  // highlight-next-line
  let knex = Knex({ client: 'sqlite3', connection: { filename: "SheetJSKnex.db" }, useNullAsDefault: true });

  try {
    /* generate array of objects from worksheet */
    const aoo = XLSX.utils.sheet_to_json(oldws);

    /* create table and load data */
    await aoo_to_knex_table(knex, aoo, "Test_Table");
  } finally {
    /* disconnect */
    knex.destroy();
  }

  /* reconnect to SheetJSKnex.db */
  // highlight-next-line
  knex = Knex({ client: 'sqlite3', connection: { filename: "SheetJSKnex.db" }, useNullAsDefault: true });
```
:::

[^1]: See [`select`](https://knexjs.org/guide/query-builder.html#select) in the KnexJS query builder documentation.
[^2]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^3]: See ["Sheet Objects"](/docs/csf/sheet) in "SheetJS Data Model" for more details.
[^4]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^6]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^7]: See [`insert`](https://knexjs.org/guide/query-builder.html#insert) in the KnexJS query builder documentation.
[^8]: See [`createTable`](https://knexjs.org/guide/schema-builder.html#createtable) in the KnexJS Schema Builder documentation.
[^9]: See [`dropTableIfExists`](https://knexjs.org/guide/schema-builder.html#droptableifexists) in the KnexJS Schema Builder documentation.
