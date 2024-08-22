# FACTDOUBLE

Returns the "double factorial" of a number.

### Sample Usage

`FACTDOUBLE(6)`

`FACTDOUBLE(A2)`

### Syntax

`FACTDOUBLE(value)`

* `value` - The number or reference to a number whose double factorial will be calculated and returned.

### Notes

* The double factorial is similar to the factorial, except instead of multiplying by each integer value less than or equal to the provided value, it decrements by 2. Thus the double factorial of 8 is 384 and the double factorial of 7 is 105.
* If a number or reference to a number with a decimal part is provided to `FACTDOUBLE`, the decimal part will be silently truncated before calculation.

### See Also

[`MULTINOMIAL`](https://support.google.com/docs/answer/3093429): Returns the factorial of the sum of values divided by the product of the values' factorials.

[`FACT`](https://support.google.com/docs/answer/3093412): The FACT function returns the factorial of a number.

[`COMBIN`](https://support.google.com/docs/answer/3093400): The COMBIN function returns the number of ways to choose some number of objects from a pool of a given size of objects.

### Examples

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdGQ1ZmhvaU82eTQzVmFpX1dPUlRMS3c&output=html" width="500"></iframe>
