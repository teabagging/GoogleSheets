# MROUND

Rounds one number to the nearest integer multiple of another.

### Sample Usage

`MROUND(21,14)`

`MROUND(A2,3)`

### Syntax

`MROUND(value,factor)`

* `value` - The number to round to the nearest integer multiple of another.
* `factor` - The number to whose multiples `value` will be rounded.

### Notes

* Both `value` and `factor` may be non-integral.
* `value` and `factor` must have the same sign; that is, they must both be positive or both negative. If either is zero, `MROUND` will return `0`.
* If `value` is equally close to two multiples of `factor`, the multiple with the greater absolute value will be returned.

### See Also

[`TRUNC`](https://support.google.com/docs/answer/3093588): Truncates a number to a certain number of significant digits by omitting less significant digits.

[`ROUNDUP`](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.

[`ROUNDDOWN`](https://support.google.com/docs/answer/3093442): The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.

[`ROUND`](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.

[`INT`](https://support.google.com/docs/answer/3093490): Rounds a number down to the nearest integer that is less than or equal to it.

[`FLOOR`](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.

[`CEILING`](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdEhxb0Y2NG9nZ0duNHhWRVRNeFZnUEE&output=html" width="500"></iframe>
