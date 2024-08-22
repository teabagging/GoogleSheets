---
title: Sheets in PouchDB
sidebar_label: PouchDB
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  type: nosql
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[PouchDB](https://pouchdb.com/) is a pure JavaScript database with built-in
synchronization features and offline support.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses PouchDB and SheetJS to export database snapshots to spreadsheets
and import bulk data from workbooks. We'll explore the subtleties of processing
arrays of objects to mesh with both libraries.

The ["Complete Example"](#complete-example) section imbues the official "Todos"
demo with the ability to export the list to XLSX workbooks.

:::note Tested Deployments

This demo was tested in the following environments:

| PouchDB |    Date    |
|:--------|:----------:|
| `8.0.1` | 2024-05-04 |
| `7.3.1` | 2024-05-04 |
| `6.4.3` | 2024-05-04 |
| `5.4.5` | 2024-05-04 |
| `4.0.3` | 2024-05-04 |
| `3.6.0` | 2024-05-04 |

:::

## Integration Details

SheetJS CE offers standalone scripts, NodeJS modules, ESM modules, and other
scripts. The ["Installation"](/docs/getting-started/installation) section covers
a number of common deployment scenarios.

PouchDB ships with standalone scripts for browser use and NodeJS modules for use
in server-side scripts[^1].

The `PouchDB` constructor returns a `Database` object.

#### Importing Data

`Database#bulkDocs`[^2] is the standard approach for bulk data import. The method
accepts "arrays of objects" that can be generated through the SheetJS
`sheet_to_json`[^3] method.

If rows do not include the `_id` parameter, the database will automatically
assign an ID per row. It is strongly recommended to generate the `_id` directly.

This method starts from a SheetJS workbook object[^4] and uses data from the
first sheet. `read` and `readFile`[^5] can generate workbook objects from files.

```js
async function push_first_sheet_to_pouchdb(db, wb, _id_) {
  /* get first worksheet */
  const ws = wb.Sheets[wb.SheetNames[0]];

  /* generate array of objects */
  const aoo = XLSX.utils.sheet_to_json(ws);

  /* if a prefix is specified, add a unique _id to each row based on index */
  if(typeof _id_ == "string") aoo.forEach((row, idx) => row._id = _id_ + idx);

  /* perform query */
  return await db.bulkDocs(aoo);
}
```

:::note pass

Existing data can be erased with `Database#destroy`.

:::

#### Exporting Data

`Database#allDocs`[^6] is the standard approach for bulk data export. Generated
row objects have additional `_id` and `_rev` keys that should be removed.

After removing the PouchDB internal fields, the SheetJS `json_to_sheet`[^7]
method can generate a worksheet. Other utility functions[^8] can construct a
workbook. The workbook can be exported with the SheetJS `writeFile`[^9] method:

```js
function export_pouchdb_to_xlsx(db) {
  /* fetch all rows, including the underlying data */
  db.allDocs({include_docs: true}, function(err, doc) {

    /* pull the individual data rows */
    const aoo = doc.rows.map(r => {
      /* `rest` will include every field from `r` except for _id and _rev */
      const { _id, _rev, ...rest } = r;
      return rest;
    });

    /* generate worksheet */
    const ws = XLSX.utils.json_to_sheet(aoo);

    /* generate workbook and export */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSPouch.xlsx");
  });
}
```

:::caution pass

`json_to_sheet` expects an array of "flattened" objects where each value is a
simple data type that can be stored in a spreadsheet cell. If document objects
have a nested structure, integration code should post-process the data.

["Export Tutorial"](/docs/getting-started/examples/export#reshaping-the-array)
processes data from an API and computes a few text values from the nested data.

:::

## Complete Example

0) Download the "Working Version" from the Getting Started guide.

The ZIP file should have `MD5` checksum `ac4da7cb0cade1be293ba222462f109c`:

```bash
curl -LO https://github.com/nickcolley/getting-started-todo/archive/master.zip
md5sum master.zip || md5 master.zip
```

:::note pass

If the download is unavailable, a mirror is available at
https://docs.sheetjs.com/pouchdb/master.zip :

```bash
curl -LO https://docs.sheetjs.com/pouchdb/master.zip
md5sum master.zip || md5 master.zip
```

:::

The second command will display the checksum:

```bash
ac4da7cb0cade1be293ba222462f109c  master.zip
```

1) Unzip the `master.zip` file and enter the folder:

```bash
unzip master.zip
cd getting-started-todo-master
```

2) Edit `index.html` to reference the SheetJS library and add a button:

<CodeBlock language="html" title="index.html (add highlighted lines)">{`\
  <body>
<!-- highlight-start -->
    <script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
    <button id="xport">Export!</button>
<!-- highlight-end -->
    <section id="todoapp">`}
</CodeBlock>

3) Near the end of `index.html`, look for a script tag referencing a CDN:

```html title="index.html (find line)"
    <script src="//cdn.jsdelivr.net/pouchdb/3.2.0/pouchdb.min.js"></script>
```

Upgrade PouchDB by changing the `src` attribute to the production build[^10]:

```html title="index.html (replace line)"
    <script src="//cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js"></script>
```

4) Just before the end of `js/app.js`, add a `click` event listener:

```js title="js/app.js (add highlighted lines)"
  if (remoteCouch) {
    sync();
  }

  // highlight-start
  document.getElementById("xport").addEventListener("click", function() {
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      const aoo = doc.rows.map(r => {
        const { _id, _rev, ... rest } = r.doc;
        return rest;
      });
      const ws = XLSX.utils.json_to_sheet(aoo);
      const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "SheetJSPouch.xlsx");
    });
  });
  // highlight-end
})();
```

:::info pass

The demo UI reads the todo items in descending order:

```js title="js/app.js"
    //------------------------------VVVVVVVVVVVVVVVV (descending order)
    db.allDocs({include_docs: true, descending: true}, function(err, doc) {
      redrawTodosUI(doc.rows);
    });
```

The new callback function also specifies `descending: true` to ensure that the
order of todo items in the export matches the list displayed in the webpage.

:::

5) Start a local web server:

```bash
npx http-server .
```

The command will display a URL (typically `http://localhost:8080`) which can be
opened in a web browser.

**Testing**

6) Access the URL from step 5 with a web browser.

7) Add two items "js" and "Sheet". Mark "Sheet" as completed. The page should
look like the following screenshot:

![todos screenshot](pathname:///pouchdb/todos.png)

8) Click the "Export!" text at the top of the page. The site should create an
export named "SheetJSPouch.xlsx"

9) Open the file in a spreadsheet editor. It should match the following table:

| title | completed |
|:------|:---------:|
| Sheet |   TRUE    |
| js    |   FALSE   |

[^1]: See ["Setting up PouchDB"](https://pouchdb.com/guides/setup-pouchdb.html) in the PouchDB documentation.
[^2]: See ["Create/update a batch of documents"](https://pouchdb.com/api.html#batch_create) in the PouchDB API documentation
[^3]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^4]: See ["SheetJS Data Model"](/docs/csf)
[^5]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^6]: See ["Fetch a batch of documents"](https://pouchdb.com/api.html#batch_fetch) in the PouchDB API documentation
[^7]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^8]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^9]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^10]: The ["Quick Start" section of "Download"](https://pouchdb.com/download.html#file) in the PouchDB website describes the recommended CDN for PouchDB scripts.