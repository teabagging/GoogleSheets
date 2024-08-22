# SQRTPI

Returns the positive square root of the product of Pi and the given positive number.

### Sample Usage

`SQRTPI(9)`

`SQRTPI(A2)`

### Syntax

`SQRTPI(value)`

* `value` - The number which will be multiplied by Pi and have the product's square root returned
  * `value` must be positive; if it is negative, `SQRTPI` will return the `#NUM!` error.

### Notes

* To find the negative root of `value` \* Pi, simply multiply the result of the `SQRTPI` function call by `-1`.
* `SQRTPI` is used for certain types of analysis or as a component to other functions (e.g. an estimation of the Gamma function) and is rarely used by itself.

### See Also

[`SQRT`](https://support.google.com/docs/answer/3093577): Returns the positive square root of a positive number.

[`POWER`](https://support.google.com/docs/answer/3093433): Returns a number raised to a power.

[`LOG10`](https://support.google.com/docs/answer/3093423): Returns the logarithm of a number, base 10.

[`LOG`](https://support.google.com/docs/answer/3093495): Returns the logarithm of a number given a base.

[`LN`](https://support.google.com/docs/answer/3093422): Returns the logarithm of a number, base e (Euler's number).

[`GAMMALN`](https://support.google.com/docs/answer/3093416): Returns the logarithm of a specified Gamma function, base e (Euler's number).

[`EXP`](https://support.google.com/docs/answer/3093411): Returns Euler's number, e (\~2.718) raised to a power.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdExTeXpINGN1MmdvU0RuU3JLRTBfSUE&output=html" width="500"></iframe>
