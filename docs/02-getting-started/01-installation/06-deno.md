---
title: Deno
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
sidebar_position: 6
sidebar_custom_props:
  summary: Import ECMAScript Modules and TypeScript definitions
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Deno is a JavaScript runtime that can import scripts from URLs.

Module scripts and type definitions are available at https://cdn.sheetjs.com/.

Using the URL imports, `deno run` will automatically download scripts and types:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';`}
</CodeBlock>

The module URL is the ECMAScript Module build on the SheetJS CDN. `@deno-types`
instructs Deno to use the type definitions from the SheetJS CDN.

:::caution Deno support is considered experimental.

Great open source software grows with user tests and reports. Any issues should
be reported to the Deno project for further diagnosis.

:::

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::

## Encoding support

If Encoding support is required, `cpexcel.full.mjs` must be manually imported:

<CodeBlock language="ts">{`\
/* load the codepage support library for extended support with older formats  */
import * as cptable from 'https://cdn.sheetjs.com/xlsx-${current}/package/dist/cpexcel.full.mjs';
XLSX.set_cptable(cptable);`}
</CodeBlock>

## Upgrade Notes

Upgrading to the latest version involves changing the import URLs.  The import
and the types URLs should be updated at the same time:

<CodeBlock language="diff">{`\
-// @deno-types="https://cdn.sheetjs.com/xlsx-0.18.3/package/types/index.d.ts"
+// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
\n\
-import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.18.3/package/xlsx.mjs';
+import * as XLSX from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
-import * as cptable from 'https://cdn.sheetjs.com/xlsx-0.18.3/package/dist/cpexcel.full.mjs';
+import * as cptable from 'https://cdn.sheetjs.com/xlsx-${current}/package/dist/cpexcel.full.mjs';
`}
</CodeBlock>

#### Deno Registry

:::danger pass

The official Deno registry is out of date.  This is a registry bug.

**The SheetJS CDN** https://cdn.sheetjs.com/ **is the authoritative source**
**for SheetJS modules.**

:::

Applications using the Deno registry can migrate by changing the URLs.  After
migrating, scripts can be updated by changing the version number.

<Tabs>
  <TabItem value="v" label="URL with version">

The SheetJS CDN version has no `v`.  For example, `v0.18.3` maps to `0.18.3`:

```diff
-// @deno-types="https://deno.land/x/sheetjs@v0.18.3/types/index.d.ts"
+// @deno-types="https://cdn.sheetjs.com/xlsx-0.18.3/package/types/index.d.ts"

-import * as XLSX from 'https://deno.land/x/sheetjs@v0.18.3/xlsx.mjs';
+import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.18.3/package/xlsx.mjs';

-import * as cptable from 'https://deno.land/x/sheetjs@v0.18.3/dist/cpexcel.full.mjs';
+import * as cptable from 'https://cdn.sheetjs.com/xlsx-0.18.3/package/dist/cpexcel.full.mjs';
```

  </TabItem>
  <TabItem value="nov" label="URL without version">

Version-less imports (`https://deno.land/x/sheetjs/xlsx.mjs`) map to `0.18.3`:

```diff
-// @deno-types="https://deno.land/x/sheetjs/types/index.d.ts"
+// @deno-types="https://cdn.sheetjs.com/xlsx-0.18.3/package/types/index.d.ts"

-import * as XLSX from 'https://deno.land/x/sheetjs/xlsx.mjs';
+import * as XLSX from 'https://cdn.sheetjs.com/xlsx-0.18.3/package/xlsx.mjs';

-import * as cptable from 'https://deno.land/x/sheetjs/dist/cpexcel.full.mjs';
+import * as cptable from 'https://cdn.sheetjs.com/xlsx-0.18.3/package/dist/cpexcel.full.mjs';
```

  </TabItem>
</Tabs>
