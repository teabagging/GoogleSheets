---
title: Sheets in Svelte Sites
sidebar_label: Svelte
description: Build interactive websites with Svelte. Seamlessly integrate spreadsheets into your app using SheetJS. Bring Excel-powered workflows and data to the modern web.
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 5
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Svelte](https://svelte.dev/) is a JavaScript library for building user
interfaces.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Svelte and SheetJS to process and generate spreadsheets. We'll
explore how to load SheetJS in a Svelte component and compare common state
models and data flow strategies.

:::note pass

This demo focuses on Svelte concepts. Other demos cover general deployments:

- [Static Site Generation powered by SvelteKit](/docs/demos/static/svelte)
- [iOS and Android applications powered by CapacitorJS](/docs/demos/mobile/capacitor)
- [Desktop application powered by Wails](/docs/demos/desktop/wails)

:::

## Installation

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

The library can be imported directly from Svelte files with:

```js
import { read, utils, writeFile } from 'xlsx';
```


## Internal State

The various SheetJS APIs work with various data shapes.  The preferred state
depends on the application.

### Array of Objects

Typically, some users will create a spreadsheet with source data that should be
loaded into the site. This sheet will have known columns. For example, "Name"
and "Index" are used in [`pres.xlsx`](https://docs.sheetjs.com/pres.xlsx):

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

This naturally maps to an array of typed objects, as in the TS example below:

```ts
import { read, utils } from 'xlsx';

interface President {
  Name: string;
  Index: number;
}

const f = await (await fetch("https://docs.sheetjs.com/pres.xlsx")).arrayBuffer();
const wb = read(f);
const data = utils.sheet_to_json<President>(wb.Sheets[wb.SheetNames[0]]);
console.log(data);
```

A component will typically map over the data. The following example generates
a TABLE with a row for each President:

```html title="src/SheetJSSvelteAoO.svelte"
<script>
import { onMount } from 'svelte';
import { read, utils, writeFileXLSX } from 'xlsx';

/* the component state is an array of presidents */
let pres = [];

/* Fetch and update the state once */
onMount(async() => {
  const f = await (await fetch("https://docs.sheetjs.com/pres.xlsx")).arrayBuffer();
  const wb = read(f); // parse the array buffer
  const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
  // highlight-start
  pres = utils.sheet_to_json(ws); // generate objects and update state
  // highlight-end
});

/* get state data and export to XLSX */
function exportFile() {
  // highlight-next-line
  const ws = utils.json_to_sheet(pres);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Data");
  writeFileXLSX(wb, "SheetJSSvelteAoO.xlsx");
}
</script>

<main>
  <table><thead><tr><th>Name</th><th>Index</th></tr></thead><tbody>
  <!-- highlight-start -->
  {#each pres as p}<tr>
    <td>{p.Name}</td>
    <td>{p.Index}</td>
  </tr>{/each}
  <!-- highlight-end -->
  </tbody><tfoot><td colSpan={2}>
  <button on:click={exportFile}>Export XLSX</button>
  </td></tfoot></table>
</main>
```

<details open>
  <summary><b>How to run the example</b> (click to hide)</summary>

:::note Tested Deployments

This demo was tested in the following environments:

| SvelteJS | ViteJS   | Date       |
|:---------|:---------|:-----------|
| `4.2.18` | `5.2.13` | 2024-06-07 |

:::

1) Create a new project:

```bash
npm create vite@latest sheetjs-svelte -- --template svelte-ts
```

2) Install the SheetJS dependency and start the dev server:

<CodeBlock language="bash">{`\
cd sheetjs-svelte
npm i
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz
npm run dev`}
</CodeBlock>

3) Open a web browser and access the displayed URL (`http://localhost:5173`)

4) Replace `src/App.svelte` with the `src/SheetJSSvelteAoO.svelte` example.

The page will refresh and show a table with an Export button.  Click the button
and the page will attempt to download `SheetJSSvelteAoA.xlsx`. There may be a
delay since Vite will try to optimize the SheetJS library on the fly.

5) Build the site:

```bash
npm run build
```

The generated site will be placed in the `dist` folder.

6) Start a local web server:

```bash
npx http-server dist
```

Access the displayed URL (typically `http://localhost:8080`) with a web browser
and test the page.

</details>

### HTML

The main disadvantage of the Array of Objects approach is the specific nature
of the columns.  For more general use, passing around an Array of Arrays works.
However, this does not handle merge cells[^1] well!

The `sheet_to_html` function generates HTML that is aware of merges and other
worksheet features.  Svelte `@html` tag allows raw HTML strings:

```html title="src/SheetJSSvelteHTML.svelte"
<script>
import { onMount } from 'svelte';
import { read, utils, writeFileXLSX } from 'xlsx';

let html = "";
let tbl;

/* Fetch and update the state once */
onMount(async() => {
  const f = await (await fetch("https://docs.sheetjs.com/pres.xlsx")).arrayBuffer();
  const wb = read(f); // parse the array buffer
  const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
  // highlight-start
  html = utils.sheet_to_html(ws); // generate HTML and update state
  // highlight-end
});

/* get state data and export to XLSX */
function exportFile() {
  // highlight-start
  const elt = tbl.getElementsByTagName("TABLE")[0];
  const wb = utils.table_to_book(elt);
  // highlight-end
  writeFileXLSX(wb, "SheetJSSvelteHTML.xlsx");
}
</script>

<main>
  <button on:click={exportFile}>Export XLSX</button>
  <!-- highlight-start -->
  <div bind:this={tbl}>{@html html}</div>
  <!-- highlight-end -->
</main>
```

<details open>
  <summary><b>How to run the example</b> (click to hide)</summary>

:::note Tested Deployments

This demo was tested in the following environments:

| SvelteJS | ViteJS   | Date       |
|:---------|:---------|:-----------|
| `4.2.18` | `5.2.13` | 2024-06-07 |

:::

1) Create a new project:

```bash
npm create vite@latest sheetjs-svelte -- --template svelte-ts
```

2) Install the SheetJS dependency and start the dev server:

<CodeBlock language="bash">{`\
cd sheetjs-svelte
npm i
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz
npm run dev`}
</CodeBlock>

3) Open a web browser and access the displayed URL (`http://localhost:5173`)

4) Replace `src/App.svelte` with the `src/SheetJSSvelteHTML.svelte` example.

The page will refresh and show a table with an Export button.  Click the button
and the page will attempt to download `SheetJSSvelteHTML.xlsx`. There may be a
delay since Vite will try to optimize the SheetJS library on the fly.

5) Build the site:

```bash
npm run build
```

The generated site will be placed in the `dist` folder.

6) Start a local web server:

```bash
npx http-server dist
```

Access the displayed URL (typically `http://localhost:8080`) with a web browser
and test the page.

</details>

[^1]: See ["Merged Cells" in "SheetJS Data Model"](/docs/csf/features/merges) for more details.
