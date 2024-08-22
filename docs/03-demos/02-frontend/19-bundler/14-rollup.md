---
title: Bundling Sheets with RollupJS
sidebar_label: RollupJS
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 14
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[RollupJS](https://rollupjs.org/) is a module bundler.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses RollupJS and SheetJS to export data. We'll explore how to bundle
SheetJS in a site using RollupJS and how to export data to spreadsheets.

:::note pass

This demo focuses on integration details with the RollupJS bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Version  | Date       |
|:---------|:-----------|
| `4.13.0` | 2024-03-25 |
| `3.29.4` | 2024-03-25 |
| `2.79.1` | 2024-03-25 |
| `1.32.1` | 2024-03-25 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

After installing the SheetJS module in a RollupJS project, `import` statements
can load relevant parts of the library:

```js
import { read, utils, writeFileXLSX } from 'xlsx';
```

#### Required Plugin

RollupJS can support NodeJS modules using the `@rollup/plugin-node-resolve`
plugin. The flag `--plugin @rollup/plugin-node-resolve` should be passed to the
RollupJS CLI tool

```bash
npx rollup index.js --plugin @rollup/plugin-node-resolve --file bundle.js --format iife
```

:::note pass

For RollupJS major version `1`, the plugin is `rollup-plugin-node-resolve`:

```bash
npx rollup@1.x index.js --plugin @rollup/plugin-node-resolve --file bundle.js --format iife
```

:::

## Complete Example

0) Initialize a new project:

```bash
mkdir sheetjs-rollup
cd sheetjs-rollup
npm init -y
```

1) Install the tarball using a package manager:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz rollup@4.x @rollup/plugin-node-resolve`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz rollup@4.x @rollup/plugin-node-resolve`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz rollup@4.x @rollup/plugin-node-resolve`}
</CodeBlock>
  </TabItem>
</Tabs>

2) Save the following to `index.js`:

```js title="index.js"
// highlight-next-line
import { utils, version, writeFileXLSX } from 'xlsx';

document.getElementById("xport").addEventListener("click", async() => {
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
});
```

3) Bundle the script:

```bash
npx rollup index.js --plugin @rollup/plugin-node-resolve --file bundle.js --format iife
```

This step will create `bundle.js`

4) Create a small HTML page that loads the script.  Save to `index.html`:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <script type="module" src="./bundle.js"></script>
  </body>
</html>
```

5) Start a local HTTP server:

```bash
npx http-server .
```

Access the displayed URL (typically `http://localhost:8080/`) in a web browser.
Click on "Click here to export" to generate a file.
