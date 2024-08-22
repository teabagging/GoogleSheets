---
title: Servers and Remote Data
pagination_prev: demos/grid/index
pagination_next: demos/static/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

SheetJS libraries are commonly used in data pipelines for processing personally
identifiable information (PII).

**Libraries never attempt to make network requests and never collect telemetry.**

In practice, there are many interesting networking use cases including server
processing of user-submitted files and fetching files from an external source.

When processing data from an external source, a platform-specific operation will
obtain binary data and SheetJS libraries will process the data.

When exporting data, SheetJS libraries will generate raw data and
platform-specific operations will distribute the data.

The demos in this section cover common use cases:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>
