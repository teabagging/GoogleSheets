---
title: Tabulator
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Tabulator](https://tabulator.info/) is a powerful data table library designed
for ease of use.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

Tabulator offers deep integration with SheetJS for importing and exporting data.
This demo covers additional detail including document customization.

[Click here for a live standalone integration demo.](pathname:///tabulator/)

:::note Tested Deployments

This demo was tested in the following deployments:

| Browser      | Version | Date       |
|:-------------|:--------|:-----------|
| Chromium 125 | `6.2.1` | 2024-06-13 |

:::

## Integration Details

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
are appropriate for sites that use the Tabulator CDN scripts.

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation instructions for projects using a framework.

:::info pass

**The Tabulator script must be loaded after the SheetJS scripts!**

```html
<!-- Load SheetJS Scripts -->
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/shim.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
<!-- Tabulator must be loaded after SheetJS scripts -->
<script type="text/javascript" src="https://unpkg.com/tabulator-tables@6.2.1/dist/js/tabulator.min.js"></script>
```

:::

### Previewing Data

Tabulator offers a special `setData` method for assigning data after the table
is created. Coupled with the `autoColumns` option, Tabulator will automatically
refresh the table.

:::info pass

The library scans the first row object to determine the header labels. If a
column is missing a value in the first object, it will not be loaded!

:::

#### Fetching Files

When files are stored remotely, the recommended approach is to fetch the files,
parse with the SheetJS `read` method, generate arrays of objects from the target
sheet using `sheet_to_json`, and load data with the Tabulator `setData` method.
The following snippet fetches a sample file and loads the first sheet:

```html title="Fetching a spreadsheet and Displaying the first worksheet"
<!-- Tabulator DIV -->
<div id="htmlout"></div>

<script>
/* Initialize Tabulator with the `autoColumns: true` setting */
var tbl = new Tabulator('#htmlout', { autoColumns: true });

/* fetch and display https://docs.sheetjs.com/pres.numbers */
(function() { try {
  fetch("https://docs.sheetjs.com/pres.numbers")
    .then(function(res) { return res.arrayBuffer(); })
    .then(function(ab) {
      /* parse ArrayBuffer */
      var wb = XLSX.read(ab);
      /* get first worksheet from SheetJS workbook object */
      var ws = wb.Sheets[wb.SheetNames[0]];
      /* generate array of row objects */
      var data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      /* update Tabulator */
      tbl.setData(data);
    });
} catch(e) {} })();
</script>
```

#### Local Files

Tabulator provides a special `import` method to show a dialog and load data.
Since the importer requires the raw binary data, the method must be called with
the third argument set to `"buffer"`:

```html title="Parsing a local spreadsheet and Displaying the first worksheet"
<button id="imp"><b>Click here to import from XLSX file</b></button>
<!-- Tabulator DIV -->
<div id="htmlout"></div>

<script>
/* Initialize Tabulator with the `autoColumns: true` setting */
var tbl = new Tabulator('#htmlout', { autoColumns: true });

/* use Tabulator SheetJS integration to import data */
document.getElementById("imp").addEventListener("click", function() {
  tbl.import("xlsx", ".xlsx", "buffer");
})
</script>
```

### Saving Data

Tabulator provides a special `download` method to initiate the export:

```html title="Exporting data from Tabulator to XLSX"
<input type="submit" value="Export to XLSX!" id="xport" onclick="export_xlsx();">
<!-- Tabulator DIV -->
<div id="htmlout"></div>

<script>
/* Initialize Tabulator with the `autoColumns: true` setting */
var tbl = new Tabulator('#htmlout', { autoColumns: true });

/* use Tabulator SheetJS integration to import data */
function export_xlsx() {
  /* use Tabulator SheetJS integration */
  tbl.download("xlsx", "SheetJSTabulator.xlsx");
}
</script>
```

[The official documentation](https://tabulator.info/docs/6.2/download#xlsx)
covers supported options.

#### Post-processing

The `documentProcessing` event handler is called after Tabulator generates a
SheetJS workbook object. This allows for adjustments before creating the final
workbook file. The following example adds a second sheet that includes the date:

```js title="Exporting data and metadata"
tbl.download("xlsx", "SheetJSTabulator.xlsx", {
  documentProcessing: function(wb) {

    /* create a new worksheet */
    var ws = XLSX.utils.aoa_to_sheet([
      ["SheetJS + Tabulator Demo"],
      ["Export Date:", new Date()]
    ]);

    /* add to workbook */
    XLSX.utils.book_append_sheet(wb, ws, "Metadata");

    return wb;
  }
});
```
