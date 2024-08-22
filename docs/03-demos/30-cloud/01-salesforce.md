---
title: Salesforce LWC
pagination_prev: demos/local/index
pagination_next: demos/extensions/index
---

import current from '/version.js';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';

[Salesforce](https://www.salesforce.com/) is a suite of cloud-based software
systems for Customer Relationship Management (CRM). "Lightning Web Components"
(LWC) is a robust JavaScript extension platform available to Salesforce apps[^1].

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo explores the LWC scripting features in Salesforce. We'll explore how
to install SheetJS scripts in Lightning Web Components and build a sample app
for exporting lists to XLSX workbooks.

:::caution pass

Salesforce may change the platform in backwards-incompatible ways, so the demo
may require some adjustments.  The official documentation should be consulted.

:::

:::note Tested Deployments

This demo was last tested on 2024 May 05 using Lightning API version `59.0`.

:::

:::danger Telemetry

The Salesforce developer tools embed telemetry. It can be disabled by setting
the environment variable `SF_DISABLE_TELEMETRY` to `true` or by running

```bash
npx @salesforce/cli config set disable-telemetry=true --global
```

:::

## Integration Details

Lightning Web Components can load scripts stored in static resources.

### Installation

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be downloaded and added as a static resource.

:::info pass

Due to Salesforce name restrictions, the script must be renamed to `sheetjs.js`.

:::

### Loading SheetJS

Assuming the script was renamed to `sheetjs.js`, the name of the resource will
be `sheetjs`. `async` functions can use `loadScript` to fetch and load the
library. The script will define the variable `XLSX`[^2]

It is recommended to load the library in a callback. For example, the following
`@api` method loads the library and exports sample data to a spreadsheet file:

```js
import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
// highlight-next-line
import sheetjs from '@salesforce/resourceUrl/sheetjs';

export default class SheetComponent extends LightningElement {
  @api async download() {
    await loadScript(this, sheetjs); // load the library
    // At this point, the library is accessible with the `XLSX` variable

    // Create worksheet
    var ws = XLSX.utils.aoa_to_sheet([
      [ "S", "h", "e", "e", "t", "J"," S" ],
      [  5 ,  4 ,  3 ,  3 ,  7 ,  9 ,  5  ]
    ]);

    // Create workbook and add worksheet
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // Export Data
    XLSX.writeFile(wb, "SheetForceExport.xlsx");
  }
}
```

### Exporting Data from SF List

Using the LWC Wire Service, components receive data in separate events.[^3]
Event handlers typically store the updated data in component state, ensuring the
data is available when a spreadsheet export is requested.

#### Getting Account Data

This demo uses the deprecated `getListUi` function[^4] to pull account data.
`getListUi` requires the name of the LWC object (`objectApiName` property) and
name of the LWC list view (`listViewApiName` property)

The following snippet receives data from the "All Accounts" list view:

```js
import { LightningElement, wire } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

// ...

export default class SheetComponent extends LightningElement {
  @wire(getListUi, {
    objectApiName: ACCOUNT_OBJECT.objectApiName,
    listViewApiName: 'AllAccounts'
  }) listInfo({ error, data }) {

    // LIST DATA AVAILABLE HERE

  };
  // ...
}
```

#### Array of Arrays

SheetJS most reliably translates "arrays of arrays", a nested array which
directly maps to individual cell addresses.  For example:

```js
var data = [
  ["Name",      "Phone"],           // row 1
  ["Foo Bar",   "(555) 555-5555"],  // row 2
  ["Baz Qux",   "(555) 555-5556"]   // row 3
];
```

The APIs typically return nested objects, so the array must be constructed.

<details>
  <summary><b>Salesforce Representation</b> (click to show)</summary>

The `data` parameter in the callback has a deep structure. Typically one would
set a property in the component and display data in a template:

```js
  // ...
  // declare records variable in the component
  records;
  @wire(getListUi, {
    objectApiName: ACCOUNT_OBJECT.objectApiName,
    listViewApiName: 'AllAccounts'
  }) listInfo({ error, data }) {
    if (data) {
      // data.records.records is the array of interest
      this.records = data.records.records;
      this.error = undefined;
    }
  }
  // ...
```

The template itself would iterate across the records:

```html
<template>
  <template if:true={records}>
    <table>
      <tr><th>Name</th><th>Phone</th></tr>
      <template for:each={records} for:item="record">
        <tr key={record.fields.Id.value}>
          <td>{record.fields.Name.value}</td>
          <td>{record.fields.Phone.value}</td>
        </tr>
      </template>
    </table>
  </template>
</template>
```

</details>

A suitable SheetJS array of arrays can be constructed by mapping across records:

```js
      var headers = [ "Name", "Phone" ];
      var aoa = [headers].concat(data.records.records.map(record => [
        record.fields.Name.value,  // Name field
        record.fields.Phone.value, // Phone field
      ]));
```

#### State

This data is available in a wire service callback, but it is common to export
the data in a separate API event. This flow is handled with a state variable:

```js
export default class SheetComponent extends LightningElement {
  // highlight-next-line
  aoa; // will hold data for export
  @wire(getListUi, {
    objectApiName: ACCOUNT_OBJECT.objectApiName,
    listViewApiName: 'AllAccounts'
  }) listInfo({ error, data }) {
    if (data) {
      var headers = [ "Name", "Phone" ];
      // create AOA
      var _aoa = [headers].concat(data.records.records.map(record => [
        record.fields.Name.value,  // Name field
        record.fields.Phone.value, // Phone field
      ]));

      // assign to state
      // highlight-next-line
      this.aoa = _aoa;
    } else if (error) console.log(error);
  };
}
```

#### Exporting Data

This is readily exported to a spreadsheet in a callback function. Starting from
the array of arrays, the SheetJS `aoa_to_sheet` method[^5] generates a SheetJS
sheet object[^6]. A workbook object[^7] is created with `book_new`[^8] and the
sheet is added with `book_append_sheet`[^9]. Finally, the SheetJS `writeFile`
method creates a XLSX file and initiates a download[^10].

```js
  @api async download() {
    await loadScript(this, sheetjs); // load the library
    // get data from state
    // highlight-next-line
    var _aoa = this.aoa;

    // create workbook
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(_aoa);
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    // export
    XLSX.writeFile(wb, "SheetForceExport.xlsx");
  };
```

## Complete Example

:::info pass

This demo was built on a "Developer Edition" account. At the time of writing, an
[account can be created for free.](https://developer.salesforce.com/signup)

:::

0) Create a "Developer Edition" account. Take note of the unique Username

### Configure Tools

1) Install [NodeJS LTS](https://nodejs.org/en/download).

2) Disable telemetry:

