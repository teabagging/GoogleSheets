---
title: Sheets in Photoshop and InDesign
sidebar_label: Photoshop and InDesign
description: Design documents using InDesign and Photoshop. Leverage spreadsheet data in app extensions using SheetJS. Use your Excel spreadsheets without leaving your Adobe apps.
pagination_prev: demos/cloud/index
pagination_next: demos/bigdata/index
sidebar_custom_props:
  summary: Share data between spreadsheets and InDesign tables
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Adobe Creative Suite[^1] applications, including the Photoshop graphics editor
and InDesign desktop publishing software, support JavaScript-based extensions.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS in Creative Suite extensions to import data from
spreadsheet files and export data to spreadsheets. We'll explore how to use
SheetJS scripts in extensions and programmatically interact with documents.

The InDesign demos translate between InDesign tables and workbooks.

![InDesign Table to Spreadsheet](pathname:///extendscript/indexport.png)

This demo explores three different JavaScript platforms supported in various
versions of Photoshop and InDesign:

- ["ExtendScript"](#extendscript): The ExtendScript platform uses a nonstandard
  JavaScript dialect. It is the only option in older versions of Creative Suite.

- ["Common Extensibility Platform" (CEP)](#cep): This was introduced in Creative
  Suite. App automation uses ExtendScript, but integration logic uses modern JS.

- ["Unified Extensibility Platform" (UXP)](#uxp): This platform supports modern
  JavaScript but is only supported in recent releases of Photoshop and InDesign.

:::note Tested Deployments

This demo was verified in the following deployments:

| App       | Platform     | Date       |
|:----------|:-------------|:-----------|
| Photoshop | ExtendScript | 2024-03-12 |
| InDesign  | ExtendScript | 2024-08-12 |
| InDesign  | CEP          | 2024-03-12 |
| InDesign  | UXP          | 2024-03-11 |

:::

## ExtendScript

[The "ExtendScript" build](/docs/getting-started/installation/extendscript) can
be included from a script in the same directory:

```js
#include "xlsx.extendscript.js"
```

:::caution pass

ExtendScript is not performant. Even modest files may cause Adobe apps to crash.

On the [SheetJS chat](https://sheetjs.com/chat), a user presented a workaround
that uses [a precompiled command-line tool](/docs/demos/cli/) to process data
and pass JSON data back to ExtendScript.

:::

### Reading Files

The SheetJS `readFile`[^2] method can directly accept an absolute URI:

```js
var workbook = XLSX.readFile("~/Documents/test.xlsx");
```

`File.openDialog` shows a file picker and returns a path:

```js
/* Show File Picker */
var thisFile = File.openDialog("Select a spreadsheet");
if(!thisFile) { alert("File not found!"); return; }

/* Read file from disk */
var workbook = XLSX.readFile(thisFile.absoluteURI);
```

<details open>
  <summary><b>Complete Example</b> (click to hide)</summary>

<Tabs groupId="ccapp">
  <TabItem value="photoshop" label="Photoshop">

In this example, the script will show a dialog to select a file.  After reading
the file, the workbook Author property will be extracted and the Photoshop doc
author (`activeDocument.info.author`) will be changed accordingly.

0) Download the [test workbook](pathname:///files/SheetJS.xlsb).

1) Download the following scripts and move to the scripts directory[^3]:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.extendscript.js`}><code>xlsx.extendscript.js</code></a></li>
<li><a href={`https://docs.sheetjs.com/extendscript/parse.jsx`}><code>parse.jsx</code></a></li>
</ul>

2) Restart Photoshop and open a file (or create a new one)

3) File > Scripts > parse and select the test workbook

4) An alert will confirm that the file was read and the author will be changed:

!["Changing Author" popup](pathname:///files/psparse.png)

5) Check the Author field of the document in File > File Info...

  </TabItem>
  <TabItem value="indesign" label="InDesign">

In this example, the script will show a dialog to select a file.  After reading
the file, the script will store data in the document:

- The first Text object in the "Title" TextFrame (the name of the TextFrame in
the Layers window is "Title")  will be set to the name of the first worksheet.

- The data from the first sheet will be added to the "Table Frame" TextFrame.

0) Download the [test workbook](https://docs.sheetjs.com/pres.xlsx) and
[InDesign template](pathname:///extendscript/Template.idml)

1) Download the following scripts and move to the scripts directory[^4]:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.extendscript.js`}><code>xlsx.extendscript.js</code></a></li>
<li><a href={`https://docs.sheetjs.com/extendscript/esidparse.jsx`}><code>esidparse.jsx</code></a></li>
</ul>

2) Open the template

