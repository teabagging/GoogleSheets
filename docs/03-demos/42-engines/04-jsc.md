---
title: Swift + JavaScriptCore
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

export const r = {style: {color:"red"}};
export const B = {style: {fontWeight:"bold"}};

[JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) (JSC)
is the JavaScript engine powering the Safari web browser.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses JSC and SheetJS to read and write spreadsheets. We'll explore how
to load SheetJS in a JSC context and process spreadsheets and structured data
from C++ and Swift programs.

## Integration Details

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated in a JSC context.

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

Binary strings can be passed back and forth using `String.Encoding.isoLatin1`.

The SheetJS `read` method[^1], with the `"binary"` type, can parse binary strings.

The `write` method[^2], with the `"binary"` type, can create binary strings.

  </TabItem>
  <TabItem value="cpp" label="C++">

JSC provides a few special methods for working with `Uint8Array` objects:

- `JSObjectMakeTypedArrayWithBytesNoCopy`[^3] creates a typed array from a
pointer and size. It uses the memory address directly (no copy).

- `JSObjectGetTypedArrayLength`[^4] and `JSObjectGetTypedArrayBytesPtr`[^5] can
return a pointer and size pair from a `Uint8Array` in the JSC engine.

The SheetJS `read` method[^6] can process `Uint8Array` objects.

The `write` method[^7], with the `"buffer"` type, creates `Uint8Array` data.

  </TabItem>
</Tabs>

### Initialize JSC

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

A JSC context can be created with the `JSContext` function:

```swift
var context: JSContext!
do {
  context = JSContext();
  context.exceptionHandler = { _, X in if let e = X { print(e.toString()!); }; };
} catch { print(error.localizedDescription); }
```

  </TabItem>
  <TabItem value="cpp" label="C++">

A JSC context can be created with the `JSGlobalContextCreate` function:

```cpp
JSGlobalContextRef ctx = JSGlobalContextCreate(NULL);
```

  </TabItem>
</Tabs>

JSC does not provide a `global` variable. It can be created in one line:

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

```swift
do {
  // highlight-next-line
  context.evaluateScript("var global = (function(){ return this; }).call(null);");
} catch { print(error.localizedDescription); }
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#define DOIT(cmd) \
  JSStringRef script = JSStringCreateWithUTF8CString(cmd); \
  JSValueRef result = JSEvaluateScript(ctx, script, NULL, NULL, 0, NULL); \
  JSStringRelease(script);

{ DOIT("var global = (function(){ return this; }).call(null);") }
```

  </TabItem>
</Tabs>

### Load SheetJS Scripts

The main library can be loaded by reading the scripts from the file system and
evaluating in the JSC context:

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

```swift
let src = try String(contentsOfFile: "xlsx.full.min.js");
context.evaluateScript(src);
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
/* load library */
{
  size_t sz = 0; char *file = read_file("xlsx.full.min.js", &sz);
  DOIT(file);
}
```

  </TabItem>
</Tabs>

To confirm the library is loaded, `XLSX.version` can be inspected:

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

```swift
let XLSX: JSValue! = context.objectForKeyedSubscript("XLSX");
if let ver = XLSX.objectForKeyedSubscript("version") { print(ver.toString()); }
```

  </TabItem>
  <TabItem value="cpp" label="C++">

```cpp
#define JS_STR_TO_C \
  JSStringRef str = JSValueToStringCopy(ctx, result, NULL); \
  size_t sz = JSStringGetMaximumUTF8CStringSize(str); \
  char *buf = (char *)malloc(sz); \
  JSStringGetUTF8CString(str, buf, sz); \

/* get version string */
{
  DOIT("XLSX.version")

  JS_STR_TO_C

  printf("SheetJS library version %s\n", buf);
}
```

  </TabItem>
</Tabs>

### Reading Files

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

`String(contentsOf:encoding:)` reads from a path and returns an encoded string:

```swift
/* read sheetjs.xls as Base64 string */
let file_path = shared_dir.appendingPathComponent("sheetjs.xls");
let data: String! = try String(contentsOf: file_path, encoding: String.Encoding.isoLatin1);
```

This string can be loaded into the JS engine and processed:

```swift
/* load data in JSC */
context.setObject(data, forKeyedSubscript: "payload" as (NSCopying & NSObjectProtocol));

/* `payload` (the "forKeyedSubscript" parameter) is a binary string */
context.evaluateScript("var wb = XLSX.read(payload, {type:'binary'});");
```

<details>
  <summary><b>Direct Read</b> (click to show)</summary>

