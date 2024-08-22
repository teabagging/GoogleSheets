---
title: Bundling Sheets with ViteJS
sidebar_label: ViteJS
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 3
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[ViteJS](https://vitejs.dev/) is a modern build tool for generating static sites.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses ViteJS and SheetJS to export data. We'll explore how to add
SheetJS to a site using ViteJS and how to export data to spreadsheets.

:::info pass

The [Vite section of the Content demo](/docs/demos/static/vitejs) covers asset
loaders. They are ideal for static sites pulling data from sheets at build time.

:::

:::note pass

This demo focuses on integration details with the ViteJS bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| ViteJS   | Date       |
|:---------|:-----------|
| `5.2.10` | 2024-04-27 |
| `4.5.3`  | 2024-04-27 |
| `3.2.10` | 2024-04-27 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

After installing the SheetJS module in a ViteJS project, `import` statements
can load relevant parts of the library.

```js
import { read, utils, writeFileXLSX } from 'xlsx';
```

:::info pass

ViteJS requires third-party libraries to provide additional `package.json`
metadata. SheetJS library version 0.18.10 added the required metadata.

It is strongly recommended to [upgrade to the latest version](/docs/getting-started/installation/frameworks)

:::

## Complete Example

1) Create a new ViteJS project:

```bash
npm create vite@latest sheetjs-vite -- --template vue-ts
cd sheetjs-vite
npm i
```

2) Add the SheetJS dependency:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

3) Replace `src\components\HelloWorld.vue` with:

```html title="src\components\HelloWorld.vue"
<script setup lang="ts">
import { version, utils, writeFileXLSX } from 'xlsx';

interface President {
  terms: { "type": "prez" | "viceprez"; }[];
  name: { first: string; last: string; }
  bio: { birthday: string; }
}

async function xport() {
/* fetch JSON data and parse */
const url = "https://docs.sheetjs.com/executive.json";
const raw_data: President[] = await (await fetch(url)).json();

/* filter for the Presidents */
const prez = raw_data.filter(row => row.terms.some(term => term.type === "prez"));

/* sort by first presidential term */
prez.forEach(row => row.start = row.terms.find(term => term.type === "prez").start);
prez.sort((l,r) => l.start.localeCompare(r.start));

/* flatten objects */
const rows = prez.map(row => ({
  name: row.name.first + " " + row.name.last,
  birthday: row.bio.birthday
}));

/* generate worksheet and workbook */
const worksheet = utils.json_to_sheet(rows);
const workbook = utils.book_new();
utils.book_append_sheet(workbook, worksheet, "Dates");

/* fix headers */
utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

/* calculate column width */
const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
worksheet["!cols"] = [ { wch: max_width } ];

/* create an XLSX file and try to save to Presidents.xlsx */
writeFileXLSX(workbook, "Presidents.xlsx");
}

</script>

<template>
  <button type="button" @click="xport">Export with SheetJS version {{ version }}</button>
</template>
```

4) Start the development server:

```bash
npm run dev
```

5) Open a web browser to `http://localhost:5173/` and click the export button.

6) Build the production site:

```bash
npx vite build
```

7) Verify the new site by running a local web server in the `dist` folder:

```bash
npx http-server dist
```

8) Access the displayed URL (typically `http://localhost:8080`) in a web browser
and click the export button.
