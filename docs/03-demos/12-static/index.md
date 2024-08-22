---
title: Content and Static Sites
pagination_prev: demos/net/index
pagination_next: demos/mobile/index
---

import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

With the advent of server-side frameworks and content management systems, it is
possible to build sites whose source of truth is a spreadsheet!  This demo
explores a number of approaches.

## Flow

At its core, the site generators provide a structure for supplying content and
templates.  During a publish step, the generators will analyze the content and
generate web pages by applying the template to the content.  It is spiritually
similar to "Mail Merge".

This separation of content and presentation makes it easy for analysts and other
spreadsheet users to generate files with their data and quickly update websites!

#### Live Reload

Many frameworks offer a development flow which watches files for changes.  When
using a spreadsheet as the data source, this allows the content creators to see
updates in a preview environment as they make changes to the spreadsheet!

The following GIF animation shows a static site generator in development mode.
The user is editing a spreadsheet with Numbers.  Every time the page is saved,
the browser refreshes to show the new content.

![Live example](pathname:///static/live.gif)

## Ecosystem

:::note Recommendation

It is strongly recommended to use a telemetry-free framework that provides an
official plugin for working with SheetJS.

Lume is a great choice for lightweight sites.

:::

### Official

Some frameworks provide official extensions. They are strongly recommended for
greenfield projects.

<ul>{useCurrentSidebarCategory().items.filter(item => item.customProps?.type == "native").map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>


### Bundlers

Bundlers can run JS code and process assets during development and during site
builds. Custom plugins can extract data from spreadsheets.

<ul>{useCurrentSidebarCategory().items.filter(item => item.customProps?.type == "bundler").map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

### Workarounds

Other site generators require workarounds for various limitations and assumptions:

<ul>{useCurrentSidebarCategory().items.filter(item => !item?.customProps?.type).map(item => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>
