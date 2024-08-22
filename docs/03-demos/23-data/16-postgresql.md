---
title: Sheets with PostgreSQL
sidebar_label: PostgreSQL
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  sql: true
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[PostgreSQL](https://postgresql.org/) (colloquially referenced as "Postgres") is
an open source object-relational database system.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS to exchange data between spreadsheets and PostgreSQL
databases. We'll explore how to save tables from a database to spreadsheets and
how to add data from spreadsheets into a database.

:::caution pass

**It is strongly recommended to use PostgreSQL with a query builder or ORM.**

While it is possible to generate SQL statements directly, there are many subtle
details and pitfalls. Battle-tested solutions generally provide mitigations
against SQL injection and other vulnerabilities.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Postgres | Connector Library | Date       |
|:---------|:------------------|:-----------|
| `16.2.1` | `pg` (`8.11.4`)   | 2024-03-31 |
| `15.6`   | `pg` (`8.11.4`)   | 2024-03-31 |
| `14.11`  | `pg` (`8.11.4`)   | 2024-03-31 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
loaded in NodeJS scripts that connect to PostgreSQL databases.

This demo uses the `pg` connector module[^1], but the same mechanics apply to
other PostgreSQL libraries.

### Exporting Data

`Client#query` returns a Promise that resolves to a result set. The `rows`
property of the result is an array of objects.

The SheetJS `json_to_sheet` method[^2] can generate a worksheet object[^3] from
the array of objects:

```js
const table_name = "Tabeller1"; // name of table

/* fetch all data from specified table */
const res = await client.query(`SELECT * FROM ${table_name}`);

/* generate a SheetJS worksheet object from the data */
const worksheet = XLSX.utils.json_to_sheet(res.rows);
```

A workbook object can be built from the worksheet using utility functions[^4].
The workbook can be exported using the SheetJS `writeFile` method[^5]:

```js
/* create a new workbook and add the worksheet */
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");

/* export workbook to XLSX */
XLSX.writeFile(wb, "SheetJSPGExport.xlsx");
```

### Importing Data

The SheetJS `sheet_to_json` function[^6] takes a worksheet object and generates
an array of objects.

Queries must be manually generated from the objects. Assuming the field names
in the object match the column headers, a loop can generate `INSERT` queries.

:::danger pass

**PostgreSQL does not allow parameterized queries with variable column names**

```sql
INSERT INTO table_name (?) VALUES (?);
-- ---------------------^ variable column names are not valid
```

Queries are generated manually. To help prevent SQL injection vulnerabilities,
the `pg-format`[^7] module escapes identifiers and fields.

:::

```js
/* generate an array of arrays from the worksheet */
const aoo = XLSX.utils.sheet_to_json(ws);

const table_name = "Blatte1"; // name of table

/* loop through the data rows */
for(let row of aoo) {

  /* generate format helper strings */
  const ent = Object.entries(row);
  const Istr = Array.from({length: entries.length}, ()=>"%I").join(", ");
  const Lstr = Array.from({length: entries.length}, ()=>"%L").join(", ");

  /* generate INSERT statement */
  let query = format.withArray(
    `INSERT INTO %I (${Istr}) VALUES(${Lstr})`,
    [ table_name, ...ent.map(x => x[0]), ...ent.map(x => x[1]) ]
  );

  /* execute INSERT statement */
  await client.query(query);
}
```

### Creating a Table

The array of objects can be scanned to determine column names and types. With
the names and types, a `CREATE TABLE` query can be written.

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

The `aoo_to_pg_table` function:

- scans each row object to determine column names and types
- drops and creates a new table with the determined column names and types
- loads the entire dataset into the new table

```js
/* create table and load data given an array of objects and a PostgreSQL client */
async function aoo_to_pg_table(client, aoo, table_name) {
  /* define types that can be converted (e.g. boolean can be stored in float) */
  const T_FLOAT = ["float8", "boolean"];
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
        case "number": if(!types[k] || T_FLOAT.includes(types[k])) types[k] = "float8"; break;
        /* change type if it is empty or can be stored in a boolean */
        case "boolean": if(!types[k] || T_BOOL.includes(types[k])) types[k] = "boolean"; break;
        /* no other type can hold strings */
        case "string": types[k] = "text"; break;
        default: types[k] = "text"; break;
      }
    })
  );

  /* Delete table if it exists in the DB */
  const query = format("DROP TABLE IF EXISTS %I;", table_name);
  await client.query(query);

  /* Create table */
  {
    const entries = Object.entries(types);
    const Istr = entries.map(e => format(`%I ${e[1]}`, e[0])).join(", ");
    let query = format.withArray(`CREATE TABLE %I (${Istr});`, [ table_name ]);
    await client.query(query);
  }

  /* Insert each row */
  for(let row of aoo) {
    const ent = Object.entries(row);
    const Istr = Array.from({length: ent.length}, ()=>"%I").join(", ");
    const Lstr = Array.from({length: ent.length}, ()=>"%L").join(", ");
    let query = format.withArray(
      `INSERT INTO %I (${Istr}) VALUES (${Lstr});`,
      [ table_name, ...ent.map(x => x[0]), ...ent.map(x => x[1]) ]
    );
    await client.query(query);
  }

  return client;
}
```

</details>


## Complete Example

0) Install and start the PostgreSQL server.

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

