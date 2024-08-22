---
title: Sheets in ChakraCore
sidebar_label: C++ + ChakraCore
description: Process structured data in C++ programs. Seamlessly integrate spreadsheets into your program by pairing ChakraCore and SheetJS. Handle the most complex files without breaking a sweat.
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

ChakraCore is an embeddable JS engine written in C++.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses ChakraCore and SheetJS to pull data from a spreadsheet and print
CSV rows. We'll explore how to load SheetJS in a ChakraCore context and process
spreadsheets from a C++ program.

The ["Integration Example"](#integration-example) section includes a complete
command-line tool for reading data from files.

## Integration Details

### Initialize ChakraCore

ChakraCore provides a `global` object through `JsGetGlobalObject`:

```cpp
/* initialize */
JsRuntimeHandle runtime;
JsContextRef context;
size_t cookie = 0;
JsCreateRuntime(JsRuntimeAttributeNone, nullptr, &runtime);
JsCreateContext(runtime, &context);
JsSetCurrentContext(context);

/* obtain reference to global object */
JsValueRef global;
JsGetGlobalObject(&global);

/* DO WORK HERE */

/* cleanup */
JsSetCurrentContext(JS_INVALID_REFERENCE);
JsDisposeRuntime(runtime);
```

:::note pass

Cleanup and validation code is omitted from the discussion.  The integration
example shows structured validation and controlled memory usage.

:::

### Load SheetJS Scripts

[SheetJS Standalone scripts](/docs/getting-started/installation/standalone) can
be parsed and evaluated in a ChakraCore context.

The main library can be loaded by reading the script from the file system and
evaluating in the ChakraCore context:

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

#define EVAL_FILE(path) {\
  JsValueRef filename; \
  JsValueRef result; \
  JsCreateString(path, strlen(path), &filename); \
  size_t len; const char* script = read_file(path, &len);\
  JsValueRef src;\
  JsCreateExternalArrayBuffer((void*)script, len, nullptr, nullptr, &src);\
  JsRun(src, cookie++, filename, JsParseScriptAttributeNone, &result); \
}

// ...
  /* load library */
  EVAL_FILE("shim.min.js")
  EVAL_FILE("xlsx.full.min.js")
```

### Reading Files

`JsCreateExternalArrayBuffer` can generate an `ArrayBuffer` from a C byte array:

```cpp
/* read file */
size_t len; char *buf = read_file(argv[1], &len);

/* load data into array buffer */
JsValueRef ab;
JsCreateExternalArrayBuffer((void*)buf, len, nullptr, nullptr, &ab);
```

After pushing the data, it is easiest to store properties on `globalThis`:

```cpp
/* assign to the `buf` global variable */
JsValueRef buf_str; JsCreateString("buf", strlen("buf"), &buf_str);
JsObjectSetProperty(global, buf_str, ab, true);

/* call globalThis.wb = XLSX.read(ab) */
const char* script_str ="globalThis.wb = XLSX.read(buf);"

