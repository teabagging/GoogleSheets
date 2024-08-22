# ARRAYFORMULA

Enables the display of values returned from an array formula into multiple rows and/or columns and the use of non-array functions with arrays.

### Sample Usage

`ARRAYFORMULA(SUM(IF(A1:A10>5, A1:A10, 0)))`

`ARRAYFORMULA(A1:C1+A2:C2)`

### Syntax

`ARRAYFORMULA(array_formula)`

* `array_formula` - A range, mathematical expression using one cell range or multiple ranges of the same size, or a function that returns a result greater than one cell.

### Notes

* Many array formulas will be automatically expanded into neighboring cells, obviating the explicit use of `ARRAYFORMULA`.
* Pressing Ctrl+Shift+Enter while editing a formula will automatically add `ARRAYFORMULA(` to the beginning of the formula.
* Note that array formulas cannot be exported.

### See Also

[`ARRAY_CONSTRAIN`](https://support.google.com/docs/answer/3267036): Constrains an array result to a specified size.
