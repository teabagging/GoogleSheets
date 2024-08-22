---
title: Sheets on the Desktop with React Native
sidebar_label: React Native
description: Build data-intensive desktop apps with React Native. Seamlessly integrate spreadsheets into your app using SheetJS. Securely process and generate Excel files at the desk.
pagination_prev: demos/mobile/index
pagination_next: demos/cli/index
sidebar_position: 6
sidebar_custom_props:
  summary: Native Components with React
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

React Native for Windows + macOS[^1] is a backend for React Native that supports
native apps.  The Windows backend builds apps for use on Windows 10 / 11, Xbox,
and other supported platforms.  The macOS backend supports macOS 10.14 SDK

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses React Native for Windows + macOS and SheetJS to process
spreadsheets. We'll explore how to load SheetJS in a React Native deskktop app
and create native modules for selecting and reading files from the computer.

The Windows and macOS demos create apps that look like the screenshots below:

<table><thead><tr>
  <th><a href="#windows-demo">Windows</a></th>
  <th><a href="#macos-demo">macOS</a></th>
</tr></thead><tbody><tr><td>

![Windows screenshot](pathname:///reactnative/rnw.png)

</td><td>

![macOS screenshot](pathname:///reactnative/rnm.png)

</td></tr></tbody></table>

:::note Tested Deployments

This demo was tested in the following environments:

| OS and Version | Architecture | RN Platform | Date       |
|:---------------|:-------------|:------------|:-----------|
| Windows 10     | `win10-x64`  | `v0.74.6`   | 2024-05-28 |
| Windows 11     | `win11-x64`  | `v0.74.6`   | 2024-05-28 |
| Windows 11     | `win11-arm`  | `v0.74.5`   | 2024-05-25 |
| MacOS 14.4     | `darwin-x64` | `v0.73.22`  | 2024-03-24 |
| MacOS 14.5     | `darwin-arm` | `v0.73.30`  | 2024-05-28 |

:::

:::info pass

This section covers React Native for desktop applications.  For iOS and Android
applications, [check the mobile demo](/docs/demos/mobile/reactnative)

:::

:::danger Telemetry

**React Native for Windows + macOS commands include telemetry without proper**
**disclaimer or global opt-out.**

The recommended approach for suppressing telemetry is explicitly passing the
`--no-telemetry` flag. The following commands are known to support the flag:

- Initializing a macOS project with `react-native-macos-init`
- Initializing a Windows project with `react-native-windows-init`
- Running Windows apps with `react-native run-windows`

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

The state is initialized with the following snippet:

```js
const [ aoa, setAoA ] = useState(["SheetJS".split(""), "5433795".split("")]);
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
  setAoA(data);
}
```

### Displaying Data

The demos use native `View` elements from `react-native` to display data.

<details>
  <summary><b>Explanation</b> (click to show)</summary>

Since some spreadsheets may have empty cells between cells containing data,
looping over the rows may skip values!

This example explicitly loops over the row and column indices.

**Determining the Row Indices**

The first row index is `0` and the last row index is `aoa.length - 1`. This
corresponds to the `for` loop:

```js
for(var R = 0; R < aoa.length; ++R) {/* ... */}
```

**Determining the Column Indices**

The first column index is `0` and the last column index must be calculated from
the maximum column index across every row.

Traditionally this would be implemented in a `for` loop:

```js
var max_col_index = 0;
for(var R = 0; R < aoa.length; ++R) {
  if(!aoa[R]) continue;
  max_col_index = Math.max(max_col_index, aoa[R].length - 1);
}
```

`Array#reduce` simplifies this calculation:

```js
const max_col_index = aoa.reduce((C,row) => Math.max(C,row.length), 1) - 1;
```

**Looping from 0 to N-1**

Traditionally a `for` loop would be used:

```js
var data = [];
for(var R = 0; R < max_row; ++R) data[R] = func(R);
```

For creating an array of React Native components, `Array.from` should be used:

```jsx
var children = Array.from({length: max_row}, (_,R) => ( <Row key={R} /> ));
```

</details>

The relevant parts for rendering data are shown below:

```jsx
import React, { useState, type FC } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';

const App: FC = () => {
  const [ aoa, setAoA ] = useState(["SheetJS".split(""), "5433795".split("")]);
  const max_cols = aoa.reduce((acc,row) => Math.max(acc,row.length),1);

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        {/* Table Container */}
        <View>{
          /* Loop over the row indices */
          // highlight-next-line
          Array.from({length: aoa.length}, (_, R) => (
            /* Table Row */
            <View key={R}>{
              /* Loop over the column indices */
              // highlight-next-line
              Array.from({length: max_cols}, (_, C) => (
                /* Table Cell */
                <View key={C}>
                   // highlight-next-line
                  <Text>{String(aoa?.[R]?.[C]??"")}</Text>
                </View>
              ))
            }</View>
          ))
        }</View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default App;
```

## Native Modules

:::caution pass

As with the mobile versions of React Native, file operations are not provided
by the base SDK. The examples include native code for both Windows and macOS.

The Windows demo assumes some familiarity with C++ / C# and the macOS demo
assumes some familiarity with Objective-C.

:::

React Native for Windows + macOS use Turbo Modules[^4] for native integrations.

The demos define a native module named `DocumentPicker`.

### Reading Files

The native modules in the demos define a `PickAndRead` function that will show
the file picker, read the file contents, and return a Base64 string.

Only the main UI thread can show file pickers.  This is similar to Web Worker
DOM access limitations in the Web platform.

_Integration_

This module can be referenced from the Turbo Module Registry:

```js
import { read } from 'xlsx';
import { getEnforcing } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
const DocumentPicker = getEnforcing('DocumentPicker');


/* ... in some event handler ... */
async() => {
  const b64 = await DocumentPicker.PickAndRead();
  const wb = read(b64);
  // DO SOMETHING WITH `wb` HERE
}
```

_Native Module_

<Tabs groupId="os">
  <TabItem value="win" label="Windows">

React Native Windows supports C++ and C# projects.

<Tabs groupId="rnwlang">
  <TabItem value="cs" label="C#">

```csharp
[ReactMethod("PickAndRead")]
public async void PickAndRead(IReactPromise<string> result) {
  /* perform file picker action in the UI thread */
  // highlight-next-line
  context.Handle.UIDispatcher.Post(async() => { try {
    /* create file picker */
    var picker = new FileOpenPicker();
    picker.SuggestedStartLocation = PickerLocationId.DocumentsLibrary;
    picker.FileTypeFilter.Add(".xlsx");
    picker.FileTypeFilter.Add(".xls");

    /* show file picker */
    // highlight-next-line
    var file = await picker.PickSingleFileAsync();
    if(file == null) throw new Exception("File not found");

    /* read data and return base64 string */
    var buf = await FileIO.ReadBufferAsync(file);
    // highlight-next-line
    result.Resolve(CryptographicBuffer.EncodeToBase64String(buf));
  } catch(Exception e) { result.Reject(new ReactError { Message = e.Message }); }});
}
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
REACT_METHOD(PickAndRead);
void PickAndRead(ReactPromise<winrt::hstring> promise) noexcept {
  auto prom = promise;
  /* perform file picker action in the UI thread */
  // highlight-next-line
  context.UIDispatcher().Post([prom = std::move(prom)]()->winrt::fire_and_forget {
    auto p = prom; // promise -> prom -> p dance avoids promise destruction

    /* create file picker */
    FileOpenPicker picker;
    picker.SuggestedStartLocation(PickerLocationId::DocumentsLibrary);
    picker.FileTypeFilter().Append(L".xlsx");
    picker.FileTypeFilter().Append(L".xls");

    /* show file picker */
    // highlight-next-line
    StorageFile file = co_await picker.PickSingleFileAsync();
    if(file == nullptr) { p.Reject("File not Found"); co_return; }

    /* read data and return base64 string */
    auto buf = co_await FileIO::ReadBufferAsync(file);
    // highlight-next-line
    p.Resolve(CryptographicBuffer::EncodeToBase64String(buf));
    co_return;
  });
}
```

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="mac" label="macOS">

React Native macOS supports Objective-C modules

```objc
/* the resolve/reject is projected on the JS side as a Promise */
RCT_EXPORT_METHOD(PickAndRead:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  /* perform file picker action in the UI thread */
  // highlight-next-line
  RCTExecuteOnMainQueue(^{
    /* create file picker */
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setCanChooseDirectories:NO];
    [panel setAllowsMultipleSelection:NO];
    [panel setMessage:@"Select a spreadsheet to read"];

    /* show file picker */
    // highlight-next-line
    [panel beginWithCompletionHandler:^(NSInteger result){
      if (result == NSModalResponseOK) {
        /* read data and return base64 string */
        NSURL *selected = [[panel URLs] objectAtIndex:0];
        NSFileHandle *hFile = [NSFileHandle fileHandleForReadingFromURL:selected error:nil];
        if(hFile) {
          NSData *data = [hFile readDataToEndOfFile];
          // highlight-next-line
          resolve([data base64EncodedStringWithOptions:0]);
        } else reject(@"read_failure", @"Could not read selected file!", nil);
      } else reject(@"select_failure", @"No file selected!", nil);
    }];
  });
}
```

  </TabItem>
</Tabs>


## Windows Demo

:::danger pass

There is no simple standalone executable file at the end of the process.

[The official documentation describes distribution strategies](https://microsoft.github.io/react-native-windows/docs/native-code#distribution)

:::

:::note pass

React Native Windows supports writing native code in C++ or C#.  This demo has
been tested against both application types.

:::

0) Install the [development dependencies](https://microsoft.github.io/react-native-windows/docs/rnw-dependencies).

:::caution pass

In earlier versions of React Native, NodeJS `v16` was required. A tool like
[`nvm-windows`](https://github.com/coreybutler/nvm-windows/releases) should be
used to switch the NodeJS version.

:::

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

When the demo was last tested, a PowerShell script installed dependencies:

```powershell
Set-ExecutionPolicy Unrestricted -Scope Process -Force;
iex (New-Object System.Net.WebClient).DownloadString('https://aka.ms/rnw-vs2022-deps.ps1');
```

If any step fails to install, open the dependencies page and expand "Manual
setup instructions" to find instructions for manual installation.

</details>

### Project Setup

1) Create a new project using React Native `0.74.1`:

```bash
npx react-native init SheetJSWin --template react-native@0.74.1
cd SheetJSWin
```

2) Create the Windows part of the application:

<Tabs groupId="rnwlang">
  <TabItem value="cs" label="C#">

```bash
npx react-native-windows-init --no-telemetry --overwrite --language=cs
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```bash
npx react-native-windows-init --no-telemetry --overwrite
```

  </TabItem>
</Tabs>

3) Install the SheetJS library:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

4) To ensure that the app works, launch the app:

<Tabs groupId="arch">
  <TabItem value="x64" label="x64 (64-bit Windows)">

```bash
npx react-native run-windows --no-telemetry
```

:::caution pass

When the demo was tested in Windows 11, the run step failed with the message:

> The Windows SDK version `10.0.19041.0` was not found

Specific Windows SDK versions can be installed through Visual Studio Installer.

:::

  </TabItem>
  <TabItem value="arm" label="ARM64">

```bash
npx react-native run-windows --no-telemetry --arch=X86
```

:::danger pass

The ARM64 binary is normally built with

```bash
npx react-native run-windows --no-telemetry --arch=ARM64
```

When this demo was last tested on Windows 11 ARM, the build failed.

**As it affects the starter project, it is a bug in ARM64 React Native Windows**

:::

  </TabItem>
</Tabs>

### Native Module

<Tabs groupId="rnwlang">
  <TabItem value="cs" label="C#">

5) Download [`DocumentPicker.cs`](pathname:///reactnative/DocumentPicker.cs) and
save to `windows\SheetJSWin\DocumentPicker.cs`.

<Tabs groupId="shell">
  <TabItem value="pwsh" label="PowerShell">

```bash
iwr -Uri https://docs.sheetjs.com/reactnative/DocumentPicker.cs -OutFile windows/SheetJSWin/DocumentPicker.cs
```

  </TabItem>
  <TabItem value="bash" label="WSL Bash">

```bash
curl -Lo windows/SheetJSWin/DocumentPicker.cs https://docs.sheetjs.com/reactnative/DocumentPicker.cs
```

  </TabItem>
</Tabs>



6) Edit `windows\SheetJSWin\SheetJSWin.csproj` to reference `DocumentPicker.cs`

Search for `ReactPackageProvider.cs` in the file. There will be one instance.
Add the highlighted line just before that instance:

```xml title="windows\SheetJSWin\SheetJSWin.csproj (add highlighted line)"
<!-- highlight-next-line -->
    <Compile Include="DocumentPicker.cs" />
    <Compile Include="ReactPackageProvider.cs" />
  </ItemGroup>
```

  </TabItem>
  <TabItem value="cpp" label="C++">

5) Download [`DocumentPicker.h`](pathname:///reactnative/DocumentPicker.h) and
save to `windows\SheetJSWin\DocumentPicker.h`.

<Tabs groupId="shell">
  <TabItem value="pwsh" label="PowerShell">

```bash
iwr -Uri https://docs.sheetjs.com/reactnative/DocumentPicker.h -OutFile windows/SheetJSWin/DocumentPicker.h
```

  </TabItem>
  <TabItem value="bash" label="WSL Bash">

```bash
curl -Lo windows/SheetJSWin/DocumentPicker.h https://docs.sheetjs.com/reactnative/DocumentPicker.h
```

  </TabItem>
</Tabs>

6) Add the highlighted line to `windows\SheetJSWin\ReactPackageProvider.cpp`:

```cpp title="windows\SheetJSWin\ReactPackageProvider.cpp"
#include "ReactPackageProvider.h"
// highlight-next-line
#include "DocumentPicker.h"
#include "NativeModules.h"
```

  </TabItem>
</Tabs>

Now the native module will be added to the app.

### Application

7) Remove `App.js` (if it exists) and download [`App.tsx`](https://docs.sheetjs.com/reactnative/rnw/App.tsx):

<Tabs groupId="shell">
  <TabItem value="pwsh" label="PowerShell">

```bash
rm App.js
iwr -Uri https://docs.sheetjs.com/reactnative/rnw/App.tsx -OutFile App.tsx
```

  </TabItem>
  <TabItem value="bash" label="WSL Bash">

```bash
rm App.js
curl -LO https://docs.sheetjs.com/reactnative/rnw/App.tsx
```

  </TabItem>
</Tabs>



8) Launch the app again:

<Tabs groupId="arch">
  <TabItem value="x64" label="x64 (64-bit Windows)">

```bash
npx react-native run-windows --no-telemetry
```

  </TabItem>
  <TabItem value="arm" label="ARM64">

```bash
npx react-native run-windows --no-telemetry --arch=X86
```

:::danger pass

The ARM64 binary is normally built with

```bash
npx react-native run-windows --no-telemetry --arch=ARM64
```

When this demo was last tested on Windows 11 ARM, the build failed.

**As it affects the starter project, it is a bug in ARM64 React Native Windows**

:::

  </TabItem>
</Tabs>

9) Download https://docs.sheetjs.com/pres.xlsx.

10) In the app, click "Click here to Open File!" and use the file picker to
select `pres.xlsx` . The app will refresh and display the data from the file.

## macOS Demo

:::info pass

When the demo was last tested, the official website asserted that the React
Native for macOS required React Native `0.71`.

**The official documentation is out of date.**

There exist official `react-native-macos` releases compatible with RN `0.73`

:::

0) Follow the "Setting up the development environment"[^5] guide in the React
   Native documentation for "React Native CLI Quickstart" + "macOS" + "iOS".

### Project Setup

1) Create a new React Native project using React Native `0.73`:

```bash
npx -y react-native init SheetJSmacOS --template react-native@^0.73.0
cd SheetJSmacOS
```

If prompted to install CocoaPods, type `Y`.

2) Create the MacOS part of the application:

```bash
npx -y react-native-macos-init --no-telemetry
```

:::caution pass

In some macOS tests, the build failed due to `visionos` errors:

```
[!] Failed to load 'React-RCTFabric' podspec:
[!] Invalid `React-RCTFabric.podspec` file: undefined method `visionos' for #<Pod::Specification name="React-RCTFabric">.
```

This error was resolved by upgrading CocoaPods to `1.15.2`:

```bash
sudo gem install cocoapods
```

After upgrading CocoaPods, reinstall the project pods:

```bash
cd macos
pod install
cd ..
```

:::

3) Install the SheetJS library:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

4) To ensure that the app works, launch the app:

