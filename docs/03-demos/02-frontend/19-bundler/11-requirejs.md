---
title: Bundling Sheets with RequireJS
sidebar_label: RequireJS
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 11
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[RequireJS](https://requirejs.org/) is a JavaScript file and module loader. It
includes an in-browser loader as well as a static optimizer.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses RequireJS and SheetJS to export data. We'll explore how to load
SheetJS in a site using RequireJS and how to use the `r.js` optimizer to create
a bundled site.

The [Live demo](pathname:///requirejs/requirejs.html) loads RequireJS from the
CDN, uses it to load the standalone script from the SheetJS CDN, and uses the
`XLSX` variable to create a button click handler that creates a workbook.

:::note pass

This demo focuses on integration details with the RequireJS loader.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| RequireJS | Date       |
|:----------|:-----------|
| `2.3.6`   | 2024-04-27 |
| `2.1.22`  | 2024-04-27 |

:::

## Integration Details

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
comply with AMD `define` semantics. They support RequireJS and the `r.js`
optimizer out of the box.

### Config

The RequireJS config should set the `xlsx` alias in the `paths` property.

#### SheetJS CDN

The SheetJS CDN URL can be directly referenced in a path alias:

<CodeBlock language="js">{`\
require.config({
  baseUrl: ".",
  name: "app",
  paths: {
    // highlight-next-line
    xlsx: "https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min"
  }
});`}
</CodeBlock>


#### Vendoring

After downloading the SheetJS standalone script, a relative path can be used in
the path alias. For example, if the standalone script was downloaded in the same
directory as the HTML page, the path should be `./xlsx.full.min`:

```js
require.config({
  baseUrl: ".",
  name: "app",
  paths: {
    // highlight-next-line
    xlsx: "./xlsx.full.min"
  }
});
```

### Usage

Once the alias is set, `"xlsx"` can be required from app scripts:

```js
// highlight-next-line
require(["xlsx"], function(XLSX) {
  /* use XLSX here */
  console.log(XLSX.version);
});
```

Within the callback, the `XLSX` variable exposes the functions listed in the
["API Reference"](/docs/api/) section of the documentation.

## Complete Example

This demo will explore the standalone RequireJS script and the `r.js` optimizer.

### Standalone RequireJS

0) Download the SheetJS Standalone script and move to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}
</CodeBlock>

1) Save the following to `index.html`:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <!-- highlight-next-line -->
    <script src="http://requirejs.org/docs/release/2.3.6/comments/require.js"></script>
    <script>
/* Wire up RequireJS */
require.config({
  baseUrl: ".",
  name: "SheetJSRequire",
  paths: {
    xlsx: "./xlsx.full.min"
  }
});
    </script>
    <script src="SheetJSRequire.js"></script>
  </body>
</html>
```

:::note pass

To change the RequireJS version, change the version in the highlighted line. For
example, the following script corresponds to RequireJS `2.1.22`:

```html
    <script src="http://requirejs.org/docs/release/2.1.22/comments/require.js"></script>
```

:::

2) Save the following to `SheetJSRequire.js`:

```js title="SheetJSRequire.js"
require(["xlsx"], function(XLSX) {
  document.getElementById("xport").addEventListener("click", function() {
    /* fetch JSON data and parse */
    var url = "https://docs.sheetjs.com/executive.json";
    fetch(url).then(function(res) { return res.json(); }).then(function(raw_data) {

    /* filter for the Presidents */
    var prez = raw_data.filter(function(row) { return row.terms.some(function(term) { return term.type === "prez"; }); });

    /* sort by first presidential term */
    prez.forEach(function(row) { row.start = row.terms.find(function(term) {return term.type === "prez"; }).start; });
    prez.sort(function(l,r) { return l.start.localeCompare(r.start); });

    /* flatten objects */
    var rows = prez.map(function(row) { return {
      name: row.name.first + " " + row.name.last,
      birthday: row.bio.birthday
    }; });

    /* generate worksheet and workbook */
    var worksheet = XLSX.utils.json_to_sheet(rows);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    /* fix headers */
    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

    /* calculate column width */
    var max_width = rows.reduce(function(w, r) { return Math.max(w, r.name.length); }, 10);
    worksheet["!cols"] = [ { wch: max_width } ];

    /* create an XLSX file and try to save to Presidents.xlsx */
    XLSX.writeFileXLSX(workbook, "Presidents.xlsx");
    });
  });
});
```

:::info pass

The `r.js` optimizer does not handle `async` functions or ES6 arrow functions.

To demonstrate compatibility with older RequireJS releases, `SheetJSRequire.js`
uses normal functions and traditional Promise chains.

:::

3) Start a local HTTP server:

```bash
npx http-server .
```

4) Load the displayed URL (typically `http://localhost:8080/`) in a web browser.

Click on "Click here to export" to generate a file.

### r.js Optimizer

5) Create `build.js` configuration for the optimizer:

```js title="build.js"
({
  baseUrl: ".",
  name: "SheetJSRequire",
  paths: {
    xlsx: "./xlsx.full.min"
  },
  out: "SheetJSRequire.min.js"
});
```

6) Run the `r.js` optimizer to create `SheetJSRequire.min.js`:

```bash
npx -p requirejs@2.3.6 r.js -o build.js
```

:::note pass

To change the RequireJS version, change the version in the command. For example,
the following command uses RequireJS `2.1.22` to generate an optimized script:

```bash
npx -p requirejs@2.1.22 r.js -o build.js
```

:::

6) Save the following to `optimized.html`:

```html title="optimized.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <!-- highlight-next-line -->
    <script src="http://requirejs.org/docs/release/2.3.6/comments/require.js"></script>
    <script src="SheetJSRequire.min.js"></script>
  </body>
</html>
```

:::note pass

To change the RequireJS version, change the version in the highlighted line. For
example, the following script corresponds to RequireJS `2.1.22`:

```html
    <script src="http://requirejs.org/docs/release/2.1.22/comments/require.js"></script>
```

:::

7) Open `optimized.html` in the browser (`http://localhost:8080/optimized.html`)

Click on "Click here to export" to generate a file.
