---
title: NodeJS SEA
pagination_prev: demos/desktop/index
pagination_next: demos/data/index
sidebar_custom_props:
  summary: Single Executable Applications
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

NodeJS "Single Executable Applications"[^1] are standalone CLI tools that embed
bundled scripts in a special standalone copy of the NodeJS binary.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses NodeJS SEA and SheetJS to create a standalone CLI tool for
parsing spreadsheets and generating CSV rows.

:::info pass

It is strongly recommended to install NodeJS on systems using SheetJS libraries
in command-line tools. This workaround should only be considered if a standalone
binary is considered desirable.

:::

:::caution NodeJS SEA support is considered experimental.

Great open source software grows with user tests and reports. Any issues should
be reported to the NodeJS single-executable project for further diagnosis.

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required from NodeJS SEA base scripts.

:::info pass

**NodeJS SEA does not support ECMAScript Modules!**

A CommonJS script is conveniently included in the SheetJS NodeJS module package.

:::

At a high level, single-executable applications are constructed in four steps:

1) Pre-process an existing NodeJS script, creating a SEA bundle.

2) Copy the NodeJS binary and remove any signatures.

3) Inject the SEA bundle into the unsigned NodeJS binary.

4) Re-sign the binary.

:::note pass

macOS and Windows enforce digital signatures. Both operating systems will warn
users if a signed program is modified.

Existing signatures should be removed *before* injecting the SEA bundle. After
injecting the SEA bundle, the binary should be resigned.

:::

### Script Requirements

Scripts that exclusively use SheetJS libraries and NodeJS built-in modules can
be bundled using NodeJS SEA. Due to limitations in the SEA bundler, a special
`require` function must be created manually:

```js
const { createRequire } = require('node:module');
require = createRequire(__filename);
const { readFile, utils } = require("xlsx");
```

For example, the following script accepts one command line argument, parses the
specified file using the SheetJS `readFile` method[^2], generates CSV text from
the first worksheet using `sheet_to_csv`[^3], and prints to terminal:

```js title="sheet2csv.js"
// For NodeJS SEA, the CommonJS `require` must be used
const { createRequire } = require('node:module');
require = createRequire(__filename);
const { readFile, utils } = require("xlsx");

// argv[2] is the first argument to the script
const filename = process.argv[2];

// read file
const wb = readFile(filename);

// generate CSV of first sheet
const ws = wb.Sheets[wb.SheetNames[0]];
const csv = utils.sheet_to_csv(ws);

// print to terminal
console.log(csv);
```

### SEA Bundles

SEA Bundles are blobs that represent the script and supporting libraries.

#### Configuration

SEA configuration is specified using a special JSON file. Assuming no special
assets are bundled with the script, there are two relevant fields:

- `main` is a relative path to the entry script.
- `output` is a relative path to the output file (typically ending in `.blob`)

For example, the following configuration specifies `sheet2csv.js` as the entry
script and `sheet2csv.blob` as the output blob:

```js title="sheet2csv.json"
{
  "main": "sheet2csv.js",
  "output": "sheet2csv.blob"
}
```

#### Construction

The main `node` program, with the command-line flag `--experimental-sea-config`,
will generate a SEA bundle:

```bash
node --experimental-sea-config sheet2csv.json
```

The bundle will be written to the file specified in the `output` field of the
SEA configuration file.

#### Injection

A special `postject` utility is used to add the SEA bundle to the NodeJS binary.
The specific command depends on the operating system.

On macOS, assuming the copy of the NodeJS binary is named `sheet2csv` and the
SEA bundle is named `sheet2csv.blob`, the following command injects the bundle:

```bash
npx -y postject --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA sheet2csv NODE_SEA_BLOB sheet2csv.blob
```

## Complete Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | NodeJS    | Date       |
|:-------------|:----------|:-----------|
| `darwin-x64` | `22.2.0`  | 2024-05-28 |
| `darwin-arm` | `22.2.0`  | 2024-05-29 |
| `win10-x64`  | `20.12.0` | 2024-03-26 |
| `win11-x64`  | `20.13.1` | 2024-05-22 |
| `win11-arm`  | `20.14.0` | 2024-06-11 |
| `linux-x64`  | `20.11.1` | 2024-03-18 |
| `linux-arm`  | `20.14.0` | 2024-06-10 |

:::

:::caution pass

NodeJS on Windows on ARM uses the X64 compatibility layer. It does not generate
a native ARM64 binary!

:::

0) Ensure NodeJS version 20 or later is installed.

:::note pass

To display the current version, run the following command:

```bash
node --version
```

