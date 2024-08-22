---
title: React Datagrid
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[React Data Grid](https://adazzle.github.io/react-data-grid/) is a data grid
designed for the ReactJS web framework.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses React Data Grid and SheetJS to pull data from a spreadsheet and
display the content in a data grid. We'll explore how to import data from files
into the data grid and how to export modified data from the grid to workbooks.

The ["Demo"](#demo) section includes a complete example that displays data from
user-supplied sheets and exports data to XLSX workbooks:

![react-data-grid screenshot](pathname:///rdg/rdg1.png)

:::note Tested Deployments

This demo was tested in the following environments:

| Version         | Date       | Notes                |
|:----------------|:-----------|:---------------------|
| `7.0.0-beta.19` | 2024-06-09 |                      |
| `7.0.0-beta.44` | 2024-06-09 | Editing did not work |

:::

:::danger pass

When this demo was last tested against the latest version, the grid correctly
displayed data but data could not be edited by the user.

The current recommendation is to use version `7.0.0-beta.19`.

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

Using the `npm` tool, this command installs SheetJS and React Data Grid:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz react-data-grid@7.0.0-beta.19`}
</CodeBlock>

Methods and components in both libraries can be loaded in pages using `import`:

```js
import { read, utils, writeFile } from 'xlsx';
import DataGrid, { Column } from "react-data-grid";
```

#### Rows and Columns state

`react-data-grid` state consists of an Array of column metadata and an Array of
row objects. Typically both are defined in state:

```jsx
import DataGrid, { Column } from "react-data-grid";

export default function App() {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);

  return ( <DataGrid columns={columns} rows={rows} onRowsChange={setRows} /> );
}
```

The most generic data representation is an array of arrays. To sate the grid,
columns must be objects whose `key` property is the index converted to string:

```ts
import { WorkSheet, utils } from 'xlsx';
import { textEditor, Column } from "react-data-grid";

type Row = any[];
type AOAColumn = Column<Row>;
type RowCol = { rows: Row[]; columns: AOAColumn[]; };

function ws_to_rdg(ws: WorkSheet): RowCol {
  /* create an array of arrays */
  const rows = utils.sheet_to_json(ws, { header: 1 });

  /* create column array */
  const range = utils.decode_range(ws["!ref"]||"A1");
  const columns = Array.from({ length: range.e.c + 1 }, (_, i) => ({
    key: String(i), // RDG will access row["0"], row["1"], etc
    name: utils.encode_col(i), // the column labels will be A, B, etc
    editor: textEditor // enable cell editing
  }));

  return { rows, columns }; // these can be fed to setRows / setColumns
}
```

In the other direction, a worksheet can be generated with `aoa_to_sheet`:

```ts
import { WorkSheet, utils } from 'xlsx';

type Row = any[];

function rdg_to_ws(rows: Row[]): WorkSheet {
  return utils.aoa_to_sheet(rows);
}
```

:::caution pass

When the demo was last refreshed, row array objects were preserved.  This was
not the case in a later release.  The row arrays must be re-created.

The snippet defines a `arrayify` function that creates arrays if necessary.

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

function rdg_to_ws(rows: Row[]): WorkSheet {
  return utils.aoa_to_sheet(arrayify(rows));
}
```

:::

## Demo

1) Create a new ViteJS app using the `react-ts` template:

```bash
npm create vite@latest -- sheetjs-rdg --template react-ts
cd sheetjs-rdg
```

2) Install dependencies:

<CodeBlock language="bash">{`\
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz react-data-grid@7.0.0-beta.19`}
</CodeBlock>

3) Download [`App.tsx`](pathname:///rdg/App.tsx) and replace `src/App.tsx`.

```bash
curl -L -o src/App.tsx https://docs.sheetjs.com/rdg/App.tsx
```

4) Start the development server:

```bash
npm run dev
```

The terminal window will display a URL (typically `http://localhost:5173`).
Open the URL with a web browser and confirm that a page loads.

#### Testing

5) Confirm the table shows a list of Presidents.

When the page loads, it will fetch https://docs.sheetjs.com/pres.numbers, parse
with SheetJS, and load the data in the data grid.

6) Click the "export [.xlsx]" button to export the grid data to XLSX. It should
attempt to download `SheetJSRDG.xlsx`.

7) Open the generated file in a spreadsheet editor. Set cell A7 to "SheetJS Dev"
and set cell B7 to 47. Save the file.

8) Use the file picker to select the modified file. The table will refresh and
show the new data.