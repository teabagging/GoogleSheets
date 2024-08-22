---
title: sheet.lol
sidebar_position: 9
hide_table_of_contents: true
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

The authoritative source for SheetJS libraries is https://cdn.sheetjs.com .
Unfortunately, some third-party tools do not support the URL pattern for NodeJS
packages hosted on the main distribution point.

https://sheet.lol is a mirror that uses a different URL scheme for NodeJS
packages. The mirror is maintained by SheetJS LLC.

:::info pass

**It is strongly recommended to use https://cdn.sheetjs.com when possible!**

:::

## NodeJS Packages

Package tarballs are available on https://sheet.lol.

<p><a href={"https://sheet.lol/balls/xlsx-" + current + ".tgz"}>{"https://sheet.lol/balls/xlsx-" + current + ".tgz"}</a> is the URL for version {current}</p>

Tarballs can be directly installed using a package manager:

<Tabs groupId="pm">
  <TabItem value="npm" label="npm">
<CodeBlock language="bash">{`\
npm rm --save xlsx
npm i --save https://sheet.lol/balls/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="pnpm" label="pnpm">
<CodeBlock language="bash">{`\
pnpm rm xlsx
pnpm install --save https://sheet.lol/balls/xlsx-${current}.tgz`}
</CodeBlock>
  </TabItem>
  <TabItem value="yarn" label="Yarn" default>
<CodeBlock language="bash">{`\
yarn remove xlsx
yarn add https://sheet.lol/balls/xlsx-${current}.tgz`}
</CodeBlock>

:::caution pass

Newer releases of Yarn may throw an error:

```
Usage Error: It seems you are trying to add a package using a https:... url; we now require package names to be explicitly specified.
Try running the command again with the package name prefixed: yarn add my-package@https:...
```

The workaround is to prepend the URL with `xlsx@`:

<CodeBlock language="bash">{`\
yarn add xlsx@https://sheet.lol/balls/xlsx-${current}.tgz`}
</CodeBlock>

:::

  </TabItem>
</Tabs>

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::