The major version number starts after the `v` and ends before the first `.`

If the version number is 19 or earlier, upgrade NodeJS before proceeding.

:::

### Project Setup

1) Create a new project folder:

```bash
mkdir sheetjs-sea
cd sheetjs-sea
npm init -y
```

2) Save the [contents of the `sheet2csv.js` code block](#script-requirements)
to `sheet2csv.js` in the project folder.

3) Install the SheetJS dependency:

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

### Script Test

:::caution pass

Before building the standalone app, the base script should be tested using the
local NodeJS platform.

:::

4) Download the test file https://docs.sheetjs.com/pres.numbers:

```bash
curl -o pres.numbers https://docs.sheetjs.com/pres.numbers
```

5) Run the script and pass `pres.numbers` as the first argument:

```bash
node sheet2csv.js pres.numbers
```

The script should display CSV contents from the first sheet:

```text title="Expected Output"
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46
```

### SEA Bundle

6) Save the [contents of the `sheet2csv.json` code block](#configuration) to
`sheet2csv.json` in the project folder.

7) Generate the SEA bundle:

```bash
node --experimental-sea-config sheet2csv.json
```

### SEA Injection

8) Create a local copy of the NodeJS binary:

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="MacOS">

```bash
cp `which node` sheet2csv
```

9) Remove the code signature.

```bash
codesign --remove-signature ./sheet2csv
```

  </TabItem>
  <TabItem value="win10-x64" label="Windows">

In PowerShell, the `Get-Command` command displays the location to `node.exe`:

```powershell
PS C:\sheetjs-sea> get-command node

CommandType     Name                                               Version    Source
-----------     ----                                               -------    ------
Application     node.exe                                           20.12.0.0  C:\Program Files\nodejs\node.exe

```

Copy the program (listed in the "Source" column) to `sheet2csv.exe`:

```powershell
copy "C:\Program Files\nodejs\node.exe" sheet2csv.exe
```

9) Remove the code signature.

```powershell
signtool remove /s .\sheet2csv.exe
```

:::info pass

`signtool` is included in the Windows SDK[^4].

:::

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

```bash
cp `which node` sheet2csv
```

9) Observe that many Linux distributions do not enforce code signatures.

  </TabItem>
</Tabs>

10) Inject the SEA bundle.

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="MacOS">

```bash
npx -y postject --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA sheet2csv NODE_SEA_BLOB sheet2csv.blob
```

11) Resign the binary. The following command performs macOS ad-hoc signing:

```bash
codesign -s - ./sheet2csv
```

  </TabItem>
  <TabItem value="win10-x64" label="Windows">

```bash
npx -y postject --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 sheet2csv.exe NODE_SEA_BLOB sheet2csv.blob
```

11) Resign the binary.

The following sequence generates a self-signed certificate:

```powershell
$cert = New-SelfSignedCertificate -Type CodeSigning -DnsName www.onlyspans.net -CertStoreLocation Cert:\CurrentUser\My
$pass = ConvertTo-SecureString -String "hunter2" -Force -AsPlainText
Export-PfxCertificate -Cert "cert:\CurrentUser\My\$($cert.Thumbprint)" -FilePath "mycert.pfx" -Password $pass
```

After creating a cert, sign the binary:

```powershell
signtool sign /v /f mycert.pfx /p hunter2 /fd SHA256 sheet2csv.exe
```

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

```bash
npx -y postject --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 sheet2csv NODE_SEA_BLOB sheet2csv.blob
```

11) Observe that many Linux distributions do not enforce code signatures.

  </TabItem>
</Tabs>


### Standalone Test

12) Run the command and pass `pres.numbers` as the first argument:

```bash
./sheet2csv pres.numbers
```

The program should display the same CSV contents as the script (from step 5)

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="MacOS">

13) Validate the binary signature:

```bash
codesign -dv ./sheet2csv
```

Inspecting the output, the following line confirms ad-hoc signing was used:

```
Signature=adhoc
```

  </TabItem>
  <TabItem value="win10-x64" label="Windows">

13) Validate the binary signature:

```powershell
signtool verify sheet2csv.exe
```

If the certificate is self-signed, there may be an error:

```
SignTool Error: A certificate chain processed, but terminated in a root
        certificate which is not trusted by the trust provider.
```

This error is expected.

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

13) Observe that many Linux distributions do not enforce code signatures.

  </TabItem>
</Tabs>

[^1]: See ["Single Executable Applications"](https://nodejs.org/api/single-executable-applications.html) in the NodeJS documentation.
[^2]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^4]: See [Windows SDK](https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/) in the Windows Dev Center documentation.
