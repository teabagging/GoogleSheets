---
title: Electron
pagination_prev: demos/mobile/index
pagination_next: demos/cli/index
sidebar_position: 1
sidebar_custom_props:
  summary: Embedded NodeJS + Chromium
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The [NodeJS Module](/docs/getting-started/installation/nodejs) can be imported
from the main or the renderer thread.

The "Complete Example" creates an app that looks like the screenshots below:

<table><thead><tr>
  <th><a href="#complete-example">Windows</a></th>
  <th><a href="#complete-example">macOS</a></th>
  <th><a href="#complete-example">Linux</a></th>
</tr></thead><tbody><tr><td>

![Windows screenshot](pathname:///electron/ew.png)

</td><td>

![macOS screenshot](pathname:///electron/em.png)

</td><td>

![Linux screenshot](pathname:///electron/el.png)

</td></tr></tbody></table>

## Integration Details

Electron presents a `fs` module.  The `require('xlsx')` call loads the CommonJS
module, so `XLSX.readFile` and `XLSX.writeFile` work in the renderer thread.

### Reading Files

Electron offers 3 different ways to read files, two of which use Web APIs.

**File Input Element**

File input elements automatically map to standard Web APIs.

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

**Drag and Drop**

The [drag and drop snippet](/docs/solutions/input#example-user-submissions)
applies to DIV elements on the page.

For example, assuming a DIV on the page:

```html
<div id="drop">Drop a spreadsheet file here to see sheet data</div>
```

The event handler would process the event as if it were a web event:

```js
async function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();

  const file = e.dataTransfer.files[0];
  const data = await file.arrayBuffer();
  /* data is an ArrayBuffer */
  const workbook = XLSX.read(data);

  /* DO SOMETHING WITH workbook HERE */
}
document.getElementById("drop").addEventListener("drop", handleDrop, false);
```

**Electron API**

[`XLSX.readFile`](/docs/api/parse-options) reads workbooks from the file system.
`showOpenDialog` shows a Save As dialog and returns the selected file name.
Unlike the Web APIs, the `showOpenDialog` flow can be initiated by app code:

```js
/* from the renderer thread */
const electron = require('@electron/remote');

/* this function will show the open dialog and try to parse the workbook */
async function importFile() {
  /* show Save As dialog */
  const result = await electron.dialog.showOpenDialog({
    title: 'Select a file',
    filters: [{
      name: "Spreadsheets",
      extensions: ["xlsx", "xls", "xlsb", /* ... other formats ... */]
    }]
  });
  /* result.filePaths is an array of selected files */
  if(result.filePaths.length == 0) throw new Error("No file was selected!");
  // highlight-next-line
  return XLSX.readFile(result.filePaths[0]);
}
```

:::note pass

`showOpenDialog` originally returned an array of paths:

```js
var dialog = require('electron').remote.dialog;

function importFile(workbook) {
  var result = dialog.showOpenDialog({ properties: ['openFile'] });
  return XLSX.readFile(result[0]);
}
```

This method was renamed to `showOpenDialogSync` in Electron 6.

:::

### Writing Files

[`XLSX.writeFile`](/docs/api/write-options) writes workbooks to the file system.
`showSaveDialog` shows a Save As dialog and returns the selected file name:

```js
/* from the renderer thread */
const electron = require('@electron/remote');

/* this function will show the save dialog and try to write the workbook */
async function exportFile(workbook) {
  /* show Save As dialog */
  const result = await electron.dialog.showSaveDialog({
    title: 'Save file as',
    filters: [{
      name: "Spreadsheets",
      extensions: ["xlsx", "xls", "xlsb", /* ... other formats ... */]
    }]
  });
  /* write file */
  // highlight-next-line
  XLSX.writeFile(workbook, result.filePath);
}
```

:::note pass

`showSaveDialog` originally returned the selected path:

```js
var dialog = require('electron').remote.dialog;

function exportFile(workbook) {
  var result = dialog.showSaveDialog();
  XLSX.writeFile(workbook, result);
}
```

This method was renamed to `showSaveDialogSync` in Electron 6.

:::

## Complete Example

:::note Tested Deployments

This demo was tested in the following environments:

| OS and Version | Architecture | Electron | Date       |
|:---------------|:-------------|:---------|:-----------|
| macOS 14.4     | `darwin-x64` | `29.1.4` | 2024-03-15 |
| macOS 14.5     | `darwin-arm` | `30.0.8` | 2024-05-28 |
| Windows 10     | `win10-x64`  | `31.2.0` | 2024-07-12 |
| Windows 11     | `win11-x64`  | `31.2.0` | 2024-08-18 |
| Windows 11     | `win11-arm`  | `30.0.8` | 2024-05-28 |
| Linux (HoloOS) | `linux-x64`  | `29.1.4` | 2024-03-21 |
| Linux (Debian) | `linux-arm`  | `30.0.8` | 2024-05-28 |

:::

This demo includes a drag-and-drop box as well as a file input box, mirroring
the [SheetJS Data Preview Live Demo](https://oss.sheetjs.com/sheetjs/)

The core data in this demo is an editable HTML table.  The readers build up the
table using `sheet_to_html` (with `editable:true` option) and the writers scrape
the table using `table_to_book`.

The demo project is wired for `electron-forge` to build the standalone binary.

1) Download the demo files:

- [`package.json`](pathname:///electron/package.json) : project structure
- [`main.js`](pathname:///electron/main.js) : main process script
- [`index.html`](pathname:///electron/index.html) : window page
- [`index.js`](pathname:///electron/index.js) : script loaded in render context

:::caution pass

Right-click each link and select "Save Link As...".  Left-clicking a link will
try to load the page in your browser.  The goal is to save the file contents.

:::

These instructions can be run in a Terminal (bash) or Command Prompt window:

```bash
mkdir sheetjs-electron
cd sheetjs-electron
curl -LO https://docs.sheetjs.com/electron/package.json
curl -LO https://docs.sheetjs.com/electron/main.js
curl -LO https://docs.sheetjs.com/electron/index.html
curl -LO https://docs.sheetjs.com/electron/index.js
```

2) Install dependencies:

```bash
npm install
```

3) To verify the app works, run in the test environment:

```bash
npx -y electron .
```

The app will run.

4) To build a standalone app, run the builder:

```bash
npm run make
```

This will create a package in the `out\make` folder and a standalone binary.

:::caution pass

On Linux, the packaging step may require additional dependencies[^1]

:::

:::info pass

When the demo was last tested on Windows ARM, the generated binary targeted x64.
The program will run on ARM64 Windows.

:::

### Testing

5) Download [the test file `pres.numbers`](https://docs.sheetjs.com/pres.numbers)

6) Launch the generated application:

| Architecture | Command                                                       |
|:-------------|:--------------------------------------------------------------|
| `darwin-x64` |`open ./out/sheetjs-electron-darwin-x64/sheetjs-electron.app`  |
| `darwin-arm` |`open ./out/sheetjs-electron-darwin-arm64/sheetjs-electron.app`|
| `win10-x64`  |`.\out\sheetjs-electron-win32-x64\sheetjs-electron.exe`        |
| `win11-arm`  |`.\out\sheetjs-electron-win32-x64\sheetjs-electron.exe`        |
| `linux-x64`  |`./out/sheetjs-electron-linux-x64/sheetjs-electron`            |
| `linux-arm`  |`./out/sheetjs-electron-linux-arm64/sheetjs-electron`          |

#### Electron API

7) Click "Click here to select a file from your computer". With the file picker,
navigate to the Downloads folder and select `pres.numbers`.

The application should show data in a table.

8) Click "Export Data!" and click "Save" in the popup. By default, it will try
to write to `Untitled.xls` in the Downloads folder.

:::note pass

In some tests, the dialog did not have a default name.

If there is no default name, enter `Untitled.xls` and click "Save".

:::

The app will show a popup once the data is exported. Open the file in a
spreadsheet editor and compare the data to the table shown in the application.

#### Drag and Drop

9) Close the application, end the terminal process and re-launch (see step 6)

10) Open the Downloads folder in a file explorer or finder window.

