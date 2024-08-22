# COUNTIFS

Returns the count of a range depending on multiple criteria.[COUNTIFS for BigQuery]

### Sample Usage

`COUNTIFS(A1:A10, ">20", B1:B10, "<30")`

`COUNTIFS(A7:A24, ">6", B7:B24, "<"&DATE(1969,7,20))`

`COUNTIFS(B8:B27, ">" & B12, C8:C27, "<" & C13, D8:D27, “<>10”)`

`COUNTIFS(C1:C100, "Yes")`

### Syntax

`COUNTIFS(criteria_range1, criterion1, [criteria_range2, criterion2, ...])`

* `criteria_range1` - The range to check against `criterion1`.
* `criterion1` - The pattern or test to apply to `criteria_range1`.
* `criteria_range2, criterion2...` - **[** OPTIONAL **]** - Additional ranges and criteria to check; repeatable.

### Notes

* Any additional ranges must contain the same number of rows and columns as `criteria_range1`.

### See Also

[`COUNTIF`](https://support.google.com/docs/answer/3093480): Returns a conditional count across a range.

[`COUNT`](https://support.google.com/docs/answer/3093620):

Returns the number of numeric values in a dataset.

[`SUMIFS`](https://support.google.com/docs/answer/3238496): Returns the sum of a range depending on multiple criteria.

[`AVERAGEIFS`](https://support.google.com/docs/answer/3256534): Returns the average of a range depending on multiple criteria.

[`IF`](https://support.google.com/docs/answer/3093364): Returns one value if a logical expression is \`TRUE\` and another if it is \`FALSE\`.
