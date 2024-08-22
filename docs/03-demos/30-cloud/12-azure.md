---
title: Azure Cloud Services
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[Azure Cloud Services](https://azure.microsoft.com/) is a cloud services
platform which includes traditional virtual machine support, "Serverless
Functions" and cloud storage.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo explores two key AWS offerings:

- ["Azure Functions"](#azure-functions) ("Lambda") explores the serverless
  computing offering. The demo creates a JavaScript function that can process
  user-submitted files and generate spreadsheets.

- ["Blob Storage"](#blob-storage) explores the cloud storage offering. The demo
  uses the NodeJS connection library to read spreadsheets from storage and write
  spreadsheets back to cloud storage.

:::caution pass

Azure iterates quickly and there is no guarantee that the referenced services
will be available in the future.

:::

:::note Tested Deployments

This demo was last tested on 2024 June 12.

:::

## Telemetry

:::danger Telemetry

**Each command-line tool related to Azure embeds telemetry.**

Azure tools embed telemetry without proper disclaimer.

:::

It is strongly recommended to disable telemetry before working with Azure.

#### Azure Functions Core Tools

Azure Functions Core Tools (`func`) telemetry is controlled through the
`FUNCTIONS_CORE_TOOLS_TELEMETRY_OPTOUT` environment variable.

<Tabs groupId="os">
  <TabItem value="unix" label="Linux/MacOS">

Add the following line to `.profile`, `.bashrc` and `.zshrc`:

```bash
export FUNCTIONS_CORE_TOOLS_TELEMETRY_OPTOUT=1
```

Close and restart the Terminal to load the changes.

  </TabItem>
  <TabItem value="win" label="Windows">

Type `env` in the search bar and select "Edit the system environment variables".

In the new window, click the "Environment Variables..." button.

In the new window, look for the "System variables" section and click "New..."

Set the "Variable name" to `FUNCTIONS_CORE_TOOLS_TELEMETRY_OPTOUT` and the value
to `1`.

Click "OK" in each window (3 windows) and restart your computer.

  </TabItem>
</Tabs>

#### Azure CLI

Azure CLI (`az`) telemetry can be disabled using a subcommand (after installing
the CLI tool)[^1]:

```bash
az configure -d collect_telemetry=false
```

## Azure Functions

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required in Azure Functions that use the NodeJS runtime.

This discussion focuses on the "HTTP Trigger" function type.

:::note pass

In earlier tests, to enable binary data processing, `function.json` required a
`dataType` option:

```json title="function.json"
{
  "bindings": [
    {
      "type": "httpTrigger",
      "direction": "in",
//highlight-next-line
      "dataType": "binary",
      "name": "req",
```

In the most recent test, the template did not create a `function.json` and the
option was not required.

:::

### Reading Data

Using `@azure/functions`, the handler callback receives a `Request` object.
Uploaded files can be pulled into `ArrayBuffer` objects.

<details>
  <summary><b>Code Snippet</b> (click to show)</summary>

This function returns a promise that resolves to an `ArrayBuffer` object:

```js
const { Blob } = require('buffer');

async function get_file_from_request(request, form_field_name) {
  /* parse the request body */
  const formData = await request.formData();

  /* pull the specified field */
  const file = formData.get(form_field_name);

  /* if a file was submitted, `file` will be a Blob */
  if(!(file instanceof Blob)) throw new Error(`File is missing!`);

  /* pull data into an ArrayBuffer object */
  const ab = await file.arrayBuffer();
  return ab;
}
```

</details>

The SheetJS `read` method[^2] can read the `ArrayBuffer` objects and generate
SheetJS workbook objects[^3] which can be processed with other API functions.

For example, a handler can use `sheet_to_csv`[^4] to generate CSV text from
user-submitted spreadsheets:

```js
const { Blob } = require('buffer');
const { app } = require('@azure/functions');
const XLSX = require('xlsx');

app.http('SheetJSAzure', {
  methods: ['POST'],
  handler: async (req, context) => {
    /* grab the file at form key `upload` */
    const formData = await req.formData();
    const f = formData.get("upload");

    /* if a file was submitted, `f` will be a Blob object */
    if(!(f instanceof Blob)) return { status: 400, body: "Must submit a file" };

    /* parse file */
    const ab = await f.arrayBuffer();
    const wb = XLSX.read(ab);

    /* generate CSV from first sheet */
    const ws = wb.Sheets[wb.SheetNames[0]];
    const csv = XLSX.utils.sheet_to_csv(ws);
    return { status: 200, body: csv };
  }
});
```

### Writing Data

The SheetJS `write` method[^5] with the option `type: "buffer"` will generate
NodeJS buffers which can be sent in the callback handler response.

The following example generates a sample worksheet using the `aoa_to_sheet`[^6]
method, generates a sample workbook using worksheet helper methods[^7], writes
the workbook to XLSX format in a Buffer, and sends the Buffer in the response:

```js
const { app } = require('@azure/functions');
const XLSX = require('xlsx');

app.http('SheetJSAzure', {
  methods: ['GET'],
  handler: async (req, context) => {
    /* generate sample worksheet */
    var ws = XLSX.utils.aoa_to_sheet(["SheetJS".split(""), [5, 4, 3, 3, 7, 9, 5]]);
    /* generate workbook */
    var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Data");
    /* write to XLSX, returning a NodeJS Buffer */
    var buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    /* send Buffer to client */
    return {
      status: 200,
      /* Content-Disposition header */
      headers: { "Content-Disposition": `attachment; filename="SheetJSAzure.xlsx";` },
      /* data */
      body: buf
    };
  }
});
```

### Functions Demo

:::note pass

At the time of writing, the Azure Free Tier included an allowance of 1 million
free requests per month.

:::

0) If you do not have an account, create a new Azure free tier account[^8].

#### Local Setup

1) [Disable Azure Functions Core Tools Telemetry](#azure-functions-core-tools).

2) Install the CLI tool using npm:

```bash
npm i -g azure-functions-core-tools@4 --unsafe-perm true
```

:::note pass

On macOS and Linux, `sudo` may be required:

```bash
sudo npm i -g azure-functions-core-tools@4 --unsafe-perm true
```

:::

3) Install [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)

