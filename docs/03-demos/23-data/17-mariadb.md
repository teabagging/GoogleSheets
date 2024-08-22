---
title: Sheets with MariaDB and MySQL
sidebar_label: MariaDB / MySQL
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  sql: true
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[MariaDB](https://mariadb.com/) is an open source object-relational database
system compatible with MySQL.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS to exchange data between spreadsheets and MariaDB
databases. We'll explore how to save tables from a database to spreadsheets and
how to add data from spreadsheets into a database.

:::caution pass

**It is strongly recommended to use MariaDB with a query builder or ORM.**

While it is possible to generate SQL statements directly, there are many subtle
details and pitfalls. Battle-tested solutions generally provide mitigations
against SQL injection and other vulnerabilities.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| MariaDB  | Connector Library  | Date       |
|:---------|:-------------------|:-----------|
| `11.3.2` | `mysql2` (`3.9.7`) | 2024-05-04 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
loaded in NodeJS scripts that connect to MariaDB and MySQL databases.

This demo uses the `mysql2` connector module[^1], but the same mechanics apply
to other MariaDB and MySQL libraries.

### Exporting Data

`Connection#execute` returns a Promise that resolves to a result array. The
first entry of the result is an array of objects.

The SheetJS `json_to_sheet` method[^2] can generate a worksheet object[^3] from
the array of objects:

```js
const mysql = require("mysql2/promise"), XLSX = require("xlsx");
const conn = await mysql.createConnection({
  database: "SheetJSMariaDB",
  /* ... other options ... */
});

const table_name = "Tabeller1"; // name of table

/* fetch all data from specified table */
const [rows, fields] = await conn.execute(`SELECT * FROM ${mysql.escapeId(table_name)}`);

/* generate a SheetJS worksheet object from the data */
const worksheet = XLSX.utils.json_to_sheet(rows);
```

A workbook object can be built from the worksheet using utility functions[^4].
The workbook can be exported using the SheetJS `writeFile` method[^5]:

```js
/* create a new workbook and add the worksheet */
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");

/* export workbook to XLSX */
XLSX.writeFile(wb, "SheetJSMariaDBExport.xlsx");
```

### Importing Data

The SheetJS `sheet_to_json` function[^6] takes a worksheet object and generates
an array of objects.

Queries must be manually generated from the objects. Assuming the field names
in the object match the column headers, a loop can generate `INSERT` queries.

:::danger pass

**MariaDB does not allow parameterized queries with variable column names**

```sql
INSERT INTO table_name (?) VALUES (?);
-- ---------------------^ variable column names are not valid
```

Queries are generated manually. To help prevent SQL injection vulnerabilities,
the undocumented `escapeId` method [^7] escapes identifiers and fields.

:::

```js
/* generate an array of arrays from the worksheet */
const aoo = XLSX.utils.sheet_to_json(ws);

const table_name = "Blatte1"; // name of table

/* loop through the data rows */
for(let row of aoo) {
  /* generate INSERT column names and values */
  const ent = Object.entries(row);
  const Istr = ent.map(e => I(e[0])).join(", ");
  const Vstr = ent.map(e => E(e[1])).join(", ");

  /* execute INSERT statement */
  await conn.execute(`INSERT INTO ${I(table_name)} (${Istr}) VALUES (${Vstr})`);
}
```

### Creating a Table

The array of objects can be scanned to determine column names and types. With
the names and types, a `CREATE TABLE` query can be written.

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

The `aoo_to_mariadb_table` function:

- scans each row object to determine column names and types
- drops and creates a new table with the determined column names and types
- loads the entire dataset into the new table

```js
/* create table and load data given an array of objects and a mysql2 connection */
async function aoo_to_mariadb_table(conn, aoo, table_name) {
  /* define types that can be converted (e.g. boolean can be stored in float) */
  const T_FLOAT = ["DOUBLE", "BOOLEAN"];
  const T_BOOL =  ["BOOLEAN"];

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
        case "number": if(!types[k] || T_FLOAT.includes(types[k])) types[k] = "DOUBLE"; break;
        /* change type if it is empty or can be stored in a boolean */
        case "boolean": if(!types[k] || T_BOOL.includes(types[k])) types[k] = "BOOLEAN"; break;
        /* no other type can hold strings */
        case "string": types[k] = "TEXT"; break;
        default: types[k] = "TEXT"; break;
      }
    })
  );

  const I = (id) => mysql.escapeId(id), E = (d) => mysql.escape(d);

  /* Delete table if it exists in the DB */
  await conn.execute(`DROP TABLE IF EXISTS ${I(table_name)};`);

  /* Create table */
  {
    const Istr = Object.entries(types).map(e => `${I(e[0])} ${e[1]}`).join(", ");
    await conn.execute(`CREATE TABLE ${I(table_name)} (${Istr});`);
  }

  /* Insert each row */
  for(let row of aoo) {
    const ent = Object.entries(row);
    const Istr = ent.map(e => I(e[0])).join(", ");
    const Vstr = ent.map(e => E(e[1])).join(", ");
    await conn.execute(`INSERT INTO ${I(table_name)} (${Istr}) VALUES (${Vstr})`);
  }

  return conn;
}
```

</details>

## Complete Example

0) Install and start the MariaDB server.

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

