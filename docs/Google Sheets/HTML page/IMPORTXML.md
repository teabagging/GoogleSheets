# IMPORTXML

Imports data from any of various structured data types including XML, HTML, CSV, TSV, and RSS and ATOM XML feeds.

### Sample Usage

`IMPORTXML("https://en.wikipedia.org/wiki/Moon_landing", "//a/@href")`

`IMPORTXML(A2,B2)`

### Syntax

`IMPORTXML(url, xpath_query, locale)`

* `url` - The URL of the page to examine, including protocol (e.g. `http://`).
  * The value for `url` must either be enclosed in quotation marks or be a reference to a cell containing the appropriate text.
* `xpath_query` - The XPath query to run on the structured data.
  * For more information on XPath, see [http://www.w3schools.com/xml/xpath\_intro.asp](http://www.w3schools.com/xml/xpath_intro.asp).
* `locale` - A language and region locale code to use when parsing the data. If unspecified, the document locale is used.

### See Also

[`IMPORTRANGE`](https://support.google.com/docs/answer/3093340): Imports a range of cells from a specified spreadsheet.

[`IMPORTHTML`](https://support.google.com/docs/answer/3093339): Imports data from a table or list within an HTML page.

[`IMPORTFEED`](https://support.google.com/docs/answer/3093337): Imports a RSS or ATOM feed.

[`IMPORTDATA`](https://support.google.com/docs/answer/3093335): Imports data at a given url in .csv (comma-separated value) or .tsv (tab-separated value) format.

[Learn how to optimize your data reference](https://support.google.com/docs/answer/12159115).
