---
title: NodeJS
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
sidebar_position: 3
sidebar_custom_props:
  summary: Server-side and other frameworks using NodeJS modules
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Package tarballs are available on https://cdn.sheetjs.com.

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

<ol start="1"><li><p>Download the tarball (<code parentName="pre">xlsx-{current}.tgz</code>) for the desired version. The current version is available at <a href={"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}</a></p></li></ol>

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

The package supports CommonJS `require` and ESM `import` module systems.

:::info pass

**It is strongly recommended to use CommonJS in NodeJS.**

:::

### CommonJS `require`

By default, the module supports `require` and it will automatically add support
for encodings, streams and file system access:

```js
var XLSX = require("xlsx");
```

### ESM `import`

The package also ships with `xlsx.mjs`, a script compatible with the ECMAScript
module system. When using the ESM build in NodeJS, some dependencies must be
loaded manually.

#### Filesystem Operations

The `set_fs` method accepts a `fs` instance for reading and writing files using
`readFile` and `writeFile`:

```js
import * as XLSX from 'xlsx';

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);
```

#### Stream Operations

The `set_readable` method accepts a `stream.Readable` instance for use in stream
methods including [`XLSX.stream.to_csv`](/docs/api/stream):

```js
import * as XLSX from 'xlsx';

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);
```

#### Encoding Support

The `set_cptable` method accepts an instance of the SheetJS codepage library for
use in legacy file format processing. The `cpexcel.full.mjs` script must be
manually loaded. `xlsx/dist/cpexcel.full.mjs` can be imported:

```js
import * as XLSX from 'xlsx';

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);
```

#### NextJS

:::danger pass

`fs` cannot be imported from the top level in NextJS pages. This will not work:

```js
/* it is safe to import the library from the top level */
import { readFile, utils, set_fs } from 'xlsx';
/* it is not safe to import 'fs' from the top level ! */
// highlight-next-line
import * as fs from 'fs'; // this import will fail
set_fs(fs);
```

:::

For server-side file processing, `fs` should be loaded with a dynamic import
within a lifecycle function:

```js title="index.js"
/* it is safe to import the library from the top level */
import { readFile, utils, set_fs } from 'xlsx';
import { join } from 'path';
import { cwd } from 'process';

export async function getServerSideProps() {
// highlight-next-line
  set_fs(await import("fs")); // dynamically import 'fs' in `getServerSideProps`
  const wb = readFile(join(cwd(), "public", "sheetjs.xlsx"));
  // ...
}
```

The [NextJS demo](/docs/demos/static/nextjs) includes complete examples.
