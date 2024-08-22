---
title: Miscellany
pagination_next: constellation/index
---

import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

<ul>{useCurrentSidebarCategory().items.map(globalThis.lambda = (item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
    <ul>{item.items && item.items.map(lambda)}</ul>
  </li>);
})}</ul>