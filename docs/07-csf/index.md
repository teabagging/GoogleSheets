---
pagination_next: api/index
hide_table_of_contents: true
title: Common Spreadsheet Format
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

The "Common Spreadsheet Format" is the object model used by SheetJS. The library
[includes a number of API functions](/docs/api) for common operations, but some
features are only accessible by inspecting and modifying the objects directly.

This section covers the JS representation of workbooks, worksheets, cells,
ranges, addresses and other features.

:::info Historical Context

[Web Workers](/docs/demos/bigdata/worker), a popular API for parallelism in the
web browser, uses message passing. The "structured clone algorithm"[^1] is used
to pass data between the main renderer thread and Worker instances.

The structured clone algorithm does not preserve functions or prototypes.

In the SheetJS data model, each structure is a simple object. There are no
classes or prototype methods.

:::

### Contents

<ul>{useCurrentSidebarCategory().items.map(globalThis.lambda = (item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
    <ul>{item.items && item.items.map(lambda)}</ul>
  </li>);
})}</ul>

[^1]: See [the HTML Living Standard](https://html.spec.whatwg.org/multipage/structured-data.html#structured-cloning) for more details on the "structured clone algorithm".
