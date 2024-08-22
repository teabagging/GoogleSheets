---
title: Merged Cells
sidebar_position: 11
---

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

By default, no cells are merged. Merge metadata is ignored when exporting to a
file format that does not support merge cells.

Formats store the actual contents of a merged cell in the "top-left" corner
(first row and first column of the merge range). Some formats can hold data for
cells that are covered by the merge range.

| Formats   | Merge | Covered |
|:----------|:-----:|:-------:|
| XLSX/XLSM |   ✔   |    ✔    |
| XLSB      |   ✔   |    ✔    |
| XLML      |   ✔   |    ✔    |
| BIFF8 XLS |   ✔   |    ✔    |
| ODS/FODS  |   ✔   |    ✔    |
| NUMBERS   |   ✔   |    ✔    |
| HTML      |   ✔   |         |

There are multiple representations of merge cells in the NUMBERS file format.
Writers use the simplified `.TST.MergeRegionMapArchive` representation. Parsers
understand the classic form and the modern `.TST.MergeOwnerArchive` form.

</details>

Modern spreadsheet software typically allow users to combine blocks of cells
into a single unit. This unit can span multiple columns and rows. As shown in
the following table, HTML TH and TD elements use `colspan` and `rowspan`
attributes to effectuate merging:

<table><tbody>
  <tr><td colSpan="4"><center>This title spans four columns</center></td></tr>
  <tr><td>SheetJS</td><td>supports</td><td>merge</td><td>cells</td></tr>
</tbody></table>

:::tip pass

This feature was expanded in version `0.20.3`. It is strongly recommended to
[upgrade to the latest version](/docs/getting-started/installation/).

:::

## Storage

