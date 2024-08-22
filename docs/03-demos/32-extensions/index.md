---
title: Extensions
pagination_prev: demos/cloud/index
pagination_next: demos/bigdata/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

JavaScript is a popular language for writing app extensions. Some applications
embed the same [JavaScript engines](/docs/demos/engines) used in browsers. Other
applications embed purpose-built engines that only support ES3 JavaScript.

With conservative use of modern language features, SheetJS can be used in many
app extensions to enable complex data import and export workflows.

Demos for common applications are included in separate pages:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>
