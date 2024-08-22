---
title: NodeJS CLI Tool
hide_table_of_contents: true
---

The SheetJS `xlsx-cli` NodeJS command-line tool converts data between common
formats. By default it displays data in CSV rows. The tool can read from and
write to any [supported file format](/docs/miscellany/formats).

The package is hosted on the [SheetJS CDN](https://cdn.sheetjs.com/xlsx-cli/).

## Usage

The package can be invoked with any standard package script runner.

### NodeJS

The package runner for `npm` is `npx`. The help command can be displayed with:

```bash
npx -p xlsx@https://cdn.sheetjs.com/xlsx-cli/xlsx-cli-1.1.4.tgz xlsx --help
```

### BunJS

Bun ships with the `bunx` test runner. The help message can be displayed with:

```bash
bunx -p xlsx@https://cdn.sheetjs.com/xlsx-cli/xlsx-cli-1.1.4.tgz --help
```

## Source Code

Source code and project documentation are hosted on the SheetJS git server at
https://git.sheetjs.com/sheetjs/sheetjs/src/branch/master/packages/xlsx-cli
