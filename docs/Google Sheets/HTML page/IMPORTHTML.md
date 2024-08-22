Imports data from a table or list within an HTML page.

### Sample Usage

`IMPORTHTML("http://en.wikipedia.org/wiki/Demographics_of_India","table",4)`

`IMPORTHTML(A2,B2,C2)`

### Syntax

`IMPORTHTML(url, query, index)`

* `url` - The URL of the page to examine, including protocol (e.g. `http://`).
  * The value for `url` must either be enclosed in quotation marks or be a reference to a cell containing the appropriate text.
* `query` - Either "list" or "table" depending on what type of structure contains the desired data.
* `index` - The index, starting at `1`, which identifies which table or list as defined in the HTML source should be returned.
  * The indices for lists and tables are maintained separately, so there may be both a list and a table with index `1` if both types of elements exist on the HTML page.

### See Also

[`IMPORTXML`](https://support.google.com/docs/answer/3093342): Imports data from any of various structured data types including XML, HTML, CSV, TSV, and RSS and ATOM XML feeds.

[`IMPORTRANGE`](https://support.google.com/docs/answer/3093340): Imports a range of cells from a specified spreadsheet.

[`IMPORTFEED`](https://support.google.com/docs/answer/3093337): Imports a RSS or ATOM feed.

[`IMPORTDATA`](https://support.google.com/docs/answer/3093335): Imports data at a given url in .csv (comma-separated value) or .tsv (tab-separated value) format.
