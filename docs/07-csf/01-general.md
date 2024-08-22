---
sidebar_position: 1
title: Addresses and Ranges
---

export const g = {style: {backgroundColor:"green"}};

Each cell in a worksheet has a unique address which specifies the row and the
column that include the cell.

## Basic Concepts

### Rows

Spreadsheet applications typically display ordinal row numbers, where `1` is the
first row, `2` is the second row, etc. The numbering starts at `1`.

SheetJS follows JavaScript counting conventions, where `0` is the first row, `1`
is the second row, etc. The numbering starts at `0`.

The following table lists some example row labels:

| Ordinal   | Row Label |   SheetJS |
|:----------|----------:|----------:|
| First     |       `1` |       `0` |
| Second    |       `2` |       `1` |
| 26th      |      `26` |      `25` |
| 420th     |     `420` |     `419` |
| 7262nd    |    `7262` |    `7261` |
| 1048576th | `1048576` | `1048575` |

### Columns

Spreadsheet applications typically use letters to represent columns.

The first column is `A`, the second column is `B`, and the 26th column is `Z`.
After `Z`, the next column is `AA` and counting continues through `AZ`.  After
`AZ`, the count continues with `BA`. After `ZZ`, the count continues with `AAA`.

Some sample values, along with SheetJS column indices, are listed below:

| Ordinal | Column Label | SheetJS |
|:--------|:-------------|--------:|
| First   | `A`          |     `0` |
| Second  | `B`          |     `1` |
| 26th    | `Z`          |    `25` |
| 27th    | `AA`         |    `26` |
| 420th   | `PD`         |   `419` |
| 702nd   | `ZZ`         |   `701` |
| 703rd   | `AAA`        |   `702` |
| 7262nd  | `JSH`        |  `7261` |
| 16384th | `XFD`        | `16383` |

## Cell Addresses

### A1-Style

A1-Style is the default address style in Lotus 1-2-3 and Excel.

A cell address is the concatenation of column label and row label.

For example, the cell in the third column and fourth row is `C4`, concatenating
the third column label (`C`) and the fourth row label (`4`)

### SheetJS Cell Address

Cell address objects are stored as `{c:C, r:R}` where `C` and `R` are 0-indexed
column and row numbers, respectively.  For example, the cell address `B5` is
represented by the object `{c:1, r:4}`.

## Cell Ranges

### A1-Style

A cell range is represented as the top-left cell of the range, followed by `:`,
followed by the bottom-right cell of the range. For example, the range `"C2:D4"`
includes the 6 green cells in the following table:

<table><tbody>
  <tr><th> </th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th></tr>
  <tr><th>1</th><td> </td><td> </td><td> </td><td> </td><td> </td></tr>
  <tr><th>2</th><td> </td><td> </td><td {...g}></td><td {...g}></td><td> </td></tr>
  <tr><th>3</th><td> </td><td> </td><td {...g}></td><td {...g}></td><td> </td></tr>
  <tr><th>4</th><td> </td><td> </td><td {...g}></td><td {...g}></td><td> </td></tr>
  <tr><th>5</th><td> </td><td> </td><td> </td><td> </td><td> </td></tr>
</tbody></table>

A column range is represented by the left-most column, followed by `:`, followed
by the right-most column.  For example, the range `C:D` represents the third and
fourth columns.

A row range is represented by the top-most row, followed by `:`, followed by the
bottom-most column.  For example, `2:4` represents the second/third/fourth rows.

### SheetJS Range

Cell range objects are stored as `{s:S, e:E}` where `S` is the first cell and
`E` is the last cell in the range.  The ranges are inclusive.  For example, the
range `A3:B7` is represented by the object `{s:{c:0, r:2}, e:{c:1, r:6}}`.

#### Column and Row Ranges

A column range (spanning every row) is represented with the starting row `0` and
the ending row `1048575`:

```js
{ s: { c: 0, r: 0 }, e: { c: 0, r: 1048575 } } // A:A
{ s: { c: 1, r: 0 }, e: { c: 2, r: 1048575 } } // B:C
```

A row range (spanning every column) is represented with the starting col `0` and
the ending col `16383`:

```js
{ s: { c: 0, r: 0 }, e: { c: 16383, r: 0 } } // 1:1
{ s: { c: 0, r: 1 }, e: { c: 16383, r: 2 } } // 2:3
```

## Utilities

### Column Names

_Get the SheetJS index from an A1-Style column_

```js
var col_index = XLSX.utils.decode_col("D");
```

The argument is expected to be a string representing a column.

_Get the A1-Style column string from a SheetJS index_

```js
var col_name = XLSX.utils.encode_col(3);
```

The argument is expected to be a SheetJS column (non-negative integer).

### Row Names

_Get the SheetJS index from an A1-Style row_

```js
var row_index = XLSX.utils.decode_row("4");
```

The argument is expected to be a string representing a row.

_Get the A1-Style row string from a SheetJS index_

```js
var row_name = XLSX.utils.encode_row(3);
```

The argument is expected to be a SheetJS column (non-negative integer).

### Cell Addresses

_Generate a SheetJS cell address from an A1-Style address string_

```js
var address = XLSX.utils.decode_cell("A2");
```

The argument is expected to be a string representing a single cell address.

_Generate an A1-Style address string from a SheetJS cell address_

```js
var a1_addr = XLSX.utils.encode_cell({r:1, c:0});
```

The argument is expected to be a SheetJS cell address

### Cell Ranges

_Generate a SheetJS cell range from an A1-Style range string_

```js
var range = XLSX.utils.decode_range("A1:D3");
```

The argument is expected to be a string representing a range or a single cell
address.  The single cell address is interpreted as a single cell range, so
`XLSX.utils.decode_range("D3")` is the same as `XLSX.utils.decode_range("D3:D3")`

_Generate an A1-Style address string from a SheetJS cell address_

```js
var a1_range = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: 3, r: 2 } });
```

The argument is expected to be a SheetJS cell range.
