---
title: Web Frameworks
pagination_prev: demos/math/index
pagination_next: demos/grid/index
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

Web frameworks help provide structure to modern web applications. Opinionated
structures help keep development teams aligned and make code reuse viable.

SheetJS libraries are written in pure JavaScript and are readily integrated in
web applications using any framework.  As each framework has its own ecosystem,
the demos focus on how SheetJS data concepts map to common ecosystem patterns.

### Web Frameworks

Demos for popular frameworks are included in separate pages:

<ul>{useCurrentSidebarCategory().items.filter(item => !item?.customProps?.skip).map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

Legacy frameworks including KnockoutJS are covered [in the "Legacy" section](/docs/demos/frontend/legacy).

:::note Recommendation

It is strongly recommended to use a framework.  While modern websites can be
built without frameworks, the framework ecosystems have battle-tested solutions
for organizing data, page updates / routing, and other common problems.

It is strongly recommended to stick with familiar frameworks. Teams well-versed
in Angular should continue using Angular.  Teams well-versed in ReactJS should
continue using ReactJS.  For common problems, there are official or community
solutions using any framework.

Greenfield projects can be built with any framework.  The popular frameworks
have large ecosystems and many talented developers for hire.  At the time of
writing, ReactJS has the largest developer pool and module ecosystem.

:::

### Bundlers and Tooling

Modern web applications are designed to be woven using CommonJS or ECMAScript
modules. A "bundler" will combine application code and modules to produce a
final website that can be deployed.

[The "Bundler" subsection](/docs/demos/frontend/bundler) covers a number of
common bundlers and build tools.

The following demos are in separate pages:

<ul>{useCurrentSidebarCategory().items.filter(item => item.label == "Bundlers")[0].items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}
<li><a href="/docs/demos/frontend/bundler/#dojo">Dojo Toolkit</a></li>
<li><a href="/docs/demos/frontend/bundler/#snowpack">Snowpack</a></li>
<li><a href="/docs/demos/frontend/bundler/#wmr">WMR</a></li>
</ul>
