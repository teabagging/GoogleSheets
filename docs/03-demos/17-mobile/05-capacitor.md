---
title: Storing Sheets with CapacitorJS
sidebar_label: CapacitorJS
pagination_prev: demos/static/index
pagination_next: demos/desktop/index
sidebar_position: 5
sidebar_custom_props:
  summary: JS + Web View
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[CapacitorJS](https://capacitorjs.com/) is a mobile app runtime for building iOS
and Android apps.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses CapacitorJS and SheetJS to process data and export spreadsheets.
We'll explore how to load SheetJS in an CapacitorJS app and use APIs and plugins
to extract data from, and write data to, spreadsheet files on the device.

The ["Demo"](#demo) creates an app that looks like the screenshots below:

<table><thead><tr>
  <th><a href="#demo">iOS</a></th>
  <th><a href="#demo">Android</a></th>
</tr></thead><tbody><tr><td>

![iOS screenshot](pathname:///cap/ios.png)

</td><td>

![Android screenshot](pathname:///cap/and.png)

</td></tr></tbody></table>

:::note Tested Deployments

This demo was tested in the following environments:

**Real Devices**

| OS         | Device              | CapacitorJS + FS  | Date       |
|:-----------|:--------------------|:------------------|:-----------|
| Android 30 | NVIDIA Shield       | `6.0.0` / `6.0.0` | 2024-06-02 |
| iOS 15.1   | iPad Pro            | `6.0.0` / `6.0.0` | 2024-06-02 |

**Simulators**

| OS         | Device              | CapacitorJS + FS  | Dev Platform | Date       |
|:-----------|:--------------------|:------------------|:-------------|:-----------|
| Android 34 | Pixel 3a            | `6.0.0` / `6.0.0` | `darwin-x64` | 2024-06-02 |
| iOS 17.5   | iPhone 15 Pro Max   | `6.0.0` / `6.0.0` | `darwin-x64` | 2024-06-02 |
| Android 34 | Pixel 3a            | `6.0.0` / `6.0.0` | `darwin-arm` | 2024-06-02 |
| iOS 17.5   | iPhone 15 Pro Max   | `6.0.0` / `6.0.0` | `darwin-arm` | 2024-06-02 |
| Android 34 | Pixel 3a            | `6.0.0` / `6.0.0` | `win10-x64`  | 2024-05-28 |

:::

:::danger Telemetry

Before starting this demo, manually disable telemetry.  On Linux and MacOS:

```bash
npx @capacitor/cli telemetry off
```

To verify telemetry was disabled:

```bash
npx @capacitor/cli telemetry
```

:::

## Integration Details

The [SheetJS NodeJS Module](/docs/getting-started/installation/nodejs) can be
imported from any component or script in the app.

This demo uses [SvelteJS](/docs/demos/frontend/svelte), but the same principles
apply to other frameworks.

#### Reading data

The standard [HTML5 File Input](/docs/demos/local/file#file-api) API works as
expected in CapacitorJS.

Apps will typically include an `input type="file"` element. When the element is
activated, CapacitorJS will show a file picker. After the user selects a file,
the element will receive a `change` event.

The following example parses the selected file using the SheetJS `read`[^1]
method, generates a HTML table from the first sheet using `sheet_to_html`[^2],
and displays the table by setting the `innerHTML` attribute of a `div` element:

```html title="Sample component for data import"
<script>
import { read, utils } from 'xlsx';

let html = "";

/* show file picker, read file, load table */
async function importFile(evt) {
  // highlight-start
  const f = evt.target.files[0];
  const wb = read(await f.arrayBuffer());
  // highlight-end
  const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
  html = utils.sheet_to_html(ws); // generate HTML and update state
}
</script>

<main>
  <!-- highlight-next-line -->
  <input type="file" on:change={importFile}/>
  <div bind:this={tbl}>{@html html}</div>
</main>
```

#### Writing data

Starting from a SheetJS workbook object[^3], the `write` method with the option
`type: "base64"`[^4] will generate Base64-encoded files.

The `@capacitor/filesystem` plugin can write Base64 strings to the device.

The following example uses the SheetJS `table_to_book` method[^5] to create a
workbook object from a HTML table. The workbook object is exported to the XLSX
format and written to the device.

```html title="Sample component for data export"
<script>
import { Filesystem, Directory } from '@capacitor/filesystem';
import { utils, write } from 'xlsx';

let html = "";
let tbl;

/* get state data and export to XLSX */
async function exportFile() {
  /* generate workbook object from HTML table */
  const elt = tbl.getElementsByTagName("TABLE")[0];
  const wb = utils.table_to_book(elt);

  // highlight-start
  /* export to XLSX encoded in a Base64 string  */
  const data = write(wb, { bookType: "xlsx", type: "base64" });

  /* attempt to write to the device */
  await Filesystem.writeFile({
    data,
    path: "SheetJSCap.xlsx",
    directory: Directory.Documents
  });
  // highlight-end
}

</script>

<main>
  <button on:click={exportFile}>Export XLSX</button>
  <div bind:this={tbl}>{@html html}</div>
</main>
```

:::caution pass

`Filesystem.writeFile` cannot overwrite existing files. Production apps should
attempt to delete the file before writing:

```js
  /* attempt to delete file first */
  try {
    await Filesystem.deleteFile({
      path: "SheetJSCap.xlsx",
      directory: Directory.Documents
    });
  } catch(e) {}
  /* attempt to write to the device */
  await Filesystem.writeFile({
    data,
    path: "SheetJSCap.xlsx",
    directory: Directory.Documents
  });
```

:::

## Demo

The app in this demo will display data in a table.

When the app is launched, a [test file](https://docs.sheetjs.com/pres.numbers)
will be fetched and processed.

When a document is selected with the file picker, it will be processed and the
table will refresh to show the contents.

"Export XLSX" will attempt to export the table data to `SheetJSCap.xlsx` in the
app Documents folder. An alert will display the location of the file.

### Base Project

0) Follow the official "Environment Setup"[^6] instructions to set up Android
and iOS targets

:::caution pass

iOS development is only supported on macOS.

:::

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

CapacitorJS requires Java 17.

</details>

1) Disable telemetry.

```bash
npx @capacitor/cli telemetry off
```

Verify that telemetry is disabled by running

```bash
npx @capacitor/cli telemetry
```

(it should print `Telemetry is off`)

2) Create a new Svelte project:

```bash
npm create vite@latest sheetjs-cap -- --template svelte
cd sheetjs-cap
```

3) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz
npm i --save @capacitor/core @capacitor/cli @capacitor/filesystem`}
</CodeBlock>

4) Create CapacitorJS structure:

```bash
npx cap init sheetjs-cap com.sheetjs.cap --web-dir=dist
npm run build
```

:::note pass

If prompted to create an Ionic account, type `N` and press <kbd>Enter</kbd>.

:::

5) Download [`src/App.svelte`](pathname:///cap/App.svelte) and replace:

```bash
curl -o src/App.svelte -L https://docs.sheetjs.com/cap/App.svelte
```

### Android

6) Create Android app

```bash
npm i --save @capacitor/android
npx cap add android
```

7) Enable file reading and writing in the Android app.

Add the highlighted lines to `android/app/src/main/AndroidManifest.xml` after
the `Permissions` comment:

```xml title="android/app/src/main/AndroidManifest.xml (add to file)"
    <!-- Permissions -->

<!-- highlight-start -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<!-- highlight-end -->

    <uses-permission android:name="android.permission.INTERNET" />
```

8) Run the app in the simulator:

```bash
npm run build
npx cap sync
npx cap run android
```

The app should look like the screenshot at the top of the page.

9) Test the export functionality.

Touch "Export XLSX" and the emulator will ask for permission. Tap "Allow" and a
popup will be displayed with a path.

Open the "Files" app in the simulator, tap the `≡` icon and tap "Documents". Tap
the "Documents" folder to find `SheetJSCap.xlsx`.

<details open>
  <summary><b>Downloading the generated file</b> (click to hide)</summary>

`adb` must be run from the root user:

```bash
adb root
```

The file location can be found by searching for `SheetJSCap.xlsx`:

```bash
adb exec-out find / -name SheetJSCap.xlsx
```

The first line of the output starting with `/` is the desired path:

```text
find: /proc/8533/task/8533/exe: No such file or directory
find: /proc/8533/exe: No such file or directory
// highlight-next-line
/data/media/0/Documents/SheetJSCap.xlsx
/storage/emulated/0/Documents/SheetJSCap.xlsx
```

`adb pull` can download the file:

```bash
adb pull "/data/media/0/Documents/SheetJSCap.xlsx" SheetJSCap.xlsx
```

`SheetJSCap.xlsx` can be opened with a spreadsheet editor such as Excel.

</details>

10) Test the import functionality.

Create a spreadsheet or find an existing file. Click and drag the file into the
Android emulator window. The file will be uploaded to a Downloads folder in the
emulator.

Tap on "Choose File" in the app. In the selector, tap `≡` and select "Downloads"
to find the uploaded file. After selecting the file, the table will refresh.

### iOS

11) Create iOS app

```bash
npm i --save @capacitor/ios
npx cap add ios
```

12) Enable file sharing and make the documents folder visible in the iOS app.
The following lines must be added to `ios/App/App/Info.plist`:

```xml title="ios/App/App/Info.plist (add to file)"
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

13) Run the app in the simulator

```bash
npm run build
npx cap sync
npx cap run ios
```

If prompted to select a target device, select "iPhone 15 Pro Max (simulator)".

The app should look like the screenshot at the top of the page.

14) Test the export functionality.

