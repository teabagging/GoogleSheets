# TRUNC

Truncates a number to a certain number of significant digits by omitting less significant digits.

### Sample Usage

`TRUNC(3.141592654,2)`

`TRUNC(A2,0)`

`TRUNC(1.23)`

### Syntax

`TRUNC(value, [places])`

* `value` - The value to be truncated.
* `places` - **[** OPTIONAL - `0` by default **]** - The number of significant digits to the right of the decimal point to retain.
  * If `places` is greater than the number of significant digits in `value`, value is returned without modification.
  * `places` may be negative, in which case the specified number of digits to the left of the decimal place are changed to zero. All digits to the right of the decimal place are discarded. If all digits of `value` are changed to zero, `TRUNC` simply returns `0`.

### Notes

* `TRUNC` performs no rounding, simply discarding unwanted digits.

### See Also

[`ROUNDUP`](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.

[`ROUNDDOWN`](https://support.google.com/docs/answer/3093442): The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.

[`ROUND`](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.

[`MROUND`](https://support.google.com/docs/answer/3093426): Rounds one number to the nearest integer multiple of another.

[`INT`](https://support.google.com/docs/answer/3093490): Rounds a number down to the nearest integer that is less than or equal to it.

[`FLOOR`](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.

[`CEILING`](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFYtSlp2MnBfNmZoMkljTTBSLWlPTGc&output=html" width="500"></iframe>
