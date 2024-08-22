---
title: Sharing Sheets with Hermes
sidebar_label: C++ + Hermes
description: Process structured data in C++ programs. Seamlessly integrate spreadsheets into your program by pairing Hermes and SheetJS. Handle the most complex files without breaking a sweat.
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[Hermes](https://hermesengine.dev/) is an embeddable JS engine written in C++.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Hermes and SheetJS to pull data from a spreadsheet and print CSV
rows. We'll explore how to load SheetJS in a Hermes context and process
spreadsheets from a C++ program.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading data from files.

## Integration Details

:::info pass

Many Hermes functions are not documented. The explanation was verified against
commit `15b323d`.

:::

:::danger pass

The main target for Hermes is React Native.  At the time of writing, there was
no official documentation for embedding the Hermes engine in C++ programs.

:::

### Initialize Hermes

A Hermes engine instance is created with `facebook::hermes::makeHermesRuntime`:

```cpp
std::unique_ptr<facebook::jsi::Runtime> rt(facebook::hermes::makeHermesRuntime());
```

_Essential Objects_

Hermes does not expose a `console` or `global` variable, but they can be
synthesized from JS code in the runtime:

- `global` can be obtained from a reference to `this` in an unbound function:

```js
/* create global object */
var global = (function(){ return this; }).call(null);
```

- `console.log` can be constructed from the builtin `print` function:

```js
/* create a fake `console` from the hermes `print` builtin */
var console = { log: function(x) { print(x); } };
```

The code can be stored in a C string and evaluated using `prepareJavascript` to
prepare code and `evaluatePreparedJavascript` to evaluate:

```cpp
const char *init_code =
  /* create global object */
  "var global = (function(){ return this; }).call(null);"
  /* create a fake `console` from the hermes `print` builtin */
  "var console = { log: function(x) { print(x); } };"
  ;
auto src = std::make_shared<facebook::jsi::StringBuffer>(init_code);
auto js = rt->prepareJavaScript(src, std::string("<eval>"));
rt->evaluatePreparedJavaScript(js);
```

:::info Exception handling

Standard C++ exception handling patterns are used in Hermes integration code.
The base class for Hermes exceptions is `facebook::jsi::JSIException`:

```cpp
try {
  const char *init_code = "...";
  auto src = std::make_shared<facebook::jsi::StringBuffer>(init_code);
  auto js = rt->prepareJavaScript(src, std::string("<eval>"));
  rt->evaluatePreparedJavaScript(js);
} catch (const facebook::jsi::JSIException &e) {
  std::cerr << "JavaScript exception: " << e.what() << std::endl;
  return 1;
}
```

:::

### Load SheetJS Scripts

[SheetJS Standalone scripts](/docs/getting-started/installation/standalone) can
be parsed and evaluated in a Hermes context.

The main library can be loaded by reading the script from the file system and
evaluating in the Hermes context.

:::note pass

There are nonstandard tricks to embed the entire script in the binary. There are
language proposals such as `#embed` (mirroring the same feature in C23).

For simplicity, the examples read the script file from the filesystem.

:::

_Reading scripts from the filesystem_

For the purposes of this demo, the standard C `<stdio.h>` methods are used:

```cpp
static char *read_file(const char *filename, size_t *sz) {
  FILE *f = fopen(filename, "rb");
  if(!f) return NULL;
  long fsize; { fseek(f, 0, SEEK_END); fsize = ftell(f); fseek(f, 0, SEEK_SET); }
  char *buf = (char *)malloc(fsize * sizeof(char));
  *sz = fread((void *) buf, 1, fsize, f);
  fclose(f);
  return buf;
}

// ...
  /* read SheetJS library from filesystem */
  size_t sz; char *xlsx_full_min_js = read_file("xlsx.full.min.js", &sz);
```

:::caution pass

For Windows applications, the string must be null-terminated:

```cpp
/* Hermes-Windows requires the null terminator */
static char *read_file_null(const char *filename, size_t *sz) {
  FILE *f = fopen(filename, "rb");
  if(!f) return NULL;
  long fsize; { fseek(f, 0, SEEK_END); fsize = ftell(f) + 1; fseek(f, 0, SEEK_SET); }
  char *buf = (char *)malloc(fsize * sizeof(char));
  *sz = fread((void *) buf, 1, fsize, f);
  buf[fsize - 1] = 0;
  fclose(f);
  return buf;
}

// ...
  /* read SheetJS library from filesystem */
  size_t sz; char *xlsx_full_min_js = read_file_null("xlsx.full.min.js", &sz);
```

:::

_Hermes Wrapper_

Hermes does not provide a friendly way to prepare JavaScript code stored in a
standard heap-allocated C string. Fortunately a wrapper can be created:

```cpp
/* Unfortunately the library provides no C-friendly Buffer classes */
class CBuffer : public facebook::jsi::Buffer {
  public:
    CBuffer(const uint8_t *data, size_t size) : buf(data), sz(size) {}
    size_t size() const override { return sz; }
    const uint8_t *data() const override { return buf; }

  private:
    const uint8_t *buf;
    size_t sz;
};

// ...
  /* load SheetJS library */
  auto src = std::make_shared<CBuffer>(CBuffer((uint8_t *)xlsx_full_min_js, sz));
```

_Evaluating SheetJS Library Code_

The code wrapper can be "prepared" with `prepareJavascript` and "evaluated" with
`evaluatePreparedJavascript`.

The second argument to `preparedJavascript` is a C++ `std::string` that holds
the source URL. Typically a name like `xlsx.full.min.js` helps distinguish
SheetJS library exceptions from other parts of the application.

```cpp
  auto js = rt->prepareJavaScript(src, std::string("xlsx.full.min.js"));
  rt->evaluatePreparedJavaScript(js);
```

_Testing_

If the library is loaded, `XLSX.version` will be a string. This string can be
pulled into the main C++ program.

The `evaluatePreparedJavascript` method returns a `facebook::jsi::Value` object
that represents the result:

```cpp
/* evaluate XLSX.version and capture the result */
auto src = std::make_shared<facebook::jsi::StringBuffer>("XLSX.version");
auto js = rt->prepareJavaScript(src, std::string("<eval>"));
facebook::jsi::Value jsver = rt->evaluatePreparedJavaScript(js);
```

The `getString` method extracts the string value and returns an internal string
object (`facebook::jsi::String`). Given that string object, the `utf8` method
returns a proper C++ `std::string` that can be printed:

```cpp
/* pull the version string into C++ code and print */
facebook::jsi::String jsstr = jsver.getString(*rt);
std::string cppver = jsstr.utf8(*rt);
std::cout << "SheetJS version " << cppver << std::endl;
```

### Reading Files

Typically C++ code will read files and Hermes will project the data in the JS
engine as an `ArrayBuffer`. SheetJS libraries can parse `ArrayBuffer` data.

Standard SheetJS operations can pick the first worksheet and generate CSV string
data from the worksheet. Hermes provides methods to convert the JS strings back
to `std::string` objects for further processing in C++.

:::note pass

It is strongly recommended to create a stub function to perform the entire
workflow in JS code and pass the final result back to C++.

:::

_Hermes Wrapper_

Hermes supports `ArrayBuffer` but has no simple helper to read raw memory.
Libraries are expected to implement `MutableBuffer`:

```cpp
/* ArrayBuffer constructor expects MutableBuffer */
class CMutableBuffer : public facebook::jsi::MutableBuffer {
  public:
    CMutableBuffer(uint8_t *data, size_t size) : buf(data), sz(size) {}
    size_t size() const override { return sz; }
    uint8_t *data() override { return buf; }

  private:
    uint8_t *buf;
    size_t sz;
};
```

A `facebook::jsi::ArrayBuffer` object can be created using the wrapper:

```cpp
/* load payload as ArrayBuffer */
size_t sz; char *data = read_file("pres.xlsx", &sz);
auto payload = std::make_shared<CMutableBuffer>(CMutableBuffer((uint8_t *)data, sz));
auto ab = facebook::jsi::ArrayBuffer(*rt, payload);
```

_SheetJS Operations_

In this example, the goal is to pull the first worksheet and generate CSV rows.

`XLSX.read`[^1] parses the `ArrayBuffer` and returns a SheetJS workbook object:

```js
var wb = XLSX.read(buf);
```

The `SheetNames` property[^2] is an array of the sheet names in the workbook.
The first sheet name can be obtained with the following JS snippet:

```js
var first_sheet_name = wb.SheetNames[0];
```

The `Sheets` property[^3] is an object whose keys are sheet names and whose
corresponding values are worksheet objects.

```js
var first_sheet = wb.Sheets[first_sheet_name];
```

The `sheet_to_csv` utility function[^4] generates a CSV string from the sheet:

```js
var csv = XLSX.utils.sheet_to_csv(first_sheet);
```

_C++ integration code_

:::note pass

The stub function will be passed an `ArrayBuffer` object:

```js
function(buf) {
  /* `buf` will be an ArrayBuffer */
  var wb = XLSX.read(buf);
  return XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
}
```

:::

The result after evaluating the stub is a `facebook::jsi::Value` object:

```cpp
/* define stub function to read and convert first sheet to CSV */
auto src = std::make_shared<facebook::jsi::StringBuffer>(
  "(function(buf) {"
    "var wb = XLSX.read(buf);"
    "return XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);"
  "})"
);
auto js = rt->prepareJavaScript(src, std::string("<eval>"));
facebook::jsi::Value funcval = rt->evaluatePreparedJavaScript(js);
```

To call this function, the opaque `Value` must be converted to a `Function`:

```cpp
facebook::jsi::Function func = func.asObject(*rt).asFunction(*rt);
```

The `Function` exposes a `call` method to perform the function invocation. The
stub accepts an `ArrayBuffer` argument:

```cpp
/* call stub function and capture result */
facebook::jsi::Value csv = func.call(*rt, ab);
```

In the same way the library version string was pulled into C++ code, the CSV
data can be captured using `getString` and `utf8` methods:

```cpp
/* interpret as utf8 */
std::string str = csv.getString(*rt).utf8(*rt);
std::cout << str << std::endl;
```

## Complete Example

The "Integration Example" covers a traditional integration in a C++ application,
while the "CLI Test" demonstrates other concepts using the `hermes` CLI tool.

### Integration Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Git Commit | Date       |
|:-------------|:-----------|:-----------|
| `darwin-x64` | `d070c74`  | 2024-04-25 |
| `darwin-arm` | `d070c74`  | 2024-05-23 |
| `linux-x64`  | `d217af8`  | 2024-03-21 |
| `linux-arm`  | `d070c74`  | 2024-05-25 |

The main Hermes source tree does not have Windows support. The `hermes-windows`
fork, which powers React Native for Windows, does have built-in support[^5]

| Architecture | Git Commit | Date       |
|:-------------|:-----------|:-----------|
| `win10-x64`  | `240573e`  | 2024-03-24 |
| `win11-arm`  | `240573e`  | 2024-06-20 |

The ["Windows Example"](#windows-example) covers `hermes-windows`.

:::

0) Install [dependencies](https://hermesengine.dev/docs/building-and-running/#dependencies)

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

The official guidance[^6] has been verified in macOS and HoloOS (Linux).

On macOS:

```bash
brew install icu4c cmake ninja
```

On HoloOS (and other Arch Linux distros):

```bash
sudo pacman -Syu cmake git ninja icu python zip readline
```

On Debian and Ubuntu:

```bash
sudo apt install cmake git ninja-build libicu-dev python zip libreadline-dev
```

:::note pass

When using virtual machines, Linux builds require at least 8 GB memory.

:::

</details>

1) Make a project directory:

```bash
mkdir sheetjs-hermes
cd sheetjs-hermes
```

2) Download the [`Makefile`](pathname:///hermes/Makefile):

```bash
curl -LO https://docs.sheetjs.com/hermes/Makefile
```

3) Download [`sheetjs-hermes.cpp`](pathname:///hermes/sheetjs-hermes.cpp):

```bash
curl -LO https://docs.sheetjs.com/hermes/sheetjs-hermes.cpp
```

4) Build the library (this is the `init` target):

