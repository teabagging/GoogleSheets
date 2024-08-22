---
title: Big Data
pagination_prev: demos/extensions/index
pagination_next: demos/engines/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

SheetJS demonstrated the value of processing large datasets in the web browser
and other JavaScript environments. SheetJS libraries have pushed the limits of
data processing in the web browser, and some innovations and discoveries have
been integrated into the ReactJS framework and other foundational JS libraries.

JS Engines have improved over the years, but there are some hard limits to
browser support using traditional methods of data processing. Vendors have
introduced APIs and techniques for representing and processing very large binary
and textual files.

Since many of the techniques only work in a few engines, they are not embedded
in the library. They are recommended only when traditional approaches falter.

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? ({
    listStyleImage: `url("${item.customProps.icon}")`
  }) : ({});
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>
    <span>{item.customProps?.summary && (" - " + item.customProps.summary)}</span>
  </li>);
})}</ul>
