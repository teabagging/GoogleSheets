# SUMIF

Returns a conditional sum across a range.

### Examples

[Make a copy](https://docs.google.com/spreadsheets/d/1s2FxfaIiMrZLPvqjUvOcWt1yHuRQ8w5N7eIEKNxa48Q/copy)

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdEI3dVJIMTl2OGQ2S2o2VzZKSnVIa3c&output=html"></iframe>

[SUMIF for BigQuery]

### Sample Usage

`SUMIF(A1:A10,">20")`

`SUMIF(A1:A10,"Paid",B1:B10)`

### Syntax

`SUMIF(range, criterion, [sum_range])`

* `range` - The range which is tested against `criterion`.
* `criterion` - The pattern or test to apply to `range`.
  * If `range` contains text to check against, `criterion` must be a string. `criterion` can contain wildcards including `?` to match any single character or `*` to match zero or more contiguous characters. To match an actual question mark or asterisk, prefix the character with the tilde (`~`) character (i.e. `~?` and `~*`). A string criterion must be enclosed in quotation marks. Each cell in `range` is then checked against `criterion` for equality (or match, if wildcards are used).
  * If `range` contains numbers to check against, `criterion` may be either a string or a number. If a number is provided, each cell in `range` is checked for equality with `criterion`. Otherwise, `criterion` may be a string containing a number (which also checks for equality), or a number prefixed with any of the following operators: `=` (checks for equality), `>` (checks that the range cell value is greater than the criterion value), or `<` (checks that the range cell value is less than the criterion value)
* `sum_range` - The range to be summed, if different from `range`.

### Notes

* `SUMIF` can only perform conditional sums with a single criterion. To use multiple criteria, use the database function `DSUM`.

### See Also

[`SUMSQ`](https://support.google.com/docs/answer/3093714): Returns the sum of the squares of a series of numbers and/or cells.

[`SUM`](https://support.google.com/docs/answer/3093669): Returns the sum of a series of numbers and/or cells.

[`SERIESSUM`](https://support.google.com/docs/answer/3093444): Given parameters `x`, `n`, `m`, and `a`, returns the power series sum a~1~x^n^ + a~2~x^(n+m)^ + ... + a~i~x^(n+(i-1)m)^, where i is the number of entries in range \`a\`.

[`QUOTIENT`](https://support.google.com/docs/answer/3093436): Returns one number divided by another, without the remainder.

[`PRODUCT`](https://support.google.com/docs/answer/3093502): Returns the result of multiplying a series of numbers together.

[`MULTIPLY`](https://support.google.com/docs/answer/3093978): Returns the product of two numbers. Equivalent to the \`\*\` operator.

[`MINUS`](https://support.google.com/docs/answer/3093977): Returns the difference of two numbers. Equivalent to the \`-\` operator.

[`DSUM`](https://support.google.com/docs/answer/3094281): Returns the sum of values selected from a database table-like array or range using a SQL-like query.

[`DIVIDE`](https://support.google.com/docs/answer/3093973): Returns one number divided by another. Equivalent to the \`/\` operator.

[`COUNTIF`](https://support.google.com/docs/answer/3093480): Returns a conditional count across a range.

[`ADD`](https://support.google.com/docs/answer/3093590): Returns the sum of two numbers. Equivalent to the \`+\` operator.
