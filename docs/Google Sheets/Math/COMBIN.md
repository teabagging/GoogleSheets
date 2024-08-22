# COMBIN

The COMBIN function returns the number of ways to choose some number of objects from a pool of a given size of objects.

### Sample Usage

`COMBIN(4,2)`

`COMBIN(A2,B2)`

### Syntax

`COMBIN(n, k)`

* `n` - The size of the pool of objects to choose from.
* `k` - The number of objects to choose.

### Notes

* `COMBIN` is the standard combinatorics function typically notated nCk and read "n choose k". This is equivalent to `FACT(n)/(FACT(k)*FACT(n-k))`.

### See Also

[`MULTINOMIAL`](https://support.google.com/docs/answer/3093429): Returns the factorial of the sum of values divided by the product of the values' factorials.

[`FACTDOUBLE`](https://support.google.com/docs/answer/3093414): Returns the "double factorial" of a number.

[`FACT`](https://support.google.com/docs/answer/3093412): The FACT function returns the factorial of a number.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdF8tZGpwSEREa1FhdTRuR2dld1I2dlE&output=html" width="500"></iframe>
