---
title: AppleScript and OSA
pagination_prev: demos/cloud/index
pagination_next: demos/bigdata/index
sidebar_custom_props:
  summary: Integrate spreadsheets in macOS automation scripts
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Open Scripting Architecture (OSA)[^1] enables macOS app automation with scripts.
OSA originally supported the "AppleScript" language. Modern macOS releases
(OSX 10.10 and later) natively support JavaScript scripts using "JXA"[^2].

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS in OSA Scripts to pull data from a spreadsheet. We'll
explore how to use SheetJS libraries in AppleScript and JavaScript scripts. The
["Complete Demo"](#complete-demo) parses workbooks and generates CSV rows.

:::note Tested Environments

This demo was tested in the following environments:

| macOS  | Language          | Date       |
|:-------|:------------------|:-----------|
| `14.5` | AppleScript (OSA) | 2024-06-30 |
| `14.5` | JavaScript (JXA)  | 2024-06-30 |

:::

## Integration details

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated from the JS engine. Once evaluated, the `XLSX`
global will be defined. A JS stub can expose methods from AppleScript scripts.

<Tabs groupId="osa">
  <TabItem value="js" label="JavaScript">

The following snippet reads a file into a binary string:

```js
ObjC.import("Foundation");
function get_bstr(path) {
  /* create NSString from the file contents using a binary encoding */
  var str = $.NSString.stringWithContentsOfFileEncodingError(path, $.NSISOLatin1StringEncoding, null);
  /* return the value as a JS object */
  return ObjC.unwrap(str);
}
```

_Loading the Library_

Assuming the standalone library is in the same directory as the source file,
the script can be evaluated with `eval`:

```js
var src = get_bstr("./xlsx.full.min.js");
eval(src);
```

_Parsing Files_

The same method can be used to read binary strings and parse with `type: "binary"`:

```js
var file = get_bstr("./pres.numbers");
var wb = XLSX.read(file);
```

  </TabItem>
  <TabItem value="as" label="AppleScript">

The core idea is to push the processing logic to a stub JS file.

_JS Stub_

The JS stub will be evaluated in the JavaScript context. The same technique from
the JavaScript section works in the stub:

```js
ObjC.import("Foundation");

function get_bstr(path) {
  var str = $.NSString.stringWithContentsOfFileEncodingError(path,  $.NSISOLatin1StringEncoding, null);
  return ObjC.unwrap(str);
}

/* this will be called when AppleScript initializes the JS engine */
eval(get_bstr("./xlsx.full.min.js"));
```

It is more efficient to offload as much work as possible into the stub.  For
example, this function parses a workbook file from the filesystem and generates
a CSV without passing intermediate values back to AppleScript:

```js
/* this method will be exposed as `wb_to_csv` */
function wb_to_csv(path) {
  /* read file */
  var filedata = get_bstr(path);
  var wb = XLSX.read(filedata, { type: "binary" });
  return XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
}
```

_Loading the Stub_

Assuming the stub is saved to `xlsx.stub.js`, the following handler creates a
context and evaluates the standalone library:

```applescript
on getContext()
  -- get contents of xlsx.stub.js
  set UnixPath to POSIX path of ((path to me as text) & "::")
  set libpath to POSIX path of (UnixPath & "xlsx.stub.js")
  set {src, err} to current application's NSString's stringWithContentsOfFile:libpath encoding:(current application's NSISOLatin1StringEncoding) |error|:(reference)
  if src is missing value then error (err's localizedDescription()) as text

  -- create scripting context and evaluate the stub
  set lang to current application's OSALanguage's languageForName:"JavaScript"
  set osa to current application's OSAScript's alloc()'s initWithSource:src language:lang
  return osa
end getContext
```

_Evaluating JS Code_

When calling a function, the result is an array whose first item is the value of
the evaluated code. A small helper function extracts the raw result:

```applescript
on extractResult(res)
  return item 1 of ((current application's NSArray's arrayWithObject:res) as list)
end extractResult
```

With everything defined, `executeHandlerWithName` will run functions defined in
the stub.  For example:

```applescript
set osa to getContext()
set {res, err} to osa's executeHandlerWithName:"wb_to_csv" arguments:{"pres.numbers"} |error|:(reference)
extractResult(res)
```

  </TabItem>
</Tabs>

## Complete Demo

This example will read from a specified filename and print the first worksheet
data in CSV format.

0) Download the SheetJS Standalone script and test file. Move both files to
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://docs.sheetjs.com/pres.numbers
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}
</CodeBlock>

<Tabs groupId="osa">
  <TabItem value="js" label="JavaScript">

1) Save the following script to `sheetosa.js`:

```js title="sheetosa.js"
#!/usr/bin/env osascript -l JavaScript

ObjC.import("Foundation");
function get_bstr(path) {
  var str = $.NSString.stringWithContentsOfFileEncodingError(path,  $.NSISOLatin1StringEncoding, null);
  return ObjC.unwrap(str);
}
eval(get_bstr("./xlsx.full.min.js"));

function run(argv) {
  var filedata = get_bstr(argv[0]);
  var wb = XLSX.read(filedata, { type: "binary" });
  console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
}
```

2) Make the script executable:

```bash
chmod +x sheetosa.js
```

3) Run the script, passing the path to the test file as an argument:

```bash
./sheetosa.js pres.numbers
```

  </TabItem>
  <TabItem value="as" label="AppleScript">

1) Save the following script to `xlsx.stub.js`:

```js title="xlsx.stub.js"
ObjC.import("Foundation");
function get_bstr(path) {
  var str = $.NSString.stringWithContentsOfFileEncodingError(path,  $.NSISOLatin1StringEncoding, null);
  return ObjC.unwrap(str);
}
eval(get_bstr("./xlsx.full.min.js"));

function wb_to_csv(path) {
  var filedata = get_bstr(path);
  var wb = XLSX.read(filedata, { type: "binary" });
  return XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
}
```

2) Save the following script to `sheetosa.scpt`:

```applescript title="sheetosa.scpt"
#!/usr/bin/env osascript
use AppleScript version "2.7"
use scripting additions
use framework "Foundation"
use framework "OSAKit"

set osa to getContext()
set {res, err} to osa's executeHandlerWithName:"wb_to_csv" arguments:{"pres.numbers"} |error|:(reference)
extractResult(res)

on getContext()
  set UnixPath to POSIX path of ((path to me as text) & "::")
  set libpath to POSIX path of (UnixPath & "xlsx.stub.js")
  set {src, err} to current application's NSString's stringWithContentsOfFile:libpath encoding:(current application's NSISOLatin1StringEncoding) |error|:(reference)

  set lang to current application's OSALanguage's languageForName:"JavaScript"
  set osa to current application's OSAScript's alloc()'s initWithSource:src language:lang
  return osa
end getContext

on extractResult(res)
  return item 1 of ((current application's NSArray's arrayWithObject:res) as list)
end extractResult
```

3) Make the script executable:

```bash
chmod +x sheetosa.scpt
```

4) Run the script (it is hardcoded to read `pres.numbers`):

```bash
./sheetosa.scpt
```

  </TabItem>
</Tabs>

If successful, CSV rows from the first worksheet will be printed:

```
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46
```

[^1]: See ["Introduction to AppleScript Overview"](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptX/AppleScriptX.html) in the Apple Developer documentation for more details.
[^2]: See ["Introduction to JavaScript for Automation Release Notes"](https://developer.apple.com/library/archive/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/Introduction.html) in the Apple Developer documentation for more details.
