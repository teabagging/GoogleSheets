---
title: Clipboard Data
pagination_prev: demos/data/index
pagination_next: demos/cloud/index
sidebar_custom_props:
  summary: Reading and writing data and files in the clipboard
---

Spreadsheet software like Excel typically support copying and pasting cells and
data. This is implemented through the Clipboard ("Pasteboard" in MacOS).

When copying a selection of cells, Excel for Windows stores a screenshot of the
selected cells as an image.  It also creates and stores a number of strings and
files for the various formats, including TSV, CSV, HTML, RTF, SYLK, DIF, XLSB,
XLS (both '97-2004 and '95), and SpreadsheetML 2003.

Not all Clipboard APIs offer access to all clipboard types.

:::note Tested Deployments

Each browser demo was tested in the following environments:

| Browser     | Date       | Notes
|:------------|:-----------|:-------------------------|
| Chrome 126  | 2024-06-30 |                          |
| Safari 17.3 | 2024-06-30 | `text/rtf` not supported |

:::

## Browser Reading (paste)

Clipboard data can be read from a `paste` event.

The event `clipboardData` property has a `getData` method which returns a string
compatible with the `"string"` type in the SheetJS `read` method[^1].

The following example reads from the HTML clipboard and generates a XLSX file
using the SheetJS `writeFile` method[^2]:

```js
document.onpaste = function(e) {
  /* get HTML */
  var str = e.clipboardData.getData('text/html');
  /* parse */
  var wb = XLSX.read(str, {type: "string"});
  /* DO SOMETHING WITH wb HERE */
};
```

`getData` accepts one argument: the desired MIME type. Tested browsers support:

| MIME type    | Data format                |
|:-------------|:---------------------------|
| `text/plain` | TSV (tab separated values) |
| `text/html`  | HTML                       |
| `text/rtf`   | RTF (rich text format)     |

### Live Demo

Open a file in Excel, copy some cells, then come back to this window.  Click on
"RESULT" below and paste (Control+V for Windows, Command+V for Mac).

```jsx live
function ClipboardRead() {
  const [csvs, setCSVs] = React.useState([ "", "", "" ]);

  /* Set up paste handler */
  const paste = React.useCallback((e) => {
    /* this demo will read 3 different clipboard data types */
    var mime_arr = [ 'text/plain', 'text/html', 'text/rtf' ];
    /* get clipboard data for each type */
    var data_arr = mime_arr.map(mime => e.clipboardData.getData(mime));
    /* parse each data string into a workbook */
    var wb_arr = data_arr.map(str => XLSX.read(str, {type: "string"}));
    /* get first worksheet from each workbook */
    var ws_arr = wb_arr.map(wb => wb.Sheets[wb.SheetNames[0]]);
    /* generate CSV for each "first worksheet" */
    var result = ws_arr.map(ws => XLSX.utils.sheet_to_csv(ws));
    setCSVs(result);
  }, []);

  return ( <>
      {csvs[0] && (<pre><b>Data from clipboard TSV  (text/plain)</b><br/>{csvs[0]}</pre>)}
      {csvs[1] && (<pre><b>Data from clipboard HTML (text/html)</b><br/>{csvs[1]}</pre>)}
      {csvs[2] && (<pre><b>Data from clipboard RTF  (text/rtf)</b><br/>{csvs[2]}</pre>)}
      {csvs.every(x => !x) && <b onPaste={paste}>Copy data in Excel, click here, and paste (Control+V)</b>}
  </> );
}
```

### Reading Files

Modern browsers support reading files that users have copied into the clipboard.

:::caution pass

Due to browser API limitations, the system file browser should be used to select
and copy spreadsheets into the clipboard.

:::

The event `clipboardData.files` property, if it is set, is a list of files.

