---
title: Data Munging in NeutralinoJS
sidebar_label: NeutralinoJS
description: Build data-intensive desktop apps using NeutralinoJS. Seamlessly integrate spreadsheets into your app using SheetJS. Quickly modernize Excel-powered business processes.
pagination_prev: demos/mobile/index
pagination_next: demos/cli/index
sidebar_position: 5
sidebar_custom_props:
  summary: Webview + Lightweight Extensions
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[NeutralinoJS](https://neutralino.js.org/) is a modern desktop app framework.
NeutralinoJS apps pair platform-native browser tools with a static web server.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses NeutralinoJS and SheetJS to pull data from a spreadsheet and
display the data in the app. We'll explore how to load SheetJS in a NeutralinoJS
app and use native features to read and write files.

The ["Complete Example"](#complete-example) section covers a complete desktop
app to read and write workbooks. The app will look like the screenshots below:

<table><thead><tr>
  <th><a href="#complete-example">Windows</a></th>
  <th><a href="#complete-example">macOS</a></th>
  <th><a href="#complete-example">Linux</a></th>
</tr></thead><tbody><tr><td>

![Windows screenshot](pathname:///neu/win10.png)

</td><td>

![macOS screenshot](pathname:///neu/macos.png)

</td><td>

![Linux screenshot](pathname:///neu/linux.png)

</td></tr></tbody></table>

## Integration Details

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be added to the `index.html` entry point.

For code running in the window, native methods must be explicitly enabled in the
NeutralinoJS `neutralino.conf.json` settings file[^1].

- `os.*` enables the open and save dialog methods.
- `filesystem.*` enables reading and writing file data.

The starter app enables `os.*` so typically one line must be added:

```json title="neutralino.config.json"
  "nativeAllowList": [
    "app.*",
    "os.*",
// highlight-next-line
    "filesystem.*",
    "debug.log"
  ],
```

### Reading Files

There are three steps to reading files:

1) Show an open file dialog with `Neutralino.os.showOpenDialog`[^2]. This method
   resolves to the selected path.

2) Read raw data from the file with `Neutralino.filesystem.readBinaryFile`[^3].
   This method resolves to a standard `ArrayBuffer`.

3) Parse the data with the SheetJS `read` method[^4]. This method returns a
   SheetJS workbook object.

The following code example defines a single function `openFile` that performs
all three steps and returns a SheetJS workbook object:

```js
const filters = [
  {name: "Excel Binary Workbook", extensions: ["xls", "xlsb"]},
  {name: "Excel Workbook", extensions: ["xls", "xlsx"]},
]

async function openFile() {
  /* show open file dialog */
  const [filename] = await Neutralino.os.showOpenDialog(
    'Open a spreadsheet',
    { filters, multiSelections: false }
  );

  /* read data into an ArrayBuffer */
  const ab = await Neutralino.filesystem.readBinaryFile(filename);

  /* parse with SheetJS */
  const wb = XLSX.read(ab);
  return wb;
}
```

At this point, standard SheetJS utility functions[^5] can extract data from the
workbook object. The demo includes a button that calls `sheet_to_html`[^6] to
generate an HTML TABLE and add to the DOM:

```js
const open_button_callback = async() => {
  const wb = await openFile();

  /* get the first worksheet */
  // highlight-start
  const ws = wb.Sheets[wb.SheetNames[0]];
  // highlight-end

  /* get data from the first worksheet */
  // highlight-start
  const html = XLSX.utils.sheet_to_html(ws);
  // highlight-end

  /* display table */
  document.getElementById('info').innerHTML = html;
};
```

### Writing Files

There are three steps to reading files:

1) Show a file dialog with `Neutralino.os.showSaveDialog`[^7]. This method
   resolves to the selected path.

2) Write the data with the SheetJS `write` method[^8]. The output book type can
   be inferred from the selected file path. Using the `buffer` output type[^9],
   the method returns a `Uint8Array` object that plays nice with NeutralinoJS.

2) Write to file with `Neutralino.filesystem.writeBinaryFile`[^10].

The following code example defines a single function `saveFile` that performs
all three steps starting from a SheetJS workbook object:

