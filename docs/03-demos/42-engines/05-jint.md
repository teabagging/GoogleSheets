---
title: Sheets in .NET with Jint
sidebar_label: C# + Jint
description: Process structured data in C#. Seamlessly integrate spreadsheets into your program by pairing Jint and SheetJS. Handle the most complex Excel files without breaking a sweat.
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Jint[^1] is a JavaScript interpreter for .NET Standard and .NET Core. It has
built-in support for binary data with .NET `byte[]` and ES6 `Uint8Array`.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Jint and SheetJS to read and write spreadsheets. We'll explore
how to load SheetJS in the Jint engine, exchange binary data with a C# program,
and process spreadsheets and structured data.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading arbitrary workbooks and writing data to XLSB
(Excel 2007+ Binary Format) workbooks.

:::danger Telemetry

**The `dotnet` command embeds telemetry.**

The `DOTNET_CLI_TELEMETRY_OPTOUT` environment variable should be set to `1`.

["Platform Configuration"](#platform-configuration) includes instructions for
setting the environment variable on supported platforms.

:::

## Integration Details

:::note pass

Most of the integration functions are not documented. This explanation is based
on version `3.1.0`.

:::

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated in a Jint engine instance.

### Initialize Jint

A `Jint.Engine` object can be created in one line:

```csharp
var engine = new Jint.Engine();
```

Jint does not expose the NodeJS `global` but does provide `globalThis`. Using
`Jint.Engine#Evaluate`, a `global` global variable can be created:

>The JS code is
```js
global = globalThis;
```

```csharp
engine.Evaluate("global = globalThis");
```

### Load SheetJS Scripts

The main library can be loaded by reading the scripts from the file system with
`System.IO.File.ReadAllText` and evaluating in the Jint engine instance:

```csharp
/* read and evaluate the shim script */
string src = System.IO.File.ReadAllText("shim.min.js");
engine.Evaluate(src);
/* read and evaluate the main library */
engine.Evaluate(System.IO.File.ReadAllText("xlsx.full.min.js"));
```

To confirm the library is loaded, `XLSX.version` can be inspected:

```csharp
Console.WriteLine("SheetJS version {0}", engine.Evaluate("XLSX.version"));
```

:::info pass

The Jint `Evaluate` method returns a generic `Jint.Native.JsValue` object.

When the JS expression returns a string, the `JsValue` object is an instance of
`Jint.Native.JsString`. C# `ToString` will return the underlying `string` value.

:::

### Reading Files

In C#, `System.IO.File.ReadAllBytes` reads file data into a `byte[]` byte array:

```csharp
string filename = "pres.xlsx";
byte[] buf = File.ReadAllBytes(filename);
```

Jint natively supports `Uint8Array` construction from the byte array:

```csharp
Jint.Native.JsValue u8 = engine.Intrinsics.Uint8Array.Construct(buf);
```

`Jint.Engine#SetValue` will assign the `Uint8Array` to a scope variable in JS:

```csharp
engine.SetValue("buf", u8);
```

The `buf` variable can be parsed from JS with the SheetJS `read` method[^2]:

>The JS code is
```js
var wb = XLSX.read(buf);
```

```csharp
engine.Evaluate("var wb = XLSX.read(buf);");
```

`wb` is a SheetJS workbook object. The ["SheetJS Data Model"](/docs/csf) section
describes the object structure and the ["API Reference"](/docs/api) section
describes various helper functions.

### Writing Files

The SheetJS `write` method[^3] can write workbooks. The option `type: "buffer"`
instructs the library to generate `Uint8Array` objects.

> The JS code for exporting to the XLSB format is:
```js
var u8 = XLSX.write(wb, {bookType: 'xlsb', type: 'buffer'});
```
The file format can be changed with the `bookType` option[^4]

```csharp
Jint.Native.JsValue xlsb = engine.Evaluate("XLSX.write(wb, {bookType: 'xlsb', type: 'buffer'})");
```

`xlsb` represents a `Uint8Array`. `xlsb.AsUint8Array()` returns the bytes as a
`byte[]` array which can be exported with `System.IO.File.WriteAllBytes`:

```csharp
byte[] outfile = xlsb.AsUint8Array();
System.IO.File.WriteAllBytes("SheetJSJint.xlsb", outfile);
```

## Integration Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Jint    | Date       |
|:-------------|:--------|:-----------|
| `darwin-x64` | `3.0.1` | 2024-03-15 |
| `darwin-arm` | `3.1.2` | 2024-05-25 |
| `win10-x64`  | `3.1.0` | 2024-04-17 |
| `win11-arm`  | `3.1.2` | 2024-05-25 |
| `linux-x64`  | `3.1.0` | 2024-04-25 |
| `linux-arm`  | `3.1.2` | 2024-05-25 |

:::

### Platform Configuration

0) Set the `DOTNET_CLI_TELEMETRY_OPTOUT` environment variable to `1`.

