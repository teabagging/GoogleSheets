---
title: Data Conduction in Ionic Apps
sidebar_label: Ionic
description: Build data-intensive mobile apps with Ionic and Cordova. Seamlessly integrate spreadsheets into your app using SheetJS. Let data in your Excel spreadsheets shine.
pagination_prev: demos/static/index
pagination_next: demos/desktop/index
sidebar_position: 4
sidebar_custom_props:
  summary: Native Components + Web View
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Ionic](https://ionicframework.com/) is a mobile app framework for building iOS
and Android apps with the Cordova platform.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Ionic and SheetJS to process data and generate spreadsheets.
We'll explore how to load SheetJS in an Ionic app and use Ionic APIs and plugins
to extract data from, and write data to, spreadsheet files on the device.

The ["Demo"](#demo) creates an app that looks like the screenshots below:

<table><thead><tr>
  <th><a href="#demo">iOS</a></th>
  <th><a href="#demo">Android</a></th>
</tr></thead><tbody><tr><td>

![iOS screenshot](pathname:///ionic/ios.png)

</td><td>

![Android screenshot](pathname:///ionic/and.png)

</td></tr></tbody></table>

:::info pass

This demo covers Ionic apps using the Cordova platform.

The [CapacitorJS demo](/docs/demos/mobile/capacitor) covers CapacitorJS apps.

:::

:::note Tested Deployments

This demo was tested in the following environments:

**Real Devices**

| OS         | Device              | Config | Date       |
|:-----------|:--------------------|:-------|:-----------|
| Android 30 | NVIDIA Shield       | A      | 2024-05-30 |
| iOS 15.1   | iPad Pro            | A      | 2024-05-30 |

**Simulators**

| OS         | Device              | Config | Dev Platform | Date       |
|:-----------|:--------------------|:-------|:-------------|:-----------|
| Android 34 | Pixel 3a            | A      | `darwin-arm` | 2024-05-30 |
| iOS 17.5   | iPhone SE (3rd gen) | A      | `darwin-arm` | 2024-05-30 |

<details>
  <summary><b>Configurations</b> (click to show)</summary>

Configuration A:

- Ionic: `@ionic/angular 8.2.0`, `@ionic/angular-toolkit 11.0.1`
- Cordova: `cordova-lib@12.0.1`, `android 13.0.0, ios 7.1.0`
- File Integration: `@awesome-cordova-plugins/file` version `6.7.0`

</details>

:::

:::danger Telemetry

Before starting this demo, manually disable telemetry.  On Linux and MacOS:

```bash
rm -rf ~/.ionic/
mkdir ~/.ionic
cat <<EOF > ~/.ionic/config.json
{
  "version": "6.20.1",
  "telemetry": false,
  "npmClient": "npm"
}
EOF
npx @capacitor/cli telemetry off
```

To verify telemetry was disabled:

```bash
npx @ionic/cli config get -g telemetry
npx @capacitor/cli telemetry
```

:::

## Integration Details

The [SheetJS NodeJS Module](/docs/getting-started/installation/nodejs) can be
imported from any component or script in the app.

### Internal State

The ["Angular" demo](/docs/demos/frontend/angular) discusses a number of state
representations and preview strategies.

For this demo, the internal state is an "array of arrays"[^1] (`any[][]`):

```ts title="Array of Arrays state"
import { Component } from '@angular/core';
type AOA = any[][];

@Component({...})
export class SheetJSTablePage {
  data: AOA = [
    ["S", "h", "e", "e", "t", "J", "S"],
    [  5,   4,   3,   3,   7,   9,   5]
  ];
  // ...
}
```

### Displaying Data

`ion-grid`[^2] is a display grid component. The Angular `ngFor` directive[^3]
simplifies iteration over the array of arrays:

```html title="Template for displaying an array of arrays"
<ion-grid>
  <ion-row *ngFor="let row of data">
    <ion-col *ngFor="let val of row">
      {{val}}
    </ion-col>
  </ion-row>
</ion-grid>
```

### File Operations

The `cordova-plugin-file` plugin reads and writes files on devices.

:::caution pass

For Android 30+, due to scoped storage rules, the standard file module writes
private files that cannot be accessed from the Files app.

A Storage Access Framework plugin must be used to write external files.

:::

`@awesome-cordova-plugins/file` is a wrapper designed for Ionic + Angular apps.

:::info pass

The plugins in the `@ionic-native` scope have been deprecated. The community
modules in the `@awesome-cordova-plugins` scope should be used.

:::

#### Reading Files

`this.file.readAsArrayBuffer` reads file data from a specified URL and resolves
to `ArrayBuffer` objects.

These objects can be parsed with the SheetJS `read` method[^4]. The SheetJS
`sheet_to_json` method[^5] with the option `header: 1` generates an array of
arrays which can be assigned to the page state:

```ts
/* read a workbook file */
const ab: ArrayBuffer = await this.file.readAsArrayBuffer(url, filename);
/* parse */
const wb: XLSX.WorkBook = XLSX.read(ab, {type: 'array'});
/* generate an array of arrays from the first worksheet */
const ws: XLSX.WorkSheet = wb.SheetNames[wb.Sheets[0]];
const aoa: AOA = XLSX.utils.sheet_to_json(ws, {header: 1});
/* update state */
this.data = aoa;
```

#### Writing Files

`this.file.writeFile` writes file data stored in `Blob` objects to the device.

From the array of arrays, the SheetJS `aoa_to_sheet` method[^6] generates a
worksheet object. The `book_new` and `book_append_sheet` helpers[^7] generate a
workbook object. The SheetJS `write` method[^8] with the option `type: "array"`
will generate an `ArrayBuffer`, from which a `Blob` can be created:

```ts
/* generate worksheet */
const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);

/* generate workbook and add the worksheet */
const wb: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

/* write XLSX to ArrayBuffer */
const ab: ArrayBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

/* generate Blob */
let blob = new Blob([ab], {type: 'application/octet-stream'});

/* write Blob to device */
this.file.writeFile(url, filename, blob, {replace: true});
```

## Demo

The app in this demo will display data in a table.

On load, a [test file](https://docs.sheetjs.com/pres.numbers) will be processed.

When a document is selected with the file picker, it will be processed and the
table will refresh to show the contents.

"Import Data" will attempt to read `SheetJSIonic.xlsx` from a known location. An
alert will display the expected location.

"Export Data" will attempt to export the table data to `SheetJSIonic.xlsx` in a
known location. After writing, an alert will display the location of the file.


### Platform Setup

0) Disable telemetry as noted in the warning.

1) Follow the official instructions for iOS and Android development[^9].

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

Ionic requires Java 17.

</details>

2) Install required global dependencies:

```bash
npm i -g cordova cordova-res @angular/cli native-run @ionic/cli
```

:::note pass

In some systems, the command must be run as the root user:

```bash
sudo npm i -g cordova cordova-res @angular/cli native-run @ionic/cli
```

:::

### Base Project

3) Create a new project:

```bash
ionic start SheetJSIonic blank --type angular --cordova --quiet --no-git --no-link --confirm
```

When asked to select `NgModules` or `Standalone Components`, select `NgModules`

If a prompt asks to confirm Cordova use, enter `Yes` to continue.

If a prompt asks about creating an Ionic account, enter `N` to opt out.

:::caution pass

Due to conflicts in the dependency tree, the command failed in some test runs.

If the package installation fails, forcefully install all modules:

```bash
cd SheetJSIonic
npm i --force @angular/cli
npm i --force
cd ..
```

:::

4) Set up Cordova:

```bash
cd SheetJSIonic
ionic cordova plugin add cordova-plugin-file
ionic cordova platform add ios --confirm
ionic cordova platform add android --confirm
npm i --save @awesome-cordova-plugins/core @awesome-cordova-plugins/file @ionic/cordova-builders
```

:::note pass

If `cordova-plugin-file` is added before the platforms, installation may fail:

```
CordovaError: Could not load API for ios project
```

This can be resolved by removing and reinstalling the `ios` platform:

```bash
ionic cordova platform rm ios
ionic cordova platform add ios --confirm
```

:::

:::caution pass

If the `npm i` step fails due to `rxjs` resolution, add the highlighted lines
to `package.json` to force a resolution:

```js title="package.json"
  "private": true,
  // highlight-start
  "overrides": {
    "rxjs": "~7.5.0"
  },
  // highlight-end
  "dependencies": {
```

Note that the required `rxjs` version will be displayed in the error log.

After adding the lines, the `npm i` command will succeed.

:::

5) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

6) Add `@awesome-cordova-plugins/file` to the module.  Differences highlighted below:

```ts title="src/app/app.module.ts"
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// highlight-next-line
import { File } from '@awesome-cordova-plugins/file/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],

  // highlight-next-line
  providers: [File, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

7) Download [`home.page.ts`](pathname:///ionic/home.page.ts) and replace:

```bash
curl -o src/app/home/home.page.ts -L https://docs.sheetjs.com/ionic/home.page.ts
```

### iOS

8) Enable file sharing and make the documents folder visible in the iOS app.
Add the following lines to `platforms/ios/SheetJSIonic/SheetJSIonic-Info.plist`:

```xml title="platforms/ios/SheetJSIonic/SheetJSIonic-Info.plist (add to file)"
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