<details>
  <summary><b>Installation Notes</b> (click to show)</summary>

On macOS, `azure-cli` can be installed from Homebrew:

```bash
brew install azure-cli
```

</details>

4) Disable Azure CLI telemetry:

```bash
az configure -d collect_telemetry=false
```

#### Start Project

5) Create a new JavaScript HTTP Trigger project:

```bash
mkdir SheetJSAzure
cd SheetJSAzure
func new --template httpTrigger --language JavaScript --name SheetJSAzure
```

If prompted for a worker runtime, select `node` (Press <kbd>3</kbd>)

If prompted for a language, select `javascript` (Press <kbd>1</kbd>)

:::danger pass

When the demo was last tested, the stock TypeScript template did not work.

**This is a bug in the Azure Functions Core Tools**

Until the bugs are resolved, JavaScript should be preferred over TypeScript.

:::

6) Start the local server:

```bash
npm start
```

7) While the server is running, open a new terminal window and make a request:

```bash
curl -L http://localhost:7071/api/SheetJSAzure
```

The terminal should display `Hello, world!`

#### Add SheetJS

8) Install the SheetJS NodeJS module:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz`}
</CodeBlock>

9) Download [the sample script](pathname:///azure/index.js):

```bash
curl -L -o src/functions/SheetJSAzure.js https://docs.sheetjs.com/azure/index.js
```

#### Local Test

10) Stop and restart the dev server:

```bash
npm start
```

11) In a new terminal window, download https://docs.sheetjs.com/pres.numbers and
make a POST request to the dev server:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F "upload=@pres.numbers" http://localhost:7071/api/SheetJSAzure
```

If the test succeeded, the terminal will print CSV rows from the test file data.

12) Open a web browser and access `http://localhost:7071/api/SheetJSAzure` .

If the test succeeded, the browser will attempt to download `SheetJSAzure.xlsx`.
Open in Excel or another spreadsheet editor to confirm the file is valid.

#### Create Remote Function

13) Sign into the [Azure Portal](https://portal.azure.com/#home)

14) Type "Function App" in the top search box and click "Function App":

![Function App](pathname:///azure/functionapp.png)

15) Click "+ Create"

16) Select the following options:

- "Select a hosting option": "Consumption"

- Type a memorable "Function Name" ("sheetjsazure" when last tested)

- "Operating System": "Windows"

- "Runtime stack": select `Node.js`

17) Click "Review + create", then click "Create" to create the function.

The page will display a status message

> ... Deployment is in progress

When the resources are configured, the status will change to

> Your deployment is complete

18) Click "Go to Resource".

