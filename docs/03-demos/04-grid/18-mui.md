---
title: Material UI
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Material UI is a collection of ReactJS Components that follows the
[Google Material Design system](https://material.io/)

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Material UI and SheetJS to pull data from a spreadsheet and
display the data. We'll explore how to import data from spreadsheets and export
data to spreadsheets. The following Material UI components will be tested:

- ["Table"](#material-ui-table) is based on the core HTML TABLE element.

- ["Data Grid"](#material-ui-data-grid) is a data grid for larger datasets.

:::note pass

The [ReactJS demo](/docs/demos/frontend/react) covers basic ReactJS concepts.
It should be perused before reading this demo.

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation in projects using Material UI.

After installing the SheetJS module in a ReactJS project, `import` statements
can load relevant parts of the library.

```js
import { read, utils, writeFileXLSX } from 'xlsx';
```

## Material UI Table

The `Table` component abstracts the `<table>` element in HTML.

### Importing Data

Starting from a SheetJS worksheet object[^1], the `sheet_to_json` method[^2]
generates an array of row objects.

In the [ReactJS "Array of Objects" demo](/docs/demos/frontend/react), the array
of objects is rendered by manually mapping over data. For example, starting from
the following spreadsheet and data:

<table>
  <thead><tr><th>Spreadsheet</th><th>State</th></tr></thead>
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

</td></tr></tbody></table>

The HTML table elements map to MUI components:

| HTML    | MUI         |
|:--------|:------------|
| `TABLE` | `Table`     |
| `THEAD` | `TableHead` |
| `TBODY` | `TableBody` |
| `TR`    | `TableRow`  |
| `TD`    | `TableCell` |

The library requires a `TableContainer` container component.

The following example JSX shows a table using HTML and using MUI components:

<Tabs>
  <TabItem value="ReactJS" label="ReactJS">

```jsx title="Example JSX for displaying arrays of objects"
<table>
  {/* The `thead` section includes the table header row */}
  <thead><tr><th>Name</th><th>Index</th></tr></thead>
  {/* The `tbody` section includes the data rows */}
  <tbody>
    {/* generate row (TR) for each president */}
// highlight-start
    {pres.map(row => (
      <tr>
        {/* Generate cell (TD) for name / index */}
        <td>{row.Name}</td>
        <td>{row.Index}</td>
      </tr>
    ))}
// highlight-end
  </tbody>
</table>
```

  </TabItem>
  <TabItem value="MUI" label="Material UI">

```jsx title="Example JSX for displaying arrays of objects"
<TableContainer><Table>
  {/* The `TableHead` section includes the table header row */}
  <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Index</TableCell></TableRow></TableHead>
  {/* The `TableBody` section includes the data rows */}
  <TableBody>
    {/* generate row (TableRow) for each president */}
// highlight-start
    {pres.map((row, idx) => (
      <TableRow key={idx}>
        {/* Generate cell (TableCell) for name / index */}
        <TableCell>{row.Name}</TableCell>
        <TableCell>{row.Index}</TableCell>
      </TableRow>
    ))}
// highlight-end
  </TableBody>
</Table></TableContainer>
```

  </TabItem>
</Tabs>

### Exporting Data

The SheetJS `table_to_book` method[^3] can parse data from a DOM element.
The MUI `Table` element is really a HTML TABLE element under the hood. A `ref`
attached to the `Table` element can be processed by `table_to_book`.

The following snippet uses the `writeFileXLSX` method[^4] to generate and
download a XLSX workbook:

```tsx title="Skeleton Component for exporting a Material UI Table"
// highlight-start
import { utils, writeFileXLSX } from "xlsx";
import { useRef } from "react";
// highlight-end

export default function MUITableSheetJSExport() {
  /* This ref will be attached to the <Table> component */
// highlight-next-line
  const tbl = useRef<HTMLTableElement>(null);

  const xport = () => {
    /* the .current field will be a TABLE element */
    const table_elt = tbl.current;
    /* generate SheetJS workbook */
    // highlight-next-line
    const wb = utils.table_to_book(table_elt);
    /* export to XLSX */
    writeFileXLSX(wb, "SheetJSMaterialUI.xlsx");
  };

  return ( <>
    <button onClick={xport}>Export</button>
    <TableContainer>
// highlight-next-line
      <Table ref={tbl}>{/* ... */}</Table>
    </TableContainer>
  <>);
}
```

### MUI Table Demo

:::note Tested Deployments

This demo was tested in the following deployments:

| Material UI | Emotion   | Date       |
|:------------|:----------|:-----------|
| `5.15.20`   | `11.11.4` | 2024-06-12 |

:::

1) Create a new app using `vite`:

```bash
npm create vite@latest sheetjs-mui -- --template react-ts
cd sheetjs-mui
```

2) Install dependencies:

<CodeBlock language="bash">{`\
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz @mui/material@5.15.20 @emotion/react@11.11.4 @emotion/styled@11.11.5`}
</CodeBlock>

3) Download [`App.tsx`](pathname:///mui/table/App.tsx) and replace `src/App.tsx`.

```bash
curl -L -o src/App.tsx https://docs.sheetjs.com/mui/table/App.tsx
```

4) Start the development server:

