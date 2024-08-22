# IMPOWER function

The `IMPOWER` function returns a complex number raised to a power.

### Parts of a IMPOWER formula

The `IMPOWER` formula is formatted as `=IMPOWER(complex_base, exponent).`

### Sample formulas

`IMPOWER("4-3i",0.5)`

`IMPOWER(A2,B2)`

`IMPOWER("2j",-7)`

### Notes

* The exponentiation of a complex number is defined as follows:
  * (a+bi)^n^ = r^n^(cosθ + isinθ), where
  * r = √(x^2^ + y^2^) and θ = arctan(b/a)

### Examples


|   | A                                  | B                                    |
| - | ---------------------------------- | ------------------------------------ |
| 1 | **Formula**                        | **Result**                           |
| 2 | `=IMPOWER("5+2i", 3)`              | 65+142i                              |
| 3 | `=IMPOWER("-1-j", -1)`             | -0.5+0.5j                            |
| 4 | `=IMPOWER("0.732-5.349i", -0.138)` | 0.776914096672106+0.155872432042838i |

### Related functions

[`COMPLEX`](https://support.google.com/docs/answer/7407888): The COMPLEX function creates a complex number, given real and imaginary coefficients.

[`IMREAL`](https://support.google.com/docs/answer/7408138): Returns the real coefficient of a complex number.

[`IMAGINARY`](https://support.google.com/docs/answer/7408639): Returns the imaginary coefficient of a complex number.

[`POWER`](https://support.google.com/docs/answer/3093433): Returns a number raised to a power.
