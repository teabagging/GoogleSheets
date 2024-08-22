---
title: Let Data Glide on Glide Data Grid
sidebar_label: Glide Data Grid
description: Display structured data with Glide Data Grid. Effortlessly import and export data using SheetJS. Modernize business processes while retaining legacy Excel structures.
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Glide Data Grid](https://grid.glideapps.com/) is a high-performance data grid
designed for the ReactJS web framework.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Glide Data Grid and SheetJS to pull data from a spreadsheet and
display the content in a data grid. We'll explore how to import data from files
into the data grid and how to export modified data from the grid to workbooks.

The ["Demo"](#demo) section includes a complete example that displays data from
user-supplied sheets and exports data to XLSX workbooks:

![Glide Data Grid example](pathname:///gdg/gdg.png)

:::note Tested Deployments

This demo was tested in the following environments:

| Browser      | Version | Date       |
|:-------------|:--------|:-----------|
| Chromiun 125 | `5.3.2` | 2024-06-09 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

Using the `npm` tool, this command installs SheetJS and Glide Data Grid:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz @glideapps/glide-data-grid@5.3.2`}
</CodeBlock>

Methods and components in both libraries can be loaded in pages using `import`:

```js
import { read, utils, writeFile } from 'xlsx';
import { DataEditor, GridCellKind, GridCell, Item } from '@glideapps/glide-data-grid';
```

:::caution pass

Glide Data Grid is primarily event-based. It does not manage state directly.
Instead, developers are expected to manage updates when users edit cells.

:::

#### Backing Store

Under the hood, the `DataEditor` component is designed to call methods and
request data to display in the grid. It is typical to store data *outside* of
component state.  A `getCellContent` callback will pull data from the external
backing store, while SheetJS operations will directly act on the store.

For this demo, there are two parts to the data store:

- `data` is an "Array of Objects" that will hold the raw data[^1].

- `header` is an array of the header names

:::info pass

Following the Glide Data Grid conventions[^2], both objects are defined at the top
level of the component script. They are declared outside of the component!

:::

```js
// !! THESE ARRAYS ARE DEFINED OUTSIDE OF THE COMPONENT FUNCTION !!

// this will store the raw data objects
let data: any[] = [];
// this will store the header names
let header: string[] = [];
```

#### Props

:::note pass

This is a high-level overview. The official documentation should be consulted.[^3]

:::

_Columns_

`DataEditor` expects column metadata to be passed through a `columns` prop. This
should be managed in the component state:

```js
import { useState } from 'react';
import { DataEditor, GridColumn } from '@glideapps/glide-data-grid';

function App() {
  // highlight-next-line
  const [cols, setCols] = useState<GridColumn[]>([]); // gdg column objects
  // ...
  return ( <>
    // ...
    <DataEditor
      // ... props
      // highlight-next-line
      columns={cols}
    />
    // ...
  </> );
}
export default App;
```

Each `GridColumn` object expects a `title` representing the display name and an
`id` representing the key to index within the data object.

_Data_

The `DataEditor` component expects a `getCellContent` callback for supplying
data. The callback accepts column and row indices.  The column index should be
used to find the header key:

```js
import { useCallback } from 'react';
import { DataEditor, GridCellKind, GridCell, Item } from '@glideapps/glide-data-grid';

// ...

function App() {
  // ...
  // backing data store -> gdg
  // highlight-start
  const getContent = useCallback((cell: Item): GridCell => {
    const [col, row] = cell;
    return {
      kind: GridCellKind.Text,
      // header[col] is the name of the field
      displayData: String(data[row]?.[header[col]]??""),
      data: data[row]?.[header[col]],
    };
  }, []);
  // highlight-end
  // ...
  return ( <>
    // ...
    <DataEditor
      // ... props
      // highlight-next-line
      getCellContent={getContent}
    />
    // ...
  </> );
}
```

_Row Count_

`DataEditor` also accepts a `rows` property indicating the number of rows. This
is best managed in state:

```js
import { useState } from 'react';
import { DataEditor } from '@glideapps/glide-data-grid';

function App() {
  // highlight-next-line
  const [rows, setRows] = useState<number>(0); // number of rows
  // ...
  return ( <>
    // ...
    <DataEditor
      // ... props
      // highlight-next-line
      rows={rows}
    />
    // ...
  </> );
}
export default App;
```

_Editing Data_

The demo uses the `onCellEdited` callback to write back to the data store.

### Parsing Data

_SheetJS to Data Store_

The SheetJS `read` method parses data from a number of sources[^4]. It returns a
workbook object which holds worksheet objects and other data[^5].

Raw data objects can be generated with the SheetJS `sheet_to_json` function[^6].

The headers can be pulled from the first row of the sheet. The `sheet_to_json`
method accepts a `range` option, and other SheetJS API functions can be used to
calculate the correct range for the header names[^7].

This example generates row objects from the first sheet in the workbook:

```js
import { utils, WorkBook } from 'xlsx';

// ...

const update_backing_store = (wb: WorkBook) => {
  // get first worksheet
  const sheet = wb.Sheets[wb.SheetNames[0]];

  // set data
  // highlight-next-line
  data = utils.sheet_to_json<any>(sheet);

  // create a range consisting of the first row
  const range = utils.decode_range(sheet["!ref"]??"A1"); // original range
  range.e.r = range.s.r; // set ending row to starting row (select first row)

  // pull headers
  // highlight-next-line
  header = utils.sheet_to_json<string[]>(sheet, {header: 1, range})[0];
};

// ...
```

_Importing from Data Store_

Scheduling a refresh for the `DataEditor` involves updating the grid column
metadata and row count through the standard state.  It also requires a special
`updateCells` call to instruct the grid to mark the cached data as stale:

```js
import { useRef } from 'react'
import { WorkBook } from 'xlsx'
import { DataEditor, GridColumn, Item, DataEditorRef } from '@glideapps/glide-data-grid'

function App() {
  const ref = useRef<DataEditorRef>(null); // gdg ref
  // ...
  const parse_wb = (wb: WorkBook) => {
    update_backing_store(wb);

    // highlight-start
    // update column metadata by pulling from external header keys
    setCols(header.map(h => ({title: h, id: h} as GridColumn)));

    // update number of rows
    setRows(data.length);

    if(data.length > 0) {
      // create an array of the cells that must be updated
      let cells = data.map(
        (_,R) => Array.from({length:header.length}, (_,C) => ({cell: ([C,R] as Item)}))
      ).flat();
      // initiate update using the `ref` attached to the DataEditor
      ref.current?.updateCells(cells)
    }
    // highlight-end
  };
  // ...
  return ( <>
    // ...
    <DataEditor
      // ... props
      // highlight-next-line
      ref={ref}
    />
    // ...
  </> );
}
export default App;
```

### Writing Data

The SheetJS `json_to_sheet` method generates worksheet objects directly from
the `data` array[^8]:

```js
const ws = utils.json_to_sheet(data); // easy :)
```

The worksheet can be exported to XLSX by creating a SheetJS workbook object[^9]
and writing with `writeFile` or `writeFileXLSX`[^10]:

```js
const wb = utils.book_new();
utils.book_append_sheet(wb, ws, "Sheet1");
writeFileXLSX(wb, "sheetjs-gdg.xlsx");
```

Since the editor can change the header titles, it is strongly recommended to
pull column data from the state and rewrite the header row:

```js
import { utils, writeFileXLSX } from 'xlsx';

function App() {
  // ...
  const exportXLSX = useCallback(() => {
    // highlight-start
    // generate worksheet using data with the order specified in the columns array
    const ws = utils.json_to_sheet(data, {header: cols.map(c => c.id ?? c.title)});

    // rewrite header row with titles
    utils.sheet_add_aoa(ws, [cols.map(c => c.title ?? c.id)], {origin: "A1"});
    // highlight-end

    // create workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Export"); // replace with sheet name
    // download file
    writeFileXLSX(wb, "sheetjs-gdg.xlsx");
  }, []);
  // ...
  return ( <>
    // ...
    // highlight-next-line
    <button onClick={exportXLSX}><b>Export XLSX!</b></button>
    // ...
  </> );
}
export default App;
```

## Demo

1) Create a new project from the `react-ts` template:

```bash
npm create vite@latest -- sheetjs-gdg --template react-ts
cd sheetjs-gdg
npm i
```

2) Install SheetJS and Glide Data Grid libraries:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz @glideapps/glide-data-grid@5.3.2`}
</CodeBlock>

3) Start dev server:

```bash
npm run dev
```

The terminal window will display a URL (typically `http://localhost:5173`).
Open the URL with a web browser and confirm that a page loads.

4) Download [`App.tsx`](pathname:///gdg/App.tsx) and replace `src/App.tsx`:

```bash
curl -L -o src/App.tsx https://docs.sheetjs.com/gdg/App.tsx
```

**Testing**

5) Refresh the browser window. A grid should be displayed:

![glide-data-grid initial view](pathname:///gdg/pre.png)

The demo downloads and processes https://docs.sheetjs.com/pres.numbers .

6) Make some changes to the grid data.

:::note pass

Some statisticians believe President Grover Cleveland should be counted once.
That would imply President Clinton should be index 41 and the indices of the
other presidents should be decremented.

:::

Double-click on each cell in the Index column and decrement each value. The new
values should be 41, 42, 43, 44, and 45, as shown in the screenshot below:

![glide-data-grid after edits](pathname:///gdg/post.png)

7) Click on the "Export" button. The browser should attempt to download a XLSX
file (`sheetjs-gdg.xlsx`). Save the file.

Open the generated file and verify the contents match the grid.

8) Reload the page. The contents will revert back to the original table.

9) Click "Choose File" and select the new `sheetjs-gdg.xlsx` file. The table
should update with the data in the file.

[^1]: See ["Array of Objects" in the ReactJS demo](/docs/demos/frontend/react#array-of-objects)
[^2]: The "Story" section of the ["Getting Started" page in the Glide Data Grid Storybook](https://glideapps.github.io/glide-data-grid/?path=/story/glide-data-grid-docs--getting-started) stores an Array of Objects outside of the component.
[^3]: See [the "Data" section in `DataEditorProps`](https://grid.glideapps.com/docs/interfaces/DataEditorProps.html#columns:~:text=default-,Data,-Readonly) in the Glide Data Grid API documentation.
[^4]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^5]: See ["SheetJS Data Model"](/docs/csf)
[^6]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^7]: ["Addresses and Ranges"](/docs/csf/general) covers general concepts and utility functions including [`decode_range`](/docs/csf/general#cell-ranges-1).
[^8]: See ["Array of Objects Input" in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^9]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^10]: See [`writeFile` in "Writing Files"](/docs/api/write-options)