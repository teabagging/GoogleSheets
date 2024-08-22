---
title: Google Sheets Data Interchange
sidebar_label: Google Sheets
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

:::note pass

This demo focuses on external data processing.  For Google Apps Script custom
functions, [the "Google Sheets" extension demo](/docs/demos/extensions/gsheet)
covers Apps Script integration.

:::

[Google Sheets](https://google.com/sheets/about/) is a collaborative spreadsheet
service with powerful external APIs for automation.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS to properly exchange data with spreadsheet files. We'll
explore how to use NodeJS integration libraries and SheetJS in three data flows:

- "Importing data": Data in a NUMBERS spreadsheet will be parsed using SheetJS
libraries and written to a Google Sheets Document

- "Exporting data": Data in Google Sheets will be pulled into arrays of objects.
A workbook will be assembled and exported to Excel Binary workbooks (XLSB).

- "Exporting files": SheetJS libraries will read XLSX files exported by Google
Sheets and generate CSV rows from every worksheet.

:::danger pass

It is strongly recommended to create a new Google account for testing.

**One small mistake could result in a block or ban from Google services.**

:::

:::caution pass

Google Sheets deprecates APIs quickly and there is no guarantee that the
referenced APIs will be available in the future.

:::

## Integration Details

This demo uses the Sheets v4 and Drive v3 APIs through the official `googleapis`
connector module.

:::info Initial Setup

There are a number of steps to enable the Google Sheets API and Google Drive API
for an account. The [Complete Example](#complete-example) covers the process.

:::

### Document Duality

Each Google Sheets document is identified with a unique ID. This ID can be found
from the Google Sheets edit URL.

The edit URL starts with `https://docs.google.com/spreadsheets/d/` and includes
`/edit`. The ID is the string of characters between the slashes.  For example:

```
https://docs.google.com/spreadsheets/d/a_long_string_of_characters/edit#gid=0
                                      |^^^^^^^^^^^^^^^^^^^^^^^^^^^|--- ID
```

The same ID is used in Google Drive operations.

The following operations are covered in this demo:

| Operation                     | API    |
|:------------------------------|:-------|
| Create Google Sheets Document | Sheets |
| Add and Remove worksheets     | Sheets |
| Modify data in worksheets     | Sheets |
| Share Sheets with other users | Drive  |
| Generate raw file exports     | Drive  |

### Authentication

It is strongly recommended to use a service account for Google API operations.
The ["Service Account Setup" section](#service-account-setup) covers how to
create a service account and generate a JSON key file.

The generated JSON key file includes `client_email` and `private_key` fields.
These fields can be used in JWT authentication:

```js title="JWT Authentication using a JSON key file"
import { google } from "googleapis";

// adjust the path to the actual key file.
// highlight-next-line
import creds from './sheetjs-test-726272627262.json' assert { type: "json" };

/* connect to google services */
const jwt = new google.auth.JWT({
  email: creds.client_email,
  key: creds.private_key,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets', // Google Sheets
    'https://www.googleapis.com/auth/drive.file', // Google Drive
  ]
});
```

### Connecting to Services

The `google` named export includes special methods to connect to various APIs.

#### Google Sheets

```js
const sheets = google.sheets({ version: "v4", auth: jwt });
```

`google.sheets` takes an options argument that includes API version number and
authentication details.

#### Google Drive

```js
const drive = google.drive({ version: "v3", auth: jwt });
```

`google.drive` takes an options argument that includes API version number and
authentication details.

### Array of Arrays

["Arrays of Arrays"](/docs/api/utilities/array#array-of-arrays) are the main
data format for interchange with Google Sheets. The outer array object includes
row arrays, and each row array includes data.

SheetJS provides methods for working with Arrays of Arrays:

- `aoa_to_sheet`[^1] creates SheetJS worksheet objects from arrays of arrays
- `sheet_to_json`[^2] can generate arrays of arrays from SheetJS worksheets

## Export Document Data

The goal is to create an XLSB export from a Google Sheet.  Google Sheets does
not natively support the XLSB format.  SheetJS fills the gap.

### Convert a Single Sheet

`sheets.spreadsheets.values.get` returns data from an existing Google Sheet. The
method expects a range. Passing the sheet name as the title will pull all rows.

If successful, the response object will have a `data` property. It will be an
object with a `values` property. The values will be represented as an Array of
Arrays of values. This array of arrays can be converted to a SheetJS sheet:

```js
async function gsheet_ws_to_sheetjs_ws(id, sheet_name) {
  /* get values */
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: `'${sheet_name}'`
  });
  const values = res.data.values;

  /* create SheetJS worksheet */
  const ws = XLSX.utils.aoa_to_sheet(values);
  return ws;
}
```

### Convert a Workbook

`sheets.spreadsheets.get` returns metadata about the Google Sheets document. In
the result object, the `data` property is an object which has a `sheets`
property. The value of the `sheets` property is an array of sheet objects.

The SheetJS `book_new` [^3] method creates blank SheetJS workbook objects. The
`book_append_sheet` [^4] method adds SheetJS worksheet objects to the workbook.

By looping across the sheets, the entire workbook can be converted:

```js
async function gsheet_doc_to_sheetjs_wb(doc) {
  /* Create a new workbook object */
  const wb = XLSX.utils.book_new();

  /* Get metadata */
  const wsheet = await sheets.spreadsheets.get({spreadsheetId: id});

  /* Loop across the Document sheets */
  for(let sheet of wsheet.data.sheets) {
    /* Get the worksheet name */
    const name = sheet.properties.title;

    /* Convert Google Docs sheet to SheetJS worksheet */
    const ws = await gsheet_ws_to_sheetjs_ws(id, name);

    /* Append worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, name);
  }

  return wb;
}
```

This method returns a SheetJS workbook object that can be exported with the
`writeFile` and `write` methods.[^5]

## Update Document Data

The goal is to import data from a NUMBERS file to Google Sheets. Google Sheets
does not natively support the NUMBERS format.  SheetJS fills the gap.

### Create New Document

`sheets.spreadsheets.create` creates a new Google Sheets document. It can accept
a document title. It will generate a new workbook with a blank "Sheet1" sheet.
The response includes the document ID for use in subsequent operations:

```js title="Create a new document with blank sheet"
const res = await sheets.spreadsheets.create({
  requestBody: {
    properties: {
      /* Document Title */
      title: "SheetJS Test"
    }
  }
});
const id = res.data.spreadsheetId;
```

:::caution pass

When using a service worker, the main account does not have access to the new
document by default. The document has to be shared with the main account using
the Drive API:

```js title="Sharing the generated sheet with the main account"
await drive.permissions.create({
  fileId: id, // this ID was returned in the response to the create request
  fields: "id",
  requestBody: {
    type: "user",
    role: "writer",
    emailAddress: "YOUR_ADDRESS@gmail.com" // main address
  }
});
```

:::

### Delete Non-Initial Sheets

Google Sheets does not allow users to delete every worksheet.

The recommended approach involves deleting every worksheet after the first.

The delete operation requires a unique identifier for a sheet within the Google
Sheets document. These IDs are found in the `sheets.spreadsheets.get` response.

The following snippet performs one bulk operation using `batchUpdate`:

```js title="Deleting non-initial sheets"
/* get existing sheets */
const wsheet = await sheets.spreadsheets.get({spreadsheetId: id});

/* remove all sheets after the first */
if(wsheet.data.sheets.length > 1) await sheets.spreadsheets.batchUpdate({
  spreadsheetId: id,
  requestBody: { requests: wsheet.data.sheets.slice(1).map(s => ({
    deleteSheet: {
      sheetId: s.properties.sheetId
    }
  }))}
});
```

### Rename First Sheet

The first sheet must be renamed so that the append operations do not collide
with the legacy name. Since most SheetJS-supported file formats and most
spreadsheet applications limit worksheet name lengths to 32 characters, it is
safe to set a name that exceeds 33 characters.

The `updateSheetProperties` update method can rename individual sheets:

```js title="Rename legacy first sheet"
/* rename first worksheet to avoid collisions */
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: id,
  requestBody: { requests: [{
    updateSheetProperties: {
      fields: "title",
      properties: {
        sheetId: wsheet.data.sheets[0].properties.sheetId,
         // the new title is 34 characters, to be exact
        title: "thistitleisatleast33characterslong"
      }
    }
  }]}
});
```

### Append Worksheets

:::note pass

The [`read` and `readFile` methods](/docs/api/parse-options) generate SheetJS
workbook objects from existing worksheet files.

:::

Starting from a SheetJS workbook, the `SheetNames` property[^6] is an array of
worksheet names and the `Sheets` property is an object that maps sheet names to
worksheet objects.

Looping over the worksheet names, there are two steps to appending a sheet:

1) "Append a blank worksheet": The `addSheet` request, submitted through the
`sheets.spreadsheets.batchUpdate` method, accepts a new title and creates a new
worksheet. The new worksheet will be added at the end.

2) "Write data to the new sheet": The SheetJS `sheet_to_json` method with the
option `header: 1`[^7] will generate an array of arrays of data. This structure
is compatible with the `sheets.spreadsheets.values.update` operation.

The following snippet pushes all worksheets from a SheetJS workbook into a
Google Sheets document:

```js title="Push data from a SheetJS workbook to a Google Sheets Document"
/* add sheets from file */
for(let name of wb.SheetNames) {
  /* (1) Create a new Google Sheets sheet */
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: id,
    requestBody: { requests: [
      /* add new sheet */
      { addSheet: { properties: { title: name } } },
    ] }
  });

  /* (2) Push data */
  const aoa = XLSX.utils.sheet_to_json(wb.Sheets[name], {header:1});
  await sheets.spreadsheets.values.update({
    spreadsheetId: id,
    range: `'${name}'!A1`,
    valueInputOption: "USER_ENTERED",
    resource: { values: aoa }
  });
}
```

### Delete Initial Sheet

After adding new worksheets, the final step involves removing the initial sheet.

The initial sheet ID can be pulled from the worksheet metadata fetched when the
[non-initial sheets were removed](#delete-non-initial-sheets):

```js title="Deleting the Initial sheet"
/* remove first sheet */
await sheets.spreadsheets.batchUpdate({
  spreadsheetId: id,
  requestBody: { requests: [
    /* remove old first sheet */
    { deleteSheet: { sheetId: wsheet.data.sheets[0].properties.sheetId } }
  ] }
});
```

## Raw File Exports

In the web interface, Google Sheets can export documents to `XLSX` or `ODS`.

Raw file exports are exposed through the `files.export` method in the Drive API:

```js title="Export XLSX workbook"
const drive = google.drive({ version: "v3", auth: jwt });

/* Request XLSX export */
const file = await drive.files.export({
  /* XLSX MIME type */
  mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  fileId: id
});
```

:::note pass

The `mimeType` property is expected to be one of the supported formats[^8]. When
the demo was last tested, the following workbook conversions were supported:

| Format | MIME Type                                                           |
|:-------|:--------------------------------------------------------------------|
| XLSX   | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` |
| ODS    | `application/x-vnd.oasis.opendocument.spreadsheet`                  |

:::

The response object has a `data` field whose value will be a `Blob` object. Data
can be pulled into an `ArrayBuffer` and passed to the SheetJS `read`[^9] method:

```js
/* Obtain ArrayBuffer */
const ab = await file.data.arrayBuffer();

/* Parse */
const wb = XLSX.read(buf);
```

:::note pass

The code snippet works for XLSX and ODS. Google Sheets supports other formats
with different integration logic.

**Plaintext**

The following formats are considered "plaintext":

| Format            | MIME Type                   |
|:------------------|:----------------------------|
| CSV (first sheet) | `text/csv`                  |
| TSV (first sheet) | `text/tab-separated-values` |

For these formats, `file.data` is a JS string that can be parsed directly:

```js
/* Request CSV export */
const file = await drive.files.export({ mimeType: "text/csv", fileId: id });

/* Parse CSV string*/
const wb = XLSX.read(file.data, {type: "string"});
```

**HTML**

Google Sheets has one relevant HTML type:

| Format            | MIME Type         |
|:------------------|:------------------|
| HTML (all sheets) | `application/zip` |

The HTML export of a Google Sheets worksheet includes a row for the column
labels (`A`, `B`, ...) and a column for the row labels (`1`, `2`, ...).

The complete package is a ZIP file that includes a series of `.html` files.
The files are written in tab order. The name of each file matches the name in
Google Sheets.

This ZIP can be extracted using the embedded CFB library:

```js
import { read, utils, CFB } from 'xlsx';
// -------------------^^^-- `CFB` named import

// ...

/* Parse Google Sheets ZIP file */
const cfb = CFB.read(new Uint8Array(ab), {type: "array"});

/* Create new SheetJS workbook */
const wb = utils.book_new();

/* Scan through each entry in the ZIP */
cfb.FullPaths.forEach((n, i) => {
  /* only process HTML files */
  if(n.slice(-5) != ".html") return;

  /* Extract worksheet name */
  const name = n.slice(n.lastIndexOf("/")+1).slice(0,-5);

  /* parse HTML */
  const htmlwb = read(cfb.FileIndex[i].content);

  /* add worksheet to workbook */
  utils.book_append_sheet(wb, htmlwb.Sheets.Sheet1, name);
});
```

:::

At this point `wb` is a SheetJS workbook object[^10].

## Complete Example

:::note Tested Deployments

This demo was last tested on 2024 June 08 using `googleapis` version `140.0.0`.
The demo uses Sheets v4 and Drive v3 APIs.

:::

:::caution pass

**The Google Cloud web interface changes frequently!**

The screenshots and detailed descriptions may be out of date. Please report any
issues [to the docs repo](https://git.sheetjs.com/sheetjs/docs.sheetjs.com/) or
reach out to [the SheetJS Discord server](https://sheetjs.com/chat).

:::

### Account Setup

0) Create a new Google account or log into an existing account.

:::caution pass

A valid phone number (for SMS verification) may be required.

:::

1) Open https://console.cloud.google.com in a web browser.

If this is the first time accessing Google Cloud resources, a terms of service
modal will be displayed. Review the Google Cloud Platform Terms of Service by
clicking the "Google Cloud Platform Terms of Service" link.

:::danger pass

You must agree to the Google Cloud Platform Terms of Service to use the APIs.

:::

Check the box under "Terms of Service" and click "AGREE AND CONTINUE".

### Project Setup

:::info pass

The goal of this section is to create a new project.

:::

2) Open the Project Selector.

In the top bar, between the "Google Cloud" logo and the search bar, there will
be a selection box. Click the `▼` icon to show the modal.

![Project Selector](pathname:///gsheet/selector.png)

If the selection box is missing, expand the browser window.

3) Click "NEW PROJECT" in the top right corner of the modal.

4) In the New Project screen, enter "SheetJS Test" in the Project name textbox
and select "No organization" in the Location box. Click "CREATE".

A notification will confirm that the project was created:

![Project notification](pathname:///gsheet/notification.png)


### API Setup

:::info pass

The goal of this section is to enable Google Sheets API and Google Drive API.

:::

5) Open the Project Selector (`▼` icon) and select "SheetJS Test"

6) In the search bar, type "Enabled" and select "Enabled APIs & services". This
item will be in the "PRODUCTS & PAGES" part of the search results.

#### Enable Google Sheets API

7) Near the top of the page, click "+ ENABLE APIS AND SERVICES".

8) In the search bar near the middle of the page (not the search bar at the top),
type "Sheets" and press <kbd>Enter</kbd>.

In the results page, look for "Google Sheets API". Click the card

9) In the Product Details screen, click the blue "ENABLE" button.

10) Click the left arrow (`<-`) next to "API/Service details".

#### Enable Google Drive API

11) Near the top of the page, click "+ ENABLE APIS AND SERVICES".

12) In the search bar near the middle of the page (not the search bar at the top),
type "Drive" and press <kbd>Enter</kbd>.

In the results page, look for "Google Drive API". Click the card

13) In the Product Details screen, click the blue "ENABLE" button.

### Service Account Setup

:::info pass

The goal of this section is to create a service account and generate a JSON key.

:::

14) Go to https://console.cloud.google.com or click the "Google Cloud" image in
the top bar.

#### Create Service Account

15) Click the Project Selector (`:·` icon) and select "SheetJS Test".

16) In the search bar, type "Credentials" and select the "Credentials" item with
subtitle "APIs & Services". This item will be in the "PRODUCTS & PAGES" group:

![Credentials](pathname:///gsheet/creds.png)

17) Click "+ CREATE CREDENTIALS". In the dropdown, select "Service Account"

18) Enter "SheetJService" for Service account name. Click "CREATE AND CONTINUE"

:::note pass

The Service account ID is generated automatically.

:::

19) In Step 2 "Grant this service account access to project", click CONTINUE

20) In Step 3 click "DONE". You will be taken back to the credentials screen

#### Create JSON Key

21) Look for "SheetJService" in the "Service Accounts" table and click the email
address in the row.

22) Click "KEYS" in the horizontal bar near the top of the page.

23) Click "ADD KEY" and select "Create new key" in the dropdown.

24) In the popup, select the "JSON" radio button and click "CREATE".

The page will download a JSON file. If prompted, allow the download.

25) Click "CLOSE"

### Create Document

:::info pass

The goal of this section is to create a document from the service account and
share with the main account.

:::

26) Create a `SheetJSGS` folder and initialize:

```bash
mkdir SheetJSGS
cd SheetJSGS
npm init -y
```

27) Copy the JSON file from step 24 into the project folder.

28) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz googleapis`}
</CodeBlock>

29) Download [`init.mjs`](pathname:///gsheet/init.mjs):

```bash
curl -LO https://docs.sheetjs.com/gsheet/init.mjs
```

Edit the marked lines near the top of the file:

```js title="init.mjs (edit highlighted lines)"
/* Change this import statement to point to the credentials JSON file */
// highlight-next-line
import creds from './sheetjs-test-726272627262.json' assert { type: "json" };

/* Change this to the primary account address, NOT THE SERVICE ACCOUNT */
// highlight-next-line
const acct = "YOUR_ADDRESS@gmail.com";
```

- `'./sheetjs-test-726272627262.json'` should be replaced with the name of the
JSON file in step 27. The `./` prefix is required!

- `'YOUR_ADDRESS@gmail.com'` should be replaced with the Google Account email
address from step 0.

30) Run the script:

```bash
node init.mjs
```

The script will print three lines:

```
Created Google Workbook a-long-string-of-characters
Created Google Worksheets "SheetJS1" and "SheetJS2"
Shared a-long-string-of-characters with YOUR_ACCOUNT@gmail.com
```

The long string of characters after "Created Google Workbook" is the ID. Take
note of this ID.

31) Sign into Google Sheets. A shared document "SheetJS Test" should be
displayed in the table. It will be owned by the service account.

