# SEQUENCE function

The SEQUENCE function returns an array of sequential numbers, such as 1, 2, 3, 4.

## Parts of a SEQUENCE function

`SEQUENCE(rows, columns, start, step)`


| **Part**  | **Description**                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| `rows`    | Required. The number of rows to return                                                                              |
| `columns` | Optional. The number of columns to return. If omitted, the returned array will have one column.                     |
| `start`   | Optional. The number to start the sequence at. If omitted, the sequence will start at 1.                            |
| `step`    | Optional. The amount to increase/decrease each number in the sequence. If omitted, the sequence will increase by 1. |

## Sample formulas

`Example 1: SEQUENCE(2)`

`Example 2: SEQUENCE(2, 3)`

`Example 3: SEQUENCE(2, 3, 3, 2)`

`Example 4: SEQUENCE(2, 3, 10, -1)`

## Notes

If columns is omitted, the resulting array will be a vertical list. If a horizontal list is needed, either specify rows as 1 and specify columns or transpose the vertical result.

Result for A1=`SEQUENCE(2)`


|       | **A** | **B** |
| ----- | ----- | ----- |
| **1** | 1     |       |
| **2** | 2     |       |

Result for A1= `SEQUENCE(2, 3)`


|       | **A** | **B** | **C** |
| ----- | ----- | ----- | ----- |
| **1** | 1     | 2     | 3     |
| **2** | 4     | 5     | 6     |
| **3** |       |       |       |

Result for A1= `SEQUENCE(2, 3, 3, 2)`


|       | **A** | **B** | **C** |
| ----- | ----- | ----- | ----- |
| **1** | 3     | 5     | 7     |
| **2** | 9     | 11    | 13    |
| **3** |       |       |       |

Result for A1= `SEQUENCE(2, 3, 10, -1)`


|       | **A** | **B** | **C** |
| ----- | ----- | ----- | ----- |
| **1** | 10    | 9     | 8     |
| **2** | 7     | 6     | 5     |
| **3** | 4     | 3     | 2     |

## Related functions

* [MUNIT](https://support.google.com/docs/answer/9368156): The MUNIT function returns a unit matrix of size dimension x dimension.
* [RANDARRAY](https://support.google.com/docs/answer/9211904): The RANDARRAY function generates an array of random numbers between 0 and 1.
