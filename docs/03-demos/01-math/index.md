---
title: Math and Statistics
pagination_prev: demos/index
pagination_next: demos/frontend/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

Each valid number in Excel can be represented as an "IEEE754 double"[^1].

With full support for IEEE754 doubles and singles, JavaScript is an excellent
language for mathematics and statistical analysis. It has also proven to be a
viable platform for machine learning.

## Demos

Demos for various libraries are included in separate pages:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>


## Typed Arrays

Modern JavaScript math and statistics libraries typically use `Float64Array` or
`Float32Array` objects to efficiently store data variables.

<details>
  <summary><b>Technical details</b> (click to show)</summary>

Under the hood, `ArrayBuffer` objects represent raw binary data. "Typed arrays"
such as `Float64Array` and `Float32Array` are objects designed for efficient
interpretation and mutation of `ArrayBuffer` data.

:::note pass

`ArrayBuffer` objects are roughly analogous to heap-allocated memory. Typed
arrays behave like typed pointers.

**JavaScript**

```js
const buf = new ArrayBuffer(16);
const dbl = new Float64Array(buf);
dbl[1] = 3.14159;
const u8 = new Uint8Array(buf);
for(let i = 0; i < 8; ++i)
  console.log(u8[i+8]);
```

**Equivalent C**

```c
void *const buf = malloc(16);
double *const dbl = (double *)buf;
dbl[1] = 3.14159;
uint8_t *const u8 = (uint8_t *)buf;
for(uint8_t i = 0; i < 8; ++i)
  printf("%u\n", u8[i+8]);
```

:::

</details>

### Reading from Sheets

Each typed array class has a `from` static method for converting data into a
typed array. `Float64Array.from` returns a `double` typed array (8 bytes per
value) and `Float32Array.from` generates a `float` typed array (4 bytes).

```js
const column_f32 = Float32Array.from(arr); // 4-byte floats
const column_f64 = Float64Array.from(arr); // 8-byte doubles
```

:::info pass

Values in the array will be coerced to the relevant data type. Unsupported
entries will be converted to quiet `NaN` values.

:::

#### Extracting Worksheet Data

The SheetJS `sheet_to_json`[^2] method with the option `header: 1` generates an
array of arrays from a worksheet object. The result is in row-major order:

```js
const aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1});
```

#### Categorical Variables

Dichotomous variables are commonly represented as spreadsheet `TRUE` or `FALSE`.
The SheetJS `sheet_to_json` method will translate these values to `true` and
`false`. Typed array methods will interpret values as `1` and `0` respectively.

Polychotomous variables must be manually mapped to numeric values. For example,
using the Iris dataset:

