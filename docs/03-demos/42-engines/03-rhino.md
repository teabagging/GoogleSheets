---
title: Taming Data with Rhino
sidebar_label: Java + Rhino
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

Rhino is an ES3+ engine in Java.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete Java
command-line tool for reading data from spreadsheets and printing CSV rows.

:::caution pass

Rhino does not support Uint8Array, so NUMBERS files cannot be read or written.

:::

:::note Tested Deployments

This demo was tested in the following deployments:

| OpenJDK | Rhino    | Date       |
|:--------|:---------|:-----------|
| 22      | `1.7.14` | 2024-04-04 |
| 21.0.3  | `1.7.15` | 2024-05-24 |
| 20.0.2  | `1.7.15` | 2024-05-25 |
| 19.0.2  | `1.7.15` | 2024-05-25 |
| 18.0.2  | `1.7.15` | 2024-05-25 |
| 17.0.11 | `1.7.15` | 2024-05-25 |
| 16.0.1  | `1.7.15` | 2024-05-25 |
| 15.0.10 | `1.7.15` | 2024-05-25 |
| 14.0.2  | `1.7.15` | 2024-05-25 |
| 13.0.14 | `1.7.15` | 2024-05-25 |
| 12.0.2  | `1.7.15` | 2024-05-25 |
| 11.0.22 | `1.7.15` | 2024-05-25 |
| 10.0.2  | `1.7.15` | 2024-05-25 |
| 9       | `1.7.15` | 2024-05-25 |
| 1.8.0   | `1.7.14` | 2024-04-25 |

:::

## Integration Details

:::caution pass

Due to code generation errors, optimization must be turned off:

```java
Context context = Context.enter();
context.setOptimizationLevel(-1);
```

:::

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated in a Rhino context.

Binary strings can be passed back and forth.

_Initialize Rhino_

Rhino does not provide a `global` variable. It can be created:

```java
Context cx = Context.enter();
Scriptable scope = cx.initStandardObjects();

/* Disable optimization */
cx.setOptimizationLevel(-1);

/* Initialize `global` variable */
// highlight-start
String s = "var global = (function(){ return this; }).call(null);";
cx.evaluateString(scope, s, "<cmd>", 1, null);
// highlight-end
```

_Load SheetJS Scripts_

The main library can be loaded by reading the scripts from the Java Archive and
evaluating in the Rhino context:

```java
/* pull source from JAR */
String s = new Scanner(
  SheetJS.class.getResourceAsStream("/xlsx.full.min.js")
).useDelimiter("\\Z").next();
/* evaluate */
cx.evaluateString(scope, s, "<cmd>", 1, null);
```

To confirm the library is loaded, `XLSX.version` can be inspected:

```swift
/* get handle to XLSX */
Object XLSX = scope.get("XLSX", scope);
if(XLSX == Scriptable.NOT_FOUND) throw new Exception("XLSX not found");

/* get the version string */
String version = ((NativeObject)XLSX).get("version", scope).toString();
System.out.println("SheetJS version " + version);
```

### Reading Files

A binary string can be generated from a `byte` array:

```java
  static String read_file(String file) throws IOException {
    /* read file -> array of bytes */
    byte[] b = Files.readAllBytes(Paths.get(file));

    /* construct binary string */
    StringBuilder sb = new StringBuilder();
    for(int i = 0; i < b.length; ++i) sb.append(Character.toString((char)(b[i] < 0 ? b[i] + 256 : b[i])));
    return sb.toString();
  }
```

This string can be loaded into the JS engine and processed:

```java
  /* options argument */
  String os = "q = {'type':'binary', 'WTF':1};";
  NativeObject o = (NativeObject)cx.evaluateString(scope, os, "<cmd>", 2, null);

  /* set up function arguments */
  String data = read_file(path_to_file);
  Object args[] = {data, o};

  /* call read -> wb workbook */
  NativeObject nXLSX = (NativeObject)XLSX;
  Function readfunc = (Function)XLSX.get("read", scope);
  NativeObject wb = (NativeObject)readfunc.call(cx, scope, nXLSX, args);
```

`wb` will be a reference to the JS workbook object.

## Complete Example

0) Ensure Java is installed.

1) Create a folder for the project:

```bash
mkdir sheetjs-java
cd sheetjs-java
```

2) Download the Rhino JAR and rename to `rhino.jar`:

```
curl -L -o rhino.jar https://repo1.maven.org/maven2/org/mozilla/rhino/1.7.15/rhino-1.7.15.jar
```

3) Download the SheetJS Standalone script and the test file. Save both files in
the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

4) Download [`SheetJSRhino.zip`](pathname:///rhino/SheetJSRhino.zip) and unzip

```bash
curl -LO https://docs.sheetjs.com/rhino/SheetJSRhino.zip
unzip SheetJSRhino.zip
```

5) Save the following code to `SheetJSRhino.java`:

```java title="SheetJSRhino.java"
/* sheetjs (C) 2013-present  SheetJS -- https://sheetjs.com */
/* vim: set ts=2: */
import com.sheetjs.SheetJS;
import com.sheetjs.SheetJSFile;
import com.sheetjs.SheetJSSheet;

public class SheetJSRhino {
  public static void main(String args[]) throws Exception {
    try {
      SheetJS sjs = new SheetJS();

      /* open file */
      SheetJSFile xl = sjs.read_file(args[0]);

      /* get sheetnames */
      String[] sheetnames = xl.get_sheet_names();
      System.err.println(sheetnames[0]);

      /* convert to CSV */
      SheetJSSheet sheet = xl.get_sheet(0);
      String csv = sheet.get_csv();
      System.out.println(csv);
    } catch(Exception e) { throw e; } finally { SheetJS.close(); }
  }
}
```

6) Assemble `SheetJS.jar` from the demo code:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
javac -cp ".:rhino.jar" SheetJSRhino.java
jar -cf SheetJS.jar SheetJSRhino.class com/sheetjs/*.class xlsx.full.min.js
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
javac -cp ".;rhino.jar" SheetJSRhino.java
jar -cf SheetJS.jar SheetJSRhino.class com/sheetjs/*.class xlsx.full.min.js
```

  </TabItem>
</Tabs>

7) Test the program:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
java -cp ".:SheetJS.jar:rhino.jar" SheetJSRhino pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
java -cp ".;SheetJS.jar;rhino.jar" SheetJSRhino pres.xlsx
```

  </TabItem>
</Tabs>

If successful, a CSV will be printed to console.
