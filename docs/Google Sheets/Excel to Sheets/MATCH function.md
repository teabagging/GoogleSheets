# MATCH function

Returns the relative position of an item in a range that matches a specified value.

### Sample Usage

`MATCH("Sunday",A2:A9,0)`

`MATCH(DATE(2012,1,1),A2:F2)`

### Syntax

`MATCH(search_key, range, [search_type])`

* `search_key` - The value to search for. For example, `42`, `"Cats"`, or `I24`.
* `range` - The one-dimensional array to be searched.
  * If a range with both height and width greater than 1 is used, `MATCH` will return `#N/A!`.
* `search_type` - **[** OPTIONAL - `1` by default **]** - The manner in which to search.
  * `1`, the default, causes `MATCH` to assume that the range is sorted in ascending order and return the largest value less than or equal to `search_key`.
  * `0` indicates exact match, and is required in situations where `range` is not sorted.
  * `-1` causes `MATCH` to assume that the range is sorted in descending order and return the smallest value greater than or equal to `search_key`.

### Notes

* `MATCH` returns the position in an array or range of a matched value rather than the value itself. To return the value itself or another value corresponding to the row or column the match is found in, use [`INDEX`](https://support.google.com/docs/answer/3098242), [`HLOOKUP`](https://support.google.com/docs/answer/3093375), or [`VLOOKUP`](https://support.google.com/docs/answer/3093318).

### See Also

[`VLOOKUP`](https://support.google.com/docs/answer/3093318): Vertical lookup. Searches down the first column of a range for a key and returns the value of a specified cell in the row found.

[`HLOOKUP`](https://support.google.com/docs/answer/3093375): Horizontal lookup. Searches across the first row of a range for a key and returns the value of a specified cell in the column found.

[`INDEX`](https://support.google.com/docs/answer/3098242): Returns the content of a cell, specified by row and column offset.

### Examples

Returns the relative position of an item in an array that matches a specified value based on different `search_type`.

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdEFXa1dxVGtFd3BWUktRUmRwUkF3Qmc&single=true&gid=0&output=html&widget=true" width="500"></iframe>
