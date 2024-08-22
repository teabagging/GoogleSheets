---
title: Deno SEA
pagination_prev: demos/desktop/index
pagination_next: demos/data/index
sidebar_custom_props:
  summary: Deno Standalone Binaries
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Deno](https://docs.deno.com/runtime/manual/tools/compiler) is a JavaScript
runtime with support for compiling scripts into self-contained executables.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses the Deno compiler and SheetJS to create a standalone CLI tool for
parsing spreadsheets and generating CSV rows.

:::info pass

It is strongly recommended to install Deno on systems using SheetJS libraries in
command-line tools. This workaround should only be considered if a standalone
binary is considered desirable.

:::

:::caution Deno support is considered experimental.

Great open source software grows with user tests and reports. Any issues should
be reported to the Deno project for further diagnosis.

:::

## Integration Details

The [SheetJS Deno module](/docs/getting-started/installation/deno) can be
imported from Deno scripts.

`deno compile` generates a standalone executable that includes the entire JS
runtime as well as user JS code.

### Script Requirements

Scripts that exclusively use SheetJS libraries and Deno built-in modules can be
bundled using `deno compile`. The ESM script should be imported directly:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';`}
</CodeBlock>

For example, the following script accepts one command line argument, parses the
specified file using the SheetJS `readFile` method[^1], generates CSV text from
the first worksheet using `sheet_to_csv`[^2], and prints to terminal:

<CodeBlock language="ts" title="sheet2csv.ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
import * as cptable from 'https://cdn.sheetjs.com/xlsx-${current}/package/dist/cpexcel.full.mjs';
XLSX.set_cptable(cptable);
\n\
/* Deno.args[0] is the first argument to the script */
const filename = Deno.args[0];
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

### Deno Permissions

The same permissions that apply to normal Deno scripts apply to the compiler:

- The `--allow-read` option must be specified to allow the program to read files
  from the filesystem with the SheetJS `readFile` [^3] method.

- The `--allow-write` option must be specified to allow the program to write
  files to the filesystem with the SheetJS `writeFile` [^4] method.

- The `--allow-net` option must be specified to allow the program to download
  and upload spreadsheets.

More flags can be found in the official permissions list[^5]


## Complete Example

:::note Tested Deployments

This demo was last tested in the following deployments:

| Architecture | Deno     | Date       |
|:-------------|:---------|:-----------|
| `darwin-x64` | `1.43.6` | 2024-05-28 |
| `darwin-arm` | `1.43.6` | 2024-05-23 |
| `win10-x64`  | `1.41.3` | 2024-03-24 |
| `win11-x64`  | `1.43.6` | 2024-05-25 |
| `win11-arm`  | `1.43.6` | 2024-05-25 |
| `linux-x64`  | `1.41.3` | 2024-03-18 |
| `linux-arm`  | `1.43.6` | 2024-05-25 |

:::

0) Install Deno.[^6]

1) Download the test file https://docs.sheetjs.com/pres.numbers:

```bash
curl -o pres.numbers https://docs.sheetjs.com/pres.numbers
```

2) Test the script with `deno run`:

```bash
deno run -r --allow-read https://docs.sheetjs.com/cli/sheet2csv.ts pres.numbers
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

3) Compile and run `sheet2csv`:

```bash
deno compile -r --allow-read https://docs.sheetjs.com/cli/sheet2csv.ts
./sheet2csv pres.numbers
```

The program should display the same CSV contents as the script (from step 2)

[^1]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^3]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^4]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^5]: See ["Permissions list"](https://docs.deno.com/runtime/manual/basics/permissions#permissions-list) in the official Deno documentation
[^6]: [The official instructions](https://docs.deno.com/runtime/manual/getting_started/installation) cover most platforms. Deno does not provide official Linux ARM64 builds, but [there are unofficial community builds](https://github.com/LukeChannings/deno-arm64).