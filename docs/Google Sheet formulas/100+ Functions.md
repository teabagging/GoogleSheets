# 100+ Functions

This cheat sheet simplifies the functionalities and capabilities of Google Sheets and Excel, providing a comprehensive guide to master these tools.

You’ll discover a wide range of topics, from basic mathematical operations to complex financial calculations, ensuring you can navigate your data with ease and precision.

Explore advanced features like custom function creation, data manipulation, and dynamic arrays to leverage the full potential of both platforms.

Along the way, you’ll find links to relevant content on our blog.

#### **Spreadsheets are just the start**

[DISCOVER SHEETGO](https://www.sheetgo.com/products/workflows/)

### **100+ Functions & formulas for Google Sheets & Excel basics**

1. [Getting started with spreadsheets](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#getting)
   1. [Definitions](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#definitions)
   2. [Basic features](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#basic)
   3. [Cell references](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#cell)
2. [Operators](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#operators)
   1. [Arithmetic operators](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#arithmetic)
   2. [Comparison operators](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#comparison)
3. [Functions](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#functions)
   1. [Core spreadsheet functions](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#core)
   2. [Data manipulation](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#data)
   3. [Advanced functions](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#advanced)
   4. [Error handling](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#error)
   5. [Financial analysis](https://blog.sheetgo.com/excel-features/100-functions-formulas-for-google-sheets-excel-basics/#financial)

## Getting started with spreadsheets

Learn the basic concepts and tools that make spreadsheets powerful for data management, analysis, and visualization.

If you’re new to spreadsheets, this section is for you. If you’re looking to explore advanced functions, feel free to skip ahead.

### Definitions

**Spreadsheet software**: An application like Microsoft Excel or Google Sheets used to store data, perform calculations, and organize information.

**Worksheet**: A single page in a workbook. It is a grid of cells arranged in rows and columns. In Google Sheets, worksheets are sometimes called “sheets.”

**Spreadsheet [Google Sheets]**: A file with one or more worksheets.

**Workbook [Excel]**: A file containing one or more worksheets.

**Cell**: A rectangular box in a worksheet that can store a data value, a formula, or other content.

**Cell reference**: The location of a cell. The column is described with letters, and the row is described with numbers. For example, the cell in the 4th column and 7th row is denoted D7.

**Cell range**: A group of adjacent cells in a worksheet. It’s expressed with cell references, indicating the upper and lower limits. For example, A1:C3 refers to cells in columns A, B, and C, and rows 1, 2, and 3. You can use cell ranges to perform calculations on multiple cells or apply formatting to a group.


|   | A  | B  | C  |
| - | -- | -- | -- |
| 1 | A1 | B1 | C1 |
| 2 | A2 | B2 | C2 |
| 3 | A3 | B3 | C3 |

**Formula**: A piece of code that performs a calculation. Formulas start with an equal sign (=) and can contain functions, mathematical operators, values, and cell references.

### Basic features

Getting started with spreadsheets means understanding fundamental features. You can format cells to change their appearance, adjust text alignment, set fonts, and apply colors to distinguish different data types or priorities.

These features form the foundation of effective spreadsheet use in both Google Sheets and Excel.

#### Add comments to cells

1. Click on the cell where you want to add a comment.
2. Right click or **CTRL+**click on the cell and select** New Comment** from the context menu. You can also click the **Insert** menu then **New Comment**.
3. This will open a small text box where you can type your comment.
4. Once you have entered your comment, click the green arrow button to save it.

### Cell references

When referencing cells in spreadsheets, keep these key points in mind:


|                                                                                                                                                                                 | Description                                                                                                                                          | Example                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Single cell reference                                                                                                                                                           | Refer to a specific cell using its column letter and row number.                                                                                     | =B2                                                                                    |
| Cell ranges                                                                                                                                                                     | Use the start:end format to specify a range of cells in a formula.                                                                                   | =SUM(B2:B5)                                                                            |
| [Absolute](https://blog.sheetgo.com/google-sheets-features/absolute-cell-reference/)[ cell reference](https://blog.sheetgo.com/google-sheets-features/absolute-cell-reference/) | A cell address that remains constant, regardless of where the formula is copied or moved. Use\$ to make a cell reference absolute.                   | =\$B\$2 (Both column and row are absolute)                                             |
| Relative cell reference                                                                                                                                                         | A cell address that adjusts based on the location where the formula is copied or moved.  By default all cell references are relative.                |                                                                                        |
| Mixed cell reference                                                                                                                                                            | A cell reference that combines both absolute and relative references. This means that either the column or the row is fixed with a dollar sign (\$). | =\$B2 (Column is absolute, row is relative)=B\$2 (Column is relative, row is absolute) |

## Operators

Operators in spreadsheet applications are special symbols or that perform operations on one or more values to produce a result. These tools are essential for building formulas that process data, perform calculations, manipulate text, and make logical decisions within a spreadsheet.

### Arithmetic operators

Arithmetic operators are a subset of operators used specifically for performing basic mathematical calculations. These calculations can be performed on numeric values, cells, and ranges within a spreadsheet.


| **Operator** | **Description**                 | **Example** | **Example Results** |
| ------------ | ------------------------------- | ----------- | ------------------- |
| +            | Add two values                  | 3 + 6       | 9                   |
| –           | Subtract one value from another | 10 – 7     | 3                   |
| \*           | Multiply two values             | 21\* 2      | 42                  |
| /            | Divide one value by another     | 28 / 7      | 4                   |
| %            | Convert a value to a percentage | 3.25%       | 0.0325              |
| ^            | Raise a value to a power        | 2 ^ 6       | 64                  |

### Comparison operators

Comparison operators return logical values (TRUE or FALSE) from a comparison of two values. They form the backbone of logical statements, conditional formatting, and data validation.

Understanding and utilizing comparison operators empower users to create more dynamic, responsive, and useful spreadsheets by harnessing the power of logical testing and condition-based operations.


## Functions

### Core Spreadsheet Functions

#### Math Functions

Math functions in spreadsheets offer a range of capabilities for performing complex calculations. They can handle tasks from basic arithmetic to advanced statistical analysis, enabling users to work with numbers, calculate statistics, and perform financial modeling.


| Function                                                                                 | Description                                                                  | Example                      | Example Result                   |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------- | -------------------------------- |
| [LOG()](https://blog.sheetgo.com/google-sheets-formulas/log-formula-in-google-sheets/)   | Calculates the logarithm of a number to a specified base.                    | =LOG(100, 10)                | 2                                |
| EXP()                                                                                    | Returns the raised power of a given number.                                  | =EXP(2)                      | 7.398                            |
| MAX()                                                                                    | Finds the largest value in a set of values.                                  | =MAX(A1:A6, C1:C3, 12)       | 28                               |
| MIN()                                                                                    | Finds the smallest value in a set of values.                                 | =MIN(A1:A6, C1:C3, 12)       | 1                                |
| MAXA()                                                                                   | Similar to MAX, but counts TRUE as 1 and FALSE as 0.                         | =MAXA(A1:A6, C1:C3, FALSE)   | Value as MAX(), TRUE as 1        |
| MINA()                                                                                   | Similar to MIN, but counts TRUE as 1 and FALSE as 0.                         | =MINA(A1:A6, C1:C3, FALSE)   | Value as MIN(), TRUE as 1        |
| SUM()                                                                                    | Adds all numbers in a range of cells.                                        | =SUM(A1:A6, C1:C3, 12)       | 108                              |
| AVERAGE()                                                                                | Calculates the mean of a group of numbers.                                   | =AVERAGE(A1:A6, C1:C3, 12)   | 12                               |
| MEDIAN()                                                                                 | Finds the median value in a set of numbers.                                  | =MEDIAN(A1:A6, C1:C3, 12)    | 10                               |
| PERCENTILE.INC()                                                                         | Calculates the nth percentile of a data set.                                 | =PERCENTILE.INC(C1:C6, 0.25) | 22.75                            |
| CEILING()                                                                                | Rounds a number up, away from zero, to the nearest multiple of significance. | =CEILING(PI(), 0.1)          | 3.2                              |
| FLOOR()                                                                                  | Rounds a number down, towards zero, to the nearest multiple of significance. | =FLOOR(PI(), 0.1)            | 3.1                              |
| VAR.S()                                                                                  | Calculates the sample variance of a data set.                                | =VAR.S(B1:B6)                | 19.37                            |
| STDEV.S()                                                                                | Calculates the sample standard deviation of a data set.                      | =STDEV.S(B1:B6)              | 4.40                             |
| POWER()                                                                                  | Raises a number to a specified power.                                        | =POWER(2,3)                  | 8                                |
| SQRT()                                                                                   | Returns the square root of a number.                                         | =SQRT(16)                    | 4                                |
| ABS()                                                                                    | Returns the absolute value of a number.                                      | =ABS(-5)                     | 5                                |
| MOD()                                                                                    | Returns the remainder after division.                                        | =MOD(10,3)                   | 1                                |
| MODE()                                                                                   | Returns the most frequently occurring number in a range.                     | =MODE(A1:A10)                | Most frequent number in A1:A10   |
| [RAND()](https://blog.sheetgo.com/google-sheets-formulas/rand-formula-in-google-sheets/) | Generates a random number between 0 and 1.                                   | =RAND()                      | Random number between 0 and 1    |
| RANDBETWEEN()                                                                            | Generates a random integer number between specified values.                  | =RANDBETWEEN(1,100)          | Random integer between 1 and 100 |

### Text functions

Text functions and operators in spreadsheets are invaluable tools for manipulating and analyzing strings of text. These functions allow users to measure, combine, split, and alter text data in various ways, facilitating the organization, extraction, and transformation of textual information.


| **Function**                                                                               | **Description**                                                                | **Example**                         | **Example Result**           |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------- | ---------------------------- |
| [LEN()](https://blog.sheetgo.com/google-sheets-formulas/len-formula-in-google-sheets/)     | Returns the length of a string in characters.                                  | =LEN(D5)                            | 28                           |
| & (Concatenate)                                                                            | Combines multiple strings into one.                                            | =”Hello ” & D1 & “!”            | “Hello World!”             |
| REPT()                                                                                     | Repeats text a given number of times.                                          | =REPT(D6, 3)                        | “UniverseUniverseUniverse” |
| TEXTSPLIT()                                                                                | Splits a string on a specified delimiter into separate cells.                  | =TEXTSPLIT(D4, “o”)               | “L”, “cal Gr”, “up”    |
| TRIM()                                                                                     | Removes extra spaces from text.                                                | =TRIM(” Hello World “)            | “Hello World”              |
| UPPER()                                                                                    | Converts all letters in a text string to uppercase.                            | =UPPER(D3)                          | “MILKY WAY”                |
| LOWER()                                                                                    | Converts all letters in a text string to lowercase.                            | =LOWER(D3)                          | “milky way”                |
| PROPER()                                                                                   | Converts text to title case (the first letter in each word to uppercase).      | =PROPER(“milky way”)              | “Milky Way”                |
| ‘ (Apostrophe)                                                                            | Treats numbers as text.                                                        | ‘12345                             | “12345” (as text)          |
| [SEARCH()](https://blog.sheetgo.com/google-sheets-formulas/iferror-formula-google-sheets/) | Finds the position of a substring, case-insensitive.                           | =SEARCH(“world”, “Hello World”) | 7                            |
| [LEFT()](https://blog.sheetgo.com/google-sheets-formulas/left-formula-in-google-sheets/)   | Returns characters from the start of a text string.                            | =LEFT(“Hello World”, 5)           | “Hello”                    |
| RIGHT()                                                                                    | Returns characters from the end of a text string.                              | =RIGHT(“Hello World”, 5)          | “World”                    |
| [MID()](https://blog.sheetgo.com/google-sheets-formulas/mid-formula-in-google-sheets/)     | Extracts a substring from a text string, given a starting position and length. | =MID(D6, 4, 5)                      | “verse”                    |

#### Dates

Date functions in spreadsheets are essential for handling date information. These functions facilitate operations such as creating dates, calculating the difference between dates, and extracting specific components from a date.


| Function                                                                                       | Description                                                                                       | Example                                      | Example Result                                               |
| ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------ |
| [DATE()](https://blog.sheetgo.com/google-sheets-formulas/date-formula-google-sheets/)          | Creates a date from year, month, and day values.                                                  | =DATE(2023, 1, 1)                            | Serial number for January 1, 2023                            |
| [NETWORKDAYS()](https://blog.sheetgo.com/google-sheets-formulas/mid-formula-in-google-sheets/) | Counts working days between two dates, excluding weekends and optional holidays.                  | =NETWORKDAYS(“2023-01-01”, “2023-01-31”) | Number of whole workdays in January 2023, excluding weekends |
| DATEVALUE()                                                                                    | Converts a date in text format to a serial number.                                                | =DATEVALUE(“2023-01-01”)                   | Serial number for January 1, 2023                            |
| [EOMONTH()](https://blog.sheetgo.com/google-sheets-formulas/eomonth-formula-google-sheets/)    | Finds the last day of the month a specified number of months before or after a start date.        | =EOMONTH(“2023-01-01”, 1)                  | Serial number for the last day of February 2023              |
| [EDATE()](https://blog.sheetgo.com/google-sheets-formulas/edate-formula-google-sheets/)        | Calculates the serial number of the date a certain number of months before or after a start date. | =EDATE(“2023-01-01”, -1)                   | Serial number for December 1, 2022                           |
| [NOW()](https://blog.sheetgo.com/google-sheets-formulas/now-formula-in-google-sheets/)         | Returns the current date and time.                                                                | =NOW()                                       | Current date and time as a serial number                     |
| [TODAY()](https://blog.sheetgo.com/google-sheets-formulas/today-formula-google-sheets/)        | Returns the current date.                                                                         | =TODAY()                                     | Current date as a serial number                              |
| MONTH()                                                                                        | Extracts the month from a date.                                                                   | =MONTH(“2023-03-15”)                       | 3 (March)                                                    |
| [YEAR()](https://blog.sheetgo.com/google-sheets-formulas/year-formula-in-google-sheets/)       | Extracts the year from a date.                                                                    | =YEAR(“2023-03-15”)                        | 2023                                                         |
| [WEEKDAY()](https://blog.sheetgo.com/google-sheets-formulas/weekday-formula-google-sheets/)    | Extracts the weekday from a date.                                                                 | =WEEKDAY(“2023-03-15”)                     | 4 (Wednesday)                                                |

#### Conditional/Boolean

### Logical Functions

Logical functions are used in spreadsheets to perform operations that evaluate to TRUE or FALSE. These functions allow for decision making within formulas based on specific conditions.


| Function                                                                            | Description                                                         | Example              | Example Result |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------- | -------------- |
| [NOT()](https://blog.sheetgo.com/google-sheets-formulas/not-formula-google-sheets/) | Logical NOT: returns TRUE if the argument is FALSE, and vice versa. | =NOT(1 = 2)          | TRUE           |
| [OR()](https://blog.sheetgo.com/google-sheets-formulas/or-formula-google-sheets/)   | Logical OR: returns TRUE if any of the arguments are TRUE.          | =OR(1 > 10, 2 < 20)  | TRUE           |
| [AND()](https://blog.sheetgo.com/google-sheets-formulas/and-formula-google-sheets/) | Logical AND: returns TRUE only if all arguments are TRUE.           | =AND(1 > 10, 2 < 20) | FALSE          |
| XOR()                                                                               | Logical XOR: returns TRUE if an odd number of arguments are TRUE.   | =XOR(1 > 10, 2 < 20) | TRUE           |

#### Data Types

#### Counting data

Counting functions in spreadsheets are essential for aggregating data. They allow users to count the number of cells that meet specific criteria, such as non-empty cells, cells containing numbers, or even blank cells within a specified range.


| Function     | Description                                                 | Example            | Example Result |
| ------------ | ----------------------------------------------------------- | ------------------ | -------------- |
| COUNT()      | Counts the number of cells in a range that contain numbers. | =COUNT(A5:E5)      | 3              |
| COUNTA()     | Counts the number of cells in a range that are not empty.   | =COUNTA(A5:E5)     | 4              |
| COUNTBLANK() | Counts the number of empty cells in a specified range.      | =COUNTBLANK(A5:E5) | 1              |

### Data Manipulation

Data manipulation functions in spreadsheets enable users to filter, sort, and organize data dynamically. These functions provide powerful ways to view and analyze data sets, making it easier to understand trends, find unique values, and generate sequences based on specific criteria.


| **Function**                                                                              | **Description**                                                                                | **Example**               | **Example Result**                                                          |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| [FILTER()](https://blog.sheetgo.com/google-sheets-formulas/filter-formula-google-sheets/) | Retrieves a subset of data that meets a specified condition.                                   | =FILTER(A1:B6, C1:C6>100) | Subset of A1:B6 where corresponding C1:C6 values are > 100                  |
| [SORT()](https://blog.sheetgo.com/google-sheets-formulas/sort-formula-google-sheets/)     | Sorts the rows of a data range based on the values in one or more columns.                     | =SORT(A1:E6, 4)           | Dataset sorted in alphabetical order of the fourth column                   |
| SORTBY()                                                                                  | Sorts a range based on the values in another range or array.                                   | =SORTBY(A1:E6, D1:D6)     | Dataset sorted based on values in D1:D6                                     |
| [UNIQUE()](https://blog.sheetgo.com/google-sheets-formulas/unique-formula-google-sheets/) | Returns a list of unique values from a specified range.                                        | =UNIQUE(A1:A6)            | Unique values from A1:A6                                                    |
| SEQUENCE()                                                                                | Generates a sequence of numbers based on start value, number of rows, and step.                | =SEQUENCE(5, 1, 3, 2)     | 5 rows, 1 column with values 3, 5, 7, 9, 11                                 |
| TRANSPOSE()                                                                               | Transposes the rows and columns of a range or array, effectively “flipping” its orientation. | =TRANSPOSE(A1:B2)         | Transposes the data in the range A1:B2 from rows to columns, or vice versa. |

### Data types

Data type functions in spreadsheets are used to check or convert the type of data in a cell, such as determining if a cell contains a number, text, or boolean value, or converting between these types.


| Function    | Description                                             | Example                | Example Result      |
| ----------- | ------------------------------------------------------- | ---------------------- | ------------------- |
| ISNUMBER()  | Checks if a cell is a number.                           | =ISNUMBER(A1)          | TRUE                |
| ISTEXT()    | Checks if a cell is text.                               | =ISTEXT(D1)            | TRUE                |
| ISLOGICAL() | Checks if a cell is a boolean (logical value).          | =ISLOGICAL(A1)         | FALSE               |
| ISLOGICAL() | Checks if an expression is a boolean (logical value).   | =ISLOGICAL(A1=A1)      | TRUE                |
| N()         | Converts to number. Converts a date to a serial number. | =N(E1)                 | 44927               |
| TEXT()      | Convert to formatted text.                              | =TEXT(C6, “0.00E+0”) | “4.96E+2”         |
| ISBLANK()   | Checks if a cell is empty.                              | =ISBLANK(A1)           | TRUE if A1 is empty |

### 

Sum

The “Sum” functions in spreadsheets are designed to facilitate the aggregation of values within a range, supporting basic sum operations, condition-based sums, and more complex aggregations like the product sum or subtotals that can selectively ignore hidden rows or filter-applied rows.


| **Function**                                                                                      | **Description**                                                                                 | **Example**                     | **Example Result**                                                         |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| SUM()                                                                                             | Adds all numbers in a specified range or list of arguments.                                     | =SUM(A1:A10)                    | Sums the values in cells A1 through A10                                    |
| [SUMIFS()](https://blog.sheetgo.com/google-sheets-formulas/sumifs-with-multiple-criteria/)        | Sums the values in a range based on multiple criteria.                                          | =SUMIFS(B1:B10, A1:A10, “>5”) | Sums values in B1:B10 where corresponding A1:A10 values are greater than 5 |
| [SUMPRODUCT()](https://blog.sheetgo.com/google-sheets-formulas/sumproduct-formula-google-sheets/) | Calculates the sum of the products of corresponding numbers in one or more arrays.              | =SUMPRODUCT(A1:A10, B1:B10)     | Sums the products of corresponding values in ranges A1:A10 and B1:B10      |
| SUBTOTAL()                                                                                        | Calculates a subtotal using a specified function over a range, optionally ignoring hidden rows. | =SUBTOTAL(9, A1:A10)            | Returns the sum of A1:A10, ignoring rows hidden by a filter if applied     |

#### Lookups

Lookup functions are essential for searching and retrieving data from different parts of a spreadsheet. They provide a powerful way to access and compare data across tables and ranges.


| Function                                                                                        | Description                                                                                                                | Example                                     | Example Result                                                            |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------- |
| [LOOKUP()](https://blog.sheetgo.com/google-sheets-formulas/lookup-formula-google-sheets/)       | The LOOKUP function searches for a value in a range and returns a corresponding value from another range.                  | =LOOKUP(“Product”, A1:A10, B1:B10)        | Finds “Product” in A1 and returns the corresponding value from B1<br/>  |
| [VLOOKUP()](https://blog.sheetgo.com/google-sheets-formulas/vlookup-formula-google-sheets/)     | Searches for a value in the first column of a table and returns a value in the same row from a specified column.           | =VLOOKUP(“Value”, A1:B10, 2, FALSE)       | Value from the second column where “Value” is found in the first column |
| [HLOOKUP()](https://blog.sheetgo.com/google-sheets-formulas/use-hlookup-formula-google-sheets/) | Searches for a value in the first row of a table and returns a value in the same column from a specified row.              | =HLOOKUP(“Value”, A1:J2, 2, FALSE)        | Value from the second row where “Value” is found in the first row       |
| [XLOOKUP()](https://blog.sheetgo.com/excel-functions/xlookup-excel/)                            | Searches a range or an array for a match and returns the corresponding item from a second range or array.                  | =XLOOKUP(“Value”, A1:A10, B1:B10)         | Value from range B1:B10 corresponding to “Value” found in A1:A10        |
| INDEX() + MATCH()                                                                               | Combines to perform flexible lookups by using MATCH to find the position and INDEX to retrieve the value at that position. | =INDEX(B1:B10, MATCH(“Value”, A1:A10, 0)) | Value from B1:B10 in the row where “Value” is found in A1:A10           |

#### Round

Rounding functions in spreadsheets are crucial for managing numerical data, especially when preparing financial reports, performing statistical analyses, or simply ensuring data consistency by limiting the number of decimal places. These functions can round numbers in various ways to meet different requirements.


| **Function** | **Description**                                                         | **Example**            | **Example Result** |
| ------------ | ----------------------------------------------------------------------- | ---------------------- | ------------------ |
| ROUND()      | Rounds a number to a specified number of digits.                        | =ROUND(3.14159, 2)     | 3.14               |
| ROUNDUP()    | Rounds a number up to the nearest specified number of decimal places.   | =ROUNDUP(3.14159, 2)   | 3.15               |
| ROUNDDOWN()  | Rounds a number down to the nearest specified number of decimal places. | =ROUNDDOWN(3.14159, 2) | 3.14               |
| INT()        | Rounds a number down to the nearest integer.                            | =INT(3.14159)          | 3                  |

### Advanced Functions

#### Flow Control

Flow control functions in spreadsheets are designed to enhance decision-making processes within formulas, enabling dynamic responses based on various conditions.

These functions allow users to direct the flow of calculations and handle errors more gracefully, ensuring more robust and flexible spreadsheet models.


| **Function**                                                                                                                                                                                                                                                                     | **Description**                                                                | **Example**                                            | **Example Result** |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------ |
| [IF()](https://blog.sheetgo.com/google-sheets-formulas/if-formula-google-sheets/)                                                                                                                                                                                                | Uses a logical condition to return specified values.                           | =IF(ISBLANK(A5), “A5 is blank”, “A5 is not blank”) | “A5 is blank”    |
| [IFS()](https://blog.sheetgo.com/google-sheets-formulas/ifs-formula-google-sheets/)                                                                                                                                                                                              | Evaluates multiple conditions, returning a value for the first TRUE condition. | =IFS(A1 > B1, “1st”, A2 > B2, “2nd”)               | “3rd”            |
| [SWITCH()](https://www.google.com/url?sa=i&url=https%3A%2F%2Fblog.sheetgo.com%2Fgoogle-sheets-formulas%2Fswitch-formula-google-sheets%2F&psig=AOvVaw3OLlZ9cZqSU6QwfFoVjWmG&ust=1718292173902000&source=images&cd=vfe&opi=89978449&ved=0CBQQjhxqFwoTCIjDgKav1oYDFQAAAAAdAAAAABAE) | Chooses a return value from a list based on a comparison with a given value.   | =SWITCH(MID(D3, 1, 5), “World”, “planet”)          | “galaxy”         |

#### Conditional Computation

Conditional computation functions in spreadsheets are crucial for analyzing data based on specific criteria. These functions allow users to count, sum, and calculate averages for cells that meet certain conditions, making data analysis more efficient and targeted.


| **Function**                                                                                      | **Description**                                                | 

#### Custom Function Creation

Custom function creation in spreadsheets, particularly in Excel, allows users to define their own reusable functions to simplify complex calculations, improve readability, and reduce errors. This is achieved through the use of the LAMBDA and LET functions, which enhance formula efficiency and capability.


| **Function** | **Description**                                                                                                                                | **Example**        | **Example Result**                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------- |
| LAMBDA()     | Allows the creation of custom, reusable functions without VBA. Users can define their own parameters and calculations within a single formula. | =LAMBDA(x, x^2)(5) | 25 (Squares the input value)        |
| LET()        | Assigns names to calculation results within a formula. This can reduce repetition of complex expressions and improve performance.              | =LET(x, 5, x^2)    | 25 (Assigns 5 to x, then squares x) |

#### Indirect Cell/Range Reference

Indirect cell/range reference functions in spreadsheets allow for dynamic referencing of cells and ranges. This can be particularly useful in scenarios where cell references need to change based on the contents of other cells or complex data manipulation tasks.


| Function                                                                                      | Description                                                                                      | Example           | Example Result                                          |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------- | ------------------------------------------------------- |
| [INDIRECT()](https://blog.sheetgo.com/google-sheets-formulas/indirect-formula-google-sheets/) | Returns the reference specified by a text string. This allows for referencing cells dynamically. | =INDIRECT(“A1”) | Value in cell A1                                        |
| [ADDRESS()](https://blog.sheetgo.com/google-sheets-formulas/address-formula-google-sheets/)   | Returns a cell address as a text, based on row and column numbers.                               | =ADDRESS(1, 1)    | “A1”                                                  |
| [OFFSET()](https://blog.sheetgo.com/google-sheets-formulas/offset-formula-google-sheets/)     | Returns a reference shifted a certain number of rows and columns from a starting cell reference. | =OFFSET(A1, 1, 1) | Value in B2 (one row down and one column right from A1) |

### Error handling functions

These error-handling functions are essential to create robust sheets, as they allow you to identify and manage errors effectively. You can use them to check for specific error types, replace errors with meaningful messages, or perform conditional operations based on error values.


| Function                                                                                    | Description                                                     | Example                                             | Example Result      |
| ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------- | ------------------- |
| [IFERROR()](https://blog.sheetgo.com/google-sheets-formulas/iferror-formula-google-sheets/) | Returns a specified value if the formula evaluates to an error. | `=IFERROR(A5 / A5, "Error detected")`               | “Error detected”  |
| [IFNA()](https://blog.sheetgo.com/google-sheets-formulas/ifna-in-google-sheets/)            | Returns a specified value if the formula evaluates to`#N/A`.    | `=IFNA(VLOOKUP(A1, B1:B10, 1, FALSE), "Not found")` | “Not found”       |
| ISERROR()                                                                                   | Checks if a value is an error.                                  | `=ISERROR(A1/B1)`                                   | TRUE                |
| ISERR()                                                                                     | Checks if a value is any error except`#N/A`.                    | `=ISERR(A1/B1)`                                     | TRUE                |
| ISNA()                                                                                      | Checks if a value is the`#N/A` error.                           | `=ISNA(VLOOKUP(A1, B1:B10, 1, FALSE))`              | TRUE                |
| ERROR.TYPE()                                                                                | Returns a number corresponding to the type of error.            | `=ERROR.TYPE(A1/B1)`                                | 2 (`#DIV/0!` error) |

### Financial Analysis

#### Finance

Finance functions in spreadsheets are pivotal for analyzing investments, loans, and other financial scenarios. They enable users to calculate payments, interest, future value, net present value, yield, price, internal rate of return, and the number of payment periods for various financial products.


| **Function**                                                                                            | **Description**                                                           | **Example**                                                                      | **Example Result**                                                |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [GOOGLEFINANCE()](https://blog.sheetgo.com/google-sheets-formulas/googlefinance-formula-google-sheets/) | Fetches current or historical securities information from Google Finance. | =GOOGLEFINANCE(“GOOG”, “price”, DATE(2021,1,1), DATE(2021,12,31), “DAILY”) | Historical daily closing prices for Google stock                  |
| PMT()                                                                                                   | Calculates the periodic payment for a loan or investment.                 | =PMT(rate, nper, pv)                                                             | Periodic payment amount                                           |
| IPMT()                                                                                                  | Calculates the interest payment for a specific period.                    | =IPMT(rate, per, nper, pv)                                                       | Interest payment for the period                                   |
| PPMT()                                                                                                  | Calculates the principal payment for a specific period.                   | =PPMT(rate, per, nper, pv)                                                       | Principal payment for the period                                  |
| FV()                                                                                                    | Calculates the future value of an investment or loan.                     | =FV(rate, nper, pmt)                                                             | Future value of the investment or loan                            |
| NPV()                                                                                                   | Calculates the net present value of an investment.                        | =NPV(rate, value1, value2,…)                                                    | Net present value of the cash flows                               |
| [YIELD()](https://blog.sheetgo.com/google-sheets-formulas/yield-formula-in-google-sheets/)              | Calculates the yield of a security that pays periodic interest.           | =YIELD(settlement, maturity, rate, pr, redemption)                               | Annual interest rate of the security                              |
| PRICE()                                                                                                 | Calculates the price per\$100 face value of a security.                   | =PRICE(settlement, maturity, rate, yld, redemption)                              | Price per\$100 face value of the security                         |
| IRR()                                                                                                   | Calculates the internal rate of return of a series of cash flows.         | =IRR(values)                                                                     | Internal rate of return for the cash flows                        |
| NPER()                                                                                                  | Calculates the number of periods for a loan or investment.                | =NPER(rate, pmt, pv)                                                             | Number of periods to pay off the loan or reach the financial goal |
