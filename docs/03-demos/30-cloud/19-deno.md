---
title: Sheets with Deno Deploy
sidebar_label: Deno Deploy
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Deno Deploy](https://dash.deno.com/) offers distributed "Serverless Functions"
powered by Deno.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo covers integration details. We'll explore how to load and use SheetJS
scripts in Deno Deploy functions.

The ["Demo"](#demo) section builds a sample service that converts XLSX and other
types of spreadsheets to HTML tables and CSV rows.

:::caution pass

When the demo was last tested, Deno Deploy required a GitHub account.

:::

:::note Tested Deployments

This demo was last tested by SheetJS users on 2024 May 26.

:::

## Integration Details

The [SheetJS Deno module](/docs/getting-started/installation/deno) can be
imported from Deno Deploy server scripts.

### Supported Frameworks

:::danger pass

Deno Deploy does not offer any sort of temporary file access in functions.

This breaks web frameworks that use the filesystem in body parsing.

:::

When the demo was last tested, the `drash` server framework used an in-memory
approach for parsing POST request bodies.

The [Drash demo](/docs/demos/net/server/drash) covers the framework in detail.

### Parsing Data

When files are submitted via HTTP POST, the `bodyParam` method can fetch data.
The `content` property of the returned object can be parsed with `XLSX.read`.

The following example assumes the file is submitted at field name `file`:

<CodeBlock language="ts">{`\
// @deno-types="https://cdn.sheetjs.com/xlsx-${current}/package/types/index.d.ts"
import { read, utils } from 'https://cdn.sheetjs.com/xlsx-${current}/package/xlsx.mjs';
import * as Drash from "https://cdn.jsdelivr.net/gh/drashland/drash@v2.8.1/mod.ts";
\n\
class SheetJSResource extends Drash.Resource {
  public paths = ["/"];
\n\
  public POST(request: Drash.Request, response: Drash.Response) {
    // highlight-start
    /* get data from body */
    const file = request.bodyParam<Drash.Types.BodyFile>("file");
    /* parse */
    var wb = read(file.content, {type: "buffer", dense: true});
    // highlight-end
    /* generate HTML from first worksheet */
    return response.html(utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]));
  }
}`}
</CodeBlock>

## Demo

0) Create a new GitHub account or sign into an existing account.

1) Open the [main Deno Deploy portal](https://dash.deno.com/) in a browser.

2) If the account never signed into Deno Deploy, click "Continue with Github".

In the next screen, review the prompt and click "Authorize Deno Deploy".

If a welcome screen is displayed, click "I know what I'm doing".

3) Click "New Playground" to create a new Playground.

4) Download [`s2c.ts`](pathname:///deno/s2c.ts).

5) Open `s2c.ts` with a text editor and copy the contents of the source file
into the playground editor (left pane in the browser).

6) Click "Save and Deploy". When the demo was last tested, it was a blue button.

### Testing

7) Wait until the server is deployed. When it is deployed, the right panel will
show "SheetJS Spreadsheet Conversion Service":

> ![Screenshot](pathname:///deno/sshot.png)

8) Download the test file https://docs.sheetjs.com/pres.xlsx

9) In the browser window, click "Choose File" and select the downloaded file.

10) Click "Submit". The right panel will show the contents in a HTML TABLE.

11) Open a terminal window and download https://docs.sheetjs.com/pres.numbers:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
```

12) Copy the first `curl` line from the page and run in the terminal. For
example, if the deployment is `clean-badger-69`, the command would be

```bash
curl -X POST -F"file=@pres.numbers" https://clean-badger-69.deno.dev/
```

The output will be an HTML table

13) Copy the second `curl` line from the page and run in the terminal. For
example, if the deployment is `clean-badger-69`, the command would be

```bash
curl -X POST -F"file=@pres.numbers" -F"type=csv" https://clean-badger-69.deno.dev/
```

The output will be CSV.