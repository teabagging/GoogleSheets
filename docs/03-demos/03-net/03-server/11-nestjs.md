---
title: Sheets in NestJS
sidebar_label: NestJS
pagination_prev: demos/net/network/index
pagination_next: demos/net/email/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[NestJS](https://nestjs.com/) is a NodeJS framework for building server-side
applications.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses NestJS and SheetJS to read and write data. We'll explore how to
parse uploaded files in a POST request handler and respond to GET requests with
downloadable spreadsheets.

The ["Complete Example"](#complete-example) section includes a complete server.

:::note Tested Deployments

This demo was tested on 2024 March 11 using NestJS `10.3.3`.

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
imported from NestJS controller scripts.

:::caution pass

NestJS does not follow the conventional NodeJS server code structure.

It is strongly recommended to review the official documentation. The official
documentation covers Controller structure and various JS Decorators.

:::

### Exporting Data to Workbooks (GET)

The SheetJS `write` method[^1] with the option `type: "buffer"` generates NodeJS
Buffer objects containing the raw file data.

NestJS strongly recommends wrapping the Buffer in a `StreamableFile` object[^2].

The exported filename can be specified in a `@Header` decorator[^3]

The following demo NestJS Controller will respond to GET requests to `/download`
with a XLSX spreadsheet. In this example, the SheetJS `aoa_to_sheet` method[^4]
generates a sheet object and the `book_new` and `book_append_sheet` helpers[^5]
build the workbook object.

```ts title="src/sheetjs/sheetjs.controller.js"
import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { utils, write } from 'xlsx';

@Controller('sheetjs')
export class SheetjsController {
  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="SheetJSNest.xlsx"')
  async downloadXlsxFile(): Promise<StreamableFile> {
    var ws = utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
    var wb = utils.book_new(); utils.book_append_sheet(wb, ws, "Data");
    // highlight-start
    /* generate buffer */
    var buf = write(wb, {type: "buffer", bookType: "xlsx"});
    /* Return a streamable file */
    return new StreamableFile(buf);
    // highlight-end
  }
}
```

### Parsing Uploaded Files (POST)

:::note pass

[The NestJS documentation](https://docs.nestjs.com/techniques/file-upload) has
detailed instructions for file upload support.

:::

As explained in the NestJS documentation, in a POST request handler, the
`FileInterceptor` interceptor and `UploadedFile` decorator are used in tandem to
expose a file uploaded with a specified key.

The file object has a `buffer` property which represents the raw bytes. The
SheetJS `read` method[^6] can parse the Buffer into a workbook object[^7].

The following demo NestJS Controller will respond to POST requests to `/upload`.
Assuming the `upload` field of the form data is the file, the SheetJS `read`
method will parse the file. CSV rows are generated from the first worksheet
using the SheetJS `sheet_to_csv` method[^8].

```ts title="src/sheetjs/sheetjs.controller.js"
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { read, utils } from 'xlsx';

@Controller('sheetjs')
export class SheetjsController {
  @Post('upload') //  <input type="file" id="upload" name="upload">
  @UseInterceptors(FileInterceptor('upload'))
  async uploadXlsxFile(@UploadedFile() file: Express.Multer.File) {
    /* file.buffer is a Buffer */
    // highlight-next-line
    const wb = read(file.buffer);
    /* generate CSV of first worksheet */
    return utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
  }
}
```

## Complete Example

1) Create a new NestJS project:

```bash
npx @nestjs/cli@latest new -p npm sheetjs-nest
cd sheetjs-nest
```

2) Install the `@types/multer` package as a development dependency:

```bash
npm i --save-dev @types/multer
```

3) Install the SheetJS library:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

4) Make a folder for uploaded files:

```bash
mkdir -p upload
```

5) Create a new controller:

```bash
npx @nestjs/cli generate controller sheetjs
```

6) Replace `src/sheetjs/sheetjs.controller.ts` with the following code block:

```ts title="src/sheetjs/sheetjs.controller.ts"
import { Controller, Get, Header, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { read, utils, write } from 'xlsx';

@Controller('sheetjs')
export class SheetjsController {
  @Post('upload') //  <input type="file" id="upload" name="upload">
  @UseInterceptors(FileInterceptor('upload'))
  async uploadXlsxFile(@UploadedFile() file: Express.Multer.File) {
    /* file.path is a path to the workbook */
    const wb = read(file.buffer);
    /* generate CSV of first worksheet */
    return utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]);
  }

  @Get('download')
  @Header('Content-Disposition', 'attachment; filename="SheetJSNest.xlsx"')
  async downloadXlsxFile(): Promise<StreamableFile> {
    var ws = utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
    var wb = utils.book_new(); utils.book_append_sheet(wb, ws, "Data");
    /* generate buffer */
    var buf = write(wb, {type: "buffer", bookType: "xlsx"});
    /* Return a streamable file */
    return new StreamableFile(buf);
  }
}
```

7) Start the server with

```bash
npx @nestjs/cli start
```

:::note pass

In the most recent test, the process failed with a message referencing Multer:

```
src/sheetjs/sheetjs.controller.ts:9:54 - error TS2694: Namespace 'global.Express' has no exported member 'Multer'.

9   async uploadXlsxFile(@UploadedFile() file: Express.Multer.File) {
                                                       ~~~~~~
```

This error indicates that `@types/multer` is not available.

**This is a bug in the `npm` client**

The recommended fix is to install `@types/multer` again:

```bash
npm i --save-dev @types/multer
npx @nestjs/cli start
```

:::

8) Test POST requests using https://docs.sheetjs.com/pres.numbers . The commands
should be run in a new terminal window:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F upload=@pres.numbers http://localhost:3000/sheetjs/upload
```

The response should show the data in CSV rows.

9) Test GET requests by opening `http://localhost:3000/sheetjs/download` in a
web browser.

The browser should attempt to download `SheetJSNest.xlsx`. Save the file and
open in a spreadsheet editor.

[^1]: See [`write` in "Writing Files"](/docs/api/write-options)
[^2]: See ["Streaming files"](https://docs.nestjs.com/techniques/streaming-files) in the NestJS documentation.
[^3]: See ["Headers"](https://docs.nestjs.com/controllers#headers) in the NestJS documentation.
[^4]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^5]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^6]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^7]: See ["Workbook Object"](/docs/csf/book)
[^8]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)