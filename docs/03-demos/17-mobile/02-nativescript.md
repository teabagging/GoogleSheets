---
title: Native Sheets in NativeScript
sidebar_label: NativeScript
pagination_prev: demos/static/index
pagination_next: demos/desktop/index
sidebar_position: 2
sidebar_custom_props:
  summary: JS + Native Elements
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

export const g = {style: {color:"green"}};
export const r = {style: {color:"red"}};
export const y = {style: {color:"gold"}};

[NativeScript](https://nativescript.org/) is a mobile app framework. It builds
iOS and Android apps that use JavaScript for describing layouts and events.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses NativeScript and SheetJS to process and generate spreadsheets.
We'll explore how to load SheetJS in a NativeScript app; parse and generate
spreadsheets stored on the device; and fetch and parse remote files.

The ["Complete Example"](#complete-example) creates an app that looks like the
screenshots below:

<table><thead><tr>
  <th><a href="#complete-example">iOS</a></th>
  <th><a href="#complete-example">Android</a></th>
</tr></thead><tbody><tr><td>

![iOS screenshot](pathname:///nativescript/ios.png)

</td><td>

![Android screenshot](pathname:///nativescript/and.png)

</td></tr></tbody></table>

:::info pass

The discussion covers the NativeScript + Angular integration.  Familiarity with
Angular and TypeScript is assumed.

:::

:::note Tested Deployments

This demo was tested in the following environments:

**Real Devices**

| OS         | Device              | NS       | Date       |
|:-----------|:--------------------|:---------|:-----------|
| Android 30 | NVIDIA Shield       | `8.7.2`  | 2024-06-09 |
| iOS 15.1   | iPad Pro            | `8.7.2`  | 2024-06-09 |

**Simulators**

| OS         | Device              | NS       | Dev Platform | Date       |
|:-----------|:--------------------|:---------|:-------------|:-----------|
| Android 34 | Pixel 3a            | `8.7.2`  | `darwin-arm` | 2024-06-09 |
| iOS 17.5   | iPhone SE (3rd gen) | `8.7.2`  | `darwin-arm` | 2024-06-09 |
| Android 34 | Pixel 3a            | `8.6.5`  | `win10-x64`  | 2024-04-07 |

:::

:::danger Telemetry

Before starting this demo, manually disable telemetry.

NativeScript 8.6.1 split the telemetry into two parts: "usage" and "error". Both
must be disabled separately:

```bash
npx -p nativescript ns usage-reporting disable
npx -p nativescript ns error-reporting disable
```

To verify telemetry was disabled:

```bash
npx -p nativescript ns usage-reporting status
npx -p nativescript ns error-reporting status
```

:::

## Integration Details

The [SheetJS NodeJS Module](/docs/getting-started/installation/nodejs) can be
imported from any component or script in the app.

The `@nativescript/core/file-system` package provides classes for file access.
The `File` class does not support binary data, but the file access singleton
from `@nativescript/core` does support reading and writing `ArrayBuffer` data.

Reading and writing data require a URL. The following snippet searches typical
document folders for a specified filename:

```ts
import { Folder, knownFolders, path } from '@nativescript/core/file-system';

function get_url_for_filename(filename: string): string {
  const target: Folder = knownFolders.documents() || knownFolders.ios.sharedPublic();
  return path.normalize(target.path + "///" + filename);
}
```

### App Configuration

Due to privacy concerns, apps must request file access. There are special APIs
for accessing data and are subject to change in future platform versions.

<details>
  <summary><b>Technical Details</b> (click to show)</summary>

**Android**

Android security has evolved over the years. In newer Android versions, the
following workarounds were required:

- `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` allow apps to access
files outside of the app scope. These are required for scoped storage access.

When the demo was last tested, this option was enabled by default.

- `android:requestLegacyExternalStorage="true"` enabled legacy behavior in some
older releases.

The manifest is saved to `App_Resources/Android/src/main/AndroidManifest.xml`:

```xml title="App_Resources/Android/src/main/AndroidManifest.xml (add highlighted lines)"
  <application
    <!-- highlight-next-line -->
    android:requestLegacyExternalStorage="true"
    android:name="com.tns.NativeScriptApplication"
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:theme="@style/AppTheme"
    android:hardwareAccelerated="true">
```

- Permissions must be explicitly requested.

`@nativescript-community/perms` is a community module for managing permissions:

```ts title="App script or component"
import { request } from '@nativescript-community/perms';
import { File } from '@nativescript/core/file-system';
```

Storage access must be requested before writing data:

```ts title="App script or component (before writing file)"
  /* request permissions */
  const res = await request('storage');
```

The external paths can be resolved using the low-level APIs:

```ts title="App script or component (writing to downloads folder)"
  /* find Downloads folder */
  const dl_dir = android.os.Environment.DIRECTORY_DOWNLOADS;
  const dl = android.os.Environment.getExternalStoragePublicDirectory(dl_dir).getAbsolutePath();
  /* write to file */
  File.fromPath(dl + "/SheetJSNS.xls").writeSync(data);
```

</details>

### Reading Local Files

`getFileAccess().readBufferAsync` can read data into an `ArrayBuffer` object.
The SheetJS `read` method[^1] can parse this data into a workbook object.[^2]

```ts
import { getFileAccess } from '@nativescript/core';
import { read } from 'xlsx';

/* find appropriate path */
const url = get_url_for_filename("SheetJSNS.xls");

/* get data */
const ab: ArrayBuffer = await getFileAccess().readBufferAsync(url);

/* read workbook */
const wb = read(ab);
```

After parsing into a workbook, the `sheet_to_json`[^3] method can generate row
data objects:

```ts
import { utils } from 'xlsx';

/* grab first sheet */
const wsname: string = wb.SheetNames[0];
const ws = wb.Sheets[wsname];

/* generate array of row objects */
const data = utils.sheet_to_json(ws);
```

### Writing Local Files

The SheetJS `write` method[^4] with the option `type: "binary"` will generate
`Uint8Array` objects. `getFileAccess().writeBufferAsync` can write data from a
`Uint8Array` object to the device.

iOS supports `Uint8Array` directly but Android requires a true array of numbers:

```ts
import { getFileAccess } from '@nativescript/core';
import { write } from 'xlsx';

/* find appropriate path */
const url = get_url_for_filename("SheetJSNS.xls");

/* generate Uint8Array */
const u8: Uint8Array = write(wb, { bookType: 'xls', type: 'binary' });

/* attempt to save Uint8Array to file */
await getFileAccess().writeBufferAsync(url, global.isAndroid ? (Array.from(u8) as any) : u8);
```

A worksheet can be generated from an array of row objects with the SheetJS
`json_to_sheet` method[^5]. After generating an array, the `book_new` and
`book_append_sheet` methods[^6] can create the workbook.

### Fetching Remote Files

`getFile` from `@nativescript/core/http` can download files. After storing the
file in a temporary folder, `getFileAccess().readBufferAsync` can read the data
and the SheetJS `read` method[^7] can parse the file:

```ts
import { knownFolders, path, getFileAccess } from '@nativescript/core'
import { getFile } from '@nativescript/core/http';
import { read } from 'xlsx';

/* generate temporary path for the new file */
const temp: string = path.join(knownFolders.temp().path, "pres.xlsx");

/* download file */
const file = await getFile("https://docs.sheetjs.com/pres.xlsx", temp)

/* get data */
const ab: ArrayBuffer = await getFileAccess().readBufferAsync(file.path);

/* read workbook */
const wb = read(ab);
```

## Complete Example

### Platform Configuration

0) Disable telemetry:

```bash
npx -p nativescript ns usage-reporting disable
npx -p nativescript ns error-reporting disable
```

1) Follow the official Environment Setup instructions[^8].

:::caution pass

When the demo was last tested, the latest version of the Android API was 34.
NativeScript did not support that API level. The exact error message from
`npx -p nativescript ns doctor ios` clearly stated supported versions:

<pre>
<span {...r}>✖</span> No compatible version of the Android SDK Build-tools are installed on your system. You can install any version in the following range: '&gt;=23 &lt;=33'.
</pre>

The SDK Platform `Android 13.0 ("Tiramisu")` was compatible with NativeScript.
Until NativeScript properly supports API level 34, "Tiramisu" must be used.
This requires installing the following packages from Android Studio:

- `Android 13.0 ("Tiramisu")` API Level `33`
- `Android SDK Build-Tools` Version `33.0.2`

:::

2) Test the local system configuration for Android development:

```bash
npx -p nativescript ns doctor android
```

In the last macOS test, the following output was displayed:

<details open>
  <summary><b>Expected output</b> (click to hide)</summary>

<pre>
<span {...g}>✔</span> Getting environment information

<b>No issues were detected.</b>
<span {...g}>✔</span> Your ANDROID_HOME environment variable is set and points to correct directory.
<span {...g}>✔</span> Your adb from the Android SDK is correctly installed.
<span {...g}>✔</span> The Android SDK is installed.
<span {...g}>✔</span> A compatible Android SDK for compilation is found.
<span {...g}>✔</span> Javac is installed and is configured properly.
<span {...g}>✔</span> The Java Development Kit (JDK) is installed and is configured properly.
<span {...g}>✔</span> Getting NativeScript components versions information...
<span {...g}>✔</span> Component nativescript has 8.7.2 version and is up to date.
</pre>

</details>

3) Test the local system configuration for iOS development (macOS only):

