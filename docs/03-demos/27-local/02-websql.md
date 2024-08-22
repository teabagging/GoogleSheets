---
title: Sheets with WebSQL
sidebar_label: Web SQL Database
pagination_prev: demos/data/index
pagination_next: demos/cloud/index
sidebar_custom_props:
  summary: Reading and writing data in an in-browser SQL database
---

import CodeBlock from '@theme/CodeBlock';

:::danger pass

WebSQL is no longer supported in Chrome or Safari.

For SQL in the browser, there are a few alternatives:

- [SQL.js](/docs/demos/data/sqlite#browser) is a compiled version of SQLite
- [AlaSQL](/docs/demos/data/alasql) is a pure-JS SQL engine backed by IndexedDB

:::

WebSQL (formally "Web SQL Database") was a popular SQL-based in-browser database
available in Chromium and Safari. In practice, it was powered by SQLite. Many
SQLite-compatible queries were supported by WebSQL engines.

:::note Historical Context

Google and Apple developed and supported WebSQL. Legacy browser vendors fought
against standardization and ultimately broke the web by forcing the deprecation
of the storied API.

Leveraging new technologies, many websites ship with an in-browser SQL database.

:::

The public demo https://sheetjs.com/sql generates a database from workbook.

:::info pass

WebSQL is not commonly available on server-side platforms. Typically scripts
will directly query SQLite databases using connector modules.

[The "SQLite" demo](/docs/demos/data/sqlite) covers NodeJS and other platforms.

:::

## Overview

Environments that support WebSQL expose the `openDatabase` global method. It
takes 4 arguments:
- internal database name
- version string (`1.0`)
- public display name
- database size (measured in bytes)

The following command attempts to connect to the database named `sheetql`. If
the database does not exist, it will create a new database with a hint to
allocate 2MB of space.

```js
const db = openDatabase('sheetql', '1.0', 'SheetJS WebSQL Test', 2097152);
```

### Transactions and Queries

Queries are performed within transactions.

`Database#transaction` passes a transaction object to the callback argument:

```js
db.transaction(function(tx) {
  /* tx is a transaction object */
});
```

Within a transaction, queries are performed with `Transaction#executeSql`. The
method takes 4 arguments:
- SQL statement stored in a string
- Array of parameterized query arguments
- Success callback
- Error callback

If the query succeeds, the success callback will be invoked with two arguments:
- Transaction object
- Result of the query

If the query fails, the error callback will be invoked with two arguments:
- Transaction object
- Error information

The Web SQL Database API is callback-based. The following snippet runs one query
and wraps the execution in a promise that resolves to the query result or
rejects with the error:

```js
function execute_simple_query(db, query) {
  return new Promise((resolve, reject) => {
    db.transaction(tx =>
      tx.executeSQL(query, [],
        (tx, data) => resolve(data),
        (tx, err) => reject(err)
      )
    );
  });
}
```

### Importing Data

Importing data from spreadsheets is straightforward using the `generate_sql`
helper function from ["Generating Tables"](/docs/demos/data/sql#generating-tables)

```js
const stmts = generate_sql(ws, wsname);

// NOTE: tx.executeSql and db.transaction use callbacks. This wraps in Promises
for(var stmt of stmts) await new Promise((res, rej) => {
  db.transaction(tx =>
    tx.executeSql(stmt, [],
      (tx, data) => res(data), // if the query is successful, return the data
      (tx, err) => rej(err) // if the query fails, reject with the error
  ));
});
```

Typically worksheet objects are extracted from workbook objects[^1] generated
from the SheetJS `read` or `readFile` methods[^2].

### Exporting Data

The result of a SQL SELECT statement is a `SQLResultSet`.  The `rows` property
is a `SQLResultSetRowList`.  It is an "array-like" structure that has `length`
and properties like `0`, `1`, etc.  However, this is not a real Array object!

A real Array can be created using `Array.from`. The SheetJS `json_to_sheet`
method[^3] can generate a worksheet object[^4] from the real array:

```js
db.readTransaction(tx =>
  tx.executeSQL("SELECT * FROM DatabaseTable", [], (tx, data) => {
    // data.rows is "array-like", so `Array.from` can make it a real array
    const aoo = Array.from(data.rows);
    const ws = XLSX.utils.json_to_sheet(aoo);
    // ... perform an export here OR wrap in a Promise
  })
);
```

Using `book_new` and `book_append_sheet`[^5], a workbook object can be created.
This workbook is typically exported to the filesystem with `writeFile`[^6].

## Live Demo

:::note Tested Deployments

This browser demo was tested in the following environments:

| Browser     | Date       |
|:------------|:-----------|
| Chrome 118  | 2024-06-29 |

Browsers that do not support WebSQL will throw errors:

| Browser     | Date       | Error Message                 |
|:------------|:-----------|:------------------------------|
| Chrome 126  | 2024-06-29 | `openDatabase is not defined` |
| Safari 17.1 | 2024-06-29 | `Web SQL is deprecated`       |
| Firefox 127 | 2024-06-29 | `openDatabase is not defined` |

:::

### Export Demo

The following demo generates a database with 5 fixed SQL statements. Queries
can be changed in the Live Editor.  The WebSQL database can be inspected in the
"WebSQL" section of the "Application" Tab of Developer Tools:

![WebSQL view in Developer Tools](pathname:///files/websql.png)

```jsx live
function SheetQL() {
  const [out, setOut] = React.useState("");
  const queries = [
    'DROP TABLE IF EXISTS Presidents',
    'CREATE TABLE Presidents (Name TEXT, Idx REAL)',
    'INSERT INTO Presidents  (Name, Idx) VALUES ("Barack Obama", 44)',
    'INSERT INTO Presidents  (Name, Idx) VALUES ("Donald Trump", 45)',
    'INSERT INTO Presidents  (Name, Idx) VALUES ("Joseph Biden", 46)'
  ];
  const xport = React.useCallback(async() => {
    /* prep database */
    const db = openDatabase('sheetql', '1.0', 'SheetJS WebSQL Test', 2097152);

    for(var q of queries) await new Promise((res, rej) => {
      db.transaction((tx) => {
        tx.executeSql(q, [], (tx, data) => res(data), (tx, err) => rej(err));
      });
    });

    /* pull data and generate rows */
    db.readTransaction(tx => {
      tx.executeSql("SELECT * FROM Presidents", [], (tx, data) => {
        const aoo = Array.from(data.rows);
        setOut("QUERY RESULT:\n" + aoo.map(r => JSON.stringify(r)).join("\n") + "\n")
        const ws = XLSX.utils.json_to_sheet(aoo);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Presidents");
        XLSX.writeFile(wb, "SheetQL.xlsx");
      });
    });
  });
  return ( <pre>{out}<button onClick={xport}><b>Fetch!</b></button></pre> );
}
```

## Server-Side SQLite

**[The exposition has been moved to a separate page.](/docs/demos/data/sqlite)**

[^1]: See ["Workbook Object"](/docs/csf/book)
[^2]: See [`read` and `readFile` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^4]: See ["Sheet Objects"](/docs/csf/sheet)
[^5]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^6]: See [`writeFile` in "Writing Files"](/docs/api/write-options)