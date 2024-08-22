---
title: NW.js
pagination_prev: demos/mobile/index
pagination_next: demos/cli/index
sidebar_position: 2
sidebar_custom_props:
  summary: Embedded Chromium + NodeJS
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be referenced in a `SCRIPT` tag from the entry point HTML page.

The "Complete Example" creates an app that looks like the screenshots below:

<table><thead><tr>
  <th><a href="#complete-example">Windows</a></th>
  <th><a href="#complete-example">macOS</a></th>
  <th><a href="#complete-example">Linux</a></th>
</tr></thead><tbody><tr><td>

![Windows screenshot](pathname:///nwjs/nww.png)

</td><td>

![macOS screenshot](pathname:///nwjs/nwm.png)

</td><td>

![Linux screenshot](pathname:///nwjs/nwl.png)

</td></tr></tbody></table>

## Integration Details

NW.js provides solutions for reading and writing files.

### Reading Files

The standard HTML5 `FileReader` techniques from the browser apply to NW.js!

NW.js handles the OS minutiae for dragging files into app windows.  The
[drag and drop snippet](/docs/solutions/input#example-user-submissions) apply
to DIV elements on the page.

Similarly, file input elements automatically map to standard Web APIs.

For example, assuming a file input element on the page:

```html
<input type="file" name="xlfile" id="xlf" />
```

The event handler would process the event as if it were a web event:

```js
async function handleFile(e) {
  const file = e.target.files[0];
  const data = await file.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);

  /* DO SOMETHING WITH workbook HERE */
}
document.getElementById("xlf").addEventListener("change", handleFile, false);
```

### Writing Files

File input elements with the attribute `nwsaveas` show UI for saving a file. The
standard trick is to generate a hidden file input DOM element and "click" it.
Since NW.js does not present a `writeFileSync` in the `fs` package, a manual
step is required:

```js
/* pre-build the hidden nwsaveas input element */
var input = document.createElement('input');
input.style.display = 'none';
input.setAttribute('nwsaveas', 'SheetJSNWDemo.xlsx');
input.setAttribute('type', 'file');
document.body.appendChild(input);

/* show a message if the save is canceled */
input.addEventListener('cancel',function(){ alert("Save was canceled!"); });

/* write to a file on the 'change' event */
input.addEventListener('change',function(e){
  /* the `value` is the path that the program will write */
  var filename = this.value;

  /* use XLSX.write with type "buffer" to generate a buffer" */
  /* highlight-next-line */
  var wbout = XLSX.write(workbook, {type:'buffer', bookType:"xlsx"});
  /* highlight-next-line */
  require("fs").writeFile(filename, wbout, function(err) {
    if(!err) return alert("Saved to " + filename);
    alert("Error: " + (err.message || err));
  });
});

input.click();
```

## Complete Example

:::note Tested Deployments

This demo was tested in the following environments:

| OS and Version | Architecture | NW.js    | Date       | Notes                |
|:---------------|:-------------|:---------|:-----------|:---------------------|
| macOS 14.3.1   | `darwin-x64` | `0.85.0` | 2024-03-12 |                      |
| macOS 14.5     | `darwin-arm` | `0.88.0` | 2024-05-28 |                      |
| Windows 10     | `win10-x64`  | `0.83.0` | 2024-03-04 |                      |
| Windows 11     | `win11-arm`  | `0.88.0` | 2024-05-28 |                      |
| Linux (HoloOS) | `linux-x64`  | `0.89.0` | 2024-07-07 |                      |
| Linux (Debian) | `linux-arm`  | `0.60.0` | 2024-05-23 | Unofficial build[^1] |

:::

0) Create a project folder:

```bash
mkdir sheetjs-nwjs
cd sheetjs-nwjs
```

1) Create a `package.json` file that specifies the entry point:

<CodeBlock language="json" title="package.json">{`\
{
  "name": "sheetjs-nwjs",
  "author": "sheetjs",
  "version": "0.0.0",
  "main": "index.html",
  "dependencies": {
    "nw": "0.89.0",
    "xlsx": "https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz"
  }
}`}
</CodeBlock>

2) Download [`index.html`](pathname:///nwjs/index.html) into the same folder.

:::caution pass

Right-click the link and select "Save Link As...".  Left-clicking the link will
try to load the page in your browser.  The goal is to save the file contents.

:::

In the terminal window, the download can be performed with:

```bash
curl -LO https://docs.sheetjs.com/nwjs/index.html
```

3) Install dependencies:

```bash
npm i
```

4) To verify the app works, run in the test environment:

```bash
npx nw .
```

On launch, the app will fetch and parse https://docs.sheetjs.com/pres.numbers .

Using the file input element, a file can be selected from the filesystem and the
table will refresh with the contents of the selected file.

Click "Export Data!" and save the generated file to `SheetJSNWDemo.xlsx`. This
file can be opened in Excel or another spreadsheet editor.

5) To build a standalone app, run the builder:

```bash
npx -p nw-builder nwbuild --mode=build --version=0.89.0 --glob=false --outDir=../out ./
```

This will generate the standalone app in the `..\out\` folder.

6) Launch the generated application:

| Architecture | Command                                                       |
|:-------------|:--------------------------------------------------------------|
| `linux-x64`  | `../out/sheetjs-nwjs`                                         |

[^1]: The [`nw60-arm64_2022-01-08` release](https://github.com/LeonardLaszlo/nw.js-armv7-binaries/releases/tag/nw60-arm64_2022-01-08) included an ARM64 version of `nw`.