19) Take note of the URL from the "Essentials" table.

#### Deploy to Azure

20) Sign into Azure:

```
az login
```

The login flow resumes in the browser.

21) Deploy to Azure.  Replace `FUNCTION_NAME` with the name from Step 16:

```bash
func azure functionapp publish FUNCTION_NAME
```

After publishing, the process will print the "Invoke url":

```text pass
Functions in sheetjsazure:
    SheetJSAzure - [httpTrigger]
// highlight-next-line
        Invoke url: https://sheetjsazure.azurewebsites.net/api/sheetjsazure
```

Take note of that URL.

:::danger pass

When this demo was last tested using the "Linux" operating system, the command
failed with a support error:

```
Azure Functions Core Tools does not support this deployment path. Please configure the app to deploy from a remote package using the steps here: https://aka.ms/deployfromurl
```

**This is a limitation of the Azure CLI tool with Linux functions!**

Ensure that the selected operating system is "Windows".

SheetJS libraries run in Linux-based functions.

:::

#### Remote Test

22) In a new terminal window, download https://docs.sheetjs.com/pres.numbers and
make a POST request to the production server. Replace `FUNCTION_URL` with the
Invoke URL from Step 21:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F "upload=@pres.numbers" FUNCTION_URL
```

If the test succeeded, the terminal will print CSV rows from the test file data.

23) Open a web browser and access the Invoke URL from Step 21.

If the test succeeded, the browser will attempt to download `SheetJSAzure.xlsx`.
Open in Excel or another spreadsheet editor to confirm the file is valid.

## Blob Storage

The main module for Azure Blob Storage is `@azure/storage-blob`. This example
was tested using the "Connection String" authentication method.  The strings
are found in the Azure Portal under "Access Keys" for the storage account.

### Downloading Data

The `BlobClient#download` method returns a Stream. After collecting into a
Buffer, the SheetJS `read` method[^9] can parse the data into a workbook[^10].

The following demo uses the `sheet_to_csv`[^11] utility function to display the
contents of a file in Azure Blob Storage:

```js title="SheetJSReadFromAzure.mjs"
import { BlobServiceClient } from "@azure/storage-blob";
import { read, utils } from "xlsx";

/* replace these constants */
// highlight-start
const connStr = "<REPLACE WITH CONNECTION STRING>";
const containerName = "<REPLACE WITH CONTAINER NAME>";
// highlight-end

/* Blob name */
const blobName = "SheetJSBloblobber.xlsx";

/* get a readable stream*/
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);
const blobClient = containerClient.getBlobClient(blobName);
const response = (await blobClient.download()).readableStreamBody;

/* collect data into a Buffer */
const bufs = [];
for await(const buf of response) bufs.push(buf);
const downloaded = Buffer.concat(bufs);

/* parse downloaded buffer */
const wb = read(downloaded);
/* print first worksheet */
console.log(utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
```

### Uploading Data

The SheetJS `write` method[^12] with the option `type: "buffer"` will generate
NodeJS buffers which can be uploaded with `BlockBlobClient#upload`.

The following example generates a sample worksheet using the `aoa_to_sheet`[^13]
method, generates a sample workbook using worksheet helper methods[^14], writes
the workbook to XLSX format in a Buffer, and sends the Buffer in the response:

```js title="SheetJSWriteToAzure.mjs"
import { BlobServiceClient } from "@azure/storage-blob";
import { write, utils } from "xlsx";

/* replace these constants */
// highlight-start
const connStr = "<REPLACE WITH CONNECTION STRING>";
const containerName = "<REPLACE WITH CONTAINER NAME>";
// highlight-end

/* Blob name */
const blobName = "SheetJSBloblobber.xlsx";

/* Create a simple workbook and write XLSX to buffer */
const ws = utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
const wb = utils.book_new(); utils.book_append_sheet(wb, ws, "Sheet1");
const buf = write(wb, {type: "buffer", bookType: "xlsx"});

/* upload buffer */
const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
const containerClient = blobServiceClient.getContainerClient(containerName);
const blockBlobClient = containerClient.getBlockBlobClient(blobName);
const uploadBlobResponse = await blockBlobClient.upload(buf, buf.length);
```

### Blob Demo

:::note pass

At the time of writing, new Azure accounts were granted a 12-month trial of Blob
Storage. The trial includes 5GB of "Locally-redundant storage" with 20,000 read
requests and 2000 write requests per month.

:::