```bash
npx -p nativescript ns doctor ios
```

In the last macOS test, the following output was displayed:

<details open>
  <summary><b>Expected output</b> (click to hide)</summary>

<pre>
<span {...g}>✔</span> Getting environment information

<b>No issues were detected.</b>
<span {...g}>✔</span> Xcode is installed and is configured properly.
<span {...g}>✔</span> xcodeproj is installed and is configured properly.
<span {...g}>✔</span> CocoaPods are installed.
<span {...g}>✔</span> CocoaPods update is not required.
<span {...g}>✔</span> CocoaPods are configured properly.
<span {...g}>✔</span> Your current CocoaPods version is newer than 1.0.0.
<span {...g}>✔</span> Python installed and configured correctly.
<span {...g}>✔</span> Xcode version 15.4.0 satisfies minimum required version 10.
<span {...g}>✔</span> Getting NativeScript components versions information...
<span {...g}>✔</span> Component nativescript has 8.7.2 version and is up to date.
</pre>

</details>

### Base Project

4) Create a skeleton NativeScript + Angular app:

```bash
npx -p nativescript ns create SheetJSNS --ng
```

5) Launch the app in the android simulator to verify the app:

```bash
cd SheetJSNS
npx -p nativescript ns run android
```

(this may take a while)

Once the simulator launches and the test app is displayed, end the script by
selecting the terminal and pressing <kbd>CTRL</kbd>+<kbd>C</kbd>. On Windows, if
prompted to `Terminate batch job`, type `y` and press Enter.

