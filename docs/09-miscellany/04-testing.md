---
title: Testing
sidebar_position: 4
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

SheetJS libraries have extensive test suites.

### Local Tests

<Tabs groupId="plat">
  <TabItem value="nodejs" label="NodeJS">

`make test` will run the NodeJS tests. By default it runs tests on files in
every supported format. To test a specific file type, set `FMTS` to the desired
file extension. Feature-specific tests are available with `make test_misc`.

```bash
$ make test_misc   # run core tests
$ make test        # run full tests
```

To enable all errors, set the environment variable `WTF=1`:

```bash
$ make test        # run full tests
$ WTF=1 make test  # enable all error messages
```

`flow` and `eslint` checks are available:

```bash
$ make lint        # eslint checks
$ make tslint      # check TS definitions
```

  </TabItem>
  <TabItem value="browser" label="Browser">

The core in-browser tests are available at `tests/index.html` within this repo.
Start a local server and navigate to that directory to run the tests.
`make ctestserv` will start a server on port 8000.

`make ctest` will generate the browser fixtures.  To add more files, edit the
`tests/fixtures.lst` file and add the paths.

  </TabItem>
  <TabItem value="bun" label="Bun">

`make test-bun` will run the full Bun test suite and `make test-bun_misc`
will run the smaller feature-specific tests.

  </TabItem>
  <TabItem value="deno" label="Deno">

`make test-deno` will run the full Deno test suite and `make test-deno_misc`
will run the smaller feature-specific tests.

  </TabItem>
  <TabItem value="extendscript" label="ExtendScript">

`make dist` will build `xlsx.extendscript.js`.

The script `estk.jsx` at the root of the project is configured to run in
ExtendScript Toolkit.  It will read `sheetjs.xlsx` and attempt to write test
files in a number of file formats.

ExtendScript Toolkit 3.5 is available as a standalone download for Windows.

  </TabItem>
</Tabs>

### Tested Environments

<details>
  <summary>(click to show)</summary>

**Browsers**
 - IE 6/7/8/9/10/11 (IE 6-9 require shims)
 - Chrome 26+ (including Android 6.0+)
 - Safari 8+ (Desktop) and Safari 10+ (iOS)
 - Edge 13-18 and 79+
 - FF Latest

The automated browser tests seek to test the latest patch version of each major
release of Chromium ending in `0` (starting from Chrome 30).

Edge originally was an independent browser, becoming a Chromium fork in version
79. Since the new releases should be nearly identical to the Chrome counterpart,
the Edge tests are run on major releases ending in `5` (starting from Edge 85).

**Server Platforms**
 - NodeJS `0.8`, `0.10`, `0.12`, and every major version starting from `4`
 - io.js 1/2/3
 - Bun latest
 - Deno latest

The test suite also includes tests for various time zones. Timezones can be
controlled by setting the `TZ` environment variable:

```bash
env TZ="Asia/Kolkata" WTF=1 make test_misc
```

</details>

### Test Files

[Download the test artifacts](https://test-files.sheetjs.com/test_files.zip).

#### Artifact Sources

Test files include derivatives of files from external sources. Files were opened
in various spreadsheet software and exported to CSV and other file formats. The
enclosed `README.md` file explains the naming conventions and file origins.

External sources typically distribute files under open source licenses. Some
sources have dedicated files to the public domain.

It is assumed that external sources have proper authorization to release files
under the asserted license terms. For example, if an external source releases a
file under the Apache 2.0 license, it is assumed that they either generated the
file directly or obtained permission from the creator.

#### Requests for Removal

External sources may have added files from contributors without proper consent.
Users are encouraged to submit reports if files contain private information that
was not properly vetted by the parties that posted the original content.

Please [send an email](mailto:support@sheetjs.com?subject=removal%20request) or
[file an issue in the main source repository](/docs/miscellany/source).
