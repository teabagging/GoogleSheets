---
title: Amazon Web Services
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[Amazon Web Services](https://aws.amazon.com/) (AWS) is a cloud services
platform which includes traditional virtual machine support, "Serverless
Functions" and cloud storage.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo explores two key AWS offerings:

- ["Lambda Functions"](#lambda-functions) ("Lambda") explores the serverless
  computing offering. The demo creates a JavaScript function that can process
  user-submitted files and generate spreadsheets.

- ["S3 Storage"](#s3-storage) explores the cloud storage ("S3") offering. The
  demo uses the NodeJS connection library to read spreadsheets from S3 and write
  spreadsheets to a S3 bucket.

:::caution pass

AWS iterates quickly and there is no guarantee that the referenced services
will be available in the future.

:::

:::note Tested Deployments

This demo was last tested on 2024 June 13.

:::

## Lambda Functions

AWS offers NodeJS runtimes for running JavaScript serverless functions.[^1]

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required in Lambda functions. When deploying, the entire `node_modules` folder
can be added to the ZIP package.

:::note pass

In this demo, the "Function URL" (automatic API Gateway management) features
are used.  Older deployments required special "Binary Media Types" to handle
formats like XLSX.  At the time of testing, the configuration was not required.

:::

:::info pass

Node.js runtime can use `x86_64` or `arm64` CPU architectures. SheetJS libraries
work on both platforms in Linux, Windows, and macOS operating systems.

:::

### Reading Data

In the Lambda handler, the `event.body` attribute is a Base64-encoded string
representing the HTTP request form data. This body must be parsed.

#### Processing Form Bodies

The `busboy` body parser[^2] is battle-tested in NodeJS deployments.

`busboy` fires a `'file'` event for every file in the form body. The callback
receives a NodeJS stream that should be collected into a Buffer:

```js
/* accumulate the files manually */
var files = {};
bb.on('file', function(fieldname, file, filename) {
  /* concatenate the individual data buffers */
  var buffers = [];
  file.on('data', function(data) { buffers.push(data); });
  file.on('end', function() { files[fieldname] = Buffer.concat(buffers); });
});
```

`busboy` fires a `'finish'` event when the body parsing is finished. Callbacks
can assume every file in the form body has been stored in NodeJS Buffer objects.

#### Processing NodeJS Buffers

The SheetJS `read` method[^3] can read the Buffer objects and generate SheetJS
workbook objects[^4] which can be processed with other API functions.

For example, a handler can use `sheet_to_csv`[^5] to generate CSV text:

```js
/* on the finish event, all of the fields and files are ready */
bb.on('finish', function() {
  /* grab the first file */
  var f = files["upload"];
  if(!f) callback(new Error("Must submit a file for processing!"));

  /* f[0] is a buffer */
  // highlight-next-line
  var wb = XLSX.read(f[0]);

  /* grab first worksheet and convert to CSV */
  var ws = wb.Sheets[wb.SheetNames[0]];
  callback(null, { statusCode: 200, body: XLSX.utils.sheet_to_csv(ws) });
});
```

<details>
  <summary><b>Complete Code Sample</b> (click to show)</summary>

This example takes the first uploaded file submitted with the key `upload`,
parses the file and returns the CSV content of the first worksheet.

```js
const XLSX = require('xlsx');
var Busboy = require('busboy');

exports.handler = function(event, context, callback) {
  /* set up busboy */
  var ctype = event.headers['Content-Type']||event.headers['content-type'];
  var bb = Busboy({headers:{'content-type':ctype}});

  /* busboy is evented; accumulate the fields and files manually */
  var fields = {}, files = {};
  bb.on('error', function(err) { callback(null, { body: err.message }); });
  bb.on('field', function(fieldname, val) {fields[fieldname] = val });
  // highlight-start
  bb.on('file', function(fieldname, file, filename) {
    /* concatenate the individual data buffers */
    var buffers = [];
    file.on('data', function(data) { buffers.push(data); });
    file.on('end', function() { files[fieldname] = [Buffer.concat(buffers), filename]; });
  });
  // highlight-end

  /* on the finish event, all of the fields and files are ready */
  bb.on('finish', function() {
    /* grab the first file */
    var f = files["upload"];
    if(!f) callback(new Error("Must submit a file for processing!"));

    /* f[0] is a buffer */
    // highlight-next-line
    var wb = XLSX.read(f[0]);

    /* grab first worksheet and convert to CSV */
    var ws = wb.Sheets[wb.SheetNames[0]];
    callback(null, { statusCode: 200, body: XLSX.utils.sheet_to_csv(ws) });
  });

  /* start the processing */
  // highlight-next-line
  bb.end(Buffer.from(event.body, "base64"));
};
```

</details>

### Writing Data

For safely transmitting binary data, Base64 strings should be used.

The SheetJS `write` method[^6] with the option `type: "base64"` will generate
Base64-encoded strings.

```js
/* sample SheetJS workbook object */
var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", {type: "binary"});
/* write to XLSX file in Base64 encoding */
var b64 = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
```

The Lambda callback response function accepts options. Setting `isBase64Encoded`
to `true` will ensure the callback handler decodes the data. To ensure browsers
will try to download the response, the `Content-Disposition` header must be set:

```js
callback(null, {
  statusCode: 200,
  /* Base64-encoded file */
  isBase64Encoded: true,
  body: b64,
  headers: {
    /* Browsers will treat the response as the file SheetJSLambda.xlsx */
    "Content-Disposition": 'attachment; filename="SheetJSLambda.xlsx"'
  }
});
```

<details>
  <summary><b>Complete Code Sample</b> (click to show)</summary>

This example creates a sample workbook object and sends the file in the response:

```js
var XLSX = require('xlsx');

exports.handler = function(event, context, callback) {
  /* make workbook */
  var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", {type: "binary"});
  /* write to XLSX file in Base64 encoding */
  // highlight-next-line
  var body = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
  /* mark as attached file */
  var headers = { "Content-Disposition": 'attachment; filename="SheetJSLambda.xlsx"'};
  /* Send back data */
  callback(null, {
    statusCode: 200,
    // highlight-next-line
    isBase64Encoded: true,
    body: body,
    headers: headers
  });
};
```

</details>

### Lambda Demo

:::note pass

At the time of writing, the AWS Free Tier included an allowance of 1 million
free requests per month and 400 thousand GB-seconds of compute resources.

:::

0) If you do not have an account, create a new AWS free tier account[^7].

#### Create Project ZIP

1) Create a new project folder:

```bash
mkdir -p SheetJSLambda
cd SheetJSLambda
```

2) Download [`index.js`](pathname:///aws/index.js):

```bash
curl -LO https://docs.sheetjs.com/aws/index.js
```

3) Install the SheetJS NodeJS module and `busboy` dependency:

<CodeBlock language="bash">{`\
mkdir -p node_modules
npm i https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz busboy`}
</CodeBlock>

4) Create a .zip package of the contents of the folder:

```bash
zip -c ../SheetJSLambda.zip -r .
```

#### Lambda Setup

5) Sign into the [AWS Management Console](https://aws.amazon.com/console/) with
a root user account.

6) Type "Lambda" in the top search box and click Lambda (under Services).

![AWS search for "Lambda"](pathname:///aws/lambda.png)

7) Open "Functions" in the left sidebar.

If the left sidebar is not open, click the `≡` icon in the left edge of the page.

8) Click the "Create function" button in the main panel.

9) Select the following options:

- In the top list, select "Author from scratch" (default choice)

- Type a memorable "Function Name" ("SheetJSLambda" when last tested)

- In the "Runtime" dropdown, look for the "Latest supported" section and select
  "Node.js" ("Node.js 20.x" when last tested)

- Expand "Advanced Settings" and check "Enable function URL". This will display
  a few sub-options:
  + "Auth type" select "NONE" (disable IAM authentication)
  + Check "Configure cross-origin resource sharing (CORS)"

10) Click "Create function" to create the function.

#### Upload Code

11) In the Interface, scroll down and select the "Code" tab.

12) Click the "Upload from" dropdown and select ".zip file".