On macOS, install the `postgresql` formula with Homebrew:

```bash
brew install postgresql@16
```

The last few lines of the installer explain how to start the database:

```text
Or, if you don't want/need a background service you can just run:
// highlight-next-line
  LC_ALL="C" /usr/local/opt/postgresql@16/bin/postgres -D /usr/local/var/postgresql@16
```

Run the command to start a local database instance.

</details>

1) Drop any existing database with the name `SheetJSPG`:

```bash
dropdb SheetJSPG
```

:::info pass

If the server is running elsewhere, or if the username is different from the
current user, command-line flags can override the defaults.

| Option        | Explanation
|:--------------|:--------------------------|
| `-h HOSTNAME` | Name of the server        |
| `-p PORT`     | specifies the port number |
| `-U USERNAME` | specifies the username    |

:::

2) Create an empty `SheetJSPG` database using the `createdb` command:

```bash
createdb SheetJSPG
```

:::note pass

`createdb` supports the same `-h`, `-p`, and `-U` flags as `dropdb`.

:::

### Connector Test

3) Create a project folder:

```bash
mkdir sheetjs-pg
cd sheetjs-pg
npm init -y
```

4) Install the `pg` connector module:

```bash
npm i --save pg@8.11.4
```

5) Save the following example codeblock to `PGTest.js`:

```js title="PGTest.js"
const pg = require("pg");
const client = new pg.Client({
  database:"SheetJSPG",
// highlight-start
  host: "127.0.0.1", // localhost
  port: 5432,
  //user: "",
  //password: ""
// highlight-end
});
(async() => {

await client.connect();
const res = await client.query('SELECT $1::text as message', ['Hello world!']);
console.log(res.rows[0].message); // Hello world!
await client.end();

})();
```

6) Edit the new `PGTest.js` script and modify the highlighted lines from the
codeblock to reflect the database deployment settings.

The settings in the codeblock match the default configuration for macOS Homebrew
PostgreSQL server. For other deployments:

- If the server is not running on your computer, set `host` and `port` to the
correct host name and port number.

- If the server expects a different username and password, uncomment the `user`
and `password` lines and replace the values with the username and password.

7) Run the script:

```bash
node PGTest.js
```

It should print `Hello world!`

:::caution pass

If the output is not `Hello world!` or if there is an error, please report the
issue to the `pg` connector project for further diagnosis.

:::

### Add SheetJS

8) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz pg-format@1.0.4`}
</CodeBlock>

9) Download [`SheetJSPG.js`](pathname:///postgresql/SheetJSPG.js):

```bash
curl -LO https://docs.sheetjs.com/postgresql/SheetJSPG.js
```

This script will:
- read and parse the test file `pres.numbers`
- create a connection to the `SheetJSPG` database on a local PostgreSQL server
- load data from the first worksheet into a table with name `Presidents`
- disconnect and reconnect to the database
- dump data from the table `Presidents`
- export the dataset to `SheetJSPG.xlsx`

10) Edit the `SheetJSPG.js` script.

The script defines an `opts` object:

```js title="SheetJSPG.js (configuration lines)"
const XLSX = require("xlsx");
const opts = {
  database:"SheetJSPG",
// highlight-start
  host: "127.0.0.1", // localhost
  port: 5432,
  //user: "",
  //password: ""
// highlight-end
};
```

The settings in the codeblock match the default configuration for macOS Homebrew
PostgreSQL server. For other deployments:

- If the server is not running on your computer, set `host` and `port` to the
correct host name and port number.

- If the server expects a different username and password, uncomment the `user`
and `password` lines and replace the values with the username and password.

11) Fetch the example file [`pres.numbers`](https://docs.sheetjs.com/pres.numbers):

```bash
curl -L -O https://docs.sheetjs.com/pres.numbers
```

12) Run the script:

```bash
node SheetJSPG.js
```

13) Verify the result:

- `SheetJSPGExport.xlsx` can be opened in a spreadsheet app or tested in the terminal

```bash
npx xlsx-cli SheetJSPGExport.xlsx
```

- The database server can be queried using the `psql` command line tool.

If the server is running locally, the command will be:

```bash
psql SheetJSPG -c 'SELECT * FROM "Presidents";'
```

:::note pass

`psql` supports the same `-h`, `-p`, and `-U` flags as `dropdb` and `createdb`.

:::


[^1]: See [the official `pg` website](https://node-postgres.com/) for more info.
[^2]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^3]: See ["Sheet Objects"](/docs/csf/sheet) in "SheetJS Data Model" for more details.
[^4]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^6]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^7]: The [`pg-format`](https://npm.im/pg-format) package is available on the public NPM registry. Even though the project is marked as deprecated, the official [`pg` website still recommends `pg-format`](https://node-postgres.com/features/queries#parameterized-query:~:text=use%20pg%2Dformat%20package%20for%20handling%20escaping)