11) Click and drag the `pres.numbers` file from the Downloads folder to the
bordered "Drop a spreadsheet file" box. The file data should be displayed.

#### File Input Element

12) Close the application, end the terminal process and re-launch (see step 6)

13) Click "Choose File". With the file picker, navigate to the Downloads folder
and select `pres.numbers`.


## Electron Breaking Changes

The first version of this demo used Electron 1.7.5.  The current demo includes
the required changes for Electron 30.0.8.

There are no Electron-specific workarounds in the library, but Electron broke
backwards compatibility multiple times.  A summary of changes is noted below.

:::caution pass

Electron 6 changed the return types of `dialog` API methods. The old `dialog`
methods have been renamed:

| Electron 1 - 5   | Electron 6           |
|:-----------------|:---------------------|
| `showOpenDialog` | `showOpenDialogSync` |
| `showSaveDialog` | `showSaveDialogSync` |
**This change was not properly documented!**

Electron 9 and later require the preference `nodeIntegration: true` in order to
`require('xlsx')` in the renderer process.

Electron 12 and later also require `worldSafeExecuteJavascript: true` and
`contextIsolation: true`.

Electron 14 and later must use `@electron/remote` instead of `remote`. An
`initialize` call is required to enable Developer Tools in the window.

:::

[^1]: See ["Makers"](https://www.electronforge.io/config/makers) in the Electron Forge documentation. On Linux, the demo generates `rpm` and `deb` distributables. On Arch Linux and the Steam Deck, `sudo pacman -Syu rpm-tools dpkg fakeroot` installed required packages.