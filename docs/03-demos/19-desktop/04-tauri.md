---
title: Data Wrangling in Tauri Apps
sidebar_label: Tauri
description: Build data-intensive desktop apps using Tauri. Seamlessly integrate spreadsheets into your app using SheetJS. Modernize Excel-powered business processes with confidence.
pagination_prev: demos/mobile/index
pagination_next: demos/cli/index
sidebar_position: 4
sidebar_custom_props:
  summary: Webview + Rust Backend
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const y = {style: {color:"gold"}};
export const g = {style: {color:"green"}};
export const B = {style: {fontWeight:"bold"}};

[Tauri](https://tauri.app/) is a modern toolkit for building desktop apps. Tauri
apps leverage platform-native browser engines to build lightweight programs.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Tauri and SheetJS to pull data from a spreadsheet and display the
data in the app. We'll explore how to load SheetJS in a Tauri app and exchange
file data between the JavaScript frontend and Rust backend.

The ["Complete Example"](#complete-example) section covers a complete desktop
app to read and write workbooks. The app will look like the screenshots below:

<table><thead><tr>
  <th><a href="#complete-example">Windows</a></th>
  <th><a href="#complete-example">macOS</a></th>
  <th><a href="#complete-example">Linux</a></th>
</tr></thead><tbody><tr><td>

![Windows screenshot](pathname:///tauri/win10.png)

</td><td>

![macOS screenshot](pathname:///tauri/macos.png)

</td><td>

![Linux screenshot](pathname:///tauri/linux.png)

</td></tr></tbody></table>

## Integration Details

The [SheetJS NodeJS Module](/docs/getting-started/installation/nodejs) can be
installed and imported from JavaScript code.

:::note pass

Tauri currently does not provide the equivalent of NodeJS `fs` module.  The raw
`@tauri-apps/api` methods used in the examples are not expected to change.

:::

For security reasons, Tauri apps must explicitly enable system features.[^1]
They are enabled in `src-tauri/tauri.conf.json` in the `allowlist` subsection of
the `tauri` section of the config.

- The `fs` entitlement[^2] enables reading and writing file data.

```js title="src-tauri/tauri.conf.json"
  "tauri": {
    "allowlist": {
      //highlight-start
      "fs": {
        "all": true
      }
      // highlight-end
```

- The `dialog` entitlement[^3] enables the open and save dialog methods.

```js title="src-tauri/tauri.conf.json"
  "tauri": {
    "allowlist": {
      //highlight-start
      "dialog": {
        "all": true
      }
      // highlight-end
```

- The `http` entitlement[^4] enables downloading files. Note that `http` is not
  needed for reading or writing files in the local filesystem.

```json title="src-tauri/tauri.conf.json"
  "tauri": {
    "allowlist": {
      //highlight-start
      "http": {
        "all": true,
        "request": true,
        "scope": ["https://**"]
      }
      // highlight-end
```

### Reading Files

There are three steps to reading files:

1) Show an open file dialog to allow users to select a path. The `open` method
   in `@tauri-apps/api/dialog`[^5] simplifies this process.

2) Read raw data from the selected file using the `readBinaryFile` method in
   `@tauri-apps/api/fs`[^6]. This method resolves to a standard `Uint8Array`

3) Parse the data with the SheetJS `read` method[^7]. This method returns a
   SheetJS workbook object.

The following code example defines a single function `openFile` that performs
all three steps and returns a SheetJS workbook object:

```js
import { read } from 'xlsx';
import { open } from '@tauri-apps/api/dialog';
import { readBinaryFile } from '@tauri-apps/api/fs';

const filters = [
  {name: "Excel Binary Workbook", extensions: ["xlsb"]},
  {name: "Excel Workbook", extensions: ["xlsx"]},
  {name: "Excel 97-2004 Workbook", extensions: ["xls"]},
  // ... other desired formats ...
];

async function openFile() {
  /* show open file dialog */
  const selected = await open({
    title: "Open Spreadsheet",
    multiple: false,
    directory: false,
    filters
  });

  /* read data into a Uint8Array */
  const d = await readBinaryFile(selected);

  /* parse with SheetJS */
  const wb = read(d);
  return wb;
}
```

At this point, standard SheetJS utility functions[^8] can extract data from the
workbook object. The demo includes a button that calls `sheet_to_json`[^9] to
generate an array of arrays of data.

<Tabs groupId="framework">
  <TabItem value="vuejs" label="VueJS">

The following snippet uses the VueJS framework:

```js title="VueJS sample"
import { utils } from 'xlsx';
import { shallowRef } from 'vue';
const data = shallowRef([[]]); // update data by setting `data.value`

const open_button_callback = async() => {
  const wb = await openFile();

  /* get the first worksheet */
  // highlight-start
  const ws = wb.Sheets[wb.SheetNames[0]];
  // highlight-end

  /* get data from the first worksheet */
  // highlight-start
  const array = utils.sheet_to_json(ws, { header: 1 });
  // highlight-end
  data.value = array;
};
```

  </TabItem>
  <TabItem value="kaioken" label="Kaioken" default>

The following snippet shows a simple Kaioponent:

```tsx title="Kaioponent for importing data"
import { utils } from 'xlsx';
import { useState } from 'kaioken';

function SheetJSImportKaioponent() {
  const [data, setData] = useState<any[][]>([]);

  const open_callback = async() => {
    const wb = await openFile();

    /* get the first worksheet */
    // highlight-start
    const ws = wb.Sheets[wb.SheetNames[0]];
    // highlight-end

    /* get data from the first worksheet */
    // highlight-start
    const array = utils.sheet_to_json(ws, { header: 1 });
    // highlight-end
    setData(array);
  };

  return ( <>
    <button type="button" onclick={open_callback}>Load Data</button>
    <table><tbody>{data.map((row) =>
      <tr>{row.map((cell) => <td>{cell}</td>)}</tr>
    )}</tbody></table>
  </> );
}
```

  </TabItem>
</Tabs>

### Writing Files

There are three steps to writing files:

1) Show a save file dialog to allow users to select a path. The `save` method
   in `@tauri-apps/api/dialog`[^10] simplifies this process.

2) Write the data with the SheetJS `write` method[^11]. The output book type can
   be inferred from the selected file path. Using the `buffer` output type[^12],
   the method will return a `Uint8Array` object that plays nice with Tauri.

