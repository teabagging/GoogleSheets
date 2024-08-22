---
title: AMD (define)
pagination_prev: getting-started/index
pagination_next: getting-started/examples/index
sidebar_position: 4
sidebar_custom_props:
  summary: NetSuite, SAP UI5, RequireJS
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Each standalone release script is available at https://cdn.sheetjs.com/.

`xlsx.full.min.js` supports AMD with name `xlsx` out of the box.

<p><a href={"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.full.min.js"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.full.min.js"}</a> is the URL for {current}</p>

:::note pass

When referencing by file name, AMD loaders typically omit the file extension.

The actual file name is `xlsx.full.min.js`, but the examples identify the script
using the name `xlsx.full.min`

:::

:::tip pass

[Watch the repo](https://git.sheetjs.com/SheetJS/sheetjs) or subscribe to the
[RSS feed](https://git.sheetjs.com/sheetjs/sheetjs/tags.rss) to be notified when
new versions are released!

:::

## NetSuite

After downloading the script and uploading to the file cabinet, a module alias
must be added to the `@NAmdConfig` configuration file:

```json title="JsLibraryConfig.json"
{
  "paths": {
    // highlight-next-line
    "xlsx": "/path/to/xlsx.full.min"
  }
}
```

Once added, SuiteScripts can reference the package using the name `xlsx`:

```js title="SuiteScript"
/**
 * @NApiVersion 2.x
 * ... more options ...
 // highlight-next-line
 * @NAmdConfig  ./JsLibraryConfig.json
 */
// highlight-next-line
define(['N/file', 'xlsx'], function(file, XLSX) {
  // ... use XLSX here ...
});
```

**More details are included in the [NetSuite demo](/docs/demos/cloud/netsuite#installation)**

:::caution Oracle Bugs

[NetSuite users reported](https://git.sheetjs.com/sheetjs/sheetjs/issues/3097)
errors that stem from an Oracle issue. A sample error message is shown below.

```
Fail to evaluate script: com.netsuite.suitescript.scriptobject.GraalValueAdapter@68d0f09d
```

**This is a NetSuite bug. Only Oracle can fix the bug!**

It is strongly encouraged to escalate the issue with Oracle support.

NetSuite users have reported success with the following workaround:

1) Open the script in a text editor and search for `define(` in the code.

There will be exactly one instance:

```js
define("xlsx",function(){
```

Replace the `xlsx` with `sheetjs`:

```js
define("sheetjs",function(){
```

2) Use the new name in the JSON configuration:

```json title="JsLibraryConfig.json"
{
  "paths": {
    // highlight-next-line
    "sheetjs": "/path/to/xlsx.full.min"
  }
}
```

3) Use the new name in the array argument to the `define` function call:

```js title="SuiteScript"
/**
 * @NApiVersion 2.x
 * ... more options ...
 // highlight-next-line
 * @NAmdConfig  ./JsLibraryConfig.json
 */
// highlight-next-line
define(['N/file', 'sheetjs'], function(file, XLSX) {
  //               ^^^^^^^                   ^^^^
  //             new module name        same variable
  // ... use XLSX here ...
});
```

:::

## SAP UI5

After downloading the script, it can be uploaded to the UI5 project and loaded
in the `sap.ui.define` call:

```js
sap.ui.define([
  /* ... other libraries ... */
  "path/to/xlsx.full.min"
], function(/* ... variables for the other libraries ... */, XLSX) {
  // use XLSX here
})
```

:::danger pass

**Copy and pasting code does not work** for SheetJS scripts as they contain
Unicode characters that may be mangled.  The standalone script should be
downloaded and manually uploaded to the project.

:::

## RequireJS

:::caution pass

The standalone script must be aliased to the path `xlsx`.

The `requirejs.config` function can define aliases through the `paths` key:

```js
requirejs.config({
  paths: {
    xlsx: [ './xlsx.full.min' ]
  }
});
```

:::

After configuring the alias, app code can freely require `xlsx`:

```js
require(['xlsx'], function(XLSX) {
  // ... use XLSX here
});
```

**See the [RequireJS demo](/docs/demos/frontend/bundler/requirejs) for details**

## Dojo Toolkit

Dojo has changed module loading strategies over the years.  These examples were
tested with Dojo `1.17.3`. They are not guaranteed to work with other versions.

Live demos are included in ["Dojo Toolkit"](/docs/demos/frontend/dojo)

:::caution pass

The standalone scripts add `window.XLSX`, so it is recommended to use `_XLSX`
in the function arguments and access the library with `XLSX` in the callback:

```js
require(["xlsx"], function(
  // highlight-next-line
  _XLSX // !! NOTE: this is not XLSX! A different variable name must be used
) {
  // highlight-next-line
  console.log(XLSX.version); // use XLSX in the callback
})
```

:::

#### Synchronous Loading

When `async` is set to `false` or `0`, the scripts can be directly referenced in
`require` calls.

<CodeBlock language="html">{`\
<script src="dojo.js" data-dojo-config="isDebug:1, async:0"></script>
<script>
require([
// highlight-next-line
  "https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"
], function(
// highlight-next-line
  _XLSX // !! NOTE: this is not XLSX! A different variable name must be used
) {
  // ... use XLSX here
});
</script>`}
</CodeBlock>

#### Asynchronous Loading

When `async` is enabled, Dojo will only understand the name `xlsx`.  The config
object can map package names to scripts:

<CodeBlock language="html">{`\
<script>
// This setting must appear *before* loading dojo.js
dojoConfig = {
  packages: [
    // highlight-start
    {
      name: "xlsx",
      // if self-hosting the script, location should be a folder relative to baseUrl setting
      location: "https://cdn.sheetjs.com/xlsx-${current}/package/dist",
      // name of the script (without the .js extension)
      main: "xlsx.full.min"
    }
    // highlight-end
  ]
};
</script>
<script src="dojo.js" data-dojo-config="isDebug:1, async:1"></script>
<script>
require(["xlsx"], function(_XLSX) {
  // ... use XLSX here
});
</script>`}
</CodeBlock>
