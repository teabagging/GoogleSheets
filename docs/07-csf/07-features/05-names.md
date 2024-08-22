---
title: Defined Names
sidebar_position: 5
---

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

Defined names have evolved over the decades, with new features added over time:

- "English" refers to defined names with English letters and numbers (ASCII)
- "Unicode" refers to defined names with non-English characters.
- "Comment" refers to comments that can be attached to defined names.

| Formats           | English | Unicode | Comment |
|:------------------|:-------:|:-------:|:-------:|
| XLSX / XLSM       |    ✔    |    ✔    |    ✔    |
| XLSB              |    ✔    |    ✔    |    ✔    |
| XLS               |    ✔    |    ✔    |    ✔    |
| XLML              |    ✔    |    ✔    |         |
| SYLK              |    ✔    |    ✕    |         |
| ODS / FODS / UOS  |    ✔    |    ✔    |         |

X (✕) marks features that are not supported by the file formats. There is
no way to specify a Unicode defined name in the SYLK format.

</details>

Defined names (sometimes called "named ranges") are labeled references to cells,
ranges, constants or formulae. Meaningful labels can make formula expressions
more readable and more robust to worksheet changes.

<details>
  <summary><b>Why are Defined Names useful?</b> (click to show)</summary>

For example, the `NPV` formula function calculates the net present value of a
series of cashflows. In large workbooks, raw data will be stored in separate
worksheets and the interest rate will be stored in a separate "Model Parameters"
worksheet. Formulae may have references to multiple sheets:

```
=NPV('Model Parameters'!B2,Data!B2:F2)
     ^^^^^^^^^^^^^^^^^^^^^ --- interest rate
```

A defined name `Interest` referencing `'Model Parameters'!B2` would greatly
simplify the formula:

```
=NPV(Interest,Data!B2:F2)
     ^^^^^^^^ --- interest rate
```

Judicious use of Defined Names generally lead to fewer formula errors.

</details>

## Storage

The `Workbook` property of SheetJS workbook objects store workbook attributes.
The `Names` property of `Workbook` is an array of SheetJS defined name objects.

:::caution pass

Parsers do not always create the `Names` array or `Workbook` structure. Code
should test for the existence of the defined names array before use:

```js
var wb = XLSX.utils.book_new();

/* ensure the workbook structure exists */
/* highlight-start */
if(!wb.Workbook) wb.Workbook = {};
if(!wb.Workbook.Names) wb.Workbook.Names = [];
/* highlight-end */

/* add a new defined name */
wb.Workbook.Names.push({ Name: "MyData", Ref: "Sheet1!$A$1:$A$2" });
```

:::

## Defined Name Object

SheetJS defined name objects support the following properties:

| Key       | Name in app | Description                                        |
|:----------|:------------|:---------------------------------------------------|
| `Sheet`   | "Scope"     | Sheet Index (0 = first sheet) or `null` (Workbook) |
| `Name`    | "Name"      | Case-sensitive name.  Standard rules apply         |
| `Ref`     | "Refers To" | A1-Style Reference (`"Sheet1!$A$1:$D$20"`)         |
| `Comment` | "Comment"   | Comment (for supported file formats)               |

### Ranges

Defined name references in formulae are internally shifted to the cell address.
For example, given the defined name

```js
{ Name: "MyData", Ref: "Sheet1!A1:A2" } // no $ means relative reference
```

If `D4` is set to `=SUM(MyData)`:

```js
ws["D4"].f = "SUM(MyData)";
```

Spreadsheet software will translate the defined name range down to the cell.
Excel will try to calculate `SUM(D4:D5)` and assign to cell `D4`.  This will
elicit a circular reference error.

The recommended approach is to fix the rows and columns of the reference:

```js
{ Name: "MyData", Ref: "Sheet1!$A$1:$A$2" } // absolute reference
```

### Scope

Excel allows two sheet-scoped defined names to share the same name.  However, a
sheet-scoped name cannot collide with a workbook-scope name.  Workbook writers
may not enforce this constraint.

The following snippet creates a worksheet-level defined name `"Global"` and a
local defined name `"Local"` with distinct values for first and second sheets:

```js
/* "Global" workbook-level -> Sheet1 A1:A2 */
wb.Workbook.Names.push({ Name: "Global", Ref: "Sheet1!$A$1:$A$2" });

/* "Local" scoped to the first worksheet -> Sheet1 B1:B2 */
wb.Workbook.Names.push({ Name: "Local",  Ref: "Sheet1!$B$1:$B$2", Sheet: 0 });

/* "Local" scoped to the second worksheet -> Sheet1 C1:C2 */
wb.Workbook.Names.push({ Name: "Local",  Ref: "Sheet1!$C$1:$C$2", Sheet: 1 });
```

## Live Demo

The following example creates 3 defined names:

- "Global" is a workbook-level name that references `Sheet1!$A$1:$A$2`
- "Local" in the first worksheet references `Sheet1!$B$1:$B$2`
- "Local" in the second worksheet references `Sheet1!$C$1:$C$2`

Both worksheets include formulae referencing "Local" and "Global". Since the
referenced ranges are different, the expressions using "Local" will differ.

```jsx live
/* The live editor requires this function wrapper */
function DefinedNameExport() { return ( <button onClick={() => {
  /* Create empty workbook */
  var wb = XLSX.utils.book_new();

  /* Create worksheet Sheet1 */
  var ws1 = XLSX.utils.aoa_to_sheet([[1,2,3],[4,5,6],["Global",0],["Local",0]]);
  XLSX.utils.book_append_sheet(wb, ws1, "Sheet1");

  /* Create worksheet Sheet2 */
  var ws2 = XLSX.utils.aoa_to_sheet([["Global",0],["Local",0]]);
  XLSX.utils.book_append_sheet(wb, ws2, "Sheet2");

  /* Create defined names */
  if(!wb.Workbook) wb.Workbook = {};
  if(!wb.Workbook.Names) wb.Workbook.Names = [];
  /* "Global" workbook-level -> Sheet1 A1:A2 */
  wb.Workbook.Names.push({ Name: "Global", Ref: "Sheet1!$A$1:$A$2" });
  /* "Local" scoped to the first worksheet -> Sheet1 B1:B2 */
  wb.Workbook.Names.push({ Name: "Local", Sheet: 0, Ref: "Sheet1!$B$1:$B$2" });
  /* "Local" scoped to the second worksheet -> Sheet1 C1:C2 */
  wb.Workbook.Names.push({ Name: "Local", Sheet: 1, Ref: "Sheet1!$C$1:$C$2" });

  /* Create formulae */
  ws1["B3"].f = "SUM(Global)"; // Sheet1 B3 =SUM(Global)  1 + 4 = 5
  ws1["B4"].f = "SUM(Local)";  // Sheet1 B4 =SUM(Local)   2 + 5 = 7
  ws2["B1"].f = "SUM(Global)"; // Sheet2 B1 =SUM(Global)  1 + 4 = 5
  ws2["B2"].f = "SUM(Local)";  // Sheet2 B2 =SUM(Local)   3 + 6 = 9

  /* Export to file (start a download) */
  XLSX.writeFile(wb, "SheetJSDNExport.xlsx");
}}><b>Export XLSX!</b></button> ); }
```
