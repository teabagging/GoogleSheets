---
title: Redis Databases Wrapped in Sheets
sidebar_label: Redis / KeyDB
description: Store complex datasets in Redis. Seamlessly save data to spreadsheets and read data from sheets using SheetJS. Enable Excel spreadsheet experts to update content.
pagination_prev: demos/cli/index
pagination_next: demos/local/index
sidebar_custom_props:
  type: nosql
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

:::danger pass

**Redis has relicensed away from open source!**

The original BSD-3-Clause still applies to version `7.2.4`.

This demo has been tested with KeyDB and other servers that support the "Redis
serialization protocol" (RESP).

:::

[KeyDB](https://docs.keydb.dev/) is a Redis-compatible in-memory data store. It
is capable of storing sets, lists and other simple data structures.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo defines a schema for storing Redis databases in spreadsheets. We'll
explore how to use SheetJS and Redis NodeJS connector modules to pull data
from XLSX files to a Redis database and to serialize a database to a workbook.

:::note Tested Deployments

This demo was tested in the following environments:

| Server         | Connector Module   |    Date    |
|:---------------|:-------------------|:----------:|
| KeyDB `6.3.4`  | `redis` (`4.6.13`) | 2024-04-23 |
| Redis `6.2.14` | `redis` (`4.6.13`) | 2024-04-23 |
| Redis `7.2.4`  | `redis` (`4.6.13`) | 2024-04-23 |
| Valkey `7.2.5` | `redis` (`4.6.13`) | 2024-04-23 |

:::

#### Overview

Redis has 5 core data types: "String", List", "Set", "Sorted Set", and "Hash".
Since the keys and values are limited to simple strings (and numbers), it is
possible to store complete databases in a single worksheet.

![SheetJSRedis.xlsx](pathname:///nosql/sheetjsredis.png)

## Integration Details

:::note pass

[`SheetJSRedis.mjs`](pathname:///nosql/SheetJSRedis.mjs) exports the methods:
- `redis_to_ws` creates a SheetJS worksheet by querying a redis client
- `ws_to_redis` creates an array of query objects from the SheetJS worksheet

:::

### Array of Arrays

The shared data representation is an "array of arrays"[^1]. Each array within
the structure corresponds to one row.

The Redis to SheetJS converter generates an array of arrays of the data by
running queries to fetch data from the database. The SheetJS `aoa_to_sheet` and
`sheet_add_aoa`[^2] methods build up worksheets from arrays of arrays. Once the
worksheet is created, it can be added to a SheetJS workbook object[^3] and
exported using `writeFile`[^4].

The SheetJS to Redis converter works in reverse. Workbook files are parsed with
the SheetJS `readFile` method[^5] and the desired worksheet is pulled from the
workbook object. An array of arrays can be created with the `sheet_to_json`[^6]
utility function. The data structure can be scanned to generate Redis queries.

### Appending Columns

Since the data is column-oriented, the goal is to add the data starting on the
first row of the column after the data.

To calculate the starting point for writing data, SheetJS provides `encode_cell`
and `decode_range` utility functions for working with addresses and ranges[^7].

The following snippet takes an array of arrays of values and writes the values
to a worksheet starting from the column after the worksheet range:

```js
function add_aoa_to_next_column(worksheet, aoa) {
  /* get range of worksheet */
  const range = XLSX.utils.decode_range(worksheet["!ref"])
  /* the origin to write new data will start in the column after the range */
  const origin = XLSX.utils.encode_cell({
    r: 0, // start on first row
    c: range.e.c + 1 // column after end
  });
  /* add data */
  XLSX.utils.sheet_add_aoa(worksheet, aoa, { origin });
}
```

### Strings

Strings can be stored in a unified String table. The first column holds keys
and the second column holds values:

```
XXX|    A    |   B   |
---+---------+-------+
 1 | Strings |       |
 2 |         |       |
 3 | Hello   | World |
 4 | Sheet   | JS    |
```

The SheetJS array-of-arrays representation of the string table is an array of
key/value pairs.

The pairs can be generated from Redis by querying for all of the keys using the
`KEYS`[^8] method, testing if the corresponding value is a string using the
`TYPE`[^9] method, and fetching string values using the `GET`[^10] method:

```js
const aoa = ["Strings"]; aoa.length = 2; // [ "Strings", empty ]
const keys = await client.KEYS("*");
for(let key of keys) {
  const type = await client.TYPE(key);
  // highlight-start
  if(type == "string") aoa.push([key, await client.GET(key)]);
  // highlight-end
}
```

### Lists

Lists are unidimensional and can be stored in their own columns.

```
XXX|    C    |
---+---------+
 1 | List    |
 2 | List1   |
 3 | List1V1 |
 4 | List1V2 |
```

The SheetJS array-of-arrays representation of lists is a column of values.

Redis `LRANGE`[^11] returns a simple array of values. `sheet_add_aoa` interprets
the result as one row, so the data should be transposed.

The code transposes the result with `values.map(v => [v])`.

```js
const values = await client.LRANGE(key, 0, -1);
const aoa = [ ["List"], [key] ].concat(values.map(v => [v]));
```

### Sets

Sets are unidimensional and can be stored in their own columns.

```
XXX|   D   |
---+-------+
 1 | Set   |
 2 | Set1  |
 3 | Set1A |
 4 | Set1B |
```

The SheetJS array-of-arrays representation of sets is a column of values.

Redis `SMEMBERS`[^12] returns an array of values. `sheet_add_aoa` interprets the
result as one row, so the data should be transposed.

The code transposes the result with `values.map(v => [v])`.

```js
const values = await client.SMEMBERS(key);
const aoa = [ ["Set"], [key] ].concat(values.map(v => [v]));
```

### Sorted Sets

Sorted Sets have an associated score which can be stored in the second column.

```
XXX|    E    | F |
---+---------+---+
 1 | Sorted  |   |
 2 | ZSet1   |   |
 3 | Key1    | 1 |
 4 | Key2    | 2 |
```

The SheetJS array-of-arrays representation is an array of key/score pairs.

`ZRANGE_WITHSCORES`[^13] returns an array of objects which can be reshaped.

```js
const values = await client.ZRANGE_WITHSCORES(key, 0, -1);
const aoa = [ ["Sorted"], [key] ].concat(values.map(v => [v.value, v.score]));
```

### Hashes

Hashes are stored like the string table, with key and value columns in order.

```
XXX|   G   |   H   |
---+-------+-------+
 1 | Hash  |       |
 2 | Hash1 |       |
 3 | Key1  | Val1  |
 4 | Key2  | Val2  |
```

The SheetJS array-of-arrays representation is an array of key/value pairs.

`HGETALL`[^14] returns an object which can be converted using `Object.entries`:

```js
const values = await client.HGETALL(key);
const aoa = [ ["Hash"], [key] ].concat(Object.entries(values));
```

## Complete Example

:::danger pass

The most recent version of the `redis` node module does not work with most
versions of NodeJS. It is "ESM-only", requiring NodeJS 18 or later. As a result,
this demo also requires NodeJS version 18 or later.

:::

0) Set up and start a local Redis-compatible server.

<details>
  <summary><b>Redis-compatible servers</b> (click to show)</summary>

This demo was last tested on macOS.

_KeyDB_

KeyDB was installed with:

```bash
brew install keydb@6.3.4
```

The following command started the server process:

```bash
keydb-server --protected-mode no
```

_Valkey_

Valkey was installed with:

```bash
brew install valkey
```

:::caution pass

The Valkey formula will create symlinks to `redis-server` and other commands.
This conflicts with the main `redis` package. `redis` must be unlinked:

```bash
brew unlink redis
brew link valkey
```

:::

The following command started the server process:

```bash
redis-server /usr/local/etc/redis.conf
```

_Redis 6_

Redis 6 was installed with:

```bash
brew install redis@6.2
```

The following command started the server process:

```bash
redis-server /usr/local/etc/redis.conf
```

_Redis 7_

Redis 7 was installed with:

```bash
brew install redis@7.2
```

The following command started the server process:

```bash
redis-server /usr/local/etc/redis.conf
```

:::danger pass

When the demo was last tested, Redis 7.2.4 was installed. The output from the
Redis server will display the version number:

```
69385:C 23 Apr 2024 13:24:48.520 * Redis version=7.2.4, bits=64, commit=00000000, modified=0, pid=69385, just started
```

Please raise an issue with Homebrew if a later version is installed.

:::

</details>

1) Download the following scripts:

- [`SheetJSRedis.mjs`](pathname:///nosql/SheetJSRedis.mjs)
- [`SheetJSRedisTest.mjs`](pathname:///nosql/SheetJSRedisTest.mjs)

```bash
curl -LO https://docs.sheetjs.com/nosql/SheetJSRedis.mjs
curl -LO https://docs.sheetjs.com/nosql/SheetJSRedisTest.mjs
```

2) Install dependencies:

<CodeBlock language="bash">{`\
npm i --save https://cdn.sheetjs.com/xlsx-${current}/xlsx-${current}.tgz redis@4.6.13`}
</CodeBlock>

3) Run the test script:

```bash
node SheetJSRedisTest.mjs
```

**Testing**

Inspect the output and compare with the data in `SheetJSRedisTest.mjs`.

<details>
  <summary><b>Expected Output</b> (click to show)</summary>

```
SET [ 'baz', '0' ]
SET [ 'foo', 'bar' ]
HSET [
  'user:1000',
  {
    name: 'John Smith',
    email: 'john.smith@example.com',
    password: 's3cret',
    visits: '1'
  }
]
HSET [
  'user:1001',
  {
    name: 'Mary Jones',
    email: 'mjones@example.com',
    password: 'hunter2'
  }
]
SADD [ 'superpowers', [ 'flight', 'x-ray vision' ] ]
SADD [ 'birdpowers', [ 'flight', 'pecking' ] ]
RPUSH [ 'friends', [ 'sam', 'alice', 'bob' ] ]
ZADD [
  'hackers',
  [
    { value: 'Grace Hopper', score: 1906 },
    { value: 'Alan Turing', score: 1912 },
    { value: 'Claude Shannon', score: 1916 },
    { value: 'Alan Kay', score: 1940 },
    { value: 'Richard Stallman', score: 1953 },
    { value: 'Sophie Wilson', score: 1957 },
    { value: 'Yukihiro Matsumoto', score: 1965 },
    { value: 'Linus Torvalds', score: 1969 }
  ]
]
```

</details>

Open `SheetJSRedis.xlsx` and verify the columns have the correct data. The sheet
should have the same structure as the screenshot at the top of this page.

[^1]: See ["Array of Arrays" in "Utility Functions"](/docs/api/utilities/array#array-of-arrays)
[^2]: See ["Array of Arrays Input" in "Utility Functions"](/docs/api/utilities/array#array-of-arrays-input).
[^3]: See ["Workbook Helpers" in "Utility Functions"](/docs/api/utilities/wb)
[^4]: See [`writeFile` in "Writing Files"](/docs/api/write-options)
[^5]: See [`readFile` in "Reading Files"](/docs/api/parse-options)
[^6]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^7]: See ["Utilities" in "Addresses and Ranges"](/docs/csf/general#utilities)
[^8]: See [`KEYS`](https://redis.io/commands/keys/) in the Redis documentation.
[^9]: See [`TYPE`](https://redis.io/commands/type/) in the Redis documentation.
[^10]: See [`GET`](https://redis.io/commands/get/) in the Redis documentation.
[^11]: See [`LRANGE`](https://redis.io/commands/lrange/) in the Redis documentation.
[^12]: See [`SMEMBERS`](https://redis.io/commands/smembers/) in the Redis documentation.
[^13]: The official command is [`ZRANGE`](https://redis.io/commands/zrange/). `ZRANGE_WITHSCORES` is a special command supported by the NodeJS wrapper.
[^14]: See [`HGETALL`](https://redis.io/commands/hgetall/) in the Redis documentation.