32) Open the shared document from step 31 and confirm that the document has two
worksheets named "SheetJS1" and "SheetJS2".

Confirm the worksheet data matches the following screenshots:

<table>
  <!-- Note: MDX v2 requires the janky indentation -->
  <thead><tr><th>Sheet</th><th>Data</th><th>Screenshot</th></tr></thead>
  <tbody>
    <tr>
      <td>SheetJS1</td>
<td>

```js
[
  [ "Sheet", "JS" ],
  [ 72, 62 ]
]
```

</td><td>

![SheetJS1 data](pathname:///gsheet/SheetJS1.png)

</td>
</tr>
<tr>
  <td>SheetJS2</td>
<td>

```js
[
  [ "Area Code", "Part 1", "Part 2" ],
  [ 201, 867, 5309 ],
  [ 281, 330, 8004 ]
]
```

</td><td>

![SheetJS2 data](pathname:///gsheet/SheetJS2.png)

</td></tr></tbody></table>

33) Copy the URL and extract the document ID.

The URL of the document will look like

```
https://docs.google.com/spreadsheets/d/a_long_string_of_characters/edit#gid=0
---------------------------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^--- ID
```

The ID is a long string of letters and numbers and underscore characters (`_`)
just before the `/edit` part of the URL.

Confirm that this ID matches the ID printed in step 30.

### Load Data from NUMBERS

:::info pass

The goal of this section is to update the new document with data from a sample
NUMBERS file.

:::

34) Download the [test file `pres.numbers`](https://docs.sheetjs.com/pres.numbers):

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
```

35) Download [`load.mjs`](pathname:///gsheet/load.mjs):

```bash
curl -LO https://docs.sheetjs.com/gsheet/load.mjs
```

Edit the marked lines near the top of the file:

```js title="load.mjs (edit highlighted lines)"
/* Change this import statement to point to the credentials JSON file */
import creds from './sheetjs-test-726272627262.json' assert { type: "json" };

/* Change this to the spreadsheet ID */
const id = "SOME-SPREADSHEETJS-ID";
```

- `'./sheetjs-test-726272627262.json'` should be replaced with the name of the
JSON file in step 27. The `./` prefix is required!

- `"SOME-SPREADSHEETJS-ID"` should be replaced with the Document ID from step 33.

36) Run the script:

```bash
node load.mjs
```

37) Sign into Google Sheets and open the "SheetJS Test" shared document. It
should show a list of Presidents, matching the contents of the test file.

### Export Data to XLSB

:::info pass

The goal of this section is to export the raw data from Google Sheets to XLSB.

:::

38) Download [`dump.mjs`](pathname:///gsheet/dump.mjs):

```bash
curl -LO https://docs.sheetjs.com/gsheet/dump.mjs
```

Edit the marked lines near the top of the file:

```js title="dump.mjs (edit highlighted lines)"
/* Change this import statement to point to the credentials JSON file */
import creds from './sheetjs-test-726272627262.json' assert { type: "json" };

/* Change this to the spreadsheet ID */
const id = "SOME-SPREADSHEETJS-ID";
```

- `'./sheetjs-test-726272627262.json'` should be replaced with the name of the
JSON file in step 27. The `./` prefix is required!

- `"SOME-SPREADSHEETJS-ID"` should be replaced with the Document ID from step 33.

39) Run the script:

```bash
node dump.mjs
```

The script should create a file `SheetJSExport.xlsb` in the project folder. This
file can be opened in Excel.

### Export Raw Files

:::info pass

The goal of this section is to parse the Google Sheets XLSX export and generate
CSV files for each worksheet.

:::

40) Sign into Google Sheets and open the "SheetJS Test" shared document.

41) Click the Plus (`+`) icon in the lower left corner to create a new worksheet.

42) In the new worksheet, set cell A1 to the formula `=SEQUENCE(3,5)`. This will
assign a grid of values

43) Download [`raw.mjs`](pathname:///gsheet/raw.mjs):

```bash
curl -LO https://docs.sheetjs.com/gsheet/raw.mjs
```

Edit the marked lines near the top of the file:

```js title="raw.mjs (edit highlighted lines)"
/* Change this import statement to point to the credentials JSON file */
import creds from './sheetjs-test-726272627262.json' assert { type: "json" };

/* Change this to the spreadsheet ID */
const id = "SOME-SPREADSHEETJS-ID";
```

- `'./sheetjs-test-726272627262.json'` should be replaced with the name of the
JSON file in step 27. The `./` prefix is required!

- `"SOME-SPREADSHEETJS-ID"` should be replaced with the Document ID from step 33.

44) Run the script:

```bash
node raw.mjs
```

The script will display the sheet names and CSV rows from both worksheets:

```
#### Sheet1
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46

#### Sheet14
1,2,3,4,5
6,7,8,9,10
11,12,13,14,15
```

[^1]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^2]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^3]: See [`book_new` in "Utilities"](/docs/api/utilities/wb)
[^4]: See [`book_append_sheet` in "Utilities"](/docs/api/utilities/wb)
[^5]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^6]: See ["Workbook Object"](/docs/csf/book) for more details.
[^7]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^8]: See ["Export MIME types for Google Workspace documents"](https://developers.google.com/drive/api/guides/ref-export-formats) in the Google Developer documentation for the complete list of supported file types.
[^9]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^10]: See ["Workbook Object"](/docs/csf/book) for a description of the workbook object or ["API Reference"](/docs/api) for various methods to work with workbook and sheet objects.
