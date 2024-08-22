---
title: Electronic Mail
pagination_prev: demos/net/server/index
pagination_next: demos/net/headless/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

Electronic mail ("email" or "e-mail") is an essential part of modern business
workflows. Spreadsheets are commonly passed around and processed.

There are NodeJS and other server-side solutions for sending email with attached
spreadsheets as well as processing spreadsheets in inboxes.

This demo covers three workflows:

- [Sending mail](#sending-mail) covers libraries for sending messages
- [Reading mail](#reading-mail) covers libraries for reading messages
- [Data files](#data-files) covers mailbox file formats

:::danger pass

There are a number of caveats when dealing with live mail servers. It is advised
to follow connector module documentation carefully and test with new accounts
before integrating with important inboxes or accounts.

:::

## Live Servers

:::danger pass

It is strongly advised to use a test email address before using an important
address.  One small mistake could erase decades of messages or result in a block
or ban from Google services.

:::

### App Passwords

Many email providers (including Fastmail, GMail, and Yahoo Mail) require "app
passwords" or passwords for "less secure apps". Attempting to connect and send
using the account password will throw errors.

### Test Account

It is strongly recommended to first test with an independent service provider.

#### Fastmail

This demo will start with a free 30-day trial of Fastmail. At the time the demo
was last tested, no payment details were required.

:::caution pass

A valid phone number (for SMS verification) was required.

:::

0) Create a new Fastmail email account and verify with a mobile number.


_Create App Password_

1) Open the settings screen (click on the icon in the top-left corner of the
screen and select "Settings").

2) Select "Privacy & Security" in the left pane, then click "Integrations" near
the top of the main page.  Click "New app password".

3) Select any name in the top drop-down (the default "iPhone" can be used). In
the second drop-down, select "Mail (IMAP/POP/SMTP)". Click "Generate password".

A new password will be displayed. This is the app password that will be used in
the demo script. **Copy the displayed password or write it down.**

#### Gmail

This demo will start with a free Gmail account. At the time the demo was last
tested, no payment details were required.

:::caution pass

A valid phone number (for SMS verification and 2FA) was required.

:::

0) Create a new Gmail email account and verify with a mobile number.

_Create App Password_

1) Click the icon in the top-right corner and click "Manage your Google Account"

2) Click "Security" in the left column

3) Enable 2-Step Verification (if it is not currently enabled)

4) Click "2-Step Verification"

5) Click the right arrow (`>`) next to "App passwords".

6) Type a name ("SheetJS Test") and click "Create".

A new password will be displayed. This is the app password that will be used in
the demo script. **Copy the displayed password or write it down.**

## Operations

### Sending Mail

Many SheetJS users deploy the `nodemailer` module in production.

`nodemailer` supports NodeJS Buffer attachments generated from `XLSX.write`:

```js
/* write workbook to buffer */
// highlight-start
const buf = XLSX.write(workbook, {
  bookType: "xlsb", // <-- write XLSB file
  type: "buffer"    // <-- generate a buffer
});
// highlight-end

/* create a message */
const msg = { from: "*", to: "*", subject: "*", text: "*",
  attachments: [
// highlight-start
    {
      filename: "SheetJSMailExport.xlsb", // <-- filename
      content: buf                        // <-- data
    }
// highlight-end
  ]
}
```

:::caution pass

The file name must have the expected extension for the `bookType`!

["Supported Output Formats"](/docs/api/write-options#supported-output-formats)
includes a table showing the file extension required for each supported type.

:::

#### Send Demo

:::note Tested Deployments

This demo was tested in the following deployments:

| Email Provider | Date       | Library      | Version  |
|:---------------|:-----------|:-------------|:---------|
| `gmail.com`    | 2024-03-11 | `nodemailer` | `6.9.12` |
| `fastmail.com` | 2024-03-11 | `nodemailer` | `6.9.12` |

:::

0) Create a [new account](#test-account)

1) Create a new project and install dependencies:

<CodeBlock language="bash">{`\
mkdir sheetjs-send
cd sheetjs-send
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz nodemailer@6.9.12`}
</CodeBlock>

2) Save the following script to `SheetJSend.js`:

```js title="SheetJSend.js"
const XLSX = require('xlsx');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
// highlight-next-line
  service: 'fastmail',
  auth: {
// highlight-start
    user: '**',
    pass: '**'
// highlight-end
  }
});

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet([["Sheet","JS"], ["Node","Mailer"]]);
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

const buf = XLSX.write(wb, { bookType: "xlsb", type: "buffer" });

const mailOptions = {
// highlight-start
  from: "**",
  to: "**",
// highlight-end
  subject: "Attachment test",
  text: "if this succeeded, there will be an attachment",
  attachments: [{
    filename: "SheetJSMailExport.xlsb", // <-- filename
    content: buf                        // <-- data
  }]
}

transporter.sendMail(mailOptions, function (err, info) {
  if(err) console.log(err); else console.log(info);
});
```

3) Edit `SheetJSend.js` and replace the highlighted lines:

- `service: 'fastmail',` the value should be one of the supported providers[^1]
- `user: "**",` the value should be the sender email address
- `pass: "**"` the value should be the app password from earlier
- `from: "**",` the value should be the sender email address
- `to: "**",` the value should be your work or personal email address

4) Run the script:

