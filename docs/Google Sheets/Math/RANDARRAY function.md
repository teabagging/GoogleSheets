# RANDARRAY function

The RANDARRAY function generates an array of random numbers between 0 and 1. The size of the array is determined by the provided rows and columns arguments.

## Parts of a RANDARRAY function

`RANDARRAY(rows, columns)`


| **Part**  | **Description**                                                                     |
| --------- | ----------------------------------------------------------------------------------- |
| `rows`    | The number of rows to return [optional]. Must be specified if columns is specified. |
| `columns` | The number of columns to return [optional].                                         |

 ## Sample formulas

`Example 1 RANDARRAY()`

`Example 2 RANDARRAY(4, 2)`

## Notes

* If rows and columns are omitted, RANDARRAY returns a 1 x 1 sized grid.
* Like the RAND function, hitting enter will cause RANDARRAY’s results to update.

## Examples


|       | **A**        | **B**       |
| ----- | ------------ | ----------- |
| **1** | **Formula**  | **Result**  |
| **2** | =RANDARRAY() | 0.292929292 |
| **3** |              |             |
| **4** |              |             |


|       | **A**           | **B**         | **C**       |
| ----- | --------------- | ------------- | ----------- |
| **1** | **Formula**     | **Result**    |             |
| **2** | =RANDARRAY(4,2) | 0.35464566    | 0.124214214 |
| **3** |                 | 0.45674863412 | 0.4561312   |
| **4** |                 | 0.4565146     | 0.12645601  |
| **5** |                 | 0.7878945     | 0.13459698  |

## Related functions

* [RAND](https://support.google.com/docs/answer/3093438) Returns a random number between 0 inclusive and 1 exclusive.
