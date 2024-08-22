---
title: Bundling Sheets with ParcelJS
sidebar_label: ParcelJS
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 20
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[ParcelJS](https://parceljs.org/) is a module bundler.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses ParcelJS and SheetJS to export data. We'll explore how to bundle
SheetJS in a site using ParcelJS and how to export data to spreadsheets.

:::note pass

This demo focuses on integration details with the ParcelJS bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Version  | Date       |
|:---------|:-----------|
| `2.12.0` | 2024-06-08 |
| `1.12.4` | 2024-06-08 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

After installing the SheetJS module in a RollupJS project, `import` statements
can load relevant parts of the library:

```js
import { read, utils, writeFileXLSX } from 'xlsx';
```

:::danger Parcel Bug

Errors of the form `Could not statically evaluate fs call` stem from a Parcel
bug[^1]. Upgrade to Parcel version 1.5.0 or later.

:::

## Complete Example

This demo follows the [Export Example](/docs/getting-started/examples/export).

0) Initialize a new project:

```bash
mkdir sheetjs-parceljs
cd sheetjs-parceljs
npm init -y
```

1) Save the following to `index.html`:

```html title="index.html"
<body>
<h3>SheetJS <span id="vers"></span> export demo</h3>
<button id="xport">Click to Export!</button>
<!-- the script tag must be marked as `type="module"` -->
<!-- highlight-next-line -->
<script type="module">
// ESM-style import from "xlsx"
// highlight-next-line
import { utils, version, writeFileXLSX } from 'xlsx';

document.getElementById("vers").innerText = version;
document.getElementById("xport").onclick = async() => {
  /* fetch JSON data and parse */
  const url = "https://docs.sheetjs.com/executive.json";
  const raw_data = await (await fetch(url)).json();

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
};
</script>
<body>
```

:::caution pass

**ParcelJS v1 did not support `import` statements within inline scripts.**

For ParcelJS version 1, the entire script should be copied to `index.js` and the
main `index.html` page should load the `index.js` script:

<details>
  <summary><b>ParcelJS v1 example</b> (click to show)</summary>

```html title="index.html"
<body>
<h3>SheetJS <span id="vers"></span> export demo</h3>
<button id="xport">Click to Export!</button>
<script src="index.js" type="module"></script>
<body>
```

```js title="index.js"
// ESM-style import from "xlsx"
import { utils, version, writeFileXLSX } from 'xlsx';

document.getElementById("vers").innerText = version;
document.getElementById("xport").onclick = async() => {
  /* fetch JSON data and parse */
  const url = "https://docs.sheetjs.com/executive.json";
  const raw_data = await (await fetch(url)).json();

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
};
```

</details>

:::

2) Install the SheetJS NodeJS module:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
</Tabs>

#### Development

3) Run the ParcelJS development server:

```bash
npx -y parcel index.html
```

The process will print a URL:

```
Server running at http://localhost:1234
```

4) Access the URL from the previous step (typically `http://localhost:1234`) in
a web browser and click the "Click to Export!" button to generate a file.

#### Production

5) Edit `package.json` and remove the following line:

```js title="package.json (search for this line and remove)"
   "main": "index.js"
```

6) Build the production site:

```bash
npx -y parcel build index.html
```

The production site will be stored in the `dist` folder

7) Start a local web server and serve the `dist` folder:

```bash
npx http-server dist
```

Access the displayed URL (typically `http://localhost:8080/`) in a web browser.
Click on "Click here to export" to generate a file.

[^1]: See [Issue 523 in the Parcel issue tracker](https://github.com/parcel-bundler/parcel/pull/523#issuecomment-357486164)