```bash
make init
```

:::caution pass

In some test runs, the build failed due to Ninja issues:

```
CMake Error at CMakeLists.txt:64 (project):
  Running

   '/usr/local/lib/depot_tools/ninja' '--version'

  failed with:

   depot_tools/ninja.py: Could not find Ninja in the third_party of the current project, nor in your PATH.
```

This is due to a conflict with the Ninja version that ships with `depot_tools`.

Since `depot_tools` typically is added before other folders in the system `PATH`
variable, it is strongly recommended to rename the `ninja` binary, build the
Hermes libraries, and restore the `ninja` binary:

```bash
# Rename `ninja`
mv /usr/local/lib/depot_tools/ninja /usr/local/lib/depot_tools/ninja_tmp
# Build Hermes
make init
# Restore `ninja`
mv /usr/local/lib/depot_tools/ninja_tmp /usr/local/lib/depot_tools/ninja
```

:::

:::note pass

In some tests, the build failed with a message referencing a missing header:

```
hermes/API/hermes/inspector/chrome/tests/SerialExecutor.cpp:34:16: note: ‘std::runtime_error’ is defined in header ‘<stdexcept>’; did you forget to ‘#include <stdexcept>’?
```

**This error affects the official Hermes releases!**

The fix is to manually add a `#include` statement in the corresponding header
file (`API/hermes/inspector/chrome/tests/SerialExecutor.h` in the repo):

