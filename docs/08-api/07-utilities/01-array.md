---
sidebar_position: 1
title: Arrays of Data
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export const r = {style: {backgroundColor:"red"}};
export const b = {style: {backgroundColor:"blue"}};
export const g = {style: {backgroundColor:"green"}};
export const y = {style: {backgroundColor:"yellow"}};

Arrays of objects are a common data format in JavaScript database connectors
and other general data sources.

Numeric datasets commonly use arrays of arrays of numbers.

The ["Data Storage"](#data-storage) section gives a general overview of common
array formats in JavaScript.

The ["Functions"](#functions) section describes the related functions.

## Data Storage

### Array of Arrays

The spiritual equivalent of the grid in JavaScript is an array of arrays:

<table>
  <thead><tr><th>Spreadsheet</th><th>Array of Arrays</th></tr></thead>
  <tbody><tr><td>

![`pres.xlsx` data](pathname:///pres.png)

  </td><td>

```js
[
  ["Name", "Index"],
  ["Bill Clinton", 42],
  ["GeorgeW Bush", 43],
  ["Barack Obama", 44],
  ["Donald Trump", 45],
  ["Joseph Biden", 46]
]
```

  </td></tr></tbody>
</table>

Each array within the structure corresponds to one row. Individual data points
can be read by indexing by row index and by column index:

```js
var aoa = [
  ["Name", "Index"],
  ["Bill Clinton", 42],
  ["GeorgeW Bush", 43],
  ["Barack Obama", 44],
  ["Donald Trump", 45],
  ["Joseph Biden", 46]
];

var value_at_B4 = aoa[3][1]; // 44
var value_at_A2 = aoa[1][0]; // Bill Clinton
```

### Arrays of Objects

Arrays of objects are commonly used to represent rows from a database:

<table>
  <thead><tr><th>Spreadsheet</th><th>Array of Objects</th></tr></thead>
  <tbody><tr><td>

![`pres.xlsx` data](pathname:///pres.png)

  </td><td>

```js
[
  { Name: "Bill Clinton", Index: 42 },
  { Name: "GeorgeW Bush", Index: 43 },
  { Name: "Barack Obama", Index: 44 },
  { Name: "Donald Trump", Index: 45 },
  { Name: "Joseph Biden", Index: 46 }
]
```

   </td></tr></tbody>
</table>

Each object within the structure corresponds to one data row. The first row of
the spreadsheet is interpreted as the header row.

## Functions

The "Input" subsections describe functions that generate SheetJS worksheet
objects from arrays of data.

The ["Array Output"](#array-output) subsection defines functions that extract
data from SheetJS worksheet objects.

#### Example Sheet

:::note pass

The live examples are based on the following worksheet:

<table>
<tr><td>S</td><td>h</td><td>e</td><td>e</td><td>t</td><td>J</td><td>S</td></tr>
<tr><td>1</td><td>2</td><td> </td><td> </td><td>5</td><td>6</td><td>7</td></tr>
<tr><td>2</td><td>3</td><td> </td><td> </td><td>6</td><td>7</td><td>8</td></tr>
<tr><td>3</td><td>4</td><td> </td><td> </td><td>7</td><td>8</td><td>9</td></tr>
<tr><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>0</td></tr>
</table>

This table includes duplicate column labels ("e" and "S" appear twice in the
first row) and gaps (three data rows have missing fields).

:::

### Array of Arrays Input

**Create a worksheet from an array of arrays**

```js
var ws = XLSX.utils.aoa_to_sheet(aoa, opts);
```

`XLSX.utils.aoa_to_sheet` takes an array of arrays of JS values and returns a
worksheet resembling the input data.  Values are interpreted as follows:

- Numbers, Booleans and Strings are stored as the corresponding types.
- Date objects are stored as Date cells or date codes (see `cellDates` option)
- Array holes and explicit `undefined` values are skipped.
- `null` values may be stubbed (see `sheetStubs` and `nullError` options)
- Cell objects are used as-is.

The function takes an options argument:

| Option Name | Default | Description                                          |
| :---------- | :-----: | :--------------------------------------------------- |
|`dateNF`     |  FMT 14 | Use specified date format in string output           |
|`cellDates`  |  false  | Store dates as type `d` (default is `n`)             |
|`sheetStubs` |  false  | Create cell objects of type `z` for `null` values    |
|`nullError`  |  false  | If true, emit `#NULL!` error cells for `null` values |
|`UTC`        |  false  | If true, dates are interpreted using UTC methods **  |
|`dense`      |  false  | Emit [dense sheets](/docs/csf/sheet#dense-mode)      |

[UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)

The following live example reproduces the [example worksheet](#example-sheet):

```jsx live
function SheetJSExportAOA() {
  /* array of arrays of data */
  var aoa = [
    ["S", "h", "e", "e", "t", "J", "S"],
    [  1,   2,    ,    ,   5,   6,   7],
    [  2,   3,    ,    ,   6,   7,   8],
    [  3,   4,    ,    ,   7,   8,   9],
    [  4,   5,   6,   7,   8,   9,   0]
  ];
  return ( <button onClick={() => {
    /* create worksheet */
    var ws = XLSX.utils.aoa_to_sheet(aoa);
    /* create workbook and export */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSExportAOA.xlsx");
  }}>Click to export Array of Arrays</button> );
}
```

**Add data from an array of arrays to an existing worksheet**

```js
XLSX.utils.sheet_add_aoa(ws, aoa, opts);
```

`XLSX.utils.sheet_add_aoa` takes an array of arrays of JS values and updates an
existing worksheet object.  It follows the same process as `aoa_to_sheet` and
accepts an options argument:

| Option Name | Default | Description                                          |
| :---------- | :-----: | :--------------------------------------------------- |
|`dateNF`     |  FMT 14 | Use specified date format in string output           |
|`cellDates`  |  false  | Store dates as type `d` (default is `n`)             |
|`sheetStubs` |  false  | Create cell objects of type `z` for `null` values    |
|`nullError`  |  false  | If true, emit `#NULL!` error cells for `null` values |
|`origin`     |         | Use specified cell as starting point (see below)     |
|`UTC`        |  false  | If true, dates are interpreted using UTC methods **  |

[UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)

`origin` is expected to be one of:

| `origin`         | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| (cell object)    | Use specified cell (cell object)                          |
| (string)         | Use specified cell (A1-Style cell)                        |
| (number >= 0)    | Start from the first column at specified row (0-indexed)  |
| -1               | Append to bottom of worksheet starting on first column    |
| (default)        | Start from cell `A1`                                      |


The [example worksheet](#example-sheet) can be built up in the following order:

<table>
  <thead><tr><th>Spreadsheet</th><th>Operations</th></tr></thead>
  <tbody><tr><td>

<table>
<tr {...r}><td>S</td><td>h</td><td>e</td><td>e</td><td>t</td><td>J</td><td>S</td></tr>
<tr><td {...b}>1</td><td {...b}>2</td><td> </td><td> </td><td {...g}>5</td><td {...g}>6</td><td {...g}>7</td></tr>
<tr><td {...b}>2</td><td {...b}>3</td><td> </td><td> </td><td {...g}>6</td><td {...g}>7</td><td {...g}>8</td></tr>
<tr><td {...b}>3</td><td {...b}>4</td><td> </td><td> </td><td {...g}>7</td><td {...g}>8</td><td {...g}>9</td></tr>
<tr  {...y}><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>0</td></tr>
</table>

</td><td>

0) `aoa_to_sheet([[]])` creates an empty worksheet

1) `sheet_add_aoa` writes `A1:G1` (red)

2) `sheet_add_aoa` writes `A2:B4` (blue)

3) `sheet_add_aoa` writes `E2:G4` (green)

4) `sheet_add_aoa` writes `A5:G5` (yellow)

</td></tr></tbody></table>

```js
/* Start from an empty worksheet */
var ws = XLSX.utils.aoa_to_sheet([[]]);

/* First row */
XLSX.utils.sheet_add_aoa(ws, [ "SheetJS".split("") ], {origin: "A1"});

/* Write data starting at A2 */
XLSX.utils.sheet_add_aoa(ws, [[1,2], [2,3], [3,4]], {origin: "A2"});

/* Write data starting at E2 */
XLSX.utils.sheet_add_aoa(ws, [[5,6,7], [6,7,8], [7,8,9]], {origin:{r:1, c:4}});

/* Append row */
XLSX.utils.sheet_add_aoa(ws, [[4,5,6,7,8,9,0]], {origin: -1});
```

```jsx live
function SheetJSAddAOA() { return ( <button onClick={() => {
  /* Start from an empty worksheet */
  var ws = XLSX.utils.aoa_to_sheet([[]]);

  /* First row */
  XLSX.utils.sheet_add_aoa(ws, [ "SheetJS".split("") ], {origin: "A1"});

  /* Write data starting at A2 */
  XLSX.utils.sheet_add_aoa(ws, [[1,2], [2,3], [3,4]], {origin: "A2"});

  /* Write data starting at E2 */
  XLSX.utils.sheet_add_aoa(ws, [[5,6,7], [6,7,8], [7,8,9]], {origin:{r:1, c:4}});

  /* Append row */
  XLSX.utils.sheet_add_aoa(ws, [[4,5,6,7,8,9,0]], {origin: -1});

  /* create workbook and export */
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "SheetJSAddAOA.xlsx");
}}>Click to export Array of Arrays</button> ); }
```

### Array of Objects Input

**Create a worksheet from an array of objects**

```js
var ws = XLSX.utils.json_to_sheet(aoo, opts);
```

`XLSX.utils.json_to_sheet` takes an array of objects and returns a worksheet
with automatically-generated "headers" based on the keys of the objects.  The
default column order is determined by the first appearance of the field using
`Object.keys`.  The function accepts an options argument:

| Option Name | Default | Description                                          |
| :---------- | :-----: | :--------------------------------------------------- |
|`header`     |         | Use specified field order (default `Object.keys`) ** |
|`dateNF`     |  FMT 14 | Use specified date format in string output           |
|`cellDates`  |  false  | Store dates as type `d` (default is `n`)             |
|`skipHeader` |  false  | If true, do not include header row in output         |
|`nullError`  |  false  | If true, emit `#NULL!` error cells for `null` values |
|`UTC`        |  false  | If true, dates are interpreted using UTC methods **  |
|`dense`      |  false  | Emit [dense sheets](/docs/csf/sheet#dense-mode)      |

[UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)

:::caution pass

All fields from each row will be written! `header` hints at a particular order
but is not exclusive. To remove fields from the export, filter the data source.

Some data sources have special options to filter properties.  For example,
MongoDB will add the `_id` field when finding data from a collection:

```js
const aoo_with_id = await coll.find({}).toArray();
const ws = XLSX.utils.json_to_sheet(aoo_with_id); // includes _id column
```

This can be filtered out through the `projection` property:

```js
const aoo = await coll.find({}, {projection:{_id:0}}).toArray(); // no _id !
const ws = XLSX.utils.json_to_sheet(aoo);
```

If a data source does not provide a filter option, it can be filtered manually:

```js
const aoo = data.map(obj => Object.fromEntries(Object.entries(obj).filter(r => headers.indexOf(r[0]) > -1)));
```

:::

- If `header` is an array, missing keys will be added in order of first use.
- Cell types are deduced from the type of each value.  For example, a `Date`
  object will generate a Date cell, while a string will generate a Text cell.
- Null values will be skipped by default.  If `nullError` is true, an error cell
  corresponding to `#NULL!` will be written to the worksheet.

```jsx live
function SheetJSExportAOO() {
  /* array of arrays of data */
  var aoo = [
    { Name: "Bill Clinton", Index: 42 },
    { Name: "GeorgeW Bush", Index: 43 },
    { Name: "Barack Obama", Index: 44 },
    { Name: "Donald Trump", Index: 45 },
    { Name: "Joseph Biden", Index: 46 }
  ];
  return ( <button onClick={() => {
    /* create worksheet */
    var ws = XLSX.utils.json_to_sheet(aoo);
    /* create workbook and export */
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSExportAOO.xlsx");
  }}>Click to export Array of Objects</button> );
}
```


:::info pass

The [example sheet](#example-sheet) cannot be reproduced using plain objects
since JS object keys must be unique.

Typically the original data source will have different column names. After
writing with `json_to_sheet`, the `aoa_to_sheet` method can rewrite the headers:

```js
/* original array of objects */
var data = [
  { S:1, h:2,             t:5, J:6, S_1:7 },
  { S:2, h:3,             t:6, J:7, S_1:8 },
  { S:3, h:4,             t:7, J:8, S_1:9 },
  { S:4, h:5, e:6, e_1:7, t:8, J:9, S_1:0 },
];

/* column order for the generated worksheet */
//                 |  A  | B  | C |  D   |  E |  F |  G    |
var data_headers = [ "S", "h", "e", "e_1", "t", "J", "S_1" ];

/* new headers for the first row of the worksheet */
//                 |  A  | B  | C |  D   |  E |  F |  G    |
var new_headers  = [ "S", "h", "e", "e",   "t", "J", "S"   ];

/* write data with using data headers */
var ws = XLSX.utils.json_to_sheet(data, { header: data_headers });

/* replace first row */
XLSX.utils.sheet_add_aoa(worksheet, [new_headers], { origin: "A1" });
```

:::

**Add data from an array of objects to an existing worksheet**

```js
XLSX.utils.sheet_add_json(ws, aoo, opts);
```

`XLSX.utils.sheet_add_json` takes an array of objects and updates an existing
worksheet object.  It follows the same process as `json_to_sheet` and accepts
an options argument:

| Option Name | Default | Description                                          |
| :---------- | :-----: | :--------------------------------------------------- |
|`header`     |         | Use specified column order (default `Object.keys`)   |
|`dateNF`     |  FMT 14 | Use specified date format in string output           |
|`cellDates`  |  false  | Store dates as type `d` (default is `n`)             |
|`skipHeader` |  false  | If true, do not include header row in output         |
|`nullError`  |  false  | If true, emit `#NULL!` error cells for `null` values |
|`origin`     |         | Use specified cell as starting point (see below)     |
|`UTC`        |  false  | If true, dates are interpreted using UTC methods **  |

[UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)

`origin` is expected to be one of:

| `origin`         | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| (cell object)    | Use specified cell (cell object)                          |
| (string)         | Use specified cell (A1-Style cell)                        |
| (number >= 0)    | Start from the first column at specified row (0-indexed)  |
| -1               | Append to bottom of worksheet starting on first column    |
| (default)        | Start from cell `A1`                                      |


This example worksheet can be built up in the order `A1:G1, A2:B4, E2:G4, A5:G5`:

```js
/* Start from an empty worksheet */
var ws = XLSX.utils.aoa_to_sheet([[]]);

/* Header order */
var header = ["A", "B", "C", "D", "E", "F", "G"];

/* First row */
XLSX.utils.sheet_add_json(ws, [
  { A: "S", B: "h", C: "e", D: "e", E: "t", F: "J", G: "S" }
], {header: header, skipHeader: true});

/* Write data starting at A2 */
XLSX.utils.sheet_add_json(ws, [
  { A: 1, B: 2 }, { A: 2, B: 3 }, { A: 3, B: 4 }
], {header: header, skipHeader: true, origin: "A2"});

/* Write data starting at E2 */
XLSX.utils.sheet_add_json(ws, [
  { A: 5, B: 6, C: 7 }, { A: 6, B: 7, C: 8 }, { A: 7, B: 8, C: 9 }
], {header: ["A", "B", "C"], skipHeader: true, origin: { r: 1, c: 4 }});

/* Append row */
XLSX.utils.sheet_add_json(ws, [
  { A: 4, B: 5, C: 6, D: 7, E: 8, F: 9, G: 0 }
], {header: header, skipHeader: true, origin: -1});
```

:::note pass

If the `header` option is an array, `sheet_add_json` and `sheet_to_json` will
append missing elements.

This design enables consistent header order across calls:

```jsx live
function SheetJSHeaderOrder() {
  /* Use shared header */
  const header = [];
  const ws1 = XLSX.utils.json_to_sheet([ {C: 2, D: 3}, ], {header});
  XLSX.utils.sheet_add_json(ws1, [ {D: 1, C: 4}, ], {header, origin: -1, skipHeader: true});

  /* only use header in first call */
  const ws2 = XLSX.utils.json_to_sheet([ {C: 2, D: 3}, ], {header:[]});
  XLSX.utils.sheet_add_json(ws2, [ {D: 1, C: 4}, ], {origin: -1, skipHeader: true});

  return (<pre>
    <b>Objects</b>
    {"\n[\n  { C: 2, D: 3 },\n  { D: 1, C: 4 } // different key order\n]\n"}<br/>
    <b>Worksheet when same `header` array is passed to `sheet_add_json`</b>
    <div dangerouslySetInnerHTML={{__html:XLSX.utils.sheet_to_html(ws1)}}/>
    <i>New contents of `header`</i><br/>
    {JSON.stringify(header)}<br/>
    <br/>
    <b>Worksheet when no `header` property is passed to `sheet_add_json`</b>
    <div dangerouslySetInnerHTML={{__html:XLSX.utils.sheet_to_html(ws2)}}/>
  </pre>)
}
```

:::

### Array Output

<Tabs>
  <TabItem name="JS" value="JavaScript">

```js
var arr = XLSX.utils.sheet_to_json(ws, opts);

var aoa = XLSX.utils.sheet_to_json(ws, {header: 1, ...other_opts});
```

  </TabItem>
  <TabItem name="TS" value="TypeScript">

:::caution pass

TypeScript types are purely informational.  They are not included at run time
and do not influence the behavior of the `sheet_to_json` function.

**`sheet_to_json` does not perform field validation!**

:::

The main type signature treats each row as `any`:

```ts
const data: any[] = XLSX.utils.sheet_to_json(ws, opts);
```

The `any[][]` overload is designed for use with `header: 1` (array of arrays):

```ts
const aoa: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, ...other_opts });
```

An interface can be passed as a generic parameter.  `sheet_to_json` will still
return an array of plain objects (the types do not affect runtime behavior):

```ts
interface President {
  Name: string;
  Index: number;
}

const data: President[] = XLSX.utils.sheet_to_json<President>(ws);
```

  </TabItem>
</Tabs>

`XLSX.utils.sheet_to_json` generates an array of JS objects. The function takes
an options argument:

| Option Name |  Default | Description                                         |
| :---------- | :------: | :-------------------------------------------------- |
|`raw`        | `true`   | Use raw values (true) or formatted strings (false)  |
|`range`      |    **    | Override Range (see table below)                    |
|`header`     |          | Control output format (see table below)             |
|`dateNF`     |  FMT 14  | Use specified date format in string output          |
|`defval`     |          | Use specified value in place of null or undefined   |
|`blankrows`  |    **    | Include blank lines in the output **                |
|`skipHidden` |  false   | Do not generate objects for hidden rows/columns     |
|`UTC`        |  false   | If true, dates will be correct in UTC **            |

- `raw` only affects cells which have a format code (`.z`) field or a formatted
  text (`.w`) field.
- If `header` is specified, the first row is considered a data row; if `header`
  is not specified, the first row is the header row and not considered data.
- When `header` is not specified, the conversion will automatically disambiguate
  header entries by affixing `_` and a count starting at `1`.  For example, if
  three columns have header `foo` the output fields are `foo`, `foo_1`, `foo_2`
- `null` values are returned when `raw` is true but are skipped when false.
- If `defval` is not specified, null and undefined values are skipped normally.
  If specified, all null and undefined points will be filled with `defval`
- When `header` is `1`, the default is to generate blank rows.  `blankrows` must
  be set to `false` to skip blank rows.
- When `header` is not `1`, the default is to skip blank rows.  `blankrows` must
  be true to generate blank rows
- [UTC option is explained in "Dates"](/docs/csf/features/dates#utc-option)


`range` is expected to be one of:

| `range`          | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| (number)         | Use worksheet range but set starting row to the value     |
| (string)         | Use specified range (A1-Style bounded range string)       |
| (default)        | Use worksheet range (`ws['!ref']`)                        |

`header` is expected to be one of:

| `header`         | Description                                               |
| :--------------- | :-------------------------------------------------------- |
| `1`              | Generate an array of arrays                               |
| `"A"`            | Row object keys are literal column labels                 |
| array of strings | Use specified strings as keys in row objects              |
| (default)        | Read and disambiguate first row as keys                   |

- If header is not `1`, the row object will contain the non-enumerable property
  `__rowNum__` that represents the row of the sheet corresponding to the entry.
- If header is an array, the keys will not be disambiguated.  This can lead to
  unexpected results if the array values are not unique!

For the example worksheet:

```jsx live
function SheetJSToJSON() {
  /* original data */
  var ws = XLSX.utils.aoa_to_sheet([
    ["S", "h", "e", "e", "t", "J", "S"],
    [  1,   2,    ,    ,   5,   6,   7],
    [  2,   3,    ,    ,   6,   7,   8],
    [  3,   4,    ,    ,   7,   8,   9],
    [  4,   5,   6,   7,   8,   9,   0]
  ]);

  /* display JS objects with some whitespace */
  const aoo = o => o.map(r => "  " + JSON.stringify(r).replace(/,"/g, ', "').replace(/:/g, ": ").replace(/"([A-Za-z_]\w*)":/g, '$1:')).join("\n");
  const aoa = o => o.map(r => "  " + JSON.stringify(r).replace(/,/g, ', ').replace(/null/g, "")).join("\n");

  return ( <pre>
    <b>Worksheet (as HTML)</b>
    <div dangerouslySetInnerHTML={{__html: XLSX.utils.sheet_to_html(ws)}}/>
    <b>XLSX.utils.sheet_to_json(ws, {'{'} header: 1 {'}'}) [array of arrays]</b><br/>
    [<br/>{aoa(XLSX.utils.sheet_to_json(ws, { header: 1 }))}<br/>]<br/><br/>
    <b>XLSX.utils.sheet_to_json(ws) [objects with header disambiguation]</b><br/>
    [<br/>{aoo(XLSX.utils.sheet_to_json(ws))}<br/>]<br/><br/>
    <b>XLSX.utils.sheet_to_json(ws, {'{'} header: "A" {'}'}) [column names as keys]</b><br/>
    [<br/>{aoo(XLSX.utils.sheet_to_json(ws, { header: "A" }))}<br/>]<br/><br/>
    <b>XLSX.utils.sheet_to_json(ws, {'{'} header: ["A","E","I","O","U","6","9"] {'}'})</b><br/>
    [<br/>{aoo(XLSX.utils.sheet_to_json(ws, { header: ["A","E","I","O","U","6","9"] }))}<br/>]<br/>
  </pre> );
}
```
