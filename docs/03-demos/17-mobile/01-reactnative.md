---
title: Sheets on the Go with React Native
sidebar_label: React Native
description: Build data-intensive mobile apps with React Native. Seamlessly integrate spreadsheets into your app using SheetJS. Securely process and generate Excel files in the field.
pagination_prev: demos/static/index
pagination_next: demos/desktop/index
sidebar_position: 1
sidebar_custom_props:
  summary: React + Native Rendering
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const r = {style: {color:"red"}};
export const g = {style: {color:"green"}};
export const y = {style: {color:"gold"}};
export const gr = {style: {color:"gray"}};

[React Native](https://reactnative.dev/) is a mobile app framework. It builds
iOS and Android apps that use JavaScript for describing layouts and events.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses React Native and SheetJS to process and generate spreadsheets.
We'll explore how to load SheetJS in a React Native app in a few ways:

- ["Fetching Remote Data"](#fetching-remote-data) uses the built-in `fetch` to
download and parse remote workbook files.
- ["Local Files"](#local-files) uses native libraries to read and write files on
the device.

The "Local Files" example creates an app that looks like the screenshots below:

<table><thead><tr>
  <th><a href="#demo">iOS</a></th>
  <th><a href="#demo">Android</a></th>
</tr></thead><tbody><tr><td>

![iOS screenshot](pathname:///mobile/rnios3.png)

</td><td>

![Android screenshot](pathname:///mobile/rnand3.png)

</td></tr></tbody></table>

:::caution pass

**Before testing this demo, follow the official React Native CLI Guide!**[^1]

Follow the instructions for iOS (requires macOS) and for Android. They will
cover installation and system configuration. You should be able to build and run
a sample app in the Android and the iOS (if applicable) simulators.

:::

## Integration Details

The [SheetJS NodeJS Module](/docs/getting-started/installation/nodejs) can be
imported from any component or script in the app.

### Internal State

For simplicity, this demo uses an "Array of Arrays"[^2] as the internal state.

<table>
  <thead><tr><th>Spreadsheet</th><th>Array of Arrays</th></tr></thead>
  <tbody><tr><td>

![`pres.xlsx` data](pathname:///pres.png)

</td><td>

```js
[
  ["Name", "Index"],
  ["Bill Clinton", 42],
  ["GeorgeW Bush", 43],
  ["Barack Obama", 44],
  ["Donald Trump", 45],
  ["Joseph Biden", 46]
]
```

</td></tr></tbody></table>

Each array within the structure corresponds to one row.

This demo also keeps track of the column widths as a single array of numbers.
The widths are used by the display component.

_Complete State_

The complete state is initialized with the following snippet:

```js
const [data, setData] = useState([
  "SheetJS".split(""),
  [5,4,3,3,7,9,5],
  [8,6,7,5,3,0,9]
]);
const [widths, setWidths] = useState(Array.from({length:7}, () => 20));
```


#### Updating State

Starting from a SheetJS worksheet object, `sheet_to_json`[^3] with the `header`
option can generate an array of arrays:

```js
/* assuming `wb` is a SheetJS workbook */
function update_state(wb) {
  /* convert first worksheet to AOA */
  const wsname = wb.SheetNames[0];
  const ws = wb.Sheets[wsname];
  const data = utils.sheet_to_json(ws, {header:1});

  /* update state */
  setData(data);

  /* update column widths */
  setWidths(make_width(data));
}
```

_Calculating Column Widths_

Column widths can be calculated by walking each column and calculating the max
data width. Using the array of arrays:

```js
/* this function takes an array of arrays and generates widths */
function make_width(aoa) {
  /* walk each row */
  aoa.forEach((r) => {
    /* walk each column */
    r.forEach((c, C) => {
      /* update column width based on the length of the cell contents */
      res[C] = Math.max(res[C]||60, String(c).length * 10);
    });
  });
  /* use a default value for columns with no data */
  for(let C = 0; C < res.length; ++C) if(!res[C]) res[C] = 60;
  return res;
}
```

#### Exporting State

`aoa_to_sheet`[^4] builds a SheetJS worksheet object from the array of arrays:

```js
/* generate a SheetJS workbook from the state */
function export_state() {
  /* convert AOA back to worksheet */
  const ws = utils.aoa_to_sheet(data);

  /* build new workbook */
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "SheetJS");

  return wb;
}
```

### Displaying Data

The demos uses `react-native-table-component` to display the first worksheet.

The demos use components similar to the example below:

```jsx
import { ScrollView } from 'react-native';
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

(
  {/* Horizontal scroll */}
  <ScrollView horizontal={true} >
    {/* Table container */}
    <Table>
      {/* Frozen Header Row */}
      <TableWrapper>
        {/* First row */}
        <Row data={data[0]} widthArr={widths}/>
      </TableWrapper>
      {/* Scrollable Data Rows */}
      <ScrollView>
        <TableWrapper>
          {/* Remaining Rows */}
          <Rows data={data.slice(1)} widthArr={widths}/>
        </TableWrapper>
      </ScrollView>
    </Table>
  </ScrollView>
)
```

`data.slice(1)` in the `Rows` component returns data starting from the second
row. This neatly skips the first header row.

## Fetching Remote Data

React Native versions starting from `0.72.0`[^5] support binary data in `fetch`.

This snippet downloads and parses https://docs.sheetjs.com/pres.xlsx:

```js
/* fetch data into an ArrayBuffer */
const ab = await (await fetch("https://docs.sheetjs.com/pres.xlsx")).arrayBuffer();
/* parse data */
const wb = XLSX.read(ab);
```

### Fetch Demo

:::note Tested Deployments

This demo was tested in the following environments:

**Real Devices**

| OS         | Device            | RN       | Date       |
|:-----------|:------------------|:---------|:-----------|
| iOS 15.1   | iPhone 12 Pro Max | `0.73.6` | 2024-03-13 |
| Android 29 | NVIDIA Shield     | `0.73.6` | 2024-03-13 |

**Simulators**

| OS         | Device              | RN       | Dev Platform | Date       |
|:-----------|:--------------------|:---------|:-------------|:-----------|
| Android 34 | Pixel 3a            | `0.73.6` | `darwin-x64` | 2024-03-13 |
| iOS 17.4   | iPhone 15 Pro Max   | `0.73.6` | `darwin-x64` | 2024-03-13 |
| Android 34 | Pixel 3a            | `0.74.2` | `darwin-arm` | 2024-06-20 |
| iOS 17.5   | iPhone SE (3rd gen) | `0.74.2` | `darwin-arm` | 2024-06-20 |
| Android 34 | Pixel 3a            | `0.73.5` | `win10-x64`  | 2024-03-05 |
| Android 34 | Pixel 3a            | `0.73.7` | `linux-x64`  | 2024-04-29 |

:::

0) Install React Native dependencies

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

On the Steam Deck, JDK17 was installed using `pacman`:

```bash
sudo pacman -Syu jdk17-openjdk
```

[The Android Studio tarball](https://developer.android.com/studio) was
downloaded and extracted. After extracting:

```bash
cd ./android-studio/bin
./studio.sh
```

In Android Studio, select "SDK Manager" and switch to the "SDK Tools" tab. Check
"Show Package Details" and install "Android SDK Command-line Tools (latest)".

When this demo was last tested, the following environment variables were used:

```bash
export ANDROID_HOME=~/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

</details>

1) Create project:

```bash
npx -y react-native@0.74.2 init SheetJSRNFetch --version="0.74.2"
```

2) Install shared dependencies:

<CodeBlock language="bash">{`\
cd SheetJSRNFetch
curl -LO https://docs.sheetjs.com/logo.png
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz
npm i -S react-native-table-component@1.2.2 @types/react-native-table-component`}
</CodeBlock>

3) Download [`App.tsx`](pathname:///reactnative/App.tsx) and replace:

```bash
curl -LO https://docs.sheetjs.com/reactnative/App.tsx
```

**Android Testing**

4) Install or switch to Java 17[^6]

5) Start the Android emulator:

```bash
npx react-native run-android
```

:::info pass

On Linux, the command may silently stall. It is strongly recommended to launch
the interactive CLI tool:

```bash
npx react-native start
```

Once the dev server is ready, the terminal will display a few options. Press `a`
to run on Android.

:::

:::caution pass

If the initial launch fails with an error referencing the emulator, manually
start the emulator from Android Studio and try again.

Gradle errors typically stem from a Java version mismatch:

```
> Failed to apply plugin 'com.android.internal.application'.
   > Android Gradle plugin requires Java 17 to run. You are currently using Java 11.
```

This error can be resolved by installing and switching to the requested version.

:::

:::caution pass

When this demo was last tested on Linux, the process failed to launch the emulator:

<pre>
<b {...y}>warn</b> Please launch an emulator manually or connect a device. Otherwise app may fail to launch.
</pre>


**This is a known bug in React Native!**

If an emulator is installed, run the following command:

```bash
npx react-native doctor
```

Under `Android`, there will be one error:

<pre>
<span {...gr}>Android</span> {`\n`}
{` `}<span {...r}>✖</span> Adb - No devices and/or emulators connected. Please create emulator with Android Studio or connect Android device.
</pre>

Press `f` and a list of available emulators will be shown. Select the emulator
(typically the last line) and press Enter.

<pre>
<span {...g}>✔</span> <b>Select the device / emulator you want to use</b> <span {...gr}>›</span> <b>Emulator</b> <span {...g}>Pixel_3a_API_34_extension_level_7_x86_64</span> (disconnected)
</pre>

The text in green is the name of the virtual device
(`Pixel_3a_API_34_extension_level_7_x86_64` in this example).
Run the following command to manually start the emulator:

```bash
$ANDROID_HOME/tools/emulator -avd Pixel_3a_API_34_extension_level_7_x86_64
```

(replace `Pixel_3a_API_34_extension_level_7_x86_64` with the name of the virtual device)

To confirm React Native detects the emulator, run the following command again:

```bash
npx react-native doctor
```

:::

6) When opened, the app should look like the "Before" screenshot below. After
tapping "Import data from a spreadsheet", verify that the app shows new data:

<table><thead><tr>
  <th>Before</th>
  <th>After</th>
</tr></thead><tbody><tr><td>

![before screenshot](pathname:///reactnative/andfetch1.png)

</td><td>

![after screenshot](pathname:///reactnative/andfetch2.png)

</td></tr></tbody></table>

**iOS Testing**

:::danger pass

**iOS testing can only be performed on Apple hardware running macOS!**

Xcode and iOS simulators are not available on Windows or Linux.

:::

7) Refresh iOS project by running `pod install` from the `ios` subfolder:

```bash
cd ios; pod install; cd -
```

8) Start the iOS emulator:

```bash
npx react-native run-ios
```

9) When opened, the app should look like the "Before" screenshot below.  After
tapping "Import data from a spreadsheet", verify that the app shows new data:

<table><thead><tr>
  <th>Before</th>
  <th>After</th>
</tr></thead><tbody><tr><td>

![before screenshot](pathname:///reactnative/iosfetch1.png)

</td><td>

![after screenshot](pathname:///reactnative/iosfetch2.png)

</td></tr></tbody></table>

**Android Device Testing**

10) Connect an Android device using a USB cable.

If the device asks to allow USB debugging, tap "Allow".

11) Close any Android / iOS emulators.

12) Build APK and run on device:

```bash
npx react-native run-android
```

**iOS Device Testing**

13) Connect an iOS device using a USB cable.

If the device asks to trust the computer, tap "Trust" and enter the passcode.

14) Close any Android / iOS emulators.

15) Enable developer code signing certificates[^7].

<details open>
  <summary><b>Enabling Code Signing</b> (click to show)</summary>

These instructions were verified against Xcode 15.3.

A) Open the included iOS workspace in Xcode:

```bash
open ios/SheetJSRNFetch.xcworkspace
```

B) Select "SheetJSRNFetch" in the Project Navigator:

![Select the project](pathname:///reactnative/xcode-select-project.png)

C) Select "Signing & Capabilities" in the main view.

D) Select "All" in the lower bar and ensure a Team is selected in the dropdown:

![Xcode Signing and Capabilities](pathname:///reactnative/xcode-sign-cap.png)

</details>

16) Install `ios-deploy` through Homebrew:

```bash
brew install ios-deploy
```

17) Run on device:

```bash
npx react-native run-ios
```

:::caution pass

In some tests, the app failed to run on the device due to "Untrusted Developer":

```
Your device management settings do not allow apps from developer ... on this iPhone. You can allow using these apps in Settings.
```

These instructions were verified against iOS 15.1.

A) Open the Settings app and select "General" > "VPN & Device Management".

![iOS Management](pathname:///reactnative/ios-mgmt.png)

B) Select the Apple Development certificate under "Developer App".

![iOS Certificate Info](pathname:///reactnative/ios-cert.png)

In the new screen, the name "SheetJSRNFetch" will be displayed in the Apps list.

C) Tap "Trust ..." and tap "Trust" in the popup.

![iOS Trust Popup](pathname:///reactnative/ios-trust.png)

D) Close the Settings app on the device.

E) Close the Metro window on the computer.

F) Run `npx react-native run-ios` again.

:::

:::note pass

In some tests, the build failed with the following error:

```
PhaseScriptExecution failed with a nonzero exit code
```

This was due to an error in the `react-native` package. The script
`node_modules/react-native/scripts/react-native-xcode.sh` must be edited.

Near the top of the script, there will be a `set` statement:

```bash title="node_modules/react-native/scripts/react-native-xcode.sh"
# Print commands before executing them (useful for troubleshooting)
# highlight-next-line
set -x -e
DEST=$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH
```

The `-e` argument must be removed:

```bash title="node_modules/react-native/scripts/react-native-xcode.sh (edit line)"
# Print commands before executing them (useful for troubleshooting)
# highlight-next-line
set -x
DEST=$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH
```

:::

:::caution pass

In some test runs, the error mentioned a development team:

```
error: Signing for "SheetJSRNFetch" requires a development team. Select a development team in the Signing & Capabilities editor. (in target 'SheetJSRNFetch' from project 'SheetJSRNFetch')
```

Code signing must be enabled in the project!

:::

:::info pass

By default, React Native generates applications that exclusively target iPhone.
On a physical iPad, a pixellated iPhone app will be run.

The "targeted device families" setting must be changed to support iPad:

A) Open the Xcode workspace:

```bash
open ./ios/SheetJSRNFetch.xcworkspace
```

B) Select the project in the left sidebar:

![Select the project](pathname:///reactnative/xcode-select-project.png)

C) Select the "SheetJSRNFetch" target in the sidebar.

![Settings](pathname:///reactnative/xcode-targets.png)

D) Select the "Build Settings" tab in the main area.

E) In the search bar below "Build Settings", type "tar"

F) In the "Targeted Device Families" row, change the value to "iPhone, iPad".

:::

:::caution pass

In some test runs, the build failed with a Provisioning message:

```
error: Provisioning profile "..." doesn't include the currently selected device "..." (identifier ...).
```

This was resolved by manually selecting the target device:

A) Open the Xcode workspace:

```bash
open ./ios/SheetJSRNFetch.xcworkspace
```

B) Select the project in the left sidebar:

![Select the project](pathname:///reactnative/xcode-select-project.png)

C) In the top bar, next to the project name, there will be a gray device icon.
Click on the icon and select the real device from the list.

:::

## Local Files

:::danger pass

React Native does not provide a native file picker or a method for reading and
writing data from documents on the devices. A third-party library must be used.

Since React Native internals change between releases, libraries may only work
with specific versions of React Native.  Project documentation should be
consulted before picking a library.

:::

The following table lists tested file plugins.  "OS" lists tested platforms
("A" for Android and "I" for iOS).

| File system Plugin         | File Picker Plugin             |  OS  |
|:---------------------------|:-------------------------------|:----:|
| `react-native-file-access` | `react-native-document-picker` | `AI` |
| `react-native-blob-util`   | `react-native-document-picker` | `AI` |
| `expo-file-system`         | `expo-document-picker`         | `AI` |

### App Configuration

Due to privacy concerns, apps must request file access. There are special APIs
for accessing data and are subject to change in future platform versions.

<details>
  <summary><b>Technical Details</b> (click to show)</summary>

**iOS**

iOS applications typically require two special settings in `Info.plist`:

- `UIFileSharingEnabled`[^8] allows users to use files written by the app. A
special folder will appear in the "Files" app.

- `LSSupportsOpeningDocumentsInPlace`[^9] allows the app to open files without
creating a local copy.

Both settings must be set to `true`:

```xml title="Info.plist (add to file)"
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

Once the options are set, generated files are visible to users and can be shared
with other apps including "Mail", "Messages", and "Numbers".

**Android**

Permissions and APIs have evolved over time. For broadest compatibility, the
following permissions must be enabled in `AndroidManifest.xml`:

- `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` allow apps to access
files outside of the app scope. These are required for scoped storage access.

- `android:requestLegacyExternalStorage="true"` enabled legacy behavior in some
older releases.

The manifest is saved to `android/app/src/main/AndroidManifest.xml`:

```xml title="android/app/src/main/AndroidManifest.xml (add highlighted lines)"
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- highlight-start -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <!-- highlight-end -->
    <application
      <!-- highlight-next-line -->
      android:requestLegacyExternalStorage="true"
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
```

Depending on the Android API level, there are three strategies for writing files:

- In "legacy" mode (supported in API levels up to 29), files can be written to
the user Downloads or Documents folder directly.

- Using the `MediaStore` API, files should be copied to a visible location.

- Using the "Storage Access Framework", the user grants access to a folder and
the app uses SAF APIs to create files and write data.

</details>

### RN File Picker

The "File Picker" library handles two platform-specific steps:

1) Show a view that allows users to select a file from their device

2) Copy the selected file to a location that can be read by the application

The following libraries have been tested:

#### `react-native-document-picker`

[`react-native-document-picker`](https://react-native-documents.github.io/)
provides a `pickSingle` method for users to select one file.

The file plugins generally require the `copyTo: "cachesDirectory"` option:

```js
import { pickSingle } from 'react-native-document-picker';

const f = await pickSingle({
  allowMultiSelection: false,
  // highlight-next-line
  copyTo: "cachesDirectory",
  mode: "open"
});
const path = f.fileCopyUri; // this path can be read by RN file plugins
```

#### `expo-document-picker`

[`expo-document-picker`](https://docs.expo.dev/sdk/document-picker/) is a picker
that works with other modules in the Expo ecosystem.

The `getDocumentAsync` method allows users to select a file. The Expo file
plugin requires the `copyToCacheDirectory` option:

```js
import * as DocumentPicker from 'expo-document-picker';

const result = await DocumentPicker.getDocumentAsync({
  // highlight-next-line
  copyToCacheDirectory: true,
  type: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
});
const path = result.assets[0].uri; // this path can be read by RN file plugins
```


### RN File Plugins

The following libraries have been tested:

#### `react-native-blob-util`

[`react-native-blob-util`](https://github.com/RonRadtke/react-native-blob-util)
is the continuation of other libraries that date back to 2016.

The `ascii` type returns an array of numbers corresponding to the raw bytes.
A `Uint8Array` from the data is compatible with the `buffer` type.

<details>
  <summary><b>Reading and Writing snippets</b> (click to hide)</summary>

_Reading Data_

```js
import * as XLSX from "xlsx";
import RNFetchBlob from 'react-native-blob-util';
const { readFile } = RNFetchBlob.fs;

const res = await readFile(path, 'ascii');
const wb = XLSX.read(new Uint8Array(res), {type:'buffer'});
```

:::caution pass

On iOS, the URI from `react-native-document-picker` must be massaged:

```js
import { pickSingle } from 'react-native-document-picker';
import RNFetchBlob from 'react-native-blob-util';
const { readFile, dirs: { DocumentDir } } = RNFetchBlob.fs;

const f = await pickSingle({
// highlight-start
  // Instruct the document picker to copy file to Documents directory
  copyTo: "documentDirectory",
// highlight-end
  allowMultiSelection: false, mode: "open" });
// highlight-start
// `f.uri` is the original path and `f.fileCopyUri` is the path to the copy
let path = f.fileCopyUri;
// iOS workaround
if (Platform.OS === 'ios') path = path.replace(/^.*\/Documents\//, DDP + "/");
// highlight-end

const res = await readFile(path, 'ascii');
```

:::

_Writing Data_

```js
import * as XLSX from "xlsx";
import RNFetchBlob from 'react-native-blob-util';
const { writeFile, readFile, dirs:{ DocumentDir } } = RNFetchBlob.fs;

const wbout = XLSX.write(wb, {type:'buffer', bookType:"xlsx"});
const file = DocumentDir + "/sheetjsw.xlsx";
const res = await writeFile(file, Array.from(wbout), 'ascii');
```

_Sharing Files in Android_

`copyToMediaStore` uses the `MediaStore` API to share files.

The file must be written to the device *before* using the `MediaStore` API!

```js
// ... continuation of "writing data"
const { MediaCollection } = RNFetchBlob;

/* Copy to downloads directory (android) */
try {
  await MediaCollection.copyToMediaStore({
    parentFolder: "",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    name: "sheetjsw.xlsx"
  }, "Download", file);
} catch(e) {}
```

</details>

#### `react-native-file-access`

[`react-native-file-access`](https://github.com/alpha0010/react-native-file-access)
is a filesystem API that uses modern iOS and Android development patterns.

The `base64` encoding returns strings compatible with the `base64` type:

<details>
  <summary><b>Reading and Writing snippets</b> (click to hide)</summary>

_Reading Data_

```js
import * as XLSX from "xlsx";
import { FileSystem } from "react-native-file-access";

const b64 = await FileSystem.readFile(path, "base64");
/* b64 is a Base64 string */
const workbook = XLSX.read(b64, {type: "base64"});
```

_Writing Data_

```js
import * as XLSX from "xlsx";
import { Dirs, FileSystem } from "react-native-file-access";
const DDP = Dirs.DocumentDir + "/";

const b64 = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
/* b64 is a Base64 string */
await FileSystem.writeFile(DDP + "sheetjs.xlsx", b64, "base64");
```

_Sharing Files in Android_

`cpExternal` uses the `MediaStore` API to share files.

The file must be written to the device *before* using the `MediaStore` API!

```js
// ... continuation of "writing data"

/* Copy to downloads directory (android) */
try {
  await FileSystem.cpExternal(file, "sheetjsw.xlsx", "downloads");
} catch(e) {}
```

</details>

#### `expo-file-system`

[`expo-file-system`](https://docs.expo.dev/sdk/filesystem/) is a filesystem API
that works with other modules in the Expo ecosystem.

:::caution pass

Some Expo APIs return URI that cannot be read with `expo-file-system`. This
will manifest as an error:

> Unsupported scheme for location '...'

The [`expo-document-picker`](#expo-document-picker) snippet makes a local copy.

:::

The `EncodingType.Base64` encoding is compatible with `base64` type.

<details>
  <summary><b>Reading and Writing snippets</b> (click to hide)</summary>

_Reading Data_

Calling `FileSystem.readAsStringAsync` with `FileSystem.EncodingType.Base64`
encoding returns a promise resolving to a string compatible with `base64` type:

```js
import * as XLSX from "xlsx";
import * as FileSystem from 'expo-file-system';

const b64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
const workbook = XLSX.read(b64, { type: "base64" });
```

_Writing Data_

The `FileSystem.EncodingType.Base64` encoding accepts Base64 strings:

```js
import * as XLSX from "xlsx";
import * as FileSystem from 'expo-file-system';

const b64 = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
/* b64 is a Base64 string */
await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "sheetjs.xlsx", b64, { encoding: FileSystem.EncodingType.Base64 });
```

_Sharing Files in Android_

`StorageAccessFramework` uses the "Storage Access Framework" to share files.

SAF API methods must be used to request permissions, make files and write data:

```js
import * as XLSX from "xlsx";
import { documentDirectory, StorageAccessFramework } from 'expo-file-system';

const b64 = XLSX.write(workbook, {type:'base64', bookType:"xlsx"});
/* b64 is a Base64 string */
try {
  /* request access to a folder */
  const perms = await StorageAccessFramework.requestDirectoryPermissionsAsync(documentDirectory);
  /* if the user selected a folder ... */
  if(perms.granted) {

    /* create a new file */
    const uri = perms.directoryUri;
    const file = await StorageAccessFramework.createFileAsync(uri, "sheetjsw", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    /* write data to file */
    await StorageAccessFramework.writeAsStringAsync(file, wbout, { encoding: "base64" });
  }
} catch(e) {}
```

</details>

### Demo

:::note Tested Deployments

This demo was tested in the following environments:

**Real Devices**

| OS         | Device            | RN       | Date       |
|:-----------|:------------------|:---------|:-----------|
| iOS 15.5   | iPhone 13 Pro Max | `0.73.6` | 2024-03-31 |
| Android 29 | NVIDIA Shield     | `0.73.6` | 2024-03-31 |

**Simulators**

| OS         | Device            | RN       | Dev Platform | Date       |
|:-----------|:------------------|:---------|:-------------|:-----------|
| Android 34 | Pixel 3a          | `0.73.6` | `darwin-x64` | 2024-03-31 |
| iOS 17.4   | iPhone 15 Pro Max | `0.73.6` | `darwin-x64` | 2024-03-31 |
| Android 34 | Pixel 3a          | `0.73.6` | `win10-x64`  | 2024-03-31 |
| Android 34 | Pixel 3a          | `0.73.6` | `linux-x64`  | 2024-03-31 |

:::

:::danger pass

There are many moving parts and pitfalls with React Native apps. It is strongly
recommended to follow the official React Native tutorials for iOS and Android
before approaching this demo.[^10] Details including Android Virtual Device
configuration are not covered here.

:::

This example tries to separate the library-specific functions.

**Project Setup**

1) Create project:

```bash
npx react-native init SheetJSRN --version="0.73.6"
```

On macOS, if prompted to install `CocoaPods`, press `y`.

2) Install shared dependencies:

<CodeBlock language="bash">{`\
cd SheetJSRN
curl -LO https://docs.sheetjs.com/logo.png
npm i -S https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz
npm i -S react-native-table-component@1.2.2 react-native-document-picker@9.1.1`}
</CodeBlock>

3) Download [`index.js`](pathname:///mobile/index.js) and replace:

```bash
curl -LO https://docs.sheetjs.com/mobile/index.js
```

4) Start the Android emulator:

```bash
npx react-native run-android
```

The app should look like the following screenshot:

![React Native Android App](pathname:///reactnative/and1.png)

:::caution pass

When this demo was last tested on Windows, the build failed with an error:

```
> Failed to apply plugin 'com.android.internal.application'.
   > Android Gradle plugin requires Java 17 to run. You are currently using Java 11.
```

Java 17 must be installed[^11] and the `JAVA_HOME` environment variable must
point to the Java 17 location.

:::

Stop the dev server and close the React Native Metro NodeJS window.

**File Integration**

5) Pick a filesystem library for integration:

<Tabs>
  <TabItem value="RNBU" label="RNBU">

Install `react-native-blob-util` dependency:

```bash
npm i -S react-native-blob-util@0.19.8
```

Add the highlighted lines to `index.js`:

```js title="index.js"
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

// highlight-start
import { read, write } from 'xlsx';
import { pickSingle } from 'react-native-document-picker';
import { Platform } from 'react-native';
import RNFetchBlob from 'react-native-blob-util';

async function pickAndParse() {
  const f = await pickSingle({allowMultiSelection: false, copyTo: "documentDirectory", mode: "open" });
  let path = f.fileCopyUri;
  if (Platform.OS === 'ios') path = path.replace(/^.*\/Documents\//, RNFetchBlob.fs.dirs.DocumentDir + "/");
  const res = await (await fetch(path)).arrayBuffer(); // RN >= 0.72
  // const res = await RNFetchBlob.fs.readFile(path, 'ascii'); // RN < 0.72
  return read(new Uint8Array(res), {type: 'buffer'});
}

async function writeWorkbook(wb) {
  const wbout = write(wb, {type:'buffer', bookType:"xlsx"});
  const file = RNFetchBlob.fs.dirs.DocumentDir + "/sheetjsw.xlsx";
  await RNFetchBlob.fs.writeFile(file, Array.from(wbout), 'ascii');

  /* Copy to downloads directory (android) */
  try { await RNFetchBlob.MediaCollection.copyToMediaStore({
    parentFolder: "",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    name: "sheetjsw.xlsx"
  }, "Download", file); } catch(e) {}

  return file;
}
// highlight-end

const make_width = ws => {
```

  </TabItem>
  <TabItem value="RNFA" label="RNFA">

Install `react-native-file-access` dependency:

```bash
npm i -S react-native-file-access@3.0.7
```

Add the highlighted lines to `index.js`:

```js title="index.js"
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

// highlight-start
import { read, write } from 'xlsx';
import { pickSingle } from 'react-native-document-picker';
import { Dirs, FileSystem } from 'react-native-file-access';

async function pickAndParse() {
  const f = await pickSingle({allowMultiSelection: false, copyTo: "documentDirectory", mode: "open" });
  let path = f.fileCopyUri;
  const res = await (await fetch(path)).arrayBuffer();
  return read(new Uint8Array(res), {type: 'buffer'});
}

async function writeWorkbook(wb) {
  const wbout = write(wb, {type:'base64', bookType:"xlsx"});
  const file = Dirs.DocumentDir + "/sheetjsw.xlsx";
  await FileSystem.writeFile(file, wbout, "base64");

  /* Copy to downloads directory (android) */
  try { await FileSystem.cpExternal(file, "sheetjsw.xlsx", "downloads"); } catch(e) {}

  return file;
}
// highlight-end

const make_width = ws => {
```

  </TabItem>
  <TabItem value="EXPO" label="EXPO">

Install `expo-file-system` and `expo-document-picker` dependencies:

```bash
npx install-expo-modules
npm i -S expo-file-system expo-document-picker
```

:::note pass

In the most recent test, the installation asked a few questions.

If prompted to change iOS deployment target, choose Yes.

If prompted to install Expo CLI integration, choose No.

:::

Add the highlighted lines to `index.js`:

```js title="index.js"
import { Table, Row, Rows, TableWrapper } from 'react-native-table-component';

// highlight-start
import { read, write } from 'xlsx';
import { getDocumentAsync } from 'expo-document-picker';
import { documentDirectory, readAsStringAsync, writeAsStringAsync, StorageAccessFramework } from 'expo-file-system';

async function pickAndParse() {
  const result = await getDocumentAsync({copyToCacheDirectory: true});
  const path = result.assets[0].uri;
  const res = await readAsStringAsync(path, { encoding: "base64" });
  return read(res, {type: 'base64'});
}

async function writeWorkbook(wb) {
  const wbout = write(wb, {type:'base64', bookType:"xlsx"});
  const file = documentDirectory + "sheetjsw.xlsx";
  await writeAsStringAsync(file, wbout, { encoding: "base64" });

  /* Write to documents directory (android) */
  try {
  const perms = await StorageAccessFramework.requestDirectoryPermissionsAsync(documentDirectory);
  if(perms.granted) {
    const uri = perms.directoryUri;
    const file = await StorageAccessFramework.createFileAsync(uri, "sheetjsw", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    await StorageAccessFramework.writeAsStringAsync(file, wbout, { encoding: "base64" });
  }
  } catch(e) {}
  return file;
}
// highlight-end

const make_width = ws => {
```

  </TabItem>
</Tabs>

**Android Testing**

7) Restart the Android development process:

```bash
npx react-native run-android
```

The following app will be shown:

![React Native Android App](pathname:///reactnative/and1.png)

:::caution pass

When this demo was last tested on macOS, the process failed to launch the emulator:

<pre>
<b {...y}>warn</b> Please launch an emulator manually or connect a device. Otherwise app may fail to launch.
</pre>


**This is a known bug in React Native!**

If an emulator is installed, run the following command:

```bash
npx react-native doctor
```

Under `Android`, there will be one error:

<pre>
<span {...gr}>Android</span> {`\n`}
{` `}<span {...r}>✖</span> Adb - No devices and/or emulators connected. Please create emulator with Android Studio or connect Android device.
</pre>

Press `f` and a list of available emulators will be shown. Select the emulator
(typically the last line) and press Enter.

<pre>
<span {...g}>✔</span> <b>Select the device / emulator you want to use</b> <span {...gr}>›</span> <b>Emulator</b> <span {...g}>Pixel_3a_API_34</span> (disconnected)
</pre>

The text in green is the name of the virtual device (`Pixel_3a_API_34` in this
example). Run the following command to manually start the emulator:

```bash
$ANDROID_HOME/tools/emulator -avd Pixel_3a_API_34
```

(replace `Pixel_3a_API_34` with the name of the virtual device)

To confirm React Native detects the emulator, run the following command again:

```bash
npx react-native doctor
```

:::

8) Download https://docs.sheetjs.com/pres.numbers and open the Downloads folder.

9) Click and drag `pres.numbers` from the Downloads folder into the simulator.

10) Click "Import data" and look for `pres.numbers`.

If the file is not displayed, click the `≡` icon and click "Downloads".

![pick file Android](pathname:///mobile/rnand2.png)

11) Select `pres.numbers`.

The screen should refresh with new contents:

![read file Android](pathname:///reactnative/and3.png)

12) Click "Export data".

:::note pass

`expo-file-system` on Android will prompt to grant access to a folder.

Tap the `≡` icon and tap the "Documents" folder with the download icon.

Tap the 'ALLOW ACCESS TO "DOCUMENTS"' button.

In the "Allow access" pop, tap "ALLOW".

:::

An alert will display the location to the file:

![write file Android](pathname:///reactnative/and4.png)

13) Pull the file from the simulator and verify the contents:

```bash
adb exec-out run-as com.sheetjsrn cat files/sheetjsw.xlsx > /tmp/sheetjsw.xlsx
npx xlsx-cli /tmp/sheetjsw.xlsx
```

:::caution pass

PowerShell mangles binary data in the redirect.

On Windows, the following commands must be run in the Command Prompt:

```bash
adb exec-out run-as com.sheetjsrn cat files/sheetjsw.xlsx > sheetjsw.xlsx
npx xlsx-cli sheetjsw.xlsx
```

:::

14) Stop the dev server and close the React Native Metro NodeJS window.

**iOS Testing**

:::danger pass

**iOS testing can only be performed on Apple hardware running macOS!**

Xcode and iOS simulators are not available on Windows or Linux.

Scroll down to "Android Device Testing" for device tests.

:::

15) Refresh iOS project by running `pod install` from the `ios` subfolder:

```bash
cd ios; pod install; cd -
```

16) Start the iOS development process:

```bash
npx react-native run-ios
```

17) Download https://docs.sheetjs.com/pres.numbers and open the Downloads folder.