```bash
npx react-native run-macos
```

Close the running app from the dock and close the Metro terminal window.

:::danger pass

When the demo was last tested, the app failed with a warning

> No bundle URL present.

**As this affects the default app, this is a bug in React Native macOS!**

The production builds work as expected. If there are errors, click "Dismiss" to
dismiss the error, close the app, and [make a release build](#production).

:::

### Native Module

5) Create the file `macos/SheetJSmacOS-macOS/RCTDocumentPicker.h` with the
   following contents:

```objc title="macos/SheetJSmacOS-macOS/RCTDocumentPicker.h"
#import <React/RCTBridgeModule.h>
@interface RCTDocumentPicker : NSObject <RCTBridgeModule>
@end
```

6) Create the file `macos/SheetJSmacOS-macOS/RCTDocumentPicker.m` with the
    following contents:

```objc title="macos/SheetJSmacOS-macOS/RCTDocumentPicker.m"
#import <Foundation/Foundation.h>
#import <React/RCTUtils.h>

#import "RCTDocumentPicker.h"

@implementation RCTDocumentPicker

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(PickAndRead:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  RCTExecuteOnMainQueue(^{
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setCanChooseDirectories:NO];
    [panel setAllowsMultipleSelection:NO];
    [panel setMessage:@"Select a spreadsheet to read"];

    [panel beginWithCompletionHandler:^(NSInteger result){
      if (result == NSModalResponseOK) {
        NSURL *selected = [[panel URLs] objectAtIndex:0];
        NSFileHandle *hFile = [NSFileHandle fileHandleForReadingFromURL:selected error:nil];
        if(hFile) {
          NSData *data = [hFile readDataToEndOfFile];
          resolve([data base64EncodedStringWithOptions:0]);
        } else reject(@"read_failure", @"Could not read selected file!", nil);
      } else reject(@"select_failure", @"No file selected!", nil);
    }];
  });
}
@end
```

