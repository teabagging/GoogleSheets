---
title: HTTP Server Processing
pagination_prev: demos/net/upload/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Server-Side JS platforms like NodeJS and Deno have built-in APIs for listening
on network interfaces.  They provide wrappers for requests and responses.

:::info pass

This demo focuses on HTTP servers. Other demos cover other HTTP use cases:

- ["HTTP Downloads"](/docs/demos/net/network) covers downloading files
- ["HTTP Uploads"](/docs/demos/net/upload) covers uploading files

:::

## Overview

#### Parsing Files in POST Requests

Typically servers receive form data with content type `multipart/form-data` or
`application/x-www-form-urlencoded`. The platforms themselves typically do not
provide "body parsing" functions, instead leaning on the community to supply
modules to take the encoded data and split into form fields and files.

NodeJS servers typically use a parser like `formidable`. In the example below,
`formidable` will write to file and `XLSX.readFile` will read the file:

```js
var XLSX = require("xlsx"); // This is using the CommonJS build
var formidable = require("formidable");

require("http").createServer(function(req, res) {
  if(req.method !== "POST") return res.end("");

  /* parse body and implement logic in callback */
  // highlight-next-line
  (new formidable.IncomingForm()).parse(req, function(err, fields, files) {
    /* if successful, files is an object whose keys are param names */
    // highlight-next-line
    var file = files["upload"]; // <input type="file" id="upload" name="upload">
    /* file.path is a location in the filesystem, usually in a temp folder */
    // highlight-next-line
    var wb = XLSX.readFile(file.filepath);
    // print the first worksheet back as a CSV
    res.end(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
  });
}).listen(process.env.PORT || 3000);
```

`XLSX.read` will accept NodeJS buffers as well as `Uint8Array`, Base64 strings,
binary strings, and plain Arrays of bytes.  This covers the interface types of
a wide variety of frameworks.

#### Writing Files in GET Requests

Typically server libraries use a response API that accepts `Uint8Array` data.
`XLSX.write` with the option `type: "buffer"` will generate data.  To force the
response to be treated as an attachment, set the `Content-Disposition` header:

```js
var XLSX = require("xlsx"); // This is using the CommonJS build

require("http").createServer(function(req, res) {
  if(req.method !== "GET") return res.end("");
  var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", {type: "binary"});
  // highlight-start
  res.setHeader('Content-Disposition', 'attachment; filename="SheetJS.xlsx"');
  res.end(XLSX.write(wb, {type:"buffer", bookType: "xlsx"}));
  // highlight-end
}).listen(process.env.PORT || 3000);
```

## NodeJS

When processing small files, the work is best handled in the server response
handler function.  This approach is used in the "Framework Demos" section.

When processing large files, the direct approach will freeze the server. NodeJS
provides ["Worker Threads"](#worker-threads) for this exact use case.

### Framework Demos

#### Express

**[The exposition has been moved to a separate page.](/docs/demos/net/server/express)**

#### NestJS

**[The exposition has been moved to a separate page.](/docs/demos/net/server/nestjs)**

#### Fastify

**[The exposition has been moved to a separate page.](/docs/demos/net/server/fastify)**

### Worker Threads

NodeJS "Worker Threads" were introduced in v14 and eventually marked as stable
in v16. Coupled with `AsyncResource`, a simple thread pool enables processing
without blocking the server! The official NodeJS docs include a sample worker
pool implementation.

This example uses ExpressJS to create a general XLSX conversion service, but
the same approach applies to any NodeJS server side framework.

When reading large files, it is strongly recommended to run the body parser in
the main server process. Body parsers like `formidable` will write uploaded
files to the filesystem, and the file path should be passed to the worker (and
the worker would be responsible for reading and cleaning up the files).

:::note pass

The `child_process` module can also spawn [command-line tools](/docs/demos/cli).
That approach is not explored in this demo.

:::

<details>
  <summary><b>Complete Example</b> (click to show)</summary>

:::note Tested Deployments

This demo was tested in the following environments:

| NodeJS    | Date       | Dependencies                        |
|:----------|:-----------|:------------------------------------|
| `18.20.3` | 2024-06-30 | ExpressJS 4.19.2 + Formidable 2.1.2 |
| `20.15.0` | 2024-06-30 | ExpressJS 4.19.2 + Formidable 2.1.2 |
| `22.3.0`  | 2024-06-30 | ExpressJS 4.19.2 + Formidable 2.1.2 |

:::

0) Create a new project with a ESM-enabled `package.json`:

