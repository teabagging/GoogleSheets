# SERIESSUM

Given parameters `x`, `n`, `m`, and `a`, returns the power series sum a~1~x^n^ + a~2~x^(n+m)^ + ... + a~i~x^(n+(i-1)m)^, where i is the number of entries in range \`a\`.

### Sample Usage

`SERIESSUM(1,0,1,{FACT(0),FACT(1),FACT(2),FACT(3),FACT(4)})`

`SERIESSUM(A2,0,2,B2:B10)`

### Syntax

`SERIESSUM(x, n, m, a)`

* `x` - The input to the power series. Varies depending on the type of approximation, may be angle, exponent, or some other value.
* `n` - The initial power to which to raise `x` in the power series.
* `m` - The additive increment by which to increase `x`.
* `a` - The array or range containing the coefficients of the power series.

### Notes

* Power series may be used to approximate various constants and functions, including e (Euler's number), logarithms, integrals, trigonometric functions, etc. However, this function is usually used for custom user-defined models.

### See Also

[`SUMSQ`](https://support.google.com/docs/answer/3093714): Returns the sum of the squares of a series of numbers and/or cells.

[`SUMIF`](https://support.google.com/docs/answer/3093583): Returns a conditional sum across a range.

[`SUM`](https://support.google.com/docs/answer/3093669): Returns the sum of a series of numbers and/or cells.

[`QUOTIENT`](https://support.google.com/docs/answer/3093436): Returns one number divided by another, without the remainder.

[`PRODUCT`](https://support.google.com/docs/answer/3093502): Returns the result of multiplying a series of numbers together.

[`MULTIPLY`](https://support.google.com/docs/answer/3093978): Returns the product of two numbers. Equivalent to the \`\*\` operator.

[`MINUS`](https://support.google.com/docs/answer/3093977): Returns the difference of two numbers. Equivalent to the \`-\` operator.

[`DIVIDE`](https://support.google.com/docs/answer/3093973): Returns one number divided by another. Equivalent to the \`/\` operator.

[`ADD`](https://support.google.com/docs/answer/3093590): Returns the sum of two numbers. Equivalent to the \`+\` operator.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHJVcmVqYmgwd2hFQWxYVTVfUUt5QXc&output=html" width="500"></iframe>
