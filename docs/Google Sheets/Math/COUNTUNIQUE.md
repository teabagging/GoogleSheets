# COUNTUNIQUE

Counts the number of unique values in a list of specified values and ranges.

[COUNTUNIQUE for BigQuery]

Counts the number of unique values in a data column

### Sample Usage

`COUNTUNIQUE(table_name!fruits)`

### Syntax

`COUNTUNIQUE(column)`

* `column`: The data column to consider for uniqueness.

**Tip:** Counting unique rows across multiple columns is not supported

### Sample Usage

`COUNTUNIQUE(A1:C100)`

`COUNTUNIQUE(1,1,2,3,5,8,13,A2,B6:B9)`

### Syntax

`COUNTUNIQUE(value1, [value2, ...])`

* `value1` - The first value or range to consider for uniqueness.
* `value2, ...` - **[** OPTIONAL **]** - Additional values or ranges to consider for uniqueness.

### Notes

* Although `COUNTUNIQUE` is specified as taking a maximum of 30 arguments, Google Sheets supports an arbitrary number of arguments for this function.

### See Also

[`DCOUNTA`](https://support.google.com/docs/answer/3094147): Counts values, including text, selected from a database table-like array or range using a SQL-like query.

[`DCOUNT`](https://support.google.com/docs/answer/3094222): Counts numeric values selected from a database table-like array or range using a SQL-like query.

[`COUNTIF`](https://support.google.com/docs/answer/3093480): Returns a conditional count across a range.

[`COUNTA`](https://support.google.com/docs/answer/3093991):

Returns the number of values in a dataset.

[`COUNTBLANK`](https://support.google.com/docs/answer/3093403): Returns the number of empty cells in a given range.

[`COUNT`](https://support.google.com/docs/answer/3093620):

Returns the number of numeric values in a dataset.

### Examples

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHFZaGREbTJkR3hjclVBWTRQODkwakE&output=html"></iframe>
