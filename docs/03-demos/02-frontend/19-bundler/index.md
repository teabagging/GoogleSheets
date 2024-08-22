---
title: Bundlers
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 19
sidebar_custom_props:
  skip: 1
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

SheetJS predates ECMAScript modules and most bundler tools. As best practices
have evolved, stress testing SheetJS libraries have revealed bugs in bundlers
and other tools. This demo collects various notes and provides basic examples.

:::note pass

Issues should be reported to the respective bundler projects.  Typically it is
considered a bundler bug if the tool cannot properly handle JS libraries.

:::

The following tools are covered in separate pages:

<ul>{useCurrentSidebarCategory().items.filter(item => !item?.customProps?.skip).map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

## Dojo

Integration details are included [in the "AMD" installation](/docs/getting-started/installation/amd#dojo-toolkit)

Complete Examples are included [in the "Dojo" demo](/docs/demos/frontend/dojo)

## Snowpack

Snowpack was a development tool built by the AstroJS team.

:::caution pass

Snowpack is no longer maintained. The developers recommend [ViteJS](/docs/demos/frontend/bundler/vitejs)

:::

Snowpack works with no caveats.

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

:::note Tested Deployments

This demo was tested in the following environments:

| Version | Date       |
|:--------|:-----------|
| `3.8.8` | 2024-04-14 |

:::

0) Initialize a new project:

```bash
mkdir sheetjs-snowpack
cd sheetjs-snowpack
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

3) Create a small HTML page that loads the script.  Save to `index.html`:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

:::note pass

Unlike other bundlers, Snowpack requires a full page including `HEAD` element.

:::

4) Build for production:

```bash
npx snowpack@3.8.8 build
```

5) Start a local HTTP server, then go to `http://localhost:8080/`

```bash
npx http-server build/
```

Click on "Click here to export" to generate a file.

</details>

## WMR

WMR was a development tool built by the PreactJS team.

:::caution pass

WMR is no longer maintained. The developers recommend [ViteJS](/docs/demos/frontend/bundler/vitejs)

:::

WMR works with no caveats.

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

:::note Tested Deployments

This demo was tested in the following environments:

| Version | Date       |
|:--------|:-----------|
| `3.8.0` | 2024-04-14 |

:::

0) Initialize a new project:

```bash
mkdir sheetjs-wmr
cd sheetjs-wmr
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

3) Create a small HTML page that loads the script.  Save to `index.html`:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head></head>
  <body>
    <h1>SheetJS Presidents Demo</h1>
    <button id="xport">Click here to export</button>
    <script type="module" src="./index.js"></script>
  </body>
</html>
```

4) Build for production:

```bash
npx wmr@3.8.0 build
```

5) Start a local HTTP server in `dist` folder and go to `http://localhost:8080/`

```bash
npx http-server dist/
```

Click on "Click here to export" to generate a file.

</details>

#### Browserify

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/browserify)**

#### Bun

**[The exposition has been moved to a separate page.](/docs/getting-started/installation/bun#bundling)**

#### esbuild

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/esbuild)**

#### Parcel

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/parcel)**

#### RequireJS

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/requirejs)**

#### Rollup

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/rollup)**

#### SWC

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/swcpack)**

#### SystemJS

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/systemjs)**

#### Vite

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/vitejs)**

#### Webpack

**[The exposition has been moved to a separate page.](/docs/demos/frontend/bundler/webpack)**
