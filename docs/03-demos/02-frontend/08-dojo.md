---
title: Sheets in Dojo Sites
sidebar_label: Dojo Toolkit
description: Build interactive websites with Dojo. Seamlessly integrate spreadsheets into your app using SheetJS. Bring Excel-powered workflows and data to the modern web.
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 8
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Dojo Toolkit](https://dojotoolkit.org/) is a JavaScript toolkit for building
user interfaces. It includes solutions for code loading and DOM manipulation.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Dojo Toolkit and SheetJS to process and generate spreadsheets.
We'll explore how to load SheetJS using Dojo loader and perform common tasks.

## Installation

The ["AMD" instructions](/docs/getting-started/installation/amd#dojo-toolkit)
includes details for using SheetJS with `require`.

The demos in this section use the async loading strategy with the SheetJS CDN:

<CodeBlock language="html">{`\
<script>
/* configure package paths */
dojoConfig = {
  packages: [
    {
      /* Dojo only supports the name "xlsx" for the script */
      name: "xlsx",
      /* \`location\` omits trailing slash */
      location: "https://cdn.sheetjs.com/xlsx-${current}/package/dist",
      /* \`main\` omits the ".js" extension */
      main: "xlsx.full.min"
    }
  ]
}
</script>
<!-- load dojo.js -->
<script src="dojo.js" data-dojo-config="isDebug:1, async:1"></script>
<script>
require(
  /* specify "xlsx" in the module array */
  ["dojo/request/xhr", "xlsx"],
  /* the name of the variable should not be _XLSX ! */
  function(xhr, _XLSX) {
    /* XLSX-related operations happen in the callback. Use the global \`XLSX\` */
    console.log(XLSX.version);
  }
);
</script>`}
</CodeBlock>

:::danger pass

The official Google CDN does not have the newest releases of Dojo Toolkit

**This is a known Google CDN bug.**

The script https://docs.sheetjs.com/dojo/dojo.js was fetched from the official
`1.17.3` uncompressed release artifact[^1].

:::

## Live Demos

:::note Tested Deployments

This demo was tested in the following environments:

| Platform     | Date       |
|:-------------|:-----------|
| Chromium 125 | 2024-06-08 |

Demos exclusively using Dojo Core were tested using Dojo Toolkit `1.17.3`.

Demos using `dijit` or `dojox` were tested using Dojo Toolkit `1.14.1`. This
was the latest version available on the Google CDN.

:::

- [Download and display data](pathname:///dojo/read.html)
- [Fetch JSON and generate a workbook](pathname:///dojo/write.html)
- [Parse file and create a data store](pathname:///dojo/combo.html)
- [Export data from a store to XLSX](pathname:///dojo/export.html)

## Operations

### Parsing Remote Files

When fetching spreadsheets with XHR, `handleAs: "arraybuffer"` yields an
`ArrayBuffer` which can be passed to the SheetJS `read` method.

The following example generates a HTML table from the first worksheet:

```html
<div id="tbl"></div>
<script>
require(["dojo/request/xhr", "xlsx"], function(xhr, _XLSX) {
  xhr("https://docs.sheetjs.com/pres.numbers", {
    headers: { "X-Requested-With": null },
// highlight-next-line
    handleAs: "arraybuffer"
  }).then(function(ab) {
    /* read ArrayBuffer */
// highlight-next-line
    var wb = XLSX.read(ab);
    /* display first worksheet data */
    var ws = wb.Sheets[wb.SheetNames[0]];
    document.getElementById("tbl").innerHTML = XLSX.utils.sheet_to_html(ws);
  });
});
</script>
```

:::note pass

The `X-Requested-With` header setting resolves some issues related to CORS.

:::

### Writing Local Files

The SheetJS `writeFile` method attempts to create and download a file:

```js
require(["xlsx"], function(_XLSX) {
  /* create a sample workbook */
  var ws = XLSX.utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
  var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  /* create an XLSX file and try to save to SheetJSDojo.xlsx */
  // highlight-next-line
  XLSX.writeFile(workbook, "SheetJSDojo.xlsx");
});
```

### Data Stores

`dojo/store`[^2] is the primary interface for working with structured data.

#### Importing Data

The SheetJS `sheet_to_json` method can generate an array of arrays that can back
a `dojo/store/Memory` store.

The following example fetches a test file, creates a Memory store from the data
in the first worksheet, and assigns to a `dijit` UI Widget:

```html
<script>
require([
  "dojo/ready", "dojo/request/xhr", "dojo/store/Memory", "dijit/registry", "xlsx"
], function(ready, xhr, Memory, registry, _XLSX) {
  ready(function() {
    /* fetch test file */
    xhr("https://docs.sheetjs.com/pres.xlsx", {
      headers: { "X-Requested-With": null },
      handleAs: "arraybuffer"
    }).then(function(ab) {
      /* parse ArrayBuffer */
      var wb = XLSX.read(ab);
      /* get first worksheet */
      var ws = wb.Sheets[wb.SheetNames[0]];
      // highlight-start
      /* generate row objects from first worksheet */
      const aoo = XLSX.utils.sheet_to_json(ws);

      /* generate memory store and assign to combo box */
      var store = new Memory({ data: aoo });
      // highlight-end
      registry.byId("widget").store = store;
    });
  });
});
</script>
```

#### Exporting Data

Starting from a data store, query results are arrays of objects. Worksheets can
be created using the SheetJS `json_to_sheet` method:

```js
function export_all_data_from_store(store) {
  require(["xlsx"], function(_XLSX) {
    // highlight-start
    /* pull all data rows from the store */
    var rows = store.query(function() { return true; });

    /* generate SheetJS worksheet */
    var ws = XLSX.utils.json_to_sheet(rows);
    // highlight-end

    /* generate SheetJS workbook and write to XLSX */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "SheetJSDojoExport.xlsx");
  });
}
```

[^1]: All Dojo Toolkit releases are available at https://download.dojotoolkit.org/. The mirrored `dojo.js` corresponds to the `1.17.3` uncompressed script http://download.dojotoolkit.org/release-1.17.3/dojo.js.uncompressed.js.
[^2]: See [`dojo/store`](https://dojotoolkit.org/reference-guide/dojo/store.html) in the Dojo Toolkit documentation.