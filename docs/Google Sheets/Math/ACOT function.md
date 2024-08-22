# ACOT function

The ACOT function returns the inverse cotangent of a value in radians.

## Parts of an ACOT function

`ACOT(value)`


| **Part** | **Description**                                         | **Notes**                  |
| -------- | ------------------------------------------------------- | -------------------------- |
| `value`  | The value for which to calculate the inverse cotangent. | * Values must be a number. |

## Sample formulas

`ACOT(0)`

`ACOT(-1)`

`ACOT(A1)`

## Notes

* ACOT returns results that are between 0 and π (pi).
* ACOT is sometimes written as "arccot" or "cot^-1^(x)" in mathematics or other programs.
* Use the DEGREES function to convert the result of ACOT from radians to degrees.

## Examples

This example shows the inverse cotangent of numbers in radians:


|       | **A**       | **B**         |
| ----- | ----------- | ------------- |
| **1** | **Formula** | **Result**    |
| **2** | =ACOT(4)    | 0.2449786631  |
| **3** | =ACOT(-4)   | -0.2449786631 |
| **4** | =ACOT(0)    | 1.570796327   |

This example shows the inverse cotangent of numbers converted to degrees:


|       | **A**    | **B**              | **C**        |
| ----- | -------- | ------------------ | ------------ |
| **1** | **Data** | **Formula**        | **Result**   |
| **2** | 4        | =DEGREES(ACOT(A2)) | 14.03624347  |
| **3** | -4       | =DEGREES(ACOT(A3)) | -14.03624347 |
| **4** | 0        | =DEGREES(ACOT(A4)) | 90           |

## Related functions

* [ACOTH](https://support.google.com/docs/answer/9084097): The ACOTH function returns the inverse hyperbolic cotangent of a value in radians.
* [COT](https://support.google.com/docs/answer/9084169): The COT function returns the cotangent of an angle provided in radians.
* [COTH](https://support.google.com/docs/answer/9084102): The COTH function returns the hyperbolic cotangent of any real number.
* [ATANH](https://support.google.com/docs/answer/3093397): The ATANH function returns the inverse hyperbolic tangent of a number.
* [ATAN](https://support.google.com/docs/answer/3093395): The ATAN function returns the inverse tangent of a value in radians.
* [ASINH](https://support.google.com/docs/answer/3093393): The ASINH function returns the inverse hyperbolic sine of a number.
* [ASIN](https://support.google.com/docs/answer/3093464): The ASIN function returns the inverse sine of a value in radians.
* [ACOSH](https://support.google.com/docs/answer/3093391): The ACOSH function returns the inverse hyperbolic cosine of a number.
* [ACOS](https://support.google.com/docs/answer/3093461): The ACOS function returns the inverse cosine of a value in radians.
* [DEGREES](https://support.google.com/docs/answer/3093481): The DEGREES function converts an angle value in radians to degrees.
* [RADIANS](https://support.google.com/docs/answer/3093437): The RADIANS function converts an angle value in degrees to radians.
* [PI](https://support.google.com/docs/answer/3093432): The PI function returns the value of pi to 9 decimal places.
