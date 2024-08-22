---
title: vue3-table-lite
pagination_prev: demos/frontend/index
pagination_next: demos/net/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Vue 3 Table Lite](https://vue3-lite-table.vercel.app/) is a data table library
designed for the VueJS web framework.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Vue 3 Table Lite and SheetJS to pull data from a spreadsheet and
display the content in a data table. We'll explore how to import data from files
into the data grid and how to export modified data from the grid to workbooks.

The ["Demo"](#demo) section includes a complete example that displays data from
user-supplied sheets and exports data to XLSX workbooks:

![vue3-table-lite screenshot](pathname:///vtl/vtl1.png)

:::note Tested Deployments

This demo was tested in the following deployments:

| Browser      | Version | Date       |
|:-------------|:--------|:-----------|
| Chromium 125 | `1.4.0` | 2024-06-13 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation in ViteJS projects using Vue 3 Table Lite.

Using the `npm` tool, this command installs SheetJS and Vue 3 Table Lite:

<CodeBlock language="bash">{`\
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz vue3-table-lite@1.4.0`}
</CodeBlock>

#### Rows and Columns Bindings

Vue 3 Table Lite presents two attribute bindings: an array of column metadata
(`columns`) and an array of objects representing the displayed data (`rows`).
Typically both are `ref` objects:


```html
<script setup lang="ts">
import { ref } from "vue";
import VueTableLite from "vue3-table-lite/ts";

/* rows */
type Row = any[];
const rows = ref<Row[]>([]);

/* columns */
type Column = { field: string; label: string; };
const columns = ref<Column[]>([]);
</script>

<template>
  <vue-table-lite :columns="columns" :rows="rows"></vue-table-lite>
</template>
```

These can be mutated through the `value` property in VueJS lifecycle methods:

```ts
import { onMounted } from "vue";
onMounted(() => {
  columns.value = [ { field: "name", label: "Names" }];
  rows.value = [ { name: "SheetJS" }, { name: "VueJS" } ];
})
```

The most generic data representation is an array of arrays. To sate the grid,
columns must be objects whose `field` property is the index converted to string:

```js
import { ref } from "vue";
import { utils } from 'xlsx';

/* generate row and column data */
function ws_to_vtl(ws) {
  /* create an array of arrays */
  const rows = utils.sheet_to_json(ws, { header: 1 });

  /* create column array */
  const range = utils.decode_range(ws["!ref"]||"A1");
  const columns = Array.from({ length: range.e.c + 1 }, (_, i) => ({
    field: String(i), // vtl will access row["0"], row["1"], etc
    label: utils.encode_col(i), // the column labels will be A, B, etc
  }));

  return { rows, columns };
}

const rows = ref([]);
const columns = ref([]);

/* update refs */
function update_refs(ws) {
  const data = ws_to_vtl(ws);
  rows.value = data.rows;
  columns.value = data.columns;
}
```

In the other direction, a worksheet can be generated with `aoa_to_sheet`:

```js
import { utils } from 'xlsx';

const rows = ref([]);

function vtl_to_ws(rows) {
  return utils.aoa_to_sheet(rows.value);
}
```

## Demo

1) Create a new ViteJS App using the VueJS + TypeScript template:

```bash
npm create vite@latest sheetjs-vtl -- --template vue-ts
cd sheetjs-vtl
```

2) Install dependencies:

<CodeBlock language="bash">{`\
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz vue3-table-lite@1.4.0`}
</CodeBlock>

3) Download [`src/App.vue`](pathname:///vtl/App.vue) and replace the contents:

```bash
curl -L -o src/App.vue https://docs.sheetjs.com/vtl/App.vue
```

4) Start the dev server:

```bash
npm run dev
```

5) Load the displayed URL (typically `http://localhost:5173`) in a web browser.

When the page loads, it will try to fetch https://docs.sheetjs.com/pres.numbers
and display the data. Click "Export" to generate a workbook.
