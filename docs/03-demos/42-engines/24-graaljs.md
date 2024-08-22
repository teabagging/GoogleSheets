---
title: Data Processing with GraalJS
sidebar_label: Java + GraalJS
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[GraalJS](https://www.graalvm.org/latest/reference-manual/js/) is a JS engine
for Java. The project offers a JSR-223 compliant OpenJDK-compatible build.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete Java
command-line tool for reading data from spreadsheets and printing CSV rows.

:::info pass

The Java packages used in this demo are covered under open source licenses. The
Universal Permissive License covers most of the packages, while `icu4j` uses
a different, yet still permissive, license.

:::

## Integration Details

:::info pass

When this demo was last tested, raw byte arrays could not be passed to GraalJS.

**This is a limitation of the default GraalJS behavior.**

Instead, this demo uses Nashorn Compatibility Mode[^1] through a runtime flag:

```js
java -Dpolyglot.js.nashorn-compat=true ...
```

:::

The [Nashorn demo](/docs/demos/engines/nashorn) code and explanation applies to
JSR-223 compatible `ScriptEngine` implementations, including GraalJS.

## Complete Example

:::note Tested Deployments

This demo was tested in the following deployments:

| OpenJDK | GraalJS | Date       |
|:--------|:--------|:-----------|
| 22      | 24.0.1  | 2024-05-25 |
| 21.0.3  | 24.0.1  | 2024-05-25 |
| 20.0.2  | 24.0.1  | 2024-05-25 |
| 19.0.2  | 24.0.1  | 2024-05-25 |
| 18.0.2  | 24.0.1  | 2024-05-25 |
| 17.0.10 | 24.0.1  | 2024-05-25 |

:::

### Compilation

0) Download GraalJS and its dependencies:

```bash
curl -LO "https://repo1.maven.org/maven2/org/graalvm/js/js-scriptengine/24.0.1/js-scriptengine-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/js/js-language/24.0.1/js-language-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/polyglot/polyglot/24.0.1/polyglot-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/sdk/collections/24.0.1/collections-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/truffle/truffle-api/24.0.1/truffle-api-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/sdk/nativeimage/24.0.1/nativeimage-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/shadowed/icu4j/24.0.1/icu4j-24.0.1.jar"
curl -LO "https://repo1.maven.org/maven2/org/graalvm/regex/regex/24.0.1/regex-24.0.1.jar"
```

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

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
java -cp ".:js-scriptengine-24.0.1.jar:js-language-24.0.1.jar:polyglot-24.0.1.jar:collections-24.0.1.jar:truffle-api-24.0.1.jar:nativeimage-24.0.1.jar:icu4j-24.0.1.jar:regex-24.0.1.jar" -Dpolyglot.js.nashorn-compat=true SheetJSNashorn pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
java -cp ".;js-scriptengine-24.0.1.jar;js-language-24.0.1.jar;polyglot-24.0.1.jar;collections-24.0.1.jar;truffle-api-24.0.1.jar;nativeimage-24.0.1.jar;icu4j-24.0.1.jar;regex-24.0.1.jar" -D"polyglot.js.nashorn-compat=true" SheetJSNashorn pres.xlsx
```

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

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

```bash
java -cp ".:js-scriptengine-24.0.1.jar:js-language-24.0.1.jar:polyglot-24.0.1.jar:collections-24.0.1.jar:truffle-api-24.0.1.jar:nativeimage-24.0.1.jar:icu4j-24.0.1.jar:regex-24.0.1.jar:SheetJSNashorn.jar" -Dpolyglot.js.nashorn-compat=true  SheetJSNashorn pres.xlsx
```

  </TabItem>
  <TabItem value="win" label="Windows">

```bash
java -cp ".;js-scriptengine-24.0.1.jar;js-language-24.0.1.jar;polyglot-24.0.1.jar;collections-24.0.1.jar;truffle-api-24.0.1.jar;nativeimage-24.0.1.jar;icu4j-24.0.1.jar;regex-24.0.1.jar;SheetJSNashorn.jar" -D"polyglot.js.nashorn-compat=true"  SheetJSNashorn pres.xlsx
```

  </TabItem>
</Tabs>

This should print the same CSV rows from Step 4.

[^1]: See ["Nashorn Compatibility Mode"](https://www.graalvm.org/latest/reference-manual/js/NashornMigrationGuide/#nashorn-compatibility-mode) in the GraalJS documentation.