7) Edit the project file `macos/SheetJSmacOS.xcodeproj/project.pbxproj`.

There are four places where lines must be added:

:::note pass

A) Copy the highlighted line and paste under `/* Begin PBXBuildFile section */`:

```plist
/* Begin PBXBuildFile section */
// highlight-next-line
    4717DC6A28CC499A00A9BE56 /* RCTDocumentPicker.m in Sources */ = {isa = PBXBuildFile; fileRef = 4717DC6928CC499A00A9BE56 /* RCTDocumentPicker.m */; };
    5142014D2437B4B30078DB4F /* AppDelegate.mm in Sources */ = {isa = PBXBuildFile; fileRef = 5142014C2437B4B30078DB4F /* AppDelegate.mm */; };
```

:::

:::note pass

B) Copy the highlighted lines and paste under `/* Begin PBXFileReference section */`:

```plist
/* Begin PBXFileReference section */
// highlight-start
    4717DC6828CC495400A9BE56 /* RCTDocumentPicker.h */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.h; name = RCTDocumentPicker.h; path = "SheetJSMacOS-macOS/RCTDocumentPicker.h"; sourceTree = "<group>"; };
    4717DC6928CC499A00A9BE56 /* RCTDocumentPicker.m */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.c.objc; name = RCTDocumentPicker.m; path = "SheetJSMacOS-macOS/RCTDocumentPicker.m"; sourceTree = "<group>"; };
// highlight-end
```

