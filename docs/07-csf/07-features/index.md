---
title: Spreadsheet Features
---

import DocCardList from '@theme/DocCardList';
import {useCurrentSidebarCategory} from '@docusaurus/theme-common';

File formats represent data in different ways.

SheetJS parsers are expected to convert from the underlying file format
representation to the Common Spreadsheet Format.

SheetJS writers are expected to convert from the Common Spreadsheet Format to
the relevant file formats.

The following topics are covered in sub-pages:

<ul>{useCurrentSidebarCategory().items.map((item, index) => {
  const cP = item.customProps;
  const listyle = (cP?.icon) ? { listStyleImage: `url("${cP.icon}")` } : {};
  return ( <li style={listyle} {...(cP?.class ? {className: cP.class}: {})}>
    <a href={item.href}>{item.label}</a>{cP?.summary && (" - " + cP.summary)}
  </li> );
})}</ul>
