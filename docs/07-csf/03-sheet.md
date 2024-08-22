---
title: Sheet Objects
sidebar_position: 3
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Excel supports 4 different types of "sheets":
- "worksheets": normal sheets
- "chartsheets": full-tab charts
- "macrosheets": legacy (pre-VBA) macros
- "dialogsheets": legacy (pre-VBA) dialog windows

## Generic Sheet Object

Generic sheets are plain JavaScript objects.  Each key that does not start with
`!` is an `A1`-style address whose corresponding value is a cell object.

### Worksheet Range

The `!ref` property stores the [A1-style range](/docs/csf/general#a1-style-1).

Functions that work with sheets should use this property to determine the range.
Cells that are assigned outside of the range are not processed.

For example, in the following sparse worksheet, the cell `A3` will be ignored
since it is outside of the worksheet range (`A1:B2`):

```js
var ws = {
  // worksheet range is A1:B2
  "!ref": "A1:B2",

  // A1 is in the range and will be included
  "A1": { t: "s", v: "SheetJS" },

  // cell A3 is outside of the range and will be ignored
  "A3": { t: "n", v: 5433795 },
};
```

[Utility functions](/docs/api/utilities/) and functions that handle sheets
should test for the presence of the `!ref` field. If the `!ref` is omitted or is
not a valid range, functions should treat the sheet as empty.

### Cell Storage

By default, the parsers and utility functions generate "sparse-mode" worksheets.
For a given [A1-style address](/docs/csf/general#a1-style), `sheet[ref]` is the
corresponding cell object.

#### Dense Mode

When the option `dense: true` is passed, parsers will generate a "dense-mode"
worksheet where cells are stored in an array of arrays. `sheet["!data"][R][C]`
returns the cell object at row `R` and column `C` (zero-indexed values).

When processing small worksheets in older environments, sparse worksheets are
more efficient than dense worksheets. In newer browsers, when dealing with very
large worksheets, dense sheets use less memory and tend to be more efficient.

<details>
  <summary><b>Migrating to Dense Mode</b> (click to show)</summary>

`read`, `readFile`, `write`, `writeFile`, and the various API functions support
sparse and dense worksheets. Functions that accept worksheet or workbook objects
(e.g. `writeFile` and `sheet_to_json`) will detect dense sheets.

The option `dense: true` should be used when creating worksheet or book objects.

**Update code that manually searches for cells** (adding dense mode support):

_Addressing Cells_

<Tabs>
  <TabItem value="es3" label="Works everywhere">

```diff
-var cell = sheet["B7"];
+var cell = sheet["!data"] != null ? (sheet["!data"][6]||[])[1] : sheet["B3"];
```

  </TabItem>
  <TabItem value="es2020" label="New in 2020">

```diff
-var cell = sheet["B7"];
+var cell = sheet["!data"] != null ? sheet["!data"]?.[6]?.[1] : sheet["B3"];
```

  </TabItem>
</Tabs>

The row and column can be calculated using `XLSX.utils.decode_cell`:

```diff
 var addr = "B7";
-var cell = sheet[addr];
+var _addr = XLSX.utils.decode_cell(addr);
+var cell = sheet["!data"] != null ? sheet["!data"]?.[_addr.r]?.[_addr.c] : sheet[addr];
```

`XLSX.utils.encode_cell` will be using the desired row and column indices:

```diff
-var cell = sheet[XLSX.utils.encode_cell({r:R, c:C})];
+var cell = sheet["!data"] != null ? sheet["!data"]?.[R]?.[C] : sheet[XLSX.utils.encode_cell({r:R, c:C})];
```

_Looping across a Worksheet_

Code that manually loops over worksheet objects should test for `"!data"` key:

```js
const { decode_range, encode_cell } = XLSX.utils;

function log_all_cells(ws) {
  var range = decode_range(ws["!ref"]);
  // highlight-next-line
  var dense = ws["!data"] != null; // test if sheet is dense
  for(var R = 0; R <= range.e.r; ++R) {
    for(var C = 0; C <= range.e.c; ++C) {
      // highlight-next-line
      var cell = dense ? ws["!data"]?.[R]?.[C] : ws[encode_cell({r:R, c:C})];
      console.log(R, C, cell);
    }
  }
}
```

**Update workbook and worksheet generation code**

_`read`_
```diff
-var workbook = XLSX.read(data, {...opts});
+var workbook = XLSX.read(data, {...opts, dense: true});
```

_`readFile`_
```diff
-var workbook = XLSX.readFile(data, {...opts});
+var workbook = XLSX.readFile(data, {...opts, dense: true});
```

_`aoa_to_sheet`_
```diff
-var sheet = XLSX.utils.aoa_to_sheet([[1,2,3],[4,5,6]], {...opts});
+var sheet = XLSX.utils.aoa_to_sheet([[1,2,3],[4,5,6]], {...opts, dense: true});
```

_`json_to_sheet`_
```diff
-var sheet = XLSX.utils.json_to_sheet([{x:1,y:2}], {...opts});
+var sheet = XLSX.utils.json_to_sheet([{x:1,y:2}], {...opts, dense: true});
```

</details>

### Sheet Properties

Each key starts with `!`.  The properties are accessible as `sheet[key]`.

- `sheet['!ref']`: [A1-style sheet range string](#worksheet-range)

- `sheet['!margins']`: Object representing the page margins.  The default values
  follow Excel's "normal" preset.  Excel also has a "wide" and a "narrow" preset
  but they are stored as raw measurements. The main properties are listed below:

<details>
  <summary><b>Page margin details</b> (click to show)</summary>

| key      | description            | "normal" | "wide" | "narrow" |
|----------|------------------------|:---------|:-------|:-------- |
| `left`   | left margin (inches)   | `0.7`    | `1.0`  | `0.25`   |
| `right`  | right margin (inches)  | `0.7`    | `1.0`  | `0.25`   |
| `top`    | top margin (inches)    | `0.75`   | `1.0`  | `0.75`   |
| `bottom` | bottom margin (inches) | `0.75`   | `1.0`  | `0.75`   |
| `header` | header margin (inches) | `0.3`    | `0.5`  | `0.3`    |
| `footer` | footer margin (inches) | `0.3`    | `0.5`  | `0.3`    |

```js
/* Set worksheet sheet to "normal" */
ws["!margins"]={left:0.7, right:0.7, top:0.75,bottom:0.75,header:0.3,footer:0.3}
/* Set worksheet sheet to "wide" */
ws["!margins"]={left:1.0, right:1.0, top:1.0, bottom:1.0, header:0.5,footer:0.5}
/* Set worksheet sheet to "narrow" */
ws["!margins"]={left:0.25,right:0.25,top:0.75,bottom:0.75,header:0.3,footer:0.3}
```
</details>

## Worksheet Object

In addition to the aforementioned sheet keys, worksheets also add:

- `ws['!cols']`: [array of column objects](/docs/csf/features/colprops).
  Each column object encodes properties including level, width and visibility.

- `ws['!rows']`: [array of row objects](/docs/csf/features/rowprops).
  Each row object encodes properties including level, height and visibility.

- `ws['!merges']`: [array of merge ranges](/docs/csf/features/merges). Each
  merge object is a range object that represents the covered range.

- `ws['!outline']`: configure how outlines should behave.  Options default to
  the default settings in Excel 2019:

| key       | Excel feature                                 | default |
|:----------|:----------------------------------------------|:--------|
| `above`   | Disable "Summary rows below detail"           | `false` |
| `left`    | Disable "Summary rows to the right of detail" | `false` |

- `ws['!protect']`: object of write sheet protection properties.  The `password`
  key specifies the password for formats that support password-protected sheets
  (XLSX/XLSB/XLS).  The writer uses the XOR obfuscation method.  The following
  keys control the sheet protection -- set to `false` to enable a feature when
  sheet is locked or set to `true` to disable a feature:

<details>
  <summary><b>Worksheet Protection Details</b> (click to show)</summary>

| key                   | feature (true=disabled / false=enabled) | default    |
|:----------------------|:----------------------------------------|:-----------|
| `selectLockedCells`   | Select locked cells                     | enabled    |
| `selectUnlockedCells` | Select unlocked cells                   | enabled    |
| `formatCells`         | Format cells                            | disabled   |
| `formatColumns`       | Format columns                          | disabled   |
| `formatRows`          | Format rows                             | disabled   |
| `insertColumns`       | Insert columns                          | disabled   |
| `insertRows`          | Insert rows                             | disabled   |
| `insertHyperlinks`    | Insert hyperlinks                       | disabled   |
| `deleteColumns`       | Delete columns                          | disabled   |
| `deleteRows`          | Delete rows                             | disabled   |
| `sort`                | Sort                                    | disabled   |
| `autoFilter`          | Filter                                  | disabled   |
| `pivotTables`         | Use PivotTable reports                  | disabled   |
| `objects`             | Edit objects                            | enabled    |
| `scenarios`           | Edit scenarios                          | enabled    |

</details>

- `ws['!autofilter']`: AutoFilter object following the schema:

```typescript
type AutoFilter = {
  ref:string; // A-1 based range representing the AutoFilter table range
}
```

## Other Sheet Types

### Chartsheet Object

Chartsheets are represented as standard sheets.  They are distinguished with the
`!type` property set to `"chart"`.

The underlying data and `!ref` refer to the cached data in the chartsheet.  The
first row of the chartsheet is the underlying header.

### Macrosheet Object

Macrosheets are represented as standard sheets.  They are distinguished with the
`!type` property set to `"macro"`.

### Dialogsheet Object

Dialogsheets are represented as standard sheets. They are distinguished with the
`!type` property set to `"dialog"`.