13) Click the "Upload" button in the modal. With the file picker, select the
`SheetJSLambda.zip` file created in step 3. Click "Save".

:::note pass
When the demo was last tested, the ZIP was small enough that the Lambda code
editor will load the package.

:::

14) In the code editor, double-click `index.js` and confirm the code editor
displays JavaScript code.

#### External Access

15) Click "Configuration" in the tab list.

16) In the sidebar below the tab list, select "Function URL" and click "Edit".

17) Set the "Auth type" to "NONE" and click Save. The page will redirect to the
Function properties.

18) Select the "Configuration" tab and select "Permissions" in the left sidebar.

19) Scroll down to "Resource-based policy statements" and ensure that
`FunctionURLAllowPublicAccess` is listed.

If no policy statements are defined, select "Add Permission" with the options:

- Select "Function URL" at the top
- Auth type: NONE
- Ensure that Statement ID is set to `FunctionURLAllowPublicAccess`
- Ensure that Principal is set to `*`
- Ensure that Action is set to `lambda:InvokeFunctionUrl`

Click "Save" and a new Policy statement should be created.

#### Lambda Testing

19) Find the Function URL (It is in the "Function Overview" section).

20) Try to access the function URL in a web browser.

The site will attempt to download `SheetJSLambda.xlsx`.  Save and open the file
to confirm it is valid.

21) Download https://docs.sheetjs.com/pres.numbers and make a POST request to
the public function URL.

This can be tested on the command line. Change `FUNCTION_URL` in the commands:

```bash
curl -LO https://docs.sheetjs.com/pres.numbers
curl -X POST -F "upload=@pres.numbers" FUNCTION_URL
```

The terminal will display CSV output of the first sheet.

## S3 Storage

The main NodeJS module for S3 and all AWS services is `aws-sdk`[^8].

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
required in NodeJS scripts.

### Connecting to S3

The `aws-sdk` module exports a function `S3` that performs the connection. The
function expects an options object that includes an API version and credentials.
Access keys for an IAM user[^9] must be used:

```js
/* credentials */
var accessKeyId = "...", secretAccessKey = "..."";

/* file location */
var Bucket = "...", Key = "pres.numbers";

/* connect to s3 account */
var AWS = require('aws-sdk');
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  credentials: { accessKeyId, secretAccessKey }
});
```

### Downloading Data

#### Fetching Files from S3

The `s3#getObject` method returns an object with a `createReadStream` method.
`createReadStream` returns a NodeJS stream:

```js
/* open stream to the file */
var stream = s3.getObject({ Bucket: Bucket, Key: Key }).createReadStream();
```

#### Concatenating NodeJS Streams

Buffers can be concatenated from the stream into one unified Buffer object:

```js
/* array of buffers */
var bufs = [];
/* add each data chunk to the array */
stream.on('data', function(data) { bufs.push(data); });
/* the callback will be called after all of the data is collected */
stream.on('end', function() {
  /* concatenate */
  var buf = Buffer.concat(bufs);

  /* AT THIS POINT, `buf` is a NodeJS Buffer */
});
```

#### Parsing NodeJS Buffers

The SheetJS `read` method[^10] can read the final object and generate SheetJS
workbook objects[^11] which can be processed with other API functions.

For example, a callback can use `sheet_to_csv`[^12] to generate CSV text:

```js
stream.on('end', function() {
  /* concatenate */
  var buf = Buffer.concat(bufs);

  /* parse */
  var wb = XLSX.read(Buffer.concat(bufs));

  /* generate CSV from first worksheet */
  var first_ws = wb.Sheets[wb.SheetNames[0]];
  var csv = XLSX.utils.sheet_to_csv(first_ws);
  console.log(csv);
});
```

### Uploading Data