```bash
npx @salesforce/cli config set disable-telemetry=true --global
```

3) Confirm the CLI tool works by checking version information:

```bash
npx @salesforce/cli --version
```

:::note pass

When the demo was last tested, the command printed

```
@salesforce/cli/2.39.6 darwin-x64 node-v22.0.0
```

:::

4) Log into the org from the CLI tool:

```bash
npx @salesforce/cli org login web
```

This will open a web browser. Sign in and authorize the application.

### Create Project

5) Create the "SheetForce" sample project with the `project generate` command:

```bash
npx @salesforce/cli project generate -n SheetForce
```

Enter the project directory:

```bash
cd SheetForce
```

6) Create a LWC component with the `lightning generate component` command:

```bash
npx @salesforce/cli lightning generate component --type lwc -n sheetComponent -d force-app/main/default/lwc
```

7) Replace `force-app\main\default\lwc\sheetComponent\sheetComponent.html` with
the following template code:

```html title="force-app\main\default\lwc\sheetComponent\sheetComponent.html (add highlighted lines)"
<template>
  <!-- highlight-next-line -->
  <b>SheetForce demo</b>
</template>
```

8) Replace `force-app\main\default\lwc\sheetComponent\sheetComponent.js-meta.xml`
with the following XML:

```xml title="force-app\main\default\lwc\sheetComponent\sheetComponent.js-meta.xml (replace highlighted lines)"
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
  <apiVersion>59.0</apiVersion>
  <!-- highlight-start -->
  <isExposed>true</isExposed>
  <masterLabel>SheetForce</masterLabel>
  <description>SheetJS Demo</description>
  <targets>
    <target>lightning__AppPage</target>
  </targets>
  <!-- highlight-end -->
</LightningComponentBundle>
```

### Deploy Sample Project

9) Deploy the project from the CLI. You will need the Salesforce unique
Username. For example, if the Username was `SF@USER.NAME`, the command is:

```bash
npx @salesforce/cli project deploy start -d force-app -o SF@USER.NAME
```

10) Find the new component:

<Tabs groupId="sfview">
  <TabItem value="nuevo" label="Lightning Experience">

To find the new component in "Lightning Experience" view:

A) In the Salesforce site, click on the gear icon in the top-right corner of the
page and select "Setup" (Setup for current app).

B) Type "Custom Code" in the left sidebar search box. Expand "Custom Code",
expand "Lightning Components" and click "Lightning Components".

:::caution pass

With certain security settings, Salesforce will show an error:

> We can't display this page because your browser blocks cross-domain cookies, but you can view this page in Salesforce Classic.

Click the link to open the page in Salesforce Classic.

:::


  </TabItem>
  <TabItem value="classique" label="Classic">

A) Click the "Setup" link in the top-right corner of the page.

