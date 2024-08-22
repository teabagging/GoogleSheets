---
title: Google Sheets Script Automation
sidebar_label: Google Sheets
pagination_prev: demos/cloud/index
pagination_next: demos/bigdata/index
sidebar_custom_props:
  summary: Enhance data import functionality from Google Sheets
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

:::note pass

This demo focuses on Google Apps Script custom functions.  For external data
processing, [the "Google Sheets" cloud data demo](/docs/demos/cloud/gsheet)
covers the API for NodeJS scripts

:::

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be uploaded into an Apps Script project. Once uploaded, the `XLSX` variable
is available to other scripts in the project.

Google Sheets currently does not provide support for working with Apple Numbers
files and some legacy file formats. SheetJS fills the gap.

The [Complete Demo](#complete-demo) defines a `SHEETJS` function that fetches a
remote file, parses the contents, and writes data to the sheet:

![Screenshot of final result](pathname:///gsheet/udf.png)

:::note Tested Deployments

This demo was last tested on 2024 March 11.

:::

## Integration Details

### Adding the script

The `clasp` command line tool can be used to upload the standalone script:

<CodeBlock language="bash">{`\
npx @google/clasp clone SCRIPT_ID
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js
npx @google/clasp push`}
</CodeBlock>

Once uploaded, the script `xlsx.full.min.gs` will be added to the project.

The [Complete Demo](#complete-demo) includes more detailed setup instructions.

### Fetching data

`UrlFetchApp.fetch` performs a network request and returns a `HTTPResponse`:

```js
const response = UrlFetchApp.fetch("https://docs.sheetjs.com/pres.numbers");
```

`HTTPResponse#getContent` returns the file data as an array of *signed* bytes:

```js
const content = response.getContent();
```

The `"array"` type for `XLSX.read` expects an array of *unsigned* bytes.
Fortunately, the content can be corrected with bitwise operations:

```js
for(var i = 0; i < content.length; ++i) content[i] &= 0xFF;
const wb = XLSX.read(content, { type: "array" });
```

### Returning data

`XLSX.utils.sheet_to_json` with the option `header: 1` returns arrays of arrays
that play nice with Google Sheets:

```js
const first_worksheet = wb.Sheets[wb.SheetNames[0]];
const aoa = XLSX.utils.sheet_to_json(first_worksheet, {header: 1});
```

## Complete Demo

This demo creates a function `SHEETJS(url)` that fetches the specified URL,
extracts data from the first worksheet, and writes the data

### Initial Setup

0) Sign into a Google account (or create a new one)

1) In a terminal window, run

```bash
npx @google/clasp login
```

A browser window should direct to an account selection page. Select the account
from the previous step. In the next page, there will be a title like

> clasp – The Apps Script CLI wants to access your Google Account

At the bottom of the screen, click "Allow".

The terminal window should now state

```
Authorization successful.
```

### Creating a Sheet

2) Sign into Google Sheets with the same account and create a new blank sheet

3) Open up the apps script window (Extensions > Apps Script)

4) Click the gear icon (Project Settings) and copy the Script ID

### Cloning the Apps Script

5) In the terminal window, create a new folder for your project:

```bash
mkdir SheetJSGAS
cd SheetJSGAS
```

6) Clone the Apps Script project.  The official command is:

```bash
npx @google/clasp clone PASTE_YOUR_ID_HERE
```

Type `npx @google/clasp clone ` in the terminal with a trailing space (do not
press Enter yet!), then copy the Script ID from the Apps Script settings page
and paste in the terminal.  Press Enter after pasting the ID.

### Adding the SheetJS Library

7) Download the SheetJS Standalone script and move to the project directory:

<ul>
<li><a href={`https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}>xlsx.full.min.js</a></li>
</ul>

<CodeBlock language="bash">{`\
curl -LO https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}
</CodeBlock>

8) Push the project to Apps Script:

```bash
npx @google/clasp push
```

:::caution pass

If the Google Apps Script API is not enabled, the command will display an object
with `code: 403` and an error message about the Apps Script API:

```js
{ // ...
  code: 403,
  errors: [
    {
      message: 'User has not enabled the Apps Script API. Enable it by ...',
      domain: 'global',
      reason: 'forbidden'
    }
  ]
}
```

The message includes a URL (`https://script.google.com/home/usersettings` when
the demo was last tested). Visit that URL.

If the Google Apps Script API is "Off", click on "Google Apps Script API" and
click on the slider to enable the API.

After enabling the API, run `npx @google/clasp push` again.

:::

9) Reopen the Google Sheet and Apps Script editor (Extensions > Apps Script).

In the Files listing, there should be a new entry `xlsx.full.min.gs`

### Creating a Custom Function

10) In Apps Script editor, select `Code.gs` and erase the code in the editor.
Replace with the following function:

```js title="Code.gs"
function SHEETJS(url) {
  /* fetch data */
  const res = UrlFetchApp.fetch(url || "https://docs.sheetjs.com/pres.numbers");
  const content = res.getContent();

  /* fix data */
  for(var i = 0; i < content.length; ++i) content[i] &= 0xFF;

  /* parse */
  const wb = XLSX.read(content, {type: "array"});

  /* generate array of arrays from worksheet */
  const ws = wb.Sheets[wb.SheetNames[0]];
  const aoa = XLSX.utils.sheet_to_json(ws, {header: 1});
  return aoa;
}
```

Click the "Save Project" icon (💾) to save the project.

11) In the Google Sheets window, select cell A1 and enter the formula

```
=SHEETJS("https://docs.sheetjs.com/pres.numbers")
```

The file will be fetched and the contents will be written to the sheet.
