---
title: Spreadsheet Tools with Nexe
sidebar_label: nexe
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

`nexe`[^1] is a tool for generating command-line tools that embed scripts.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses `nexe` and SheetJS to create a standalone CLI tool for parsing
spreadsheets and converting to other formats.

:::info pass

The latest prebuilt package matches NodeJS version `14.15.3`.

`nexe` can build the required packages for newer NodeJS versions.

:::

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Version      | NodeJS    | Source    | Date       |
|:-------------|:-------------|:----------|:----------|:-----------|
| `darwin-x64` | `4.0.0-rc.6` | `14.15.3` | Pre-built | 2024-05-28 |
| `darwin-arm` | `4.0.0-rc.6` | `18.20.3` | Compiled  | 2024-05-25 |
| `win10-x64`  | `4.0.0-rc.4` | `14.15.3` | Pre-built | 2024-04-18 |
| `win11-arm`  | `4.0.0-rc.6` | `20.10.0` | Compiled  | 2024-05-28 |
| `linux-x64`  | `4.0.0-rc.4` | `14.15.3` | Pre-built | 2024-03-21 |
| `linux-arm`  | `4.0.0-rc.6` | `18.20.3` | Compiled  | 2024-05-26 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required from scripts. `nexe` will automatically handle packaging.

### Script Requirements

Scripts that exclusively use SheetJS libraries and NodeJS built-in modules can
be bundled using `nexe`.

The demo script [`xlsx-cli.js`](pathname:///cli/xlsx-cli.js) runs in NodeJS. It
is a simple command-line tool for reading and writing spreadsheets.

## Complete Example

0) Download the test file https://docs.sheetjs.com/pres.numbers:

```bash
curl -o pres.numbers https://docs.sheetjs.com/pres.numbers
```

1) Download [`xlsx-cli.js`](pathname:///cli/xlsx-cli.js)

```bash
curl -o xlsx-cli.js https://docs.sheetjs.com/cli/xlsx-cli.js
```

2) Install the dependencies:

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

3) Create the standalone program:

```bash
npx nexe -t 14.15.3 xlsx-cli.js
```

<details open>
  <summary><b>Building from source (click to hide)</b></summary>

When the demo was tested on ARM targets, the Nexe pre-built packages were
missing. For unsupported NodeJS versions, packages must be built from source:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
npx nexe xlsx-cli.js --build --python=$(which python3) --make="-j8"
```

  </TabItem>
  <TabItem value="win" label="Windows">

On Windows x64, the `--build` flag suffices:

```bash
npx nexe xlsx-cli.js --build --make="-j8"
```

On Windows ARM, the target `windows-arm64-20.10.0` must be specified:

```bash
npx nexe xlsx-cli.js --build --make="-j8" --target=windows-arm64-20.10.0
```

**`vcbuild.bat` issues**

The Windows ARM build may fail with a `vcbuild.bat` error:

```
Error: vcbuild.bat nosign release arm64 exited with code: 1
```

Pass the `-v` flag for more details. In the most recent test, the error stemmed
from a Python version mismatch:

```
Node.js configure: found Python 2.7.18
Please use python3.11 or python3.10 or python3.9 or python3.8 or python3.7 or python3.6
```

The resolved version of Python can be found with

```cmd
where python
```

In the most recent test, a Python 2 version appeared first. This was fixed by
finding the Python 3 location and prepending it to `PATH`:

```cmd
set PATH="C:\correct\path\to\python\three";%PATH%
```

  </TabItem>
</Tabs>

</details>

This generates `xlsx-cli` or `xlsx-cli.exe` depending on platform.

5) Run the generated program, passing `pres.numbers` as the argument:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
./xlsx-cli pres.numbers
```

  </TabItem>
  <TabItem value="win" label="Windows">

```powershell
.\xlsx-cli.exe pres.numbers
```

  </TabItem>
</Tabs>


[^1]: The project does not have a website. The [source repository](https://github.com/nexe/nexe) is publicly available.
[^2]: The NodeJS website hosts [prebuilt installers](https://nodejs.org/en/download/prebuilt-installer).