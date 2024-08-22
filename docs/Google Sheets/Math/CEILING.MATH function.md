# CEILING.MATH function

The CEILING.MATH function rounds a number up to the nearest integer or to the nearest multiple of specified significance. It also specifies whether the number is rounded toward or away from 0 depending on the mode.

## Parts of a CEILING.MATH function

`CEILING.MATH(number, [significance], [mode])`


| **Part**       | **Description**                                                                                                                                     | **Notes**                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| `number`       | The value to round up to the nearest integer or if specified, the nearest multiple of`significance`.                                                |                          |
| `significance` | The value to whose multiple`number` will be rounded.                                                                                                | [OPTIONAL: 1 by default] |
| `mode`         | If`number` is negative, specifies the rounding direction. If 0 or blank, it's rounded up towards zero. Otherwise, it's rounded down away from zero. | [OPTIONAL]               |

## Sample formulas

`CEILING.MATH(5.4)<br/>CEILING.MATH(32, 5)<br/>CEILING.MATH(-26.2, 10, 1)`

## Notes

* By default, positive numbers with decimal places are rounded up to the nearest integer. For example, 4.3 is rounded up to 5.
* By default, negative numbers with decimal places are rounded up towards zero to the nearest integer. For example, -4.7 is rounded up to -4.

## Examples


|       | **A**                       | **B**      |
| ----- | --------------------------- | ---------- |
| **1** | **Formula**                 | **Result** |
| **2** | `=CEILING.MATH(11.2)`       | 12         |
| **3** | `=CEILING.MATH(-8.8)`       | -8         |
| **4** | `=CEILING.MATH(7.7,0.2)`    | 7.8        |
| **5** | `=CEILING.MATH(-10.2,2,-1)` | -12        |
| **6** | `=CEILING.MATH(-42,10,-1)`  | -50        |

## Related functions

* [CEILING](https://support.google.com/docs/answer/3093471): The CEILING function rounds a number up to the nearest integer multiple of specified significance.
* [ROUNDUP](https://support.google.com/docs/answer/3093443): Rounds a number to a certain number of decimal places, always rounding up to the next valid increment.
* [ROUND](https://support.google.com/docs/answer/3093440): The ROUND function rounds a number to a certain number of decimal places according to standard rules.
* FLOOR.MATH: Rounds a number down to the nearest integer multiple of specified significance, with negative numbers rounding toward or away from zero depending on the mode.
* [FLOOR](https://support.google.com/docs/answer/3093487): The FLOOR function rounds a number down to the nearest integer multiple of specified significance.