3) Write the data using `writeBinaryFile` in `@tauri-apps/api/fs`[^13].

The following code example defines a single function `saveFile` that performs
all three steps starting from a SheetJS workbook object:

```js
import { write } from 'xlsx';
import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';

const filters = [
  {name: "Excel Binary Workbook", extensions: ["xlsb"]},
  {name: "Excel Workbook", extensions: ["xlsx"]},
  {name: "Excel 97-2004 Workbook", extensions: ["xls"]},
  // ... other desired formats ...
];

async function saveFile(wb) {
  /* show save file dialog */
  const selected = await save({
    title: "Save to Spreadsheet",
    filters
  });
  if(!selected) return;

  /* Generate workbook */
  const bookType = selected.slice(selected.lastIndexOf(".") + 1);
  const d = write(wb, {type: "buffer", bookType});

  /* save data to file */
  await writeBinaryFile(selected, d);
}
```

The demo includes a button that calls `aoa_to_sheet`[^14] to generate a sheet
from array of arrays of data. A workbook is constructed using `book_new` and
`book_append_sheet`[^15].

<Tabs groupId="framework">
  <TabItem value="vuejs" label="VueJS">

The following snippet uses the VueJS framework:

```js title="VueJS sample"
import { utils } from 'xlsx';
import { shallowRef } from 'vue';
const data = shallowRef([[]]); // `data.value` is an array of arrays

const save_button_callback = async() => {
  /* generate worksheet from the data */
  // highlight-start
  const ws = utils.aoa_to_sheet(data.value);
  // highlight-end

  /* create a new workbook object */
  // highlight-start
  const wb = utils.book_new();
  // highlight-end

  /* append the worksheet to the workbook using the sheet name "SheetJSTauri" */
  // highlight-start
  utils.book_append_sheet(wb, ws, "SheetJSTauri");
  // highlight-end

  await saveFile(wb);
}
```

  </TabItem>
  <TabItem value="kaioken" label="Kaioken" default>

