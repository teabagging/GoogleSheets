# IMLN function

The `IMLN` function returns the logarithm of a complex number, base e (Euler's number).

### Parts of a IMLN formula

The `IMLN` formula is formatted as `=IIMLN(number).`

### Sample formulas

`IMLN("3+4i")`

`IMLN(A2)`

`IMLN("4+2j")`

### Notes

* `IMLN<span> </span>`is equivalent to `LN` for all non-complex values that are greater than zero.
* `IMLN` is equivalent to `LOG` given base of `e`, or `EXP(1)`, for all non-complex values that are greater than zero.
* The natural logarithm of a complex number is defined as follows:
  * ln(x+yi) = √(x^2^+y^2^) + i tan^-1^(y/x)

### Examples


|   | A               | B                                    |
| - | --------------- | ------------------------------------ |
| 1 | **Formula**     | **Result**                           |
| 2 | `=IMLN("1+i")`  | 0.346573590279973+0.785398163397448i |
| 3 | `=IMLN("4+2j")` | 1.497866136777+0.463647609000806i    |
| 4 | `=IMLN("-4.6")` | 1.52605630349505+3.14159265358979i   |

### Related functions

[`LN`](https://support.google.com/docs/answer/3093422): Returns the logarithm of a number, base e (Euler's number).

[`COMPLEX`](https://support.google.com/docs/answer/7407888): The COMPLEX function creates a complex number, given real and imaginary coefficients.

[`IMAGINARY`](https://support.google.com/docs/answer/7408639): Returns the imaginary coefficient of a complex number.

[`IMREAL`](https://support.google.com/docs/answer/7408138): Returns the real coefficient of a complex number.

[`LOG10`](https://support.google.com/docs/answer/3093423): Returns the logarithm of a number, base 10.

[`LOG`](https://support.google.com/docs/answer/3093495): Returns the logarithm of a number given a base.

[`EXP`](https://support.google.com/docs/answer/3093411): Returns Euler's number, e (\~2.718) raised to a power.