18) In the simulator, click the Home icon to return to the home screen.

19) Click on the "Files" icon to open the app.

20) Click and drag `pres.numbers` from the Downloads folder into the simulator.

![save file iOS](pathname:///mobile/quasar7a.png)

21) Make sure "On My iPhone" is highlighted and select "Save".

22) Click the Home icon again then select the `SheetJSRN` app.

23) Click "Import data" and select `pres`:

![pick file iOS](pathname:///mobile/rnios2.png)

Once selected, the screen should refresh with new contents:

![read file iOS](pathname:///reactnative/ios3.png)

24) Click "Export data".

An alert will display the location to the file:

![write file iOS](pathname:///reactnative/ios4.png)

25) Find the file and verify the contents are correct:

```bash
find ~/Library/Developer/CoreSimulator -name sheetjsw.xlsx |
  while read x; do echo "$x"; npx xlsx-cli "$x"; done
```

Once testing is complete, stop the simulator and the development process.

**Android Device Testing**

26) Add the highlighted lines to `android/app/src/main/AndroidManifest.xml`:

```xml title="android/app/src/main/AndroidManifest.xml (add highlighted lines)"
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- highlight-start -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
    <!-- highlight-end -->
    <application
      <!-- highlight-next-line -->
      android:requestLegacyExternalStorage="true"
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
```