3) Activate the Scripts panel.  Expand the "User" folder and double-click
`esidparse` in the list.

4) In the "Select a spreadsheet" file picker, select the test file `pres.xlsx`

A new table will be added and the title will be the name of the first worksheet.

  </TabItem>
</Tabs>

</details>

### Writing Files

The SheetJS `writeFile`[^5] method can directly accept an absolute URI:

```js
XLSX.writeFile(workbook, "~/Documents/test.xlsx");
```

`File.saveDialog` shows a save picker and returns a path:

```js
/* Show File Picker */
var thisFile = File.saveDialog("Select an output file", "*.xlsx;*.xls");
if(!thisFile) { alert("File not found!"); return; }

/* Write file to disk */
XLSX.writeFile(workbook, thisFile.absoluteURI);
```

<details open>
  <summary><b>Complete Example</b> (click to hide)</summary>

<Tabs groupId="ccapp">
  <TabItem value="photoshop" label="Photoshop">

In this example, the script will show a dialog to select an output file.  Once
selected, the library will create a new workbook with one worksheet.  Cell `A1`
will be "Author" and cell `B1` will be the active Photoshop document Author.
The PS author is available as `activeDocument.info.author`.

1) Download the following scripts and move to the scripts directory[^6]:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.extendscript.js`}><code>xlsx.extendscript.js</code></a></li>
<li><a href={`https://docs.sheetjs.com/extendscript/write.jsx`}><code>write.jsx</code></a></li>
</ul>

2) Restart Photoshop and open a file (or create a new one)

3) File > File Info ... and confirm there is an Author. If not, set to `SheetJS`

4) File > Scripts > write and use the popup to select the Documents folder.
   Enter `SheetJSPSTest.xlsx` and press "Save"

5) An alert will confirm that the file was created:

!["Created File" popup](pathname:///files/pswrite.png)

6) Open the generated `SheetJSPSTest.xlsx` file and compare to Photoshop author

  </TabItem>
  <TabItem value="indesign" label="InDesign">

In this example, the script will show a dialog to select an output file.  Once
selected, the library will scan all text frames for table objects.  Each table
object will be scanned and a new worksheet will be created.

0) Download the [InDesign document](pathname:///extendscript/Filled.idml)

1) Download the following scripts and move to the scripts directory[^7]:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.extendscript.js`}><code>xlsx.extendscript.js</code></a></li>
<li><a href={`https://docs.sheetjs.com/extendscript/esidwrite.jsx`}><code>esidwrite.jsx</code></a></li>
</ul>

2) Open the document.

3) Activate the Scripts panel.  Expand the "User" folder and double-click
`esidwrite` in the list.  Use the popup to select the Documents folder. Enter
`SheetJSIDTest.xlsx` and press "Save"

4) An alert will confirm that the file was created. Open `SheetJSIDTest.xlsx`
and compare to the InDesign doc.

  </TabItem>
</Tabs>

</details>

## CEP

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be added to CEP extension HTML.  It should be downloaded from the CDN and
included in the extension.

For performing file operations in CEP extensions, NodeJS is not required!  The
manifest must include the following flags to enable `cep.fs`:

```xml
<CEFCommandLine>
  <Parameter>--allow-file-access</Parameter>
  <Parameter>--allow-file-access-from-files</Parameter>
</CEFCommandLine>
```

:::caution pass

With newer versions of Creative Cloud apps, a special player debug mode must be
enabled to use unsigned extensions. The command depends on the CEP version.

InDesign and Photoshop 2024 use CEP 11. In the examples, the `11` should be
replaced with the appropriate CEP version number.

On Windows, within the registry key `HKEY_CURRENT_USER\SOFTWARE\Adobe\CSXS.11`,
a string value named `PlayerDebugMode` must be set to 1. This can be set in
PowerShell using the `reg` command:

```pwsh
reg add HKCU\SOFTWARE\Adobe\CSXS.11 /v PlayerDebugMode /t REG_SZ /d 1 /f
```

On macOS, the setting must be added to `com.adobe.CSXS.11.plist` . After writing
to the property list, `cfprefsd` must be restarted:

```bash
defaults write com.adobe.CSXS.11.plist PlayerDebugMode 1
killall cfprefsd
```

