---
title: Data Processing with Nashorn
sidebar_label: Java + Nashorn
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[Nashorn](https://openjdk.org/projects/nashorn/) is a JS engine for Java. It
shipped with Java distributions starting with Java 8 and was eventually removed
in Java 15. The project was spun off and a compatible standalone release is
available for Java 15+.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete Java
command-line tool for reading data from spreadsheets and printing CSV rows.

## Integration Details

### Initialize Nashorn

Nashorn does not provide a `global` variable. It must be created:

```java
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

/* initialize nashorn engine */
ScriptEngine engine = (new ScriptEngineManager()).getEngineByName("javascript");

/* create global */
// highlight-next-line
engine.eval("var global = (function(){ return this; }).call(null);");
```

### Load SheetJS Scripts

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated in a Nashorn context.

The main library can be loaded by reading the script from the file system and
evaluating in the Nashorn context:

```java
engine.eval(new Scanner(
  SheetJS.class.getResourceAsStream("/xlsx.full.min.js")
).useDelimiter("\\Z").next());
```

To confirm the library is loaded, `XLSX.version` can be printed using the
Nashorn `print` built-in:

```java
engine.eval("print('SheetJS Version ' + XLSX.version);");
```

### Reading Files

Nashorn does not properly project `byte[]` into a JS array or `Int8Array`. The
recommended workaround is to copy the data in the JS context using the JS code:

```js
function b2a(b) {
  var out = typeof Uint8Array == 'function' ? new Uint8Array(b.length) : new Array(b.length);
  /* `b` is similar to Int8Array (values in the range -128 .. 127 ) */
  for(var i = 0; i < out.length; i++) out[i] = (b[i] + 256) & 0xFF;
  return out;
}
```

This function should be embedded in the Java code:

```java
/* read spreadsheet bytes */
engine.put("bytes", Files.readAllBytes(Paths.get(args[0])));

/* convert signed byte array to JS Uint8Array or unsigned byte array */
engine.eval(
  "function b2a(b) {" +
    "var out = typeof Uint8Array == 'function' ? new Uint8Array(b.length) : new Array(b.length);" +
    "for(var i = 0; i < out.length; i++) out[i] = b[i] & 0xFF;" +
    "return out;" +
  "}" +
  "var u8a = b2a(bytes)"
);

/* parse workbook */
engine.eval("var wb = XLSX.read(u8a, {type: 'array'})");
```

## Complete Example

:::note Tested Deployments

This demo was tested in the following deployments:

| OpenJDK | Nashorn         | Date       |
|:--------|:----------------|:-----------|
| 22.0.1  | 15.4 standalone | 2024-06-24 |
| 21.0.3  | 15.4 standalone | 2024-06-24 |
| 20.0.2  | 15.4 standalone | 2024-06-24 |
| 19.0.2  | 15.4 standalone | 2024-06-24 |
| 18.0.2  | 15.4 standalone | 2024-06-24 |
| 17.0.11 | 15.4 standalone | 2024-06-24 |
| 16.0.1  | 15.4 standalone | 2024-06-24 |
| 15.0.10 | 15.4 standalone | 2024-06-24 |
| 14.0.2  | Built-in        | 2024-06-24 |
| 13.0.14 | Built-in        | 2024-06-24 |
| 12.0.2  | Built-in        | 2024-06-24 |
| 11.0.23 | Built-in        | 2024-06-24 |
| 10.0.2  | Built-in        | 2024-06-24 |
| 9       | Built-in        | 2024-06-24 |
| 1.8.0   | Built-in        | 2024-06-24 |

:::

### Compilation

<Tabs groupId="java">
  <TabItem value="stdlib" label="Java 8 - 14">

Nashorn is available without additional dependencies

  </TabItem>
  <TabItem value="standalone" label="Java 15+">

0) Download Nashorn and its dependencies:

```bash
curl -L -o nashorn-core-15.4.jar "https://search.maven.org/remotecontent?filepath=org/openjdk/nashorn/nashorn-core/15.4/nashorn-core-15.4.jar"
curl -L -o asm-9.5.jar "https://search.maven.org/remotecontent?filepath=org/ow2/asm/asm/9.5/asm-9.5.jar"
curl -L -o asm-tree-9.5.jar "https://search.maven.org/remotecontent?filepath=org/ow2/asm/asm-tree/9.5/asm-tree-9.5.jar"
curl -L -o asm-commons-9.5.jar "https://search.maven.org/remotecontent?filepath=org/ow2/asm/asm-commons/9.5/asm-commons-9.5.jar"
curl -L -o asm-analysis-9.5.jar "https://search.maven.org/remotecontent?filepath=org/ow2/asm/asm-analysis/9.5/asm-analysis-9.5.jar"
curl -L -o asm-util-9.5.jar "https://search.maven.org/remotecontent?filepath=org/ow2/asm/asm-util/9.5/asm-util-9.5.jar"
```

  </TabItem>
</Tabs>

1) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

2) Download [`SheetJSNashorn.java`](pathname:///nashorn/SheetJSNashorn.java):

```bash
curl -LO https://docs.sheetjs.com/nashorn/SheetJSNashorn.java
```

3) Build the sample class:

```bash
javac SheetJSNashorn.java
```

This program tries to parse the file specified by the first argument and prints
CSV rows from the first worksheet.

### Standalone Test

4) Run the command directly:

<Tabs groupId="java">
  <TabItem value="stdlib" label="Java 8 - 14">

```bash
java SheetJSNashorn pres.xlsx
```

  </TabItem>
  <TabItem value="standalone" label="Java 15+">

Due to Java path inconsistencies, the command depends on the operating system:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
java -cp ".:asm-9.5.jar:asm-tree-9.5.jar:asm-commons-9.5.jar:asm-analysis-9.5.jar:asm-util-9.5.jar:nashorn-core-15.4.jar" SheetJSNashorn pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
java -cp ".;asm-9.5.jar;asm-tree-9.5.jar;asm-commons-9.5.jar;asm-analysis-9.5.jar;asm-util-9.5.jar;nashorn-core-15.4.jar" SheetJSNashorn pres.xlsx
```

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

If successful, CSV rows from the first worksheet will be displayed.

### Java Archive Test

5) Assemble a Java Archive:

```bash
jar -cf SheetJSNashorn.jar SheetJSNashorn.class xlsx.full.min.js shim.min.js
```

6) Create new directory and copy the archives and test file:

```bash
mkdir -p sheethorn
cp *.jar pres.xlsx sheethorn
cd sheethorn
```

7) Run the program using the Java Archive:

<Tabs groupId="java">
  <TabItem value="stdlib" label="Java 8 - 14">

Due to Java path inconsistencies, the command depends on the operating system:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
java -cp ".:SheetJSNashorn.jar" SheetJSNashorn pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
java -cp ".;SheetJSNashorn.jar" SheetJSNashorn pres.xlsx
```

  </TabItem>
</Tabs>

  </TabItem>
  <TabItem value="standalone" label="Java 15+">

Due to Java path inconsistencies, the command depends on the operating system:

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
java -cp ".:asm-9.5.jar:asm-tree-9.5.jar:asm-commons-9.5.jar:asm-analysis-9.5.jar:asm-util-9.5.jar:nashorn-core-15.4.jar:SheetJSNashorn.jar" SheetJSNashorn pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
java -cp ".;asm-9.5.jar;asm-tree-9.5.jar;asm-commons-9.5.jar;asm-analysis-9.5.jar;asm-util-9.5.jar;nashorn-core-15.4.jar;SheetJSNashorn.jar" SheetJSNashorn pres.xlsx
```

  </TabItem>
</Tabs>

  </TabItem>
</Tabs>

This should print the same CSV rows from Step 4.