There will be two new `uses-permission` tags within the parent `manifest` tag.
The attribute `android:requestLegacyExternalStorage="true"` must be added to the
`application` tag.

27) Close any Android / iOS simulators.

Stop the dev server and close the React Native Metro NodeJS window.

28) Connect an Android device using a USB cable.

If the device asks to allow USB debugging, tap "Allow".

29) Build APK and run on device:

```bash
npx react-native run-android
```

30) Download https://docs.sheetjs.com/pres.numbers on the device.

31) Switch back to the "SheetJSRN" app.

32) Tap "Import data" and tap `pres.numbers`.

If the file is not displayed, tap the `≡` icon and tap "Downloads".

The table will refresh with data from the file.

33) Tap "Export Data".

:::note pass

`expo-file-system` on Android will prompt to grant access to a folder.

Tap the `≡` icon and tap the "Documents" folder with the download icon.

Tap the 'ALLOW ACCESS TO "DOCUMENTS"' button.

In the "Allow access" pop, tap "ALLOW".

:::

Tap "OK" in the `exportFile` popup.

34) Switch to the Files app and navigate to the Downloads folder.

:::note pass

When testing `expo-file-system`, select "Documents".

:::

There will be a new file `sheetjsw.xlsx`.

35) Close and reopen the "SheetJSRN" app. The data will reset.