:::

:::note pass

C) The goal is to add a reference to the `PBXSourcesBuildPhase` block for the
`macOS` target.  To determine this, look in the `PBXNativeTarget section` for
a block with the comment `SheetJSmacOS-macOS`:

```plist
/* Begin PBXNativeTarget section */
...
      productType = "com.apple.product-type.application";
    };
// highlight-next-line
    514201482437B4B30078DB4F /* SheetJSmacOS-macOS */ = {
      isa = PBXNativeTarget;
...
/* End PBXNativeTarget section */
```

Within the block, look for `buildPhases` and find the hex string for `Sources`:

```plist
    514201482437B4B30078DB4F /* SheetJSmacOS-macOS */ = {
      isa = PBXNativeTarget;
      buildConfigurationList = 5142015A2437B4B40078DB4F /* Build configuration list for PBXNativeTarget "SheetJSmacOS-macOS" */;
      buildPhases = (
        1A938104A937498D81B3BD3B /* [CP] Check Pods Manifest.lock */,
        381D8A6F24576A6C00465D17 /* Start Packager */,
// highlight-next-line
        514201452437B4B30078DB4F /* Sources */,
        514201462437B4B30078DB4F /* Frameworks */,
        514201472437B4B30078DB4F /* Resources */,
        381D8A6E24576A4E00465D17 /* Bundle React Native code and images */,
        3689826CA944E2EF44FCBC17 /* [CP] Copy Pods Resources */,
      );
```