`Uint8Array` data can be passed directly, skipping string encoding and decoding:

```swift
let url = URL(fileURLWithPath: file)
var data: Data! = try Data(contentsOf: url);
let count = data.count;
/* Note: the operations must be performed in the closure! */
let wb: JSValue! = data.withUnsafeMutableBytes { (dataPtr: UnsafeMutableRawBufferPointer) in
// highlight-next-line
  let ab: JSValue! = JSValue(jsValueRef: JSObjectMakeTypedArrayWithBytesNoCopy(context.jsGlobalContextRef, kJSTypedArrayTypeUint8Array, dataPtr.baseAddress, count, nil, nil, nil), in: context)
  /* prepare options argument */
  context.evaluateScript(String(format: "var readopts = {type:'array', dense:true}"));
  let readopts: JSValue = context.objectForKeyedSubscript("readopts");
  /* call XLSX.read */
  let XLSX: JSValue! = context.objectForKeyedSubscript("XLSX");
  let readfunc: JSValue = XLSX.objectForKeyedSubscript("read");
  return readfunc.call(withArguments: [ab, readopts]);
}
```

For broad compatibility with Swift versions, the demo uses the String method.

</details>

  </TabItem>
  <TabItem value="cpp" label="C++">

There are a few steps for loading data into the JSC engine:

A) The file must be read into a `char*` buffer (using standard C methods)

```cpp
size_t sz; char *file = read_file(argv[1], &sz);
```

B) The typed array must be created with `JSObjectMakeTypedArrayWithBytesNoCopy`

```cpp
JSValueRef u8 = JSObjectMakeTypedArrayWithBytesNoCopy(ctx, kJSTypedArrayTypeUint8Array, file, sz, NULL, NULL, NULL);
```

C) The typed array must be bound to a variable in the global scope:

```cpp
/* assign to `global.buf` */
JSObjectRef global = JSContextGetGlobalObject(ctx);
JSStringRef key = JSStringCreateWithUTF8CString("buf");
JSObjectSetProperty(ctx, global, key, u8, 0, NULL);
JSStringRelease(key);
```

  </TabItem>
</Tabs>

### Writing Files

<Tabs groupId="jsclang">
  <TabItem value="swift" label="Swift">

When writing to binary string in JavaScriptCore, the result should be stored in
a variable and converted to string in Swift:

```swift
/* write to binary string */
context.evaluateScript("var out = XLSX.write(wb, {type:'binary', bookType:'xlsx'})");

/* `out` from the script is a binary string that can be stringified in Swift */
let outvalue: JSValue! = context.objectForKeyedSubscript("out");
var out: String! = outvalue.toString();
```

`String#write(to:atomically:encoding)` writes the string to the specified path:

```swift
/* write to sheetjsw.xlsx */
let out_path = shared_dir.appendingPathComponent("sheetjsw.xlsx");
try? out.write(to: out_path, atomically: false, encoding: String.Encoding.isoLatin1);
```

  </TabItem>
  <TabItem value="cpp" label="C++">

The SheetJS `write` method with type `"buffer"` will return a `Uint8Array` object:

```cpp
DOIT("XLSX.write(wb, {type:'buffer', bookType:'xlsb'});")
JSObjectRef u8 = JSValueToObject(ctx, result, NULL);
```

Given the result object, `JSObjectGetTypedArrayLength` pulls the length into C:

```cpp
size_t sz = JSObjectGetTypedArrayLength(ctx, u8, NULL);
```

`JSObjectGetTypedArrayBytesPtr` returns a pointer to the result buffer:

```cpp
char *buf = (char *)JSObjectGetTypedArrayBytesPtr(ctx, u8, NULL);
```

The data can be written to file using standard C methods:

```cpp
FILE *f = fopen("sheetjsw.xlsb", "wb"); fwrite(buf, 1, sz, f); fclose(f);
```

  </TabItem>
</Tabs>

## Complete Example

### Swift

:::note pass

This demo was tested in the following environments:

**Built-in**

Swift on MacOS supports JavaScriptCore without additional dependencies.

| Architecture | Swift   | Date       |
|:-------------|:--------|:-----------|
| `darwin-x64` | `5.10`  | 2024-04-04 |
| `darwin-arm` | `5.10`  | 2024-06-30 |

**Compiled**