:::

### Reading Files

The second argument to `cep.fs.readFile` is an encoding. `cep.encoding.Base64`
instructs the method to return a Base64-encoded string.

The SheetJS `read` method[^8], with the option `type: "base64"`[^9], can parse
Base64 strings and return SheetJS workbook objects.

The typical flow is to read data from CEP and pass the data into the host
ExtendScript context. The following snippet parses a workbook:

```js
/* show file picker (single file, no folders) */
const fn = cep.fs.showOpenDialogEx(false, false, "Select File", "", ["xlsx"]);
/* read data as Base64 string */
const data = cep.fs.readFile(fn.data[0], cep.encoding.Base64);
/* parse with SheetJS */
const wb = XLSX.read(data.data, { type: "base64" });
```

<details open>
  <summary><b>Complete Example</b> (click to hide)</summary>

<Tabs groupId="ccapp">
  <TabItem value="indesign" label="InDesign">

0) Download [`com.sheetjs.data.zip`](pathname:///extendscript/com.sheetjs.data.zip)
and extract to a `com.sheetjs.data` subdirectory.

1) Move the entire `com.sheetjs.data` folder to the CEP extensions folder[^10].

If prompted, give administrator privileges.

2) Download and open [`Template.idml`](pathname:///extendscript/Template.idml)

3) Download the [test workbook](https://docs.sheetjs.com/pres.xlsx)

4) Show the extension (in the menu bar, select Window > Extensions > SheetJS)

5) In the extension panel, click "Import from file" and select `pres.xlsx`

After "success" popup, the first worksheet should be written to the file.

  </TabItem>
</Tabs>

</details>


### Writing Files

The SheetJS `write` method[^11], with the option `type: "base64"`[^12], can
generate spreadsheet files encoded as Base64 strings.

The third argument to `cep.fs.writeFile` is an encoding. `cep.encoding.Base64`
instructs the method to interpret the data as a Base64-encoded string.

The typical flow is to invoke a function with `CSInterface#evalScript` that
returns data from the host ExtendScript context. The callback should build the
workbook and initiate a file save. The following snippet exports to XLSX:

```js
/* generate XLSX as base64 string */
const b64 = XLSX.write(wb, {type:"base64", bookType: "xlsx"})
/* show file picker */
const fn = cep.fs.showSaveDialogEx("Save File","",["xlsx"],"SheetJSIDCEP.xlsx");
/* write file */
cep.fs.writeFile(fn.data, b64, cep.encoding.Base64);
```

<details open>
  <summary><b>Complete Example</b> (click to hide)</summary>

<Tabs groupId="ccapp">
  <TabItem value="indesign" label="InDesign">

0) Download [`com.sheetjs.data.zip`](pathname:///extendscript/com.sheetjs.data.zip)
and extract to a `com.sheetjs.data` subdirectory.

1) Move the entire `com.sheetjs.data` folder to the CEP extensions folder[^13]:

If prompted, give administrator privileges.

2) Download and open [`Filled.idml`](pathname:///extendscript/Filled.idml)

3) Show the extension (in the menu bar, select Window > Extensions > SheetJS)

4) In the extension panel, click "Export to XLSX" and "Save" in the dialog.

5) A popup will display the path to the generated file.  Open the new file.

  </TabItem>
</Tabs>

</details>

## UXP

UXP uses scripts with `.psjs` (PS) or `.idjs` (InDesign) file extensions.

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be loaded directly in UXP scripts with `require`:

```js
/* assuming xlsx.full.min.js is in the same folder as the idjs / psjs script */
const XLSX = require("./xlsx.full.min.js");
```

Filesystem access is provided by the UXP storage module:

```js
const UXP = require("uxp");
const storage = UXP.storage, ufs = storage.localFileSystem;
```

### Reading Files

The `getFileForOpening` method resolves to a `File` object. Reading the file
with the `binary` format returns an `ArrayBuffer` object that can be parsed
with the SheetJS `read` method[^14]:

```js
/* show file picker (single file, no folders) */
const file = await ufs.getFileForOpening({ types: ["xlsx", "xls", "xlsb"] });
/* read data into an ArrayBuffer */
const ab = await file.read({ format: storage.formats.binary });
/* parse with SheetJS */
const wb = XLSX.read(ab);
```

<details open>
  <summary><b>Complete Example</b> (click to hide)</summary>

