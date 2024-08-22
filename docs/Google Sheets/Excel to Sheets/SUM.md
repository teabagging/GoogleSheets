# SUM

Returns the sum of a series of numbers and/or cells.

### 

[SUM for BigQuery]

Returns the sum of a data column.

## Sample Usage

`=SUM(table_name!inventory)`

## Syntax

`SUM(column)`

* `column `- The data column to consider when calculating the sum.

**Tip:** Returning sum across multiple columns is not supported.

### Sample Usage

`SUM(A2:A100)`

`SUM(1,2,3,4,5)`

`SUM(1,2,A2:A50)`

### Syntax

`SUM(value1, [value2, ...])`

* `value1` - The first number or range to add together.
* `value2, ...` - **[** OPTIONAL **]** - Additional numbers or ranges to add to `value1`.

### Notes

* If only a single number for `value1` is supplied, `SUM` returns `value1`.
* Although `SUM` is specified as taking a maximum of 30 arguments, Google Sheets supports an arbitrary number of arguments for this function.

### See Also

[`SUMSQ`](https://support.google.com/docs/answer/3093714): Returns the sum of the squares of a series of numbers and/or cells.

[`SUMIF`](https://support.google.com/docs/answer/3093583): Returns a conditional sum across a range.

[`SERIESSUM`](https://support.google.com/docs/answer/3093444): Given parameters `x`, `n`, `m`, and `a`, returns the power series sum a~1~x^n^ + a~2~x^(n+m)^ + ... + a~i~x^(n+(i-1)m)^, where i is the number of entries in range \`a\`.

[`QUOTIENT`](https://support.google.com/docs/answer/3093436): Returns one number divided by another, without the remainder.

[`PRODUCT`](https://support.google.com/docs/answer/3093502): Returns the result of multiplying a series of numbers together.

[`MULTIPLY`](https://support.google.com/docs/answer/3093978): Returns the product of two numbers. Equivalent to the \`\*\` operator.

[`MINUS`](https://support.google.com/docs/answer/3093977): Returns the difference of two numbers. Equivalent to the \`-\` operator.

[`DIVIDE`](https://support.google.com/docs/answer/3093973): Returns one number divided by another. Equivalent to the \`/\` operator.

[`ADD`](https://support.google.com/docs/answer/3093590): Returns the sum of two numbers. Equivalent to the \`+\` operator.

### Examples

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHBPcnExTWRZZFlLV2Vyc2E4VUtYbkE&output=html"></iframe>