The `!merges` property of the worksheet object is expected to be an array of
[SheetJS range objects](/docs/csf/general#sheetjs-range). Each range object
corresponds to a merged range in the worksheet.

The following snippet creates a merge range spanning `A1:B2` :

```js title="Merge the range A1:B2 in a worksheet"
ws["!merges"] = [
  { s: { c: 0, r: 0 }, e: { c: 1, r: 1 } }  // A1:B2
];
```

:::caution pass

**Overlapping merges are not automatically detected!**

:::

### Range

The [`decode_range`](/docs/csf/general#cell-ranges-1) method creates range
objects from A1-style range strings.

The following snippet creates a merge range spanning `A1:B2` :

```js title="Merge the range A1:B2 in a worksheet"
ws["!merges"] = [
  XLSX.utils.decode_range("A1:B2")
];
```

### Overlap

When adding merges to an existing workbook, it is strongly recommended to scan
the merges array and test for collisions:

```js title="Add a merged range to a worksheet"
function sheet_add_merge(ws, range) {
  /* if `range` is a string, parse into a range object */
  var merge = typeof range == "string" ? XLSX.utils.decode_range(range) : range;

  /* create array merge if it does not exist */
  if(!ws["!merges"]) ws["!merges"] = [];

  /* check if the new merge collides with any existing merge */
  ws["!merges"].forEach(function(range) {
    if(merge.e.r < range.s.r) return;
    if(range.e.r < merge.s.r) return;
    if(merge.e.c < range.s.c) return;
    if(range.e.c < merge.s.c) return;
    throw new Error(XLSX.utils.encode_range(merge)+" overlaps "+XLSX.utils.encode_range(range));
  });

  /* add merge */
  ws["!merges"].push(merge);
}
```

### Cells

Spreadsheet tools will store and use the top-left cell of a merge range. For
example, if the range `B2:C5` is merged, the cell corresponding to the range
will be stored in the worksheet in cell `B2`.

#### Covered Cells

Spreadsheet tools can store cells that are covered by a merged cell.

The [SheetJS worksheet object](/docs/csf/sheet) can store covered cells.
[API Functions](#functions) may omit or include covered cells.

## Live Demo

This example generates a worksheet that matches the following screenshot:

![screenshot](pathname:///files/merges.png)

The merge ranges are `A1:B2`, `C1:C2`, `A3:B3`, `D1:D2`, and `A4:B4`.

```jsx live
function SheetJSMergeCellsExport() { return (<button onClick={() => {
  /* write data to the top-left corner of each range */
  var ws = XLSX.utils.aoa_to_sheet([
    ["A1:B2",  /* B1 */, "C1:C2",  "Separate blocks"], // row 1
    [],                                                // row 2
    ["A3:B3",  /* B3 */, "C3"],                        // row 3
    ["... are merged separately"],                     // row 4
  ]);
  /* add merges */
  ws["!merges"] = [
    { s: { c: 0, r: 0 }, e: { c: 1, r: 1 } },  // A1:B2
    { s: { c: 2, r: 0 }, e: { c: 2, r: 1 } },  // C1:C2
    { s: { c: 0, r: 2 }, e: { c: 1, r: 2 } },  // A3:B3
    { s: { c: 3, r: 0 }, e: { c: 3, r: 1 } },  // D1:D2
    { s: { c: 0, r: 3 }, e: { c: 1, r: 3 } }   // A4:B4
  ];
  /* export to XLSX */
  var wb = XLSX.utils.book_new(ws, "Merges");
  XLSX.writeFile(wb, "SheetJSMergeCells.xlsx");
}}><b>Click here to Export</b></button>); }
```

## Functions

#### HTML

[`table_to_sheet` and `table_to_book`](/docs/api/utilities/html#html-table-input)
will generate worksheets that include merged ranges:

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

```jsx live
function SheetJSDOMMergedCells() {
  const ref = React.useRef(null);
  const [ merges, setMerges ] = React.useState([]);

  React.useEffect(() => {
    if(ref.current) {
      const tbl = ref.current.getElementsByTagName("TABLE");
      if(!tbl || !tbl[0]) return;
      const ws = XLSX.utils.table_to_sheet(tbl[0]);
      console.log(ws["!merges"])
      setMerges(ws["!merges"] || []);
    }
  }, [ref])
  const ws = XLSX.utils.aoa_to_sheet([
    ["A1:B1 is merged", "This cell is covered" ],
    ["A2 is not merged", "B2 is not merged"]
  ]);
  ws["!merges"] = [XLSX.utils.decode_range("A1:B1")];
  const __html = XLSX.utils.sheet_to_html(ws);

  return ( <>
    <b>Table:</b>
    <div ref={ref} dangerouslySetInnerHTML={{__html}}/>
    <b>Merges:</b>
    <pre>{merges ? merges.map(m =>  XLSX.utils.encode_range(m)).join("\n") : ""}</pre>
  </>
  );
}
```

</details>

[`sheet_to_html`](/docs/api/utilities/html#html-table-output) will generate HTML
strings that use `colspan` and `rowspan` for merged ranges:

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

```jsx live
function SheetJSHTMLMergedCells() {
  const ws = XLSX.utils.aoa_to_sheet([
    ["A1:B1 is merged", "This cell is covered" ],
    ["A2 is not merged", "B2 is not merged"]
  ]);
  ws["!merges"] = [XLSX.utils.decode_range("A1:B1")];
  const __html = XLSX.utils.sheet_to_html(ws);
  return ( <div dangerouslySetInnerHTML={{__html}}/> );
}
```

</details>

#### Reading Files

[`read` and `readFile`](/docs/api/parse-options) will extract merge metadata
from supported files.

#### Writing Files

[`write` and `writeFile`](/docs/api/write-options) will attempt to write merge
metadata when exporting to file formats that support merged ranges.

When writing to CSV and other formats that do not support merged ranges, every
cell in the range will be exported. This includes covered cells!

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

```jsx live
function SheetJSCSVMergedCells() {
  const ws = XLSX.utils.aoa_to_sheet([
    ["A1:B1 is merged", "This cell is covered" ],
    ["A2 is not merged", "B2 is not merged"]
  ]);
  ws["!merges"] = [XLSX.utils.decode_range("A1:B1")];
  const wb = XLSX.utils.book_new(ws, "Sheet1");
  const csv = XLSX.write(wb, { type: "string", bookType: "csv"});
  return ( <pre>{csv}</pre> );
}
```

</details>

#### Exporting Data

[`sheet_to_csv`](/docs/api/utilities/csv#delimiter-separated-output) and
[`sheet_to_json`](/docs/api/utilities/array#array-output) do not support merged
ranges. The exports will include covered cells:

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

```jsx live
function SheetJSAOAMergedCells() {
  const ws = XLSX.utils.aoa_to_sheet([
    ["A1:B1 is merged", "This cell is covered" ],
    ["A2 is not merged", "B2 is not merged"]
  ]);
  ws["!merges"] = [XLSX.utils.decode_range("A1:B1")];
  const aoa = XLSX.utils.sheet_to_json(ws, {header:1});
  return ( <pre>{JSON.stringify(aoa,2,2)}</pre> );
}
```

</details>