36) Tap "Import data" and tap `sheetjsw.xlsx`.

If the file is not displayed, tap the `≡` icon and tap "Downloads".

:::note pass

When testing `expo-file-system`, select "Documents".

:::

The table will refresh with the data from the exported file.

**iOS Device Testing**

37) Close any Android / iOS emulators.

38) Enable file sharing and make the documents folder visible in the iOS app.
Add the following lines to `ios/SheetJSRN/Info.plist`:

```xml title="ios/SheetJSRN/Info.plist (add to file)"
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

39) Enable developer code signing certificates. More details are covered in the
"iOS Device Testing" part of the [Fetch Demo](#fetch-demo) (step 15).

40) Install `ios-deploy` through Homebrew:

```bash
brew install ios-deploy
```

41) Run on device:

```bash
npx react-native run-ios
```

If the build fails, some troubleshooting notes are included in the "iOS Device
Testing" part of the [Fetch Demo](#fetch-demo) (step 17).

41) Download https://docs.sheetjs.com/pres.numbers on the device.

42) Switch back to the "SheetJSRN" app.

43) Tap "Import data" and tap `pres` from the Recents list.

The table will refresh with data from the file.

44) Tap "Export Data" and tap "OK" in the `exportFile` popup.

45) Install the "Numbers" app from the iOS App Store.

46) Open the "Files" app. Repeatedly tap the `<` button in the top-left corner
to return to the "Browse" view.

47) Tap "On My iPhone" or "On My iPad". Tap "SheetJSRN" in the list.

The `sheetjsw` entry in this folder is the generated file.

48) Hold down the `sheetjsw` item until the menu appears. Select "Share".

49) In the sharing menu, below a list of contacts, there will be a row of app icons.
Swipe left until the "Numbers" app icon appears and tap the app icon.

The Numbers app will load the spreadsheet, confirming that the file is valid.

[^1]: Follow the ["React Native CLI Quickstart"](https://reactnative.dev/docs/environment-setup) and select the appropriate "Development OS".
[^2]: See ["Array of Arrays" in the API reference](/docs/api/utilities/array#array-of-arrays)
[^3]: See ["Array Output" in "Utility Functions"](/docs/api/utilities/array#array-output)
[^4]: See ["Array of Arrays Input" in "Utility Functions"](/docs/api/utilities/array#array-of-arrays-input)
[^5]: React-Native commit [`5b597b5`](https://github.com/facebook/react-native/commit/5b597b5ff94953accc635ed3090186baeecb3873) added the final piece required for `fetch` support. It is available in official releases starting from `0.72.0`.
[^6]: When the demo was last tested, the Temurin distribution of Java 17 was installed through the macOS Brew package manager by running `brew install temurin17`. [Direct downloads are available at `adoptium.net`](https://adoptium.net/temurin/releases/?version=17)
[^7]: See ["Running On Device"](https://reactnative.dev/docs/running-on-device) in the React Native documentation
[^8]: See [`UIFileSharingEnabled`](https://developer.apple.com/documentation/bundleresources/information_property_list/uifilesharingenabled) in the Apple Developer Documentation.
[^9]: See [`LSSupportsOpeningDocumentsInPlace`](https://developer.apple.com/documentation/bundleresources/information_property_list/lssupportsopeningdocumentsinplace) in the Apple Developer Documentation.
[^10]: Follow the ["React Native CLI Quickstart"](https://reactnative.dev/docs/environment-setup) for Android (and iOS, if applicable)
[^11]: See the [JDK Archive](https://jdk.java.net/archive/) for Java 17 JDK download links.