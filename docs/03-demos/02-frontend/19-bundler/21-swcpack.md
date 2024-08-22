---
title: Bundling Sheets with SWC
sidebar_label: SWC spack
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 21
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

SWC[^1] is a JS toolchain. SWC provides `spack` (formally called "swcpack") for
bundling scripts.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses `spack` and SheetJS to export data. We'll explore how to bundle
SheetJS in a site using `spack` and how to export data to spreadsheets.

:::note pass

This demo focuses on integration details with the `spack` bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Version   | Date       |
|:----------|:-----------|
| `1.2.246` | 2024-04-27 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

After installing the SheetJS module in a SWC `spack` project, `import`
statements can load relevant parts of the library.

Projects that import data will use methods such as `read`[^2] to parse workbooks
and `sheet_to_json`[^3] to generate usable data from files. As `sheet_to_json`
is part of the `utils` object, the required import is:

```js
import { read, utils } from 'xlsx';
```

Projects that export data will use methods such as `json_to_sheet`[^4] to
generate worksheets and `writeFile`[^5] to export files. As `json_to_sheet` is
part of the `utils` object, the required import is:

```js
import { utils, writeFile } from 'xlsx';
```

:::danger pass

When this demo was tested against recent versions of `@swc/core`, `spack` crashed:

```
thread '<unnamed>' panicked at 'cannot access a scoped thread local variable without calling `set` first',
```

**This is a bug in SWC**

This bug is known to affect versions `1.3.100` and `1.4.17`.

Until the bug is fixed, it is strongly recommended to use `@swc/core@1.2.246`.

:::

## Complete Example

0) Initialize a new project:

```bash
mkdir sheetjs-spack
cd sheetjs-spack
npm init -y
```

1) Install the dependencies using a package manager:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz regenerator-runtime @swc/cli @swc/core@1.2.246`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz regenerator-runtime @swc/cli @swc/core@1.2.246`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz regenerator-runtime @swc/cli @swc/core@1.2.246`}
</CodeBlock>
  </TabItem>
</Tabs>

:::note pass

The `regenerator-runtime` dependency is used for transpiling `fetch` and is not
required if the interface code does not use `fetch` or Promises.

:::

2) Save the following to `index.js`:

```js title="index.js"
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

3) Create an `spack.config.js` config file:

```js title="spack.config.js"
module.exports = ({
  entry: {
    'web': __dirname + '/index.js',
  },
  output: {
    path: __dirname + '/lib'
  },
  module: {},
});
```

4) Build for production:

```bash
npx spack
```

This command will create the script `lib/web.js`

5) Create a small HTML page that loads the generated script:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <script src="lib/web.js"></script>
  </body>
</html>
```

6) Start a local HTTP server, then go to `http://localhost:8080/`

```bash
npx http-server .
```

Click on "Click here to export" to generate a file.

[^1]: See ["Bundling Configuration"](https://swc.rs/docs/configuration/bundling) in the SWC documentation for more details.
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^4]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)