The following snippet shows a simple Kaioponent:

```js title="Kaioponent for exporting data"
import { utils } from 'xlsx';
import { useState } from 'kaioken';

function SheetJSExportKaioponent() {
  const [data, setData] = useState<any[][]>(["SheetJS".split(""), "Kaioken".split("")]);

  const save_callback = async() => {
    /* generate worksheet from the data */
    // highlight-start
    const ws = utils.aoa_to_sheet(data);
    // highlight-end

    /* create a new workbook object */
    // highlight-start
    const wb = utils.book_new();
    // highlight-end

    /* append the worksheet to the workbook using the sheet name "SheetJSTauri" */
    // highlight-start
    utils.book_append_sheet(wb, ws, "SheetJSTauri");
    // highlight-end

    await saveFile(wb);
  }

  return ( <button type="button" onclick={save_callback}>Save Data</button> );
}
```

  </TabItem>
</Tabs>

## Complete Example

:::note Tested Deployments

This demo was tested in the following environments:

| OS and Version | Architecture | Tauri     | Date       |
|:---------------|:-------------|:----------|:-----------|
| macOS 14.4     | `darwin-x64` | `v1.5.11` | 2024-04-20 |
| macOS 14.5     | `darwin-arm` | `v1.5.14` | 2024-05-26 |
| Windows 10     | `win10-x64`  | `v1.5.11` | 2024-03-24 |
| Windows 11     | `win11-arm`  | `v1.5.14` | 2024-05-28 |
| Linux (HoloOS) | `linux-x64`  | `v1.5.11` | 2024-03-21 |
| Linux (Debian) | `linux-arm`  | `v1.5.14` | 2024-05-28 |

:::

0) Read Tauri "Getting Started" guide and install prerequisites.[^16]

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

At a high level, the following software is required for building Tauri apps:

- a native platform-specific C/C++ compiler (for example, macOS requires Xcode)
- a browser engine integration (for example, linux requires `webkit2gtk`)
- [Rust](https://www.rust-lang.org/tools/install)

The platform configuration can be verified by running:

```bash
npx @tauri-apps/cli info
```

If required dependencies are installed, the output will show a checkmark next to
"Environment". The output from the most recent macOS test is shown below:

<pre>
<span {...g}>[✔]</span> <span style={{...y.style,...B.style}}>Environment</span>
{`    `}<span {...g}>-</span> <span {...B}>OS</span>: Mac OS 14.4.1 X64
{`    `}<span {...g}>✔</span> <span {...B}>Xcode Command Line Tools</span>: installed
{`    `}<span {...g}>✔</span> <span {...B}>rustc</span>: 1.77.2 (25ef9e3d8 2024-04-09)
{`    `}<span {...g}>✔</span> <span {...B}>cargo</span>: 1.77.2 (e52e36006 2024-03-26)
{`    `}<span {...g}>✔</span> <span {...B}>rustup</span>: 1.27.0 (bbb9276d2 2024-03-08)
{`    `}<span {...g}>✔</span> <span {...B}>Rust toolchain</span>: stable-x86_64-apple-darwin (default)
{`    `}<span {...g}>-</span> <span {...B}>node</span>: 20.12.1
{`    `}<span {...g}>-</span> <span {...B}>npm</span>: 10.5.0
{`    `}<span {...g}>-</span> <span {...B}>bun</span>: 1.1.4
</pre>

:::caution pass

When the demo was last tested on ARM64 macOS, the output mentioned `X64`. The
build step will correctly detect the platform architecture.

:::

</details>

1) Create a new Tauri app:

<Tabs groupId="framework">
  <TabItem value="vuejs" label="VueJS">

