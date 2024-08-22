---
title: Getting Started
hide_table_of_contents: true
pagination_next: getting-started/installation/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

["Export Tutorial"](/docs/getting-started/examples/export) is a live example
that covers general data munging and data export to spreadsheets.

["Import Tutorial"](/docs/getting-started/examples/import) is a live example
that covers data import from spreadsheets and data processing.

["Demos"](/docs/demos) include discussions and tested examples for common
deployments and use cases.

## Installation

https://cdn.sheetjs.com is the primary software distribution site.  Please read
the installation instructions for your use case:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  if(item.label != "Installation") return "";
  return item.items.map((item, index) => {
    const listyle = (item.customProps?.icon) ? {
      listStyleImage: `url("${item.customProps.icon}")`
    } : {};
    return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
      <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
    </li>);
  });
})}</ul>

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::
