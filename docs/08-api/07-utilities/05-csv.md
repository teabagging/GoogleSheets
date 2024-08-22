---
sidebar_position: 5
title: CSV and Text
---

CSV is a common format for data interchange. Spreadsheet applications such as
Excel also support other delimiter-separated formats including "Text" (using a
tab character as the field separator).

The general write functions (`XLSX.write` and `XLSX.writeFile`) support `csv`
and `txt` (for CSV and tab-separated values respectively), but the specific
utility functions generate raw JS strings for further processing.

## Live Demo

After choosing a file, the demo will print the data from each worksheet:

```jsx live
function SheetJSPreCSView() {
  const [__html, setHTML] = React.useState("Select a file");

  const process = (ab) => {
    const wb = XLSX.read(ab);
    var res = "";
    wb.SheetNames.forEach((n, idx) => {
      const ws = wb.Sheets[n];
      res += `<b>Sheet #${idx+1} (${n})</b>\n`;
      res += XLSX.utils.sheet_to_csv(ws) + "\n\n";
    });
    setHTML(res);
  };
  React.useEffect(() => { (async() => {
    const url = "https://docs.sheetjs.com/pres.numbers";
    process(await (await fetch(url)).arrayBuffer());
  })(); }, []);

  return ( <>
    <input type="file" onChange={async(e) => {
      process(await e.target.files[0].arrayBuffer());
    }}/>
    <pre dangerouslySetInnerHTML={{ __html }}/>
  </> );
}
```

## Delimiter-Separated Output

**Export worksheet data in CSV, TSV, or other delimiter-separated format**

```js
var csv = XLSX.utils.sheet_to_csv(ws, opts);
```

As an alternative to the `writeFile` CSV type, `XLSX.utils.sheet_to_csv` also
produces CSV output.  The function takes an options argument:

| Option Name  |  Default | Description                                        |
| :----------- | :------: | :------------------------------------------------- |
|`FS`          |  `","`   | "Field Separator"  delimiter between fields        |
|`RS`          |  `"\n"`  | "Record Separator" delimiter between rows          |
|`dateNF`      |  FMT 14  | Use specified date format in string output         |
|`strip`       |  false   | Remove trailing field separators in each record ** |
|`blankrows`   |  true    | Include blank lines in the CSV output              |
|`skipHidden`  | `false`  | [Skip hidden data](#hidden-rows-and-columns)       |
|`forceQuotes` |  false   | Force quotes around fields                         |

- `strip` will remove trailing commas from each line under default `FS/RS`
- `blankrows` must be set to `false` to skip blank lines.
- Fields containing the record or field separator will automatically be wrapped
  in double quotes; `forceQuotes` forces all cells to be wrapped in quotes.


The following example shows `FS` and `RS` options:

```jsx live
function SheetJSCSVTest() {
  var ws = XLSX.utils.aoa_to_sheet([
    ["S", "h", "e", "e", "t", "J", "S"],
    [  1,   2,    ,    ,   5,   6,   7],
    [  2,   3,    ,    ,   6,   7,   8],
    [  3,   4,    ,    ,   7,   8,   9],
    [  4,   5,   6,   7,   8,   9,   0]
  ]);
  return ( <pre>
    <b>Worksheet (as HTML)</b>
    <div dangerouslySetInnerHTML={{__html: XLSX.utils.sheet_to_html(ws)}}/>
    <b>XLSX.utils.sheet_to_csv(ws)</b><br/>
    {XLSX.utils.sheet_to_csv(ws)}<br/><br/>
    <b>XLSX.utils.sheet_to_csv(ws, {'{'} FS: "\t" {'}'})</b><br/>
    {XLSX.utils.sheet_to_csv(ws, { FS: "\t" })}<br/><br/>
    <b>XLSX.utils.sheet_to_csv(ws, {'{'} FS: ":", RS: "|" {'}'})</b><br/>
    {XLSX.utils.sheet_to_csv(ws, { FS: ":", RS: "|" })}<br/>
  </pre> );
}
```

### CSV Output

**Export worksheet data in "Comma-Separated Values" (CSV)**

```js
var csv = XLSX.utils.sheet_to_csv(ws, opts);
```

`sheet_to_csv` uses the comma character as the field separator by default. This
utility function mirrors the `csv` book type in `XLSX.write` or `XLSX.writeFile`.

`sheet_to_csv` always returns a JS string and always omits byte-order marks.

### UTF-16 Text Output

**Export worksheet data in "UTF-16 Text" or Tab-Separated Values (TSV)**

```js
var txt = XLSX.utils.sheet_to_txt(ws, opts);
```

`sheet_to_txt` uses the tab character as the field separator. This utility
function matches the `txt` book type in `XLSX.write` or `XLSX.writeFile`.

If encoding support is available, the output will be encoded in `CP1200` and the
UTF-16 BOM will be added. If encoding support is not available, the output will
be encoded as a standard `string`.

`XLSX.utils.sheet_to_txt` takes the same arguments as `sheet_to_csv`.

### Notes

#### Hidden Rows and Columns

By default, all rows and columns are rendered. The `skipHidden` option instructs
the text processor to skip hidden rows and columns.

The worksheet [`!rows` array](/docs/csf/features/rowprops) stores row settings.
The [`!cols` array](/docs/csf/features/colprops) stores column settings.

:::info pass

By default, the `read` and `readFile` methods do not save row / column settings.
[The `cellStyles` option must be set](/docs/api/parse-options#parsing-options).

:::

The following demo shows the effect of `skipHidden`. Rows 2 and 5 and columns F
and G are marked as hidden. The hidden rows and columns are rendered by default
but omitted when the `skipHidden` option is set to `true`.

```jsx live
function SheetJSCSVHiddenRows() {
  var ws = XLSX.utils.aoa_to_sheet([
    ["S", "h", "e", "e", "t", "J", "S", "Hidden (row)"],
    [  1,   2,    ,    ,   5,   6,   7, true],
    [  2,   3,    ,    ,   6,   7,   8, false],
    [  3,   4,    ,    ,   7,   8,   9, false],
    [  4,   5,   6,   7,   8,   9,   0, true],
    [  0,   0,   0,   0,   0,   1,   1, false, "Hidden (col)"]
  ]);

  ws["!rows"] = [];
  ws["!rows"][1] = { hidden: true, hpx: 16 }; // hide row 2
  ws["!rows"][4] = { hidden: true, hpx: 16 }; // hide row 5

  ws["!cols"] = [];
  ws["!cols"][5] = { wch: 8, hidden: true }; // hide column F
  ws["!cols"][6] = { wch: 8, hidden: true }; // hide column G

  return ( <pre>
    <b>Worksheet data (as HTML)</b>
    <div dangerouslySetInnerHTML={{__html: XLSX.utils.sheet_to_html(ws)}}/>
    <b>XLSX.utils.sheet_to_csv(ws, {'{'} skipHidden: true {'}'})</b><br/>
    {XLSX.utils.sheet_to_csv(ws, { skipHidden: true })}<br/>
  </pre> );
}
```
