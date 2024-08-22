---
title: Sheets in a Box with boxednode
sidebar_label: boxednode
pagination_prev: demos/desktop/index
pagination_next: demos/data/index
sidebar_custom_props:
  summary: NodeJS binaries with scripts, built from source
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const r = {style: {color:"red"}};
export const B = {style: {fontWeight:"bold"}};

`boxednode`[^1] is a tool for generating command-line tools that embed scripts.
It automates the process of building NodeJS from source.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses `boxednode` and SheetJS to create a standalone CLI tool for
parsing spreadsheets and converting to other formats.

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Version | NodeJS    | Date       |
|:-------------|:--------|:----------|:-----------|
| `darwin-x64` | `2.4.0` | `22.2.0`  | 2024-05-28 |
| `darwin-arm` | `2.4.3` | `22.2.0`  | 2024-05-25 |
| `win10-x64`  | `2.4.2` | `16.20.2` | 2024-04-18 |
| `linux-x64`  | `2.4.0` | `21.7.1`  | 2024-03-21 |
| `linux-arm`  | `2.4.3` | `20.13.1` | 2024-05-26 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required from scripts. `boxednode` will automatically handle packaging.

### Script Requirements

Scripts that exclusively use SheetJS libraries and NodeJS built-in modules can
be bundled using `boxednode`

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

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
npx boxednode@2.4.3 -s xlsx-cli.js -t xlsx-cli
```

:::caution pass

When this demo was last tested in `linux-arm`, the build failed with an error:

<pre>
../deps/v8/src/base/small-vector.h:  In instantiation of <span {...B}>‘class v8::base::SmallVector&lt;std::pair&lt;const v8::internal::compiler::turboshaft::PhiOp*, const v8::internal::compiler::turboshaft::OpIndex&gt;, 16&gt;’</span>:
<span {...B}>../deps/v8/src/compiler/turboshaft/loop-unrolling-reducer.h:444:11:</span>   required from here
<span {...B}>../deps/v8/src/base/macros.h:206:55:</span> <span style={{...r.style,...B.style}}>error:</span> static assertion failed: T should be trivially copyable
{"  206 |"}   static_assert(::v8::base::is_trivially_copyable&lt;T&gt;::<span style={{...r.style,...B.style}}>value</span>, \\
{"      |"}                                                       ^~~~~
</pre>

This affects NodeJS `22.2.0`, but does not affect `20.13.1`. It affects the
[V8 JavaScript Engine](/docs/demos/engines/v8#build-v8).

The `-n` flag controls the target NodeJS version. For this demo, the following
command uses NodeJS `20.13.1`:

```bash
npx boxednode@2.4.3 -s xlsx-cli.js -t xlsx-cli -n 20.13.1
```

:::

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
npx boxednode@2.4.3 -s xlsx-cli.js -t xlsx-cli.exe -n 16.20.2
```

:::info pass

The Windows 10 build requires Visual Studio with "Desktop development with C++"
workload, Python 3.11, and NASM[^2].

**The build command must be run in "x64 Native Tools Command Prompt"**

:::

:::caution pass

When the demo was last tested, the build failed:

```
Not an executable Python program
Could not find Python.
```

By default, Windows aliases `python` to a Microsoft Store installer. If the
official installer was used, the alias should be disabled manually:

1) Open Start menu and type "app alias". Click "Manage app execution aliases".

2) Disable the App Installer for all items with `python` in the name.

Using Python 3.12, the build fails with an error:

```
Please use python3.11 or python3.10 or python3.9 or python3.8 or python3.7 or python3.6.
```

In the most recent test, Python 3.11.8 was installed from the official site.

:::

:::caution pass

When the demo was last tested on Windows, the build failed:

```
error MSB8020: The build tools for Visual Studio 2019 (Platform Toolset = 'v142') cannot be found. To build using the v142 build tools, please install Visual Studio 2019 build tools.
```

This error was fixed by installing the `v142` build tools through the Visual
Studio installer.

:::

:::caution pass

In the most recent Windows test against NodeJS `20.8.0`, the build failed due
to an issue in the OpenSSL dependency:

```
...\node-v20.8.0\deps\openssl\openssl\crypto\cversion.c(75,33): error C2153: integer literals must have at least one digit [...\node-v20.8.0\deps\openssl\openssl.vcxproj]
```

SheetJS libraries are compatible with NodeJS versions dating back to `v0.8`. The
workaround is to select NodeJS `v16.20.2` using the `-n` flag. This version was
was chosen since NodeJS `v18` upgraded the OpenSSL dependency.

:::

  </TabItem>
</Tabs>

4) Run the generated program, passing `pres.numbers` as the argument:

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

[^1]: The project does not have a website. The [source repository](https://github.com/mongodb-js/boxednode) is publicly available.
[^2]: Downloads can be found [at the main NASM project website](https://www.nasm.us/)