On macOS, install the `mariadb` formula with Homebrew:

```bash
brew install mariadb
```

The last few lines of the installer explain how to start the database:

```text
Or, if you don't want/need a background service you can just run:
// highlight-next-line
  /usr/local/opt/mariadb/bin/mysqld_safe --datadir\=/usr/local/var/mysql
```

Run the command to start a local database instance.

</details>

1) Drop any existing database with the name `SheetJSMariaDB`:

```bash
mysql -e 'drop database if exists SheetJSMariaDB;'
```

:::info pass

If the server is running elsewhere, or if the username is different from the
current user, command-line flags can override the defaults.

| Option        | Explanation
|:--------------|:--------------------------|
| `-h HOSTNAME` | Name of the server        |
| `-P PORT`     | specifies the port number |
| `-U USERNAME` | specifies the username    |
| `-p PASSWORD` | specifies the password    |

:::

2) Create an empty `SheetJSMariaDB` database:

```bash
mysql -e 'create database SheetJSMariaDB;'
```

### Connector Test

3) Create a project folder:

```bash
mkdir sheetjs-mariadb
cd sheetjs-mariadb
npm init -y
```

4) Install the `mysql2` connector module:

```bash
npm i --save mysql2@3.6.5
```

5) Save the following example codeblock to `MariaDBTest.js`:

```js title="MariaDBTest.js"
const mysql = require("mysql2/promise");
(async() => {

const conn = await mysql.createConnection({
  database:"SheetJSMariaDB",
// highlight-start
  host: "127.0.0.1", // localhost
  port: 3306,
  user: "sheetjs",
  //password: ""
// highlight-end
});

const [rows, fields] = await conn.execute('SELECT ? as message', ['Hello world!']);
console.log(rows[0].message); // Hello world!
await conn.end();

})();
```

6) Edit the new `MariaDBTest.js` script and modify the highlighted lines from
the codeblock to reflect the database deployment settings.

- Set `user` to the username (it is almost certainly not `"sheetjs"`)

- If the server is not running on your computer, set `host` and `port` to the
correct host name and port number.

- If the server expects a password, uncomment the `password` line and replace
the value with the password.

7) Run the script:

```bash
node MariaDBTest.js
```

It should print `Hello world!`

:::caution pass

If the output is not `Hello world!` or if there is an error, please report the
issue to the `mysql2` connector project for further diagnosis.

:::

### Add SheetJS

8) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

9) Download [`SheetJSMariaDB.js`](pathname:///mariadb/SheetJSMariaDB.js):

```bash
curl -LO https://docs.sheetjs.com/mariadb/SheetJSMariaDB.js
```

This script will:
- read and parse the test file `pres.numbers`
- create a connection to the `SheetJSMariaDB` database on a local MariaDB server
- load data from the first worksheet into a table with name `Presidents`
- disconnect and reconnect to the database
- dump data from the table `Presidents`
- export the dataset to `SheetJSMariaDB.xlsx`

10) Edit the `SheetJSMariaDB.js` script.

The script defines an `opts` object:

```js title="SheetJSMariaDB.js (configuration lines)"
const XLSX = require("xlsx");
const opts = {
  database:"SheetJSMariaDB",
// highlight-start
  host: "127.0.0.1", // localhost
  port: 3306,
  user: "sheetjs",
  //password: ""
// highlight-end
};
```

Modify the highlighted lines to reflect the database deployment settings.

- Set `user` to the username (it is almost certainly not `"sheetjs"`)

- If the server is not running on your computer, set `host` and `port` to the
correct host name and port number.

- If the server expects a password, uncomment the `password` line and replace
the value with the password.

11) Fetch the example file [`pres.numbers`](https://docs.sheetjs.com/pres.numbers):

```bash
curl -L -O https://docs.sheetjs.com/pres.numbers
```

12) Run the script:

```bash
node SheetJSMariaDB.js
```

13) Verify the result:

- `SheetJSMariaDBExport.xlsx` can be opened in a spreadsheet app or tested in the terminal

```bash
npx xlsx-cli SheetJSMariaDBExport.xlsx
```

- The database server can be queried using the `mysql` command line tool.

If the server is running locally, the command will be:

```bash
mysql -D SheetJSMariaDB -e 'SELECT * FROM `Presidents`;'
```

The output should be consistent with the following table:

```
+--------------+-------+
| Name         | Index |
+--------------+-------+
| Bill Clinton |    42 |
| GeorgeW Bush |    43 |
| Barack Obama |    44 |
| Donald Trump |    45 |
| Joseph Biden |    46 |
+--------------+-------+
```

[^1]: See [the official `mysql2` website](https://sidorares.github.io/node-mysql2/docs) for more info.
[^2]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^3]: See ["Sheet Objects"](/docs/csf/sheet) in "SheetJS Data Model" for more details.
[^4]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^6]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^7]: The `mysql2` connector library `escapeId` method is not mentioned in the documentation but is present in the TypeScript definitions.