:::note pass

If the emulator is not running, `nativescript` may fail with the message:

```
Emulator start failed with: No emulator image available for device identifier 'undefined'.
```

:::

### Add SheetJS

:::note pass

The goal of this section is to display the SheetJS library version number.

:::

6) From the project folder, install the SheetJS NodeJS module:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

7) Edit `src/app/item/items.component.ts` so that the component imports the
SheetJS version string and adds it to a `version` variable in the component:

```ts title="src/app/item/items.component.ts (add highlighted lines)"
// highlight-next-line
import { version } from 'xlsx';
import { Component, OnInit } from '@angular/core'

// ...

export class ItemsComponent implements OnInit {
  items: Array<Item>
  // highlight-next-line
  version = `SheetJS - ${version}`;

  constructor(private itemService: ItemService) {}
// ...
```

8) Edit the template `src/app/item/items.component.html` to reference `version`
in the title of the action bar:

```xml title="src/app/item/items.component.html (edit highlighted line)"
<!-- highlight-next-line -->
<ActionBar [title]="version"></ActionBar>

<GridLayout>
<!-- ... -->
```

9) End the script and relaunch the app in the Android simulator:

```bash
npx -p nativescript ns run android
```

The title bar should show the version.

![NativeScript Step 4](pathname:///nativescript/step4.png)

### Local Files

10) Add the Import and Export buttons to the template:

```xml title="src/app/item/items.component.html (add highlighted lines)"
<ActionBar [title]="version"></ActionBar>

<!-- highlight-start -->
<StackLayout>
  <StackLayout orientation="horizontal">
    <Button text="Import File" (tap)="import()" style="padding: 10px"></Button>
    <Button text="Export File" (tap)="export()" style="padding: 10px"></Button>
  </StackLayout>
<!-- highlight-end -->
  <ListView [items]="items">
    <!-- ... -->
  </ListView>
<!-- highlight-next-line -->
</StackLayout>
```

11) Add the `import` and `export` methods in the component script:

```ts title="src/app/item/items.component.ts"
// highlight-start
import { version, utils, read, write } from 'xlsx';
import { Dialogs, getFileAccess } from '@nativescript/core';
import { Folder, knownFolders, path } from '@nativescript/core/file-system';
// highlight-end
import { Component, OnInit } from '@angular/core'

import { Item } from './item'
import { ItemService } from './item.service'

// highlight-start
function get_url_for_filename(filename: string): string {
  const target: Folder = knownFolders.documents() || knownFolders.ios.sharedPublic();
  return path.normalize(target.path + "///" + filename);
}
// highlight-end

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: Array<Item>
  version: string = `SheetJS - ${version}`;

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.items = this.itemService.getItems()
  }

  // highlight-start
  /* Import button */
  async import() {
  }

  /* Export button */
  async export() {
  }
  // highlight-end
}
```

12) End the script and relaunch the app in the Android simulator:

```bash
npx -p nativescript ns run android
```

Two buttons should appear just below the header:

![NativeScript Step 5](pathname:///nativescript/step5.png)

13) Implement import and export by adding the highlighted lines:

```ts title="src/app/item/items.component.ts (add highlighted lines)"
  /* Import button */
  async import() {
    // highlight-start
    /* find appropriate path */
    const url = get_url_for_filename("SheetJSNS.xls");

    try {
      await Dialogs.alert(`Attempting to read from SheetJSNS.xls at ${url}`);
      /* get data */
      const ab: ArrayBuffer = await getFileAccess().readBufferAsync(url);

      /* read workbook */
      const wb = read(ab);

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      /* update table */
      this.items = utils.sheet_to_json<Item>(ws);
    } catch(e) { await Dialogs.alert(e.message); }
    // highlight-end
  }

  /* Export button */
  async export() {
    // highlight-start
    /* find appropriate path */
    const url = get_url_for_filename("SheetJSNS.xls");

    try {
      /* create worksheet from data */
      const ws = utils.json_to_sheet(this.items);

      /* create workbook from worksheet */
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Sheet1");

      /* generate Uint8Array */
      const u8: Uint8Array = write(wb, { bookType: 'xls', type: 'buffer' });

      /* attempt to save Uint8Array to file */
      await getFileAccess().writeBufferAsync(url, global.isAndroid ? (Array.from(u8) as any) : u8);
      await Dialogs.alert(`Wrote to SheetJSNS.xls at ${url}`);
    } catch(e) { await Dialogs.alert(e.message); }
    // highlight-end
  }
```

### Android

14) Launch the app in the Android Simulator:

```bash
npx -p nativescript ns run android
```

If the app does not automatically launch, manually open the `SheetJSNS` app.