```bash
npm create tauri-app@latest -- -m npm -t vue-ts SheetJSTauri -y
```

  </TabItem>
  <TabItem value="kaioken" label="Kaioken" default>

:::note pass

There is no official Tauri Kaioken template. This demo starts from the vanilla
TypeScript template and manually wires Kaioken

:::

```bash
npm create tauri-app@latest -- -m npm -t vanilla-ts SheetJSTauri -y
```

  </TabItem>
</Tabs>

2) Enter the directory and install dependencies:

<CodeBlock language="bash">{`\
cd SheetJSTauri
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz
npm i --save @tauri-apps/api
npm i --save-dev @tauri-apps/cli`}
</CodeBlock>

<Tabs groupId="framework">
  <TabItem value="vuejs" label="VueJS">

  </TabItem>
  <TabItem value="kaioken" label="Kaioken" default>

Install the Kaioken dependencies:

```bash
npm add kaioken --save
npm add vite-plugin-kaioken -D --save
```

  </TabItem>
</Tabs>

3) Add the highlighted lines to `src-tauri/tauri.conf.json` in the
   `tauri.allowlist` section:

```json title="src-tauri/tauri.conf.json (add highlighted lines)"
  "tauri": {
    "allowlist": {
// highlight-start
      "http": {
        "all": true,
        "request": true,
        "scope": ["https://**"]
      },
      "dialog": {
        "all": true
      },
      "fs": {
        "all": true
      },
// highlight-end
```

In the same file, look for `"title"` and change the value to `SheetJS x Tauri`:

```json title="src-tauri/tauri.conf.json (edit highlighted line)"
      {
      // highlight-next-line
        "title": "SheetJS x Tauri",
        "width": 800,
```

In the same file, look for `"identifier"` and change the value to `com.sheetjs.tauri`:

```json title="src-tauri/tauri.conf.json (edit highlighted line)"
      "targets": "all",
      // highlight-next-line
      "identifier": "com.sheetjs.tauri",
      "icon": [
```

<Tabs groupId="framework">
  <TabItem value="vuejs" label="VueJS">

4) Download [`App.vue`](pathname:///tauri/App.vue) and replace `src/App.vue`
   with the downloaded script.

```bash
curl -o src/App.vue https://docs.sheetjs.com/tauri/App.vue
```

  </TabItem>
  <TabItem value="kaioken" label="Kaioken" default>

4) Wire up Kaioken to the Tauri app:

- Add the highlighted lines to `vite.config.ts`:

```ts title="vite.config.ts (add highlighted lines)"
import { defineConfig } from "vite";
// highlight-next-line
import kaioken from "vite-plugin-kaioken";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
// highlight-start
  plugins: [kaioken()],
// highlight-end
```

- Edit `tsconfig.json`. In `compilerOptions` add the option `"jsx": "preserve"`:

```js title="tsconfig.json (add highlighted line)"
{
  "compilerOptions": {
// highlight-next-line
    "jsx": "preserve",
```

- Replace `index.html` with the following codeblock:

```html title="index.html"
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="/src/styles.css" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SheetJS x Tauri</title>
    <script type="module" src="/src/main.ts" defer></script>
  </head>

  <body>
    <div id="container" class="container"></div>
  </body>
</html>
```

- Add the following lines to `src/styles.css`:

```css title="src/styles.css (add to end)"
.logo {
  padding: 0px;
  height: 64px; width: 64px;
  vertical-align: middle;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.centre { text-align: center; }
table.center {
  margin-left: auto;
  margin-right: auto;
}
```

- Replace `src/main.ts` with the following codeblock:

```ts title="src/main.ts"
import { mount } from "kaioken";
import App from "./App";

const root = document.getElementById("container");
mount(App, root!);
```

- Download [`App.tsx`](pathname:///tauri/App.tsx) and save to `src/App.tsx`:

```bash
curl -o src/App.tsx https://docs.sheetjs.com/tauri/App.tsx
```

  </TabItem>
</Tabs>

5) Build the app with

```bash
npm run tauri build
```

At the end, it will print the path to the generated installer.

