---
title: Hyperlinks and Tooltips
sidebar_label: Hyperlinks
sidebar_position: 3
---

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

Traditional spreadsheet software, including Excel, support "Cell Links". The
entire cell text is clickable.

Modern spreadsheet software, including Numbers, support "Span Links". Links are
applied to text fragments within the cell content. This mirrors HTML semantics.

| Formats           | Link  | Tooltip | Link Type |
|:------------------|:-----:|:-------:|:----------|
| XLSX / XLSM       |   ✔   |    ✔    | Cell Link |
| XLSB              |   ✔   |    ✔    | Cell Link |
| XLS (BIFF8)       |   ✔   |    ✔    | Cell Link |
| XLML              |   ✔   |    ✔    | Cell Link |
| ODS / FODS / UOS  |   ✔   |         | Span Link |
| HTML              |   ✔   |    ✕    | Span Link |
| NUMBERS           |   ✔   |    ✕    | Span Link |

X (✕) marks features that are not supported by the file formats. For example,
the NUMBERS file format does not support custom tooltips.

For "Span Link" formats, parsers apply the first hyperlink to the entire cell
and writers apply the hyperlink to the entire cell text.

</details>

Spreadsheet hyperlinks are clickable references to other locations. They serve
the same role as the HTML `<a>` tag.

Spreadsheet applications can process "internal" (cells, ranges, and defined
names) and "external" (websites, email addresses, and local files) references.

SheetJS hyperlink objects are stored in the `l` key of cell objects. Hyperlink
objects include the following fields:

- `Target` (required) describes the reference.
- `Tooltip` is the tooltip text. Tooltips are shown when hovering over the text.

For example, the following snippet creates a link from cell `A1` to
https://sheetjs.com with the tip `"Find us @ SheetJS.com!"`:

```js
/* create worksheet with cell A1 = "https://sheetjs.com" */
var ws = XLSX.utils.aoa_to_sheet([["https://sheetjs.com"]]);

/* add hyperlink */
ws["A1"].l = {
  Target: "https://sheetjs.com",
  Tooltip: "Find us @ SheetJS.com!"
};
```

