# MUNIT function

The MUNIT function returns a unit matrix of size dimension x dimension. The result of this function is an array of form:

1 0 …  0

0 1 ... 0

0 0 … ...

0 0 … 1

## Parts of a MUNIT function

`MUNIT(dimension)`


| **Part**    | **Description**                                                                        |
| ----------- | -------------------------------------------------------------------------------------- |
| `dimension` | Required. The size of the unit matrix. Dimension must be an integer greater than zero. |

## Sample formulas

`Example 1:  MUNIT(1)`

`Example 2: MUNIT(3)`

## Notes

If dimension is less than 1, `MUNIT` returns a #VALUE error.

## Examples

Result for A1=`MUNIT(1)`


|       | **A** |
| ----- | ----- |
| **1** | 1     |
| **2** |       |

Result for A1= `MUNIT(3)`


|       | **A** | **B** | **C** |
| ----- | ----- | ----- | ----- |
| **1** | 1     | 0     | 0     |
| **2** | 0     | 1     | 0     |
| **3** | 0     | 0     | 1     |

## Related functions

* [MMULT](https://support.google.com/docs/answer/3094292): Calculates the matrix product of two matrices specified as arrays or ranges.
* [RANDARRAY](https://support.google.com/docs/answer/9211904): The RANDARRAY function generates an array of random numbers between 0 and 1.