Search for that hex string (`514201452437B4B30078DB4F` in our example) in the
file and it should show up in a `PBXSourcesBuildPhase` section. Within the
`files` list, add the highlighted line:

```plist
    514201452437B4B30078DB4F /* Sources */ = {
      isa = PBXSourcesBuildPhase;
      buildActionMask = 2147483647;
      files = (
// highlight-next-line
        4717DC6A28CC499A00A9BE56 /* RCTDocumentPicker.m in Sources */,
        514201582437B4B40078DB4F /* main.m in Sources */,
        5142014D2437B4B30078DB4F /* AppDelegate.mm in Sources */,
      );
      runOnlyForDeploymentPostprocessing = 0;
    };
```

:::

:::note pass

D) The goal is to add file references to the "main group".  Search for
`/* Begin PBXProject section */` and there should be one Project object.
Within the project object, look for `mainGroup`:

```plist
/* Begin PBXProject section */
    83CBB9F71A601CBA00E9B192 /* Project object */ = {
      isa = PBXProject;
...
        Base,
      );
// highlight-next-line
      mainGroup = 83CBB9F61A601CBA00E9B192;
      productRefGroup = 83CBBA001A601CBA00E9B192 /* Products */;
...
/* End PBXProject section */
```

Search for that hex string (`83CBB9F61A601CBA00E9B192` in our example) in the
file and it should show up in a `PBXGroup` section.  Within `children`, add the
highlighted lines:

```plist
    83CBB9F61A601CBA00E9B192 = {
      isa = PBXGroup;
      children = (
// highlight-start
        4717DC6828CC495400A9BE56 /* RCTDocumentPicker.h */,
        4717DC6928CC499A00A9BE56 /* RCTDocumentPicker.m */,
// highlight-end
        5142014A2437B4B30078DB4F /* SheetJSmacOS-macOS */,
        13B07FAE1A68108700A75B9A /* SheetJSmacOS-iOS */,
```

:::

8) To ensure that the app still works, launch the app again:

```bash
npx react-native run-macos
```

:::note pass

If the app runs but no window is displayed, clear caches and try again:

```bash
npx react-native clean --include metro,watchman
npx react-native run-macos
```

:::

Close the running app from the dock and close the Metro terminal window.

### Application

9) Download [`App.tsx`](https://docs.sheetjs.com/reactnative/rnm/App.tsx) and
   replace the file in the project:

```bash
curl -LO https://docs.sheetjs.com/reactnative/rnm/App.tsx
```

10) Download https://docs.sheetjs.com/pres.xlsx to the Downloads folder.

#### Development

:::info pass

In some test runs, the development mode app failed with a "bundle URL" error:

> No bundle URL present.

The ["Production" section](#production) section covers release builds and tests.

:::

11) Launch the app again:

```bash
npx react-native run-macos
```

12) Click "Click here to Open File!" and use the file picker to select
`pres.xlsx` from the Downloads folder.

The app will refresh and display the data from the file.

Close the running app from the dock and close the Metro terminal window.

#### Production

13) Remove all existing `SheetJSmacOS.app` release builds. They will be stored
in the `~/Library/Developer/Xcode/DerivedData` folder.

```bash
find ~/Library/Developer/Xcode/DerivedData -name SheetJSmacOS.app | grep Release | while read x; do rm -rf "$x"; done
```

14) Make a release build:

```bash
xcodebuild -workspace macos/SheetJSmacOS.xcworkspace -scheme SheetJSmacOS-macOS -config Release
```

When the demo was last tested, the path to the generated app was displayed in
the terminal. Search for `Release/SheetJSmacOS.app` and look for `touch -c`:

```text title="Sample result when searching for 'touch -c'"
    /usr/bin/touch -c /Users/sheetjs/Library/Developer/Xcode/DerivedData/SheetJSmacOS-abcdefghijklmnopqrstuvwxyzab/Build/Products/Release/SheetJSmacOS.app
```

If there are no instances, the app path can be found in the `DerivedData` folder:

```bash
find ~/Library/Developer/Xcode/DerivedData -name SheetJSmacOS.app | grep Release
```

15) Run the release app:

```bash
open -a "$(find ~/Library/Developer/Xcode/DerivedData -name SheetJSmacOS.app | grep Release | head -n 1)"
```

16) Click "Click here to Open File!" and use the file picker to select
`pres.xlsx` from the Downloads folder.

The app will refresh and display the data from the file.

[^1]: The [official website](https://microsoft.github.io/react-native-windows/) covers both platforms, but there are separate repositories for [Windows](https://github.com/microsoft/react-native-windows) and [macOS](https://github.com/microsoft/react-native-macos)
[^2]: See ["Array of Arrays" in the API reference](/docs/api/utilities/array#array-of-arrays)
[^3]: See ["Array Output" in "Utility Functions"](/docs/api/utilities/array#array-output)
[^4]: See ["Turbo Native Modules"](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules) in the React Native documentation.
[^5]: See ["Setting up the development environment"](https://reactnative.dev/docs/environment-setup) in the React Native documentation. Select the "React Native CLI Quickstart" tab and choose the Development OS "macOS" and the Target OS "iOS".