---
title: Bundling Sheets with SystemJS
sidebar_label: SystemJS
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 12
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

SystemJS[^1] is a module loader for NodeJS and browsers.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SystemJS and SheetJS to export data. We'll explore two workflows:

- ["Browser"](#browser) explores how to load SheetJS with SystemJS using the
in-browser dynamic loader

- ["NodeJS"](#nodejs) explores how to load SheetJS with SystemJS in NodeJS.

:::info pass

This demo was originally written for SystemJS 0.19, the most popular SystemJS
version used with Angular projects. In the years since the release, Angular and
other tools using SystemJS have switched to Webpack.

:::

:::note pass

This demo focuses on integration details with the SystemJS loader.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| Version   | Platform | Date       |
|:----------|:---------|:-----------|
| `0.19.47` | NodeJS   | 2024-03-31 |
| `0.20.16` | Browser  | 2024-03-31 |
| `0.20.19` | NodeJS   | 2024-03-31 |
| `0.21.6`  | NodeJS   | 2024-03-31 |
| `6.14.3`  | NodeJS   | 2024-03-31 |

:::

## Browser

:::info pass

The [Live demo](pathname:///systemjs/systemjs.html) loads SystemJS from the
CDN, uses it to load the standalone script from the SheetJS CDN and emulate
a `require` implementation when loading [`main.js`](pathname:///systemjs/main.js)

"View Source" works on the main HTML page and the `main.js` script.

:::

SystemJS fails by default because the library does not export anything in the
web browser.  The `meta` configuration option can be used to expose `XLSX`:

<CodeBlock language="js">{`\
SystemJS.config({
  meta: {
    'xlsx': {
      exports: 'XLSX' // <-- tell SystemJS to expose the XLSX variable
    }
  },
  map: {
    'xlsx': 'https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js',
    'fs': '',     // <--|
    'crypto': '', // <--| suppress native node modules
    'stream': ''  // <--|
  }
});
SystemJS.import('main.js'); // load \`main.js\``}
</CodeBlock>

With this import, the `main.js` script can freely `require("xlsx")`.

:::caution Web Workers

Web Workers can load the SystemJS library with `importScripts`, but the imported
code cannot assign the original worker's `onmessage` callback.  The recommended
approach is to expose a global from the required script,  For example, supposing
the shared name is `_cb`, the primary worker script would call the callback:

```js title="worker.js"
/* main worker script */
importScripts('system.js');

SystemJS.config({ /* ... browser config ... */ });

onmessage = function(evt) {
  SystemJS.import('workermain.js').then(function() { _cb(evt); });
};
```

The worker script would define and expose the function:

```js title="workermain.js"
/* Loaded with SystemJS import */
var XLSX = require('xlsx');

_cb = function(evt) { /* ... do work here ... */ };
```

:::

## NodeJS

:::caution pass

**It is strongly recommended to use the NodeJS `require` method when possible.**

This demo is relevant for legacy projects that use the SystemJS NodeJS loader.

:::

### Old Style

The NodeJS module main script is `xlsx/xlsx.js` and should be mapped:

```js
SystemJS.config({
  map: {
    "xlsx": "./node_modules/xlsx/xlsx.js"
  }
});
```

The standalone scripts can be required, but SystemJS config must include a hint
that the script assigns a global:

```js
SystemJS.config({
  meta: {
    "standalone": { format: "global" }
  },
  map: {
    "standalone": "xlsx.full.min.js"
  }
});
```

### New Style

Newer versions of SystemJS supports "import maps" through `applyImportMap`:

```js
const SystemJS = require('systemjs');
const src = require("path").join(process.cwd(), 'node_modules/xlsx/xlsx.js');
SystemJS.applyImportMap(SystemJS.System, {
  imports: {
    'xlsx': "file://" + src,
    'fs': 'node:fs',
    'crypto': 'node:crypto',
    'stream': 'node:stream'
  }
});
````

:::caution pass

In the modern style, importing to the name `XLSX` will cause conflicts.

**It is strongly recommended to import to the name `_XLSX`!**

```js
SystemJS.System.import("xlsx").then(function(
// highlight-next-line
  _XLSX // use _XLSX instead of XLSX
) {
  if(typeof XLSX == "undefined") throw "Import failed!";

  // XLSX is defined here
  console.log(XLSX.version);
});
```

:::

### NodeJS Demo

0) Prepare a blank project:

```bash
mkdir sheetjs-systemjs
cd sheetjs-systemjs
npm init -y
```

1) Install the dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz systemjs@6.14.3`}
</CodeBlock>

2) Download [`SheetJSystem.js`](pathname:///systemjs/SheetJSystem.js) and move
to the project folder:

```bash
curl -LO https://docs.sheetjs.com/systemjs/SheetJSystem.js
```

:::info pass

The script handles old-style and new-style SystemJS loaders.

:::

3) Run in NodeJS:

```bash
node SheetJSystem.js
```

If the demo worked, `Presidents.xlsx` will be created.

:::note pass

As it uses `fetch`, this demo requires Node 18.

:::


[^1]: The project does not have a separate website. The source repository is hosted on [GitHub](https://github.com/systemjs/systemjs)