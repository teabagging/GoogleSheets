---
title: Sheets in AngularJS Sites
sidebar_label: AngularJS
description: Build interactive websites with AngularJS. Seamlessly integrate spreadsheets into your app using SheetJS. Bring Excel-powered workflows and data to the modern web.
pagination_prev: demos/index
pagination_next: demos/grid/index
sidebar_position: 7
---

import current from '/version.js';
import CodeBlock from '@theme/CodeBlock';

:::danger pass

This demo is for the legacy AngularJS framework (version 1).

"Angular" now commonly refers to the new framework starting with version 2.
[The "Angular" demo](/docs/demos/frontend/angular) covers the new framework.

:::

[AngularJS](https://angularjs.org/) is a JS library for building user interfaces.

[SheetJS](https://sheetjs.com) is a JavaScript library for reading and writing
data from spreadsheets.

This demo uses AngularJS and SheetJS to process and generate spreadsheets. We'll
explore how to load SheetJS in AngularJS projects and compare common state
models and data flow strategies.

## Live Demo

:::note Tested Deployments

This demo was tested in the following environments:

| Browser      | Version           | Date       |
|:-------------|:------------------|:-----------|
| Chromiun 125 | `1.8.2`  (latest) | 2024-06-09 |
| Chromium 125 | `1.2.32` (legacy) | 2024-06-09 |

:::

[Click here for a live standalone integration demo.](pathname:///angularjs/)

The demo uses an array of objects as its internal state. It fetches and displays
data on load. It also includes a button for exporting data to file and a file
input element for loading user-submitted files.

## Installation

The [SheetJS Standalone scripts](/docs/getting-started/installation/standalone)
can be referenced in a `SCRIPT` tag from the HTML entry point page.

The script adds the `XLSX` global variable.

## Data Sources

Modern browsers support a number of convenient APIs for receiving files and
allowing users to submit files.

AngularJS, relevant in an era before the APIs were available, provides wrappers
to simplify network and file processing.

### Remote Files

To download files from a remote location, the `$http` service can perform GET
requests[^1]

The `responseType` option is directly passed to `XMLHttpRequest`. Setting the
property to `"arraybuffer"` ensures the result is an `ArrayBuffer` object.

The SheetJS [`read`](/docs/api/parse-options) method can parse the `ArrayBuffer`
and return a SheetJS workbook object[^2].

This controller fetches [a sample file](https://docs.sheetjs.com/pres.xlsx),
parses the result into a workbook, extracts the first worksheet, and uses the
SheetJS [`sheet_to_html`](/docs/api/utilities/html#html-table-output) method to
generate a HTML table:

```js title="Sample Controller"
/* The controller function must accept a `$http` argument */
app.controller('sheetjs', function($scope, $http) {
  /* fetch https://docs.sheetjs.com/pres.xlsx */
  $http({
    method:'GET', url:'https://docs.sheetjs.com/pres.xlsx',
    /* ensure the result is an ArrayBuffer object */
    responseType:'arraybuffer'
  }).then(function(data) {
    // highlight-next-line
    var wb = XLSX.read(data.data);
    /* generate HTML from first worksheet*/
    var ws = wb.Sheets[wb.SheetNames[0]];
    var html = XLSX.utils.sheet_to_html(ws);
    /* assign to the `tbl` scope property */
    $scope.tbl = html;
  }, function(err) { console.log(err); });
});
```

### User-Submitted Files

Users can submit files using HTML file input elements. A DOM `change` event is
created when users select a file.

In AngularJS, standard DOM event handlers are created using custom directives
with the `link` option[^3].

The following directive function creates a `change` event handler that will use
a `FileReader` to generate an `ArrayBuffer` object with the file data, parse the
file data using the SheetJS [`read`](/docs/api/parse-options) method, generate a
HTML table using [`sheet_to_html`](/docs/api/utilities/html#html-table-output),
and store the result in the `tbl` property of the app state:

```js
function SheetJSImportDirective() { return {
  scope: false,
  /* $elm will be a reference to the file input DOM element */
  link: function ($scope, $elm) {
    /* add a `change` event handler */
    $elm.on('change', function (changeEvent) {
      /* use a FileReader to read the file */
      var reader = new FileReader();
      reader.onload = function (e) {
        /* this event handler will be called once the data is read */
        var wb = XLSX.read(e.target.result);

        /* generate HTML from first worksheet*/
        var ws = wb.Sheets[wb.SheetNames[0]];
        var html = XLSX.utils.sheet_to_html(ws);

        /* assign to the `tbl` scope property */
        $scope.apply(function() { $scope.tbl = html; });
      };
      /* read */
      reader.readAsArrayBuffer(changeEvent.target.files[0]);
    });
  }
}; }
```

This functionality can be added to the app in two steps:

1) Add an `INPUT` element with attribute `import-sheet-js=""`:

```html
<input type="file" import-sheet-js="" multiple="false"  />
```

2) Define the `importSheetJs` directive that attaches `SheetJSImportDirective`:

```js
app.directive("importSheetJs", [SheetJSImportDirective]);
```

:::note pass

AngularJS normalizes the hyphenated attribute `import-sheet-js` to the
`importSheetJs` camel-case directive name.

:::

## Internal State

The various SheetJS APIs work with various data shapes.  The preferred state
depends on the application.

### Array of Objects

The example [presidents sheet](https://docs.sheetjs.com/pres.xlsx) has one
header row with "Name" and "Index" columns. The natural JS representation is an
object for each row, using the values in the first rows as keys:

<table>
  <thead><tr><th>Spreadsheet</th><th>State</th></tr></thead>
  <tbody><tr><td>

![`pres.xlsx` data](pathname:///pres.png)

</td><td>

```js
[
  { Name: "Bill Clinton", Index: 42 },
  { Name: "GeorgeW Bush", Index: 43 },
  { Name: "Barack Obama", Index: 44 },
  { Name: "Donald Trump", Index: 45 },
  { Name: "Joseph Biden", Index: 46 }
]
```

</td></tr></tbody></table>

The SheetJS [`sheet_to_json`](/docs/api/utilities/array#array-output) method
generates row objects from worksheets. The following controller parses a remote
file, generates row objects, and stores the array in the state:

```js
app.controller('sheetjs', function($scope, $http) {
  $http({
    url:'https://docs.sheetjs.com/pres.xlsx',
    method:'GET', responseType:'arraybuffer'
  }).then(function(data) {
    var wb = XLSX.read(data.data);
    // highlight-next-line
    $scope.data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  }, function(err) { console.log(err); });
});
```

A component will typically loop over the data using `ng-repeat`. The following
template generates a TABLE with a row for each President:

```html
<table id="sjs-table">
  <tr><th>Name</th><th>Index</th></tr>
  <tr ng-repeat="row in data track by $index">
    <td>{{row.Name}}</td>
    <td>{{row.Index}}</td>
  </tr>
</table>
```

The [`json_to_sheet`](/docs/api/utilities/array#array-of-objects-input) method
can generate a worksheet from the data:

```js
/* assuming $scope.data is an array of objects */
$scope.exportSheetJS = function() {
  /* generate a worksheet */
  var ws = XLSX.utils.json_to_sheet($scope.data);
  /* add to workbook */
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Presidents");
  /* write workbook and force a download */
  XLSX.writeFile(wb, "SheetJSAngularJSAoO.xlsx");
};
```

<details>
  <summary open><b>How to run the example</b> (click to hide)</summary>

1) Save the following to `index.html`:

<CodeBlock language="html" title="index.html">{`\
<!DOCTYPE html>
<html ng-app="s5s">
<head>
  <title>SheetJS + AngularJS</title>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
</head>
<body>
<h3><a href="https://sheetjs.com">SheetJS + AngularJS demo</a></h3>
\n\
<div ng-controller="sheetjs">
  <button ng-click="exportSheetJS()">Export Table</button>
  <table id="s5s-table">
    <tr><th>Name</th><th>Index</th></tr>
    <tr ng-repeat="row in data track by $index">
      <td>{{row.Name}}</td>
      <td>{{row.Index}}</td>
    </tr>
  </table>
</div>
\n\
<script>
var app = angular.module('s5s', []);
app.controller('sheetjs', function($scope, $http) {
  $scope.exportSheetJS = function() {
    var ws = XLSX.utils.json_to_sheet($scope.data);
    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Presidents");
    XLSX.writeFile(wb, "SheetJSAngularJSAoO.xlsx");
  };
  $http({
    url:'https://docs.sheetjs.com/pres.xlsx',
    method:'GET', responseType:'arraybuffer'
  }).then(function(data) {
    var wb = XLSX.read(data.data);
    var data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    $scope.data = data;
  }, function(err) { console.log(err); });
});
</script>
</body>
</html>`}
</CodeBlock>

2) Start a local web server with `npx http-server .` and access the displayed
URL with a web browser (typically `http://localhost:8080`)

When the page loads, the app will fetch https://docs.sheetjs.com/pres.xlsx and
store an array of objects in state. When the "Export Table" button is clicked,
a worksheet is created and exported to XLSX.

</details>

### HTML

The main disadvantage of the Array of Objects approach is the specific nature
of the columns.  For more general use, passing around an Array of Arrays works.
However, this does not handle merge cells[^4] well!

The `sheet_to_html` function generates HTML that is aware of merges and other
worksheet features.  The generated HTML does not contain any `<script>` tags,
and should therefore be safe to pass to an `ng-bind-html` binding. This approach
requires the `ngSanitize` plugin[^5].

```html
<div ng-controller="sheetjs">
  <!-- highlight-next-line -->
  <div ng-bind-html="data" id="tbl"></div>
</div>

<script>
// highlight-next-line
var app = angular.module('s5s', ['ngSanitize']);
app.controller('sheetjs', function($scope, $http) {
  $http({
    url:'https://docs.sheetjs.com/pres.xlsx',
    method:'GET', responseType:'arraybuffer'
  }).then(function(data) {
    var wb = XLSX.read(data.data);
    // highlight-next-line
    $scope.data = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
  }, function(err) { console.log(err); });
});
</script>
```

The HTML table can be directly exported with [`table_to_book`](/docs/api/utilities/html#html-table-input):

```js
  $scope.exportSheetJS = function() {
    /* export table element */
    // highlight-start
    var tbl = document.getElementById("tbl").getElementsByTagName("TABLE")[0];
    var wb = XLSX.utils.table_to_book(tbl);
    // highlight-end
    XLSX.writeFile(wb, "SheetJSAngularJSHTML.xlsx");
  };
```

<details>
  <summary open><b>How to run the example</b> (click to hide)</summary>

1) Save the following to `index.html`:

<CodeBlock language="html" title="index.html">{`\
<!DOCTYPE html>
<html ng-app="s5s">
<head>
  <title>SheetJS + AngularJS</title>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular-sanitize.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/shim.min.js"></script>
  <script src="https://cdn.sheetjs.com/xlsx-${current}/package/dist/xlsx.full.min.js"></script>
</head>
<body>
<h3><a href="https://sheetjs.com">SheetJS + AngularJS demo</a></h3>
\n\
<div ng-controller="sheetjs">
  <button ng-click="exportSheetJS()">Export Table</button>
  <div ng-bind-html="data" id="tbl"></div>
</div>
\n\
<script>
var app = angular.module('s5s', ['ngSanitize']);
app.controller('sheetjs', function($scope, $http) {
  $scope.exportSheetJS = function() {
    var tbl = document.getElementById("tbl").getElementsByTagName("TABLE")[0];
    var wb = XLSX.utils.table_to_book(tbl);
    XLSX.writeFile(wb, "SheetJSAngularJSHTML.xlsx");
  };
  $http({
    url:'https://docs.sheetjs.com/pres.xlsx',
    method:'GET', responseType:'arraybuffer'
  }).then(function(data) {
    var wb = XLSX.read(data.data);
    $scope.data = XLSX.utils.sheet_to_html(wb.Sheets[wb.SheetNames[0]]);
  }, function(err) { console.log(err); });
});
</script>
</body>
</html>`}
</CodeBlock>

2) Start a local web server with `npx http-server .` and access the displayed
URL with a web browser (typically `http://localhost:8080`)

When the page loads, the app will fetch https://docs.sheetjs.com/pres.xlsx and
store the HTML string in state. When the "Export Table" button is clicked, a
worksheet is created and exported to XLSX.

</details>

[^1]: See [`$http`](https://docs.angularjs.org/api/ng/service/$http) in the AngularJS documentation.
[^2]: See ["Workbook Object"](/docs/csf/book)
[^3]: See ["Creating Directives"](https://docs.angularjs.org/guide/directive#creating-a-directive-that-manipulates-the-dom) in the AngularJS documentation.
[^4]: See ["Merged Cells" in "SheetJS Data Model"](/docs/csf/features/merges) for more details.
[^5]: See [`ngSanitize`](https://docs.angularjs.org/api/ngSanitize) in the AngularJS documentation.