<details open>
  <summary><b>How to disable telemetry</b> (click to hide)</summary>

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

Add the following line to `.profile`, `.bashrc` and `.zshrc`:

```bash title="(add to .profile , .bashrc , and .zshrc)"
export DOTNET_CLI_TELEMETRY_OPTOUT=1
```

Close and restart the Terminal to load the changes.

  </TabItem>
  <TabItem value="win" label="Windows">

Type `env` in the search bar and select "Edit the system environment variables".

In the new window, click the "Environment Variables..." button.

In the new window, look for the "System variables" section and click "New..."

Set the "Variable name" to `DOTNET_CLI_TELEMETRY_OPTOUT` and the value to `1`.

Click "OK" in each window (3 windows) and restart your computer.

  </TabItem>
</Tabs>

</details>

1) Install .NET

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

For macOS x64 and ARM64, install the `dotnet-sdk` Cask with Homebrew:

```bash
brew install --cask dotnet-sdk
```

For Steam Deck Holo and other Arch Linux x64 distributions, the `dotnet-sdk` and
`dotnet-runtime` packages should be installed using `pacman`:

```bash
sudo pacman -Syu dotnet-sdk dotnet-runtime
```

https://dotnet.microsoft.com/en-us/download/dotnet/6.0 is the official source
for Windows and ARM64 Linux versions.

</details>

2) Open a new Terminal window in macOS or PowerShell window in Windows.

### Base Project

3) Create a new folder `SheetJSJint` and a new project using the `dotnet` tool:

```bash
mkdir SheetJSJint
cd SheetJSJint
dotnet new console
dotnet run
```

4) Add Jint using the NuGet tool:

```bash
dotnet nuget add source https://www.myget.org/F/jint/api/v3/index.json
dotnet add package Jint --version 3.1.2
```

To verify Jint is installed, replace `Program.cs` with the following:

```csharp title="Program.cs"
var engine = new Jint.Engine();
Console.WriteLine("Hello {0}", engine.Evaluate("'Sheet' + 'JS'"));
```

After saving, run the program:

```bash
dotnet run
```

The terminal should display `Hello SheetJS`

### Add SheetJS

5) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

6) Replace `Program.cs` with the following:

```csharp title="Program.cs"
var engine = new Jint.Engine();
engine.Evaluate("global = globalThis;");
engine.Evaluate(File.ReadAllText("shim.min.js"));
engine.Evaluate(File.ReadAllText("xlsx.full.min.js"));
Console.WriteLine("SheetJS version {0}", engine.Evaluate("XLSX.version"));
```

After saving, run the program:

```bash
dotnet run
```

<p>The terminal should display <code>SheetJS version {current}</code></p>

### Read and Write Files

7) Replace `Program.cs` with the following:

```csharp title="Program.cs"
using Jint;

/* Initialize Jint */
var engine = new Jint.Engine();
engine.Evaluate("global = globalThis;");

/* Load SheetJS Scripts */
engine.Evaluate(File.ReadAllText("shim.min.js"));
engine.Evaluate(File.ReadAllText("xlsx.full.min.js"));
Console.WriteLine("SheetJS version {0}", engine.Evaluate("XLSX.version"));

/* Read and Parse File */
byte[] filedata = File.ReadAllBytes(args[0]);
Jint.Native.JsValue u8 = engine.Intrinsics.Uint8Array.Construct(filedata);
engine.SetValue("buf", u8);
engine.Evaluate("var wb = XLSX.read(buf);");

/* Print CSV of first worksheet*/
engine.Evaluate("var ws = wb.Sheets[wb.SheetNames[0]];");
Jint.Native.JsValue csv = engine.Evaluate("XLSX.utils.sheet_to_csv(ws)");
Console.Write(csv);

/* Generate XLSB file and save to SheetJSJint.xlsb */
Jint.Native.JsValue xlsb = engine.Evaluate("XLSX.write(wb, {bookType: 'xlsb', type: 'buffer'})");
File.WriteAllBytes("SheetJSJint.xlsb", xlsb.AsUint8Array());
```

After saving, run the program and pass the test file name as an argument:

```bash
dotnet run pres.xlsx
```

If successful, the program will print the contents of the first sheet as CSV
rows. It will also create `SheetJSJint.xlsb` which can be opened in Excel or
another spreadsheet editor.

:::info pass

Running `dotnet run` without the filename argument will show an error:

```
Unhandled exception. System.IndexOutOfRangeException: Index was outside the bounds of the array.
   at Program.<Main>$(String[] args) in C:\Users\Me\SheetJSJint\Program.cs:line 13
```

The command must be run with an argument specifying the name of the workbook:

```bash
dotnet run pres.xlsx
```

:::

:::caution pass

