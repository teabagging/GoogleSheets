---
title: Canvas Datagrid
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

<head>
  <script src="https://unpkg.com/canvas-datagrid/dist/canvas-datagrid.js"></script>
</head>

[Canvas Datagrid](https://canvas-datagrid.js.org/) is a high-performance grid
with a straightforward API.

[Click here for a live standalone integration demo.](pathname:///cdg/)

:::note Tested Deployments

This demo was last verified on 2024 April 25.

:::

## Live Demo

:::caution pass

Due to CSS conflicts between the data grid and the documentation generator,
features like scrolling may not work as expected.

[The linked demo uses a simple HTML page.](pathname:///cdg/)

:::

```jsx live
function SheetJSCDG() {
  const [url, setUrl] = React.useState("https://docs.sheetjs.com/pres.numbers");
  const [done, setDone] = React.useState(false);
  const ref = React.useRef(); // ref to DIV container
  const set_url = (evt) => setUrl(evt.target.value);
  const [cdg, setCdg] = React.useState(null); // reference to grid object

  return ( <>
    <div height={300} width={300} ref={ref}/>
    {!done && ( <>
      <b>URL: </b><input type="text" value={url} onChange={set_url} size="50"/>
      <br/><button onClick={async() => {
        /* fetch and parse workbook */
        const wb = XLSX.read(await (await fetch(url)).arrayBuffer());
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header:1 });

        /* set up grid and load data */
        if(!cdg) setCdg(canvasDatagrid({ parentNode: ref.current, data }));
        else cdg.data = data;
        setDone(true);
      }}><b>Fetch!</b></button>
    </> )}
  </> );
}
```

## Integration Details

#### Obtaining the Library

The `canvas-datagrid` NodeJS packages include a minified script that can be
directly inserted as a script tag.  The unpkg CDN also serves this script:

```html
<script src="https://unpkg.com/canvas-datagrid/dist/canvas-datagrid.js"></script>
```

#### Previewing Data

The HTML document needs a container element:

```html
<div id="gridctr"></div>
```

Grid initialization is a one-liner:

```js
var grid = canvasDatagrid({
  parentNode: document.getElementById('gridctr'),
  data: []
});
```

For large data sets, it's necessary to constrain the size of the grid.

```js
grid.style.height = '100%';
grid.style.width = '100%';
```

Once the workbook is read and the worksheet is selected, assigning the data
variable automatically updates the view:

```js
grid.data = XLSX.utils.sheet_to_json(ws, {header:1});
```

This demo previews the first worksheet.

#### Editing

`canvas-datagrid` handles the entire edit cycle.  No intervention is necessary.

#### Saving Data

`grid.data` is immediately readable and can be converted back to a worksheet.
Some versions return an array-like object without the length, so a little bit of
preparation may be needed:

```js
/* converts an array of array-like objects into an array of arrays */
function prep(arr) {
  var out = [];
  for(var i = 0; i < arr.length; ++i) {
    if(!arr[i]) continue;
    if(Array.isArray(arr[i])) { out[i] = arr[i]; continue };
    var o = new Array();
    Object.keys(arr[i]).forEach(function(k) { o[+k] = arr[i][k] });
    out[i] = o;
  }
  return out;
}

/* build worksheet from the grid data */
var ws = XLSX.utils.aoa_to_sheet(prep(grid.data));

/* build up workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

/* generate download */
XLSX.writeFile(wb, "SheetJS.xlsx");
```

#### Additional Features

:::tip pass

This demo barely scratches the surface.  The underlying grid component includes
many additional features that work with [SheetJS Pro](https://sheetjs.com/pro).

:::