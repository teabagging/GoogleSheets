---
title: Frameworks and Bundlers
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
sidebar_position: 2
sidebar_custom_props:
  summary: Kaioken, Angular, React, VueJS, ViteJS, Webpack, etc.
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Each standalone release package is available at https://cdn.sheetjs.com/. The
NodeJS package is designed to be used with frameworks and bundlers. It is a
proper ECMAScript Module release which can be optimized with developer tools.

<p><a href={"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}</a> is the URL for version {current}</p>

## Installation

Tarballs can be directly installed using a package manager:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm rm --save xlsx
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm rm xlsx
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn remove xlsx
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

:::caution pass

Newer releases of Yarn may throw an error:

```
Usage Error: It seems you are trying to add a package using a https:... url; we now require package names to be explicitly specified.
Try running the command again with the package name prefixed: yarn add my-package@https:...
```

The workaround is to prepend the URL with `xlsx@`:

<CodeBlock language="bash">{`\
yarn add xlsx@https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

:::

  </TabItem>
</Tabs>

Once installed, the library can be imported under the name `xlsx`:

```js
import { read, writeFileXLSX } from "xlsx";
```

The ["Bundlers" demo](/docs/demos/frontend/bundler) includes complete examples.

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::

:::caution Snyk Bugs

Snyk security tooling may report errors involving "Prototype Pollution":

```
Prototype Pollution [Medium Severity][https://security.snyk.io/vuln/SNYK-JS-XLSX-5457926]
```

As noted in the [Snyk report](https://security.snyk.io/vuln/SNYK-JS-XLSX-5457926):

> The issue is resolved in version 0.19.3

**Snyk is falsely reporting vulnerabilities. It is a bug in the Snyk tooling.**

Until Snyk fixes the bugs, the official recommendation is to
[suppress the warning](https://snyk.io/blog/ignoring-vulnerabilities-with-snyk/).

:::

### Legacy Endpoints

:::danger pass

Older releases are technically available on the public npm registry as `xlsx`,
but the registry is out of date.  The latest version on that registry is 0.18.5

This is a known registry bug

**The SheetJS CDN** https://cdn.sheetjs.com/ **is the authoritative source**
**for SheetJS modules.**

For existing projects, the easiest approach is to uninstall and reinstall:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm rm --save xlsx
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm rm xlsx
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn remove xlsx
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
</Tabs>

When the `xlsx` library is a dependency of a dependency, the `overrides` field
in `package.json` can control module resolution:

<CodeBlock language="json" title="package.json">{`\
{
  // highlight-start
  "overrides": {
    "xlsx": "https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz"
  }
  // highlight-end
}`}
</CodeBlock>

:::

### Vendoring

For general stability, making a local copy of SheetJS modules ("vendoring") is
strongly recommended. Vendoring decouples projects from SheetJS infrastructure.

0) Remove any existing dependency on a project named `xlsx`:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm rm --save xlsx`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm rm xlsx`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn remove xlsx`}
</CodeBlock>
  </TabItem>
</Tabs>

<ol start="1"><li><p>Download the tarball (<code parentName="pre">xlsx-{current}.tgz</code>) for the desired version. The current
   version is available at <a href={"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}</a></p></li></ol>

2) Create a `vendor` subfolder at the root of your project and move the tarball
   to that folder.  Add it to your project repository.

3) Install the tarball using a package manager:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save file:vendor/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save file:vendor/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add file:vendor/xlsx-${current}.tgz`}
</CodeBlock>

:::caution pass

Newer releases of Yarn may throw an error:

<CodeBlock language="text">{`\
Usage Error: The file:vendor/xlsx-${current}.tgz string didn't match the required format (package-name@range). Did you perhaps forget to explicitly reference the package name?`}
</CodeBlock>

The workaround is to prepend the URI with `xlsx@`:

<CodeBlock language="bash">{`\
yarn add xlsx@file:vendor/xlsx-${current}.tgz`}
</CodeBlock>

:::

  </TabItem>
</Tabs>

The package will be installed and accessible as `xlsx`.

## Usage

With most frameworks and bundler tools, named imports are recommended:

```js
import { read, utils } from 'xlsx';
```

Some legacy bundlers require the glob import:

```js
import * as XLSX from 'xlsx';
const { read, utils } = XLSX;
```

For legacy bundlers that support CommonJS, `require` will work:

```js
var XLSX = require("xlsx");
var read = XLSX.read, utils = XLSX.utils;
```

The ["Bundlers" demo](/docs/demos/frontend/bundler) includes complete examples.

### Dynamic Imports

Dynamic imports with `import()` will only download scripts when they are needed.

:::danger pass

Dynamic `import` will always download the full contents of the imported scripts!

**This is a design flaw in ECMAScript modules**

:::

It is strongly recommended to use a wrapper script that imports and re-exports
the parts of the SheetJS library that are used in a specific function or page:

```js title="SheetJSWriteWrapper.js (wrapper script)"
/* This wrapper pulls `writeFileXLSX` and `utils` from the SheetJS library */
import { utils, writeFileXLSX } from "xlsx";
export { utils, writeFileXLSX };
```

A dynamic import of the wrapper script will only load the requested features:

```js
async function export_data() {
  /* dynamically import the SheetJS Wrapper */
  // highlight-next-line
  const XLSX = await import ("./SheetJSWriteWrapper");
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([["a","b","c"],[1,2,3]]);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFileXLSX(wb, "SheetJSDynamicWrapperTest.xlsx");
}
```

## Encoding support

If Encoding support is required, `cpexcel.full.mjs` must be manually imported:

```js
/* load the codepage support library for extended support with older formats  */
import { set_cptable } from "xlsx";
import * as cptable from 'xlsx/dist/cpexcel.full.mjs';
set_cptable(cptable);
```
