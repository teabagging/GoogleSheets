---
title: Packing Sheets with pkg
sidebar_label: pkg
pagination_prev: demos/desktop/index
pagination_next: demos/data/index
sidebar_custom_props:
  summary: Prebuilt NodeJS packages
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const r = {style: {color:"red"}};
export const B = {style: {fontWeight:"bold"}};

`pkg`[^1] is a tool for generating command-line tools that embed scripts.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses `pkg` and SheetJS to create a standalone CLI tool for parsing
spreadsheets and converting to other formats.

:::caution pass

With the official release of [NodeJS SEA](/docs/demos/cli/nodesea), Vercel opted
to deprecate `pkg`. It is still useful for deploying apps embedding NodeJS v18
or earlier since those versions do not support NodeJS SEA.

:::

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Version | NodeJS   | Date       |
|:-------------|:--------|:---------|:-----------|
| `darwin-x64` | `5.8.1` | `18.5.0` | 2024-05-28 |
| `darwin-arm` | `5.8.1` | `18.5.0` | 2024-05-25 |
| `win10-x64`  | `5.8.1` | `18.5.0` | 2024-04-18 |
| `win11-arm`  | `5.8.1` | `18.5.0` | 2024-05-28 |
| `linux-x64`  | `5.8.1` | `18.5.0` | 2024-03-21 |
| `linux-arm`  | `5.8.1` | `18.5.0` | 2024-05-26 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required from scripts. `pkg` will automatically handle packaging.

### Script Requirements

Scripts that exclusively use SheetJS libraries and NodeJS built-in modules can
be bundled using `pkg`.

The demo script [`xlsx-cli.js`](pathname:///cli/xlsx-cli.js) runs in NodeJS. It
is a simple command-line tool for reading and writing spreadsheets.

### Limitations

:::danger pass

When this demo was last tested, `pkg` failed with an error referencing `node20`:

```
> Targets not specified. Assuming:
  node20-linux-arm64, node20-macos-arm64, node20-win-arm64
> Error! No available node version satisfies 'node20'
```

**`pkg` does not support NodeJS 20 or 22!**

The local NodeJS version must be rolled back to version 18.

If `nvm` or `nvm-windows` was used to install NodeJS:

```bash
nvm install 18
nvm use 18
```

Otherwise, on macOS and Linux, `n` can manage the global installation:

```bash
sudo npm i -g n
sudo n 18
```

On Windows, it is recommended to use a prebuilt installer[^2]

:::


## Complete Example

0) Downgrade NodeJS to major version 18 or earlier.

1) Download the test file https://docs.sheetjs.com/pres.numbers:

```bash
curl -o pres.numbers https://docs.sheetjs.com/pres.numbers
```

2) Download [`xlsx-cli.js`](pathname:///cli/xlsx-cli.js)

```bash
curl -o xlsx-cli.js https://docs.sheetjs.com/cli/xlsx-cli.js
```

3) Install the dependencies:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz exit-on-epipe commander@2`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm install --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz exit-on-epipe commander@2`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn add https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz exit-on-epipe commander@2`}
</CodeBlock>
  </TabItem>
</Tabs>

4) Create the standalone program:

```bash
npx pkg xlsx-cli.js
```

This generates `xlsx-cli-linux`, `xlsx-cli-macos`, and `xlsx-cli-win.exe` .

5) Run the generated program, passing `pres.numbers` as the argument:

<Tabs groupId="os">
  <TabItem value="linux" label="Linux">

```bash
./xlsx-cli-linux pres.numbers
```

  </TabItem>
  <TabItem value="macos" label="macOS">

```bash
./xlsx-cli-macos pres.numbers
```

  </TabItem>
  <TabItem value="win" label="Windows">

```powershell
.\xlsx-cli-win.exe pres.numbers
```

  </TabItem>
</Tabs>


[^1]: The project does not have a website. The [source repository](https://github.com/vercel/pkg) is publicly available.
[^2]: The NodeJS website hosts [prebuilt installers](https://nodejs.org/en/download/prebuilt-installer).