If the `using Jint;` directive is omitted, the build will fail:

```
'JsValue' does not contain a definition for 'AsUint8Array' and no accessible extension method 'AsUint8Array' accepting a first argument of type 'JsValue' could be found
```

:::

### Standalone Application

8) Find the runtime identifier (RID) for your platform[^5]. The RID values for
tested platforms are listed below:

| Platform         | RID           |
|:-----------------|:--------------|
| Intel Mac        | `osx-x64`     |
| ARM64 Mac        | `osx-arm64`   |
| Windows 10 (x64) | `win10-x64`   |
| Windows 11 (ARM) | `win-arm64`   |
| Linux (x64)      | `linux-x64`   |
| Linux (ARM)      | `linux-arm64` |

9) Build the standalone application.

<details open>
  <summary><b>Tested platforms</b> (click to hide)</summary>

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="Intel Mac">

For Intel Mac, the RID is `osx-x64` and the command is

```bash
dotnet publish -c Release -r osx-x64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

  </TabItem>
  <TabItem value="darwin-arm" label="ARM64 Mac">

For Apple Silicon, the RID is `osx-arm64` and the command is

```bash
dotnet publish -c Release -r osx-arm64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

  </TabItem>
  <TabItem value="linux-x64" label="Linux x64">

For x64 Linux, the RID is `linux-x64` and the command is

```bash
dotnet publish -c Release -r linux-x64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

  </TabItem>
  <TabItem value="linux-arm" label="Linux ARM">

For x64 Linux, the RID is `linux-arm64` and the command is

```bash
dotnet publish -c Release -r linux-arm64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

  </TabItem>
  <TabItem value="win10-x64" label="Windows x64">

For Windows 10 x64, the RID is `win10-x64` and the command is:

```powershell
dotnet publish -c Release -r win10-x64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

  </TabItem>
  <TabItem value="win11-arm" label="Windows ARM">

For Windows 11 ARM64, the RID is `win-arm64` and the command is:

```powershell
dotnet publish -c Release -r win-arm64 --self-contained true -p:PublishSingleFile=true -p:PublishTrimmed=true
```

  </TabItem>
</Tabs>

</details>

10) Copy the generated executable to the project directory.

The binary name will be `SheetJSJint` or `SheetJSJint.exe` depending on OS.

The last line of the output from Step 9 will print the output folder.

<details open>
  <summary><b>Tested platforms</b> (click to hide)</summary>

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="Intel Mac">

For Intel Mac, the RID is `osx-x64` and the command is:

```bash
cp bin/Release/net*/osx-x64/publish/SheetJSJint .
```

  </TabItem>
  <TabItem value="darwin-arm" label="ARM64 Mac">

For Apple Silicon, the RID is `osx-arm64` and the command is:

```bash
cp bin/Release/net6.0/osx-arm64/publish/SheetJSJint .
```

  </TabItem>
  <TabItem value="linux-x64" label="Linux x64">

For x64 Linux, the RID is `linux-x64` and the command is

```bash
cp bin/Release/net*/linux-x64/publish/SheetJSJint .
```

  </TabItem>
  <TabItem value="linux-arm" label="Linux ARM">

For x64 Linux, the RID is `linux-arm64` and the command is

```bash
cp bin/Release/net6.0/linux-arm64/publish/SheetJSJint .
```

  </TabItem>
  <TabItem value="win10-x64" label="Windows x64">

For Windows 10 x64, the RID is `win10-x64` and the command is:

```powershell
copy .\bin\Release\net6.0\win10-x64\publish\SheetJSJint.exe .
```

:::caution pass

In some test runs, the `copy` command failed with a clear message:

```
The system cannot find the path specified.
```

The correct command was

```powershell
copy .\bin\x64\Release\net6.0\win10-x64\publish\SheetJSJint.exe .
```

:::

  </TabItem>
  <TabItem value="win11-arm" label="Windows ARM">

For Windows 11 ARM64, the RID is `win-arm64` and the command is:

```powershell
copy .\bin\Release\net6.0\win-arm64\publish\SheetJSJint.exe .
```

  </TabItem>
</Tabs>

</details>

11) Run the generated command.

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
./SheetJSJint pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```powershell
.\SheetJSJint pres.xlsx
```

  </TabItem>
</Tabs>

[^1]: The Jint project recommends the ["MyGet" service](https://www.myget.org/feed/jint/package/nuget/Jint). According to the developers, the ["NuGet" package](https://www.nuget.org/packages/jint) is "occasionally published".
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`write` in "Writing Files"](/docs/api/write-options)
[^4]: See ["Supported Output Formats" in "Writing Files"](/docs/api/write-options#supported-output-formats) for details on `bookType`
[^5]: See [".NET RID Catalog"](https://learn.microsoft.com/en-us/dotnet/core/rid-catalog) in the .NET documentation