Touch "Export XLSX" and a popup will be displayed.

To see the generated file, switch to the "Files" app in the simulator and look
for `SheetJSCap.xlsx` in "On My iPhone" > "`sheetjs-cap`"

<details open>
  <summary><b>Downloading the generated file</b> (click to hide)</summary>

The app files are available in the filesystem in `~/Library/Developer`. Open a
terminal and run the following command to find the file:

```bash
find ~/Library/Developer -name SheetJSCap.xlsx
```

</details>

15) Test the import functionality.

Create a spreadsheet or find an existing file. Click and drag the file into the
iOS simulator window. The simulator will show a picker for saving the file.
Select the `sheetjs-cap` folder and tap "Save".

Tap on "Choose File" in the app and "Choose File" in the popup. In the picker,
tap "Recents" and select the new file. After selecting the file, the table will refresh.

### Android Device

16) Connect an Android device using a USB cable.

If the device asks to allow USB debugging, tap "Allow".

17) Close any Android / iOS emulators.

18) Build APK and run on device:

```bash
npm run build
npx cap sync
npx cap run android
```

If the Android emulators are closed and an Android device is connected, the last
command will build an APK and install on the device.

:::note pass

In some tests, the last command asked for a target device. Select the Android
device in the list and press <kbd>Enter</kbd>

