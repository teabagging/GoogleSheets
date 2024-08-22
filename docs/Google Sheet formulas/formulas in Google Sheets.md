# formulas in Google Sheets

## The essence of Google Sheets formulas

First things first – to build a formula, you need logical expressions and functions.

A function is a mathematical expression; each with its own name.

For Google Sheets to know you're about to enter a formula rather than a number or text, start entering an equal sign (=) to a cell of interest. Then, type the function name and the rest of the formula.

**Tip.** You can check a complete list of all functions available in Google Sheets [here](https://support.google.com/docs/table/25273).

Your formula may contain:

* cell references
* named data ranges
* numeric and textual constants
* operators
* other functions

## Types of cell references

Each function requires data to work with, and cell references are used to indicate that data.

To reference a cell, alphanumeric code is used – letters for columns and numbers for rows. For example, *A1* is the first cell in column *A*.

There are 3 types of Google Sheets cell references:

* Relative: A1
* Absolute: \$A\$1
* Mixed (half relative and half absolute): \$A1 or A\$1

The dollar sign (\$) is what changes the reference type.

Once moved, relative cell references change according to the destination cell. For example, B1 contains *=A1*. Copy it to C2 and it will turn to *=B2*. Since it was copied 1 column to the right and 1 row below, all coordinates have increased in 1.

If formulas have absolute references, they won't change once copied. They always indicate one and the same cell, even if new rows and columns are added to the table or the cell itself is shifted someplace else.


| Original formula in B1 | =A1 | =A\$1 | =\$A1 | =\$A\$1 |
| ---------------------- | --- | ----- | ----- | ------- |
| Formula copied to C2   | =B2 | =B\$1 | =\$A2 | =\$A\$1 |

Thus, to prevent references from changing if copied or moved, use absolute ones.

To switch between relatives and absolutes quickly, just highlight any cell reference and press **F4** on your keyboard.

At first, your relative reference – *A1* – will change into absolute – *\$A\$1*. Press **F4** once again, and you'll get a mixed reference – *A\$1*. On the next button hit, you'll see *\$A1*. Another one will return everything to its original state – *A1*. And so on.

**Tip.** To change all references at once, highlight the entire formula and press **F4**

### Data ranges

Google Sheets uses not only single cell references but also groups of adjacent cells – ranges. They are limited by the upper left and bottom right cells. For instance, *A1:B5* signals to use all cells highlighted in orange below:
![Data ranges in Google Sheets.](https://cdn.ablebits.com/_img-blog/google-sheets-formula-basics/use-data-range.png "Data ranges in Google Sheets.")

## Constants in Google Sheets formulas

Constant values in Google Sheets are the ones that cannot be calculated and always remain the same. Most often, they are numbers and text, for example *250* (number), *03/08/2019* (date), *Profit* (text). These are all constants and we can alter them using various operators and functions.

For example, the formula may contain only constant values and operators:

`=30+5*3`

Or it can be used to calculate new value based on another cell's data:

`=A2+500`

Sometimes, though, you have to change the constants manually. And the easiest way to do that is to place each value into a separate cell and reference them in formulas. Then, all you need to do is make changes in a single cell rather than in all formulas.

So, if you put *500* to B2, refer to it with the formula:

`=A2+B2`

To get *700* instead, simply change the number in B2 and the result will be recalculated.

## Operators for Google Sheets formulas

Different operators are used in spreadsheets to preset the type and the order of calculations. They fall into 4 groups:

* arithmetic operators
* comparison operators
* concatenation operators
* reference operators

### Arithmetic operators

As the name suggests, these are used to perform math calculations such as adding, subtracting, multiplication, and division. As a result, we get numbers.


| Arithmetic operator | Operation                            | Example           |
| ------------------- | ------------------------------------ | ----------------- |
| + (plus sign)       | Addition                             | =5+5              |
| - (minus sign)      | Subtraction<br/><br/>Negative number | =5-5<br/><br/>=-5 |
| \* (asterisk)       | Multiplication                       | =5\*5             |
| / (slash)           | Division                             | =5/5              |
| % (percent sign)    | Percents                             | 50%               |
| ^ (caret sign)      | Exponents                            | =5^2              |

### Comparison operators

Comparison operators are used to compare two values and return a logical expression: TRUE or FALSE.



### Text concatenation operators

Ampersand (&) is used to connect (concatenate) multiple text strings into one. Enter the below into one of Google Sheets cells and it will return *Aircraft*:

`="Air"&"craft"`

Or, put *Surname* to A1 and *Name* to B1 and get the *Surname, Name* text with the following:

`=A1&", "&B1`

### Formula operators

These operators are used to build Google Sheets formulas and indicate data ranges:





## Order of calculations and operators precedence

Each formula in Google Sheets handles its values in some particular order: from left to right based on operator precedence. Operators of the same priority, e.g. multiplication and division, are calculated in the order of their appearance (left to right).


### How to use brackets to change the order of calculations

To change the order of calculations within the formula, enclose the part that should come first into brackets. Let's see how it works.

Suppose we have a standard formula:

`=5+4*3`

Since multiplication takes the lead and addition follows, the formula will return *17*.

If we add brackets, the game changes:

`=(5+4)*3`

The formula adds numbers first, then multiplies them by 3, and returns *27*.

The brackets from the next example dictate the following:

`=(A2+25)/SUM(D2:D4)`

* calculate value for A2 and add it to 25
* find the sum of values from D2, D3, and D4
* divide the first number to the sum of values

I hope it won't be difficult for you to get around these since we learn the order of calculations from a very young age and all arithmetics around us are performed this way. :)

## Named ranges in Google Sheets

Did you know you can label separate cells and entire data ranges? This makes processing large datasets quick and easy. Besides, you will guide yourself within Google Sheets formulas much faster.

Suppose you have a column where you calculate total sales per product and customer. Name such a range *Total\_Sales* and use it in formulas.

I believe you would agree that the formula

`=SUM(Total_Sales)`

is far clearer and easier-to-read than

`=SUM($E$2:$E$13)`
![Named range vs. range reference.](https://cdn.ablebits.com/_img-blog/google-sheets-formula-basics/range-reference.png "Named range vs. range reference.")

**Note.** You can't create named ranges from non-adjacent cells.

To identify your range, do the following:

1. Highlight your adjacent cells.
2. Go to *Data > Named ranges* in the sheet menu. A corresponding pane will appear on the right.
3. Set the name for the range and click **Done**.

![How to name a range in Google Sheets.](https://cdn.ablebits.com/_img-blog/google-sheets-formula-basics/name-range.png "How to name a range in Google Sheets.")

**Tip.** This also lets you check, edit, and delete all ranges you've created:

![Manage named ranges.](https://cdn.ablebits.com/_img-blog/google-sheets-formula-basics/see-all-named-ranges.png "Manage named ranges.")

### Picking correct name for the data range

Named ranges make your Google Sheets formulas friendlier, clearer, and understandable. But there's a small set of rules you should follow when it comes to labeling ranges. The name:

* Can contain only letters, numbers, underscores (\_).
* Should not start from a number or from "true" or "false" words.
* Should not contain spaces ( ) or other punctuation marks.
* Should be 1-250 characters long.
* Should not tally with the range itself. If you try to name the range as *A1:B2*, the errors may occur.

If something goes wrong, e.g. you use space in the name *Total Sales*, you'll get an error right away. The correct name would be *TotalSales* or *Total\_Sales*.

**Note.** Google Sheets named ranges are similar to absolute cell references. If you add rows and columns to the table, the *Total\_Sales* range won't change. Move the range to any place of the sheet – and this won't alter the results.

## Types of Google Sheets formulas

Formulas can be simple and complex.

Simple formulas contain constants, references to cells on the same sheet, and operators. As a rule, it's either one function or an operator, and the order of calculations is very simple and straightforward – from left to right:

`=SUM(A1:A10)`

`=A1+B1`

As soon as additional functions and operators appear, or the order of calculations becomes a bit more complicated, the formula becomes complex.

Complex formulas may include cell references, multiple functions, constants, operators, and named ranges. Their length can be overwhelming. Only their author can "decipher" them quickly (but usually only if it was built not more than a week ago).

### How to read complex formulas with ease

There is a trick to make your formulas look comprehensible.

You can use as many spaces and line breaks as you need. This won't mess with the result and will arrange everything in the most convenient way.

To put a break line in the formula, press **Alt+Enter** on your keyboard. To see the entire formula, expand the *Formula bar*:
![Build easy-to-read complex formulas.](https://cdn.ablebits.com/_img-blog/google-sheets-formula-basics/expand-formula-bar.png "Build easy-to-read complex formulas.")

Without these extra spaces and break lines, the formula would look like this:

`=ArrayFormula(MAX(IF(($B$2:$B$13=B18)*($C$2:$C$13=C18), $E$2:$E$13,"")))`

Can you agree the first way is better?

[Next time](https://www.ablebits.com/office-addins-blog/create-edit-google-sheets-functions/) I'll dig deeper into building and editing Google Sheets formulas, and we'll practice a bit more. If you have any questions, please leave them in the comments below.
