---
title: Data in Quasar Apps
sidebar_label: Quasar
description: Build data-intensive mobile apps with Quasar and Cordova. Seamlessly integrate spreadsheets into your app using SheetJS. Let data in your Excel spreadsheets shine.
pagination_prev: demos/static/index
pagination_next: demos/desktop/index
sidebar_position: 3
sidebar_custom_props:
  summary: VueJS + Web View
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Quasar](https://quasar.dev/) is a VueJS framework for building iOS and Android
apps with the Cordova platform.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Quasar and SheetJS to process data and generate spreadsheets.
We'll explore how to load SheetJS in an Quasar app and use Quasar and Cordova
features to extract data from, and write data to, spreadsheets on the device.

The ["Demo"](#demo) creates an app that looks like the screenshots below:

<table><thead><tr>
  <th><a href="#demo">iOS</a></th>
  <th><a href="#demo">Android</a></th>
</tr></thead><tbody><tr><td>

![iOS screenshot](pathname:///quasar/ios.png)

</td><td>

![Android screenshot](pathname:///quasar/and.png)

</td></tr></tbody></table>

:::note Tested Deployments

This demo was tested in the following environments:

**Real Devices**

| OS         | Device              | Quasar   | Date       |
|:-----------|:--------------------|:---------|:-----------|
| Android 30 | NVIDIA Shield       | `2.16.4` | 2024-06-09 |
| iOS 15.1   | iPad Pro            | `2.16.4` | 2024-06-09 |

**Simulators**

| OS         | Device              | Quasar   | Dev Platform | Date       |
|:-----------|:--------------------|:---------|:-------------|:-----------|
| Android 34 | Pixel 3a            | `2.16.4` | `darwin-arm` | 2024-06-09 |
| iOS 17.5   | iPhone SE (3rd gen) | `2.16.4` | `darwin-arm` | 2024-06-09 |

:::

## Integration Details

The [SheetJS NodeJS Module](/docs/getting-started/installation/nodejs) can be
imported from any component or script in the app.

This demo will use the Quasar ViteJS starter project with VueJS and Cordova.
The starter places the backing Cordova project in the `src-cordova` folder.

The complete solution uses `cordova-plugin-file` for file operations.  It can
be installed from the Cordova folder:

```bash
cd src-cordova
cordova plugin add cordova-plugin-file
cd ..
```

### Reading data

The QFile[^1] component presents an API reminiscent of File Input elements:

```html
<q-file label="Load File" filled label-color="orange" @input="updateFile"/>
```

When binding to the `input` element, the callback receives an `Event` object.
Using standard DOM operations, the file data can be pulled into an `ArrayBuffer`
and parsed using the SheetJS `read` method[^2]. `read` returns a workbook[^3]
object that holds data and metadata for each worksheet.

This snippet reads a workbook, pulls the first worksheet, generates an array of
objects using the SheetJS `sheet_to_json`[^4] method, and updates state:

```ts
import { read } from 'xlsx';

// assuming `todos` is a standard VueJS `ref`
async function updateFile(v) { try {
  // `v.target.files[0]` is the desired file object
  const files = (v.target as HTMLInputElement).files;
  if(!files || files.length == 0) return;

  // read first file
  const wb = read(await files[0].arrayBuffer());

  // get data of first worksheet as an array of objects
  const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

  // update state
  todos.value = data.map(row => ({id: row.Index, content: row.Name}));

} catch(e) { console.log(e); } }
```

### Writing data

Starting from an array of objects, the SheetJS `json_to_sheet` method[^5]
generates a SheetJS worksheet object. The `book_append_sheet` and `book_new`
helper functions[^6] create a SheetJS workbook object that can be exported:

```js
import { utils } from 'xlsx';

// assuming `todos` is a VueJS ref whose value is an array of objects
const ws = utils.json_to_sheet(todos.value);
const wb = utils.book_new();
utils.book_append_sheet(wb, ws, "SheetJSQuasar");
```

The SheetJS `write` function[^7] with the option `type: "buffer"` will generate
`Uint8Array` objects that can be converted to blobs and exported:

```js
import { write } from 'xlsx';

// on iOS and android, `XLSX.write` with type "buffer" returns a `Uint8Array`
const u8: Uint8Array = write(wb, {bookType: "xlsx", type: "buffer"});
```

The `cordova-plugin-file` API writes the data to the filesystem. The code uses
the File and Directory Entries API[^8]:

```ts
// Request filesystem access for persistent storage
window.requestFileSystem(window.PERSISTENT, 0, function(fs) {
  // Request a handle to "SheetJSQuasar.xlsx", making a new file if necessary
  fs.root.getFile("SheetJSQuasar.xlsx", {create: true}, entry => {
    // Request a FileWriter for writing data
    entry.createWriter(writer => {
      // The FileWriter API needs an actual Blob
      const data = new Blob([u8], {type: "application/vnd.ms-excel"});
      // This callback is called if the write is successful
      writer.onwriteend = () => {
        // TODO: show a dialog
      };
      // writer.onerror will be invoked if there is an error in writing

      // write the data
      writer.write(data);
    });
  });
});
```

## Demo

The demo draws from the ViteJS example.  Familiarity with VueJS and TypeScript
is assumed.

0) Ensure all of the dependencies are installed.  Install the CLI globally:

```bash
npm i -g @quasar/cli cordova
```

(you may need to run `sudo npm i -g` if there are permission issues)

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

Quasar requires Java 17

</details>

1) Create a new app:

```bash
npm init quasar
```

<!-- spellchecker-disable -->

When prompted:

- "What would you like to build?": `App with Quasar CLI, let's go!`
- "Project folder": `SheetJSQuasar`
- "Pick Quasar version": `Quasar v2 (Vue 3 | latest and greatest)`
- "Pick script type": `Typescript`
- "Pick Quasar App CLI variant": `Quasar App CLI with Vite`
- "Package name": (press <kbd>Enter</kbd>, it will use the default `sheetjsquasar`)
- "Project product name": `SheetJSQuasar`
- "Project description": `SheetJS + Quasar`
- "Author": (press <kbd>Enter</kbd>, it will use your git config settings)
- "Pick a Vue component style": `Composition API`
- "Pick your CSS preprocessor": `None`
- "Check the features needed for your project": Deselect everything (scroll down to each selected item and press <kbd>Space</kbd>)
- "Install project dependencies": `Yes, use npm`

2) Install dependencies:

<!-- spellchecker-enable -->

<CodeBlock language="bash">{`\
cd SheetJSQuasar
npm i
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

3) Set up Cordova:

```bash
quasar mode add cordova
```

When prompted, enter the app id `org.sheetjs.quasar`.

It will create a new `src-cordova` folder. Continue in that folder:

```bash
cd src-cordova
cordova platform add ios
cordova plugin add cordova-plugin-wkwebview-engine
cordova plugin add cordova-plugin-file
```

:::note pass

If there is an error `Could not load API for iOS project`, it needs to be reset:

```bash
cordova platform rm ios
cordova platform add ios
cordova plugin add cordova-plugin-file
```

:::

Return to the project directory:

```bash
cd ..
```

4) Enable file sharing and make the documents folder visible in the iOS app.
The following lines must be added to `src-cordova/platforms/ios/SheetJSQuasar/SheetJSQuasar-Info.plist`:

```xml title="src-cordova/platforms/ios/SheetJSQuasar/SheetJSQuasar-Info.plist (add to file)"
<plist version="1.0">
<dict>
<!-- highlight-start -->
  <key>UIFileSharingEnabled</key>
  <true/>
  <key>LSSupportsOpeningDocumentsInPlace</key>
  <true/>
<!-- highlight-end -->
  <key>CFBundleDevelopmentRegion</key>
```

(The root element of the document is `plist` and it contains one `dict` child)


5) Start the development server:

```bash
quasar dev -m ios
```

If prompted to select an external IP, press <kbd>Enter</kbd>.

:::caution pass

If the app is blank or not refreshing, delete the app and close the simulator,
then restart the development process.

:::

6) Add the Dialog plugin to `quasar.config.js`:

```js title="quasar.config.js (add highlighted line)"
    framework: {
      config: {},
// ...
      // Quasar plugins
      // highlight-next-line
      plugins: ['Dialog']
    },
```

7) In the template section of `src/pages/IndexPage.vue`, replace the example
   with a Table, Save button and Load file picker component:

```html title="src/pages/IndexPage.vue (change highlighted lines)"
<template>
  <q-page class="row items-center justify-evenly">
    <!-- highlight-start -->
    <q-table :rows="todos" />
    <q-btn-group>
      <q-file label="Load File" filled label-color="orange" @input="updateFile"/>
      <q-btn label="Save File" @click="saveFile" />
    </q-btn-group>
    <!-- highlight-end -->
  </q-page>
</template>
```

This uses two functions that should be added to the component script:

```ts title="src/pages/IndexPage.vue (add highlighted lines)"
    const meta = ref<Meta>({
      totalCount: 1200
    });
// highlight-start
    function saveFile() {
    }
    async function updateFile(v: Event) {
    }
    return { todos, meta, saveFile, updateFile };
// highlight-end
  }
});
```

The app should now show two buttons at the bottom:

![Quasar Step 6](pathname:///mobile/quasar6.png)

:::caution pass

If the app is blank or not refreshing, delete the app and close the simulator,
then restart the development process.

:::

8) Wire up the `updateFile` function:

```ts title="src/pages/IndexPage.vue (add highlighted lines)"
import { defineComponent, ref } from 'vue';
// highlight-start
import { read, write, utils } from 'xlsx';
import { useQuasar } from 'quasar';
// highlight-end