```c title="hermes/API/hermes/inspector/chrome/tests/SerialExecutor.h (add highlighted line)"
#include <memory>
#include <mutex>
#if !defined(_WINDOWS) && !defined(__EMSCRIPTEN__)
// highlight-next-line
#include <stdexcept>
#include <pthread.h>
#else
#include <thread>
```

:::

5) Build the application:

```bash
make sheetjs-hermes
```

6) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

7) Copy the `libhermes` and `libjsi` libraries into the current folder:

<Tabs groupId="os">
  <TabItem value="linux" label="Linux">

```bash
cp ./build_release/API/hermes/libhermes.so .
cp ./build_release/jsi/libjsi.so .
```

  </TabItem>
  <TabItem value="darwin" label="MacOS">

```bash
cp ./build_release/API/hermes/libhermes.dylib .
cp ./build_release/jsi/libjsi.dylib .
```

  </TabItem>
</Tabs>

8) Run the application:

```bash
./sheetjs-hermes pres.numbers
```

If successful, the program will print the library version number and the
contents of the first sheet as CSV rows.

### Windows Example

:::info pass

On ARM64, the commands must be run in a "ARM64 Native Tools Command Prompt".

:::

0) Install dependencies.

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

The build sequence requires Python, which can be installed from the official
Windows installer[^7].

