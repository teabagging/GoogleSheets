# SUMSQ

Returns the sum of the squares of a series of numbers and/or cells.

### Sample Usage

`SUMSQ(A2:A100)`

`SUMSQ(1,2,3,4,5)`

`SUMSQ(1,2,A2:A50)`

### Syntax

`SUMSQ(value1, [value2, ...])`

* `value1` - The first number or range whose squares to add together.
* `value2, ...` - **[** OPTIONAL **]** - Additional numbers or ranges whose squares to add to the square(s) of `value1`.

### Notes

* If only a single number for `value1` is supplied, `SUMSQ` returns `value1` squared.
* Although `SUMSQ` is specified as taking a maximum of 30 arguments, Google Sheets supports an arbitrary number of arguments for this function.

### See Also

[`SUM`](https://support.google.com/docs/answer/3093669): Returns the sum of a series of numbers and/or cells.

[`SUMIF`](https://support.google.com/docs/answer/3093583): Returns a conditional sum across a range.

[`SERIESSUM`](https://support.google.com/docs/answer/3093444): Given parameters `x`, `n`, `m`, and `a`, returns the power series sum a~1~x^n^ + a~2~x^(n+m)^ + ... + a~i~x^(n+(i-1)m)^, where i is the number of entries in range \`a\`.

[`QUOTIENT`](https://support.google.com/docs/answer/3093436): Returns one number divided by another, without the remainder.

[`PRODUCT`](https://support.google.com/docs/answer/3093502): Returns the result of multiplying a series of numbers together.

[`MULTIPLY`](https://support.google.com/docs/answer/3093978): Returns the product of two numbers. Equivalent to the \`\*\` operator.

[`MINUS`](https://support.google.com/docs/answer/3093977): Returns the difference of two numbers. Equivalent to the \`-\` operator.

[`DIVIDE`](https://support.google.com/docs/answer/3093973): Returns one number divided by another. Equivalent to the \`/\` operator.

[`ADD`](https://support.google.com/docs/answer/3093590): Returns the sum of two numbers. Equivalent to the \`+\` operator.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHFZSTEwR0Q2cFNXLTFCWUs0eFBpM0E&output=html" width="500"></iframe>
