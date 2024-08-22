# Using arrays in Google Sheets

An array is a table (consisting of rows and columns) of values. If you want to group the values of your cells together in a particular order, you can use arrays in your spreadsheet.

Some functions return arrays. For example, `IMPORTRANGE` returns an array of values by importing the specified range from another spreadsheet. When you write a formula using `IMPORTRANGE`, you'll see its array result spill over to the cells to the right and below.

Any function that takes a range, such as A1:B6, as an input parameter will also accept an array in its place. For example, `SPARKLINE` takes a range as the first parameter to specify the values to plot. You can use the array result of `IMPORTRANGE` as `SPARKLINE's` input.

`=SPARKLINE(IMPORTRANGE(...))`

#### Create arrays

You can also create your own arrays in a formula in your spreadsheet by using brackets { }. The brackets allow you to group together values, while you use the following punctuation to determine which order the values are displayed in:

* **Commas**: Separate columns to help you write a row of data in an array. For example, `={1, 2}` would place the number 1 in the first cell and the number 2 in the cell to the right in a new column.
* **Semicolons**: Separate rows to help you write a column of data in an array. For example, `={1; 2}` would place the number 1 in the first cell and the number 2 in the cell below in a new row.

**Note**: For countries that use commas as decimal separators (for example €1,00), commas would be replaced by backslashes (\\) when creating arrays.

You can join multiple ranges into one continuous range using this same punctuation. For example, to combine values from A1-A10 with the values from D1-D10, you can use the following formula to create a range in a continuous column: `={A1:A10; D1:D10}`.

#### Adding arrays to existing formulas

You can also use arrays with other existing formulas using brackets in order to organize the returns from your formulas into rows or columns.

For example, `={SUM(A1:A10), SUM(B1:B10)}` will produce two values. The first cell will contain the sum of A1 to A10, the cell to the right will contain the sum of B1 to B10.