Visual Studio with "Desktop development with C++" workload and Cmake must be
installed[^8]. In addition, the following Spectre-mitigated libs must be added:

- MSVC C++ x64/x86 Spectre-mitigated libs (Latest)
- C++ ATL for latest build tools with Spectre Mitigations (x86 & x64)
- C++ MFC for latest build tools with Spectre Mitigations (x86 & x64)

The easiest way to install is to select "Individual components" and search for
"spectre latest" (no quotation marks). Pick each option for the relevant CPU.

</details>

1) Set up `depot_tools`.

[`depot_tools.zip`](https://storage.googleapis.com/chrome-infra/depot_tools.zip)
must be downloaded and extracted to `c:\src\depot_tools\`.

:::note pass

This ZIP has a number of hidden files and folders (including `.git`) which
should be extracted along with the normal files.

:::

Add the path `c:\src\depot_tools\` to the User `PATH` environment variable

<details>
  <summary><b>Environment Variable Setup</b> (click to show)</summary>

Type `env` in the search bar and select "Edit the system environment variables".

In the new window, click the "Environment Variables..." button.

In the new window, look for the "User variables" section. Select "Path" in the
list and click "Edit".

In the new window, click "New" and type `c:\src\depot_tools` and press Enter.

Select the row and repeatedly click "Move Up" until it is the first entry.

Click "OK" in each window (3 windows) and restart your computer.

</details>

2) Delete `c:\src\depot_tools\ninja` if it exists, then download the
[official Windows release](https://github.com/ninja-build/ninja/releases/download/v1.11.1/ninja-win.zip)
and move the `ninja.exe` into `c:\src\depot_tools`. If a `ninja.exe` exists in
the folder, replace the existing program.

3) Make a project directory:

```bash
mkdir sheetjs-hermes
cd sheetjs-hermes
```

4) Clone the `hermes-windows` repo:

```bash
git clone https://github.com/microsoft/hermes-windows
cd hermes-windows
git checkout 240573e
cd ..
```

:::note pass

If there are errors related to SSL or certificates or `CApath`, temporarily
disable SSL in Git:

```bash
git config --global http.sslVerify false
git clone https://github.com/microsoft/hermes-windows
git config --global http.sslVerify true
```

:::

5) Build the library:

<Tabs groupId="arch">
  <TabItem value="x64" label="x64">

```bash
cd hermes-windows
.\.ado\scripts\cibuild.ps1 -AppPlatform win32 -Platform x64 -ToolsPlatform x64
cd ..
```

:::note pass

The script may fail with the message:

> cannot be loaded because running scripts is disabled on this system

In a "Run as Administrator" powershell window, run the following command:

```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
```

:::

:::info pass

In some test runs, the command failed when trying to copy `hermes.exe`:

```
Copy-Item: C:\Users\Me\Documents\hermes-windows\.ado\scripts\cibuild.ps1:331
Line |
 331 |      Copy-Item "$compilerAndToolsBuildPath\bin\hermes.exe" -Destinatio …
     |      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     | Cannot find path 'C:\Users\Me\Documents\hermes-windows\workspace\build\tools\bin\hermes.exe'
     | because it does not exist.
```

The libraries are built first and the standalone binary is not needed when
embedding Hermes, so the error message can be safely ignored.

:::

  </TabItem>
  <TabItem value="arm" label="ARM64">

```bash
cmake -S hermes-windows -B build -G "Visual Studio 17 2022" -A arm64
cmake --build ./build
```

  </TabItem>
</Tabs>

6) Copy every generated `.lib` and `.dll` file into the main folder:

<Tabs groupId="arch">
  <TabItem value="x64" label="x64">

```powershell
dir -r -Path .\hermes-windows\workspace\build\win32-x64-debug\ -Filter "*.dll" | Copy-Item -Destination .\
dir -r -Path .\hermes-windows\workspace\build\win32-x64-debug\ -Filter "*.lib" | Copy-Item -Destination .\
```

  </TabItem>
  <TabItem value="arm" label="ARM64">

Run the following commands in a PowerShell session:

```powershell
dir -r -Path .\build -Filter "*.dll" | Copy-Item -Destination .\
dir -r -Path .\build -Filter "*.lib" | Copy-Item -Destination .\
```

  </TabItem>
</Tabs>

7) Download [`sheetjs-hermes.cpp`](pathname:///hermes/sheetjs-hermesw.cpp):

```bash
curl -o sheetjs-hermesw.cpp https://docs.sheetjs.com/hermes/sheetjs-hermesw.cpp
```

8) Build the application:

```powershell
cl /MDd sheetjs-hermesw.cpp DbgHelp.lib *.lib /I hermes-windows\API /I hermes-windows\include /I hermes-windows\public\ /I hermes-windows\API\jsi
```

:::caution pass

If `cl` is not found, run the command in the "Native Tools Command Prompt"

:::

9) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -o xlsx.full.min.js https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -o pres.numbers https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

10) Run the application:

```bash
.\sheetjs-hermesw.exe pres.numbers
```

If successful, the program will print the library version number and the
contents of the first sheet as CSV rows.

### CLI Test

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Hermes   | Date       |
|:-------------|:---------|:-----------|
| `darwin-x64` | `0.12.0` | 2024-03-13 |

:::

Due to limitations of the standalone binary, this demo will encode a test file
as a Base64 string and directly add it to an amalgamated script.

#### Install CLI

0) Install the Hermes command line tools:

```bash
npx jsvu hermes@0.12.0
```

When prompted, select the appropriate operating system.

1) Inspect the output of the installer. Look for "Installing binary" lines:

```text pass
❯ Extracting…
// highlight-next-line
Installing binary to ~/.jsvu/engines/hermes-0.12.0/hermes-0.12.0…
Installing symlink at ~/.jsvu/bin/hermes-0.12.0 pointing to ~/.jsvu/engines/hermes-0.12.0/hermes-0.12.0…
Installing binary to ~/.jsvu/engines/hermes-0.12.0/hermes-0.12.0-compiler…
Installing symlink at ~/.jsvu/bin/hermes-0.12.0-compiler pointing to ~/.jsvu/engines/hermes-0.12.0/hermes-0.12.0-compiler…
```

The first "Installing binary" line mentions the path to the `hermes` tool.

#### Setup Project

2) Create a new project folder:

```bash
mkdir sheetjs-hermes-cli
cd sheetjs-hermes-cli
```

3) Copy the binary from Step 1 into the current folder. For example, on macOS:

```bash
cp ~/.jsvu/engines/hermes-0.12.0/hermes-0.12.0 .
```

#### Create Script

4) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

5) Bundle the test file and create `payload.js`:

```bash
node -e "fs.writeFileSync('payload.js', 'var payload = \"' + fs.readFileSync('pres.numbers').toString('base64') + '\";')"
```

6) Create support scripts:

- `global.js` creates a `global` variable and defines a fake `console`:

```js title="global.js"
var global = (function(){ return this; }).call(null);
var console = { log: function(x) { print(x); } };
```

- `hermes.js` will call `XLSX.read` and `XLSX.utils.sheet_to_csv`:

```js title="hermes.js"
var wb = XLSX.read(payload, {type:'base64'});
console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
```

7) Create the amalgamation `sheetjs.hermes.js`:

```bash
cat global.js xlsx.full.min.js payload.js hermes.js > sheetjs.hermes.js
```

The final script defines `global` before loading the standalone library.  Once
ready, it will read the bundled test data and print the contents as CSV.

#### Testing

8) Run the script using the Hermes standalone binary:

```bash
./hermes-0.12.0 sheetjs.hermes.js
```

If successful, the script will print CSV data from the test file.

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See ["Workbook Object"](/docs/csf/book)
[^3]: See ["Workbook Object"](/docs/csf/book)
[^4]: See [`sheet_to_csv` in "Utilities"](/docs/api/utilities/csv#csv-output)
[^5]: See [`microsoft/hermes-windows`](https://github.com/microsoft/hermes-windows) on GitHub
[^6]: See ["Dependencies" in "Building and Running"](https://hermesengine.dev/docs/building-and-running/#dependencies) in the Hermes Documentation
[^7]: See ["Download Python"](https://www.python.org/downloads/) in the Python website.
[^8]: See [the Visual Studio website](https://visualstudio.microsoft.com/#vs-section) for download links.
