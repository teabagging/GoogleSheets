---
title: Sheets on the Command Line
sidebar_label: Command-Line Tools
hide_table_of_contents: true
pagination_prev: demos/desktop/index
pagination_next: demos/data/index
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';
import FrameworkData from '/data/cli.js'

export const r = {style: {color:"red"}};
export const B = {style: {fontWeight:"bold"}};

With the availability of JS engines and the success of server-side platforms,
it is possible to build standalone command-line tools from JavaScript code.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo covers a number of strategies for building standalone spreadsheet
processors. The ultimate goal is to use SheetJS libraries to generate CSV output
from arbitrary spreadsheet files. The generated command-line tool will accept an
argument, parse the specified workbook, and print CSV rows to the terminal.

```bash title="Sample terminal session"
> xlsx-cli.exe pres.numbers
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46
```

Demos for common standalone CLI tools are included in separate pages:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

#### Platform Support

The following frameworks have been tested on the following platforms:

<FrameworkData/>

:::tip pass

The [`xlsx-cli`](https://cdn.sheetjs.com/xlsx-cli/) NodeJS script is available
as a package on the SheetJS CDN. It is a straightforward command-line tool for
translating files between supported spreadsheet file formats.

:::

:::caution pass

For most common deployment scenarios, it is possible to install a server-side
platform such as [NodeJS](/docs/getting-started/installation/nodejs).

**It is strongly recommended to use a dedicated platform when possible.**

The standalone programs generated in this demo are useful when a dedicated
server-side scripting platform cannot be installed on the target computer.

:::

#### NodeJS

This demo has been organized by framework:

- [`boxednode`](/docs/demos/cli/boxednode)
- [`nexe`](/docs/demos/cli/nexe)
- [`pkg`](/docs/demos/cli/pkg)

#### V8

**[The exposition has been moved to the "V8" demo.](/docs/demos/engines/v8#snapshots)**

#### BunJS

**[The exposition has been moved to a separate page.](/docs/demos/cli/bunsea)**

#### Deno

**[The exposition has been moved to a separate page.](/docs/demos/cli/denosea)**

#### Dedicated Engines

The following demos for JS engines produce standalone programs:

- [V8](/docs/demos/engines/v8)
- [Duktape](/docs/demos/engines/duktape)
- [ChakraCore](/docs/demos/engines/chakra)
- [QuickJS](/docs/demos/engines/quickjs)
- [Goja](/docs/demos/engines/goja)
- [JavaScriptCore](/docs/demos/engines/jsc)
