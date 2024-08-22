# SORT function

Sorts the rows of a given array or range by the values in one or more columns.

### Sample Usage

`SORT(A2:B26, 1, TRUE)`

`SORT({1, 2; 3, 4; 5, 6}, 2, FALSE)`

`SORT(A2:B26, C2:C26, TRUE)`

### Syntax

`SORT(range, sort_column, is_ascending, [sort_column2, is_ascending2, ...])`

* `range` - The data to be sorted.
* `sort_column` - The index of the column in `range` or a range outside of `range` containing the values by which to sort.
  * A range specified as a `sort_column` must be a single column with the same number of rows as `range`.
* `is_ascending` - `TRUE` or `FALSE` indicating whether to sort `sort_column` in ascending order. `FALSE` sorts in descending order.
* `sort_column2, is_ascending2 ...`
  * **[** OPTIONAL **]** - Additional columns and sort order flags beyond the first, in order of precedence.

### Notes

* `range` is sorted *only* by the specified columns, other columns are returned in the order they originally appear.

### See Also

[`FILTER`](https://support.google.com/docs/answer/3093197): Returns a filtered version of the source range, returning only rows or columns that meet the specified conditions.

### Examples

Sorts the rows in the specified data range according to the given key columns followed by the sorting order.

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFF1Q1Y4WEtKY0hmTDA5MzhtdV9IQkE&single=true&gid=0&output=html&widget=true" width="500"></iframe>

[Make a copy](https://docs.google.com/spreadsheets/d/1Bp7qW66vyF4kFZQhXI0hZzGAK8cGzOXkJf9dzqCu5Tg/copy)
