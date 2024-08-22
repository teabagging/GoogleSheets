---
title: Desktop Applications
pagination_prev: demos/mobile/index
pagination_next: demos/cli/index
hide_table_of_contents: true
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';
import FrameworkData from '/data/desktop.js'

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

Web technologies including JavaScript and HTML can power traditional software.

This demo covers a number of desktop app frameworks. In each demo, we will build
an app that uses SheetJS libraries to read and write spreadsheet files.

## Strategies

There are two different integration strategies. The "WebView" strategy embeds a
mini web browser and adds supporting native components. The "Engine" strategy
uses an embedded JavaScript engine that fits into the desktop app.

### WebView

WebViews are special web browser components designed to be embedded within apps.
As the browser components are available across all major platforms, desktop apps
can use the WebView as the main user interface. This approach allows small teams
to build software that works across operating systems and architectures.

The app is designed in HTML and CSS. [Web Frameworks](/docs/demos/frontend) can
be used but are typically not required.

### Engine

JavaScript engines including [V8](/docs/demos/engines/v8) can be directly added
to traditional desktop software. This approach is explored in greater detail in
the ["JavaScript Engines" demo](/docs/demos/engines/).

## Desktop Apps

Desktop app frameworks bundle a JavaScript engine and a windowing framework to
enable graphical apps. SheetJS is compatible with many app frameworks.

Demos for common desktop tools are included in separate pages:

<ul>{useCurrentSidebarCategory().items.filter(item => !item.customProps?.cli).map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

:::note Desktop Recommendation

Electron is the most established and widely-used framework. With deep support
for NodeJS modules and consistent user interfaces, it is the recommended choice
for new projects and for web developers.

Frameworks like Wails are compelling alternatives for teams with experience in
other programming languages.

Frameworks like React Native generate applications that use native UI elements.

:::

#### Platform Support

The following frameworks have been tested on the following platforms:

<FrameworkData/>

#### Command-Line Tools

**[The exposition has been moved to a separate page.](/docs/demos/cli)**
