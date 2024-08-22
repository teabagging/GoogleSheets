---
title: Local Storage API
pagination_prev: demos/data/index
pagination_next: demos/cloud/index
sidebar_custom_props:
  summary: Reading and writing data in an in-browser Key-Value store
---

The Storage API, encompassing `localStorage` and `sessionStorage`, describes
simple key-value stores that only support string values and keys.

This demo covers two common use patterns:

- "Row Objects" shows a simple convention for loading and storing row objects
- "Simple Strings" discusses how to persist and recover a raw Storage

:::note Tested Deployments

Each browser demo was tested in the following environments:

| Browser     | Date       |
|:------------|:-----------|
| Chrome 122  | 2024-03-25 |
| Safari 17.3 | 2024-03-12 |

:::

## Row Objects

Consider the following array of objects of data:

```js
[
  { Name: "Barack Obama", Index: 44 },
  { Name: "Donald Trump", Index: 45 },
  { Name: "Joseph Biden", Index: 46 }
]
```

Storage API expects values to be strings. The simplest approach is to stringify
row objects using `JSON.stringify` and store using the row index as a key:

| Key | Value                                |
|:---:|:-------------------------------------|
|  0  | `{"Name":"Barack Obama","Index":44}` |
|  1  | `{"Name":"Donald Trump","Index":45}` |
|  2  | `{"Name":"Joseph Biden","Index":46}` |

#### Importing Data

Starting from a worksheet, `XLSX.utils.sheet_to_json` generates an array of row
objects.  `localStorage.setItem` will store data in Local Storage:

```js
function sheet_to_localStorage(worksheet) {
  const aoo = XLSX.utils.sheet_to_json(worksheet);
  for(let i = 0; i < aoo.length; ++i) {
    localStorage.setItem(i, JSON.stringify(aoo[i]));
  }
}
```

#### Exporting Data

`localStorage.length` returns the total number of entries. A simple `for` loop
can cover the keys (integers from `0` to `localStorage.length - 1` inclusive)

`localStorage.getItem` will load the stringified data from the Local Storage. A
new array of objects can be constructed by using `JSON.parse` and pushing to an
array.  `XLSX.utils.json_to_sheet` can create a new worksheet from that array:

```js
function localStorage_to_sheet() {
  const aoo = [];
  for(let i = 0; i < localStorage.length; ++i) {
    aoo.push(JSON.parse(localStorage.getItem(i)));
  }
  return XLSX.utils.json_to_sheet(aoo);
}
```

### Live Demo

This demo will fetch https://docs.sheetjs.com/pres.numbers, fill `localStorage`
with rows, then generate a worksheet from the rows and write to a new file.

After saving the exported file, the Local Storage can be inspected in the
"Local Storage" section of the "Application" Tab of Developer Tools:

![Local Storage view in Developer Tools](pathname:///storageapi/lstorage.png)

:::caution pass

This example is for illustration purposes. If array of objects is available, it
is strongly recommended to convert that array to a worksheet directly.

:::

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

```jsx live
function SheetJStorage() {
  const [url, setUrl] = React.useState("https://docs.sheetjs.com/pres.numbers");
  const set_url = (evt) => setUrl(evt.target.value);
  const [out, setOut] = React.useState("");
  const xport = React.useCallback(async() => {
    // get first worksheet data as array of objects
    const wb = XLSX.read(await (await fetch(url)).arrayBuffer());
    const aoo = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    // reset and populate localStorage
    localStorage.clear();
    for(var i = 0; i < aoo.length; ++i) localStorage.setItem(i, JSON.stringify(aoo[i]));

    // create new array of objects from localStorage
    const new_aoo = [];
    for(var i = 0; i < localStorage.length; ++i) {
      const row = JSON.parse(localStorage.getItem(i));
      new_aoo.push(row);
    }

    setOut(`Number of rows in LocalStorage: ${localStorage.length}`);

    // create and export workbook
    const new_ws = XLSX.utils.json_to_sheet(new_aoo);
    const new_wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_wb, new_ws, "Sheet1");
    XLSX.writeFile(new_wb, "SheetJStorage.xlsx");
  });

  return ( <>
    {out && ( <><a href={url}>{url}</a><pre>{out}</pre></> )}
    <b>URL: </b><input type="text" value={url} onChange={set_url} size="50"/>
    <br/><button onClick={xport}><b>Fetch!</b></button>
  </> );
}
```

</details>

## Simple Strings

The ["Row Objects" approach](#row-objects) is strongly recommended when trying
to store or recover arrays of row objects.

When the goal is to save an existing Storage, the general representation is an
array of pairs.  Consider the following data in Local Storage:

| Key | Value     |
|:---:|:----------|
| "b" | "Logical" |
| "n" | "Numeric" |
| "s" | "Textual" |

The natural representation is an array of arrays:

```js
[
  [ "b", "Logical" ],
  [ "n", "Numeric" ],
  [ "s", "Textual" ]
]
```

#### Exporting Storage

:::note pass

Web Storage iteration order is not defined.  By using indices as keys, the row
objects approach has an ordering.  That does not apply to the general case.

:::

In modern browsers, `Object.entries` will generate an array of key/value pairs.
`XLSX.utils.aoa_to_sheet` will interpret that array as a worksheet with 2 cols:

```js
function localStorage_to_ws() {
  const aoa = Object.entries(localStorage);
  return XLSX.utils.aoa_to_sheet(aoa);
}
```

#### Importing Storage

In the other direction, the worksheet is assumed to store keys in column A and
values in column B.  `XLSX.utils.sheet_to_json` with the `header: 1` option
will generate key/value pairs that can be assigned to a storage:

```js
function ws_to_localStorage(ws) {
  const aoa = XLSX.utils.sheet_to_json(ws, { header: 1 });
  aoa.forEach(([key, val]) => localStorage.setItem(key, val));
}
```

### Live Demo

This example fills `localStorage` with 10 random keys and 10 random values,
generates a worksheet from the data and writes to a new file.

<details>
  <summary><b>Live Demo</b> (click to show)</summary>

```jsx live
function SheetJSRandomStorage() {
  const [out, setOut] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const xport = React.useCallback(async() => {
    // reset and populate localStorage
    localStorage.clear();
    var data = [];
    for(let i = 0, last = 0; i < 10; ++i) {
      var k = ((Math.random() * 20)|0) + last;
      var v = (Math.random() * 16777216).toString(36);
      localStorage.setItem(k, v);
      data.push([k,v]);
      last = k;
    }
    setRows(Object.entries(localStorage));

    // create new worksheet from localStorage
    const aoa = Object.entries(localStorage);
    const new_ws = XLSX.utils.aoa_to_sheet(aoa);

    // create and export workbook
    const new_wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_wb, new_ws, "Sheet1");
    XLSX.writeFile(new_wb, "SheetJSRandomStorage.xlsx");
  });
  return ( <>
    {out && ( <><a href={url}>{url}</a><pre>{out}</pre></> )}
    {rows.length && (<table><tr><th>Key</th><th>Value</th></tr>
      {rows.map(([k,v]) => (<tr><td>{k}</td><td>{v}</td></tr>))}
    </table>) || null}
    <br/><button onClick={xport}><b>Export!</b></button>
  </> );
}
```

</details>