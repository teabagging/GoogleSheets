---
title: Data Grids and Tables
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Various JavaScript UI components provide a more interactive editing experience.
Most are able to interchange with arrays of arrays or arrays of data objects.
This demo focuses on a few open source data grids.

:::tip pass

[SheetJS Pro](https://sheetjs.com/pro) offers additional features like styling
and images. The UI tools typically support many of these advanced features.

To eliminate any confusion, the live examples linked from this page demonstrate
SheetJS Community Edition data interchange.

:::

## Managed Lifecycle

Many UI components tend to manage the entire lifecycle, providing methods to
import and export data.

The `sheet_to_json` utility function generates arrays of objects, which is
suitable for a number of libraries.  When more advanced shapes are needed,
it is easier to process an array of arrays.

#### x-spreadsheet

With a familiar UI, `x-spreadsheet` is an excellent choice for a modern editor.

[Click here for a live integration demo.](pathname:///xspreadsheet/)

**[The exposition has been moved to a separate page.](/docs/demos/grid/xs)**

#### Canvas Datagrid

After extensive testing, `canvas-datagrid` stood out as a high-performance grid
with a straightforward API.

[Click here for a live integration demo.](pathname:///cdg/index.html)

**[The exposition has been moved to a separate page.](/docs/demos/grid/cdg)**

#### Tabulator

[Tabulator](https://tabulator.info/docs/5.4/download#xlsx) includes deep support
through a special Export button.  It handles the SheetJS operations internally.

**[The exposition has been moved to a separate page.](/docs/demos/grid/tabulator)**

#### Angular UI Grid

:::danger pass

This UI Grid is for AngularJS, not the modern Angular.  New projects should not
use AngularJS.  This demo is included for legacy applications.

The [AngularJS demo](/docs/demos/frontend/angularjs) covers more general strategies.

:::

[Click here for a live integration demo.](pathname:///angularjs/ui-grid.html)

<details>
  <summary><b>Notes</b> (click to show)</summary>

The library does not provide any way to modify the import button, so the demo
includes a simple directive for a File Input HTML element.  It also includes a
sample service for export which adds an item to the export menu.

The demo `SheetJSImportDirective` follows the prescription from the README for
File input controls using `readAsArrayBuffer`, converting to a suitable
representation and updating the scope.

`SheetJSExportService` exposes export functions for `XLSB` and `XLSX`.  Other
file formats can be exported by changing the `bookType` variable.  It grabs
values from the grid, builds an array of arrays, generates a workbook and forces
a download.  By setting the `filename` and `sheetname` options in the `ui-grid`
options, the output can be controlled.

</details>

## Framework Lifecycle

For modern frameworks like React, data grids tend to follow the framework state
and idioms.  The same `sheet_to_json` and `json_to_sheet` / `aoa_to_sheet`
methods are used, but they pull from a shared state object that can be mutated
with other buttons and components on the page.

#### React Data Grid

**[The exposition has been moved to a separate page.](/docs/demos/grid/rdg)**

#### Glide Data Grid

**[The exposition has been moved to a separate page.](/docs/demos/grid/gdg)**

#### Material UI Data Grid

**[The exposition has been moved to a separate page.](/docs/demos/grid/mui#material-ui-data-grid)**

<!-- spellchecker-disable -->

#### vue3-table-lite

<!-- spellchecker-enable -->

**[The exposition has been moved to a separate page.](/docs/demos/grid/vtl)**

## Standard HTML Tables

Many UI components present styled HTML tables.  Data can be extracted from the
tables given a reference to the underlying TABLE element:

```js
function export_html_table(table) {
  const wb = XLSX.utils.table_to_book(table);
  XLSX.writeFile(wb, "HTMLTable.xlsx");
} // yes, it's that easy!
```

:::info pass

SheetJS CE is focused on data preservation and will extract values from tables.

[SheetJS Pro](https://sheetjs.com/pro) offers styling support when reading from
TABLE elements and when writing to XLSX and other spreadsheet formats.

:::

#### Fixed Tables

When the page has a raw HTML table, the easiest solution is to attach an `id`:

<CodeBlock language="html">{`\
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js"></script>
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
\n\
<!-- table with id \`xport\` -->
<table id="xport"><tr><td>SheetJS</td></tr></table>
\n\
<script>
/* as long as this script appears after the table, it will be visible */
var tbl = document.getElementById("xport");
const wb = XLSX.utils.table_to_book(tbl);
XLSX.writeFile(wb, "HTMLTable.xlsx");
</script>`}
</CodeBlock>

When programmatically constructing the table in the browser, retain a reference:

```js
/* assemble table */
var tbl = document.createElement("TABLE");
tbl.insertRow(0).insertCell(0).innerHTML = "SheetJS";

/* add to document body */
document.body.appendChild(tbl);

/* generate workbook and export */
const wb = XLSX.utils.table_to_book(tbl);
XLSX.writeFile(wb, "HTMLFlicker.xlsx");

/* remove from document body */
document.body.removeChild(tbl);
```

#### React

**[The exposition has been moved to a separate page.](/docs/demos/frontend/react#html)**

#### Material UI Table

**[The exposition has been moved to a separate page.](/docs/demos/grid/mui#material-ui-table)**
