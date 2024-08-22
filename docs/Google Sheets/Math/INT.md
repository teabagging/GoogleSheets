Rounds a number down to the nearest integer that is less than or equal to it.

### Sample Usage

`INT(99.44)`

`INT(A2)`

### Syntax

`INT(value)`

* `value` - The value to round down to the nearest integer..

### Notes

* `INT` is *not* equivalent to `ROUNDDOWN` with `places` set to `0`. `INT` rounds down using value, whereas `ROUNDDOWN` rounds down using absolute value, which causes differences for negative values of `value`.
* `INT` is also *not* equivalent to `FLOOR` with significance `-1` for negative values of `value` for the same reason as above. It is, however, equivalent to `FLOOR` with significance `1` for positive values of `value` and `CEILING` with significance `-1` for negative values of `value`.

### See Also

[`TRUNC`](https://support.google.com/docs/answer/3093588): Truncates a number to a certain number of significant digits by omitting less significant digits.

[`ROUNDUP`](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.

[`ROUNDDOWN`](https://support.google.com/docs/answer/3093442): The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.

[`ROUND`](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.

[`MROUND`](https://support.google.com/docs/answer/3093426): Rounds one number to the nearest integer multiple of another.

[`FLOOR`](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.

[`CEILING`](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFVycVJPMDNIZlFwUjh0cmV5Q2w4MVE&output=html" width="500"></iframe>
