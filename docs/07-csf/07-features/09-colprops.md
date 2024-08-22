---
title: Column Properties
sidebar_position: 9
---

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

By default, all columns in a workbook are "Visible" and have a standard width.

| Formats          | Width | Hidden Cols | Outline Level |
|:-----------------|:-----:|:-----------:|:-------------:|
| XLSX/XLSM        |   ✔   |      ✔      |       ✔       |
| XLSB             |   ✔   |      ✔      |       ✔       |
| XLML             |   ✔   |      ✔      |       ✕       |
| BIFF8 XLS        |   ✔   |      ✔      |       ✔       |
| BIFF5 XLS        |   R   |      R      |       R       |
| SYLK             |   ✔   |      *      |       ✕       |

Asterisks (*) mark formats that represent hidden columns with zero width. For
example, there is no way to specify a custom column width and mark the column as
hidden in the SYLK format.

X (✕) marks features that are not supported by the file formats. For example,
the SpreadsheetML 2003 (XLML) file format does not support outline levels.

</details>

Many spreadsheet tools support adjusting column widths to accommodate longer
formatted data or varying text sizes.

Some tools additionally support column grouping or "outlining". Excel displays
outline levels above the grid.

SheetJS worksheet objects store column properties in the `!cols` field. It is
expected to be an array of column metadata objects.

:::danger Excel Bugs

For most common formats (XLSX, XLS), widths are tied to font metrics, which are
tied to Windows Scaling settings. In Windows 11, the Scale factor settings are
found in "System" > "Display" > "Scale"

**Column widths may appear different on other machines due to scaling.**

**This is an issue with Excel.**

:::

## Demo

This example creates a workbook that includes custom column widths, hidden
columns, and column outline levels.

<table><thead><tr>
  <th>Excel for Windows</th>
  <th>Excel for Mac</th>
</tr></thead><tbody><tr><td>

