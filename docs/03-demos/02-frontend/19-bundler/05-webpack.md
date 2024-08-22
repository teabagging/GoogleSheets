---
title: Bundling Sheets with Webpack
sidebar_label: Webpack
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 5
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[Webpack](https://webpack.js.org/) is a module bundler.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Webpack and SheetJS to export data. We'll explore how to bundle
SheetJS in a site using Webpack and how to export data to spreadsheets.

:::info pass

The [Webpack section of the Content demo](/docs/demos/static/webpack) covers asset
loaders. They are ideal for static sites pulling data from sheets at build time.

:::

:::note pass

This demo focuses on integration details with the Webpack bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Version  | Date       | Required Workarounds                |
|:---------|:-----------|:------------------------------------|
| `2.7.0`  | 2024-03-16 | Import `xlsx/dist/xlsx.full.min.js` |
| `3.12.0` | 2024-03-16 | Import `xlsx/dist/xlsx.full.min.js` |
| `4.47.0` | 2024-03-16 | Downgrade NodeJS (tested v16.20.2)  |
| `5.90.3` | 2024-03-16 |                                     |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

After installing the SheetJS module in a Webpack 5 project, `import` statements
and `require` expressions can load relevant parts of the library.

:::info pass

The ECMAScript Module build has no `require` or `import` statements and does
not use `process` or any variable that Webpack could interpret as a NodeJS
feature.  Various `package.json` fields have been added to appease various
Webpack versions starting from the `2.x` series.

:::

Projects that import data will use methods such as `read`[^1] to parse workbooks
and `sheet_to_json`[^2] to generate usable data from files. As `sheet_to_json`
is part of the `utils` object, the required import is:

```js
import { read, utils } from 'xlsx';
```

Projects that export data will use methods such as `json_to_sheet`[^3] to
generate worksheets and `writeFile`[^4] to export files. As `json_to_sheet` is
part of the `utils` object, the required import is:

```js
import { utils, writeFile } from 'xlsx';
```

:::tip pass

The `writeFileXLSX` function is a small version of `writeFile` that exclusively
supports generating XLSX spreadsheets. When the application only allows XLSX
exports, `writeFileXLSX` will reduce the final page size.

:::

### CommonJS and ESM

:::info pass

Webpack bundled the CommonJS build in older versions of the library.  Version
`0.18.1` changed the NodeJS module package so that Webpack uses the ESM build.

:::

The CommonJS build includes the codepage support library for XLS processing.

The ESM build does not include the codepage support library.
[As described in the installation instructions](/docs/getting-started/installation/frameworks),
the codepage dependency should be imported explicitly:

```js
import * as XLSX from 'xlsx';
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
set_cptable(cptable);
```

### Legacy Webpack

:::caution pass

Some older webpack projects will throw an error in the browser:

```
require is not defined             (xlsx.mjs)
```

This was a bug in Webpack and affected projects built with `create-react-app`.
If upgrading Webpack is not feasible, explicitly import the standalone script:

```js
import * as XLSX from 'xlsx/dist/xlsx.full.min.js';
```

:::

## Complete Example

0) Initialize a new project:

```bash
mkdir sheetjs-webpack
cd sheetjs-webpack
npm init -y
```

1) Install the tarball using a package manager:

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

2) Save the following to `index.js`:

```js title="index.js"
// highlight-next-line
import { utils, version, writeFileXLSX } from 'xlsx';

document.getElementById("xport").addEventListener("click", function() {
  /* fetch JSON data and parse */
  var url = "https://docs.sheetjs.com/executive.json";
  fetch(url).then(function(res) { return res.json(); }).then(function(raw_data) {

    /* filter for the Presidents */
    var prez = raw_data.filter(function(row) { return row.terms.some(function(term) { return term.type === "prez"; }); });

    /* sort by first presidential term */
    prez.forEach(function(row) {
      row.start = row.terms.find(function(term) {
        return term.type === "prez";
      }).start
    });
    prez.sort(function(l,r) { return l.start.localeCompare(r.start); });

    /* flatten objects */
    var rows = prez.map(function(row) { return {
      name: row.name.first + " " + row.name.last,
      birthday: row.bio.birthday
    }; });

    /* generate worksheet and workbook */
    var worksheet = utils.json_to_sheet(rows);
    var workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Dates");

    /* fix headers */
    utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

    /* calculate column width */
    var max_width = rows.reduce(function(w, r) { return Math.max(w, r.name.length); }, 10);
    worksheet["!cols"] = [ { wch: max_width } ];

    /* create an XLSX file and try to save to Presidents.xlsx */
    writeFileXLSX(workbook, "Presidents.xlsx");
  });
});
```

:::info pass

The minifier that ships with Webpack 2.x does not handle `async` functions or
ES6 arrow functions.

To demonstrate compatibility with older versions of Webpack, the `index.js`
script uses normal functions and traditional Promise chains.

:::

3) Create a small `webpack.config.js` script that writes to `index.min.js`:

```js title="webpack.config.js"
module.exports = {
  /* entry point index.js */
  entry: './index.js',

  /* write to index.min.js */
  output: { path:__dirname, filename: './index.min.js' }
}
```

4) Build for production.  The command depends on the version of webpack:

<Tabs>
  <TabItem value="23" label="2.x and 3.x">

:::note pass

In Webpack 2.x and 3.x, the import statement must use the standalone script.
Replace the import statement in `index.js` with the following:

```js title="index.js (replace import statement)"
import { utils, version, writeFileXLSX } from 'xlsx/dist/xlsx.full.min.js';
```

:::

This line must be changed before bundling.

**Webpack 2.x**

```bash
npx webpack@2.x -p
```

**Webpack 3.x**

```bash
npx webpack@3.x -p
```

  </TabItem>
  <TabItem value="4+" label="4.x, 5.x and beyond" default>

:::danger Pinning specific versions of webpack

The webpack tooling is not designed for switching between versions. A specific
version above 4.0 can be pinned by locally installing webpack and the CLI tool.

:::

**Webpack 4.x**

:::info pass

Webpack 4 is incompatible with Node 18+. It will elicit the following error:

```
Error: error:0308010C:digital envelope routines::unsupported
```

When this demo was last tested, NodeJS was locally downgraded to 16.20.2

:::

```bash
npm i --save webpack@4.x webpack-cli@4.x
npx webpack --mode=production
```

**Webpack 5.x**

```bash
npm i --save webpack@5.x webpack-cli@5.x
npx webpack --mode=production
```

**Webpack latest**

```bash
npm i --save webpack webpack-cli
npx webpack --mode=production
```

  </TabItem>
</Tabs>


5) Create a small HTML page that loads the script.  Save to `index.html`:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <script src="./index.min.js"></script>
  </body>
</html>
```

6) Start a local HTTP server:

```bash
npx http-server .
```

7) Load the displayed URL (typically `http://localhost:8080/`) in a web browser.

Click on "Click here to export" to generate a file.

## Miscellany

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^3]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^4]: See [`writeFile` in "Writing Files"](/docs/api/write-options)