9) Build the app and start the simulator

```bash
ionic cordova emulate ios
```

When the app is loaded, a list of Presidents should be displayed. This list is
dynamically generated by fetching and parsing a test file.

:::caution pass

In some test runs, the `cordova build ios --emulator` step failed with error:

```
> cordova build ios --emulator
Could not load API for ios project
```

This was resolved by forcefully installing `cordova-ios`:

```bash
npm i --save cordova-ios
```

:::

:::info pass

In the most recent test, the `native-run ios` command failed with

```
[native-run] ERR_UNKNOWN: Path 'platforms/ios/build/emulator/SheetJSIonic.app' not found
```

Inspecting `platforms/ios/build/`, the actual folder name was:

```bash
% ls platforms/ios/build
#highlight-next-line
Debug-iphonesimulator
```

The iOS simulator can be launched manually:

```bash
native-run ios --app platforms/ios/build/Debug-iphonesimulator/SheetJSIonic.app --virtual
```

:::

:::caution pass

In some tests, the `emulate` command failed with:

```
Error: Unknown argument: platform
[ERROR] An error occurred while running subprocess ng.

        ng run app:ionic-cordova-build --platform=ios exited with exit code 1.
```

The fix is to manually add `@ionic/cordova-builders`:

```bash
ng add @ionic/cordova-builders
```

:::

### Android

10) Enable file reading and writing in the Android app.

Edit `platforms/android/app/src/main/AndroidManifest.xml` and add the following
two lines before the `application` tag:

```xml title="platforms/android/app/src/main/AndroidManifest.xml (add to file)"
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
```

In the `application` tag, add the attribute `android:requestLegacyExternalStorage="true"`.

11) Build the app and start the emulator

```bash
ionic cordova emulate android
```

When the app is loaded, a list of Presidents should be displayed. This list is
dynamically generated by fetching and parsing a test file.

:::caution pass

In some test runs, `cordova build android --emulator` step failed with error:

```
Could not find or parse valid build output file
```

This was resolved by forcefully installing `cordova-android`:

```bash
npm i --save cordova-android
```

:::

:::caution pass

In some tests, the build failed with a Gradle error:

```
Could not find an installed version of Gradle either in Android Studio,
or on your system to install the gradle wrapper. Please include gradle
in your path or install Android Studio
```

On macOS, this issue was resolved by installing gradle with Homebrew manager:

```bash
brew install gradle
```

:::

:::danger pass

When the demo was last tested on Android, reading files worked as expected.
However, the generated files were not externally visible from the Files app.

**This is a known bug with Android SDK 33 and the underlying file plugins!**

:::

[^1]: See ["Array of Arrays" in the API reference](/docs/api/utilities/array#array-of-arrays)
[^2]: See [`ion-grid`](https://ionicframework.com/docs/api/grid) in the Ionic documentation.
[^3]: See [`ngFor`](https://angular.io/api/common/NgFor) in the Angular documentation.
[^4]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^5]: See ["Array Output" in "Utility Functions"](/docs/api/utilities/array#array-output)
[^6]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^7]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^8]: See [`write` in "Writing Files"](/docs/api/write-options)
[^9]: See ["Developing for iOS"](https://ionic-docs-o31kiyk8l-ionic1.vercel.app/docs/v6/developing/ios) and ["Developing for Android"](https://ionic-docs-o31kiyk8l-ionic1.vercel.app/docs/v6/developing/android). The Ionic team removed these pages from the official docs site and recommend the `vercel.app` docs site.
[^10]: See the [JDK Archive](https://jdk.java.net/archive/) for Java 17 JDK download links.
