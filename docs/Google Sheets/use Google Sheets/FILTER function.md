# FILTER function

Returns a filtered version of the source range, returning only rows or columns that meet the specified conditions.

### Examples

[Make a copy](https://docs.google.com/spreadsheets/d/1caULJLQvQuzBnCN7rO9utg0xSKrYms7wM0Ph7A2JXY4/copy)

Filters a range using different conditions.

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHhvUlROQUFTOTJOUXg2bGF0OGp2T3c&output=html&widget=true" width="500"></iframe>

### Sample Usage

`FILTER(A2:B26, A2:A26 > 5, D2:D26 < 10)`

`FILTER(A2:C5, {TRUE; TRUE; FALSE; TRUE})`

`FILTER(A2:B10, NOT(ISBLANK(A2:A10)))`

### Syntax

`FILTER(range, condition1, [condition2, ...])`

* `range` - The data to be filtered.
* `condition1` - A column or row containing true or false values corresponding to the first column or row of `range`, or an array formula evaluating to true or false.
* `condition2 ...` - **[** OPTIONAL **]** - Additional rows or columns containing boolean values `TRUE` or `FALSE` indicating whether the corresponding row or column in `range` should pass through `FILTER`. Can also contain array formula expressions which evaluate to such rows or columns. All conditions must be of the same type (row or column). Mixing row conditions and column conditions is not permitted.
  * `condition` arguments must have exactly the same length as `range`.

### Notes

* `FILTER` can only be used to filter rows or columns at one time. In order to filter both rows and columns, use the return value of one `FILTER` function as `range` in another.
* If `FILTER` finds no values which satisfy the provided conditions, `#N/A` will be returned.

### See Also

[`UNIQUE`](https://support.google.com/docs/answer/3093198): Returns unique rows in the provided source range, discarding duplicates. Rows are returned in the order in which they first appear in the source range.
