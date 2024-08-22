---
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
hide_table_of_contents: true
title: Installation
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

https://cdn.sheetjs.com is the primary software distribution site.  Please
read the installation instructions for your use case:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::
