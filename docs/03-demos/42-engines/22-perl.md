---
title: Data Processing with JE
sidebar_label: Perl + JE
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

:::danger pass

In a production application, it is strongly recommended to use a binding for a
C engine like [`JavaScript::Duktape`](/docs/demos/engines/duktape#perl)

:::

[`JE`](https://metacpan.org/pod/JE) is a pure-Perl JavaScript engine.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses JE and SheetJS to pull data from a spreadsheet and print CSV
rows. We'll explore how to load SheetJS in a JE context and process spreadsheets
from Perl scripts.

The ["Complete Example"](#complete-example) section includes a complete script
for reading data from XLS files, printing CSV rows, and writing FODS workbooks.

## Integration Details

The [SheetJS ExtendScript build](/docs/getting-started/installation/extendscript)
can be parsed and evaluated in a JE context.

The engine deviates from ES3. Modifying prototypes can fix some behavior:

<details>
  <summary><b>Required shim to support JE</b> (click to show)</summary>

The following features are implemented:

- simple string `charCodeAt`
- Number `charCodeAt` (to work around string `split` bug)
- String `match` (to work around a bug when there are no matches)

```js title="Required shim to support JE"
/* String#charCodeAt is missing */
var string = "";
for(var i = 0; i < 256; ++i) string += String.fromCharCode(i);
String.prototype.charCodeAt = function(n) {
  var result = string.indexOf(this.charAt(n));
  if(result == -1) throw this.charAt(n);
  return result;
};

/* workaround for String split bug */
Number.prototype.charCodeAt = function(n) { return this + 48; };

/* String#match bug with empty results */
String.prototype.old_match = String.prototype.match;
String.prototype.match = function(p) {
  var result = this.old_match(p);
  return (Array.isArray(result) && result.length == 0) ? null : result;
};
```

</details>

When loading the ExtendScript build, the BOM must be removed:

```perl
## Load SheetJS source
my $src = read_file('xlsx.extendscript.js', { binmode => ':raw' });
$src =~ s/^\xEF\xBB\xBF//; ## remove UTF8 BOM
my $XLSX = $je->eval($src);
```

### Reading Files

Data should be passed as Base64 strings:

```perl
use File::Slurp;
use MIME::Base64 qw( encode_base64 );

## Set up conversion method
$je->eval(<<'EOF');
function sheetjsparse(data) { try {
  return XLSX.read(String(data), {type: "base64", WTF:1});
} catch(e) { return String(e); } }
EOF

## Read file
my $raw_data = encode_base64(read_file($ARGV[0], { binmode => ':raw' }), "");

## Call method with data
$return_val = $je->method(sheetjsparse => $raw_data);
```

### Writing Files

Due to bugs in data interchange, it is strongly recommended to use a simple
format like `.fods`:

```perl
use File::Slurp;

## Set up conversion method
$je->eval(<<'EOF');
function sheetjswrite(wb) { try {
  return XLSX.write(wb, { WTF:1, bookType: "fods", type: "string" });
} catch(e) { return String(e); } }
EOF

## Generate file
my $fods = $je->method(sheetjswrite => $workbook);

## Write to filesystem
write_file("SheetJE.fods", $fods);
```

## Complete Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Version | Date       |
|:-------------|:--------|:-----------|
| `darwin-x64` | `0.066` | 2024-06-29 |
| `darwin-arm` | `0.066` | 2024-05-25 |
| `linux-x64`  | `0.066` | 2024-06-29 |
| `linux-arm`  | `0.066` | 2024-05-25 |

:::

1) Install `JE` and `File::Slurp` through CPAN:

```bash
cpan install JE File::Slurp
```

:::note pass

There were permissions errors in some test runs:

```
mkdir /Library/Perl/5.30/File: Permission denied at /System/Library/Perl/5.30/ExtUtils/Install.pm line 489.
```

On macOS, the commands should be run through `sudo`:

```bash
sudo cpan install JE File::Slurp
```

:::

2) Download the [SheetJS ExtendScript build](/docs/getting-started/installation/extendscript):

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.extendscript.js`}
</CodeBlock>

3) Download the demo [`SheetJE.pl`](pathname:///perl/SheetJE.pl):

```bash
curl -LO https://docs.sheetjs.com/perl/SheetJE.pl
```

4) Download the [test file](pathname:///cd.xls) and run:

```bash
curl -LO https://docs.sheetjs.com/cd.xls
perl SheetJE.pl cd.xls
```

After a short wait, the contents will be displayed in CSV form. The script will
also generate the spreadsheet `SheetJE.fods` which can be opened in LibreOffice.