:::info pass

If the build fails, see ["Troubleshooting"](#troubleshooting) for more details.

:::

6) Run the program.

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

Depending on the version of Tauri, the command may be

```bash
./src-tauri/target/release/SheetJSTauri
```

or

```bash
./src-tauri/target/release/sheet-js-tauri
```

or

```bash
./src-tauri/target/release/sheetjstauri
```

  </TabItem>
  <TabItem value="win" label="Windows">

```powershell
.\src-tauri\target\release\SheetJSTauri.exe
```

  </TabItem>
</Tabs>

The following features should be manually verified:

- When it is loaded, the app will download https://docs.sheetjs.com/pres.numbers
  and display the data in a table.
- Clicking "Save Data" will show a save dialog. After selecting a path and name,
  the app will write a file. That file can be opened in a spreadsheet editor.
- Edit the file in a spreadsheet editor, then click "Load Data" and select the
  edited file. The table will refresh with new contents.

#### Troubleshooting

:::note pass

During the last Linux ARM64 test, the build failed to create an AppImage:

```
        Error [tauri-cli-node] failed to bundle project: error running appimage.sh
```

This is a known Tauri AppImage packaging bug. Since the actual application and
the `.deb` distributable are created, the error can be ignored.

:::

:::note pass

During the last Linux x64 test, the build failed with the error message:

```
'openssl/opensslv.h' file not found
```

OpenSSL must be installed. On Arch Linux and HoloOS (Steam Deck):

```bash
sudo pacman -S openssl
```

:::

:::note pass

In some macOS tests, the build failed with the following error message:

```
       Error failed to bundle project: error running bundle_dmg.sh
```

The root cause of the error can be discovered by running

```bash
npm run tauri build -- --verbose
```

The most recent test failed with a message:

```
execution error: Not authorized to send Apple events to Finder
```

This error was resolved by allowing Terminal to control Finder.

In the "System Settings" app, select "Privacy & Security" in the left column and
select "Automation" in the body. Look for "Terminal", expand the section, and enable "Finder".

:::

:::note pass

In some tests, the fonts did not match the screenshots.

**The Inter font static TTFs must be manually downloaded and installed.**[^17]

:::

[^1]: See ["Security"](https://tauri.app/v1/references/architecture/security#allowing-api) in the Tauri documentation
[^2]: See [`FsAllowlistConfig`](https://tauri.app/v1/api/config/#fsallowlistconfig) in the Tauri documentation
[^3]: See [`DialogAllowlistConfig`](https://tauri.app/v1/api/config/#dialogallowlistconfig) in the Tauri documentation
[^4]: See [`HttpAllowlistConfig`](https://tauri.app/v1/api/config/#httpallowlistconfig) in the Tauri documentation
[^5]: See [`dialog`](https://tauri.app/v1/api/js/dialog/#open) in the Tauri documentation
[^6]: See [`fs`](https://tauri.app/v1/api/js/fs#readbinaryfile) in the Tauri documentation
[^7]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^8]: See ["Utility Functions"](/docs/api/utilities/)
[^9]: See ["Array Output" in "Utility Functions"](/docs/api/utilities/array#array-output)
[^10]: See [`dialog`](https://tauri.app/v1/api/js/dialog/#save) in the Tauri documentation
[^11]: See [`write` in "Writing Files"](/docs/api/write-options)
[^12]: See ["Supported Output Formats"](/docs/api/write-options#supported-output-formats)
[^13]: See [`fs`](https://tauri.app/v1/api/js/fs#writebinaryfile) in the Tauri documentation
[^14]: See ["Array of Arrays Input" in "Utility Functions"](/docs/api/utilities/array#array-of-arrays-input)
[^15]: See ["Workbook Helpers" in "Utility Functions"](/docs/api/utilities/wb)
[^16]: See ["Prerequisites"](https://tauri.app/v1/guides/getting-started/prerequisites) in the Tauri documentation
[^17]: Click "Get font" in the [Inter Google Fonts listing](https://fonts.google.com/specimen/Inter)