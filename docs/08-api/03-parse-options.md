---
title: Reading Files
sidebar_position: 3
hide_table_of_contents: true
---

The main SheetJS method for reading files is `read`. It expects developers to
supply the actual data in a supported representation.

The `readFile` helper method accepts a filename and tries to read the specified
file using standard APIs. *It does not work in web browsers!*

**Parse file data and generate a SheetJS workbook object**

```js
var wb = XLSX.read(data, opts);
```

`read` attempts to parse `data` and return [a workbook object](/docs/csf/book)

The [`type`](#input-type) property of the `opts` object controls how `data` is
interpreted. For string data, the default interpretation is Base64.

**Read a specified file and generate a SheetJS workbook object**

```js
var wb = XLSX.readFile(filename, opts);
```

`readFile` attempts to read a local file with specified `filename`.

:::caution pass

`readFile` works in specific platforms. **It does not support web browsers!**

The [NodeJS installation note](/docs/getting-started/installation/nodejs#usage)
includes additional instructions for non-standard use cases.

:::

## Parsing Options

The read functions accept an options argument:

| Option Name | Default | Description                                          |
|:------------|:--------|:-----------------------------------------------------|
|`type`       |         | [Input data representation](#input-type)             |
|`raw`        | `false` | If true, plain text parsing will not parse values ** |
|`dense`      | `false` | If true, use a [dense sheet representation](#dense)  |
|`codepage`   |         | If specified, use code page when appropriate **      |
|`cellFormula`| `true`  | Save [formulae to the `.f` field](#formulae)         |
|`cellHTML`   | `true`  | Parse rich text and save HTML to the `.h` field      |
|`cellNF`     | `false` | Save number format string to the `.z` field          |
|`cellStyles` | `false` | Save style/theme info to the `.s` field              |
|`cellText`   | `true`  | Generated formatted text to the `.w` field           |
|`cellDates`  | `false` | Store dates as type `d` (default is `n`)             |
|`dateNF`     |         | If specified, use the string for date code 14 **     |
|`sheetStubs` | `false` | Create cell objects of type `z` for stub cells       |
|`sheetRows`  | `0`     | If >0, read the [specified number of rows](#range)   |
|`bookDeps`   | `false` | If true, parse calculation chains                    |
|`bookFiles`  | `false` | If true, add raw files to book object **             |
|`bookProps`  | `false` | If true, only parse enough to get book metadata **   |
|`bookSheets` | `false` | If true, only parse enough to get the sheet names    |
|`bookVBA`    | `false` | If true, generate [VBA blob](#vba)                   |
|`password`   | `""`    | If defined and file is encrypted, use password **    |
|`WTF`        | `false` | If true, throw errors on unexpected file features ** |
|`sheets`     |         | If specified, only parse specified sheets **         |
|`nodim`      | `false` | If true, calculate [worksheet ranges](#range)        |
|`PRN`        | `false` | If true, allow parsing of PRN files **               |
|`xlfn`       | `false` | If true, [preserve prefixes](#formulae) in formulae  |
|`FS`         |         | DSV Field Separator override                         |
|`UTC`        | `true`  | If explicitly false, parse text dates in local time  |

- Even if `cellNF` is false, formatted text will be generated and saved to `.w`
- In some cases, sheets may be parsed even if `bookSheets` is false.
- Excel aggressively tries to interpret values from CSV and other plain text.
  This leads to surprising behavior! The `raw` option suppresses value parsing.
- `bookSheets` and `bookProps` combine to give both sets of information
- `Deps` will be an empty object if `bookDeps` is false
- `bookFiles` behavior depends on file type:
    * `keys` array (paths in the ZIP) for ZIP-based formats
    * `files` hash (mapping paths to objects representing the files) for ZIP
    * `cfb` object for formats using CFB containers
- By default all worksheets are parsed.  `sheets` restricts based on input type:
    * number: zero-based index of worksheet to parse (`0` is first worksheet)
    * string: name of worksheet to parse (case insensitive)
    * array of numbers and strings to select multiple worksheets.
- `codepage` is applied to BIFF2 - BIFF5 files without `CodePage` records and to
  CSV files without BOM in `type:"binary"`.  BIFF8 XLS always defaults to 1200.
- `PRN` affects parsing of text files without a common delimiter character.
- Currently only XOR encryption is supported.  Unsupported error will be thrown
  for files employing other encryption methods.
- `WTF` is mainly for development.  By default, the parser will suppress read
  errors on single worksheets, allowing you to read from the worksheets that do
  parse properly. Setting `WTF:true` forces those errors to be thrown.
- `UTC` applies to CSV, Text and HTML formats.  When explicitly set to `false`,
  the parsers will assume the files are specified in local time. By default, as
  is the case for other file formats, dates and times are interpreted in UTC.

#### Dense

The ["Cell Storage"](/docs/csf/sheet#cell-storage) section of the SheetJS Data
Model documentation explains the worksheet representation in more detail.

:::note pass

[Utility functions that process SheetJS workbook objects](/docs/api/utilities/)
typically process both sparse and dense worksheets.

:::

#### Range

Some file formats, including XLSX and XLS, can self-report worksheet ranges. The
self-reported ranges are used by default.

If the `sheetRows` option is set, up to `sheetRows` rows will be parsed from the
worksheets. `sheetRows-1` rows will be generated when looking at the JSON object
output (since the header row is counted as a row when parsing the data). The
`!ref` property of the worksheet will hold the adjusted range. For formats that
self-report sheet ranges, the `!fullref` property will hold the original range.

The `nodim` option instructs the parser to ignore self-reported ranges and use
the actual cells in the worksheet to determine the range. This addresses known
issues with non-compliant third-party exporters.

#### Formulae

For some file formats, the `cellFormula` option must be explicitly enabled to
ensure that formulae are extracted.

Newer Excel functions are serialized with the `_xlfn.` prefix, hidden from the
user. SheetJS will strip `_xlfn.` normally. The `xlfn` option preserves them.
[The "Formulae" docs](/docs/csf/features/formulae#prefixed-future-functions)
covers this in more detail.

["Formulae"](/docs/csf/features/formulae) covers the features in more detail.

#### VBA

When a macro-enabled file is parsed, if the `bookVBA` option is `true`, the raw
VBA blob will be stored in the `vbaraw` property of the workbook.

["VBA and Macros"](/docs/csf/features/vba) covers the features in more detail.

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

The `bookVBA` merely exposes the raw VBA CFB object. It does not parse the data.

XLSM and XLSB store the VBA CFB object in `xl/vbaProject.bin`. BIFF8 XLS mixes
the VBA entries alongside the core Workbook entry, so the library generates a
new blob from the XLS CFB container that works in XLSM and XLSB files.

</details>

### Input Type

The `type` parameter for `read` controls how data is interpreted:

| `type`     | expected input                                                  |
|:-----------|:----------------------------------------------------------------|
| `"base64"` | string: Base64 encoding of the file                             |
| `"binary"` | string: binary string (byte `n` is `data.charCodeAt(n)`)        |
| `"string"` | string: JS string (only appropriate for UTF-8 text formats)     |
| `"buffer"` | nodejs Buffer                                                   |
| `"array"`  | array: array of 8-bit unsigned integers (byte `n` is `data[n]`) |
| `"file"`   | string: path of file that will be read (nodejs only)            |

Some common types are automatically deduced from the data input type, including
NodeJS `Buffer` objects, `Uint8Array` and `ArrayBuffer` objects, and arrays of
numbers.

When a JS `string` is passed with no `type`, the library assumes the data is a
Base64 string. `FileReader#readAsBinaryString` or ASCII data requires `"binary"`
type. DOM strings including `FileReader#readAsText` should use type `"string"`.

### Guessing File Type

<details>
  <summary><b>Implementation Details</b> (click to show)</summary>

Excel and other spreadsheet tools read the first few bytes and apply other
heuristics to determine a file type.  This enables file type punning: renaming
files with the `.xls` extension will tell your computer to use Excel to open the
file but Excel will know how to handle it.  This library applies similar logic:

| Byte 0 | Raw File Type | Spreadsheet Types                                   |
|:-------|:--------------|:----------------------------------------------------|
| `0xD0` | CFB Container | BIFF 5/8 or protected XLSX/XLSB or WQ3/QPW or XLR   |
| `0x09` | BIFF Stream   | BIFF 2/3/4/5                                        |
| `0x3C` | XML/HTML      | SpreadsheetML / Flat ODS / UOS1 / HTML / plain text |
| `0x50` | ZIP Archive   | XLSB or XLSX/M or ODS or UOS2 or NUMBERS or text    |
| `0x49` | Plain Text    | SYLK or plain text                                  |
| `0x54` | Plain Text    | DIF or plain text                                   |
| `0xEF` | UTF-8 Text    | SpreadsheetML / Flat ODS / UOS1 / HTML / plain text |
| `0xFF` | UTF-16 Text   | SpreadsheetML / Flat ODS / UOS1 / HTML / plain text |
| `0x00` | Record Stream | Lotus WK\* or Quattro Pro or plain text             |
| `0x7B` | Plain text    | RTF or plain text                                   |
| `0x0A` | Plain text    | SpreadsheetML / Flat ODS / UOS1 / HTML / plain text |
| `0x0D` | Plain text    | SpreadsheetML / Flat ODS / UOS1 / HTML / plain text |
| `0x20` | Plain text    | SpreadsheetML / Flat ODS / UOS1 / HTML / plain text |

DBF files are detected based on the first byte as well as the third and fourth
bytes (corresponding to month and day of the file date)

Works for Windows files are detected based on the `BOF` record with type `0xFF`

Plain text format guessing follows the priority order:

| Format | Test                                                                |
|:-------|:--------------------------------------------------------------------|
| XML    | `<?xml` appears in the first 1024 characters                        |
| HTML   | starts with `<` and HTML tags appear in the first 1024 characters   |
| XML    | starts with `<` and the first tag is valid                          |
| RTF    | starts with `{\rt`                                                  |
| DSV    | starts with `sep=` followed by field delimiter and line separator   |
| DSV    | more unquoted `\|` chars than `;` `\t` or `,` in the first 1024     |
| DSV    | more unquoted `;` chars than `\t` or `,` in the first 1024          |
| TSV    | more unquoted `\t` chars than `,` chars in the first 1024           |
| CSV    | one of the first 1024 characters is a comma `","`                   |
| ETH    | starts with `socialcalc:version:`                                   |
| PRN    | `PRN` option is set to true                                         |
| CSV    | (fallback)                                                          |

HTML tags include `html`, `table`, `head`, `meta`, `script`, `style`, `div`

</details>

<details open>
  <summary><b>Why are random text files valid?</b> (click to hide)</summary>

Excel is extremely aggressive in reading files. Adding the XLS extension to any
text file (where the only characters are ANSI display chars) tricks Excel into
processing the file as if it were a CSV or TSV file, even if the result is not
useful!  This library attempts to replicate that behavior.

The best approach is to validate the desired worksheet and ensure it has the
expected number of rows or columns.  Extracting the range is extremely simple:

```js
var range = XLSX.utils.decode_range(worksheet['!ref']);
var ncols = range.e.c - range.s.c + 1, nrows = range.e.r - range.s.r + 1;
```

</details>

