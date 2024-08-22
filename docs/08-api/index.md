---
pagination_prev: csf/index
sidebar_position: 5
title: API Reference
---

import current from '/version.js';

This section lists the functions defined in the library.

:::info pass

**The ["SheetJS Data Model"](/docs/csf) section covers spreadsheet features.**

The API functions primarily focus on conversions between data representations.

:::

## Library access

Using the ["Standalone" scripts](/docs/getting-started/installation/standalone),
`XLSX` is added to the `window` or other `global` object.

Using the ["NodeJS" module](/docs/getting-started/installation/nodejs), the
`XLSX` variable refers to the CommonJS export:

```js
var XLSX = require("xlsx");
```

Using [a framework](/docs/getting-started/installation/frameworks), the `XLSX`
variable refers to the glob import:

```js
import * as XLSX from "xlsx";
```

## Parsing functions

`XLSX.read(data, read_opts)` attempts to parse `data`.

`XLSX.readFile(filename, read_opts)` attempts to read `filename` and parse.

Parse options are described in the [Parsing Options](/docs/api/parse-options) section.

## Writing functions

`XLSX.write(wb, write_opts)` attempts to write the workbook `wb`.

`XLSX.writeXLSX(wb, write_opts)` attempts to write the workbook in XLSX format.

`XLSX.writeFile(wb, filename, write_opts)` attempts to write `wb` to `filename`.
In browser-based environments, it will attempt to force a client-side download.

`XLSX.writeFileXLSX(wb, filename, write_opts)` attempts to write an XLSX file.

`XLSX.writeFileAsync(filename, wb, o, cb)` attempts to write `wb` to `filename`.
If `o` is omitted, the writer will use the third argument as the callback.

Write options are described in the [Writing Options](/docs/api/write-options) section.

## Utilities

Utilities are available in the `XLSX.utils` object.

The methods are covered in dedicated pages:

**[`A1` Utilities](/docs/csf/general#utilities)**

_Cell and cell address manipulation:_

- `encode_row / decode_row` converts between 0-indexed rows and 1-indexed rows.
- `encode_col / decode_col` converts between 0-indexed columns and column names.
- `encode_cell / decode_cell` converts cell addresses.
- `encode_range / decode_range` converts cell ranges.

**["Arrays of Data" section of "Utility Functions"](/docs/api/utilities/array)**

_Importing Data:_

- `aoa_to_sheet` converts an array of arrays of JS data to a worksheet.
- `json_to_sheet` converts an array of JS objects to a worksheet.
- `sheet_add_aoa` adds an array of arrays of JS data to an existing worksheet.
- `sheet_add_json` adds an array of JS objects to an existing worksheet.

_Exporting Data:_

- `sheet_to_json` converts a worksheet object to an array of JSON objects.

**["HTML" section of "Utility Functions"](/docs/api/utilities/html)**

_Reading from HTML:_

- `table_to_sheet` converts a DOM TABLE element to a worksheet.
- `table_to_book` converts a DOM TABLE element to a worksheet.
- `sheet_add_dom` adds data from a DOM TABLE element to an existing worksheet.

_Writing HTML:_

- `sheet_to_html` generates HTML output.

**["CSV and Text" section of "Utility Functions"](/docs/api/utilities/csv)**

_Writing CSV and Text:_

- `sheet_to_csv` generates delimiter-separated-values output.
- `sheet_to_txt` generates UTF-16 formatted text.

**["Array of Formulae" section of "Utility Functions"](/docs/api/utilities/formulae)**

_Exporting Formulae:_

- `sheet_to_formulae` generates a list of formulae or cell value assignments.

**["Workbook Helpers" section of "Utility Functions"](/docs/api/utilities/wb)**

_Workbook Operations:_

- `book_new` creates a workbook object
- `book_append_sheet` adds a worksheet to a workbook

**[Utility Functions](/docs/api/utilities)**

_Miscellaneous_

- `format_cell` generates the text value for a cell (using number formats).
- `sheet_set_array_formula` adds an array formula to a worksheet

## Platform-Specific Functions

### NodeJS Streaming Write functions

`XLSX.stream` contains a set of streaming write functions for NodeJS streams:

- `to_csv(sheet, opts)` streams CSV rows
- `to_html(sheet, opts)` streams an HTML table incrementally
- `to_json(sheet, opts)` streams JS objects (object-mode stream)
- `to_xlml(book, opts)` streams a SpreadsheetML2003 workbook incrementally

Stream methods are described in the ["Stream Export"](/docs/api/stream) section.

### ESM Helpers

Due to broad inconsistencies in ESM implementations, the `mjs` build does not
import any dependencies.  Instead, they must be manually passed to the library:

`XLSX.set_cptable` sets the internal `codepage` instance.  This provides support
for different languages in XLS or text parsing.

`XLSX.set_fs` set `fs` instance (using `readFileSync` and `writeFileSync`). This
provides NodeJS ESM support for `XLSX.readFile` and `XLSX.writeFile`.

`XLSX.utils.set_readable` supplies a NodeJS `stream.Readable` constructor.  This
provides NodeJS ESM support for the streaming operations.

ESM helper functions are described in the ["NodeJS" Installation section](/docs/getting-started/installation/nodejs)

## Miscellaneous

`XLSX.version` is the version of the library.

:::note pass

<p>The current version is <code>{current}</code></p>

:::

`XLSX.SSF` is an embedded version of the [format library](/docs/constellation/ssf).

`XLSX.CFB` is an embedded version of the [container library](https://git.sheetjs.com/sheetjs/js-cfb).
