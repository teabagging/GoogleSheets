# COUNTIF

Returns a conditional count across a range.

[COUNTIF Function](https://www.youtube.com/watch?v=WA0QZvanWb4)

To get an example spreadsheet and follow along with the video, click “Make a Copy” below.

[Make a copy](https://docs.google.com/spreadsheets/d/1O0294rwuZ9C3q1wcb4GtRixypUZat_sVtxbcEiy99TM/copy)

[COUNTIF for BigQuery]

### Sample Usage

`COUNTIF(A1:A10,">20")`

`COUNTIF(A1:A10,"Paid")`

### Syntax

`COUNTIF(range, criterion)`

* `range` - The range that is tested against `criterion`.
* `criterion` - The pattern or test to apply to `range`.
  * If `range` contains text to check against, `criterion` must be a string. `criterion` can contain wildcards including `?` to match any single character or `*` to match zero or more contiguous characters. To match an actual question mark or asterisk, prefix the character with the tilde (`~`) character (i.e. `~?` and `~*`). A string criterion must be enclosed in quotation marks. Each cell in `range` is then checked against `criterion` for equality (or match, if wildcards are used).
  * If `range` contains numbers to check against, `criterion` may be either a string or a number. If a number is provided, each cell in `range` is checked for equality with `criterion`. Otherwise, `criterion` may be a string containing a number (which also checks for equality), or a number prefixed with any of the following operators: `=`, `>`, `>=`, `<`, or `<=`, which check whether the range cell is equal to, greater than, greater than or equal to, less than, or less than or equal to the criterion value, respectively.

### Notes

* `COUNTIF` can only perform conditional counts with a single criterion. To use multiple criteria, use `COUNTIFS` or the database functions `DCOUNT` or `DCOUNTA`.
* `COUNTIF` is not case sensitive.

### Examples

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdEtFeEZoN2tiMUtQWUV2OE1tRDBNQXc&output=html"></iframe>

### [Make a copy](https://docs.google.com/spreadsheets/d/1PYoKCYZAkWSaMBsiTyvxZzCCt2WQ-QKOC763RWHMB7c/copy)

### See Also

[`COUNTIFS`](https://support.google.com/docs/answer/3256550): Returns the count of a range depending on multiple criteria.

[`SUMIF`](https://support.google.com/docs/answer/3093583): Returns a conditional sum across a range.

[`DCOUNTA`](https://support.google.com/docs/answer/3094147): Counts values, including text, selected from a database table-like array or range using a SQL-like query.

[`DCOUNT`](https://support.google.com/docs/answer/3094222): Counts numeric values selected from a database table-like array or range using a SQL-like query.

[`COUNTUNIQUE`](https://support.google.com/docs/answer/3093405): Counts the number of unique values in a list of specified values and ranges.

[`COUNTA`](https://support.google.com/docs/answer/3093991): Returns the number of values in a dataset.

[`COUNTBLANK`](https://support.google.com/docs/answer/3093403): Returns the number of empty cells in a given range.

[`COUNT`](https://support.google.com/docs/answer/3093620): Returns the number of numeric values in a dataset.