![Iris dataset](pathname:///typedarray/iris.png)

```js
[
  ["sepal length", "sepal width", "petal length", "petal width", "class"],
  [5.1, 3.5, 1.4, 0.2, "Iris-setosa"],
  [4.9,   3, 1.4, 0.2, "Iris-setosa"],
]
```

Column E (`class`) is a polychotomous variable and must be manually translated:

```js
const aoa = XLSX.utils.sheet_to_json(worksheet, {header: 1});

/* index_to_class will be needed to recover the values later */
const index_to_class = [];

/* map from class name to number */
const class_to_index = new Map();

/* loop over the data */
for(let R = 1; R < aoa.length; ++R) {
  /* Column E = SheetJS row 4 */
  const category = aoa[R][4];
  const val = class_to_index.get(category);
  if(val == null) {
    /* assign a new index */
    class_to_index.set(category, index_to_class.length);
    aoa[R][4] = index_to_class.length;
    index_to_class.push(category);
  } else aoa[R][4] = val;
}
```

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

This example fetches and parses [`iris.xlsx`](pathname:///typedarray/iris.xlsx).
The first worksheet is processed and the new data and mapping are printed.

```jsx live
function SheetJSPolychotomy() {
  const [cat, setCat] = React.useState([]);
  const [aoa, setAoA] = React.useState([]);

  React.useEffect(() => { (async() => {
    const ab = await (await fetch("/typedarray/iris.xlsx")).arrayBuffer();
    const wb = XLSX.read(ab);
    const aoa = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});

    const index_to_class = [];
    const class_to_index = new Map();
    for(let R = 1; R < aoa.length; ++R) {
      const category = aoa[R][4];
      const val = class_to_index.get(category);
      if(val == null) {
        class_to_index.set(category, index_to_class.length);
        aoa[R][4] = index_to_class.length;
        index_to_class.push(category);
      } else aoa[R][4] = val;
    }

    /* display every 25 rows, skipping the header row */
    setAoA(aoa.filter((_, i) => (i % 25) == 1));
    setCat(index_to_class);
  })(); }, []);

  return ( <>
  <b>Mapping</b><br/>
  <table><thead><tr><th>Index</th><th>Name</th></tr></thead><tbody>
    {cat.map((name, i) => (<tr><td>{i}</td><td>{name}</td></tr>))}
  </tbody></table>
  <b>Sample Data</b><br/>
  <table><thead><tr>{"ABCDE".split("").map(c => (<th>{c}</th>))}</tr></thead><tbody>
    {aoa.map(row => (<tr>{row.map(col => (<td>{col}</td>))}</tr>))}
  </tbody></table>
  </>
  );
}
```

</details>

#### One Variable per Column

It is common to store datasets where each row represents an observation and each
column represents a variable:

![Iris dataset](pathname:///typedarray/iris.png)

```js
var aoa = [
  ["sepal length", "sepal width", "petal length", "petal width", "class"],
  [5.1, 3.5, 1.4, 0.2, "Iris-setosa"],
  [4.9,   3, 1.4, 0.2, "Iris-setosa"],
]
```

An array `map` operation can pull data from an individual column. After mapping,
a `slice` can remove the header label. For example, the following snippet pulls
column C ("petal length") into a `Float64Array`:

```js
const C = XLSX.utils.decode_col("C"); // Column "C" = SheetJS index 2
const petal_length = Float64Array.from(aoa.map(row => row[C]).slice(1));
```

#### One Variable per Row

Some datasets are stored in tables where each row represents a variable and each
column represents an observation:

<table>
  <thead><tr><th>JavaScript</th><th>Spreadsheet</th></tr></thead>
  <tbody><tr><td>

```js
var aoa = [
  ["sepal length", 5.1, 4.9],
  ["sepal width",  3.5, 3],
  ["petal length", 1.4, 1.4],
  ["petal width",  0.2, 0.2],
  ["class", "setosa", "setosa"]
]
```

</td><td>

![Single column of data](pathname:///typedarray/iristr.png)

</td></tr></tbody></table>


From the row-major array of arrays, each entry of the outer array is a row.

Many sheets include header columns. The `slice` method can remove the header.
After removing the header, `Float64Array.from` can generate a typed array. For
example, this snippet pulls row 3 ("petal length") into a `Float64Array`:

```js
const petal_length = Float64Array.from(aoa[2].slice(1));
```

### Writing to Sheets

The SheetJS `aoa_to_sheet`[^3] method can generate a worksheet from an array of
arrays. Similarly, `sheet_add_aoa`[^4] can add an array of arrays of data into
an existing worksheet object. The `origin` option[^5] controls where data will
be written in the worksheet.

Neither method understands typed arrays, so data columns must be converted to
arrays of arrays.

#### One Variable per Row

A single typed array can be converted to a pure JS array with `Array.from`:

```js
const arr = Array.from(row);
```

An array of arrays can be created from the array:

```js
const aoa = [
  arr // this array is the first element of the array literal
];
```

`aoa_to_sheet` and `sheet_add_aoa` treat this as one row. By default, data will
be written to cells in the first row of the worksheet.

Titles can be added to data rows with an `unshift` operation, but it is more
efficient to build up the worksheet with `aoa_to_sheet`:

```js
/* sample data */
const data = new Float64Array([54337.95, 3.14159, 2.718281828]);
const title = "Values";

/* convert sample data to array */
const arr = Array.from(data);
/* create worksheet from title (array of arrays) */
const ws = XLSX.utils.aoa_to_sheet([ [ "Values" ] ]);
/* add data starting at B1 */
XLSX.utils.sheet_add_aoa(ws, [ arr ], { origin: "B1" });
```

![Typed Array to single row with title](pathname:///typedarray/ta-row.png)

<details open>
  <summary><b>Live Demo</b> (click to hide)</summary>

In this example, two typed arrays are exported. `aoa_to_sheet` creates the
worksheet and `sheet_add_aoa` will add the data to the sheet.

```jsx live
function SheetJSeriesToRows() { return (<button onClick={() => {
  /* typed arrays */
  const ta1 = new Float64Array([54337.95, 3.14159, 2.718281828]);
  const ta2 = new Float64Array([281.3308004, 201.8675309, 1900.6492568]);

  /* create worksheet from first typed array */
  const ws = XLSX.utils.aoa_to_sheet([ [ "Values" ] ]);
  const arr1 = Array.from(ta1);
  XLSX.utils.sheet_add_aoa(ws, [ arr1 ], { origin: "B1" });

  /* add second title to cell A2 */
  XLSX.utils.sheet_add_aoa(ws, [["Value2"]], { origin: "A2" });

  /* add second typed array starting from cell B2 */
  const arr2 = Array.from(ta2);
  XLSX.utils.sheet_add_aoa(ws, [ arr2 ], { origin: "B2" });

  /* export to file */
  const wb = XLSX.utils.book_new(ws, "Export");
  XLSX.writeFile(wb, "SheetJSeriesToRows.xlsx");
}}><b>Click to export</b></button>); }
```

</details>

#### One Variable per Column

A single typed array can be converted to a pure JS array with `Array.from`. For
columns, each value should be individually wrapped in an array:

<table>
  <thead><tr><th>JavaScript</th><th>Spreadsheet</th></tr></thead>
  <tbody><tr><td>

```js
var data = [
  [54337.95],
  [3.14159],
  [2.718281828]
];
```

</td><td>

![Single column of data](pathname:///typedarray/col.png)

</td></tr></tbody></table>

`Array.from` takes a second argument. If it is a function, the function will be
called on each element and the value will be used in place of the original value
(in effect, mapping over the data). To generate a data column, each element must
be wrapped in an array literal:

```js
var arr = Array.from(column, (value) => ([ value ]));
```

`aoa_to_sheet` and `sheet_add_aoa` treat this as rows with one column of data
per row. By default, data will be written to cells in column "A".

Titles can be added to data columns with an `unshift` operation, but it is more
efficient to build up the worksheet with `aoa_to_sheet`:

```js
/* sample data */
const data = new Float64Array([54337.95, 3.14159, 2.718281828]);
const title = "Values";

/* convert sample data to array */
const arr = Array.from(data, (value) => ([value]));
/* create worksheet from title (array of arrays) */
const ws = XLSX.utils.aoa_to_sheet([ [ "Values" ] ]);
/* add data starting at B1 */
XLSX.utils.sheet_add_aoa(ws, arr, { origin: "A2" });
```

![Typed Array to single column with title](pathname:///typedarray/ta-col.png)

<details open>
  <summary><b>Live Demo</b> (click to hide)</summary>

In this example, two typed arrays are exported. `aoa_to_sheet` creates the
worksheet and `sheet_add_aoa` will add the data to the sheet.

```jsx live
function SheetJSeriesToCols() { return (<button onClick={() => {
  /* typed arrays */
  const ta1 = new Float64Array([54337.95, 3.14159, 2.718281828]);
  const ta2 = new Float64Array([281.3308004, 201.8675309, 1900.6492568]);

  /* create worksheet from first title */
  const ws = XLSX.utils.aoa_to_sheet([ [ "Values" ] ]);

  /* add first typed array starting from cell B1 */
  const arr1 = Array.from(ta1, (value) => ([value]));
  XLSX.utils.sheet_add_aoa(ws, arr1, { origin: "A2" });

  /* add second title to cell B1 */
  XLSX.utils.sheet_add_aoa(ws, [["Value2"]], { origin: "B1" });

  /* add second typed array starting from cell B2 */
  const arr2 = Array.from(ta2, (value) => ([value]));
  XLSX.utils.sheet_add_aoa(ws, arr2, { origin: "B2" });

  /* export to file */
  const wb = XLSX.utils.book_new(ws, "Export");
  XLSX.writeFile(wb, "SheetJSeriesToCols.xlsx");
}}><b>Click to export</b></button>); }
```

</details>

[^1]: See ["Underlying Values" in "Cell Objects"](/docs/csf/cell#excel-values) for more details
[^2]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^3]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^4]: See [`sheet_add_aoa` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^5]: See [the `origin` option of `sheet_add_aoa` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
