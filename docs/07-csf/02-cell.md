---
title: Cell Objects
sidebar_position: 2
---

Cell objects are plain JS objects with keys and values following the convention:

| Key | Description                                                            |
| --- | ---------------------------------------------------------------------- |
|     | **Core Cell Properties**                                               |
| `t` | cell type ([more info](#cell-types))                                   |
| `v` | underlying value ([more info](#underlying-values))                     |
|     | **Number Formats** ([More Info](/docs/csf/features/nf))                |
| `z` | number format string associated with the cell (if requested)           |
| `w` | formatted text (if applicable)                                         |
|     | **Formulae** ([More Info](/docs/csf/features/formulae))                |
| `f` | cell formula encoded as an A1-Style string (if applicable)             |
| `F` | range of enclosing array if formula is array formula (if applicable)   |
| `D` | if true, array formula is dynamic (if applicable)                      |
|     | **Other Cell Properties** ([More Info](/docs/csf/features))            |
| `l` | cell hyperlink / tooltip ([More Info](/docs/csf/features/hyperlinks))  |
| `c` | cell comments ([More Info](/docs/csf/features/comments))               |
| `r` | rich text encoding (if applicable)                                     |
| `h` | HTML rendering of the rich text (if applicable)                        |
| `s` | the style/theme of the cell (if applicable)                            |

Cell objects are expected to have a type (`t` property). Cells with values are
expected to store the values in the `v` property. The cell type influences the
interpretation of cell values.

## Content and Presentation

Spreadsheets typically separate "content" from "presentation". A cell with a
value of `$3.50` is typically stored as a numeric cell with an underlying value
of `3.5` and a number format such as `$0.00`

The cell type is stored in the `t` property of the cell.

The underlying value, representing a JavaScript equivalent of the spreadsheet
"content", is stored in the `v` property of the cell.

The number format string is stored in the `z` property of the cell.

The SheetJS number formatting library will generate formatted text. It will be
stored in the `w` property of the cell.

For this example, the SheetJS cell representation will be

```js
var cell = {
  t: "n",     // numeric cell
  v: 3.5,     // underlying value 3.5
  z: "$0.00", // number format $0.00
  w: "$3.50"  // formatted text
};
```

Parsers for most common formats will typically generate formatted text at parse
time and skip the original number formats. There are options to preserve the
number formats and skip formatted text generation.

:::info pass

["Number Formats"](/docs/csf/features/nf) discusses formatting in more detail.

:::

## Cell Types

There are 6 SheetJS cell types:

| Type | Description                                                           |
| :--: | :-------------------------------------------------------------------- |
| `b`  | Boolean: value interpreted as JS `boolean`                            |
| `e`  | Error: value is a numeric code and `w` property stores common name ** |
| `n`  | Number: value is a JS `number` **                                     |
| `d`  | Date: value is a JS `Date` object or string to be parsed as Date **   |
| `s`  | Text: value interpreted as JS `string` and written as text **         |
| `z`  | Stub: blank stub cell that is ignored by data processing utilities ** |

Type `n` is the Number type. This includes all forms of data that Excel stores
as numbers, such as dates/times and Boolean fields.  Excel exclusively uses data
that can be fit in an IEEE754 floating point number, just like JS Number, so the
`v` field holds the raw number.  The `w` field holds formatted text.  Dates are
stored as numbers by default and converted with `XLSX.SSF.parse_date_code`.

Type `d` is the Date type, generated only when the option `cellDates` is passed.
Since JSON does not have a natural Date type, parsers are generally expected to
store ISO 8601 Date strings like you would get from `date.toISOString()`.  On
the other hand, writers and exporters should be able to handle date strings and
JS Date objects.  Note that Excel disregards timezone modifiers and treats all
dates in the local timezone.  The library does not correct for this error.
Dates are covered in more detail [in the Dates section](/docs/csf/features/dates)

Type `s` is the String type.  Values are explicitly stored as text.  Excel will
interpret these cells as "number stored as text".  Generated Excel files
automatically suppress that class of error, but other formats may elicit errors.

Type `b` is the Boolean type. Values are either `true` or `false`.

Type `z` represents blank stub cells.  They are generated in cases where cells
have no assigned value but hold comments or other metadata. They are ignored by
the core library data processing utility functions.  By default these cells are
not generated; the parser `sheetStubs` option must be set to `true`.

Type `e` is the Error type. The `v` field holds numeric error codes, while `w`
holds the error message. Valid values are listed [in the "Error" table](#error).

## Underlying Values

Spreadsheet conventions do not always line up with JavaScript conventions. The
library attempts to translate between Excel values and JavaScript primitives.

### Excel Values

Each value in Excel has a type which can be displayed with the `TYPE` function.
There are four scalar types:

| Description            | Example   | Formula Expression  | Result |
|:-----------------------|:----------|:--------------------|-------:|
| Number / Date / Blank  | `54337`   | `=TYPE(54337)`      |    `1` |
| Text                   | `SheetJS` | `=TYPE("SheetJS")`  |    `2` |
| Boolean (Logical)      | `TRUE`    | `=TYPE(TRUE)`       |    `4` |
| Error                  | `#VALUE!` | `=TYPE(#VALUE!)`    |   `16` |

:::info pass

Lotus 1-2-3, Excel, and other spreadsheet software typically store dates as
numbers and use the number format to determine if values represent dates.
See ["Dates and Times"](/docs/csf/features/dates) for more info.

:::

#### Number

Each valid Excel number can be represented as a JavaScript number primitive.[^1]

SheetJS libraries normally generate JavaScript numbers. For cells with date-like
number formats[^2], there are options to generate JavaScript `Date` objects.

:::info pass

Excel displays exponential numbers with an uppercase `E` while JavaScript
numbers are traditionally displayed with a lowercase `e`. Even though the
underlying values may appear different, they are functionally identical.

:::

#### Text

Each valid Excel string can be represented as a JavaScript string primitive.
SheetJS libraries generate JavaScript strings.

#### Boolean

There are two Boolean values: "true" and "false".

Excel renders the Boolean values in uppercase: `TRUE` and `FALSE`

JavaScript renders Boolean literals in lowercase: `true` and `false`

SheetJS libraries generate the JavaScript form. The formatted text will be the
uppercase `TRUE` or `FALSE`, matching Excel rendering.

#### Error

The underlying value for an Excel error is a number. The supported error types
and numeric values are listed below:

| Excel Error     |  Value |
| :-------------- | -----: |
| `#NULL!`        | `0x00` |
| `#DIV/0!`       | `0x07` |
| `#VALUE!`       | `0x0F` |
| `#REF!`         | `0x17` |
| `#NAME?`        | `0x1D` |
| `#NUM!`         | `0x24` |
| `#N/A`          | `0x2A` |
| `#GETTING_DATA` | `0x2B` |

SheetJS parsers mark the cell type of error cells and store the listed numeric
value. The formatted text will be the error string shown in Excel.

:::note pass

`#SPILL!`, `#CONNECT!`, and `#BLOCKED!` errors are saved to files as `#VALUE!`.

:::

### JavaScript Values

Each primitive value in JavaScript has a type which can be displayed with the
`typeof` operator. There are 5 types in the ECMAScript 5 dialect of JavaScript:

| Type      | Example     | `typeof`      |
|:----------|:------------|:--------------|
| Undefined | `undefined` | `"undefined"` |
| Null      | `null`      | `"null"`      |
| Boolean   | `true`      | `"boolean"`   |
| String    | `"SheetJS"` | `"string"`    |
| Number    | `5433795`   | `"number"`    |

#### Undefined

`undefined` in JavaScript is spiritually equivalent to a blank cell value in
Excel. By default, SheetJS methods that generate worksheets skip `undefined`.

#### Null

`null` in JavaScript typically is used to represent no data. The `#NULL!` error
in Excel is intended to break formula expressions that reference the cells[^3].
`#NULL!` is spiritually similar to `NaN`.

By default, SheetJS methods that generate worksheets skip `null`. Some methods
include options to generate `#NULL!` error cells.

#### Boolean

There are two Boolean values: "true" and "false".

SheetJS libraries map JavaScript `true` / `false` literals to Excel `TRUE` /
`FALSE` Boolean values.

#### String

The underlying value of a JavaScript string is always the original string.

SheetJS export methods will shorten or re-encode strings as necessary to export
valid strings for the requested file formats.

#### Number

The underlying value of a JavaScript number is always the original number.

SheetJS export methods will translate supported numbers to numeric cells. `NaN`
values will be translated to Excel `#NUM!` errors. Infinities and denormalized
values are translated to `#DIV/0!`.

#### Dates

:::note pass

JavaScript `Date` objects are Objects. They can be distinguished from other
Objects with the `instanceof` operator.

:::

SheetJS date cells can hold Date objects. When exporting workbooks to formats
that do not have native Date types, the values will be translated to date codes.

[^1]: Each valid Excel number can be represented as an IEEE754 double. Excel does not support denormalized numbers, the `NaN` family, `Infinity`, or `-Infinity`. See ["Floating-point arithmetic may give inaccurate results in Excel"](https://learn.microsoft.com/en-us/office/troubleshoot/excel/floating-point-arithmetic-inaccurate-result) in the Excel documentation for more information.
[^2]: The table in ["Dates and Times" section of "Number Formats"](/docs/csf/features/nf#dates-and-times) lists the tokens that SheetJS uses to determine if a cell value should be treated as a Date.
[^3]: [`NULL` function](https://support.microsoft.com/en-us/office/null-function-c7fb4579-e8aa-4883-a8e3-2b8055100e39) in the Excel documentation explains the intended use case.