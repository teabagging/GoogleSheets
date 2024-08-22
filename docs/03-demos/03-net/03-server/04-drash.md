---
title: Sheets in Drash
sidebar_label: Drash
pagination_prev: demos/net/network/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Drash](https://drash.land/drash/) is a Deno server-side framework. The body
parser works in memory and can handle file uploads on hosted services.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Drash and SheetJS to read and write data. We'll explore how to
parse uploaded files in a POST request handler and respond to GET requests with
downloadable spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete server.

:::note Tested Deployments

This demo was last tested on 2024 March 11 against Drash 2.8.1 and Deno 1.41.2.

:::

## Integration Details

The [SheetJS Deno module](/docs/getting-started/installation/deno) can be
imported from Drash server scripts.

### Reading Data

`Request#bodyParam` reads body parameters. For uploaded files, the `content`
property is a `Uint8Array` which can be parsed with the SheetJS `read` method[^1].

This example server responds to POST requests. The server will look for a file
in the request body under the `"upload"` key. If a file is present, the server
will parse the file, generate an HTML table using the `sheet_to_html` method[^2]
and respond with the HTML code:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import { read, utils } from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
import * as Drash from "https://cdn.jsdelivr.net/gh/drashland/drash@v2.8.1/mod.ts";
\n\
class ParseResource extends Drash.Resource {
  public paths = ["/"];
\n\
  public POST(request: Drash.Request, response: Drash.Response) {
    // assume a form upload like <input type="file" id="upload" name="upload">
    // highlight-next-line
    const file = request.bodyParam<Drash.Types.BodyFile>("upload");
    if (!file) throw new Error("File is required!");
\n\
    // read file
    // highlight-next-line
    var wb = read(file.content);
\n\
    // respond with HTML from first worksheet
    var ws = wb.Sheets[wb.SheetNames[0]];
    var html = utils.sheet_to_html(html)
    return response.html(html);
  }
}`}
</CodeBlock>

### Writing Data

Headers are manually set with `Response#headers.set` while the raw body is set
with `Response#send`. The raw body can be `Uint8Array` or `ArrayBuffer` objects.

Given a SheetJS workbook object, the `write` method using `type: "buffer"`[^3]
generates data objects compatible with Drash.

This example server responds to GET requests. The server will generate a SheetJS
worksheet object from an array of arrays[^4], build up a new workbook using the
`book_new`[^5] and `book_append_sheet`[^6] utility methods, generate a XLSX file
using `write`, and send the file with appropriate headers to initiate a download
with file name `"SheetJSDrash.xlsx"`:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import { utils, write } from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
\n\
import * as Drash from "https://cdn.jsdelivr.net/gh/drashland/drash@v2.8.1/mod.ts";
\n\
class WriteResource extends Drash.Resource {
  public paths = ["/export"];
\n\
  public GET(request: Drash.Request, response: Drash.Response): void {
    // create some fixed workbook
    const data = ["SheetJS".split(""), [5,4,3,3,7,9,5]];
    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new(); utils.book_append_sheet(wb, ws, "data");
  \n\
    // write the workbook to XLSX as a Uint8Array
    // highlight-next-line
    const file = write(wb, { bookType: "xlsx", type: "buffer"});
    // set headers
    response.headers.set("Content-Disposition", 'attachment; filename="SheetJSDrash.xlsx"');
    // send data
    // highlight-next-line
    return response.send("application/vnd.ms-excel", file);
  }
}`}
</CodeBlock>

## Complete Example

1) Download [`SheetJSDrash.ts`](pathname:///drash/SheetJSDrash.ts):

```bash
curl -LO https://docs.sheetjs.com/drash/SheetJSDrash.ts
```

2) Run the server:

```bash
deno run --allow-net SheetJSDrash.ts
```

3) Download the test file https://docs.sheetjs.com/pres.numbers

4) Open `http://localhost:7262/` in your browser.

Click "Choose File" and select `pres.numbers`.  Then click "Submit"

The page should show the contents of the file as an HTML table.

5) Open `http://localhost:7262/export` in your browser.

The page should attempt to download `SheetJSDrash.xlsx` . Open the new file.

[^1]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^2]: See [`sheet_to_html` in "Utilities"](/docs/api/utilities/html#html-table-output)
[^3]: See [`write` in "Writing Files"](/docs/api/write-options)
[^4]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^5]: See [`book_new` in "Utilities"](/docs/api/utilities/wb)
[^6]: See [`book_append_sheet` in "Utilities"](/docs/api/utilities/wb)
