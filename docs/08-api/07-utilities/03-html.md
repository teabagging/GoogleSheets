---
sidebar_position: 3
title: HTML
---

HTML is a common format for presenting data in the web. While the general read
functions (`XLSX.read` and `XLSX.readFile`) can parse HTML strings and the write
functions (`XLSX.write` and `XLSX.writeFile`) can generate HTML strings, the
utility functions in this section can use DOM features.

:::note pass

SheetJS CE primarily focuses on data and number formatting.

[SheetJS Pro](https://sheetjs.com/pro) supports CSS text and cell styles in the
HTML format and HTML table utilities.

:::

## HTML Table Output

**Display worksheet data in a HTML table**

```js
var html = XLSX.utils.sheet_to_html(ws, opts);
```

As an alternative to the `writeFile` HTML type, `XLSX.utils.sheet_to_html` also
produces HTML output.  The function takes an options argument:

| Option Name |  Default | Description                                         |
|:------------|:--------:|:----------------------------------------------------|
| `id`        |          | Specify the `id` attribute for the `TABLE` element  |
| `editable`  |  false   | If true, set `contenteditable="true"` for every TD  |
| `header`    |          | Override header                                     |
| `footer`    |          | Override footer                                     |

Starting from [the sample file `pres.numbers`](https://docs.sheetjs.com/pres.numbers):

```jsx live
function SheetJSHTML() {
  const url = "https://docs.sheetjs.com/pres.numbers";
  const [__html, setHTML] = React.useState("");
  React.useEffect(() => { (async() => {
    /* download file and parse */
    const wb = XLSX.read(await (await fetch(url)).arrayBuffer());
    /* get the first worksheet */
    const ws = wb.Sheets[wb.SheetNames[0]];

    /* generate HTML */
    const html = XLSX.utils.sheet_to_html(ws);

    setHTML(html);
  })(); }, []);
  return ( <>
    <b>XLSX.utils.sheet_to_html(ws)</b>
    <div dangerouslySetInnerHTML={{__html}}/>
  </> );
}
```

### Implementation Details

The generated table will include special data attributes on each `TD` element:

| Attribute | Description                                                  |
|:----------|:-------------------------------------------------------------|
| `data-t`  | Override [Cell Type](/docs/csf/cell#cell-types)              |
| `data-v`  | Override Cell Value                                          |
| `data-z`  | Override [Number Format](/docs/csf/features/nf)              |

External cell links will be written as `A` tags wrapping the cell contents.

## HTML Table Input

### Create New Sheet

**Create a worksheet or workbook from a TABLE element**

```js
var ws = XLSX.utils.table_to_sheet(elt, opts);
var wb = XLSX.utils.table_to_book(elt, opts);
```

`XLSX.utils.table_to_sheet` takes a table DOM element and returns a worksheet
resembling the input table.  Numbers are parsed.  All other data will be stored
as strings.

`XLSX.utils.table_to_book` produces a minimal workbook based on the worksheet.

Both functions accept options arguments:

| Option Name |  Default | Description                                         |
| :---------- | :------: | :-------------------------------------------------- |
|`raw`        |          | If true, every cell will hold raw strings           |
|`dateNF`     |  FMT 14  | Use specified date format in string output          |
|`cellDates`  |  false   | Store dates as type `d` (default is `n`)            |
|`sheetRows`  |    0     | If >0, read the first `sheetRows` rows of the table |
|`display`    |  false   | If true, hidden rows and cells will not be parsed   |
|`UTC`        |  false   | If true, dates are interpreted as UTC **            |

[UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)

Exporting a table to a spreadsheet file in the web browser involves 3 steps:
"find the table", "generate a workbook object", and "export to file".

For example, if the HTML table has `id` attribute set to `sheetjs`:

```html
<table id="sheetjs">
  <tr><th>Name</th><th>Index</th></tr>
  <tr><td>Barack Obama</td><td>44</td></tr>
  <tr><td>Donald Trump</td><td>45</td></tr>
  <tr><td>Joseph Biden</td><td>46</td></tr>
</table>
```

`document.getElementById("sheetjs")` is a live reference to the table.

```js
/* find the table element in the page */
var tbl = document.getElementById('sheetjs');
/* create a workbook */
var wb = XLSX.utils.table_to_book(tbl);
/* export to file */
XLSX.writeFile(wb, "SheetJSTable.xlsx");
```

<details open>
  <summary><b>Demo</b> (click to hide)</summary>

This HTML table has id set to `sheetjs`:

<table id="sheetjs">
  <tr><th>Name</th><th>Index</th></tr>
  <tr><td>Barack Obama</td><td>44</td></tr>
  <tr><td>Donald Trump</td><td>45</td></tr>
  <tr><td>Joseph Biden</td><td>46</td></tr>
</table>

```jsx live
function SheetJSExportTable() { return ( <button onClick={() => {
  /* find the table element in the page */
  var tbl = document.getElementById('sheetjs');
  /* create a workbook */
  var wb = XLSX.utils.table_to_book(tbl);
  /* export to file */
  XLSX.writeFile(wb, "SheetJSTable.xlsx");
}}><b>Export XLSX!</b></button> ); }
```
</details>

### Add to Sheet

**Add data from a TABLE element to an existing worksheet**

```js
XLSX.utils.sheet_add_dom(ws, elt, opts);
```

`XLSX.utils.sheet_add_dom` takes a table DOM element and updates an existing
worksheet object.  It follows the same process as `table_to_sheet` and accepts
an options argument:

| Option Name |  Default | Description                                         |
| :---------- | :------: | :-------------------------------------------------- |
|`raw`        |          | If true, every cell will hold raw strings           |
|`dateNF`     |  FMT 14  | Use specified date format in string output          |
|`cellDates`  |  false   | Store dates as type `d` (default is `n`)            |
|`sheetRows`  |    0     | If >0, read the first `sheetRows` rows of the table |
|`display`    |  false   | If true, hidden rows and cells will not be parsed   |
|`UTC`        |  false   | If true, dates are interpreted as UTC **            |

[UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)

`origin` is expected to be one of:

| `origin`         | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| (cell object)    | Use specified cell (cell object)                          |
| (string)         | Use specified cell (A1-Style cell)                        |
| (number >= 0)    | Start from the first column at specified row (0-indexed)  |
| -1               | Append to bottom of worksheet starting on first column    |
| (default)        | Start from cell `A1`                                      |


A common use case for `sheet_add_dom` involves adding multiple tables to a
single worksheet, usually with a few blank rows in between each table:

```js
/* get "table1" and create worksheet */
const table1 = document.getElementById('table1');
const ws = XLSX.utils.table_to_sheet(table1);

/* get "table2" and append to the worksheet */
const table2 = document.getElementById('table2');
// highlight-next-line
XLSX.utils.sheet_add_dom(ws, table2, {origin: -1});
```

<details>
  <summary><b>Multi-table Export Example</b> (click to show)</summary>

This demo creates a worksheet that should look like the screenshot below:

![Multi-Table Export in Excel](pathname:///files/multitable.png)

The `create_gap_rows` helper function expands the worksheet range, adding blank
rows between the data tables.

```jsx live
function MultiTable() {
  const headers = ["Table 1", "Table2", "Table 3"];

  /* Callback invoked when the button is clicked */
  const xport = React.useCallback(async () => {
    /* This function creates gap rows */
    function create_gap_rows(ws, nrows) {
      var ref = XLSX.utils.decode_range(ws["!ref"]);       // get original range
      ref.e.r += nrows;                                    // add to ending row
      ws["!ref"] = XLSX.utils.encode_range(ref);           // reassign row
    }

    /* first table */
    const ws = XLSX.utils.aoa_to_sheet([[headers[0]]]);
    XLSX.utils.sheet_add_dom(ws, document.getElementById('table1'), {origin: -1});
    create_gap_rows(ws, 1); // one row gap after first table

    /* second table */
    XLSX.utils.sheet_add_aoa(ws, [[headers[1]]], {origin: -1});
    XLSX.utils.sheet_add_dom(ws, document.getElementById('table2'), {origin: -1});
    create_gap_rows(ws, 2); // two rows gap after second table

    /* third table */
    XLSX.utils.sheet_add_aoa(ws, [[headers[2]]], {origin: -1});
    XLSX.utils.sheet_add_dom(ws, document.getElementById('table3'), {origin: -1});

    /* create workbook and export */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Export");
    XLSX.writeFile(wb, "SheetJSMultiTablexport.xlsx");
  });

  return ( <>
    <button onClick={xport}><b>Export XLSX!</b></button><br/><br/>
    <b>{headers[0]}</b><br/>
    <table id="table1">
      <tr><td>A2</td><td>B2</td></tr>
      <tr><td>A3</td><td>B3</td></tr>
    </table>
    <b>{headers[1]}</b><br/>
    <table id="table2">
      <tr><td>A6</td><td>B6</td><td>C6</td></tr>
      <tr><td>A7</td><td>B7</td><td>C7</td></tr>
    </table>
    <br/>
    <b>{headers[2]}</b><br/>
    <table id="table3">
      <tr><td>A11</td><td>B11</td></tr>
      <tr><td>A12</td><td>B12</td></tr>
    </table>
  </> );
}
```

</details>

### HTML Strings

**Create a worksheet or workbook from HTML string**

`table_to_book` / `table_to_sheet` / `sheet_add_dom` act on HTML DOM elements.
Starting from an HTML string, there are two parsing approaches:

A) Table Phantasm: create a DIV whose `innerHTML` is set to the HTML string,
generate worksheet using the DOM element, then remove the DIV:

```js
/* create element from the source */
var elt = document.createElement("div");
elt.innerHTML = html_source;
document.body.appendChild(elt);

/* generate worksheet */
var ws = XLSX.utils.table_to_sheet(elt.getElementsByTagName("TABLE")[0]);

/* remove element */
document.body.removeChild(elt);
```

<details>
  <summary><b>Phantasm Demo</b> (click to show)</summary>

The `html` variable in the demo is an editable HTML string

```jsx live
function SheetJSTablePhantasm() {
  /* HTML stored as a string */
  const html = `\
<table>
  <tr><th>Name</th><th>Index</th></tr>
  <tr><td>Barack Obama</td><td>44</td></tr>
  <tr><td>Donald Trump</td><td>45</td></tr>
  <tr><td>Joseph Biden</td><td>46</td></tr>
</table>
`;
  return ( <>
    <button onClick={() => {
      /* create element from the source */
      var elt = document.createElement("div");
      elt.innerHTML = html;
      document.body.appendChild(elt);

      /* generate workbook */
      var tbl = elt.getElementsByTagName("TABLE")[0];
      var wb = XLSX.utils.table_to_book(tbl);

      /* remove element */
      document.body.removeChild(elt);

      /* generate file */
      XLSX.writeFile(wb, "SheetJSTablePhantasm.xlsx");
    }}><b>Export XLSX!</b></button>
    <pre><b>HTML:</b><br/>{html}</pre>
  </>);
}
```

</details>

B) Raw HTML: use `XLSX.read` to read the text in the same manner as CSV.

```js
var wb = XLSX.read(html_source, { type: "string" });
var ws = wb.Sheets[wb.SheetNames[0]];
```

<details>
  <summary><b>Raw HTML Demo</b> (click to show)</summary>

The `html` variable in the demo is an editable HTML string

```jsx live
function SheetJSRawHTMLToXLSX() {
  /* HTML stored as a string */
  const html = `\
<table>
  <tr><th>Name</th><th>Index</th></tr>
  <tr><td>Barack Obama</td><td>44</td></tr>
  <tr><td>Donald Trump</td><td>45</td></tr>
  <tr><td>Joseph Biden</td><td>46</td></tr>
</table>
`;
  return ( <>
    <button onClick={() => {
      /* read HTML string */
      var wb = XLSX.read(html, {type: "string"});

      /* generate file */
      XLSX.writeFile(wb, "SheetJSRawHTML.xlsx");
    }}><b>Export XLSX!</b></button>
    <pre><b>HTML:</b><br/>{html}</pre>
  </>);
}
```

</details>

### Value Override

When the `raw: true` option is specified, the parser will generate text cells.
When the option is not specified or when it is set to false, the parser will
try to interpret the text of each TD element.

To override the conversion for a specific cell, the following data attributes
can be added to the individual TD elements:

| Attribute | Description                                                  |
|:----------|:-------------------------------------------------------------|
| `data-t`  | Override [Cell Type](/docs/csf/cell#cell-types)              |
| `data-v`  | Override Cell Value                                          |
| `data-z`  | Override [Number Format](/docs/csf/features/nf)              |

For example:

```html
<!-- Parser interprets value as `new Date("2012-12-03")` default date format -->
<td>2012-12-03</td>

<!-- String cell "2012-12-03" -->
<td data-t="s">2012-12-03</td>

<!-- Numeric cell with the correct date code and General format -->
<td data-t="n" data-v="41246">2012-12-03</td>

<!-- Traditional Excel Date 2012-12-03 with style yyyy-mm-dd -->
<td data-t="n" data-v="41246" data-z="yyyy-mm-dd">2012-12-03</td>
```

<details open>
  <summary><b>HTML Value Examples</b> (click to hide)</summary>

```jsx live
function SheetJSHTMLValueOverride() {
  /* HTML stored as a string */
  const html = `\
<table>
  <tr><th>Cell</th><th>data-t</th><th>data-v</th><th>data-z</th></tr>
  <tr><td>2012-12-03</td><td/><td/><td/></tr>
  <tr><td data-t="s">2012-12-03</td><td>s</td><td/><td/></tr>
  <tr><td data-t="n" data-v="41246">2012-12-03</td><td>n</td><td>41246</td><td/></tr>
  <tr><td data-t="n" data-v="41246" data-z="yyyy-mm-dd">2012-12-03</td><td>n</td><td>41246</td><td>yyyy-mm-dd</td></tr>
</table>
`;
  return ( <>
    <button onClick={() => {
      /* create element from the source */
      var elt = document.createElement("div");
      elt.innerHTML = html;
      document.body.appendChild(elt);

      /* generate workbook */
      var tbl = elt.getElementsByTagName("TABLE")[0];
      var wb = XLSX.utils.table_to_book(tbl);

      /* remove element */
      document.body.removeChild(elt);

      /* generate file */
      XLSX.writeFile(wb, "SheetJSHTMLValueOverride.xlsx");
    }}><b>Export XLSX!</b></button>
    <pre><b>HTML String:</b><br/>{html}<br/><b>TABLE:</b></pre>
    <div dangerouslySetInnerHTML={{__html: html}}/>
  </>);
}
```

</details>

### Synthetic DOM

`table_to_book` / `table_to_sheet` / `sheet_add_dom` act on HTML DOM elements.
Traditionally there is no DOM in server-side environments including NodeJS.

:::note pass

The simplest approach for server-side processing is to automate a headless web
browser. ["Browser Automation"](/docs/demos/net/headless) covers some browsers.

:::

Some ecosystems provide DOM-like frameworks that are compatible with SheetJS.
Examples are included in the ["Synthetic DOM"](/docs/demos/net/dom) demo