The SheetJS `write` method[^13] with the option `type: "buffer"` will generate
NodeJS Buffers. `S3#upload` directly accepts these Buffer objects.

This example creates a sample workbook object, generates XLSX file data in a
NodeJS Buffer, and uploads the data to S3:

```js
/* generate sample workbook */
var wb = XLSX.read("S,h,e,e,t,J,S\n5,4,3,3,7,9,5", {type: "binary"});

/* write to XLSX file in a NodeJS Buffer */
var Body = XLSX.write(wb, {type: "buffer", bookType: "xlsx"});

/* upload buffer */
s3.upload({ Bucket, Key, Body }, function(err, data) {
  if(err) throw err;
  console.log("Uploaded to " + data.Location);
});
```

### S3 Demo

:::note pass

At the time of writing, the AWS Free Tier included 5GB of S3 storage with 20,000
Get requests and 2000 Put requests per month.

:::

This sample fetches a buffer from S3 and parses the workbook.

0) If you do not have an account, create a new AWS free tier account[^14].

#### Create S3 Bucket

1) Sign into the [AWS Management Console](https://aws.amazon.com/console/) with
a root user account.

2) Type "S3" in the top search box and click S3 (under Services).

![AWS search for "S3"](pathname:///aws/S3.png)

3) Open "Buckets" in the left sidebar.

If the left sidebar is not open, click the `≡` icon in the left edge of the page.

4) Click the "Create bucket" button in the main panel.

5) Select the following options:

- Type a memorable "Bucket Name" ("sheetjsbouquet" when last tested)

- In the "Object Ownership" section, select "ACLs disabled"

- Check "Block *all* public access"

- Look for the "Bucket Versioning" section and select "Disable"

6) Click "Create bucket" to create the bucket.

#### Create IAM User

7) Type "IAM" in the top search box and click IAM (under Services).

![AWS search for "iam"](pathname:///aws/iam.png)

8) Open "Users" in the left sidebar.

If the left sidebar is not open, click the `≡` icon in the left edge of the page.

9) Click the "Create user" button in the main panel.

10) In step 1, type a memorable "Bucket Name" ("sheetjs-user" when last tested).
Click "Next".

11) In step 2, click "Next"

12) In step 3, click "Create user" to create the user.

#### Add Permissions

13) Click the new user name in the Users table.

14) Select the "Permissions" tab

15) Click the "Add permissions" dropdown and select "Add permissions".

16) Select "Attach policies directly".

17) In the "Permissions policies" section, search for "AmazonS3FullAccess".
There should be one entry.

![AWS search for "AmazonS3FullAccess"](pathname:///aws/perm.png)

18) Check the checkbox next to "AmazonS3FullAccess" and click the "Next" button.

19) In the "Review" screen, click "Add permissions"

#### Generate Keys

20) Click "Security credentials", then click "Create access key".

21) Select the "Local code" option. Check "I understand the above recommendation
and want to proceed to create an access key." and click "Next"

22) Click "Create Access Key" and click "Download .csv file" in the next screen.

In the generated CSV:

- Cell A2 is the "Access key ID" (`accessKeyId` in the AWS API)
- Cell B2 is the "Secret access key" (`secretAccessKey` in the AWS API)

#### Set up Project

23) Create a new NodeJS project:

```bash
mkdir SheetJSS3
cd SheetJSS3
npm init -y
```

24) Install dependencies:

<CodeBlock language="bash">{`\
mkdir -p node_modules
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz aws-sdk@2.1467.0`}
</CodeBlock>

#### Write Test

:::note pass

This sample creates a simple workbook, generates a NodeJS buffer, and uploads
the buffer to S3.

```
   | A | B | C | D | E | F | G |
---+---|---|---|---|---|---|---|
 1 | S | h | e | e | t | J | S |
 2 | 5 | 4 | 3 | 3 | 7 | 9 | 5 |
```

:::

25) Save the following script to `SheetJSWriteToS3.js`:

