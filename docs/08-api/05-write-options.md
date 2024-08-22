---
sidebar_position: 5
hide_table_of_contents: true
title: Writing Files
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

The main SheetJS method for writing workbooks is `write`. Scripts receive common
[JavaScript data representations](#output-type) and are expected to write or
share files using platform-specific APIs.

The `writeFile` helper method accepts a filename and tries to write to a local
file using [standard APIs](/docs/demos/local/file).

**Export a SheetJS workbook object in a specified file format**

```js
var file_data = XLSX.write(wb, opts);
```

`write` attempts to write the workbook `wb` and return the file.

The `options` argument is required.  It must specify
- [`bookType`](#supported-output-formats) (file format of the exported file)
- [`type`](#output-type) (return value type)

**Export a SheetJS workbook object and attempt to write a local file**

```js
XLSX.writeFile(wb, filename, options);
```

`writeFile` attempts to write `wb` to a local file with specified `filename`.

In browser-based environments, it will attempt to force a client-side download.
It also supports NodeJS, ExtendScript applications, and Chromium extensions.

If `options` is omitted or if `bookType` is missing from the `options` object,
the output file format will be deduced from the filename extension.

**Special functions for exporting data in the XLSX format**

```js
// limited form of `write`
var file_data = XLSX.writeXLSX(wb, options);


// limited form of `writeFile`
XLSX.writeFileXLSX(wb, filename, options);
```

`writeXLSX` and `writeFileXLSX` are limited versions of `write` and `writeFile`.
They support writing to the XLSX file format.

For websites that exclusively export to XLSX, these functions can reduce the
size of the production site. The general `write` and `writeFile` functions are
more appropriate when exporting to XLS or XLSB or other formats.


<details>
  <summary><b>NodeJS-specific methods</b> (click to show)</summary>

**Export a workbook and attempt to write a local file using `fs.writeFile`**

```js
// callback equivalent of `XLSX.writeFile`
XLSX.writeFileAsync(filename, wb, cb);

// callback equivalent with options argument
XLSX.writeFileAsync(filename, wb, options, cb);
```


`writeFileAsync` attempts to write `wb` to `filename` and invoke the callback
`cb` on completion.

When an `options` object is specified, it is expected to be the third argument.

This method only works in NodeJS and uses `fs.writeFile` under the hood.

</details>

:::note Recommendation

`writeFile` wraps a number of export techniques, making it suitable for browser
downloads, NodeJS, ExtendScript apps, and Chromium extensions.  It does not work
in other environments with more advanced export methods.

The `write` method returns raw bytes or strings that can be exported in
[Desktop apps](/docs/demos/desktop/) , [Mobile apps](/docs/demos/mobile) , and
[Servers](/docs/demos/net/server).

The [demos](/docs/demos) preferentially use `writeFile`. When `writeFile` is not
supported, the demos show file creation using `write` and platform APIs.

:::

## Writing Options

The write functions accept an options argument:

| Option Name |  Default | Description                                        |
| :---------- | -------: | :------------------------------------------------- |
|`type`       |          | Output data encoding (see Output Type below)       |
|`cellDates`  |  `false` | Store dates as type `d` (default is `n`)           |
|`cellStyles` |  `false` | Save style/theme info to the `.s` field            |
|`codepage`   |          | If specified, use code page when appropriate **    |
|`bookSST`    |  `false` | Generate Shared String Table **                    |
|`bookType`   | `"xlsx"` | Type of Workbook (see below for supported formats) |
|`bookVBA`    |          | Add VBA blob from workbook object to the file **   |
|`WTF`        |  `false` | If true, throw errors on unexpected features **    |
|`sheet`      |     `""` | Name of Worksheet for single-sheet formats **      |
|`compression`|  `false` | Use ZIP compression for ZIP-based formats **       |
|`Props`      |          | Override workbook properties when writing **       |
|`themeXLSX`  |          | Override theme XML when writing XLSX/XLSB/XLSM **  |
|`ignoreEC`   |   `true` | Suppress "number as text" errors **                |
|`numbers`    |          | Payload for NUMBERS export **                      |
|`FS`         |  `","`   | "Field Separator"  delimiter between fields **     |
|`RS`         |  `"\n"`  | "Record Separator" delimiter between rows **       |

- `bookSST` is slower and more memory intensive, but has better compatibility
  with older versions of iOS Numbers
- The raw data is the only thing guaranteed to be saved. Features not described
  in this README may not be serialized.
- `cellDates` only applies to XLSX output and is not guaranteed to work with
  third-party readers.  Excel itself does not usually write cells with type `d`
  so non-Excel tools may ignore the data or error in the presence of dates.
- `codepage` is applied to legacy formats including DBF.  Characters missing
  from the encoding will be replaced with underscore characters (`_`).
- `Props` is an object mirroring the workbook `Props` field. See the table from
  the [Workbook File Properties](/docs/csf/book#file-properties) section.
- if specified, the string from `themeXLSX` will be saved as the primary theme
  for XLSX/XLSB/XLSM files (to `xl/theme/theme1.xml` in the ZIP)
- Due to a bug in the program, some features like "Text to Columns" will crash
  Excel on worksheets where error conditions are ignored.  The writer will mark
  files to ignore the error by default.  Set `ignoreEC` to `false` to suppress.
- `FS` and `RS` apply to CSV and Text output formats. The options are discussed
  in ["CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
- `bookVBA` only applies to supported formats. ["VBA"](/docs/csf/features/vba)
  section explains the feature in more detail.
- `WTF` is mainly for development.

<details open>
  <summary><b>Exporting NUMBERS files</b> (click to show)</summary>

The NUMBERS writer requires a fairly large base.  The supplementary `xlsx.zahl`
scripts provide support.  `xlsx.zahl.js` is designed for standalone and NodeJS
use, while `xlsx.zahl.mjs` is suitable for ESM.

Adding NUMBERS export support involves two steps:

1) Load the `xlsx.zahl` script

2) Pass the payload into the `numbers` option to `write` or `writeFile`.

<Tabs>
  <TabItem value="browser" label="Browser">

<p><a href={"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.zahl.js"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.zahl.js"}</a> is the URL for {current}</p>

<CodeBlock language="html">{`\
<meta charset="utf8">\n\
<body>\n\
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>\n\
<script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.zahl.js"></script>\n\
<script>\n\
var wb = XLSX.utils.book_new(); var ws = XLSX.utils.aoa_to_sheet([\n\
  ["SheetJS", "<3","விரிதாள்"],\n\
  [72,,"Arbeitsblätter"],\n\
  [,62,"数据"],\n\
  [true,false,],\n\
]); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");\n\
XLSX.writeFile(wb, "textport.numbers", {numbers: XLSX_ZAHL_PAYLOAD, compression: true});\n\
</script>\n\
</body>`}
</CodeBlock>

  </TabItem>
  <TabItem value="nodejs" label="NodeJS">

After installing the package:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

The scripts will be available at `xlsx/dist/xlsx.zahl` (CommonJS) and
`xlsx/dist/xlsx.zahl.mjs` (ESM).

```js
var XLSX = require("xlsx");
var XLSX_ZAHL_PAYLOAD = require("xlsx/dist/xlsx.zahl");
var wb = XLSX.utils.book_new(); var ws = XLSX.utils.aoa_to_sheet([
  ["SheetJS", "<3","விரிதாள்"],
  [72,,"Arbeitsblätter"],
  [,62,"数据"],
  [true,false,],
]); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, "textport.numbers", {numbers: XLSX_ZAHL_PAYLOAD, compression: true});
```

  </TabItem>
  <TabItem value="bun" label="Bun">

After installing the package:

<CodeBlock language="bash">{`\
bun i https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

The scripts will be available at `xlsx/dist/xlsx.zahl` (CommonJS) and
`xlsx/dist/xlsx.zahl.mjs` (ESM).

```js
import * as XLSX from "xlsx";
import XLSX_ZAHL_PAYLOAD from "xlsx/dist/xlsx.zahl";
import * as fs from "fs";
XLSX.set_fs(fs);
var wb = XLSX.utils.book_new(); var ws = XLSX.utils.aoa_to_sheet([
  ["SheetJS", "<3","விரிதாள்"],
  [72,,"Arbeitsblätter"],
  [,62,"数据"],
  [true,false,],
]); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, "textport.numbers", {numbers: XLSX_ZAHL_PAYLOAD, compression: true});
```

  </TabItem>
  <TabItem value="deno" label="Deno">

<p><a href={"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.zahl.mjs"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.zahl.mjs"}</a> is the URL for {current}</p>

<CodeBlock language="ts">{`\
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';\n\
import XLSX_ZAHL_PAYLOAD from 'https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.zahl.mjs';\n\
\n\
var wb = XLSX.utils.book_new(); var ws = XLSX.utils.aoa_to_sheet([\n\
  ["SheetJS", "<3","விரிதாள்"],\n\
  [72,,"Arbeitsblätter"],\n\
  [,62,"数据"],\n\
  [true,false,],\n\
]); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");\n\
XLSX.writeFile(wb, "textport.numbers", {numbers: XLSX_ZAHL_PAYLOAD, compression: true});\n\
`}
</CodeBlock>

  </TabItem>
</Tabs>


</details>

## Supported Output Formats

For broad compatibility with third-party tools, this library supports many
output formats.  The specific file type is controlled with `bookType` option:

| `bookType` |  extension | sheets | Description                     |
|:-----------|:-----------|:-------|:--------------------------------|
| `xlsx`     | `.xlsx`    | multi  | Excel 2007+ XML Format          |
| `xlsm`     | `.xlsm`    | multi  | Excel 2007+ Macro XML Format    |
| `xlsb`     | `.xlsb`    | multi  | Excel 2007+ Binary Format       |
| `biff8`    | `.xls`     | multi  | Excel 97-2004 Workbook Format   |
| `biff5`    | `.xls`     | multi  | Excel 5.0/95 Workbook Format    |
| `biff4`    | `.xls`     | single | Excel 4.0 Worksheet Format      |
| `biff3`    | `.xls`     | single | Excel 3.0 Worksheet Format      |
| `biff2`    | `.xls`     | single | Excel 2.0 Worksheet Format      |
| `xlml`     | `.xls`     | multi  | Excel 2003-2004 (SpreadsheetML) |
| `numbers`  | `.numbers` | multi  | Numbers 3.0+ Spreadsheet        |
| `ods`      | `.ods`     | multi  | OpenDocument Spreadsheet        |
| `fods`     | `.fods`    | multi  | Flat OpenDocument Spreadsheet   |
| `wk3`      | `.wk3`     | multi  | Lotus Workbook (WK3)            |
| `csv`      | `.csv`     | single | Comma Separated Values          |
| `txt`      | `.txt`     | single | UTF-16 Unicode Text (TXT)       |
| `sylk`     | `.sylk`    | single | Symbolic Link (SYLK)            |
| `html`     | `.html`    | single | HTML Document                   |
| `dif`      | `.dif`     | single | Data Interchange Format (DIF)   |
| `dbf`      | `.dbf`     | single | dBASE II + VFP Extensions (DBF) |
| `wk1`      | `.wk1`     | single | Lotus Worksheet (WK1)           |
| `rtf`      | `.rtf`     | single | Rich Text Format (RTF)          |
| `prn`      | `.prn`     | single | Lotus Formatted Text            |
| `eth`      | `.eth`     | single | Ethercalc Record Format (ETH)   |

- `compression` applies to ZIP-based formats (XLSX, XLSM, XLSB, NUMBERS, ODS)
- Formats that only support a single sheet require a `sheet` option specifying
  the worksheet.  If the string is empty, the first worksheet is used.
- `writeFile` will automatically guess the output file format based on the file
  extension if `bookType` is not specified.  It will choose the first format in
  the aforementioned table that matches the extension.

## Output Type

The `type` option specifies the JS form of the output:

| `type`     | output                                                          |
|------------|-----------------------------------------------------------------|
| `"base64"` | string: Base64 encoding of the file                             |
| `"binary"` | string: binary string (byte `n` is `data.charCodeAt(n)`)        |
| `"string"` | string: JS string (not compatible with binary formats)          |
| `"buffer"` | nodejs Buffer                                                   |
| `"array"`  | ArrayBuffer, fallback array of 8-bit unsigned int               |
| `"file"`   | string: path of file that will be created (nodejs only)         |

:::note pass

For compatibility with Excel, `csv` output will always include the UTF-8 byte
order mark ("BOM").

The raw [`sheet_to_csv` method](/docs/api/utilities/csv#csv-output) will return
JavaScript strings without the UTF-8 BOM.

:::
