---
title: Legacy Frameworks
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 9
sidebar_custom_props:
  skip: 1
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Over the years, many frameworks have been released. Some were popular years ago
but have waned in recent years. There are still many deployments using these
frameworks and it is oftentimes easier to continue maintenance than to rewrite
using modern web techniques.

SheetJS libraries strive to maintain broad browser and JS engine compatibility.

## Integration

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be referenced in a `SCRIPT` tag from an HTML page. For legacy deployments,
the shim script must be loaded first:

<CodeBlock language="html">{`\
<!-- SheetJS version ${current} \`shim.min.js\` -->
<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js"></script>
<!-- SheetJS version ${current} \`xlsx.full.min.js\` -->
<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
<script>
/* display SheetJS version */
if(typeof console == "object" && console.log) console.log(XLSX.version);
else if(typeof alert != "undefined") alert(XLSX.version);
else document.write(XLSX.version);
</script>`}
</CodeBlock>

## Internet Explorer

:::danger pass

Internet Explorer is unmaintained and users should consider modern browsers.
The SheetJS testing grid still includes IE and should work.

:::

The modern upload and download strategies are not available in older versions of
IE, but there are approaches using ActiveX or Flash.

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

This demo includes all of the support files for the Flash and ActiveX methods.

1) Download the SheetJS Standalone script and shim script. Move both files to
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
</ul>

2) [Download the demo ZIP](pathname:///ie/SheetJSIESupport.zip).

The ZIP includes the demo HTML file as well as the Downloadify support files.

Extract the contents to the same folder as the scripts from step 1

3) Start a HTTP server:

```bash
npx -y http-server .
```

4) Access the `index.html` from a machine with Internet Explorer.

</details>

<details>
  <summary><b>Other Live Demos</b> (click to show)</summary>

:::caution pass

The hosted solutions may not work in older versions of Windows.  For testing,
demo pages should be downloaded and hosted using a simple HTTP server.

:::

https://oss.sheetjs.com/sheetjs/ajax.html uses XMLHttpRequest to download test
files and convert to CSV

https://oss.sheetjs.com/sheetjs/ demonstrates reading files with `FileReader`.

Older versions of IE do not support HTML5 File API but do support Base64.

On MacOS you can get the Base64 encoding with:

```bash
$ <target_file base64 | pbcopy
```

On Windows XP and up you can get the Base64 encoding using `certutil`:

```cmd
> certutil -encode target_file target_file.b64
```

(note: You have to open the file and remove the header and footer lines)

</details>

### Upload Strategies

IE10 and IE11 support the standard HTML5 FileReader API:

```js
function handle_fr(e) {
  var f = e.target.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var wb = XLSX.read(e.target.result);
    process_wb(wb); // DO SOMETHING WITH wb HERE
  };
  reader.readAsArrayBuffer(f);
}
input_dom_element.addEventListener('change', handle_fr, false);
```

`Blob#arrayBuffer` is not supported in IE!

**ActiveX Upload**

Through the `Scripting.FileSystemObject` object model, a script in the VBScript
scripting language can read from an arbitrary path on the file system. The shim
includes a special `IE_LoadFile` function to read binary data from files. This
should be called from a file input `onchange` event:

```js
var input_dom_element = document.getElementById("file");
function handle_ie() {
  /* get data from selected file */
  var path = input_dom_element.value;
  var bstr = IE_LoadFile(path);
  /* read workbook */
  var wb = XLSX.read(bstr, {type: 'binary'});
  /* DO SOMETHING WITH workbook HERE */
}
input_dom_element.attachEvent('onchange', handle_ie);
```

### Download Strategies

As part of the File API implementation, IE10 and IE11 provide the `msSaveBlob`
and `msSaveOrOpenBlob` functions to save blobs to the client computer.  This
approach is embedded in `XLSX.writeFile` and no additional shims are necessary.

**Flash-based Download**

It is possible to write to the file system using a SWF file.  `Downloadify`[^1]
implements one solution.  Since a genuine click is required, there is no way to
force a download.  The safest data type is Base64:

```js
// highlight-next-line
Downloadify.create(element_id, {
  /* Downloadify boilerplate */
  swf: 'downloadify.swf',
  downloadImage: 'download.png',
  width: 100, height: 30,
  transparent: false, append: false,

  // highlight-start
  /* Key parameters */
  filename: "test.xlsx",
  dataType: 'base64',
  data: function() { return XLSX.write(wb, { bookType: "xlsx", type: 'base64' }); }
  // highlight-end
// highlight-next-line
});
```

**ActiveX Download**

Through the `Scripting.FileSystemObject` object model, a script in the VBScript
scripting language can write to an arbitrary path on the filesystem.  The shim
includes a special `IE_SaveFile` function to write binary strings to file.  It
attempts to write to the Downloads folder or Documents folder or Desktop.

This approach does not require user interaction, but ActiveX must be enabled. It
is embedded as a strategy in `writeFile` and used only if the shim script is
included in the page and the relevant features are enabled on the target system.


## Frameworks

#### Dojo Toolkit

**[The exposition has been moved to a separate page.](/docs/demos/frontend/dojo)**

### KnockoutJS

[KnockoutJS](https://knockoutjs.com/) was a popular MVVM framework.

The [Live demo](pathname:///knockout/knockout3.html) shows a view model that is
updated with file data and exported to spreadsheets.

:::note Tested Deployments

This demo was tested in the following environments:

| KnockoutJS | Date       | Live Demo                                      |
|:-----------|:-----------|:-----------------------------------------------|
| `3.5.0`    | 2024-04-07 | [**KO3**](pathname:///knockout/knockout3.html) |
| `2.3.0`    | 2024-04-07 | [**KO2**](pathname:///knockout/knockout2.html) |

:::

<details>
  <summary><b>Full Exposition</b> (click to show)</summary>

**State**

Arrays of arrays are the simplest data structure for representing worksheets.

```js
var aoa = [
  [1, 2], // A1 = 1, B1 = 2
  [3, 4]  // A1 = 3, B1 = 4
];
```

`ko.observableArray` should be used to create the view model:

```js
function ViewModel() {
  /* use an array of arrays */
  this.aoa = ko.observableArray([ [1,2], [3,4] ]);
}
/* create model */
var model = new ViewModel();
ko.applyBindings(model);
```

`XLSX.utils.sheet_to_json` with `header: 1` generates data for the model:

```js
/* starting from a `wb` workbook object, pull first worksheet */
var ws = wb.Sheets[wb.SheetNames[0]];
/* convert the worksheet to an array of arrays */
var aoa = XLSX.utils.sheet_to_json(ws, {header:1});
/* update model */
model.aoa(aoa);
```

`XLSX.utils.aoa_to_sheet` generates worksheets from the model:

```js
var aoa = model.aoa();
var ws = XLSX.utils.aoa_to_sheet(aoa);
```

**Data Binding**

`data-bind="foreach: ..."` provides a simple approach for binding to `TABLE`:

```html
<table data-bind="foreach: aoa">
  <tr data-bind="foreach: $data">
    <td><span data-bind="text: $data"></span></td>
  </tr>
</table>
```

Unfortunately the nested `"foreach: $data"` binding is read-only.  A two-way
binding is possible using the `$parent` and `$index` binding context properties:

```html
<table data-bind="foreach: aoa">
  <tr data-bind="foreach: $data">
    <td><input data-bind="value: $parent[$index()]" /></td>
  </tr>
</table>
```

</details>

[^1]: The project does not have a separate website. The source repository is hosted on [GitHub](https://github.com/dcneiner/Downloadify)