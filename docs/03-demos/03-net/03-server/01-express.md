---
title: Sheets in ExpressJS
sidebar_label: ExpressJS
pagination_prev: demos/net/network/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[ExpressJS](https://expressjs.com/) is a lightweight NodeJS framework for
building server-side applications.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses ExpressJS and SheetJS to read and write data. We'll explore how
to parse uploaded files in a POST request handler and respond to GET requests
with downloadable spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete server.

:::note Tested Deployments

This demo was tested on 2024 March 11 using `express-formidable@1.2.0` and
ExpressJS `4.18.3`

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
imported from scripts that use ExpressJS.

### Exporting Data to Workbooks (GET)

The SheetJS `write` method[^1] with the option `type: "buffer"` generates NodeJS
Buffer objects containing the raw file data.

ExpressJS can directly handle `Buffer` data in `Response#end`[^2].

The exported filename can be specified using `Response#attachment`[^3].

The following demo ExpressJS server will respond to GET requests to `/download`
with a XLSX spreadsheet. In this example, the SheetJS `aoa_to_sheet` method[^4]
generates a sheet object and the `book_new` and `book_append_sheet` helpers[^5]
build the workbook object.

```js
var XLSX = require('xlsx'), express = require('express');

/* create app */
var app = express();

app.get('/download', function(req, res) {
  /* generate workbook object */
  var ws = XLSX.utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
  var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Data");
  // highlight-start
  /* generate buffer */
  var buf = XLSX.write(wb, {type: "buffer", bookType: "xlsx"});
  /* set headers */
  res.attachment("SheetJSExpress.xlsx");
  /* respond with file data */
  res.status(200).end(buf);
  // highlight-end
});
app.listen(+process.env.PORT||3000);
```

### Parsing Uploaded Files (POST)

The `express-formidable` middleware is powered by the `formidable` parser.  It
adds a `files` object to the request.

Each value in the `files` object has a `path` property which represents the path
to the file in the filesystem. The SheetJS `readFile` method[^6] can read the
file and generate a workbook object[^7].

The following demo ExpressJS server will respond to POST requests to `/upload`.
Assuming the `upload` field of the form data is the file, the SheetJS `read`
method will parse the file. CSV rows are generated from the first worksheet
using the SheetJS `sheet_to_csv` method[^8].

```js
var XLSX = require('xlsx'), express = require('express');

/* create app */
var app = express();
/* add express-formidable middleware */
// highlight-next-line
app.use(require('express-formidable')());
/* route for handling uploaded data */
app.post('/upload', function(req, res) {
  // highlight-start
  var f = req.files["upload"]; // <input type="file" id="upload" name="upload">
  var wb = XLSX.readFile(f.path);
  // highlight-end
  /* respond with CSV data from the first sheet */
  res.status(200).end(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
});
app.listen(+process.env.PORT||3000);
```

## Complete Example

1) Save the code sample to `SheetJSExpressCSV.js`:

```js title="SheetJSExpressCSV.js"
var XLSX = require('xlsx'), express = require('express');

/* create app */
var app = express();
/* add express-formidable middleware */
// highlight-next-line
app.use(require('express-formidable')());
/* route for handling uploaded data */
app.post('/upload', function(req, res) {
  // highlight-start
  var f = req.files["upload"]; // <input type="file" id="upload" name="upload">
  var wb = XLSX.readFile(f.path);
  // highlight-end
  /* respond with CSV data from the first sheet */
  res.status(200).end(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
});
app.get('/download', function(req, res) {
  /* generate workbook object */
  var ws = XLSX.utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
  var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Data");
  // highlight-start
  /* generate buffer */
  var buf = XLSX.write(wb, {type: "buffer", bookType: "xlsx"});
  /* set headers */
  res.attachment("SheetJSExpress.xlsx");
  /* respond with file data */
  res.status(200).end(buf);
  // highlight-end
});
app.listen(+process.env.PORT||3000);
```

2) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz express@4.18.3 express-formidable@1.2.0`}
</CodeBlock>

3) Start server (note: it will not print anything to console when running)

```bash
node SheetJSExpressCSV.js
```

4) Test POST requests using https://docs.sheetjs.com/pres.numbers . The commands
should be run in a new terminal window:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F upload=@pres.numbers http://localhost:3000/upload
```

The response should show the data in CSV rows.

5) Test GET requests by opening `http://localhost:3000/download` in your browser.

It should prompt to download `SheetJSExpress.xlsx`

[^1]: See [`write` in "Writing Files"](/docs/api/write-options)
[^2]: See [`res.end`](https://expressjs.com/en/4x/api.html#res.end) in the ExpressJS documentation.
[^3]: See [`res.attachment`](https://expressjs.com/en/4x/api.html#res.attachment) in the ExpressJS documentation.
[^4]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^5]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^6]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^7]: See ["Workbook Object"](/docs/csf/book)
[^8]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)