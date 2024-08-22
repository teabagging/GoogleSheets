# ROUNDDOWN

The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.

### Sample Usage

`ROUNDDOWN(99.44,1)`

`ROUNDDOWN(A2)`

### Syntax

`ROUNDDOWN(value,[places])`

* `value` - The value to round to `places` number of places, always rounding down.
* `places` - **[** OPTIONAL - `0` by default **]** - The number of decimal places to which to round.
  * `places` may be negative, in which case `value` is rounded at the specified number of digits to the left of the decimal point.

### Notes

* `ROUNDDOWN` operates like `ROUND` except that it always rounds down.

### See Also

[`TRUNC`](https://support.google.com/docs/answer/3093588): Truncates a number to a certain number of significant digits by omitting less significant digits.

[`ROUNDUP`](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.

[`ROUND`](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.

[`MROUND`](https://support.google.com/docs/answer/3093426): Rounds one number to the nearest integer multiple of another.

[`INT`](https://support.google.com/docs/answer/3093490): Rounds a number down to the nearest integer that is less than or equal to it.

[`FLOOR`](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.

[`CEILING`](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdEc2QjRWNTk3enFtbHhNVWtxWnpUTVE&output=html" width="500"></iframe>
