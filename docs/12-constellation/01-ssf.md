---
title: SSF Number Formatter
hide_table_of_contents: true
---

<head>
  <script src="https://cdn.sheetjs.com/ssf-0.11.3/ssf.js"></script>
</head>

As explained in ["Number Formats"](/docs/csf/features/nf), modern spreadsheet
file formats separate "content" from "presentation". Instead of storing a
formatted value like `$3.50`, applications will store the underlying value
(`3.50`) and the number format (`$0.00`). Parsers are expected to render values.

The SheetJS `SSF` ("SpreadSheet Format") library formats numbers according
to the number formatting rules defined in Excel and other spreadsheet software[^1]

A version of the library ships with the main file processing library. It is
deeply integrated in SheetJS CE API functions including `read`[^2], `write`[^3],
and `sheet_to_json`[^4].

The library is also available for standalone use on the SheetJS CDN[^5].

Source code and project documentation are hosted on the SheetJS git server at
https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/packages/ssf

## Live Demo

The formatted text is calculated from the specified number format and value.
Please [report an issue](https://git.sheetjs.com/sheetjs/sheetjs/issues) if a
particular format is not supported.

```jsx live
function SheetJSSSF() {
  const [fmt, setFmt] = React.useState("#,##0");
  const [val, setVal] = React.useState(7262);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    if(typeof SSF == "undefined") return setText("ERROR: Reload this page!");
    let v = +val;
    if(!isFinite(v)) return setText(`ERROR: ${val} is not a valid number!`);
    try {
      setText(SSF.format(fmt, v));
    } catch(e) { setText("ERROR: " + (e && e.message || e)); }
  }, [fmt, val]);
  const goodstyle = { backgroundColor: "#C6EFCE", color: "#006100" };
  const badstyle = { backgroundColor: "#FFC7CE", color: "#9C0006" };

  return ( <table>
    <tr><td><b>Number Format</b></td><td>
      <input type="text" value={fmt} onChange={e => setFmt(e.target.value)}/>
    </td></tr>
    <tr><td><b>Number Value</b></td><td>
      <input type="text" value={val} onChange={e => setVal(e.target.value)}/>
    </td></tr>
    <tr><td colspan="2"></td></tr>
    <tr><td><b>Formatted Text</b></td><td>
      <code style={/ERROR/.test(text)?badstyle:goodstyle}>{text}</code>
    </td></tr>
  </table> );
}
```

[^1]: The number formatting rules are sketched in ECMA-376. A rough grammar is defined in the MS-XLS specification.
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`write` in "Writing Files"](/docs/api/write-options)
[^4]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^5]: See https://cdn.sheetjs.com/ssf/ for more details.