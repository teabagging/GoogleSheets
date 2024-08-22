---
title: Sheets on Fire with HonoJS
sidebar_label: HonoJS
pagination_prev: demos/net/network/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[HonoJS](https://hono.dev/) is a lightweight server-side framework.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses HonoJS and SheetJS to read and write data. We'll explore how to
parse uploaded files in a POST request handler and respond to GET requests with
downloadable spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete server.

:::note Tested Deployments

This demo was last tested in the following deployments:

| Platform       | HonoJS  | Date       |
|:---------------|:--------|:-----------|
| BunJS `1.1.21` | `4.5.1` | 2024-07-27 |

:::

## Integration Details

The [SheetJS BunJS module](/docs/getting-started/installation/bun) can be
imported from HonoJS server scripts.

### Reading Data

The HonoJS body parser[^1] processes files in POST requests. The body parser
returns an object that can be indexed by field name:

```js
/* /import route */
app.post('/import', async(c) => {
  /* parse body */
  const body = await c.req.parseBody();
  /* get a file uploaded in the `upload` field */
  // highlight-next-line
  const file = body["upload"];

  /* `file` is a `File` object */
  // ...
});
```

:::caution pass

By default, the HonoJS body parser will use the last value when the form body
specifies multiple values for a given field. To force the body parser to process
all files, the field name must end with `[]`:

```js
  /* parse body */
  const body = await c.req.parseBody();
  /* get all files uploaded in the `upload` field */
  // highlight-next-line
  const files = body["upload[]"];
```

:::

HonoJS exposes each file as a `Blob` object. The `Blob#arrayBuffer` method
returns a Promise that resolves to an `ArrayBuffer`. That `ArrayBuffer` can be
parsed with the SheetJS `read` method[^2].

This example server responds to POST requests. The server will look for a file
in the request body under the `"upload"` key. If a file is present, the server
will parse the file and, generate CSV rows using the `sheet_to_csv` method[^3],
and respond with text:

```js
import { Hono } from 'hono';
import { read, utils } from 'xlsx';

const app = new Hono();
app.post('/import', async(c) => {
  /* get file data */
  const body = await c.req.parseBody();
  const file = body["upload"];
  const ab = await file.arrayBuffer();
  /* parse */
  const wb = read(ab);
  /* generate CSV */
  const csv = utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
  return c.text(csv);
});
export default app;
```

### Writing Data

Given a SheetJS workbook object, the `write` method using `type: "buffer"`[^4]
generates data objects which can be passed to the response `body` method.

This example server responds to GET requests. The server will generate a SheetJS
worksheet object from an array of arrays[^5], build up a new workbook using the
`book_new`[^6] utility method, generate a XLSX file using `write`, and send the
file with appropriate headers to download `SheetJSHonoJS.xlsx`:

```js
import { Hono } from 'hono';
import { utils, write } from "xlsx";

const app = new Hono();
app.get("/export", (c) => {
  /* generate SheetJS workbook object */
  var ws = utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
  var wb = utils.book_new(ws, "Data");
  /* generate buffer */
  var buf = write(wb, {type: "buffer", bookType: "xlsx"});
  /* set headers */
  c.header('Content-Disposition', 'attachment; filename="SheetJSHonoJS.xlsx"');
  c.header('Content-Type', 'application/vnd.ms-excel');
  /* export buffer */
  return c.body(buf);
});
export default app;
```

## Complete Example

This example creates a simple server that stores an array of arrays. There are
three server endpoints:

- `/import` POST request expects a file in the `upload` field. It will parse the
file, update the internal array of arrays, and responds with CSV data.

- `/export` GET request generates a workbook from the internal array of arrays.
It will respond with XLSX data and initiate a download to `SheetJSHonoJS.xlsx` .

- `/json` GET request responds with the internal state.

1) Create a new BunJS + HonoJS project:

```bash
bun create hono sheetjs-hono --template bun --install --pm bun
cd sheetjs-hono
```

2) Install the [SheetJS BunJS module](/docs/getting-started/installation/bun):

<CodeBlock language="bash">{`\
bun i xlsx@https://sheet.lol/balls/xlsx-${current}.tgz`}
</CodeBlock>

3) Save the following script to `src/index.ts`:

```ts title="src/index.ts"
import { Hono } from 'hono';
import { read, write, utils } from 'xlsx';

const app = new Hono();
let data = ["SheetJS".split(""), [5,4,3,3,7,9,5]];

app.get('/export', (c) => {
  const ws = utils.aoa_to_sheet(data);
  const wb = utils.book_new(ws, "SheetJSHono");
  const buf = write(wb, { type: "buffer", bookType: "xlsx" });
  c.header('Content-Disposition', 'attachment; filename="SheetJSHonoJS.xlsx"');
  c.header('Content-Type', 'application/vnd.ms-excel');
  return c.body(buf);
});

app.post('/import', async(c) => {
  const body = await c.req.parseBody();
  const file = body["upload"];
  const ab = await file.arrayBuffer();
  const wb = read(ab);
  data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header:1 });
  return c.text(utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
});

app.get('/json', (c) => c.json(data));
export default app;
```

4) Run the server:

```bash
bun run dev
```

The process will display a URL (typically `http://localhost:3000`):

```text
% bun run dev
$ bun run --hot src/index.ts
// highlight-next-line
Started server http://localhost:3000
```

5) Test exports by opening `http://localhost:3000/export` in your browser.

The page should attempt to download `SheetJSHonoJS.xlsx` . Save the download and
open the new file. The contents should match the original data:

<table>
  <tr><td>S</td><td>h</td><td>e</td><td>e</td><td>t</td><td>J</td><td>S</td></tr>
  <tr><td>5</td><td>4</td><td>3</td><td>3</td><td>7</td><td>9</td><td>5</td></tr>
</table>

6) Test imports using https://docs.sheetjs.com/pres.numbers . The commands
should be run in a new terminal window:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F upload=@pres.numbers http://localhost:3000/import
```

The terminal will display CSV rows generated from the first worksheet:

```text title="Expected output"
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46
```

7) Confirm the state was updated by loading `http://localhost:3000/json` :

```bash
curl -LO http://localhost:3000/json
```

The terminal will display the worksheet data in an array of arrays:

```json title="Expected output"
[["Name","Index"],["Bill Clinton",42],["GeorgeW Bush",43],["Barack Obama",44],["Donald Trump",45],["Joseph Biden",46]]
```

[^1]: See ["parseBody()"](https://hono.dev/docs/api/request#parsebody) in the HonoJS documentation.
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`sheet_to_csv` in "Utilities"](/docs/api/utilities/csv#delimiter-separated-output)
[^4]: See [`write` in "Writing Files"](/docs/api/write-options)
[^5]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^6]: See [`book_new` in "Utilities"](/docs/api/utilities/wb)
