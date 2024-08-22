---
title: Go + Goja
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Goja is a pure Go implementation of ECMAScript 5.

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated in a Goja context.

## Integration Details

_Initialize Goja_

Goja does not provide a `global` variable. It can be created in one line:

```go
/* initialize */
vm := goja.New()

/* goja does not expose a standard "global" by default */
// highlight-next-line
v, err := vm.RunString("var global = (function(){ return this; }).call(null);")
```

_Load SheetJS Scripts_

The shim and main libraries can be loaded by reading the scripts from the file
system and evaluating in the Goja context:

```go
func safe_run_file(vm *goja.Runtime, file string) {
  data, err := ioutil.ReadFile(file)
  if err != nil { panic(err) }
  src := string(data)
  _, err = vm.RunString(src)
  if err != nil { panic(err) }
}

// ...
  safe_run_file(vm, "shim.min.js")
  safe_run_file(vm, "xlsx.full.min.js")
```

To confirm the library is loaded, `XLSX.version` can be inspected:

```go
  /* get version string */
  v, err := vm.RunString("XLSX.version")
  fmt.Printf("SheetJS library version %s\n", v)
```

### Reading Files

Files can be read into `[]byte`:

```go
/* read file */
data, _ := ioutil.ReadFile("sheetjs.xlsx")
```

`[]byte` should be converted to an `ArrayBuffer` from Go:

```go
/* load into engine */
vm.Set("buf", vm.ToValue(vm.NewArrayBuffer(data)))

/* parse */
wb, _ = vm.RunString("wb = XLSX.read(buf, {type:'buffer'});")
```

### Writing Files

`"base64"` strings can be passed from the JS context to Go code:

```go
/* write to Base64 string */
b64str, _ := vm.RunString("XLSX.write(wb, {type:'base64', bookType:'xlsx'})")

/* pull data back into Go and write to file */
buf, _ := base64.StdEncoding.DecodeString(b64str.String())
_ = ioutil.WriteFile("sheetjs.xlsx", buf, 0644)
```

## Complete Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Git Commit | Go version | Date       |
|:-------------|:-----------|:-----------|:-----------|
| `darwin-x64` | `e401ed4`  | `1.21.7`   | 2024-04-25 |
| `darwin-arm` | `ccbae20`  | `1.22.3`   | 2024-05-23 |
| `win10-x64`  | `e401ed4`  | `1.22.1`   | 2024-03-24 |
| `win11-arm`  | `ccbae20`  | `1.22.3`   | 2024-05-25 |
| `linux-x64`  | `e401ed4`  | `1.22.1`   | 2024-03-21 |
| `linux-arm`  | `ccbae20`  | `1.19.8`   | 2024-05-25 |

At the time of writing, Goja did not have proper version numbers. Versions are
identified by Git commit hashes.

:::

0) Create a module and install dependencies:

```bash
mkdir SheetGoja
cd SheetGoja
go mod init SheetGoja
go get github.com/dop251/goja
```

1) Download the SheetJS Standalone script, shim script and test file. Move all
three files to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js`}>shim.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.numbers">pres.numbers</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.numbers`}
</CodeBlock>

2) Download [`SheetGoja.go`](pathname:///goja/SheetGoja.go):

```bash
curl -LO https://docs.sheetjs.com/goja/SheetGoja.go
```

3) Build the standalone `SheetGoja` binary:

```bash
go build SheetGoja.go
```

4) Run the demo:

```bash
./SheetGoja pres.numbers
```

If the program succeeded, the CSV contents will be printed to console and the
file `sheetjsw.xlsb` will be created.  That file can be opened with Excel.
