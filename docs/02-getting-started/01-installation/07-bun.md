---
title: Bun
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
sidebar_position: 7
sidebar_custom_props:
  summary: Load NodeJS-style modules using CommonJS or ESM
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Package tarballs are available on https://cdn.sheetjs.com.

<p><a href={"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}</a> is the URL for version {current}</p>

:::caution Bun support is considered experimental.

Great open source software grows with user tests and reports. Any issues should
be reported to the Bun project for further diagnosis.

:::

## Installation

Tarballs can be directly installed with `bun install`:

<CodeBlock language="bash">{`\
bun rm xlsx
bun install https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::

### Vendoring

For general stability, "vendoring" modules is the recommended approach:

0) Remove any existing dependency on a project named `xlsx`:

```bash
bun rm xlsx
```

<ol start="1"><li><p>Download the tarball (<code parentName="pre">xlsx-{current}.tgz</code>) for the desired version. The current version is available at <a href={"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/xlsx-" + current + ".tgz"}</a></p></li></ol>

2) Create a `vendor` subfolder at the root of your project and move the tarball
   to that folder.  Add it to your project repository.

3) Install the tarball:

<CodeBlock language="bash">{`\
bun install file:vendor/xlsx-${current}.tgz`}
</CodeBlock>

The package will be installed and accessible as `xlsx`.

## Usage

The package supports CommonJS `require` and ESM `import` module systems.

:::info pass

**It is strongly recommended to use CommonJS in Bun.**

:::

### CommonJS `require`

By default, the module supports `require` and it will automatically add support
for encodings, streams and file system access:

```js
const { readFile } = require("xlsx");
const wb = readFile("pres.numbers"); // works!
```

:::caution pass

In the BunJS REPL, `require` incorrectly loads the ESM build.

:::

### ESM `import`

When importing the library using ESM `import` statements, the native NodeJS
modules are not loaded. They must be added manually:

```js
import * as XLSX from 'xlsx';

/* load 'fs' for readFile and writeFile support */
import * as fs from 'fs';
XLSX.set_fs(fs);

/* load 'stream' for stream support */
import { Readable } from 'stream';
XLSX.stream.set_readable(Readable);

/* load the codepage support library for extended support with older formats  */
import * as cpexcel from 'xlsx/dist/cpexcel.full.mjs';
XLSX.set_cptable(cpexcel);
```

## Bundling

For server-side scripts, `bun build` can pre-optimize dependencies. The Bun
builder requires a proper `package.json` that includes the SheetJS dependency.

:::note Tested Deployments

This demo was last tested in the following deployments:

| Architecture | BunJS    | Date       |
|:-------------|:---------|:-----------|
| `darwin-x64` | `1.1.4`  | 2024-04-19 |
| `win10-x64`  | `1.1.4`  | 2024-04-19 |
| `win11-x64`  | `1.1.22` | 2024-08-11 |
| `linux-x64`  | `1.1.4`  | 2024-04-25 |

:::

0) Create a new project:

```bash
mkdir sheetjs-bun-dle
cd sheetjs-bun-dle
echo "{}" > package.json
```

:::caution pass

The PowerShell file redirect will use the `UTF-16 LE` encoding. Bun does not
support the encoding and will fail to install the package:

```
bun add v1.1.22-canary.96 (df33f2b2)
1 | ��{}

    ^
error: Unexpected ��
```

The file must be resaved in UTF8 (without BOM) or ASCII.

0) Open `package.json` in VSCodium.

The current encoding is displayed in the lower-right corner:

![VSCodium status bar](pathname:///files/encodium.png)

1) Click the displayed encoding.

2) In the "Select Action" popup, select "Save with Encoding"

3) In the new list, select `UTF-8  utf8`:

![VSCodium encoding](pathname:///files/vscutf8.png)

VSCodium will automatically re-save the file.

:::

1) Install the SheetJS package tarball:

<CodeBlock language="bash">{`\
bun install https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

2) Save the following script to `SheetJSBun.js`:

```js title="SheetJSBun.js"
// highlight-next-line
import * as XLSX from 'xlsx';
// highlight-next-line
import * as fs from 'fs';
// highlight-next-line
XLSX.set_fs(fs);

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
const worksheet = XLSX.utils.json_to_sheet(rows);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

/* fix headers */
XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Birthday"]], { origin: "A1" });

/* calculate column width */
const max_width = rows.reduce((w, r) => Math.max(w, r.name.length), 10);
worksheet["!cols"] = [ { wch: max_width } ];

/* create an XLSX file and try to save to Presidents.xlsx */
XLSX.writeFile(workbook, "Presidents.xlsx");
```

3) Bundle the script with `bun build`:

```bash
bun build --target=bun SheetJSBun.js --outfile=app.js
```

This procedure will generate `app.js`.

4) Remove the module artifacts and original script:

```bash
rm package.json bun.lockb SheetJSBun.js
rm -rf ./node_modules
```

:::note pass

PowerShell does not support `rm -rf`. Instead, each file must be removed:

```powershell title="Windows Powershell commands"
rm package.json
rm bun.lockb
rm SheetJSBun.js
rm .\\node_modules -r -fo
```

:::

At this point, `app.js` will be the only file in the project folder.

5) Run the script:

```bash
bun app.js
```

If the script succeeded, the file `Presidents.xlsx` will be created. That file
can be opened in a spreadsheet editor.
