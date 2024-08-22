# IMPORTDATA

Imports data at a given url in .csv (comma-separated value) or .tsv (tab-separated value) format.

### Sample Usage

`IMPORTDATA("https://www2.census.gov/programs-surveys/popest/datasets/2010-2019/national/totals/nst-est2019-popchg2010_2019.csv")`

`IMPORTDATA(A2)`

### Syntax

`IMPORTDATA(url)`

* `url` - The url from which to fetch the .csv or .tsv-formatted data, including protocol (e.g. `http://`).
  * The value for `url` must either be enclosed in quotation marks or be a reference to a cell containing the appropriate text.

### See Also

[`IMPORTXML`](https://support.google.com/docs/answer/3093342): Imports data from any of various structured data types including XML, HTML, CSV, TSV, and RSS and ATOM XML feeds.

[`IMPORTRANGE`](https://support.google.com/docs/answer/3093340): Imports a range of cells from a specified spreadsheet.

[`IMPORTHTML`](https://support.google.com/docs/answer/3093339): Imports data from a table or list within an HTML page.

[`IMPORTFEED`](https://support.google.com/docs/answer/3093337): Imports a RSS or ATOM feed.

[Learn how to optimize your data reference.](https://support.google.com/docs/answer/12159115)

### Examples

Retrieves United States population data from the specified CSV file `URL`.

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHU1eHA4QXJQa3I0TUxMNTRiTGVXX2c&single=true&gid=0&output=html&widget=true"></iframe>

Give feedback about this article