<Tabs groupId="ccapp">
  <TabItem value="indesign" label="InDesign">

0) Open the "Scripts Panel" folder[^15].

1) Download the following scripts:

<ul>
<li><a href="/extendscript/parse.idjs"><code>parse.idjs</code></a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}><code>xlsx.full.min.js</code></a></li>
</ul>

Move them to the Scripts Panel folder.

2) Download and open [`Template.idml`](pathname:///extendscript/Template.idml)

3) Download the [test workbook](https://docs.sheetjs.com/pres.xlsx)

4) In the Scripts Panel, double-click "parse". Select the downloaded `pres.xlsx`
in the file picker.

:::caution pass

If the InDesign version does not support UXP, a tooltip shows a message:

> This file is not executable by any supported script language.

[ExtendScript](#extendscript) should be used when UXP is not supported.

:::

  </TabItem>
</Tabs>

</details>

### Writing Files

The SheetJS `write` method[^16], with the option `type: "buffer"`[^17], returns
file data stored in a `Uint8Array`.

The `getFileForSaving` method resolves to a `File` object. The `write` method
accepts an options argument. If the `data: storage.formats.binary` option is
set, the method will correctly interpret `Uint8Array` data.

The following snippet exports to XLSX:

```js
/* generate XLSX with type: "buffer" */
const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
/* show file picker */
const file = await ufs.getFileForSaving("SheetJSUXP.xlsx");
/* write data */
await file.write(buf, { data: storage.formats.binary });
```

<details open>
  <summary><b>Complete Example</b> (click to hide)</summary>

<Tabs groupId="ccapp">
  <TabItem value="indesign" label="InDesign">

0) Open the "Scripts Panel" folder[^18].

1) Download the following scripts:

<ul>
<li><a href="/extendscript/write.idjs"><code>write.idjs</code></a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}><code>xlsx.full.min.js</code></a></li>
</ul>

Move them to the Scripts Panel folder.

2) Download and open [`Filled.idml`](pathname:///extendscript/Filled.idml)

3) In the Scripts Panel, double-click "Write".  Click "Save" in the dialog.

4) When the process finishes, open `SheetJSUXP.xlsx` and verify the contents.

  </TabItem>
</Tabs>

</details>

## Miscellany

### Scripts Panel

The scripts panel folder is used for ExtendScript and UXP scripts. The location
can be revealed from the relevant applications. For InDesign:

1) Activate Scripts panel (Windows > Utilities > Scripts)

2) In the new panel window, select the User folder

3) Click `☰` and select "Reveal in Explorer" or "Reveal in Finder".

A new Explorer (Windows) or Finder (macOS) window will open the folder.

:::info pass

Some versions of InDesign will open the parent "Scripts" folder. If there is a
"Scripts Panel" subdirectory, that folder should be used.

:::

### CEP Extensions

CEP extension scripts are typically stored in a system-wide folder:

| OS        | Folder                                                      |
|:----------|:------------------------------------------------------------|
| Windows   | `C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\` |
| Macintosh | `/Library/Application\ Support/Adobe/CEP/extensions`        |

Administrator privileges are usually required for writing to the folder.

[^1]: Historically, Adobe applications were separate entities. Eventually they were bundled in a package called "Creative Suite". It was rebranded to "Creative Cloud" later. As ExtendScript was introduced during the Creative Suite era, this page will use the phrase "Creative Suite".
[^2]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^3]: See ["Scripts Panel"](#scripts-panel)
[^4]: See ["Scripts Panel"](#scripts-panel)
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^6]: See ["Scripts Panel"](#scripts-panel)
[^7]: See ["Scripts Panel"](#scripts-panel)
[^8]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^9]: See [the "base64" type in "Reading Files"](/docs/api/parse-options#input-type)
[^10]: See ["CEP Extensions"](#cep-extensions)
[^11]: See [`write` in "Writing Files"](/docs/api/write-options)
[^12]: See ["Supported Output Formats" type in "Writing Files"](/docs/api/write-options#supported-output-formats)
[^13]: See ["CEP Extensions"](#cep-extensions)
[^14]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^15]: See ["Scripts Panel"](#scripts-panel)
[^16]: See [`write` in "Writing Files"](/docs/api/write-options)
[^17]: See ["Supported Output Formats" type in "Writing Files"](/docs/api/write-options#supported-output-formats)
[^18]: See ["Scripts Panel"](#scripts-panel)