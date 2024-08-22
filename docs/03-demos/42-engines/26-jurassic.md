---
title: Sheets in .NET with Jurassic
sidebar_label: C# + Jurassic
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Jurassic[^1] is a JavaScript compiler for .NET, In contrast to other engines,
Jurassic generates .NET bytecode.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Jurassic and SheetJS to read and write spreadsheets. We'll
explore how to load SheetJS in the Jurassic engine, exchange binary data with a
C# program, and process spreadsheets and structured data.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading arbitrary workbooks and writing data to ODS
(OpenDocument Spreadsheet) workbooks.

:::danger Telemetry

**The `dotnet` command embeds telemetry.**

The `DOTNET_CLI_TELEMETRY_OPTOUT` environment variable should be set to `1`.

["Platform Configuration"](#platform-configuration) includes instructions for
setting the environment variable on supported platforms.

:::

## Integration Details

The [SheetJS "mini" script](/docs/getting-started/installation/standalone) can
be parsed and evaluated in a Jurassic engine instance.

:::warning pass

Jurassic throws errors when processing the "full" script (`xlsx.full.min.js`):

```
Unhandled exception. Jurassic.JavaScriptException: Error: Maximum number of named properties reached.
```

**The `xlsx.mini.min.js` script must be used!**

The mini build has a number of limitations, as noted in the installation guide.

:::

It is recommended to pass Base64 strings between C# code and the script engine.

### Initialize Jurassic

A `Jurassic.ScriptEngine` object can be created in one line:

```csharp
var engine = new Jurassic.ScriptEngine();
```

Jurassic does not expose the NodeJS `global`. It can be synthesized:

:::note pass

The goal is to run the following JavaScript code:

```js
var global = (function(){ return this; }).call(null);
```

:::

```csharp
engine.Evaluate("var global = (function(){ return this; }).call(null);");
```

### Load SheetJS Scripts

Jurassic engine objects support the `ExecuteFile` method for evaluating scripts:

```csharp
/* read and evaluate the shim script */
engine.ExecuteFile("shim.min.js");
/* read and evaluate the main library */
engine.ExecuteFile("xlsx.mini.min.js");
```

To confirm the library is loaded, `XLSX.version` can be inspected:

```csharp
Console.WriteLine("SheetJS version {0}", engine.Evaluate("XLSX.version"));
```

### Reading Files

In C#, `System.IO.File.ReadAllBytes` reads file data into a `byte[]` byte array:

```csharp
string filename = "pres.xlsx";
byte[] buf = File.ReadAllBytes(filename);
```

The bytes cannot be directly passed to Jurassic. Base64 strings are supported.
An encoded Base64 string can be created with `System.Convert.ToBase64String`:

```csharp
string b64 = System.Convert.ToBase64String(buf);
```

`Jurassic.ScriptEngine#SetGlobalValue` will assign the C# String to a global:

```csharp
engine.SetGlobalValue("buf", b64);
```

The `buf` variable can be parsed from JS with the SheetJS `read` method[^2]:

:::note pass

The following script will be evaluated:

```js
var wb = XLSX.read(buf, {type:'base64'});
```

:::

```csharp
engine.Evaluate("var wb = XLSX.read(buf, {type:'base64'});");
```

`wb` is a SheetJS workbook object. The ["SheetJS Data Model"](/docs/csf) section
describes the object structure and the ["API Reference"](/docs/api) section
describes various helper functions.

### Writing Files

The SheetJS `write` method[^3] can write workbooks. The option `type: "base64"`
instructs the library to generate Base64 strings. The `bookType` option[^4]
controls the output file format.

:::note pass

The following expression will be evaluated:

```js
XLSX.write(wb, {bookType: 'ods', type: 'base64'})
```

The result will be passed back to C# code.

:::

```csharp
string ods = engine.Evaluate("XLSX.write(wb, {bookType: 'ods', type: 'base64'})") as string;
```

`ods` is a Base64 string. `System.Convert.FromBase64String` can decode the
string into a `byte[]` which can be written to file:

```csharp
File.WriteAllBytes("SheetJSJurassic.ods", System.Convert.FromBase64String(ods));
```

## Integration Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Jurassic | Date       |
|:-------------|:---------|:-----------|
| `darwin-x64` | `3.2.7`  | 2024-06-15 |
| `darwin-arm` | `3.2.7`  | 2024-06-15 |
| `win10-x64`  | `3.2.7`  | 2024-06-21 |
| `win11-arm`  | `3.2.7`  | 2024-07-14 |
| `linux-x64`  | `3.2.7`  | 2024-06-20 |
| `linux-arm`  | `3.2.7`  | 2024-06-20 |

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

3) Create a new folder `SheetJSJurassic` and a new `dotnet` project:

```bash
mkdir SheetJSJurassic
cd SheetJSJurassic
dotnet new console
dotnet run
```

4) Add Jurassic using the NuGet tool:

```bash
dotnet add package Jurassic --version 3.2.7
```

To verify Jurassic is installed, replace `Program.cs` with the following:

```csharp title="Program.cs"
var engine = new Jurassic.ScriptEngine();
Console.WriteLine("Hello {0}", engine.Evaluate("'Sheet' + 'JS'"));
```

After saving, run the program:

```bash
dotnet run
```

The terminal should display `Hello SheetJS`

### Add SheetJS

5) Download the SheetJS mini script, shim script and test file. Move all three
files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.mini.min.js`}>xlsx.mini.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.mini.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

6) Replace `Program.cs` with the following:

```csharp title="Program.cs"
var engine = new Jurassic.ScriptEngine();
engine.Evaluate("var global = (function(){ return this; }).call(null);");
engine.Evaluate(File.ReadAllText("shim.min.js"));
engine.Evaluate(File.ReadAllText("xlsx.mini.min.js"));
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
var engine = new Jurassic.ScriptEngine();

/* Initialize Jurassic */
engine.Evaluate("var global = (function(){ return this; }).call(null);");

/* Load SheetJS Scripts */
engine.ExecuteFile("shim.min.js");
engine.ExecuteFile("xlsx.mini.min.js");
Console.WriteLine("SheetJS version {0}", engine.Evaluate("XLSX.version"));

/* Read and Parse File */
byte[] filedata = File.ReadAllBytes(args[0]);
string b64 = System.Convert.ToBase64String(filedata);
engine.SetGlobalValue("buf", b64);
engine.Evaluate("var wb = XLSX.read(buf, {type:'base64'});");

/* Print CSV of first worksheet*/
engine.Evaluate("var ws = wb.Sheets[wb.SheetNames[0]];");
object csv = engine.Evaluate("XLSX.utils.sheet_to_csv(ws)");
Console.Write(csv);

/* Generate XLSB file and save to SheetJSJurassic.ods */
string ods = engine.Evaluate("XLSX.write(wb, {bookType: 'ods', type: 'base64'})") as string;
File.WriteAllBytes("SheetJSJurassic.ods", System.Convert.FromBase64String(ods));
```

After saving, run the program and pass the test file name as an argument:

```bash
dotnet run pres.xlsx
```

If successful, the program will print the contents of the first sheet as CSV
rows. It will also create `SheetJSJurassic.ods`, an OpenDocument spreadsheet
that can be opened in Excel or another spreadsheet editor.

:::info pass

Running `dotnet run` without the filename argument will show an error:

```
Unhandled exception. System.IndexOutOfRangeException: Index was outside the bounds of the array.
   at Program.<Main>$(String[] args) in C:\Users\Me\SheetJSJurassic\Program.cs:line 15
```

The command must be run with an argument specifying the name of the workbook:

```bash
dotnet run pres.xlsx
```

:::

[^1]: The project does not have a website. The library is hosted on [NuGet](https://www.nuget.org/packages/Jurassic/).
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`write` in "Writing Files"](/docs/api/write-options)
[^4]: See ["Supported Output Formats" in "Writing Files"](/docs/api/write-options#supported-output-formats) for details on `bookType`
