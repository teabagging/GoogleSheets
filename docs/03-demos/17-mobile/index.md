---
title: Tables on Tablets and Mobile Devices
sidebar_label: iOS and Android Apps
pagination_prev: demos/static/index
pagination_next: demos/desktop/index
hide_table_of_contents: true
---

import EngineData from '/data/mobile.js'
import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

Many mobile app frameworks mix JavaScript / CSS / HTML5 concepts with native
extensions and libraries to create a hybrid development experience.  Developers
well-versed in web technologies can now build actual mobile applications that
run on iOS and Android!

The demos in this section showcase a number of mobile frameworks. In each case,
we will build a sample app that loads SheetJS library scripts and processes
on-device and remote spreadsheet files.

:::danger pass

**The ecosystem has broken backwards-compatibility many times!**

iOS and Android, as well as the underlying JavaScript frameworks, make breaking
changes regularly.  The demos were tested against emulators / real devices at
some point in time.  A framework or OS change can render the demos inoperable.

MacOS is required for the iOS demos.  The Android demos were tested on MacOS.

:::

Demos for common tools are included in separate pages.  Each demo section will
mention test dates and platform versions.

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const listyle = (item.customProps?.icon) ? {
    listStyleImage: `url("${item.customProps.icon}")`
  } : {};
  return (<li style={listyle} {...(item.customProps?.class ? {className: item.customProps.class}: {})}>
    <a href={item.href}>{item.label}</a>{item.customProps?.summary && (" - " + item.customProps.summary)}
  </li>);
})}</ul>

:::info pass

The ["JavaScript Engines"](/docs/demos/engines) section includes samples for JS
engines used in the mobile app frameworks.  SheetJS libraries have been tested
in the relevant engines.

:::

:::note Recommendation

React Native is extremely popular and is the recommended choice for greenfield
projects that can use community modules.  However, its "lean core" approach
forces developers to learn iOS/Android programming or use community modules to
provide basic app features.

The original Web View framework was PhoneGap/Cordova. The modern frameworks are
built atop Cordova. Cordova is waning in popularity but it has a deep library of
community modules to solve many problems.

Before creating a new app, it is important to identify what features the app
should support and investigate community modules.  If there are popular modules
for features that must be included, or for teams that are comfortable with
native app development, React Native is the obvious choice.

:::

### Platforms

The following frameworks have been tested:

<EngineData/>

:::info pass

When this table was last updated, it was not possible to build an iOS app from
Linux or Windows. Android tooling runs on MacOS, Linux and Windows.

:::
