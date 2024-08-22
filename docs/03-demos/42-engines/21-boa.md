---
title: Rust + Boa
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

:::danger pass

In a production application, it is strongly recommended to use a binding for a
more performant engine like [`v8`](/docs/demos/engines/v8#rust)

:::

[Boa](https://boajs.dev/) is a JavaScript engine written in Rust.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

The ["Complete Example"](#complete-example) section creates a command-line tool
for reading data from spreadsheets and generating CSV rows.

## Integration Details

### Initialize Boa

A JS context can be constructed in one line:

```rust
use boa_engine::Context;

/* initialize */
let context = &mut Context::default();
```

The following helper function evaluates strings as JS code:

```rust
use std::string::String;
use boa_engine::{Context, Source, JsError};

/* simple wrapper to evaluate code snippets */
fn eval_code(c: &mut Context, code: &str) -> Result<String, JsError> {
  let src = Source::from_bytes(code);
  match c.eval(src) {
    Ok(res) => { return Ok(res.to_string(c).unwrap().to_std_string_escaped()); }
    Err(e) => { return Err(e); }
  };
}
```

### Load SheetJS Scripts

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be parsed and evaluated in a Boa context.

Boa provides a special helper to read source code from a path:

```rust
use std::path::Path;
use std::string::String;
use boa_engine::{js_string, Context, Source, JsError};

/* simple wrapper to evaluate an entire script file */
fn eval_file(c: &mut Context, path: &str) -> Result<String, JsError> {
  let src = Source::from_filepath(Path::new(path)).unwrap();
  match c.eval(src) {
    Ok(res) => { return Ok(res.to_string(c).unwrap().to_std_string_escaped()); }
    Err(e) => { return Err(e); }
  };
}

// ...
  /* load library */
  match eval_file(context, "./xlsx.full.min.js") {
    Ok(_res) => {}
    Err(e) => { return eprintln!("Uncaught {e}"); }
  }
```

To confirm the library is loaded, `XLSX.version` can be inspected:

```rust
  /* get version string */
  match eval_code(context, "XLSX.version") {
    Ok(res) => { println!( "SheetJS library version {}", res); }
    Err(e) => { return eprintln!("Uncaught {e}"); }
  }
```

### Reading Files

Boa supports `ArrayBuffer` natively.  This snippet reads data from a file into
`Vec<u8>` and stores the data as an `ArrayBuffer` in global scope:

```rust
  /* read file */
  let data: Vec<u8> = fs::read("pres.xlsx").unwrap();
  let array: JsArrayBuffer = JsArrayBuffer::from_byte_block(data, context).unwrap();
  let attrs = Attribute::WRITABLE | Attribute::ENUMERABLE | Attribute::CONFIGURABLE;
  context.register_global_property(js_string!("buf"), array, attrs);

  /* parse with SheetJS */
  match eval_code(context, "void (globalThis.wb = XLSX.read(buf))") {
    Ok(_res) => { }
    Err(e) => { return eprintln!("Uncaught {e}"); }
  }
```

`wb` will be a variable in the JS environment that can be inspected using the
various SheetJS API functions.

## Complete Example

:::note Tested Deployments

This demo was tested in the following deployments:

| Architecture | Boa      | Date       |
|:-------------|:---------|:-----------|
| `darwin-x64` | `0.18.0` | 2024-04-25 |
| `darwin-arm` | `0.18.0` | 2024-05-23 |
| `win10-x64`  | `0.18.0` | 2024-04-25 |
| `win11-arm`  | `0.18.0` | 2024-05-25 |
| `linux-x64`  | `0.18.0` | 2024-03-21 |
| `linux-arm`  | `0.18.0` | 2024-05-25 |

:::

0) Install Rust.

:::caution pass

Boa `0.18.0` requires Rust version `1.67` or later.

Debian 12 (Bullseye) ships with Rust version `1.63.0`.

It is strongly recommended to install Rust from the official distribution.

:::

1) Create a new project:

```bash
cargo new sheetjs-boa
cd sheetjs-boa
cargo run
```

2) Add the `boa_engine` crate:

```bash
cargo add boa_engine
```

3) Download the SheetJS Standalone script and test file. Save both files in the
project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
<li><a href="https://docs.sheetjs.com/pres.xlsx">pres.xlsx</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
curl -LO https://docs.sheetjs.com/pres.xlsx`}
</CodeBlock>

4) Download [`main.rs`](pathname:///boa/main.rs) and replace `src/main.rs`:

```bash
curl -L -o src/main.rs https://docs.sheetjs.com/boa/main.rs
```

5) Build and run the app in release mode:

```bash
cargo run --release
```

After a short wait, the contents will be displayed in CSV form.

:::caution pass

The default debug build is not optimized and can elicit stack overflow errors.
It is strongly encouraged to use `--release` when possible.

:::