```bash
node SheetJSend.js
```

If the process succeeded, the terminal will print a JS object with fields
including `accepted` and `response`. The recipient inbox should receive an email
shortly.  The email will include an attachment `SheetJSMailExport.xlsb` which
can be opened in Excel.

:::caution pass

The app password must be entered in step 3. If the account password was used,
the mailer will fail with a message that includes:

```
Sorry, you need to create an app password to use this service
```

:::

### Reading Mail

`imapflow` is a modern IMAP client library.

Parsing attachments is a multi-step dance:

1) Fetch a message and parse the body structure:

```js
let m = await client.fetchOne(client.mailbox.exists, { bodyStructure: true });
let children = message.bodyStructure.childNodes;
```

2) Find all attachments with relevant file extensions:

```js
for(let bs of message.bodyStructure.childNodes) {
  if(bs.disposition?.toLowerCase() != "attachment") continue;
  // look for attachments with certain extensions
  if(!/\.(numbers|xls[xbm]?)$/i.test(bs?.parameters?.name)) continue;
  await process_attachment(bs);
}
```

3) Download data and collect into a NodeJS Buffer:

```js
/* helper function to concatenate data from a stream */
const concat_RS = (stream) => new Promise((res, rej) => {
  var buffers = [];
  stream.on("data", function(data) { buffers.push(data); });
  stream.on("end", function() { res(Buffer.concat(buffers)); });
});
async function process_attachment(bs) {
  const { content } = await client.download('*', bs.part);
  /* content is a stream */
  const buf = await concat_RS(content);
  return process_buf(buf, bs.parameters.name);
}
```

4) Parse Buffer with `XLSX.read`:

```js
function process_buf(buf, name) {
  const wb = XLSX.read(buf);
  /* DO SOMETHING WITH wb HERE */
  // print file name and CSV of first sheet
  const wsname = wb.SheetNames[0];
  console.log(name);
  console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wsname]));
}
```

#### Receive Demo

:::note Tested Deployments

This demo was tested in the following deployments:

| Email Provider | Date       | Library    | Version   |
|:---------------|:-----------|:-----------|:----------|
| `gmail.com`    | 2024-03-11 | `imapflow` | `1.0.156` |
| `fastmail.com` | 2024-03-11 | `imapflow` | `1.0.156` |

:::

0) Create a [new account](#test-account)

1) Create a new project and install dependencies:

<CodeBlock language="bash">{`\
mkdir sheetjs-recv
cd sheetjs-recv
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz imapflow@1.0.156`}
</CodeBlock>

2) Save the following script to `SheetJSIMAP.js`:

```js title="SheetJSIMAP.js"
const XLSX = require('xlsx');
const { ImapFlow } = require('imapflow');

const client = new ImapFlow({
// highlight-next-line
  host: 'imap.fastmail.com',
  port: 993, secure: true, logger: false,
  auth: {
// highlight-start
    user: '**',
    pass: '**'
// highlight-end
  }
});

const concat_RS = (stream)  => new Promise((res, rej) => {
  var buffers = [];
  stream.on("data", function(data) { buffers.push(data); });
  stream.on("end", function() { res(Buffer.concat(buffers)); });
});

(async() => {
  await client.connect();
  let lock = await client.getMailboxLock('INBOX'); // INBOX
  try {
    // fetch latest message source with body structure
    let message = await client.fetchOne(client.mailbox.exists, { bodyStructure: true });
    for(let bs of message.bodyStructure.childNodes) {
      if(bs.disposition?.toLowerCase() != "attachment") continue;
      // look for attachments with certain extensions
      if(!/\.(numbers|xls[xbm]?)$/i.test(bs?.parameters?.name)) continue;

      // download data
      const { content } = await client.download('*', bs.part);
      const buf = await concat_RS(content);

      // parse
      const wb = XLSX.read(buf);

      // print file name and CSV of first sheet
      const wsname = wb.SheetNames[0];
      console.log(bs.parameters.name);
      console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wsname]));
    }
  } finally { lock.release(); }
  await client.logout();
})();
```

3) Edit `SheetJSIMAP.js` and replace the highlighted lines:

- `user: "**",` the value should be the account address
- `pass: "**"` the value should be the app password from earlier
- `host: 'imap.fastmail.com',` the value should be the host name:

| Service        | `host` value        |
|:---------------|:--------------------|
| `gmail.com`    | `imap.gmail.com`    |
| `fastmail.com` | `imap.fastmail.com` |

4) Download https://docs.sheetjs.com/pres.numbers . Using a different account,
send an email to the test account and attach the file. At the end of this step,
the test account should have an email in the inbox that has an attachment.

5) Run the script:

```bash
node SheetJSIMAP.js
```

The output should include the file name (`pres.numbers`) and the CSV:

```
pres.numbers
Name,Index
Bill Clinton,42
GeorgeW Bush,43
Barack Obama,44
Donald Trump,45
Joseph Biden,46
```

## Data Files

Electronic discovery commonly involves email spelunking. There are a number of
proprietary mail and email account file formats.

### PST

**[The exposition has been moved to a separate page.](/docs/demos/net/email/pst)**

[^1]: The list of services can be found in [`lib/well-known/services.json`](https://github.com/nodemailer/nodemailer/blob/master/lib/well-known/services.json) in the NodeMailer project.