The ["Swift C"](#swift-c) section starts from the static libraries built in the
["C++"](#c) section and builds Swift bindings.

| Architecture | Version          | Date       |
|:-------------|:-----------------|:-----------|
| `linux-x64`  | `7618.2.12.11.7` | 2024-06-22 |
| `linux-arm`  | `7618.2.12.11.7` | 2024-06-22 |

:::

The demo includes a sample `SheetJSCore` Wrapper class to simplify operations.

:::caution This demo only runs on MacOS

This example requires MacOS + Swift and will not work on Windows or Linux!

The ["Swift C"](#swift-c) section covers integration in other platforms.

:::

0) Ensure Swift is installed by running the following command in the terminal:

```bash
swiftc --version
```

If the command is not found, install Xcode.

1) Create a folder for the project:

```bash
mkdir sheetjswift
cd sheetjswift
```

2) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

3) Download the Swift scripts for the demo

- [`SheetJSCore.swift`](pathname:///swift/SheetJSCore.swift) Wrapper library
- [`main.swift`](pathname:///swift/main.swift) Command-line script

```bash
curl -LO https://docs.sheetjs.com/swift/SheetJSCore.swift
curl -LO https://docs.sheetjs.com/swift/main.swift
```


4) Build the `SheetJSwift` program:

```bash
swiftc SheetJSCore.swift main.swift -o SheetJSwift
```

5) Test the program:

```bash
./SheetJSwift pres.numbers
```

If successful, a CSV will be printed to console. The script also tries to write
to `SheetJSwift.xlsx`. That file can be verified by opening in Excel / Numbers.

### C++

:::note pass

This demo was tested in the following environments:

| Architecture | Version          | Date       |
|:-------------|:-----------------|:-----------|
| `darwin-x64` | `7618.1.15.14.7` | 2024-04-24 |
| `darwin-arm` | `7618.2.12.11.7` | 2024-05-24 |
| `linux-x64`  | `7618.2.12.11.7` | 2024-06-22 |
| `linux-arm`  | `7618.2.12.11.7` | 2024-06-22 |

:::

0) Install dependencies

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

The build requires CMake and Ruby.

On the Steam Deck, dependencies should be installed with `pacman`:

```bash
sudo pacman -Syu base-devel cmake ruby icu glibc linux-api-headers
```

On Debian and Ubuntu, dependencies should be installed with `apt`:

```bash
sudo apt-get install build-essential cmake ruby
```

</details>

1) Create a project folder:

```bash
mkdir sheetjs-jsc
cd sheetjs-jsc
```

2) Download and extract the WebKit snapshot:

```bash
curl -LO https://codeload.github.com/WebKit/WebKit/zip/refs/tags/WebKit-7618.2.12.11.7
mv WebKit-7618.2.12.11.7 WebKit.zip
unzip WebKit.zip
```

3) Build JavaScriptCore:

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="MacOS">

```bash
cd WebKit-WebKit-7618.2.12.11.7
Tools/Scripts/build-webkit --jsc-only --cmakeargs="-DENABLE_STATIC_JSC=ON"
cd ..
```

:::danger pass

When this demo was last tested on ARM64 macOS, JIT elicited runtime errors and
WebAssembly elicited compile-time errors. WebAssembly and JIT must be disabled:

```bash
cd WebKit-WebKit-7618.2.12.11.7
Tools/Scripts/build-webkit --jsc-only --cmakeargs="-DENABLE_STATIC_JSC=ON" --no-jit --no-webassembly
cd ..
```

:::

:::caution pass

When this demo was tested on macOS, the build failed with the error message

```
Source/WTF/wtf/text/ASCIILiteral.h:65:34: error: use of undeclared identifier 'NSString'
    WTF_EXPORT_PRIVATE RetainPtr<NSString> createNSString() const;
                                 ^
1 error generated.
```

The referenced header file must be patched to declare `NSString`:

```objc title="Source/WTF/wtf/text/ASCIILiteral.h (add highlighted lines)"
#include <wtf/text/SuperFastHash.h>

// highlight-start
#ifdef __OBJC__
@class NSString;
#endif
// highlight-end

namespace WTF {
```

:::

:::caution pass

When this demo was tested on ARM64 macOS, the build failed with the error message

```
Source/JavaScriptCore/runtime/JSCBytecodeCacheVersion.cpp:37:10: fatal error: 'wtf/spi/darwin/dyldSPI.h' file not found
#include <wtf/spi/darwin/dyldSPI.h>
         ^~~~~~~~~~~~~~~~~~~~~~~~~~
1 error generated.
```

The `#include` should be changed to a relative directive:

```cpp title="Source/JavaScriptCore/runtime/JSCBytecodeCacheVersion.cpp (edit highlighted lines)"
#include <wtf/NeverDestroyed.h>
// highlight-start
#include "../../WTF/wtf/spi/darwin/dyldSPI.h"
// highlight-end
#endif
```

:::

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

```bash
cd WebKit-WebKit-7618.2.12.11.7
env CFLAGS="-Wno-error=dangling-reference -Wno-dangling-reference" CXXFLAGS="-Wno-error=dangling-reference -Wno-dangling-reference" Tools/Scripts/build-webkit --jsc-only --cmakeargs="-Wno-error -DENABLE_STATIC_JSC=ON -DUSE_THIN_ARCHIVES=OFF -DCMAKE_C_FLAGS=\"-Wno-error -Wno-dangling-reference\" -DCMAKE_CXX_FLAGS=-Wno-error -Wno-dangling-reference"  --make-args="-j1 -Wno-error -Wno-error=dangling-reference" -j1
cd ..
```

:::caution pass

When this was last tested on the Steam Deck, the build ran for 24 minutes!

:::

:::danger pass

When this demo was last tested on ARM64, there was a dangling pointer error:

<pre>
<span {...B}>WebKitBuild/JSCOnly/Release/WTF/Headers/wtf/SentinelLinkedList.h:61:55: <span {...r}>error:</span></span> storing the address of local variable <span {...B}>‘toBeRemoved’</span> in <span {...B}>‘{"*"}MEM[(struct BasicRawSentinelNode {"*"} const &)this_4(D) + 96].WTF::BasicRawSentinelNode&lt;JSC::CallLinkInfoBase&gt;::m_next’</span> [<span style={{...r.style,...B.style}}>-Werror=dangling-pointer=</span>]
{"   61 |"}     void setNext(BasicRawSentinelNode* next) {"{"} <span style={{...r.style,...B.style}}>m_next = next</span>; {"}"}
{"      |"}                                                <span {...r}>~~~~~~~^~~~~~</span>
</pre>

The error can be suppressed with preprocessor directives around the definition:

```cpp title="WebKitBuild/JSCOnly/Release/WTF/Headers/wtf/SentinelLinkedList.h (add highlighted lines)"
    BasicRawSentinelNode() = default;

// highlight-start
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdangling-pointer"
// highlight-end

    void setPrev(BasicRawSentinelNode* prev) { m_prev = prev; }
    void setNext(BasicRawSentinelNode* next) { m_next = next; }

// highlight-next-line
#pragma GCC diagnostic pop


    T* prev() const { return static_cast<T*>(PtrTraits::unwrap(m_prev)); }
```

After patching the header, JSC must be built without WebAssembly or JIT support:

```bash
cd WebKit-WebKit-7618.2.12.11.7
env CFLAGS="-Wno-error=dangling-reference -Wno-dangling-reference" CXXFLAGS="-Wno-error=dangling-reference -Wno-dangling-reference" Tools/Scripts/build-webkit --jsc-only --cmakeargs="-Wno-error -DENABLE_STATIC_JSC=ON -DUSE_THIN_ARCHIVES=OFF -DCMAKE_C_FLAGS=\"-Wno-error -Wno-dangling-reference\" -DCMAKE_CXX_FLAGS=-Wno-error -Wno-dangling-reference"  --make-args="-j1 -Wno-error -Wno-error=dangling-reference" -j1 --no-jit --no-webassembly
cd ..
```

:::

  </TabItem>
</Tabs>

4) Create a symbolic link to the `Release` folder in the source tree:

```bash
ln -s WebKit-WebKit-7618.2.12.11.7/WebKitBuild/JSCOnly/Release/ .
```

5) Download [`sheetjs-jsc.c`](pathname:///jsc/sheetjs-jsc.c):

```bash
curl -LO https://docs.sheetjs.com/jsc/sheetjs-jsc.c
```

6) Compile the program:

<Tabs groupId="triple">
  <TabItem value="darwin-x64" label="MacOS">

```bash
g++ -o sheetjs-jsc sheetjs-jsc.c -IRelease/JavaScriptCore/Headers -LRelease/lib -lbmalloc -licucore -lWTF -lJavaScriptCore -IRelease/JavaScriptCore/Headers
```

  </TabItem>
  <TabItem value="linux-x64" label="Linux">

```bash
g++ -o sheetjs-jsc sheetjs-jsc.c -IRelease/JavaScriptCore/Headers -LRelease/lib -lJavaScriptCore -lWTF -lbmalloc -licui18n -licuuc -latomic -IRelease/JavaScriptCore/Headers
```

  </TabItem>
</Tabs>

7) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

8) Run the program:

```bash
./sheetjs-jsc pres.numbers
```

If successful, a CSV will be printed to console. The script also tries to write
to `sheetjsw.xlsb`, which can be opened in a spreadsheet editor.

### Swift C

:::note pass

For macOS and iOS deployments, it is strongly encouraged to use the official
`JavaScriptCore` bindings. This demo is suited for Linux Swift applications.

:::

0) Install the Swift toolchain.[^8]

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

The `linux-x64` test was run on [Ubuntu 22.04 using Swift 5.10.1](https://download.swift.org/swift-5.10.1-release/ubuntu2204/swift-5.10.1-RELEASE/swift-5.10.1-RELEASE-ubuntu22.04.tar.gz)

The `linux-arm` test was run on [Debian 12 "bookworm" using Swift 5.10.1](https://download.swift.org/swift-5.10.1-release/debian12-aarch64/swift-5.10.1-RELEASE/swift-5.10.1-RELEASE-debian12-aarch64.tar.gz)

</details>

1) Follow the entire ["C" demo](#c). The shared library will be used in Swift.

2) Enter the `sheetjs-jsc` folder from the previous step.

3) Create a folder `sheetjswift`. It should be in the `sheetjs-jsc` folder:

```bash
mkdir sheetjswift
cd sheetjswift
```

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

5) Copy all generated headers to the current directory:

```bash
find ../WebKit-WebKit*/WebKitBuild/JSCOnly/Release/JavaScriptCore/Headers/  -name \*.h | xargs -I '%' cp '%' .
```

6) Edit each header file and replace all instances of `<JavaScriptCore/` with
`<`. For example, `JavaScript.h` includes `<JavaScriptCore/JSBase.h>`:

```c title="JavaScript.h (original include)"
#include <JavaScriptCore/JSBase.h>
```

This must be changed to `<JSBase.h>`:

```c title="JavaScript.h (modified include)"
#include <JSBase.h>
```

7) Print the current working directory. It will be the path to `sheetjswift`:

```bash
pwd
```

8) Create a new header named `JavaScriptCore-Bridging-Header.h` :

```c title="JavaScriptCore-Bridging-Header.h"
#import "/tmp/sheetjs-jsc/sheetjswift/JavaScript.h"
```

Replace the import path to the working directory from step 7. For example, if
the path was `/home/sheetjs/sheetjs-jsc/sheetjswift/`, the import should be

```c title="JavaScriptCore-Bridging-Header.h"
#import "/home/sheetjs/sheetjs-jsc/JavaScript.h"
```

9) Create the default module map `module.modulemap`:

```text title="module.modulemap"
module JavaScriptCore {
  header "./JavaScript.h"
  link "JavaScriptCore"
}
```

10) Download [`SheetJSCRaw.swift`](pathname:///swift/SheetJSCRaw.swift):

```bash
curl -LO https://docs.sheetjs.com/swift/SheetJSCRaw.swift
```

11) Build `SheetJSwift`:

```bash
swiftc -Xcc -I$(pwd) -Xlinker -L../WebKit-WebKit-7618.2.12.11.7/WebKitBuild/JSCOnly/Release/lib/ -Xlinker -lJavaScriptCore -Xlinker -lWTF -Xlinker -lbmalloc -Xlinker -lstdc++ -Xlinker -latomic -Xlinker -licuuc -Xlinker -licui18n -import-objc-header JavaScriptCore-Bridging-Header.h SheetJSCRaw.swift -o SheetJSwift
```

12) Run the command:

```bash
./SheetJSwift pres.numbers
```

If successful, a CSV will be printed to console. The program also tries to write
to `SheetJSwift.xlsx`, which can be opened in a spreadsheet editor.

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^3]: See [`JSObjectMakeTypedArrayWithBytesNoCopy`](https://developer.apple.com/documentation/javascriptcore/jsobjectmaketypedarraywithbytesnocopy(_:_:_:_:_:_:_:)/) in the JavaScriptCore documentation.
[^4]: See [`JSObjectGetTypedArrayLength`](https://developer.apple.com/documentation/javascriptcore/jsobjectgettypedarraylength(_:_:_:)/) in the JavaScriptCore documentation.
[^5]: See [`JSObjectGetTypedArrayBytesPtr`](
https://developer.apple.com/documentation/javascriptcore/jsobjectgettypedarraybytesptr(_:_:_:)/) in the JavaScriptCore documentation.
[^6]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^7]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^8]: See ["Install Swift"](https://www.swift.org/install) in the Swift website.