JsValueRef script;
JsCreateExternalArrayBuffer((void*)script_str, (size_t)strlen(script_str), nullptr, nullptr, &script);
JsRun(script, cookie++, fname, JsParseScriptAttributeNone, &result);
```

## Complete Example

The "Integration Example" covers a traditional integration in a C application,
while the "CLI Test" demonstrates other concepts using the `ch` CLI tool.

### Integration Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Git Commit | Date       |
|:-------------|:-----------|:-----------|
| `darwin-x64` | `c3ead3f`  | 2024-03-15 |
| `darwin-arm` | `3a7b120`  | 2024-05-23 |
| `win10-x64`  | `c3ead3f`  | 2024-03-04 |
| `win11-arm`  | `13358c6`  | 2024-07-14 |
| `linux-x64`  | `1f6e17c`  | 2024-04-25 |

:::

0) Install dependencies:

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="Intel Mac">

```bash
brew install icu4c cmake
```

  </TabItem>
  <TabItem value="darwin-arm" label="ARM64 Mac">

```bash
brew install icu4c cmake
```

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

On Arch Linux / HoloOS:

```bash
sudo pacman -S cmake clang
```

  </TabItem>
  <TabItem value="win10-x64" label="Intel Windows">

Install Visual Studio 2022 with the "Desktop Development with C++" workflow and
the "Git for Windows" individual component.

The commands in this demo should be run in "Native Tools Command Prompt".

  </TabItem>
  <TabItem value="win11-arm" label="ARM64 Windows">

Install Visual Studio 2022 with the "Desktop Development with C++" workflow and
the "Git for Windows" individual component.

The commands in this demo should be run in "ARM64 Native Tools Command Prompt".

  </TabItem>
</Tabs>

1) Download ChakraCore:

```bash
git clone https://github.com/chakra-core/ChakraCore.git
cd ChakraCore
git checkout 13358c6
cd ..
```

2) Build ChakraCore:

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="Intel Mac">

```bash
cd ChakraCore
./build.sh --static --icu=/usr/local/opt/icu4c/include --test-build -j=8
cd ..
```

:::note pass

In some test runs, the build failed with the message:

```
!!! couldn't find ICU ...
```

This was fixed with a local symlink to the `icu4c` folder before the build step:

```bash
cd ChakraCore
mkdir -p usr/local/opt
ln -s /opt/homebrew/opt/icu4c usr/local/opt/icu4c
cd ..
```

:::

  </TabItem>
  <TabItem value="darwin-arm" label="ARM64 Mac">

:::info pass

When the demo was last tested, ChakraCore JIT was not supported.

:::

```bash
cd ChakraCore
./build.sh --static --icu=/usr/local/opt/icu4c/include --test-build -j=8 --no-jit
cd ..
```


:::note pass

In some test runs, the build failed with the message:

```
!!! couldn't find ICU ...
```

This was fixed with a local symlink to the `icu4c` folder before the build step:

```bash
cd ChakraCore
mkdir -p usr/local/opt
ln -s /opt/homebrew/opt/icu4c usr/local/opt/icu4c
cd ..
```

:::

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

:::caution pass

When the demo was last tested, ChakraCore JIT was not supported.

:::

```bash
cd ChakraCore
./build.sh --static --embed-icu --test-build -j=8 --no-jit
cd ..
```

  </TabItem>
  <TabItem value="win10-x64" label="Intel Windows">

:::info pass

As explained in the ChakraCore project wiki[^1], the build accepts a few flags:

- `/p:Platform=x64` controls the architecture
- `/p:Configuration=Debug` enables runtime checks
- `/p:RuntimeLib=static_library` ensures MSVC libraries are statically linked

:::

```
cd ChakraCore
msbuild /m /p:Platform=x64 /p:Configuration=Debug /p:RuntimeLib=static_library Build\Chakra.Core.sln
cd ..
```

:::caution pass

During some test runs, the build failed with a message referencing `cfguard.h`:

```
    44>C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC\14.39.33519\include\cfguard.h(44,1): error C2220: the following warning is treated as an error
         (compiling source file 'ThreadContextInfo.cpp')

    44>C:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC\14.39.33519\include\cfguard.h(44,1): warning C4005: '_GUARD_CHECK_ICALL': macro redefinition
```

The source file `lib\Runtime\Base\ThreadContextInfo.cpp` must be patched. The
highlighted lines must be commented:

```cpp title="lib\Runtime\Base\ThreadContextInfo.cpp (comment highlighted lines)"
#if defined(_UCRT) && _CONTROL_FLOW_GUARD

// highlight-start
//# if _MSC_VER >= 1913
//#  include <cfguard.h>
//# else
// highlight-end
   extern "C" void __fastcall _guard_check_icall(_In_ uintptr_t _Target);
// highlight-next-line
//# endif
#endif
```

:::


After building, the generated DLL should be copied into the project folder:

```
copy .\ChakraCore\Build\VcBuild\bin\x64_debug\ChakraCore.dll .
```

  </TabItem>
  <TabItem value="win11-arm" label="ARM64 Windows">

:::info pass

As explained in the ChakraCore project wiki[^1], the build accepts a few flags:

- `/p:Platform=arm64` controls the architecture
- `/p:Configuration=Debug` enables runtime checks
- `/p:RuntimeLib=static_library` ensures MSVC libraries are statically linked

:::

```
cd ChakraCore
msbuild /m /p:Platform=arm64 /p:Configuration=Debug /p:RuntimeLib=static_library Build\Chakra.Core.sln
cd ..
```

:::caution pass

During some test runs, the build failed with a message referencing `LegalizeMD.cpp`:

```
    ...\ChakraCore\lib\Backend\arm64\LegalizeMD.cpp(323,16): warning C1489: 'fPostRegAlloc': local variable is initialized but not referenced [...]
