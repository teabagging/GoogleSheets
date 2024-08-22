---
title: Bundling Sheets with ESBuild
sidebar_label: ESBuild
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 4
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[ESBuild](https://esbuild.github.io/) is a fast module bundler for JavaScript.
It combines scripts and libraries into simple scripts for browsers and NodeJS.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses ESBuild and SheetJS to export data. We'll explore two workflows:

- ["Browser"](#browser) explores how to import SheetJS libraries in a script and
bundle with ESBuild for browser use.

- ["NodeJS"](#nodejs) explores how to import SheetJS libraries in a script and
bundle with ESBuild for NodeJS use.

:::info pass

The [ESBuild section of the Content demo](/docs/demos/static/esbuild) covers
loaders. They are ideal for static sites pulling data from sheets at build time.

:::

:::note pass

This demo focuses on integration details with the ESBuild bundler.

The demos follow the ["Export Tutorial"](/docs/getting-started/examples/export),
which covers SheetJS library usage in more detail.

:::

:::note Tested Deployments

This demo was tested in the following environments:

| ESBuild   | Date       |
|:----------|:-----------|
| `0.21.4`  | 2024-06-07 |
| `0.20.2`  | 2024-06-07 |
| `0.19.12` | 2024-06-07 |
| `0.18.20` | 2024-06-07 |
| `0.17.19` | 2024-06-07 |
| `0.16.17` | 2024-06-07 |
| `0.15.18` | 2024-06-07 |
| `0.14.54` | 2024-06-07 |
| `0.13.15` | 2024-06-07 |
| `0.12.29` | 2024-06-07 |
| `0.11.23` | 2024-06-07 |
| `0.10.2`  | 2024-06-07 |
| `0.9.7`   | 2024-06-07 |

:::

## Integration Details

[The "Frameworks" section](/docs/getting-started/installation/frameworks) covers
installation with Yarn and other package managers.

## Browser

ESBuild will bundle the SheetJS ECMAScript Module build:

```js
import { read, utils, writeFileXLSX } from 'xlsx';
```

:::note pass

The `xlsx.mjs` source file uses a subset of ES6 that `esbuild` understands and
is able to transpile for older browsers.

:::

Assuming the primary source file is `in.js`, the following command will bundle
the script and generate `out.js`:

```bash
npx -y esbuild@0.19.8 in.js --bundle --outfile=out.js
```

### Browser Demo

0) Prepare a blank project:

```bash
mkdir sheetjs-esbrowser
cd sheetjs-esbrowser
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

2) Download [`esbrowser.js`](pathname:///esbuild/esbrowser.js) and move to the
project folder:

```bash
curl -LO https://docs.sheetjs.com/esbuild/esbrowser.js
```

3) Create a small HTML page that loads the script.  Save to `index.html`:

```html title="index.html"
<body><script src="esb.browser.js"></script></body>
```

4) Create bundle:

```bash
npx -y esbuild@0.19.8 esbrowser.js --bundle --outfile=esb.browser.js
```

5) Start a local HTTP server:

```bash
npx http-server .
```

Access the displayed URL (typically `http://localhost:8080`) with a web browser.
It should attempt to download `Presidents.xlsx`

## NodeJS

ESBuild will bundle the SheetJS ECMAScript Module build:

```js
import { read, utils, write } from 'xlsx';
```

:::caution pass

To read and write files on the local filesystem using the SheetJS `readFile` and
`writeFile` methods[^1], the `fs` module must be manually added:

```js
import { set_fs, readFile } from 'xlsx';
import * as fs from 'fs';
set_fs(fs);

/* read pres.numbers in the same directory as the script */
const wb = readFile("pres.numbers");
```

:::

Assuming the primary source file is `in.js`, the following command will bundle
the script for NodeJS and generate `out.js`:

```bash
npx -y esbuild@0.19.8 in.js --bundle --platform=node --outfile=out.js
```

### NodeJS Demo

:::info pass

This demo script uses `fetch` and requires Node 18+.

:::

0) Prepare a blank project:

```bash
mkdir sheetjs-esbnode
cd sheetjs-esbnode
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

2) Download [`esbnode.js`](pathname:///esbuild/esbnode.js) and move to the
project folder:

```bash
curl -LO https://docs.sheetjs.com/esbuild/esbnode.js
```

3) Create bundle:

```bash
npx -y esbuild@0.19.8 esbnode.js --bundle --platform=node --outfile=esb.node.js
```

4) Run the bundle:

```bash
node esb.node.js
```

The process will generate `Presidents.xlsx` in the project directory. Open the
file in a spreadsheet editor.

[^1]: The SheetJS [`readFile`](/docs/api/parse-options) and [`writeFile`](/docs/api/write-options) methods use the NodeJS `fs` module when available. It is not automatically loaded in the ECMAScript Module builds.