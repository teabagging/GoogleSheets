---
title: Sheets with MongoDB
sidebar_label: MongoDB / FerretDB
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  type: document
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

[MongoDB](https://mongodb.github.io/node-mongodb-native/) is a document-oriented
database engine.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses SheetJS to exchange data between spreadsheets and MongoDB. We'll
explore how to use save tables from a MongoDB collection to spreadsheets and how
to add data from spreadsheets into a collection.

:::note Tested Deployments

This demo was tested in the following environments:

| Server              | Connector Library   | Date       |
|:--------------------|:--------------------|:-----------|
| FerretDB `1.21.0`   | `mongodb` (`5.9.2`) | 2024-03-30 |
| MongoDB CE `6.0.15` | `mongodb` (`6.5.0`) | 2024-05-01 |
| MongoDB CE `7.0.8`  | `mongodb` (`6.5.0`) | 2024-05-01 |

:::

## Integration Details

The [SheetJS NodeJS module](/docs/getting-started/installation/nodejs) can be
loaded in NodeJS scripts that use the `mongodb` NodeJS connector library.

It is straightforward to treat collections as worksheets.  Each object maps to
a row in the table.

#### Importing Data

Data stored in an array of objects can be added to MongoDB Collections using
`Collection#insertMany`[^1]. The SheetJS `sheet_to_json` method[^2] can generate
data from worksheets:

```js
/* import data from a worksheet to a collection */
const aoo = XLSX.utils.sheet_to_json(ws);
await collection.insertMany(aoo, {ordered: true});
```

Typically worksheet objects are extracted from workbook objects[^3] generated
from the SheetJS `read` or `readFile` methods[^4].

#### Exporting Data

`Collection#find`[^5] can pull an array of objects from a Mongo Collection.

The SheetJS `json_to_sheet` method[^6] can take the result and generate a
worksheet object.

:::info pass

Normally the method adds a `_id` field to each object.  The recommended way to
remove the field is to use a `projection` to suppress the ID.

:::

```js
/* generate an array of objects from a collection */
const aoo = await collection.find({}, {projection:{_id:0}}).toArray();

/* generate a worksheet from a collection */
const ws = utils.json_to_sheet(aoo);
```

Using `book_new` and `book_append_sheet`[^7], a workbook object can be created.
This workbook is typically exported to the filesystem with `writeFile`[^8].

## Complete Example

0) Install a MongoDB-compatible server. Options include MongoDB CE[^9] and
FerretDB[^10]

1) Start a server on `localhost` (follow official instructions).

<details>
  <summary><b>MongoDB CE Setup</b> (click to show)</summary>

For MongoDB 7.0 Community Edition, the macOS steps required `brew`:

```bash
brew tap mongodb/brew
brew update
brew install mongodb-community
```

Older versions can be installed by passing the version major and minor numbers:

```bash
# Install 6.0
brew install mongodb-community@6.0
```

:::note pass

If `brew` was used to install MongoDB, the following command starts a server:

```bash
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

If Homebrew is configured to use `/opt/homebrew`, the command is:

```bash
/opt/homebrew/opt/mongodb-community/bin/mongod --config /opt/homebrew/etc/mongod.conf
```

:::

</details>

2) Create base project and install the dependencies:

<CodeBlock language="bash">{`\
mkdir sheetjs-mongo
cd sheetjs-mongo
npm init -y
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz mongodb@6.5.0`}
</CodeBlock>

3) Save the following to `SheetJSMongoCRUD.mjs` (the key step is highlighted):

```js title="SheetJSMongoCRUD.mjs"
import { writeFile, set_fs, utils } from 'xlsx';
import * as fs from 'fs'; set_fs(fs);
import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017/sheetjs';
const db_name = 'sheetjs';

/* Connect to mongodb server */
const client = await MongoClient.connect(url, { useUnifiedTopology: true });

/* Sample data table */
const db = client.db(db_name);
try { await db.collection('pres').drop(); } catch(e) {}
const pres = db.collection('pres');
await pres.insertMany([
  { name: "Barack Obama", idx: 44 },
  { name: "Donald Trump", idx: 45 },
  { name: "Joseph Biden", idx: 46 }
], {ordered: true});

// highlight-start
/* Create worksheet from collection */
const aoo = await pres.find({}, {projection:{_id:0}}).toArray();
const ws = utils.json_to_sheet(aoo);
// highlight-end

/* Export to XLSX */
const wb = utils.book_new();
utils.book_append_sheet(wb, ws, "Presidents");
writeFile(wb, "SheetJSMongoCRUD.xlsx");

/* Close connection */
client.close();
```

This script:

- connects to the local MongoDB server using database `sheetjs`
- removes the `pres` collection if it already exists
- creates a new collection `pres` with sample data
- creates a SheetJS worksheet from the collection (highlighted in the snippet)
- creates a SheetJS workbook, adds the worksheet, and exports to XLSX

4) Run the script:

```bash
node SheetJSMongoCRUD.mjs
```

There should be no errors in the terminal. The script will generate the file
`SheetJSMongoCRUD.xlsx`. That file can be opened in a spreadsheet editor.

[^1]: See [`insertMany`](https://mongodb.github.io/node-mongodb-native/5.7/classes/Collection.html#insertMany) in the MongoDB documentation.
[^2]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^3]: See ["Workbook Object"](/docs/csf/book)
[^4]: See [`read` and `readFile` in "Reading Files"](/docs/api/parse-options)
[^5]: See [`find`](https://mongodb.github.io/node-mongodb-native/5.7/classes/Collection.html#find) in the MongoDB documentation.
[^6]: See [`json_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-objects-input)
[^7]: See ["Workbook Helpers" in "Utilities"](/docs/api/utilities/wb) for details on `book_new` and `book_append_sheet`.
[^8]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^9]: See ["Install MongoDB Community Edition"](https://www.mongodb.com/docs/manual/administration/install-community/#std-label-install-mdb-community-edition) in the MongoDB documentation.
[^10]: See ["SQLite Setup with Docker Compose"](https://docs.ferretdb.io/quickstart-guide/docker/#sqlite-setup-with-docker-compose) in the FerretDB documentation.