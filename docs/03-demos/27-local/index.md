---
title: Local Data
pagination_prev: demos/data/index
pagination_next: demos/cloud/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

There is no standard cross-platform approach to read and write files and data.
The `readFile`[^1] and `writeFile`[^2] methods rely on platform-specific APIs to
perform the file read and write operations.

Many platforms do not support the techniques used by `readFile` and `writeFile`
but offer other methods. Typically those methods process `Uint8Array` objects or
binary strings and play nice with the `read`[^3] and `write`[^4] methods.

Demos in this section cover common local APIs:

<ul>
{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}
</ul>

The [desktop](/docs/demos/desktop/) and [mobile](/docs/demos/mobile/) demos
cover APIs for iOS, Android, Windows, macOS and Linux applications.

[^1]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^3]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^4]: See [`write` in "Writing Files"](/docs/api/write-options)