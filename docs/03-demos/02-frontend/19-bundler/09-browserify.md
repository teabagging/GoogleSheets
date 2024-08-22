---
title: Bundling Sheets with Browserify
sidebar_label: Browserify
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 9
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[Browserify](https://browserify.org/) is a module bundler.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Browserify and SheetJS to export data. We'll explore how to add
SheetJS to a site using Browserify and how to export data to spreadsheets.

:::note pass

This demo focuses on integration details with the Browserify bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Browserify | Date       |
|:-----------|:-----------|
| `17.0.0`   | 2024-04-13 |
| `16.5.2`   | 2024-04-13 |
| `15.2.0`   | 2024-04-13 |
| `14.5.0`   | 2024-04-13 |
| `13.3.0`   | 2024-04-13 |
| `12.0.2`   | 2024-04-13 |
| `11.2.0`   | 2024-04-13 |
| `10.2.6`   | 2024-04-13 |
| `9.0.8`    | 2024-04-13 |
| `8.1.3`    | 2024-04-13 |
| `7.1.0`    | 2024-04-13 |
| `6.3.4`    | 2024-04-13 |
| `5.13.1`   | 2024-04-13 |
| `4.2.3`    | 2024-04-13 |
| `3.46.1`   | 2024-04-13 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

After installing the SheetJS module in a Browserify project, `require`
expressions can load relevant parts of the library.

```js
var XLSX = require("xlsx");
// ... use XLSX ...
```

Browserify can also process `require` expressions in Web Worker scripts.

## Complete Example

0) Initialize a new project:

```bash
mkdir sheetjs-browserify
cd sheetjs-browserify
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
const { utils, version, writeFileXLSX } = require('xlsx');

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

3) Bundle the scripts:

```bash
npx browserify index.js > index.min.js
```

:::caution pass

Legacy `browserify` versions must use a local version. For version `3.46.1`:

```bash
npm install --save browserify@3.46.1
./node_modules/.bin/browserify index.js > index.min.js
```

:::

4) Create a small HTML page that loads the script.  Save to `index.html`:

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

5) Start a local HTTP server:

```bash
npx http-server .
```

6) Load the displayed URL (typically `http://localhost:8080/`) in a web browser.

Click on "Click here to export" to generate a file.