```bash
mkdir sheetjs-worker
cd sheetjs-worker
echo '{ "type": "module" }' > package.json
```

1) Install the dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz express@4.19.2 formidable@2.1.2`}
</CodeBlock>

2) Create a worker script `worker.js` that listens for messages. When a message
is received, it will read the file from the filesystem, generate and pass back a
new XLSX file, and delete the original file:

```js title="worker.js"
/* load the worker_threads module */
import { parentPort } from 'node:worker_threads';

/* load the SheetJS module and hook to FS */
import { set_fs, readFile, write } from 'xlsx';
import * as fs from 'fs';
set_fs(fs);

/* the server will send a message with the `path` field */
parentPort.on('message', (task) => {
  /* highlight-start */
  // read file
  const wb = readFile(task.path, { dense: true });
  // send back XLSX
  parentPort.postMessage(write(wb, { type: "buffer", bookType: "xlsx" }));
  /* highlight-end */
  // remove file
  fs.unlink(task.path, ()=>{});
});
```

3) Download [`worker_pool.js`](pathname:///server/worker_pool.js):

```bash
curl -LO https://docs.sheetjs.com/server/worker_pool.js
```

(this is a slightly modified version of the example in the NodeJS docs)

4) Save the following server code to `main.mjs`:

```js title="main.mjs"
/* load dependencies */
import os from 'node:os';
import process from 'node:process'
import express from 'express';
import formidable from 'formidable';

/* load worker pool */
import WorkerPool from './worker_pool.js';

const pool = new WorkerPool(os.cpus().length);
process.on("beforeExit", () => { pool.close(); })

/* create server */
const app = express();
app.post('/', (req, res, next) => {
  // parse body
  const form = formidable({});
  form.parse(req, (err, fields, files) => {
    // look for "upload" field
    if(err) return next(err);
    if(!files["upload"]) return next(new Error("missing `upload` file"));

    // send a message to the worker with the path to the uploaded file
    // highlight-next-line
    pool.runTask({ path: files["upload"].filepath }, (err, result) => {
      if(err) return next(err);
      // send the file back as an attachment
      res.attachment("SheetJSPool.xlsx");
      res.status(200).end(result);
    });
  });
});

// start server
app.listen(7262, () => { console.log(`Example app listening on port 7262`); });
```

5) Run the server:

```bash
node main.mjs
```

Keep the server process running during the test.

6) Test with the [`pres.numbers` sample file](https://docs.sheetjs.com/pres.numbers).
The following commands should be run in a new terminal window:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F upload=@pres.numbers http://localhost:7262/ -J -O
```

This will generate `SheetJSPool.xlsx`.

</details>

## Other Platforms

### Bun

Bun provides the basic elements to implement a web server.

#### ElysiaJS

**[The exposition has been moved to a separate page.](/docs/demos/net/server/elysia)**

### Deno

:::caution pass

Many hosted services, including [Deno Deploy](/docs/demos/cloud/deno#demo), do
not offer filesystem access from scripts.

This breaks web frameworks that use the filesystem in body parsing.

:::

Deno provides the basic elements to implement a web server.  It does not provide
a body parser out of the box.

#### Drash

In testing, [Drash](https://drash.land/drash/) had an in-memory body parser
which could handle file uploads on [Deno Deploy](/docs/demos/cloud/deno#demo).

**[The exposition has been moved to a separate page.](/docs/demos/net/server/drash)**
