---
title: VBA and Macros
sidebar_position: 7
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

XLSX does not support macros. The XLSM file format is nearly identical to XLSX
and supports macros.

| Formats | Basic | Storage Representation             |
|:--------|:-----:|:-----------------------------------|
| XLSM    |   ✔   | `vbaProject.bin` file in container |
| XLSX    |   ✕   | Not supported in format (use XLSM) |
| XLSB    |   ✔   | `vbaProject.bin` file in container |
| XLS     |   ✔   | Intercalated in CFB container      |

X (✕) marks features that are not supported by the file formats. There is
no way to embed VBA in the XLSX format.

</details>

Visual Basic for Applications (VBA) is a scripting platform embedded in Excel.
Users can include user-defined functions and macro code within spreadsheets.

The `vbaraw` property of the SheetJS workbook object is an encoded data blob
which includes the VBA macros and other metadata.

The SheetJS `read` and `readFile` methods do not pull VBA metadata by default.
If the `bookVBA` option is set to true, the `vbaraw` blob is created.

```js
var workbook = XLSX.read(data, { bookVBA: true });
var encoded_vba_blob = workbook.vbaraw;
```

The SheetJS `write` and `writeFile` methods will save the `vbaraw` blob if it is
present in the workbook object and if the output file format supports macros.

```js
workbook.vbaraw = encoded_vba_blob;
XLSX.writeFile(workbook, "SheetJSNewMacro.xlsm");
```

:::info pass

Newer versions of Excel support a new JavaScript API for writing user-defined
functions. Those addins are not stored in the spreadsheet files.

[The "Excel JavaScript API" demo](/docs/demos/extensions/excelapi) covers usage
of SheetJS libraries within the API.

:::

:::tip pass

The `vbaraw` property stores raw bytes. [SheetJS Pro](https://sheetjs.com/pro)
offers a special component for extracting macro text from the VBA blob, editing
the VBA project, and exporting new VBA blobs.

:::

## Demos

The export demos focus on [an example](pathname:///vba/SheetJSVBAFormula.xlsm)
that includes the following user-defined functions:

```vb
Function GetFormulaA1(Cell As Range) As String
  GetFormulaA1 = Cell.Formula
End Function

Function GetFormulaRC(Cell As Range) As String
  GetFormulaRC = Cell.Formula2R1C1
End Function
```


### Copying Macros

After downloading the sample file, the demo extracts the VBA blob and creates
a new workbook including the VBA blob. Click the button to create the file and
open in a spreadsheet editor that supports VBA:

<Tabs groupId="platform">
  <TabItem value="browser" label="Web Browser">

```jsx live
function SheetJSVBAFormula() { return ( <button onClick={async () => {
  /* Extract VBA Blob from test file */
  const url = "/vba/SheetJSVBAFormula.xlsm";
  const raw_data = await (await fetch(url)).arrayBuffer();
  const blob = XLSX.read(raw_data, {bookVBA: true}).vbaraw;

  /* generate worksheet and workbook */
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Cell", "A1", "RC"],
    [
      {t:"n", f:"LEN(A1)"},      // A2
      {t:"s", f:"GetFormulaA1(A2)"},  // B2
      {t:"s", f:"GetFormulaRC(A2)"}   // C2
    ]
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  /* add VBA blob to new workbook */
  workbook.vbaraw = blob;

  /* create an XLSM file and try to save to SheetJSVBANeu.xlsm */
  XLSX.writeFile(workbook, "SheetJSVBANeu.xlsm");
}}><b>Click to Generate file!</b></button> ); }
```

  </TabItem>
  <TabItem value="nodejs" label="NodeJS">

0) Install the dependencies:

<CodeBlock language="bash">{`\
npm init -y
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

1) Save the following script to `generate_file.js`:

```js title="generate_file.js"
const XLSX = require("xlsx");
(async() => {
/* Extract VBA Blob from test file */
const url = "https://docs.sheetjs.com/vba/SheetJSVBAFormula.xlsm";
const raw_data = await (await fetch(url)).arrayBuffer();
const blob = XLSX.read(raw_data, {bookVBA: true}).vbaraw;

/* generate worksheet and workbook */
const worksheet = XLSX.utils.aoa_to_sheet([
  ["Cell", "A1", "RC"],
  [
    {t:"n", f:"LEN(A1)"},      // A2
    {t:"s", f:"GetFormulaA1(A2)"},  // B2
    {t:"s", f:"GetFormulaRC(A2)"}   // C2
  ]
]);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

/* add VBA blob to new workbook */
workbook.vbaraw = blob;

/* create an XLSM file and try to save to SheetJSVBANeu.xlsm */
XLSX.writeFile(workbook, "SheetJSVBANeu.xlsm");
})();
```

2) Run the script:

```bash
node generate_file.js
```

This script will generate `SheetJSVBANeu.xlsm`.

  </TabItem>
</Tabs>

### Extracting VBA Blobs

To extract blobs, `bookVBA: true` must be set in the `read` or `readFile` call.

The following example extracts the embedded VBA blob in a workbook:

<Tabs groupId="platform">
  <TabItem value="browser" label="Web Browser">

```jsx live
function SheetJSExtractVBA(props) {
  const [msg, setMsg] = React.useState("Select a macro-enabled file");
  return ( <>
    <b>{msg}</b><br/>
    <input type="file" onChange={async(e) => {
      /* parse workbook with bookVBA: true */
      const wb = XLSX.read(await e.target.files[0].arrayBuffer(), {bookVBA: true});

      /* get vba blob */
      if(!wb.vbaraw) return setMsg("No VBA found!");
      const blob = wb.vbaraw;

      /* download to vbaProject.bin */
      setMsg("Attempting to download vbaProject.bin");
      const url = URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.download = "vbaProject.bin"; a.href = url;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a);
    }}/>
  </> );
}
```

  </TabItem>
  <TabItem value="nodejs" label="NodeJS">

0) Install the dependencies:

<CodeBlock language="bash">{`\
npm init -y
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

1) Save the following script to `extract_vba.js`:

```js title="extract_vba.js"
const fs = require("fs"), XLSX = require("xlsx");
const wb = XLSX.readFile(process.argv[2], { bookVBA: true });
if(!wb.vbaraw) throw new Error("Could not find VBA blob!");
fs.writeFileSync("vbaProject.bin", wb.vbaraw);
```

2) Run the script:

```bash
node extract_vba.js SheetJSMacroEnabled.xlsm
```

This script will generate `vbaProject.bin`. It can be added to a new workbook.

  </TabItem>
</Tabs>

### Exporting Blobs

To ensure the writers export the VBA blob:

- The output format must support VBA (`xlsm` or `xlsb` or `xls` or `biff8`)
- The workbook object must have a valid `vbaraw` field

This example uses [`vbaProject.bin`](pathname:///vba/vbaProject.bin) from the
[sample file](pathname:///vba/SheetJSVBAFormula.xlsm):

```jsx live
function SheetJSVBAPrepared() { return ( <button onClick={async () => {
  /* Download prepared VBA blob */
  const url = "/vba/vbaProject.bin";
  const blob = new Uint8Array(await (await fetch(url)).arrayBuffer());

  /* generate worksheet and workbook */
  const worksheet = XLSX.utils.aoa_to_sheet([
    ["Cell", "A1", "RC"],
    [
      {t:"n", f:"LEN(A1)"},      // A2
      {t:"s", f:"GetFormulaA1(A2)"},  // B2
      {t:"s", f:"GetFormulaRC(A2)"}   // C2
    ]
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  /* add VBA blob to new workbook */
  workbook.vbaraw = blob;

  /* create an XLSM file and try to save to SheetJSVBAPreparedNeu.xlsm */
  XLSX.writeFile(workbook, "SheetJSVBAPreparedNeu.xlsm");
}}><b>Click to Generate file!</b></button> ); }
```

## Details

### Code Names

Excel will use `ThisWorkbook` (or a translation like `DieseArbeitsmappe`) as the
default Code Name for the workbook.  Each worksheet will be identified using the
default `Sheet#` naming pattern even if the worksheet names have changed.

A custom workbook code name will be stored in `wb.Workbook.WBProps.CodeName`.
For exports, assigning the property will override the default value.

Worksheet and Chartsheet code names are in the worksheet properties object at
`wb.Workbook.Sheets[i].CodeName`.  Macrosheets and Dialogsheets are ignored.

The readers and writers preserve the code names, but they have to be manually
set when adding a VBA blob to a different workbook.

### Macrosheets

Older versions of Excel also supported a non-VBA "macrosheet" sheet type that
stored automation commands.  These are exposed in objects with the `!type`
property set to `"macro"`.

Under the hood, Excel treats Macrosheets as normal worksheets with special
interpretation of the function expressions.

#### Detecting Macros in Workbooks

The `vbaraw` field will only be set if macros are present.  Macrosheets will be
explicitly flagged.  Combining the two checks yields a simple function:

```js
function wb_has_macro(wb/*:workbook*/)/*:boolean*/ {
  if(!!wb.vbaraw) return true;
  const sheets = wb.SheetNames.map((n) => wb.Sheets[n]);
  return sheets.some((ws) => !!ws && ws['!type']=='macro');
}
```