:::

:::caution pass

For real devices running API level 29 or below, the following line must be added
to the `application` open tag in `android/app/src/main/AndroidManifest.xml`:

```xml title="android/app/src/main/AndroidManifest.xml (add highlighted attribute)"
    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        // highlight-next-line
        android:requestLegacyExternalStorage="true"
        android:theme="@style/AppTheme">
```

:::

### iOS Device

19) Connect an iOS device using a USB cable

20) Close any Android / iOS emulators.

21) Enable developer code signing certificates.

Open `ios/App/App.xcworkspace` in Xcode. Select the "Project Navigator" and
select the "App" project. In the main view, select "Signing & Capabilities".
Under "Signing", select a team in the dropdown menu.

22) Run on device:

```bash
npm run build
npx cap sync
npx cap run ios
```

When prompted to select a target device, select the real device in the list.

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`sheet_to_html` in "Utilities"](/docs/api/utilities/html#html-table-output)
[^3]: See ["Workbook Object"](/docs/csf/book)
[^4]: See [the "base64" type in "Writing Files"](/docs/api/write-options#output-type)
[^5]: See [`table_to_book` in "HTML" Utilities](/docs/api/utilities/html#create-new-sheet)
[^6]: See ["Environment Setup"](https://capacitorjs.com/docs/getting-started/environment-setup) in the CapacitorJS documentation.