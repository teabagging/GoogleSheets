# QUERY function

Runs a Google Visualization API Query Language query across data.

### Sample Usage

`QUERY(A2:E6,"select avg(A) pivot B")`

`QUERY(A2:E6,F2,FALSE)`

### Syntax

`QUERY(data, query, [headers])`

* `data` - The range of cells to perform the query on.
  * Each column of `data` can only hold boolean, numeric (including date/time types) or string values.
  * In case of mixed data types in a single column, the majority data type determines the data type of the column for query purposes. Minority data types are considered null values.
* `query` - The query to perform, written in [the Google Visualization API Query Language](https://developers.google.com/chart/interactive/docs/querylanguage).
  * The value for `query` must either be enclosed in quotation marks or be a reference to a cell containing the appropriate text.
  * See [https://developers.google.com/chart/interactive/docs/querylanguage](https://developers.google.com/chart/interactive/docs/querylanguage) for further details on the query language.
* `headers` - **[** OPTIONAL **]** - The number of header rows at the top of `data`. If omitted or set to `-1`, the value is guessed based on the content of `data`.

## Examples

[Make a copy](https://docs.google.com/spreadsheets/d/1815H5TCe91LLT6tD6FmxMHmeJAAkr4o5Q6rNpV6xiFk/copy)

**Note**: Each example is in its own tab.### Sample data

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFhWVHZLUUtWak1RRjdRWE9hZ0RzZHc&single=true&gid=0&output=html&widget=true"></iframe>

### Select & where

Returns rows that match the specified condition using `Select` and `Where` clauses.

* QUERY can accept either "Col" notation or "A, B" notation.

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFhWVHZLUUtWak1RRjdRWE9hZ0RzZHc&single=true&gid=1&output=html&widget=true"></iframe>

### Group by

Aggregates `Salary` values across rows using `Select` and `Group by` clauses.

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFhWVHZLUUtWak1RRjdRWE9hZ0RzZHc&single=true&gid=2&output=html&widget=true"></iframe>

### Pivot

Transforms distinct values in columns into new columns.

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFhWVHZLUUtWak1RRjdRWE9hZ0RzZHc&single=true&gid=3&output=html&widget=true"></iframe>

### Order by

Aggregates `Dept` values across rows and sorts by the maximum value of `Salary`.

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFhWVHZLUUtWak1RRjdRWE9hZ0RzZHc&single=true&gid=4&output=html&widget=true"></iframe>

### Headers

Specifies the number of header rows in the input range, which enables transformation of multi-header rows range input to be transformed to a single row header input.

<iframe height="300" width="500" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdFhWVHZLUUtWak1RRjdRWE9hZ0RzZHc&single=true&gid=5&output=html&widget=true"></iframe>
