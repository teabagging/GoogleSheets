# FLOOR

The FLOOR function rounds a number down to the nearest integer multiple of specified significance.

### Sample Usage

`FLOOR(23.25,0.1)`

`FLOOR(A2,1)`

### Syntax

`FLOOR(value, [factor])`

* `value` - The value to round down to the nearest integer multiple of `factor`.
* `factor` - **[**OPTIONAL - `1` by default**]** - The number to whose multiples `value` will be rounded.
  * `factor` may not be equal to `0`.

### Notes

* `value` can be positive or negative, but `factor` must be positive.
* `FLOOR` is most often used with `factor` set to a 'round' number such as `0.1` or `0.01` in order to round to a particular decimal place. However, `factor` can, in fact, be any number of the same sign as `value`, e.g. `FLOOR(23.25,0.18)` which results in `23.22`, which is 0.18 \* 129. This can be used, for instance, to round down to a particular denomination of currency (e.g. 0.25 or 0.05 USD).

### See Also

[`CEILING`](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.

[`TRUNC`](https://support.google.com/docs/answer/3093588): Truncates a number to a certain number of significant digits by omitting less significant digits.

[`ROUNDUP`](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.

[`ROUNDDOWN`](https://support.google.com/docs/answer/3093442): The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.

[`ROUND`](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.

[`MROUND`](https://support.google.com/docs/answer/3093426): Rounds one number to the nearest integer multiple of another.

[`INT`](https://support.google.com/docs/answer/3093490): Rounds a number down to the nearest integer that is less than or equal to it.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHJkb19yUExEWFVwRXc1MGNpaW5yQXc&output=html" width="500"></iframe>