15) Tap "Export File". A dialog will print where the file was written. Typically
the URL is `/data/user/0/org.nativescript.SheetJSNS/files/SheetJSNS.xls`

16) Pull the file from the simulator. The following commands should be run in a
new terminal or PowerShell window:

```bash
adb root
adb pull /data/user/0/org.nativescript.SheetJSNS/files/SheetJSNS.xls SheetJSNS.xls
```

If the emulator cannot be rooted, the following command works in macOS:

```bash
adb shell "run-as org.nativescript.SheetJSNS cat /data/user/0/org.nativescript.SheetJSNS/files/SheetJSNS.xls" > SheetJSNS.xls
```

17) Open `SheetJSNS.xls` with a spreadsheet editor.

After the header row, insert a row with cell A2 = 0, B2 = SheetJS, C2 = Library:

```text
id | name       | role
# highlight-next-line
 0 | SheetJS    | Library
 1 | Ter Stegen | Goalkeeper
 3 | Piqué      | Defender
...
```

18) Push the file back to the simulator:

```bash
adb push SheetJSNS.xls /data/user/0/org.nativescript.SheetJSNS/files/SheetJSNS.xls
```

If the emulator cannot be rooted, the following command works in macOS:

```bash
dd if=SheetJSNS.xls | adb shell "run-as org.nativescript.SheetJSNS dd of=/data/user/0/org.nativescript.SheetJSNS/files/SheetJSNS.xls"
 ```

19) Tap "Import File".  A dialog will print the path of the file that was read.
The first item in the list will change.

![NativeScript Step 6](pathname:///nativescript/step6.png)

### iOS

:::danger pass

**iOS testing can only be performed on Apple hardware running macOS!**

Xcode and iOS simulators are not available on Windows or Linux.

Scroll down to ["Fetching Files"](#android-device) for Android device testing.

:::

20) Launch the app in the iOS Simulator:

```bash
npx -p nativescript ns run ios
```

21) Tap "Export File". A dialog will print where the file was written.

22) Open the file with a spreadsheet editor.

After the header row, insert a row with cell A2 = 0, B2 = SheetJS, C2 = Library:

```text
id | name       | role
# highlight-next-line
 0 | SheetJS    | Library
 1 | Ter Stegen | Goalkeeper
 3 | Piqué      | Defender
...
```

23) Restart the app after saving the file.

24) Tap "Import File".  A dialog will print the path of the file that was read.
The first item in the list will change:

![NativeScript Step 7](pathname:///nativescript/step7.png)

### Fetching Files

25) In `src/app/item/items.component.ts`, make `ngOnInit` asynchronous:

```ts title="src/app/item/items.component.ts (replace existing function)"
  async ngOnInit(): Promise<void> {
    this.items = await this.itemService.getItems()
  }
```

26) Replace `item.service.ts` with the following:

```ts title="src/app/item/item.service.ts"
import { Injectable } from '@angular/core'

import { knownFolders, path, getFileAccess } from '@nativescript/core'
import { getFile } from '@nativescript/core/http';
import { read, utils  } from 'xlsx';

import { Item } from './item'
interface IPresident { Name: string; Index: number };

@Injectable({ providedIn: 'root' })
export class ItemService {
  private items: Array<Item>;

  async getItems(): Promise<Array<Item>> {
    /* fetch https://docs.sheetjs.com/pres.xlsx */
    const temp: string = path.join(knownFolders.temp().path, "pres.xlsx");
    const ab = await getFile("https://docs.sheetjs.com/pres.xlsx", temp)
    /* read the temporary file */
    const wb = read(await getFileAccess().readBufferAsync(ab.path));
    /* translate the first worksheet to the required Item type */
    const data = utils.sheet_to_json<IPresident>(wb.Sheets[wb.SheetNames[0]]);
    return this.items = data.map((pres, id) => ({id, name: pres.Name, role: ""+pres.Index} as Item));
  }

  getItem(id: number): Item {
    return this.items.filter((item) => item.id === id)[0]
  }
}
```