```jsx live
function ClipboardReadFiles() {
  const [data, setData] = React.useState([]);

  /* Set up paste handler */
  const paste = React.useCallback(async(e)=>{
    const result = [];

    /* loop over files */
    const files = e.clipboardData.files || [];
    for(let i = 0; i < files.length; ++i) {
      const file = files.item(i);

      /* filter MIME type for spreadsheets */
      if(!file.type.match(/excel|sheet|csv/)) continue;

      /* read data */
      const wb = XLSX.read(await file.arrayBuffer());

      /* capture sheet names */
      result.push([file.name, wb.SheetNames]);
    }
    setData(result);
  }, []);

  return ( <>
    {data.map((f,idx) => (<pre key={idx}>
      <b>Sheet Names from {f[0]}</b><br/>{f[1].join("\n")}
    </pre>))}
    {!data.length && (<b onPaste={paste}>Copy files, click here, and paste (Control+V)</b>)}
  </> );
}
```

## Browser Writing (copy)

Clipboard data can be written from a `copy` event.

The event `clipboardData` property has a `setData` method which accepts a string
that can be generated using `type: "string"` in the SheetJS `write` method[^3].

The following example generates a HTML string from the first sheet of a workbook
object and loads the string into the HTML clipboard:

```js
document.oncopy = function(e) {
  /* get HTML of first worksheet in workbook */
  var str = XLSX.write(wb, {type: "string", bookType: "html"});
  /* set HTML clipboard data */
  e.clipboardData.setData('text/html', str);

  /* prevent the browser from copying the normal data */
  e.preventDefault();
};
```

`setData` accepts two arguments: MIME type and new data.

The following table lists the supported MIME types and the `bookType`[^4] value
that must be passed to the SheetJS `write` method:

| MIME type    | Data format                | `bookType` |
|:-------------|:---------------------------|:-----------|
| `text/plain` | TSV (tab separated values) | `txt`      |
| `text/html`  | HTML                       | `html`     |

Browsers do not currently support assigning to the `text/rtf` clipboard type.

### Live Demo

This demo creates a simple workbook from the following HTML table:

<table id="srcdata"><tbody>
  <tr><td>SheetJS</td><td>Clipboard</td><td>Demo</td></tr>
  <tr><td>bookType</td><td>RTF</td></tr>
  <tr><td>source</td><td>HTML Table</td></tr>
</tbody></table>

Create a new file in Excel then come back to this window.  Select the text
below and copy (Control+C for Windows, Command+C for Mac).  Go back to the
Excel file, select cell A1, and paste.

```jsx live
function ClipboardWrite() {
  /* Set up copy handler */
  const copy = React.useCallback((e) => {
    /* generate workbook from table */
    var wb = XLSX.utils.table_to_book(document.getElementById("srcdata"));
    /* get HTML of first worksheet in workbook */
    var str = XLSX.write(wb, {type: "string", bookType: "html"});
    /* set HTML clipboard data */
    e.clipboardData.setData('text/html', str);
    /* prevent the browser from copying the normal data */
    e.preventDefault();
  }, []);

  return (
    <b onCopy={copy}>Select this text, copy (Control+C), and paste in Excel</b>
  );
}
```

## Electron

Electron Clipboard API supports HTML and RTF clipboards.

There are special methods for specific clipboard types:

| File Type | Read Clipboard Data  | Write Clipboard Data  |
|:----------|:---------------------|:----------------------|
| TSV       | `clipboard.readText` | `clipboard.writeText` |
| HTML      | `clipboard.readHTML` | `clipboard.writeHTML` |
| RTF       | `clipboard.readRTF`  | `clipboard.writeRTF`  |

Each method operates on JS strings.

`clipboard.write` can assign to multiple clipboard types:

```js
const { clipboard } = require('electron');
const XLSX = require('xlsx');

function copy_first_sheet_to_clipboard(workbook) {
  clipboard.write({
    text: XLSX.write(wb, {type: "string", bookType: "txt"}),
    rtf:  XLSX.write(wb, {type: "string", bookType: "rtf"}),
    html: XLSX.write(wb, {type: "string", bookType: "html"})
  });
}
```

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^3]: See [`write` in "Writing Files"](/docs/api/write-options)
[^4]: See ["Supported Output Formats" in "Writing Files"](/docs/api/write-options#supported-output-formats) for details on `bookType`