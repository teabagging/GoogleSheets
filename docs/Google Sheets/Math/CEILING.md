# CEILING

The CEILING function rounds a number up to the nearest integer multiple of specified significance.

### Sample Usage

`CEILING(23.25,0.1)`

`CEILING(A2,1)`

### Syntax

`CEILING(value, [factor])`

* `value` - The value to round up to the nearest integer multiple of `factor`.
* `factor` - **[**OPTIONAL: `1` by default**]** - The number to whose multiples `value` will be rounded.
  * `factor` may not be equal to `0`.

### Notes

* When `value` is positive, `factor` must also be positive.
* When `value` is negative, `factor` can be either negative or positive to determine which direction to round.
* `CEILING` is most often used with `factor` set to a "round" number, such as `0.1` or `0.01,` in order to round to a particular decimal place.

### See Also

[`FLOOR`](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.

[`TRUNC`](https://support.google.com/docs/answer/3093588): Truncates a number to a certain number of significant digits by omitting less significant digits.

[`ROUNDUP`](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.

[`ROUNDDOWN`](https://support.google.com/docs/answer/3093442): The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.

[`ROUND`](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.

[`MROUND`](https://support.google.com/docs/answer/3093426): Rounds one number to the nearest integer multiple of another.

[`INT`](https://support.google.com/docs/answer/3093490): Rounds a number down to the nearest integer that is less than or equal to it.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdGlTT3dybS1DckwyTk9kOFJtdVI3akE&output=html" width="500"></iframe>
