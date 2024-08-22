---
title: JavaScript Engines
pagination_prev: demos/bigdata/index
pagination_next: solutions/input
---

import EngineData from '/data/engines.js'

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

JavaScript code cannot be directly executed on most modern computers. A software
component ("JavaScript engine") executes code. After embedding a JS engine,
programs can leverage SheetJS libraries to process spreadsheets and data.

The demos in this section showcase a number of JS engines and language bindings.
In each case, we will build a sample application that embeds a JS engine, loads
SheetJS library scripts, and reads and writes spreadsheet files.


## General Caveats

There are many JS engines with different design goals. Some are designed for
low-power or low-memory environments. Others aim for interoperability with
specific programming languages or environments. Typically they support ES3 and
are capable of running SheetJS code.

Common browser and NodeJS APIs are often missing from light-weight JS engines.

**Global**

Some engines do not provide `globalThis` or `global` or `window`. A `global`
variable can be exposed in one line that should be run in the JS engine:

```js
var global = (function(){ return this; }).call(null);
```

**Console**

Some engines do not provide a `console` object but offer other ways to print to
standard output. For example, Hermes[^1] provides `print()`. A `console` object
should be created using the engine print function:

```js
var console = { log: function(x) { print(x); } };
```

**Binary Data**

Some engines do not provide easy ways to exchange binary data. For example, some
libraries pass null-terminated arrays, which would truncate XLSX, XLS, and other
exports. APIs that accept pointers without length should be avoided.

Base64 strings are safe, as they do not use null characters, but should only be
used when there is no safe way to pass `ArrayBuffer` or `Uint8Array` objects.
The SheetJS `read`[^2] and `write`[^3] methods directly support Base64 strings.

**Byte Conventions**

Java has no native concept of unsigned bytes. Values in a `byte[]` are limited
to the range `-128 .. 127`. They need to be fixed within the JS engine.

Some engines support typed arrays. The `Uint8Array` constructor will fix values:

```js
var signed_data = [-48, -49, 17, -32, /* ... */]; // 0xD0 0xCF 0x11 0xE0 ...
var fixed_data = new Uint8Array(signed_data);
```

When `Uint8Array` is not supported, values can be fixed with bitwise operations:

```js
var signed_data = [-48, -49, 17, -32, /* ... */]; // 0xD0 0xCF 0x11 0xE0 ...
var fixed_data = new Array(signed_data.length);
for(var i = 0; i < signed_data.length; ++i) fixed_data[i] = signed_data[i] & 0xFF;
```

## Engines

:::info pass

Demos are tested across multiple operating systems (Windows, MacOS and Linux)
across multiple architectures (x64 and ARM64).

:::

<EngineData/>

#### Boa

Boa is an embeddable JS engine written in Rust.

This demo has been moved [to a dedicated page](/docs/demos/engines/boa).

#### ChakraCore

ChakraCore is an embeddable JS engine written in C++.

This demo has been moved [to a dedicated page](/docs/demos/engines/chakra).

#### Duktape

Duktape is an embeddable JS engine written in C. It has been ported to a number
of exotic architectures and operating systems.

This demo has been moved [to a dedicated page](/docs/demos/engines/duktape).
The demo includes examples in C, Perl, PHP, Python and Zig.

#### Goja

Goja is a pure Go implementation of ECMAScript 5.

This demo has been moved [to a dedicated page](/docs/demos/engines/goja).

#### Hermes

Hermes is an embeddable JS engine written in C++.

This demo has been moved [to a dedicated page](/docs/demos/engines/hermes).

#### JavaScriptCore

iOS and MacOS ship with the JavaScriptCore framework for running JS code from
Swift and Objective-C.

This demo has been moved [to a dedicated page](/docs/demos/engines/jsc).

#### JerryScript

JerryScript is a lightweight JavaScript engine designed for use in low-memory
environments including microcontrollers.

This demo has been moved [to a dedicated page](/docs/demos/engines/jerryscript).

#### Jint

Jint is an embeddable JS engine for .NET written in C#.

This demo has been moved [to a dedicated page](/docs/demos/engines/jint).

#### Nashorn

Nashorn shipped with some versions of Java.  It is now a standalone library.

This demo has been moved [to a dedicated page](/docs/demos/engines/nashorn).

#### QuickJS

QuickJS is an embeddable JS engine written in C.  It provides a separate set of
functions for interacting with the filesystem and the global object.  It can run
the standalone browser scripts.

This demo has been moved [to a dedicated page](/docs/demos/engines/quickjs).

#### Rhino

Rhino is an ES3+ engine in Java.

This demo has been moved [to a dedicated page](/docs/demos/engines/rhino).

#### V8

V8 is an embeddable JS engine written in C++. It powers Chromium and Chrome,
NodeJS and Deno, Adobe UXP and other platforms.

This demo has been moved [to a dedicated page](/docs/demos/engines/v8).
The demo includes examples in C++ and Rust.

The ["Python + Pandas" demo](/docs/demos/math/pandas) uses V8 with Python.

[^1]: See ["Initialize Hermes"](/docs/demos/engines/hermes#initialize-hermes) in the Hermes demo.
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`write` in "Writing Files"](/docs/api/write-options)