B) Type "Lightning" in the left sidebar search box. Expand "Develop", expand
"Lightning Components" and click "Lightning Components".

  </TabItem>
</Tabs>

The page in Salesforce Classic will look like the screenshot below:

![Custom Component](pathname:///salesforce/custcomp.png)

### Initialize App Page

#### Create App Page

11) Create an "App Page" in the "Lightning App Builder":

<Tabs groupId="sfview">
  <TabItem value="nuevo" label="Lightning Experience">

A) In the Salesforce site, click on the gear icon in the top-right corner of the
page and select "Setup" (Setup for current app).

B) Type "App Build" in the left sidebar search box. Expand "User Interface" and
click "Lightning App Builder".

:::caution pass

With certain security settings, Salesforce will show an error:

> We can't display this page because your browser blocks cross-domain cookies, but you can view this page in Salesforce Classic.

Click the link to open the page in Salesforce Classic.

:::

C) Click the "New" button.

  </TabItem>
  <TabItem value="classique" label="Classic">

A) Click the "Setup" link in the top-right corner of the page.

B) Type "App Build" in the left search box and select "Lightning App Builder".

C) Click the "New" button.

  </TabItem>
</Tabs>

#### App Wizard

D) Select "App Page" in the left list and click "Next"

E) Type "SheetJS Demo" in the Label textbox and click "Next"

F) Select "One Region" in the left list and click "Done"

#### App Builder

12) Add the "SheetForce" component to the App Page.

In the left "Components" sidebar, under the "Custom" section, there should be a
"SheetForce" entry.

Click and drag "SheetForce" into the "Add Component(s) Here" frame in the app
builder main view to add it to the page.

Click "Save".

13) Activate the page.

When the "Page Saved" modal is displayed, click "Activate".

The following options should be set:
- Click "Change..." next to "Icon" and pick a memorable icon
- Under "Lightning Experience" click "LightningBolt" then "Add page to app"

Click "Save" to activate the page.

14) Open the demo page.

Click the left arrow in the top-left corner of the page to return to Setup.

If there is a "Switch to Lightning Experience" at the top, click the link.

Click the App Launcher (`᎒᎒᎒`) and search for "SheetJS". Under "Items", the new
"SheetJS Demo" will be listed, Click "SheetJS Demo".

The app will display the "SheetForce demo" text from the component template:

![Demo](pathname:///salesforce/initial.png)


### Add SheetJS

<ol start="15"><li><p>Download <a href={"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.full.min.js"}>{"https://cdn.sheetjs.com/xlsx-" + current + "/package/dist/xlsx.full.min.js"}</a></p></li></ol>

:::danger pass

**DO NOT "COPY AND PASTE"!**  The file should be explicitly downloaded.  Copying
and pasting corrupts the source code and the component will fail in subtle ways.

The easiest approach is to right-click the link and select "Save Link As..."

:::

The following command can be run in PowerShell or `bash`:

<CodeBlock language="bash">{`\
curl -o xlsx.full.min.js https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js`}
</CodeBlock>


16) Move the file to the `force-app/main/default/staticresources/` folder and
rename the file to `sheetjs.js`.

If the file was downloaded from the previous command, `mv` can move and rename:

```bash
mv xlsx.full.min.js force-app/main/default/staticresources/sheetjs.js
```

17) Create `force-app/main/default/staticresources/sheetjs.resource-meta.xml`
(`sheetjs.resource-meta.xml` in the folder from step 2) with the following XML:

```xml title="force-app/main/default/staticresources/sheetjs.resource-meta.xml"
<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
  <cacheControl>Private</cacheControl>
  <contentType>application/javascript</contentType>
</StaticResource>
```

18) Deploy the project again. Replace `SF@USER.NAME` with the unique Username:

```bash
npx @salesforce/cli project deploy start -d force-app -o SF@USER.NAME
```

19) Look for the static resource:

<Tabs groupId="sfview">
  <TabItem value="nuevo" label="Lightning Experience">

A) In the Salesforce site, click on the gear icon in the top-right corner of the
page and select "Setup" (Setup for current app).

B) Type "Static" in the left sidebar search box. Click "Static Resources"

:::caution pass

With certain security settings, Salesforce will show an error:

> We can't display this page because your browser blocks cross-domain cookies, but you can view this page in Salesforce Classic.

Click the link to open the page in Salesforce Classic.

:::

  </TabItem>
  <TabItem value="classique" label="Classic">

A) Click the "Setup" link in the top-right corner of the page.

B) Type "Static" in the left sidebar search box. Click "Static Resources"

  </TabItem>
</Tabs>

The page in Salesforce Classic will look like the screenshot below:

![Static Resources](pathname:///salesforce/static.png)

### Test the Static Resource

20) Replace `force-app/main/default/lwc/sheetComponent/sheetComponent.js` with
the following script:

```js title="force-app/main/default/lwc/sheetComponent/sheetComponent.js (replace script)"
import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import sheetjs from '@salesforce/resourceUrl/sheetjs';

export default class SheetComponent extends LightningElement {
  version = "???"; // start with ???
  async connectedCallback() {
    await loadScript(this, sheetjs); // load the library
    // At this point, the library is accessible with the `XLSX` variable
    this.version = XLSX.version;
  }
}
```

This component exposes a `version` property based on the SheetJS version.

21) Replace `force-app/main/default/lwc/sheetComponent/sheetComponent.html` with
the following template:

```html title="force-app/main/default/lwc/sheetComponent/sheetComponent.html"
<template>
  <!-- highlight-next-line -->
  <b>SheetForce {version}</b>
</template>
```

This template references the `version` property.

22) Deploy the project again. Replace `SF@USER.NAME` with the unique Username:

```bash
npx @salesforce/cli project deploy start -d force-app -o SF@USER.NAME
```

23) Reload the "SheetJS Demo" page. The page should display the SheetJS version:

![Version number](pathname:///salesforce/version.png)

:::info pass

It may take a few minutes for Salesforce to refresh. If the demo still shows the
original "SheetForce demo" text after refreshing, close and reopen the demo app.

:::

### Export Data from SF Lists

24) Add a button to `sheetComponent.html` that will call a `download` callback:

```html title="force-app/main/default/lwc/sheetComponent/sheetComponent.html"
<template>
  <!-- if the `aoa` property is set, show a button -->
  <template if:true={aoa}>
    <button onclick={download}><b>Click to Export!</b></button>
  </template>
  <!-- if the `aoa` property is not set, show a message -->
  <template if:false={aoa}><b>Please wait for data to load ...</b></template>
</template>
```

25) Replace `sheetComponent.js` with the following:

```js title="force-app/main/default/lwc/sheetComponent/sheetComponent.js"
import { LightningElement, wire, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { getListUi } from 'lightning/uiListApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';

import sheetjs from '@salesforce/resourceUrl/sheetjs';

export default class SheetComponent extends LightningElement {
  aoa; // will hold data for export
  @wire(getListUi, {
    objectApiName: ACCOUNT_OBJECT.objectApiName,
    listViewApiName: 'AllAccounts'
  }) listInfo({ error, data }) {
    if (data) {
      var headers = [ "Name", "Phone" ];
      // create AOA and assign to `aoa` property
      this.aoa = [headers].concat(data.records.records.map(record => [
        record.fields.Name.value,  // Name field
        record.fields.Phone.value, // Phone field
      ]));
    } else if (error) console.log(error);
  };
  @api async download() {
    await loadScript(this, sheetjs); // load the library
    // create workbook
    var wb = XLSX.utils.book_new();
    var ws = XLSX.utils.aoa_to_sheet(this.aoa);
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    // export
    XLSX.writeFile(wb, "SheetForceExport.xlsx");
  };
}
```

26) Deploy the project again. Replace `SF@USER.NAME` with the unique Username:

```bash
npx @salesforce/cli project deploy start -d force-app -o SF@USER.NAME
```

27) Reload the "SheetJS Demo" page. The page should include a button for export:

![SF Export Button](pathname:///salesforce/export.png)

28) Click the "Click to Export!" button. The app will attempt to download a file.

The simple export includes all of the data:

![Excel Export](pathname:///salesforce/xl.png)

:::tip pass

[SheetJS Pro](https://sheetjs.com/pro) offers additional styling options like
cell styling, automatic column width calculations, and frozen rows.

:::

[^1]: It is strongly recommended to review the [detailed introduction in the Salesforce documentation](https://developer.salesforce.com/docs/platform/lwc/guide/get-started-introduction.html)
[^2]: The `XLSX` variable is the main global for the SheetJS library. It exposes methods as described in ["API Reference"](/docs/api/)
[^3]: See ["Understand the Wire Service"](https://developer.salesforce.com/docs/platform/lwc/guide/data-wire-service-about.html) in the Salesforce LWC documentation.
[^4]: See [`getListUI`](https://developer.salesforce.com/docs/platform/lwc/guide/reference-get-list-ui.html) in the Salesforce LWC documentation.
[^5]: See [`aoa_to_sheet` in "Utilities"](/docs/api/utilities/array#array-of-arrays-input)
[^6]: See ["Sheet Objects"](/docs/csf/sheet)
[^7]: See ["Workbook Object"](/docs/csf/book)
[^8]: See [`book_new` in "Utilities"](/docs/api/utilities/wb)
[^9]: See [`book_append_sheet` in "Utilities"](/docs/api/utilities/wb)
[^10]: See [`writeFile` in "Writing Files"](/docs/api/write-options)