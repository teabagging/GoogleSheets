---
title: IndexedDB API
pagination_prev: demos/desktop/index
pagination_next: demos/local/index
sidebar_custom_props:
  summary: Reading and writing data in an in-browser NoSQL database
---

<head>
  <script type="text/javascript" src="https://unpkg.com/localforage@1.10.0/dist/localforage.min.js"></script>
  <script type="text/javascript" src="https://unpkg.com/dexie@3.2.4/dist/dexie.js"></script>
</head>

:::danger pass

IndexedDB is a very low-level API.

Browser vendors recommend using [WebSQL](/docs/demos/local/websql) or wrapper
libraries in production applications.

:::

The IndexedDB API provides an in-browser sandboxed local data store for JSON
objects. Like the [Local Storage API](/docs/demos/local/storageapi), IndexedDB
is a popular choice for offline storage.

## Wrapper Libraries

A number of popular wrapper libraries seek to simplify IndexedDB operations.

:::note pass

The wrapper libraries in this section have been used by SheetJS users in
production sites.

:::

### localForage

:::note Tested Deployments

This demo was last tested in the following environments:

| Browser     | Date       | `localForage` |
|:------------|:-----------|:--------------|
| Chrome 122  | 2024-03-21 | 1.10.0        |
| Safari 17.4 | 2024-03-23 | 1.10.0        |

:::

`localForage` is a IndexedDB wrapper that presents an async Storage interface.

Arrays of objects can be stored using `setItem` using row index as key:

```js
const aoo = XLSX.utils.sheet_to_json(ws);
for(var i = 0; i < aoo.length; ++i) await localForage.setItem(i, aoo[i]);
```

Recovering the array of objects involves an iteration over the storage:

```js
const aoo = [];
await localforage.iterate((v, k) => { aoa[+k] = v; });
const ws = XLSX.utils.json_to_sheet(aoo);
```

#### Demo

This demo prepares a small IndexedDB database with some sample data.

After saving the exported file, the IndexedDB database can be inspected in the
"IndexedDB" section of the "Application" Tab of Developer Tools:

![IndexedDB view in Developer Tools](pathname:///storageapi/lforage.png)

```jsx live
function SheetJSLocalForage() {
  const data = [
    { Name: "Barack Obama", Index: 44 },
    { Name: "Donald Trump", Index: 45 },
    { Name: "Joseph Biden", Index: 46 }
  ];
  const xport = React.useCallback(async() => {
    /* force use of IndexedDB and connect to DB */
    localforage.config({
      driver: [ localforage.INDEXEDDB ],
      name: "SheetQL",
      size: 2097152
    });

    /* create sample data */
    await localforage.clear();
    for(var i = 0; i < data.length; ++i) await localforage.setItem(i, data[i]);

    /* pull data and generate aoa */
    const aoo = [];
    await localforage.iterate((v, k) => { aoo[+k] = v; });

    /* export */
    const ws = XLSX.utils.json_to_sheet(aoo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presidents");
    XLSX.writeFile(wb, "SheetJSLocalForage.xlsx");
  });
  return ( <pre><button onClick={xport}><b>Do it!</b></button></pre> );
}
```

### DexieJS

:::note Tested Deployments

This demo was last tested in the following environments:

| Browser     | Date       | DexieJS |
|:------------|:-----------|:--------|
| Chrome 122  | 2024-03-21 | 3.2.4   |

:::

DexieJS is a minimalistic wrapper for IndexedDB.  It provides a convenient
interface for creating multiple logical tables, well-suited for workbooks.

#### Importing Data

When configuring tables, DexieJS needs a schema. The schema definition supports
primary keys and other properties, but they are not required:

```js
/* assuming `wb` is a workbook from XLSX.read */
var db = new Dexie("SheetJSDexie");
db.version(1).stores(Object.fromEntries(wb.SheetNames.map(n => ([n, "++"]))));
```

After the database is configured, `bulkPut` can insert arrays of objects:

```js
/* loop over worksheet names */
for(let i = 0; i <= wb.SheetNames.length; ++i) {
  /* get the worksheet for the specified index */
  const wsname = wb.SheetNames[i];
  const ws = wb.Sheets[wsname];
  if(!ws) continue;
  /* generate an array of objects */
  const aoo = XLSX.utils.sheet_to_json(ws);
  /* push to idb */
  await db[wsname].bulkPut(aoo);
}
```

This demo inserts all data from a selected worksheet into a database, then
fetches the data from the first worksheet in reverse.

After saving the exported file, the "IndexedDB" section of the "Application" Tab
of Developer Tools will include a database named "SheetJSDexie".

```jsx live
/* The live editor requires this function wrapper */
function SheetJSDexieImport(props) {
  const [__html, setHTML] = React.useState("Select a spreadsheet");

  return ( <>
    <input type="file" onChange={async(e) => { try {
      /* get data as an ArrayBuffer */
      const file = e.target.files[0];
      const data = await file.arrayBuffer();

      /* parse worksheet */
      const wb = XLSX.read(data);

      /* load into indexeddb */
      await Dexie.delete("SheetJSDexie");
      const db = new Dexie("SheetJSDexie");
      const wsnames = wb.SheetNames.map(n => ([n, "++"]));
      db.version(1).stores(Object.fromEntries(wsnames));

      /* loop over worksheet names */
      for(let i = 0; i <= wb.SheetNames.length; ++i) {
        /* get the worksheet for the specified index */
        const wsname = wb.SheetNames[i];
        const ws = wb.Sheets[wsname];
        if(!ws) continue;
        /* generate an array of objects */
        const aoo = XLSX.utils.sheet_to_json(ws);
        /* push to idb */
        await db[wsname].bulkPut(aoo);
      }

      /* fetch the first table in reverse order */
      const rev = await db[wb.SheetNames[0]].reverse().toArray();

      setHTML(rev.map(r => JSON.stringify(r)).join("\n"));
    } catch(e) { setHTML(e && e.message || e); }}}/>
    <pre dangerouslySetInnerHTML={{ __html }}/>
  </> );
}
```

#### Exporting Data

`db.tables` is a plain array of table objects. `toArray` fetches data:

```js
/* create blank workbook */
const wb = XLSX.utils.book_new();
/* loop tables */
for(const table of db.tables) {
  /* get data */
  const aoo = await table.toArray();
  /* create worksheet */
  const ws = XLSX.utils.json_to_sheet(aoo);
  /* add to workbook */
  XLSX.utils.book_append_sheet(wb, ws, table.name);
}
```

This demo prepares a small database with some sample data.

```jsx live
function SheetJSDexieExport() {
  const data = [
    { Name: "Barack Obama", Index: 44 },
    { Name: "Donald Trump", Index: 45 },
    { Name: "Joseph Biden", Index: 46 }
  ];
  const xport = React.useCallback(async() => {
    /* prepare db */
    await Dexie.delete("SheetJSDexie");
    var db = new Dexie("SheetJSDexie");
    db.version(1).stores({ Presidents: "++" });
    db.Presidents.bulkPut(data);

    /* pull data and generate workbook */
    const wb = XLSX.utils.book_new();
    for(const table of db.tables) {
      const aoo = await table.toArray();
      const ws = XLSX.utils.json_to_sheet(aoo);
      XLSX.utils.book_append_sheet(wb, ws, table.name);
    }
    XLSX.writeFile(wb, "SheetJSDexie.xlsx");
  });
  return ( <pre><button onClick={xport}><b>Do it!</b></button></pre> );
}
```