```js title="SheetJSWriteToS3.js"
var XLSX = require("xlsx");
var AWS = require('aws-sdk');

/* replace these constants */
// highlight-start
var accessKeyId = "<REPLACE WITH ACCESS KEY ID>";
var secretAccessKey = "<REPLACE WITH SECRET ACCESS KEY>";
var Bucket = "<REPLACE WITH BUCKET NAME>";
// highlight-end

var Key = "test.xlsx";

/* Create a simple workbook and write XLSX to buffer */
var ws = XLSX.utils.aoa_to_sheet(["SheetJS".split(""), [5,4,3,3,7,9,5]]);
var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
var Body = XLSX.write(wb, {type: "buffer", bookType: "xlsx"});

/* upload buffer */
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});
s3.upload({ Bucket: Bucket, Key: Key, Body: Body }, function(err, data) {
  if(err) throw err;
  console.log("Uploaded to " + data.Location);
});
```

26) Edit `SheetJSWriteToS3.js` and replace the highlighted lines:

- `accessKeyId`: access key for the AWS account
- `secretAccessKey`: secret access key for the AWS account
- `Bucket`: name of the bucket

The keys are found in the CSV from step 22. The Bucket is the name from step 5.

27) Run the script:

```bash
node SheetJSWriteToS3.js
```

This file will be stored with the object name `test.xlsx`. It can be manually
downloaded from the S3 web interface.

#### Read Test

This sample will download and process the test file from "Write Test".

28) Save the following script to `SheetJSReadFromS3.js`:

```js title="SheetJSReadFromS3.js"
var XLSX = require("xlsx");
var AWS = require('aws-sdk');

/* replace these constants */
// highlight-start
var accessKeyId = "<REPLACE WITH ACCESS KEY ID>";
var secretAccessKey = "<REPLACE WITH SECRET ACCESS KEY>";
var Bucket = "<REPLACE WITH BUCKET NAME>";
// highlight-end

var Key = "test.xlsx";

/* Get stream */
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
  }
});
var f = s3.getObject({ Bucket: Bucket, Key: Key }).createReadStream();

/* collect data */
var bufs = [];
f.on('data', function(data) { bufs.push(data); });
f.on('end', function() {
  /* concatenate and parse */
  var wb = XLSX.read(Buffer.concat(bufs));
  console.log(XLSX.utils.sheet_to_csv(wb.Sheets[wb.SheetNames[0]]));
});
```

29) Edit `SheetJSReadFromS3.js` and replace the highlighted lines:

- `accessKeyId`: access key for the AWS account
- `secretAccessKey`: secret access key for the AWS account
- `Bucket`: name of the bucket

The keys are found in the CSV from Step 22. The Bucket is the name from Step 5.

30) Run the script:

```bash
node SheetJSReadFromS3.js
```

The program will display the data in CSV format.

```
S,h,e,e,t,J,S
5,4,3,3,7,9,5
```

[^1]: See ["Building Lambda functions with Node.js"](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html) in the AWS documentation
[^2]: The `busboy` module is distributed [on the public NPM registry](https://npm.im/busboy)
[^3]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^4]: See ["Workbook Object" in "SheetJS Data Model"](/docs/csf/book) for more details.
[^5]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^6]: See [`write` in "Writing Files"](/docs/api/write-options)
[^7]: Registering for a free account [on the AWS Free Tier](https://aws.amazon.com/free/) requires a valid phone number and a valid credit card.
[^8]: The `aws-sdk` module is distributed [on the public NPM registry](https://npm.im/aws-sdk)
[^9]: See ["Managing access keys for IAM users"](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html) in the AWS documentation
[^10]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^11]: See ["Workbook Object" in "SheetJS Data Model"](/docs/csf/book) for more details.
[^12]: See [`sheet_to_csv` in "CSV and Text"](/docs/api/utilities/csv#delimiter-separated-output)
[^13]: See [`write` in "Writing Files"](/docs/api/write-options)
[^14]: Registering for a free account [on the AWS Free Tier](https://aws.amazon.com/free/) requires a valid phone number and a valid credit card.