The FLOOR.PRECISE functions rounds a number down to the nearest integer or multiple of specified significance.

## Parts of a FLOOR.PRECISE formula

`FLOOR.PRECISE(number, [significance])`


| **Part**       | **Description**                                                             | **Notes**                                                       |
| -------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `number`       | The value to round down to the nearest integer or multiple of significance. |                                                                 |
| `significance` | The number to whose multiple's number will be rounded.                      | * Optional (defaults to 1).* The sign of this value is ignored. |

## Sample formulas

`FLOOR.PRECISE(-10.5, 1)`

`FLOOR.PRECISE(96, 10)`

`FLOOR.PRECISE(-23.25,0.1)`

## Notes

* By default, positive numbers with decimal places are rounded down to the nearest integer. For example, 4.8 is rounded down to 4.
* Negative numbers are rounded down (away from zero). For example, -4.8 is rounded down to -5.

## Examples


|       | **A**                       | **B**      |
| ----- | --------------------------- | ---------- |
| **1** | **Formula**                 | **Result** |
| **2** | =FLOOR.PRECISE(-10.5, 1)    | -11        |
| **3** | =FLOOR.PRECISE(96, 10)      | 90         |
| **4** | =FLOOR.PRECISE(-23.25, 0.1) | -23.3      |

## Related functions

* [FLOOR](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.
* [FLOOR.MATH](https://support.google.com/docs/answer/9061444): The FLOOR.MATH function rounds a number down to the nearest integer or a multiple of specified significance, with negative numbers rounding toward or away from zero depending on the mode.
* [CEILING](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.
* [CEILING.MATH](https://support.google.com/docs/answer/9061515): The CEILING.MATH function rounds a number up to the nearest integer or to the nearest multiple of specified significance. It also specifies whether the number is rounded toward or away from 0 depending on the mode.
* [CEILING.PRECISE](https://support.google.com/docs/answer/9061294):The CEILING.PRECISE function rounds a number up to the nearest integer or multiple of specified significance. If the number is positive or negative, it's rounded up.
* [ROUNDDOWN](https://support.google.com/docs/answer/3093442): The ROUNDDOWN function rounds a number to a certain number of decimal places, always rounding down to the next valid increment.
* [ROUND](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.