![Cell A1 is a hyperlink with a custom tooltip](pathname:///hyperlink/tooltip.png)

:::note pass

Following traditional software, hyperlinks are applied to entire cell objects.
Some formats (including HTML) attach links to text spans. The parsers apply the
first link to the entire cell. Writers apply links to the entire cell text.

:::

:::caution pass

Excel does not automatically style hyperlinks.  They will be displayed using
the default cell style.

<a href="https://sheetjs.com/pro">SheetJS Pro Basic</a> includes support for
general hyperlink styling.

:::


## External Hyperlinks

Spreadsheet software will typically launch other programs to handle external
hyperlinks. For example, clicking a "Web Link" will open a new browser window.

### Web Links

HTTP and HTTPS links can be used directly:

```js
ws["A2"].l = { Target: "https://docs.sheetjs.com/docs/csf/features/hyperlinks#web-links" };
ws["A3"].l = { Target: "http://localhost:7262/yes_localhost_works" };
```

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

```jsx live
/* The live editor requires this function wrapper */
function ExportSimpleLink() { return ( <button onClick={() => {
  /* Create worksheet */
  var ws = XLSX.utils.aoa_to_sheet([ [ "Link", "No Link" ] ]);
  /* Add link */
  ws["A1"].l = {
    Target: "https://sheetjs.com",
    Tooltip: "Find us @ SheetJS.com!"
  };

  /* Export to file (start a download) */
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "SheetJSSimpleLink.xlsx");
}}><b>Export XLSX!</b></button> ); }
```

</details>

### Mail Links

Excel also supports `mailto` email links with subject line:

```js
ws["A4"].l = { Target: "mailto:ignored@dev.null" };
ws["A5"].l = { Target: "mailto:ignored@dev.null?subject=Test Subject" };
```

<details>
  <summary><b>Live Example</b> (click to show)</summary>

**This demo creates a XLSX spreadsheet with a `mailto` email link. The email
address input in the form never leaves your machine.**

```jsx live
/* The live editor requires this function wrapper */
function ExportRemoteLink() {
  const [email, setEmail] = React.useState("ignored@dev.null");
  const set_email = React.useCallback((evt) => setEmail(evt.target.value));

  /* Callback invoked when the button is clicked */
  const xport = React.useCallback(() => {
    /* Create worksheet */
    var ws = XLSX.utils.aoa_to_sheet([ [ "HTTPS", "mailto" ] ]);
    /* Add links */
    ws["A1"].l = { Target: "https://sheetjs.com" };
    ws["B1"].l = { Target: `mailto:${email}` };

    /* Export to file (start a download) */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSRemoteLink.xlsx");
  });

  return ( <>
    <b>Email: </b><input type="text" value={email} onChange={set_email} size="50"/>
    <br/><button onClick={xport}><b>Export XLSX!</b></button>
  </> );
}
```

</details>

### Local Links

Links to absolute paths should use the `file://` URI scheme:

```js
ws["B1"].l = { Target: "file:///SheetJS/t.xlsx" }; /* Link to /SheetJS/t.xlsx */
ws["B2"].l = { Target: "file:///c:/SheetJS.xlsx" }; /* Link to c:\SheetJS.xlsx */
```

Links to relative paths can be specified without a scheme:

```js
ws["B3"].l = { Target: "SheetJS.xlsb" }; /* Link to SheetJS.xlsb */
ws["B4"].l = { Target: "../SheetJS.xlsm" }; /* Link to ../SheetJS.xlsm */
```

:::caution pass

Relative Paths have undefined behavior in the SpreadsheetML 2003 format.  Excel
2019 will treat a `..\` parent mark as two levels up.

:::

## Internal Hyperlinks

Links where the target is a cell or range or defined name in the same workbook
("Internal Links") are marked with a leading hash character:

```js
ws["C1"].l = { Target: "#E2" }; /* Link to cell E2 */
ws["C2"].l = { Target: "#Sheet2!E2" }; /* Link to cell E2 in sheet Sheet2 */
ws["C3"].l = { Target: "#SheetJSDName" }; /* Link to Defined Name */
```

<details>
  <summary><b>Live Example</b> (click to show)</summary>

This demo creates a workbook with two worksheets. In the first worksheet:

- Cell `A1` ("Same") will link to the range `B2:D4` in the first sheet
- Cell `B1` ("Cross") will link to the range `B2:D4` in the second sheet
- Cell `C1` ("Name") will link to the range in the defined name `SheetJSDN`

The defined name `SheetJSDN` points to the range `A1:B2` in the second sheet.

```jsx live
/* The live editor requires this function wrapper */
function ExportInternalLink() { return ( <button onClick={() => {
  /* Create empty workbook */
  var wb = XLSX.utils.book_new();

  /* Create worksheet */
  var ws = XLSX.utils.aoa_to_sheet([ [ "Same", "Cross", "Name" ] ]);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  /* Create links */
  ws["A1"].l = { Target: "#B2:D4", Tooltip: "Same-Sheet" };
  ws["B1"].l = { Target: "#Sheet2!B2:D4", Tooltip: "Cross-Sheet" };
  ws["C1"].l = { Target: "#SheetJSDN", Tooltip: "Defined Name" };

  /* Create stub Sheet2 */
  var ws2 = XLSX.utils.aoa_to_sheet([["This is Sheet2"]]);
  XLSX.utils.book_append_sheet(wb, ws2, "Sheet2");

  /* Create defined name */
  wb.Workbook = {
    Names: [{Name: "SheetJSDN", Ref:"Sheet2!A1:B2"}]
  }

  /* Export to file (start a download) */
  XLSX.writeFile(wb, "SheetJSInternalLink.xlsx");
}}><b>Export XLSX!</b></button> ); }
```

</details>

:::caution pass

Some third-party tools like Google Sheets do not correctly parse hyperlinks in
XLSX documents.  A workaround was added in library version 0.18.12.

:::

## Tooltips

Tooltips are attached to hyperlink information. There is no way to specify a
tooltip without assigning a cell link.

:::danger pass

**Excel has an undocumented tooltip length limit of 255 characters.**

Writing longer tooltips is currently permitted by the library but the generated
files will not open in Excel.

:::

## HTML

The HTML DOM parser[^1] will process `<a>` links in the table.

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

This example uses `table_to_book` to generate a SheetJS workbook object from a
HTML table. The hyperlink in the second row will be parsed as a cell-level link.

```jsx live
/* The live editor requires this function wrapper */
function ExportHyperlink() {

  /* Callback invoked when the button is clicked */
  const xport = React.useCallback(() => {
    /* Create worksheet from HTML DOM TABLE */
    const table = document.getElementById("TableLink");
    const wb = XLSX.utils.table_to_book(table);

    /* Export to file (start a download) */
    XLSX.writeFile(wb, "SheetJSHTMLHyperlink.xlsx");
  });

  return ( <>
    <button onClick={xport}><b>Export XLSX!</b></button>
    <table id="TableLink"><tbody><tr><td>
      Do not click here, for it is link-less.
    </td></tr><tr><td>
      <a href="https://sheetjs.com">Click here for more info</a>
    </td></tr></tbody></table>
  </> );
}
```

</details>

The HTML writer[^2] will generate `<a>` links.

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

This example creates a worksheet where `A1` has a link and `B1` does not. The
`sheet_to_html` function generates an HTML table where the topleft table cell
has a standard HTML link.

```jsx live
/* The live editor requires this function wrapper */
function ExportALinks() {
  const [ __html, setHTML ] = React.useState("");
  React.useEffect(() => {
    /* Create worksheet */
    var ws = XLSX.utils.aoa_to_sheet([ [ "Link", "No Link" ] ]);
    /* Add link */
    ws["A1"].l = {
      Target: "https://sheetjs.com",
      Tooltip: "Find us @ SheetJS.com!"
    };

    /* Generate HTML */
    setHTML(XLSX.utils.sheet_to_html(ws));
  }, []);

  return ( <div dangerouslySetInnerHTML={{__html}}/> );
}
```

</details>

#### Miscellany

<details>
  <summary><b>Extract all links from a file</b> (click to show)</summary>

The following example iterates through each worksheet and each cell to find all
links. The table shows sheet name, cell address, and target for each link.

```jsx live
function SheetJSParseLinks() {
  const [rows, setRows] = React.useState([]);

  return ( <>
    <input type="file" onChange={async(e) => {
      let rows = [];
      /* parse workbook */
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);

      const html = [];
      wb.SheetNames.forEach(n => {
        var ws = wb.Sheets[n]; if(!ws) return;
        var ref = XLSX.utils.decode_range(ws["!ref"]);
        for(var R = 0; R <= ref.e.r; ++R) for(var C = 0; C <= ref.e.c; ++C) {
          var addr = XLSX.utils.encode_cell({r:R,c:C});
          if(!ws[addr] || !ws[addr].l) continue;
          var link = ws[addr].l;
          rows.push({ws:n, addr, Target: link.Target});
        }
      });
      setRows(rows);
    }}/>
    <table><tr><th>Sheet</th><th>Address</th><th>Link Target</th></tr>
    {rows.map(r => (<tr><td>{r.ws}</td><td>{r.addr}</td><td>{r.Target}</td></tr>))}
    </table>
  </> );
}
```

</details>

[^1]: The primary SheetJS DOM parsing methods are [`table_to_book`, `table_to_sheet`, and `sheet_add_dom`](/docs/api/utilities/html#html-table-input)
[^2]: HTML strings can be written using [`bookType: "html"` in the `write` or `writeFile` methods](/docs/api/write-options) or by using the [dedicated `sheet_to_html` utility function](/docs/api/utilities/html#html-table-output)