```

The source file `lib\Backend\arm64\LegalizeMD.cpp` must be patched. The
highlighted line must be commented:

```cpp title="lib\Backend\arm64\LegalizeMD.cpp (comment highlighted line)"
void LegalizeMD::LegalizeIndirOffset(IR::Instr * instr, IR::IndirOpnd * indirOpnd, LegalForms forms)
{
// highlight-next-line
    //const bool fPostRegAlloc = instr->m_func->ShouldLegalizePostRegAlloc();

    // For LEA, we have special handling of indiropnds
    auto correctSize = [](IR::Instr* instr, IR::IndirOpnd* indirOpnd)#if defined(_UCRT) && _CONTROL_FLOW_GUARD
```

After commenting the line, run the command again.

:::


After building, the generated DLL should be copied into the project folder:

```
copy .\ChakraCore\Build\VcBuild\bin\arm64_debug\ChakraCore.dll .
```

  </TabItem>
</Tabs>

3) Download the source file and `Makefile`:

- [`sheetjs.ch.cpp`](pathname:///chakra/sheetjs.ch.cpp)
- [`Makefile`](pathname:///chakra/Makefile)

```bash
curl -L -O https://docs.sheetjs.com/chakra/sheetjs.ch.cpp
curl -L -O https://docs.sheetjs.com/chakra/Makefile
```

4) Build the sample application:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
make
```

:::caution pass

In some macOS test runs, the build failed with the message:

```
clang: error: no such file or directory: '/usr/local/opt/icu4c/lib/libicudata.a'
```

This was fixed by creating a symbolic link:

```bash
sudo mkdir -p /usr/local/opt
sudo ln -s /opt/homebrew/opt/icu4c /usr/local/opt
make
```

:::

  </TabItem>
  <TabItem value="win" label="Windows">

<Tabs groupId="triple">
  <TabItem value="win10-x64" label="Intel Windows">

```
cl sheetjs.ch.cpp ChakraCore.lib /I ChakraCore\lib\Jsrt /link /LIBPATH:ChakraCore\Build\VcBuild\bin\x64_debug
```

  </TabItem>
  <TabItem value="win11-arm" label="ARM64 Windows">

```
cl sheetjs.ch.cpp ChakraCore.lib /I ChakraCore\lib\Jsrt /link /LIBPATH:ChakraCore\Build\VcBuild\bin\arm64_debug
```

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

5) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -L -O https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -L -O https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -L -O https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

6) Run the test program:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
./sheetjs.ch pres.numbers
```

  </TabItem>
  <TabItem value="win" label="Windows">

```
.\sheetjs.ch.exe pres.numbers
```

  </TabItem>
</Tabs>

If successful, the program will print the contents of the first sheet as CSV.


### CLI Test

:::note Tested Deployments

This demo was last tested on 2024-07-14 against `ch` commit `13358c6`.

:::

Due to limitations of the `ch` standalone binary, this demo will encode a test
file as a Base64 string and directly add it to an amalgamated script.

0) Download and extract the ChakraCore release ZIP.  Copy the binary (`bin/ch`)
to your project folder.

:::tip pass

The ["Integration Example"](#integration-example) also builds the `ch` binary!
It will typically be placed in the `ChakraCore/out/Test/` folder on Linux/macOS
or `ChakraCore\Build\VcBuild\bin\x64_debug\` on x64 Windows.

:::

1) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -L -O https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -L -O https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -L -O https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

2) Bundle the test file and create `payload.js`:

```bash
node -e "fs.writeFileSync('payload.js', 'var payload = \"' + fs.readFileSync('pres.numbers').toString('base64') + '\";')"
```

3) Create support scripts:

- `global.js` creates a `global` variable:

```js title="global.js"
var global = (function(){ return this; }).call(null);
```

- `chakra.js` will call `XLSX.read` and `XLSX.utils.sheet_to_csv`:

```js title="chakra.js"
var wb = XLSX.read(payload, {type:'base64'});
console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
```

4) Create the amalgamation `xlsx.chakra.js`:

```bash
cat global.js xlsx.full.min.js payload.js chakra.js > xlsx.chakra.js
```

The final script defines `global` before loading the standalone library.  Once
ready, it will read the bundled test data and print the contents as CSV.

:::note pass

On Windows, the command should be run in WSL.

:::

5) Run the script using the ChakraCore standalone binary:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
./ch xlsx.chakra.js
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
.\ch.exe xlsx.chakra.js
```

  </TabItem>
</Tabs>

[^1]: See ["Building ChakraCore"](https://github.com/chakra-core/ChakraCore/wiki/Building-ChakraCore#deployment) in the ChakraCore project wiki