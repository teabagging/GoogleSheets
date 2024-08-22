---
title: Sheets in Elysia
sidebar_label: ElysiaJS
pagination_prev: demos/net/network/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Elysia](https://elysiajs.com/) is a BunJS server-side framework.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses ElysiaJS and SheetJS to read and write data. We'll explore how to
parse uploaded files in a POST request handler and respond to GET requests with
downloadable spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete server.

:::note Tested Deployments

This demo was last tested on 2024 March 11 with ElysiaJS 0.8.17 and BunJS 1.0.30.

:::

## Integration Details

The [SheetJS BunJS module](/docs/getting-started/installation/bun) can be
imported from ElysiaJS server scripts.

### Reading Data

The ElysiaJS body parser accepts a schema[^1]. The `t.File` method marks that a
field is expected to be a file.

The following schema indicates the field `upload` should be a submitted file:

```js
{
  body: t.Object({
    upload: t.File()
  })
}
```

ElysiaJS exposes the file as a `Blob` object. The `Blob#arrayBuffer` method
returns a Promise that resolves to an `ArrayBuffer`. That `ArrayBuffer` can be
parsed with the SheetJS `read` method[^2].

This example server responds to POST requests. The server will look for a file
in the request body under the `"upload"` key. If a file is present, the server
will parse the file, generate an HTML table using the `sheet_to_html` method[^3]
and respond with the HTML code:

```js
import { Elysia, t } from "elysia";
import { read, utils } from "xlsx";

const app = new Elysia();
app.post("/", async({ body: { upload } }) => {
  // highlight-start
  const data = await upload.arrayBuffer();
  const wb = read(data);
  // highlight-end
  return utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
}, {
  body: t.Object({
    // highlight-next-line
    upload: t.File()
  })
});
app.listen(3000);
```

### Writing Data

Given a SheetJS workbook object, the `write` method using `type: "buffer"`[^4]
generates data objects which can be passed to the BunJS `File` constructor. The
`File` constructor accepts a second parameter for the generated file name.

This example server responds to GET requests. The server will generate a SheetJS
worksheet object from an array of arrays[^5], build up a new workbook using the
`book_new`[^6] and `book_append_sheet`[^7] utility methods, generate a XLSX file
using `write`, and send the file with appropriate headers to initiate a download
with file name `SheetJSElysia.xlsx`:

```js
import { Elysia } from "elysia";
import { utils, write } from "xlsx";

const app = new Elysia();
app.get("/", () => {
  var ws = utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
  var wb = utils.book_new(); utils.book_append_sheet(wb, ws, "Data");
  // highlight-start
  /* generate buffer */
  var buf = write(wb, {type: "buffer", bookType: "xlsx"});
  return new File([buf], "SheetJSElysia.xlsx");
  // highlight-end
});
app.listen(3000);
```

## Complete Example

1) Create a new ElysiaJS project:

```bash
bun create elysia sheetjs-elysia
cd sheetjs-elysia
```

2) Install the [SheetJS BunJS module](/docs/getting-started/installation/bun):

<CodeBlock language="bash">{`\
bun install https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

3) Save the following script to `src/SheetJSElysia.ts`:

```ts title="src/SheetJSElysia.ts"
import { Elysia, t } from "elysia";
import { read, utils, write } from "xlsx";

const app = new Elysia();
app.get("/", () => {
  var ws = utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
  var wb = utils.book_new(); utils.book_append_sheet(wb, ws, "Data");
  /* generate buffer */
  var buf = write(wb, {type: "buffer", bookType: "xlsx"});
  return new File([buf], "SheetJSElysia.xlsx");
  /* set headers */
});
app.post("/", async({ body: { upload } }) => {
  const data = await upload.arrayBuffer();
  const wb = read(data);
  return utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
}, {
  body: t.Object({
    upload: t.File()
  })
});
app.listen(3000);
```

4) Run the server:

```bash
bun run src/SheetJSElysia.ts
```

5) Test POST requests using https://docs.sheetjs.com/pres.numbers . The commands
should be run in a new terminal window:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F upload=@pres.numbers http://localhost:3000/
```

6) Test GET requests by opening `http://localhost:3000/` in your browser.

The page should attempt to download `SheetJSElysia.xlsx` . Open the new file.

[^1]: See ["Explicit Body"](https://elysiajs.com/concept/explicit-body.html) in the ElysiaJS documentation.
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See [`sheet_to_html` in "Utilities"](/docs/api/utilities/html#html-table-output)
[^4]: See [`write` in "Writing Files"](/docs/api/write-options)
[^5]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^6]: See [`book_new` in "Utilities"](/docs/api/utilities/wb)
[^7]: See [`book_append_sheet` in "Utilities"](/docs/api/utilities/wb)
