---
title: Sheets in FastifyJS
sidebar_label: FastifyJS
pagination_prev: demos/net/network/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[FastifyJS](https://openjsf.org/projects/) is a NodeJS web framework.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses FastifyJS and SheetJS to read and write data. We'll explore how
to parse uploaded files in a POST request handler and respond to GET requests
with downloadable spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete server.

:::note Tested Deployments

This demo was verified on 2024 March 11 using `fastify@4.26.2`

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
imported from scripts that use FastifyJS.

### Exporting Data to Workbooks (GET)

The SheetJS `write` method[^1] with the option `type: "buffer"` generates NodeJS
Buffer objects containing the raw file data.

FastifyJS can directly handle `Buffer` data in `Response#end`

The exported filename can be specified using the `Content-Disposition` header.

The following demo FastifyJS server will respond to GET requests to `/download`
with a XLSX spreadsheet. In this example, the SheetJS `aoa_to_sheet` method[^2]
generates a sheet object and the `book_new` and `book_append_sheet` helpers[^3]
build the workbook object.

```js
/* GET / returns a workbook */
fastify.get('/', (req, reply) => {
  /* make a workbook */
  var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", {type: "binary"});

  /* write to Buffer */
  const buf = XLSX.write(wb, {type:"buffer", bookType: "xlsx"});

  /* set Content-Disposition header and send data */
  // highlight-next-line
  reply.header('Content-Disposition', 'attachment; filename="SheetJSFastify.xlsx"').send(buf);
});
```

### Parsing Uploaded Files (POST)

`@fastify/multipart`, which uses `busbuy` under the hood, must be registered:

```js
/* load SheetJS Library */
const XLSX = require("xlsx");
/* load fastify and enable body parsing */
const fastify = require('fastify')({logger: true});
// highlight-next-line
fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true });
```

Once registered with the option `attachFieldsToBody`, route handlers can use
`req.body` directly.

Each file object in the body has a `toBuffer` method that resolves to a Buffer
object. The SheetJS `read` method[^4] can read the Buffer and generate a
workbook object[^5].

The following demo FastifyJS server will respond to POST requests to `/upload`.
Assuming the `upload` field of the form data is the file, the SheetJS `read`
method will parse the file. CSV rows are generated from the first worksheet
using the SheetJS `sheet_to_csv` method[^6].

```js
/* POST / reads submitted file and exports to requested format */
fastify.post('/', async(req, reply) => {
  /* "file" is the name of the field in the HTML form*/
  const file = req.body.upload;
  /* toBuffer returns a promise that resolves to a Buffer */
  // highlight-next-line
  const buf = await file.toBuffer();
  /* `XLSX.read` can read the Buffer */
  const wb = XLSX.read(buf);
  /* reply with a CSV */
  reply.send(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
});
```

:::caution pass

Out of the box, Fastify will return an error `FST_ERR_CTP_BODY_TOO_LARGE` when
processing large spreadsheets (`statusCode 413`).  This is a Fastify issue.

The default body size limit (including all uploaded files and fields) is 1 MB.
It can be increased by setting the `bodyLimit` option during server creation:

```js
/* increase request body size limit to 5MB = 5 * 1024 * 1024 bytes */
const fastify = require('fastify')({bodyLimit: 5 * 1024 * 1024});
```

:::

## Complete Example

0) Save the following snippet to `SheetJSFastify.js`:

```js title="SheetJSFastify.js"
/* load SheetJS Library */
const XLSX = require("xlsx");
/* load fastify and enable body parsing */
const fastify = require('fastify')({logger: true});
fastify.register(require('@fastify/multipart'), { attachFieldsToBody: true });

/* GET / returns a workbook */
fastify.get('/', (req, reply) => {
  /* make a workbook */
  var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", {type: "binary"});

  /* write to Buffer */
  const buf = XLSX.write(wb, {type:"buffer", bookType: "xlsx"});

  /* set Content-Disposition header and send data */
  reply.header('Content-Disposition', 'attachment; filename="SheetJSFastify.xlsx"').send(buf);
});

/* POST / reads submitted file and exports to requested format */
fastify.post('/', async(req, reply) => {

  /* "file" is the name of the field in the HTML form*/
  const file = req.body.upload;

  /* toBuffer returns a promise that resolves to a Buffer */
  const wb = XLSX.read(await file.toBuffer());

  /* send back a CSV */
  reply.send(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
});

/* start */
fastify.listen({port: process.env.PORT || 3000}, (err, addr) => { if(err) throw err; });
```

1) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz fastify@4.26.2 @fastify/multipart@8.1.0`}
</CodeBlock>

2) Start server

```bash
node SheetJSFastify.js
```

3) Test POST requests using https://docs.sheetjs.com/pres.numbers . The commands
should be run in a new terminal window:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F upload=@pres.numbers http://localhost:3000/
```

The response should show the data in CSV rows.

4) Test GET requests by opening `http://localhost:3000/` in your browser.

It should prompt to download `SheetJSFastify.xlsx`

[^1]: See [`write` in "Writing Files"](/docs/api/write-options)
[^2]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^3]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^4]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^5]: See ["Workbook Object"](/docs/csf/book)
[^6]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)