0) If you do not have an account, create a new Azure free tier account[^15].

#### Storage Account Setup

1) Sign into the [Azure Portal](https://portal.azure.com/#home)

2) Type "Storage" in the top search box and click "Storage accounts":

![Storage Accounts](pathname:///azure/storageacct.png)

3) Click "+ Create"

4) Select the following options:

- Type a memorable "Storage account name" ("sheetjstorage" when last tested)

- "Redundancy": select LRS (Locally-redundant storage)

5) Click "Review", then click "Create" to create the storage.

The page will display a status message

> ... Deployment is in progress

When the resources are configured, the status will change to

> Your deployment is complete

6) Click "Go to Resource".

#### Access Keys

7) Click "Access keys" in the left sidebar (under "Security + networking").

8) Look for the "Connection string" title under "key1". In the row below the
title, click "Show" to reveal the key. Click the copy icon or manually copy the
key, storing it in a safe place.

![Connection string "Show" button](pathname:///azure/connstr.png)

#### Container Setup

9) Click "Containers" in the left sidebar (under "Data storage").

10) Click "+ Container"

11) Select the following options:

- Type a memorable "Name" ("sheetjs-container" when last tested)

12) Click "Create" to create the container.

#### Project Setup

13) Create a new project folder:

```bash
mkdir SheetJSBlob
cd SheetJSBlob
npm init -y
```

14) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz @azure/storage-blob`}
</CodeBlock>

14) Copy the [`SheetJSReadFromAzure.mjs` code block](#downloading-data) and save
to `SheetJSReadFromAzure.mjs`.

15) Copy the [`SheetJSWriteToAzure.mjs` code block](#uploading-data) and save
to `SheetJSWriteToAzure.mjs`.

16) Edit both `SheetJSReadFromAzure.mjs` and `SheetJSWriteToAzure.mjs`:

- Replace the `connStr` value with the connection string from Step 8
- Replace the `containerName` value with the container name from Step 11

#### Test

:::note pass

The write demo creates a simple workbook, generates a NodeJS buffer, and uploads
the buffer to a file named `SheetJSBloblobber.xlsx` on Azure Blob Storage.

The read demo fetches `SheetJSBloblobber.xlsx` and displays the data.

```
   | A | B | C | D | E | F | G |
---+---|---|---|---|---|---|---|
 1 | S | h | e | e | t | J | S |
 2 | 5 | 4 | 3 | 3 | 7 | 9 | 5 |
```

:::

17) Run the write test:

```bash
node SheetJSWriteToAzure.mjs
```

This will write the file `SheetJSBloblobber.xlsx` to the container.

18) Run the read test:

```bash
node SheetJSReadFromAzure.mjs
```

It will fetch the file created in the previous step and display CSV rows.

```
S,h,e,e,t,J,S
5,4,3,3,7,9,5
```

19) Sign into the [Azure Portal](https://portal.azure.com/#home)

20) Type "Storage" in the top search box and click "Storage accounts"

21) Click on the name of the storage

22) In the left sidebar, click "Containers". It will be under "Data storage".

23) Click on the name of the container in the table

24) Verify that the table shows `SheetJSBloblobber.xlsx`:

![SheetJSBloblobber.xlsx in the container](pathname:///azure/bloblobber.png)

25) Click on the name `SheetJSBloblobber.xlsx`.

26) Click "Download" in the row below the file name:

![Download link in the website](pathname:///azure/dl.png)

The downloaded file is the raw file stored in Azure Blob Storage. To confirm it
is valid, open the file in Excel or another spreadsheet editor.

[^1]: The platform-specific installers are available at https://learn.microsoft.com/en-us/cli/azure/install-azure-cli
[^2]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^3]: See ["Workbook Object" in "SheetJS Data Model"](/docs/csf/book) for more details.
[^4]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^5]: See [`write` in "Writing Files"](/docs/api/write-options)
[^6]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^7]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^8]: Registering for a free account [on the Azure Free Tier](https://azure.microsoft.com/en-us/free) requires a valid phone number and a valid credit card.
[^9]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^10]: See ["Workbook Object" in "SheetJS Data Model"](/docs/csf/book) for more details.
[^11]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^12]: See [`write` in "Writing Files"](/docs/api/write-options)
[^13]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^14]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^15]: Registering for a free account [on the Azure Free Tier](https://azure.microsoft.com/en-us/free) requires a valid phone number and a valid credit card.