```js
const filters = [
  {name: "Excel Binary Workbook", extensions: ["xls", "xlsb"]},
  {name: "Excel Workbook", extensions: ["xls", "xlsx"]},
]

async function saveFile(wb) {
  /* show save file dialog */
  const filename = await Neutralino.os.showSaveDialog(
    'Save to file',
    { filters }
  );

  /* Generate workbook */
  const bookType = filename.slice(filename.lastIndexOf(".") + 1);
  const data = XLSX.write(wb, { bookType, type: "buffer" });

  /* save data to file */
  await Neutralino.filesystem.writeBinaryFile(filename, data);
}
```

The demo includes a button that calls `table_to_book`[^11] to generate a
workbook object from the HTML table:

```js
const save_button_callback = async() => {
  /* get the table */
  const tbl = document.getElementById('info').querySelector('table');

  /* generate workbook from the table */
  // highlight-start
  const wb = XLSX.utils.table_to_book(tbl);
  // highlight-end

  await saveFile(wb);
}
```

## Complete Example

:::note Tested Deployments

This demo was tested in the following environments:

| OS and Version | Architecture | Server   | Client   | Date       |
|:---------------|:-------------|:---------|:---------|:-----------|
| macOS 14.4     | `darwin-x64` | `5.0.0`  | `5.0.1`  | 2024-03-15 |
| macOS 14.5     | `darwin-arm` | `5.1.0`  | `5.1.0`  | 2024-05-25 |
| Windows 10     | `win10-x64`  | `5.1.0`  | `5.1.0`  | 2024-03-24 |
| Windows 11     | `win11-arm`  | `5.1.0`  | `5.1.1`  | 2024-05-28 |
| Linux (HoloOS) | `linux-x64`  | `5.0.0`  | `5.0.1`  | 2024-03-21 |
| Linux (Debian) | `linux-arm`  | `5.1.0`  | `5.1.1`  | 2024-05-28 |

On `win11-arm`, the Electron runner is a proper ARM64 binary but the binaries
generated by Electron Forge are x64. The x64 binaries run in Windows on ARM.

:::

The app core state will be the HTML table.  Reading files will add the table to
the window.  Writing files will parse the table into a spreadsheet.

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

NeutralinoJS uses `portable-file-dialogs`[^12] to show open and save dialogs. On
Linux, Zenity or KDialog are require.

The last Debian test was run on a system using LXDE. KDialog is supported but
must be explicitly installed:

```bash
sudo apt-get install kdialog
```

NeutralinoJS requires `libwekit2gtk`. On Arch Linux-based platforms including
the Steam Deck, `webkit2gtk` can be installed through the package manager:

```bash
sudo pacman -Syu webkit2gtk
```

</details>

1) Create a new NeutralinoJS app:

```bash
npx @neutralinojs/neu create sheetjs-neu
cd sheetjs-neu
```

2) Download the SheetJS Standalone script and move to the `resources/js/`
subdirectory in the `sheetjs-neu` folder:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -L -o resources/js/xlsx.full.min.js https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}
</CodeBlock>

3) Add the highlighted line to `neutralino.config.json` in `nativeAllowList`:

```json title="neutralino.config.json (add highlighted line)"
  "nativeAllowList": [
    "app.*",
    "os.*",
// highlight-start
    "filesystem.*",
// highlight-end
    "debug.log"
  ],
```

:::note pass

There may be multiple `nativeAllowList` blocks in the configuration file. The
line must be added to the first block.

:::

4) Replace the contents of `resources/index.html` with the following code:

```html title="resources/index.html"
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>SheetJS + NeutralinoJS</title>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <div id="neutralinoapp">
      <h1>SheetJS × NeutralinoJS</h1>
      <button onclick="importData()">Import Data</button>
      <button onclick="exportData()">Export Data</button>
      <div id="info"></div>
    </div>
    <script src="js/neutralino.js"></script>
    <!-- Load the browser build and make XLSX available to main.js -->
    <script src="js/xlsx.full.min.js"></script>
    <script src="js/main.js"></script>
  </body>
</html>
```

5) Append the following code to `resources/styles.css` to center the table:

```css title="resources/styles.css (add to end)"
#info {
    width:100%;
    text-align: unset;
}
table {
    margin: 0 auto;
}
```

6) Print the version number in the `showInfo` method of `resources/js/main.js`:

```js title="resources/js/main.js (add highlighted lines)"
function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT}  inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
// highlight-start
        <br/><br/>
        <span>SheetJS version ${XLSX.version}</span>
// highlight-end
        `;
}
```

7) Run the app:

```bash
npx @neutralinojs/neu run
```

<p>The app should print <code>SheetJS Version {current}</code></p>

8) Add the following code to the bottom of `resources/js/main.js`:

```js title="resources/js/main.js (add to end)"
(async() => {
  const ab = await (await fetch("https://docs.sheetjs.com/pres.numbers")).arrayBuffer();
  const wb = XLSX.read(ab);
  const ws = wb.Sheets[wb.SheetNames[0]];
  document.getElementById('info').innerHTML = XLSX.utils.sheet_to_html(ws);
})();
```

9) Close the app. Run the app again:

```bash
npx @neutralinojs/neu run
```

When the app loads, a table should show in the main screen.

10) Add `importFile` and `exportFile` to the bottom of `resources/js/main.js`:

```js title="resources/js/main.js (add to end)"
async function importData() {
  /* show open dialog */
  const [filename] = await Neutralino.os.showOpenDialog('Open a spreadsheet');

  /* read data */
  const ab = await Neutralino.filesystem.readBinaryFile(filename);
  const wb = XLSX.read(ab);

  /* make table */
  const ws = wb.Sheets[wb.SheetNames[0]];
  document.getElementById('info').innerHTML = XLSX.utils.sheet_to_html(ws);
}

async function exportData() {
  /* show save dialog */
  const filename = await Neutralino.os.showSaveDialog('Save to file');

  /* make workbook */
  const tbl = document.getElementById('info').querySelector("table");
  const wb = XLSX.utils.table_to_book(tbl);

  /* make file */
  const bookType = filename.slice(filename.lastIndexOf(".") + 1);
  const data = XLSX.write(wb, { bookType, type: "buffer" });
  await Neutralino.filesystem.writeBinaryFile(filename, data);
}
```

11) Close the app. Run the app again:

```bash
npx @neutralinojs/neu run
```

When the app loads, click the "Import File" button and select a spreadsheet to
see the contents.

:::info pass

If no dialog is displayed, see the ["Installation Notes"](#complete-example) for
more details. On Linux ARM64, KDialog or Zenity must be installed.

:::

Click "Export File" and enter `SheetJSNeu.xlsx` to write a new file.

:::caution pass

When saving the file, the actual file extension must be included. Attempting to
save as `SheetJSNeu` will not automatically add the `.xlsx` extension!

:::

12) Build production apps:

```bash
npx @neutralinojs/neu build
```

Platform-specific programs will be created in the `dist` folder:

| Platform     | Path to binary                               |
|:-------------|:---------------------------------------------|
| `darwin-arm` | `./dist/sheetjs-neu/sheetjs-neu-mac_arm64`   |
| `win11-arm`  | `.\dist\sheetjs-neu\sheetjs-neu-win_x64.exe` |
| `linux-arm`  | `.\dist\sheetjs-neu\sheetjs-neu-linux_arm64` |

Run the generated app and confirm that Presidential data is displayed.

[^1]: See [`nativeAllowList`](https://neutralino.js.org/docs/configuration/neutralino.config.json#nativeallowlist-string) in the NeutralinoJS documentation
[^2]: See [`os.showOpenDialog`](https://neutralino.js.org/docs/api/os#osshowopendialogtitle-options) in the NeutralinoJS documentation
[^3]: See [`filesystem.readBinaryFile`](https://neutralino.js.org/docs/api/filesystem/#filesystemreadbinaryfilefilename) in the NeutralinoJS documentation
[^4]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^5]: See ["Utility Functions"](/docs/api/utilities/)
[^6]: See ["HTML Table Output" in "Utility Functions"](/docs/api/utilities/html#html-table-output)
[^7]: See [`os.showSaveDialog`](https://neutralino.js.org/docs/api/os#osshowsavedialogtitle-options) in the NeutralinoJS documentation
[^8]: See [`write` in "Writing Files"](/docs/api/write-options)
[^9]: See ["Supported Output Formats"](/docs/api/write-options#supported-output-formats)
[^10]: See [`filesystem.writeBinaryFile`](https://neutralino.js.org/docs/api/filesystem/#filesystemwritebinaryfilefilename-data) in the NeutralinoJS documentation
[^11]: See ["HTML Table Input" in "Utility Functions"](/docs/api/utilities/html#html-table-input)
[^12]: See [the list of supported `portable-file-dialogs`]
(https://github.com/samhocevar/portable-file-dialogs#status)