![Excel for Windows](pathname:///colprops/win.png)

</td><td>

![Excel for Mac](pathname:///colprops/mac.png)

</td></tr></tbody></table>

<details>
  <summary><b>Export Demo</b> (click to show)</summary>

The table lists the assigned widths, outline levels and visibility settings.

```jsx live
function SheetJColProps() {
  const [ws, setWS] = React.useState();
  const [__html, setHTML] = React.useState("");
  const fmt = React.useRef(null);

  /* when the page is loaded, create worksheet and show table */
  React.useEffect(() => {
    /* Create worksheet from simple data */
    const data = [
      [ "Width"  , 10, 20, 30, 40, 50, 20, 20,   ],
      [ "Level"  ,  0,  1,  2,  3,  3,  1,  0,   ],
      [ "Hidden" ,  0,  0,  0,  0,  0,  0,  0, 1 ]
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    /* set column metadata */
    ws["!cols"] = [];
    for(let i = 1; i <= 8; ++i) {
      const r = {};
      if(data[0][i] != null) (ws["!cols"][i] = r).wpx = data[0][i];
      if(data[1][i] != null) (ws["!cols"][i] = r).level = data[1][i];
      if(data[2][i] != null) (ws["!cols"][i] = r).hidden = data[2][i];
    }

    /* save worksheet object for the export */
    setWS(ws);
    /* generate the HTML table */
    setHTML(XLSX.utils.sheet_to_html(ws));
  }, []);

  const xport = (fmt) => {
    /* Export to file (start a download) */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Formats");
    XLSX.writeFile(wb, `SheetJSColProps.${fmt}`, {cellStyles: true});
  };

  const fmts = ["xlsx", "xlsb", "xls", "slk"];
  return ( <>
    <b>File format: </b>
    <select ref={fmt}>{fmts.map(f=>(<option value={f}>{f}</option>))}</select>
    <br/><button onClick={()=>xport(fmt.current.value)}><b>Export!</b></button>
    <div dangerouslySetInnerHTML={{__html}}/>
  </> );
}
```

</details>

## Functions

:::caution pass

**Column processing must be explicitly enabled!**

:::

Functions creating worksheet objects are not guaranteed to generate the `!cols`
array. Writers are not guaranteed to export column metadata.

#### Reading Files

[`read` and `readFile`](/docs/api/parse-options) accept an options argument. The
`cellStyles` option must be set to `true` to generate column properties:

```js
var wb = XLSX.read(data, {/* ... other options , */ cellStyles: true});
```

#### Writing Files

[`write` and `writeFile`](/docs/api/write-options) accept an options argument.
The `cellStyles` option must be set to `true` to export column properties:

```js
XLSX.writeFile(wb, "SheetSColProps.xlsx", {/* ...opts , */ cellStyles: true});
```

#### Exporting Data

[`sheet_to_csv`](/docs/api/utilities/csv#delimiter-separated-output) and
[`sheet_to_json`](/docs/api/utilities/array#array-output) accept options. If the
`skipHidden` option is set to true, hidden columns will not be exported:

```js
var ws = wb.Sheets[wb.SheetNames[0]]; // first worksheet
var csv = XLSX.utils.sheet_to_csv(ws, {/* ...opts, */ skipHidden: true});
```

## Storage

The `!cols` property in a sheet object stores column-level metadata. If present,
it is expected to be an array of column objects.

:::info pass

As explained in ["Addresses and Ranges"](/docs/csf/general#columns), SheetJS uses
zero-indexed columns. The column metadata for Excel column "T" is stored at index
19 of the `!cols` array.

:::

When performing operations, it is strongly recommended to test for the existence
of the column structure.

This snippet checks the `!cols` array and the specific column object, creating
them if they do not exist, before setting the `hidden` property of column "C":

```js
/* Excel column "C" -> SheetJS column index 2 == XLSX.utils.decode_col("C") */
var COL_INDEX = 2;

/* create !cols array if it does not exist */
if(!ws["!cols"]) ws["!cols"] = [];

/* create column metadata object if it does not exist */
if(!ws["!cols"][COL_INDEX]) ws["!cols"][COL_INDEX] = {wch: 8};

/* set column to hidden */
ws["!cols"][COL_INDEX].hidden = true;
```

### Column Widths

Column widths can be specified in three ways:

| Property | Description             | Excel UI |
|:---------|:------------------------|:---------|
| `wpx`    | Width in screen pixels  | Pixels   |
| `wch`    | "inner width" in MDW ** | Width    |
| `width`  | "outer width" in MDW ** |          |

:::note pass

When resizing a column, Excel will show a tooltip:

![Resize tooltip](pathname:///colprops/xlwidth.png)

`wpx` stores the "pixels" field (`65` in the diagram) for certain computer and
font settings.

:::

<details>
  <summary><b>MDW (Max Digit Width)</b> (click to show)</summary>

**`MDW`**

"MDW" stands for "Max Digit Width", the maximum width of the numeric characters
(`0`, `1`, ..., `9`) using the first font specified in the file. For most common
fonts and text scaling settings, this is the width of `0` measured in pixels.

Parsers will save the estimated pixel width of the `0` digit to the `MDW`
property of the column object. It is always a positive integer.

**`width`**

`width` is the distance from "gridline before the current column" to "gridline
before the next column" divided by MDW and rounded to the nearest `1/256`.

**`wch`**

Table cells in Excel include 2 pixels of padding on each side. The vertical
gridline is one pixel wide. In total, the `width` includes 5 pixels of padding.

`wch` is the "inner width", calculated by subtracting the 5 pixels from `width`.
`wch` is also measured in MDW units rounded to the nearest `1/256`.

**Diagram**

The following diagram depicts the Excel box model and the relationship between
`width`, `wpx`, `MDW` and the displayed grid:

![Box diagram](pathname:///colprops/xlbox.png)

The distance between the two red lines is `width * MDW = 15` pixels. That span
includes one gridline width (1 pixel) and two padding blocks (2 pixels each).

The space available for content is `wch * MDW = 15 - 5 = 10` pixels.

</details>

The following snippet sets the width of column "C" to 50 pixels:

```js
const COL_WIDTH = 50;

/* Excel column "C" -> SheetJS column index 2 == XLSX.utils.decode_col("C") */
var COL_INDEX = 2;

/* create !cols array if it does not exist */
if(!ws["!cols"]) ws["!cols"] = [];

/* create column metadata object if it does not exist */
if(!ws["!cols"][COL_INDEX]) ws["!cols"][COL_INDEX] = {wch: 8};

/* set column width */
ws["!cols"][COL_INDEX].wpx = COL_WIDTH;
```

### Column Visibility

The `hidden` property controls visibility.

The following snippet hides column "D":

```js
/* Excel column "D" -> SheetJS column index 3 == XLSX.utils.decode_col("D") */
var COL_INDEX = 3;

/* create !cols array if it does not exist */
if(!ws["!cols"]) ws["!cols"] = [];

/* create column metadata object if it does not exist */
if(!ws["!cols"][COL_INDEX]) ws["!cols"][COL_INDEX] = {wch: 8};

/* set column to hidden */
ws["!cols"][COL_INDEX].hidden = true;
```

### Outline Levels

The `level` property controls outline level / grouping. It is expected to be a
number between `0` and `7` inclusive.

:::note pass

The Excel UI displays outline levels above the row labels. The base level
shown in the application is `1`.

SheetJS is zero-indexed: the default (base) level is `0`.

:::

The following snippet sets the level of column "F" to Excel 2 / SheetJS 1:

```js
/* Excel level 2 -> SheetJS level 2 - 1 = 1 */
var LEVEL = 1;

/* Excel column "F" -> SheetJS column index 5 == XLSX.utils.decode_col("F") */
var COL_INDEX = 5;

/* create !cols array if it does not exist */
if(!ws["!cols"]) ws["!cols"] = [];

/* create column metadata object if it does not exist */
if(!ws["!cols"][COL_INDEX]) ws["!cols"][COL_INDEX] = {wch: 8};

/* set level */
ws["!cols"][COL_INDEX].level = LEVEL;
```

### Grouping Columns

Applications treat consecutive columns with the same level as part of a "group".

The "Group" command typically increments the level of each column in the range:

```js
/* start_col and end_col are SheetJS 0-indexed column indices */
function grouper(ws, start_col, end_col) {
  /* create !cols array if it does not exist */
  if(!ws["!cols"]) ws["!cols"] = [];
  /* loop over every column index */
  for(var i = start_col; i <= end_col; ++i) {
    /* create column metadata object if it does not exist */
    if(!ws["!cols"][i]) ws["!cols"][i] = {wch: 8};
    /* increment level */
    ws["!cols"][i].level = 1 + (ws["!cols"][i].level || 0);
  }
}
```

The "Ungroup" command typically decrements the level of each column in the range:

```js
/* start_col and end_col are SheetJS 0-indexed column indices */
function aufheben(ws, start_col, end_col) {
  /* create !cols array if it does not exist */
  if(!ws["!cols"]) ws["!cols"] = [];
  /* loop over every column index */
  for(var i = start_col; i <= end_col; ++i) {
    /* if column metadata does not exist, the level is zero -> skip */
    if(!ws["!cols"][i]) continue;
    /* if column level is not specified, the level is zero -> skip */
    if(!ws["!cols"][i].level) continue;
    /* decrement level */
    --ws["!cols"][i].level;
  }
}
```

#### Grouping Symbol

By default, Excel displays the group collapse button on the column after the
data. In the UI, this option is named "Summary columns to right of detail".

SheetJS exposes this option in the `left` property of the `"!outline"` property
of worksheet objects. Setting this property to `true` effectively "unchecks" the
"Summary columns to right of detail" option in Excel:

```js
if(!ws["outline"]) ws["!outline"] = {};
ws["!outline"].left = true; // show summary to left of detail
```

## Implementation Details

<details>
  <summary><b>Details</b> (click to show)</summary>

**Three Width Types**

There are three different width types corresponding to the three different ways
spreadsheets store column widths:

SYLK and other plain text formats use raw character count. Contemporaneous tools
like Visicalc and Multiplan were character based.  Since the characters had the
same width, it sufficed to store a count.  This tradition was continued into the
BIFF formats.

SpreadsheetML (2003) tried to align with HTML by standardizing on screen pixel
count throughout the file.  Column widths, row heights, and other measures use
pixels.  When the pixel and character counts do not align, Excel rounds values.

XLSX internally stores column widths in a nebulous "Max Digit Width" form.  The
Max Digit Width is the width of the largest digit when rendered (generally the
"0" character is the widest).  The internal width must be an integer multiple of
the width divided by 256.  ECMA-376 describes a formula for converting between
pixels and the internal width.  This represents a hybrid approach.

Read functions attempt to populate all three properties.  Write functions will
try to cycle specified values to the desired type.  In order to avoid potential
conflicts, manipulation should delete the other properties first.  For example,
when changing the pixel width, delete the `wch` and `width` properties.

**Column Width Priority**

Even though all of the information is made available, writers are expected to
follow the priority order:

1) use `width` field if available

2) use `wpx` pixel width if available

3) use `wch` character count if available

</details>
