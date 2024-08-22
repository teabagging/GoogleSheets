---
title: Stata DTA File Processor
sidebar_label: Stata DTA Codec
hide_table_of_contents: true
---

<head>
  <script src="https://cdn.sheetjs.com/dta-0.0.2/package/dist/dta.min.js"></script>
</head>

:::info pass

This discussion focuses on the Stata DTA codec. For integrating SheetJS in a
Stata extension, there is a [dedicated demo](/docs/demos/extensions/stata).

:::

[Stata](https://stata.com/) is a statistical software package. Econometricians
and social scientists have used Stata for data processing and statistical
analysis. Many legacy datasets are only available in Stata DTA data files.

The SheetJS DTA codec enables websites and automated data pipelines to integrate
data from DTA files.

Source code and project documentation are hosted on the SheetJS git server at
https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/packages/dta

:::caution DTA support is considered experimental.

Great open source software grows with user tests and reports. Issues should be
reported to [the issue tracker](https://git.sheetjs.com/sheetjs/sheetjs/issues).

:::

:::info Limitations

In Stata parlance, versions 102-105, 108, 110-115, and 117-121 are supported.
This corresponds to the known file versions across all releases through Stata 18.

Consistent with spreadsheet software limitations, the first 1048576 observations
and 16384 variables are extracted.

Alias variables (supported in DTA versions 120-121) are not processed.

:::

## Live Demo

This demo fetches a [sample DTA file](pathname:///dta/pres.dta), parses the data
using the SheetJS DTA Codec and displays the data in an HTML table using the
`sheet_to_html` method[^1].

:::tip pass

The file input element can be used to parse a file on your computer.

**All work is performed in the web browser! Data never leaves your machine!**

If you find any unexpected results or errors in testing, please report an issue
at [the issue tracker](https://git.sheetjs.com/sheetjs/sheetjs/issues).

:::

```jsx live
function SheetJSDTA() {
  const [__html, setHTML] = React.useState("");
  const [text, setText] = React.useState("");

  const process = (ab) => {
    try {
      /* Initial Setup */
      if(typeof DTA == "undefined") return setText("ERROR: Reload this page!");
      DTA.set_utils(XLSX.utils);

      /* Parse DTA */
      const wb = DTA.parse(new Uint8Array(ab));

      /* Generate HTML */
      setHTML(XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]));
      setText("");
    } catch(e) { setText("ERROR: " + (e && e.message || e)); }
  };

  /* Fetch test file on load */
  React.useEffect(() => { (async() => {
    process(await (await fetch("/dta/pres.dta")).arrayBuffer());
  })(); }, []);

  const good = { backgroundColor: "#C6EFCE", color: "#006100" };
  const bad = { backgroundColor: "#FFC7CE", color: "#9C0006" };
  return ( <>
    <input type="file" onChange={async(e) => {
      process(await e.target.files[0].arrayBuffer());
    }}/>
    {text && <code style={/ERROR/.test(text)?bad:good}>{text}</code>}
    <div dangerouslySetInnerHTML={{ __html }}/>
  </> );
}
```

[^1]: See [`sheet_to_html` in "Utilities"](/docs/api/utilities/html#html-table-output)