export default defineComponent({
// ...
// highlight-start
    const $q = useQuasar();
    function dialogerr(e: Error) { $q.dialog({title: "Error!", message: e.message || String(e)}); }
// highlight-end
    function saveFile() {
    }
    async function updateFile(v: Event) {
// highlight-start
      try {
        const files = (v.target as HTMLInputElement).files;
        if(!files || files.length == 0) return;

        const wb = read(await files[0].arrayBuffer());

        const data = utils.sheet_to_json<any>(wb.Sheets[wb.SheetNames[0]]);
        todos.value = data.map(row => ({id: row.Index, content: row.Name}));
      } catch(e) { dialogerr(e); }
// highlight-end
    }
```

To test that reading works:

- Download https://docs.sheetjs.com/pres.numbers
- In the simulator, click the Home icon to return to the home screen
- Click on the "Files" icon
- Click and drag `pres.numbers` from a Finder window into the simulator.

![Quasar Step 7 save file](pathname:///mobile/quasar7a.png)

- Make sure "On My iPhone" is highlighted and select "Save"
- Click the Home icon again then select the `SheetJSQuasar` app
- Click the "Load" button, then select "Choose File" and select `pres`:

![Quasar Step 7 load file](pathname:///mobile/quasar7b.png)

Once selected, the screen should refresh with new contents.

9) Wire up the `saveFile` function:

```ts title="src/pages/IndexPage.vue (add highlighted lines)"
    function saveFile() {
// highlight-start
      /* generate workbook from state */
      const ws = utils.json_to_sheet(todos.value);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "SheetJSQuasar");
      const u8: Uint8Array = write(wb, {bookType: "xlsx", type: "buffer"});
      const dir: string = $q.cordova.file.documentsDirectory || $q.cordova.file.externalApplicationStorageDirectory;

      /* save to file */
      window.requestFileSystem(window.PERSISTENT, 0, function(fs) {
        try {
          fs.root.getFile("SheetJSQuasar.xlsx", {create: true}, entry => {
            const msg = `File stored at ${dir} ${entry.fullPath}`;
            entry.createWriter(writer => {
              try {
                const data = new Blob([u8], {type: "application/vnd.ms-excel"});
                writer.onwriteend = () => {
                  try {
                    $q.dialog({title: "Success!", message: msg});
                  } catch(e) { dialogerr(e); }
                };
                writer.onerror = dialogerr;
                writer.write(data);
              } catch(e) { dialogerr(e); }
            }, dialogerr);
          }, dialogerr);
        } catch(e) { dialogerr(e) }
      }, dialogerr);
// highlight-end
    }
```

The page should revert to the old contents.

To test that writing works:

- Click "Save File".  You will see a popup with a location:

![Quasar Step 8](pathname:///mobile/quasar8.png)

- Find the file and verify the contents are correct.  Run in a new terminal:

```bash
find ~/Library/Developer/CoreSimulator -name SheetJSQuasar.xlsx |
  while read x; do echo "$x"; npx xlsx-cli "$x"; done
```

Since the contents reverted, you should see

```
SheetJSQuasar
id,content
1,ct1
2,ct2
3,ct3
4,ct4
5,ct5
```

- Use "Load File" to select `pres.numbers` again.  Wait for the app to refresh.

- Click "Save File", then re-run the command:

```bash
find ~/Library/Developer/CoreSimulator -name SheetJSQuasar.xlsx |
  while read x; do echo "$x"; npx xlsx-cli "$x"; done
```

The contents from `pres.numbers` should show up now, with a new header row:

```
SheetJSQuasar
id,content
42,Bill Clinton
43,GeorgeW Bush
44,Barack Obama
45,Donald Trump
46,Joseph Biden
```

**Android**

10) Create the Android project:

```bash
cd src-cordova
cordova platform add android
cd ..
```

11) Start the simulator:

```bash
quasar dev -m android
```

If prompted to select an external IP, press <kbd>Enter</kbd>.

:::caution pass

If the app is blank or not refreshing, delete the app and close the simulator,
then restart the development process.

:::

:::warning pass

On Windows, the command failed with a Gradle error

```
Could not find an installed version of Gradle either in Android Studio,
or on your system to install the gradle wrapper. Please include gradle
in your path, or install Android Studio
```

[Gradle](https://gradle.org/) (the complete version) must be extracted and the
`bin` folder must be added to the user PATH variable. After adding to PATH,
launch a new PowerShell or CMD window and run the command.

:::

To test that reading works:

- Click and drag `pres.numbers` from a Finder window into the simulator.
- Tap "Load", tap the `≡` icon, tap "Downloads" and select `pres.numbers`.

To test that writing works:

- Tap "Save File".  You will see a popup with a location.

- Pull the file from the simulator and verify the contents:

```bash
adb exec-out run-as org.sheetjs.quasar cat files/files/SheetJSQuasar.xlsx > /tmp/SheetJSQuasar.xlsx
npx xlsx-cli /tmp/SheetJSQuasar.xlsx
```

**iOS Device**

12) Close all open emulators and simulators.

13) Disconnect any iOS or Android devices connected to the computer.

14) Connect the iOS device to the computer.

15) Open the Xcode project:

```bash
open src-cordova/platforms/ios/SheetJSQuasar.xcodeproj
```

Select "SheetJSQuasar" in the Navigator. In the main pane, select "Signing &amp;
Capabilities" and ensure a Team is selected. Save and close the project.

16) Start the dev process:

```bash
quasar dev -m ios
```

If prompted to select an external IP, press <kbd>Enter</kbd>.

17) Test the application:

- Press the Home button (or swipe up with one finger) and switch to Safari.
- Download https://docs.sheetjs.com/pres.numbers
- Press the Home button (or swipe up with one finger) and select the `SheetJSQuasar` app
- Tap the "Load" button, then select "Choose File" and select the downloaded `pres.numbers`

The table will update with new data.

- Tap "Save File"
- Press the Home button (or swipe up with one finger) and switch to Files.
- Tap `<` until the main "Browse" window is displayed, then select "On My iPhone"
- Look for the "SheetJSQuasar" folder and tap `SheetJSQuasar.xlsx`.

If Numbers is installed on the device, it will display the contents of the new file.

**Android Device**

18) Close all open emulators and simulators.

19) Disconnect any iOS or Android devices connected to the computer.

20) Connect the Android device to the computer.

21) Start the dev process:

```bash
quasar dev -m android
```

If prompted to select an external IP, press <kbd>Enter</kbd>.

22) Test the application:

- Press the Home button (or swipe up with one finger) and switch to Browser.
- Download https://docs.sheetjs.com/pres.numbers
- Press the Home button (or swipe up with one finger) and select the `SheetJSQuasar` app
- Tap the "Load" button, then select "Choose File" and select the downloaded `pres.numbers`

The table will update with new data.

:::warning pass

The "Save File" process will write files. However, Android 30+ requires special
methods ("Storage Access Framework") that are not implemented in Quasar.

:::


[^1]: See ["File Picker"](https://quasar.dev/vue-components/file-picker) in the Quasar documentation.
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See ["SheetJS Data Model"](/docs/csf/) for more details on workbooks, worksheets, and other concepts.
[^4]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^5]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^6]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^7]: See [`write` in "Writing Files"](/docs/api/write-options)
[^8]: See [`requestFileSystem`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestFileSystem) in the MDN Web Docs for more details.