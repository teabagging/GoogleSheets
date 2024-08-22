---
title: Illuminating Data with Lume
sidebar_label: Lume
description: Make static websites from spreadsheets using Lume. Seamlessly integrate data into your website using SheetJS. Illuminate data without leaving the comfort of Excel.
pagination_prev: demos/net/index
pagination_next: demos/mobile/index
sidebar_custom_props:
  type: native
---

[Lume](https://lume.land/) is a lightweight unopinionated static site generator.
It has a rich ecosystem of JavaScript-powered plugins[^1]

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses Lume and SheetJS (through the official "Sheets" plugin) to pull
data from a spreadsheet and display the content in an HTML table.

The ["Complete Example"](#complete-example) section includes a complete website
powered by an XLSX spreadsheet.

## Integration Details

The official "Sheets" plugin[^2] uses SheetJS to load data from spreadsheets.
Under the hood, the plugin uses the SheetJS `read`[^3] method to parse files and
the `sheet_to_json`[^4] method to generate arrays of objects.

Lume supports refreshing data during development. The generated static sites
include the raw data without referencing the underlying spreadsheet files.

### Installation

The `sheets` plugin can be imported and invoked in `_config.ts`:

```ts title="_config.ts"
import lume from "lume/mod.ts";
// highlight-next-line
import sheets from "lume/plugins/sheets.ts";

const site = lume();

// highlight-next-line
site.use(sheets());

export default site;
```

:::info pass

The lines are automatically added if `sheets` plugin is enabled during setup.

:::

### Usage

Spreadsheet files added in the `_data` subdirectory are accessible from template
files using the name stem.

For example, [`pres.xlsx`](https://docs.sheetjs.com/pres.xlsx) can be accessed
using the variable `pres` in a template.

#### Single-Sheet Workbooks

When a workbook has one worksheet, the data is an array of row objects:

```liquid title="single.njk"
<table><thead><tr><th>Name</th><th>Index</th></tr></thead>
  <tbody>
  {% for row in pres %}
    <tr>
      <td>{{ row.Name }}</td>
      <td>{{ row.Index }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
```

#### Multi-Sheet Workbooks

_Reading the First Worksheet_

The `sheets` plugin accepts an options argument.  If the `sheets` property is
set to `"first"`, then the plugin will expose row objects for the first sheet:

```ts title="_config.ts"
// the first sheet of each file will be parsed and converted to row objects
site.use(sheets({ sheets: "first" }));
```

_Reading all Worksheets_

The default behavior, when workbooks have multiple sheets, is to present objects
whose keys are worksheet names and whose values are arrays of row objects.

For example, if `pres.xlsx` had a sheet named `"Presidents"` and another sheet
named `"VicePresidents"`, then the following snippet would print data from the
`"Presidents"` sheet:

```liquid title="multi.njk"
<table><thead><tr><th>Name</th><th>Index</th></tr></thead>
  <tbody>
  {% for row in pres["Presidents"] %}
    <tr>
      <td>{{ row.Name }}</td>
      <td>{{ row.Index }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
```

#### File Formats

As explained in the official plugin documentation[^5], the loader loads XLSX.
NUMBERS, and CSV files. Other extensions can be added through the `extensions`
property in the argument to the `sheets` plugin:

```ts
site.use(sheets({
  // highlight-next-line
  extensions: [".xlsx", ".xlsb", ".xls"]
}));
```


## Complete Example

:::note Tested Deployments

This demo was tested in the following environments:

| Lume     | Date       |
|:---------|:-----------|
| `1.19.4` | 2024-03-16 |
| `2.1.2`  | 2024-03-16 |

This example uses the Nunjucks template format. Lume plugins support additional
template formats, including Markdown and JSX.

:::

### Initial Setup

0) Install Deno[^6]

1) Create a stock site:

```bash
mkdir -p sheetjs-lume
cd sheetjs-lume
deno run -Ar https://deno.land/x/lume@v2.1.2/init.ts
```

When prompted, enter the following options:

- `Choose the configuration file format`: select `_config.ts`
- `Do you want to install some plugins now?`: select `Yes`
- `Select the plugins to install`: select `sheets` and `nunjucks`
- `Do you want to setup a CMS?`: select `Maybe later`

The project will be configured and modules will be installed.

:::note pass

The `nunjucks` plugin was included by default in Lume version 1.

:::

2) Download https://docs.sheetjs.com/pres.xlsx and place in a `_data` subfolder:

```bash
mkdir -p _data
curl -L -o _data/pres.xlsx https://docs.sheetjs.com/pres.xlsx
```

3) Create a `index.njk` file that references the file:

```liquid title="index.njk"
<h2>Presidents</h2>
<table><thead><tr><th>Name</th><th>Index</th></tr></thead>
  <tbody>
  {% for row in pres %}
    <tr>
      <td>{{ row.Name }}</td>
      <td>{{ row.Index }}</td>
    </tr>
  {% endfor %}
  </tbody>
</table>
```

:::note pass

Since the file name is `pres.xlsx`, the parameter name is `pres`.

:::

### Live Refresh

4) Run the development server:

```bash
deno task serve --port 7262
```

To verify the site, access the "Local" URL (typically `http://localhost:7262`)
from a web browser. The page will show the contents of the spreadsheet.

5) While the server is running, open `_data/pres.xlsx` in a spreadsheet editor.

Set cell `A7` to "SheetJS Dev" and set `B7` to `47`. Save the spreadsheet.

After saving the spreadsheet, the page will refresh and show the new contents.

### Static Site

6) Stop the server (press <kbd>CTRL</kbd>+<kbd>C</kbd> in the terminal window).

7) Build the static site:

```bash
deno task lume
```

This will create a static site in the `_site` folder

7) Test the generated site by starting a web server:

```bash
npx http-server _site
```

The program will display a URL (typically `http://localhost:8080`). Accessing
the page will show the contents of the spreadsheet.

View the page source and confirm that the page only includes an HTML table. No
scripts are included in this page.

This site is self-contained and ready for deployment!

[^1]: See ["Plugins"](https://lume.land/plugins/?status=all) in the Lume documentation
[^2]: See ["Sheets"](https://lume.land/plugins/sheets/) in the Lume documentation
[^3]: See [`read` in "Reading Files"](/docs/api/parse-options)
[^4]: See [`sheet_to_json` in "Utilities"](/docs/api/utilities/array#array-output)
[^5]: See ["Formats"](https://lume.land/plugins/sheets/#formats) in the Lume documentation
[^6]: See ["Installation"](https://deno.com/manual/getting_started/installation) in the Deno documentation