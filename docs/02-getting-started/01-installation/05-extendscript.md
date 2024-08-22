---
title: ExtendScript
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
sidebar_position: 5
sidebar_custom_props:
  summary: Photoshop, InDesign, and other Creative Cloud apps
---

import current from '/version.js';

ExtendScript is a dialect of JavaScript used in Photoshop and InDesign scripts.

Each standalone release script is available at https://cdn.sheetjs.com/.

`xlsx.extendscript.js` is a special ExtendScript-compatible build. The script is
carefully assembled to work around ExtendScript quirks. Due to bugs in various
JavaScript minifiers and tools, scripts cannot be compressed or post-processed.

<p><a href={"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.extendscript.js"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.extendscript.js"}</a> is the URL for {current}</p>

After downloading the script, it can be directly referenced with `#include`:

```c
#include "xlsx.extendscript.js"
```

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::

For local deployments, the scripts can be placed in the `Scripts` folder. The
path is application-specific.

| App       | Location                                                         |
|:----------|:-----------------------------------------------------------------|
| Photoshop | `\Presets\Scripts` within the Application folder                 |
| InDesign  | Windows > Utilities > Scripts, click `☰` > "Reveal in Explorer" |

:::note CEP and UXP usage

The ExtendScript build should be used when performing spreadsheet operations
from the host context (within a `jsx` script file).

**CEP**: [The standalone scripts](/docs/getting-started/installation/standalone)
should be added to CEP extension HTML.

**UXP**: [The standalone scripts](/docs/getting-started/installation/standalone)
can be loaded directly in UXP scripts using the `require` function.

:::