```bash
npm run dev
```

The script should open the live demo in a web browser. Click the "Export" button
to save the file.  Open the generated file in a spreadsheet editor.

## Material UI Data Grid

[A complete example is included below.](#muidg-demo)

**Rows and Columns State**

MUI Data Grid state consists of an Array of column metadata and an Array of row
objects. Typically both are defined in state:

```js
// highlight-next-line
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  return ( <DataGrid columns={columns} rows={rows} /> );
}
```

The most generic data representation is an array of arrays. To sate the grid,
columns must be objects whose `field` property is the index converted to string:

```ts
import { WorkSheet, utils } from 'xlsx';
import { GridColDef } from "@mui/x-data-grid";

type Row = any[];
type RowCol = { rows: Row[]; columns: GridColDef[]; };

function ws_to_muidg(ws: WorkSheet): RowCol {
  /* create an array of arrays */
  const rows = utils.sheet_to_json(ws, { header: 1 });

  /* create column array */
  const range = utils.decode_range(ws["!ref"]||"A1");
  const columns = Array.from({ length: range.e.c + 1 }, (_, i) => ({
    field: String(i), // MUIDG will access row["0"], row["1"], etc
    headerName: utils.encode_col(i), // the column labels will be A, B, etc
    editable: true // enable cell editing
  }));

  return { rows, columns }; // these can be fed to setRows / setColumns
}
```

In the other direction, a worksheet can be generated with `aoa_to_sheet`:

:::caution pass

`x-data-grid` does not properly preserve row array objects, so the row arrays
must be re-created.  The snippet defines a `arrayify` function.

:::

```ts
import { WorkSheet, utils } from 'xlsx';

type Row = any[];

// highlight-start
function arrayify(rows: any[]): Row[] {
  return rows.map(row => {
    var length = Object.keys(row).length;
    for(; length > 0; --length) if(row[length-1] != null) break;
    return Array.from({length, ...row});
  });
}
// highlight-end

function muidg_to_ws(rows: Row[]): WorkSheet {
  return utils.aoa_to_sheet(arrayify(rows));
}
```

**Editing Cells**

The `processRowUpdate` callback prop receives the new row data. An event handler
can mutate state:

```tsx
import { GridRowModel } from "@mui/x-data-grid";

export default function App() {
  // ...

  const processRowUpdate = useCallback((rowNew: GridRowModel, rowOld: GridRowModel) => {
    /* scan each column and manually set state entries */
    for(var j = 0; j < columns.length; ++j) if(rowNew[j] != null) {
      rows[rowNew.id][j] = isNaN(+rowNew[j]) ? rowNew[j] : +rowNew[j];
    }
    /* force a state update */
    setRows(rows);
    /* commit the new row */
    return rowNew;
  }, [columns, rows]);

  return ( <DataGrid columns={columns} rows={rows} processRowUpdate={processRowUpdate} /> );
}
```

<!-- spellchecker-disable -->

### MUIDG Demo

<!-- spellchecker-enable -->

:::note Tested Deployments

This demo was tested in the following deployments:

| Data Grid | Emotion   | Date       |
|:----------|:----------|:-----------|
| `7.6.2`   | `11.11.4` | 2024-06-12 |

:::

1) Create a new app using `vite`:

```bash
npm create vite@latest sheetjs-muidg -- --template react-ts
cd sheetjs-muidg
```

2) Install dependencies:

<CodeBlock language="bash">{`\
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz @mui/x-data-grid@7.6.2 @emotion/react@11.11.4 @emotion/styled@11.11.5`}
</CodeBlock>

3) Download [`App.tsx`](pathname:///mui/dg/App.tsx) and replace `src/App.tsx`.

```bash
curl -L -o src/App.tsx https://docs.sheetjs.com/mui/dg/App.tsx
```

4) Start the development server:

```bash
npm run dev
```

When the page loads, it will process https://docs.sheetjs.com/pres.numbers

[^1]: See ["Sheet Objects"](/docs/csf/sheet)
[^2]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^3]: See [`table_to_book` in "HTML" Utilities](/docs/api/utilities/html#create-new-sheet)
[^4]: See [`writeFileXLSX` in "Writing Files"](/docs/api/write-options)
