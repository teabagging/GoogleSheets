---
title: BunJS SEA
pagination_prev: demos/desktop/index
pagination_next: demos/data/index
sidebar_custom_props:
  summary: BunJS Single-file Executables
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[BunJS](https://bun.sh/docs/bundler/executables) is a JavaScript runtime with
support for compiling scripts into self-contained executables.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses the Bun compiler and SheetJS to create a standalone CLI tool for
parsing spreadsheets and generating CSV rows.

:::info pass

It is strongly recommended to install BunJS on systems using SheetJS libraries
in command-line tools. This workaround should only be considered if a standalone
binary is considered desirable.

:::

:::caution BunJS support is considered experimental.

Great open source software grows with user tests and reports. Any issues should
be reported to the BunJS project for further diagnosis.

:::

## Integration Details

The [SheetJS BunJS module](/docs/getting-started/installation/bun) can be
imported from BunJS scripts.

`bun build --compile` generates a standalone executable that includes the BunJS
runtime, user JS code and supporting scripts and assets

### Script Requirements

Scripts that exclusively use SheetJS libraries and BunJS built-in modules can be
bundled using BunJS. The module should be required directly:

<CodeBlock language="ts">{`\
const XLSX = require("xlsx");`}
</CodeBlock>

For example, the following script accepts one command line argument, parses the
specified file using the SheetJS `readFile` method[^1], generates CSV text from
the first worksheet using `sheet_to_csv`[^2], and prints to terminal:

<CodeBlock language="ts" title="sheet2csv.ts">{`\
const XLSX = require("xlsx");
\n\
/* process.argv[2] is the first argument to the script */
const filename = process.argv[2];
\n\
/* read file */
const wb = XLSX.readFile(filename);
\n\
/* generate CSV of first sheet */
const ws = wb.Sheets[wb.SheetNames[0]];
const csv = XLSX.utils.sheet_to_csv(ws);
\n\
/* print to terminal */
console.log(csv);`}
</CodeBlock>

## Complete Example

:::note Tested Deployments

This demo was last tested in the following deployments:

| Architecture | BunJS    | Date       |
|:-------------|:---------|:-----------|
| `darwin-x64` | `1.1.10` | 2024-05-28 |
| `darwin-arm` | `1.1.10` | 2024-05-29 |
| `win10-x64`  | `1.1.12` | 2024-06-10 |
| `linux-x64`  | `1.1.12` | 2024-06-09 |
| `linux-arm`  | `1.1.12` | 2024-06-10 |

:::

0) Install or update BunJS.[^3]

1) Download the test file https://docs.sheetjs.com/pres.numbers:

```bash
curl -o pres.numbers https://docs.sheetjs.com/pres.numbers
```

2) Save the [contents of the `sheet2csv.ts` code block](#script-requirements)
to `sheet2csv.ts` in the project folder.

3) Install the SheetJS dependency:

<CodeBlock language="bash">{`\
bun install https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

:::caution pass

On Windows, the command failed with a `ENOTEMPTY` error:

```
error: InstallFailed extracting tarball for https://cdn.sheetjs.com/xlsx-0.20.1/xlsx-0.20.1.tgz
error: moving "https://cdn.sheetjs.com/xlsx-0.20.1/xlsx-0.20.1.tgz" to cache dir failed
ENOTEMPTY: Directory not empty (NtSetInformationFile())
```

The workaround is to prepend `xlsx@` to the URL:

<CodeBlock language="bash">{`\
bun install xlsx@https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

:::

4) Test the script with `bun run`:

```bash
bun run sheet2csv.ts pres.numbers
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

5) Compile and run `sheet2csv`:

```bash
bun build ./sheet2csv.ts --compile --outfile sheet2csv
./sheet2csv pres.numbers
```

The program should display the same CSV contents as the script (from step 2)

[^1]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^3]: See ["Installation"](https://bun.sh/docs/installation) in the BunJS documentation for instructions.