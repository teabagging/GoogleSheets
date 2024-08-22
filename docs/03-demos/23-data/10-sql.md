---
title: SQL Connectors
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  sql: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Structured Query Language ("SQL") is a popular declarative language for issuing
commands to database servers.

## Raw SQL Operations

### Generating Tables

This example will fetch https://docs.sheetjs.com/cd.xls, scan the columns of the
first worksheet to determine data types, and generate 6 PostgreSQL statements.

<details>
  <summary><b>Explanation</b> (click to show)</summary>

The relevant `generate_sql` function takes a worksheet name and a table name:

```js
// define mapping between determined types and PostgreSQL types
const PG = { "n": "float8", "s": "text", "b": "boolean" };

function generate_sql(ws, wsname) {

  // generate an array of objects from the data
  const aoo = XLSX.utils.sheet_to_json(ws);

  // types will map column headers to types, while hdr holds headers in order
  const types = {}, hdr = [];

  // loop across each row object
  aoo.forEach(row =>
    // Object.entries returns a row of [key, value] pairs.  Loop across those
    Object.entries(row).forEach(([k,v]) => {

      // If this is first time seeing key, mark unknown and append header array
      if(!types[k]) { types[k] = "?"; hdr.push(k); }

      // skip null and undefined
      if(v == null) return;

      // check and resolve type
      switch(typeof v) {
        case "string": // strings are the broadest type
          types[k] = "s"; break;
        case "number": // if column is not string, number is the broadest type
          if(types[k] != "s") types[k] = "n"; break;
        case "boolean": // only mark boolean if column is unknown or boolean
          if("?b".includes(types[k])) types[k] = "b"; break;
        default: types[k] = "s"; break; // default to string type
      }
    })
  );

  // The final array consists of the CREATE TABLE query and a series of INSERTs
  return [
    // generate CREATE TABLE query and return batch
    `CREATE TABLE \`${wsname}\` (${hdr.map(h =>
      // column name must be wrapped in backticks
      `\`${h}\` ${PG[types[h]]}`
    ).join(", ")});`
  ].concat(aoo.map(row => { // generate INSERT query for each row
    // entries will be an array of [key, value] pairs for the data in the row
    const entries = Object.entries(row);
    // fields will hold the column names and values will hold the values
    const fields = [], values = [];
    // check each key/value pair in the row
    entries.forEach(([k,v]) => {
      // skip null / undefined
      if(v == null) return;
      // column name must be wrapped in backticks
      fields.push(`\`${k}\``);
      // when the field type is numeric, `true` -> 1 and `false` -> 0
      if(types[k] == "n") values.push(typeof v == "boolean" ? (v ? 1 : 0) : v);
      // otherwise,
      else values.push(`'${v.toString().replaceAll("'", "''")}'`);
    })
    if(fields.length) return `INSERT INTO \`${wsname}\` (${fields.join(", ")}) VALUES (${values.join(", ")})`;
  })).filter(x => x); // filter out skipped rows
}
```

</details>

```jsx live
function SheetJSQLWriter() {
  // define mapping between determined types and PostgreSQL types
  const PG = { "n": "float8", "s": "text", "b": "boolean" };
  function generate_sql(ws, wsname) {
    const aoo = XLSX.utils.sheet_to_json(ws);
    const types = {}, hdr = [];
    // loop across each key in each column
    aoo.forEach(row => Object.entries(row).forEach(([k,v]) => {
      // set up type if header hasn't been seen
      if(!types[k]) { types[k] = "?"; hdr.push(k); }
      // check and resolve type
      switch(typeof v) {
        case "string": types[k] = "s"; break;
        case "number": if(types[k] != "s") types[k] = "n"; break;
        case "boolean": if("?b".includes(types[k])) types[k] = "b"; break;
        default: types[k] = "s"; break;
      }
    }));
    return [
      // generate CREATE TABLE query and return batch
      `CREATE TABLE \`${wsname}\` (${hdr.map(h => `\`${h}\` ${PG[types[h]]}`).join(", ")});`
    ].concat(aoo.map(row => {
      const entries = Object.entries(row);
      const fields = [], values = [];
      entries.forEach(([k,v]) => {
        if(v == null) return;
        fields.push(`\`${k}\``);
        if(types[k] == "n") values.push(typeof v == "boolean" ? (v ? 1 : 0) : v);
        else values.push(`'${v.toString().replaceAll("'", "''")}'`);
      })
      if(fields.length) return `INSERT INTO \`${wsname}\` (${fields.join(", ")}) VALUES (${values.join(", ")})`;
    })).filter(x => x).slice(0, 6);
  }
  const [url, setUrl] = React.useState("https://docs.sheetjs.com/cd.xls");
  const set_url = (evt) => setUrl(evt.target.value);
  const [out, setOut] = React.useState("");
  const xport = React.useCallback(async() => {
    const ab = await (await fetch(url)).arrayBuffer();
    const wb = XLSX.read(ab), wsname = wb.SheetNames[0];
    setOut(generate_sql(wb.Sheets[wsname], wsname).join("\n"));
  });

  return ( <> {out && ( <><a href={url}>{url}</a><pre>{out}</pre></> )}
    <b>URL: </b><input type="text" value={url} onChange={set_url} size="50"/>
    <br/><button onClick={xport}><b>Fetch!</b></button>
  </> );
}
```

## Databases

### Query Builders

Query builders are designed to simplify query generation and normalize field
types and other database minutiae.

**Knex**

**[The exposition has been moved to a separate page.](/docs/demos/data/knex)**

### Other SQL Databases

The `generate_sql` function from ["Generating Tables"](#generating-tables)
can be adapted to generate SQL statements for a variety of databases, including:

**PostgreSQL**

**[The exposition has been moved to a separate page.](/docs/demos/data/postgresql)**

**MySQL / MariaDB**

**[The exposition has been moved to a separate page.](/docs/demos/data/mariadb)**