27) End the script and relaunch the app in the Android simulator:

```bash
npx -p nativescript ns run android
```

The app should show Presidential data.

### Android Device

28) Connect an Android device using a USB cable.

If the device asks to allow USB debugging, tap "Allow".

29) Close any Android / iOS emulators.

30) Enable "Legacy External Storage" in the Android app. The manifest is stored
at `App_Resources/Android/src/main/AndroidManifest.xml`:

```xml title="App_Resources/Android/src/main/AndroidManifest.xml (add highlighted line)"
  <application
    <!-- highlight-next-line -->
    android:requestLegacyExternalStorage="true"
    android:name="com.tns.NativeScriptApplication"
    android:allowBackup="true"
    android:icon="@mipmap/ic_launcher"
    android:label="@string/app_name"
    android:theme="@style/AppTheme"
    android:hardwareAccelerated="true">
```

31) Install the `@nativescript-community/perms` dependency:

```bash
npm i --save @nativescript-community/perms
```

32) Add the highlighted lines to `items.component.ts`:

- Import `File` from NativeScript core and `request` from the new dependency:

```ts title="items.component.ts (add highlighted lines)"
import { Dialogs, getFileAccess, Utils } from '@nativescript/core';
// highlight-start
import { request } from '@nativescript-community/perms';
import { Folder, knownFolders, path, File } from '@nativescript/core/file-system';
// highlight-end
import { Component, OnInit } from '@angular/core'
// ...
```

- Add a new write operation to the `export` method:

```ts title="items.component.ts (add highlighted lines)"
      /* attempt to save Uint8Array to file */
      await getFileAccess().writeBufferAsync(url, global.isAndroid ? (Array.from(u8) as any) : u8);
      await Dialogs.alert(`Wrote to SheetJSNS.xls at ${url}`);

      /* highlight-start */
      if(global.isAndroid) {
        /* request permissions */
        const res = await request('storage');
        /* write to Downloads folder */
        const dl = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
        File.fromPath(dl + "/SheetJSNS.xls").writeSync(Array.from(u8));
      }
      /* highlight-end */
    } catch(e) { await Dialogs.alert(e.message); }
```

33) Build APK and run on device:

```bash
npx -p nativescript ns run android
```

If the Android emulators are closed and an Android device is connected, the last
command will build an APK and install on the device.

<details open>
  <summary><b>Android Device Testing</b> (click to hide)</summary>

When the app launches, if the SheetJS library is loaded and if the device is
connected to the Internet, a list of Presidents should be displayed.

Tap "Export File". The app will show an alert. Tap "OK".

Switch to the "Files" app and open the "Downloads" folder. There should be a new
file named `SheetJSNS.xls`.

</details>

### iOS Device

34) Connect an iOS device using a USB cable

35) Close any Android / iOS emulators.

36) Enable developer code signing certificates:

Open `platforms/ios/SheetJSNS.xcodeproj/project.xcworkspace` in Xcode. Select
the "Project Navigator" and select the "App" project. In the main view, select
"Signing & Capabilities". Under "Signing", select a team in the dropdown menu.

37) Run on device:

```bash
npx -p nativescript ns run ios
```

<details open>
  <summary><b>iOS Device Testing</b> (click to hide)</summary>

When the app launches, if the SheetJS library is loaded and if the device is
connected to the Internet, a list of Presidents should be displayed.

Tap "Export File". The app will show an alert. Tap "OK".

Switch to the "Files" app and open the "Downloads" folder. There should be a new
file named `SheetJSNS.xls`.

</details>

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See ["Workbook Object"](/docs/csf/book)
[^3]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^4]: See [`write` in "Writing Files"](/docs/api/write-options)
[^5]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^6]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^7]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^8]: See ["Local setup"](https://docs.nativescript.org/setup/#local-setup) in the NativeScript documentation. For Windows and Linux, follow the "Android" instructions. For macOS, follow both the iOS and Android instructions.
