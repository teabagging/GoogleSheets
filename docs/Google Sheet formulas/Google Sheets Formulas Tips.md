# 18 Google Sheets Formulas Tip

Mastering Google Sheets formulas is more than just knowing the functions themselves and how to combine them. True mastery comes when you know all of the little, hidden shortcuts and tricks built in to Google Sheets to help you with your formulas.

Individually they may not seem like much, but combine them together in your toolkit and you'll be more efficient and effective when working with Google spreadsheet formulas. How many of these Google Sheets Formulas Tips & Techniques do you know?

## ## Contents

1. [F4 Key](#f4)
2. [F2 To Edit Cell](#f2)
3. [Shift + Enter To Edit Cell](#shiftEnter)
4. [Escape To Exit A Formula](#escape)
5. [Move To The Front Or End Of Your Google Sheets Formulas](#frontEnd)
6. [Function Helper Pane](#helperPane)
7. [Colored Ranges in Google Sheets Formulas](#colors)
8. [F2 To Highlight Specific Ranges In Your Google Sheets Formulas](#f2Range)
9. [Function Name Drop-Down](#dropdown)
10. [Tab To Auto-Complete](#autocomplete)
11. [Adjust The Formula Bar Width](#width)
12. [Quick Aggregation Toolbar](#quickAgg)
13. [Quick Fill Down](#quickFill)
14. [Know How To Create An ArrayFormula](#array)
15. [Array Literals With Curly Brackets](#curlyBracket)
16. [Multi-line Google Sheets Formulas](#multiLine)
17. [Comments In Google Spreadsheet Formulas](#comments)
18. [Use The Onion Approach](#onion)

## Tips For Google Sheets Formulas

### 1. F4 Key


Undoubtedly one of the most useful Google Sheets formula shortcuts to learn.

Press the **F4 key** to toggle between relative and absolute references in ranges in your Google Sheets formulas.

![F4 to switch between relative and absolute referencing](https://www.benlcollins.com/wp-content/uploads/2019/07/f4_referencing.gif)



It's WAY quicker than clicking and typing in the dollar ($) signs to change a reference into an absolute reference. [Back to top](#top)

### 2. F2 To Edit Cell

Have you ever found yourself needing to copy part of a Google Sheets formula to use elsewhere? This is a shortcut to bring up the formula in a cell. Start by selecting a cell containing a formula. Press the **F2 key** to enter into the formula:



![F2 shortcut key to enter Google Sheets Formula](https://www.benlcollins.com/wp-content/uploads/2019/06/f2_small.gif)

[Back to top](#top)

### 3. Shift + Enter To Edit Cell

**Shift + Enter** is another shortcut to enter into the Google Sheets formula edit view. [Back to top](#top)

### 4. Escape To Exit A Formula

Have you ever found yourself trying to click out of your formula, but Sheets thinks you want to highlight a new cell and it messes up your formula? Press the **Escape key** to exit the formula view and return to the result view. Any changes are discarded when you press the Escape key (to save changes you just hit the usual Return key). [Back to top](#top)

### 5. Move To The Front Or End Of Your Google Sheets Formulas

Here's another quick trick that's helpful for longer Google spreadsheets formulas: When you're inside the formula view, press the **Up arrow** to go to the front of your formula (in front of the equals sign). Similarly, pressing the **Down arrow** takes you to the last character in your formula.



![Up Down Arrow Keys in Google Sheets Formula](https://www.benlcollins.com/wp-content/uploads/2019/06/upDown_small.gif)

 [Back to top](#top)

### 6. Function Helper Pane


Learn to read the function helper pane!



![Google Sheets Formula Helper Pane](https://www.benlcollins.com/wp-content/uploads/2019/06/helperPane.png)


You can press the "X" to remove the whole pane if it's getting it the way. Or you can minimize/maximize with the arrow in the top right corner. The best feature of the formula pane is the yellow highlighting it adds to show you which section of your function you are in. E.g.

in the image above I'm looking at the "[headers]" argument. There is information about what data the function is expecting and even a link to the full Google documentation for that function.

 If you've hidden the function pane, or you can't see it, look for the blue question mark next to the equals sign of your formula. Click that and it will restore the function helper pane.

 [Back to top](#top)

### 7. Colored Ranges in Google Sheets Formulas


Helpfully Google Sheets highlights ranges in your formulas and in your actual Sheet with matching colors. It applies different colors to each unique range in your formula.

![Google Sheets Function highlighting](https://www.benlcollins.com/wp-content/uploads/2019/06/highlighting.png)

 [Back to top](#top)

### 8. F2 To Highlight Specific Ranges In Your Google Sheets Formulas

As mentioned in Step 2, you press the F2 key to enter the formula view of a cell with a formula in. However, it has another useful property. If you position your cursor over a range of data in your formula and then press the F2 key, it will highlight that range of data for you:

![F2 to highlight range in Google Sheets formula](https://www.benlcollins.com/wp-content/uploads/2019/07/f2_highlight_range.gif) [Back to top](#top)

### 9. Function Name Drop-Down

A great way to discover new functions is to simply type a single letter after an equals sign, and then browse what comes up:

 ![Google Sheets Function Drop-Down List](https://www.benlcollins.com/wp-content/uploads/2019/06/autoComplete.png)

Scroll up and down the list with the Up and Down arrows, and then click on the function you want. [Back to top](#top)

### 10. Tab To Auto-Complete Function Name

When you're using the function drop-down list in the tip above, press the tab key to auto-complete the function name (based on whatever function is highlighted). [Back to top](#top)

### 11. Adjust The Formula Bar Width



 ![Google Sheets Formula Bar Width](https://www.benlcollins.com/wp-content/uploads/2019/06/formulaBar.png)

An easy one this! Grab the base of the formula bar until you see the cursor change into a little double-ended arrow. Then click and drag down to make the formula bar as wide as you want. [Back to top](#top)

### 12. Quick Aggregation Toolbar


Highlight a range of data in your Sheet and check out the quick aggregation tool in the bottom toolbar of your Sheet (bottom right corner).

 ![Quick Aggregation Toolbar](https://www.benlcollins.com/wp-content/uploads/2019/06/aggregationToolbar.png)

Quickly find out the aggregate measures COUNT, COUNT NUMBERS, SUM, AVERAGE, MIN and MAX, without needing to create functions. [Back to top](#top)

### 13. Quick Fill Down


![Double click to copy formula](https://www.benlcollins.com/wp-content/uploads/2019/07/double-click.jpg)


To copy the formula quickly down the column, **double-click the blue mark** in the corner of the highlighted cell, shown by the red arrow. This will copy the cell contents and format down as far as the contiguous range in preceding column (column A in this case). An alternative way to quickly fill in a column is to highlight the range you want to fill, e.g.:


![Quickly enter data in Google Sheets](https://www.benlcollins.com/wp-content/uploads/2019/07/cmd_enter.jpg)


Then press **Ctrl + D** (PC and Chromebook) or **Cmd + D** (Mac) to copy the contents and format down the whole range,

like so:

 ![Quickly enter data in Google Sheets](https://www.benlcollins.com/wp-content/uploads/2019/07/cmd_enter_1.jpg)

You can also do this with **Ctrl + Enter** (PC and Chromebook) or **Cmd + Enter** (Mac), which will fill down the column. [Back to top](#top)

### 14. Know How To Create An ArrayFormula

[Array Formulas in Google Sheets](https://www.benlcollins.com/spreadsheets/array-formula-intro/) are powerful extensions to regular formulas, allowing you to work with ranges of data rather than individual pieces of data. Per the official definition, *array formulas enable the display of values returned into multiple rows and/or columns and the use of non-array functions with arrays*. In a nutshell: whereas a normal formula outputs a single value, array formulas output a range of cells! We need to tell Google Sheets we want a formula to be an Array Formula. We do this in two ways:


1. Hit **Ctrl + Shift + Enter** (PC/Chromebook) or **Cmd + Shift + Enter** (on a Mac) and Google Sheets will add the ArrayFormula wrapper
2. Alternatively, type in the word ArrayFormula and add brackets to wrap your formula [Back to top](#top)

### 15. Array Literals With Curly Brackets

Have you ever used the curly brackets, or [ARRAY LITERALS](https://support.google.com/docs/answer/6208276?hl=en) to use the correct nomenclature, in your formulas? An array is a table of data. They can be used in the same way that a range of rows and columns can be used in your formulas. You construct them with curly brackets:

```{ }```

Commas separate the data into columns on the same row. Semi-colons create a new row in your array. (Please note, if you're based in Europe, the syntax is a little different. [Find out more here](https://www.benlcollins.com/spreadsheets/sheets-location/).) This formula, entered into cell A1, will create a 2 by 2 array that puts data in the range A1 to B2:

```= { 1 , 2 ; 3 , 4 }```

The array component (in this example **`{ 1 , 2 ; 3 , 4 }`**) can be used as an input to other formulas. One nice application of array literals is to create [default values for cells in your Google Sheets](https://www.benlcollins.com/spreadsheets/default-values/). Read more about [arrays in Google Sheets (a.k.a. array literals)](https://www.benlcollins.com/spreadsheets/arrays-in-google-sheets/). [Back to top](#top)

### 16. Multi-line Google Sheets Formulas

Press **Ctrl + Enter** inside the formula editor bar to add new lines to your formulas, to make them more readable. Note, you'll probably want to widen the formula bar first, per tip 11.

![Multi-line formula in Google Sheets](https://www.benlcollins.com/wp-content/uploads/2019/06/multi_line_formula.png)

 [Back to top](#top)

### 17. Comments In Google Spreadsheet Formulas

Add comments to your formulas, using the [N function](https://support.google.com/docs/answer/3093357?hl=en). N returns the argument provided as a number. If the argument is text, inside quotation marks, the N function returns 0. So we can use it to add a comment like this: ```

```
=SUM(A1:A100) + N("Sums the first 100 rows of column A")``
```

which is effectively the same as:

```
=SUM(A1:A100) + 0
```

which is just:

```
=SUM(A1:A100)
```

This tip is pretty esoteric, but it's helpful for any [really long Google spreadsheet formulas](https://www.benlcollins.com/spreadsheets/google-sheets-formula-clock/)!

 [Back to top](#top)

### 18. Use The Onion Approach For Complex Formulas

Complex formulas are like onions on two counts: i) they have layers that you can peel back, and ii) they often make you cry 😭

[Use The Onion Method To Approach Complex Formulas](https://www.benlcollins.com/?p=10559&preview=true)

If you're building complex formulas, then I advocate a one-action-per-step approach. What I mean by this is build your formula in a series of steps, and only make one change with each step. So if you start with function A(range) in a cell, then copy it to a new cell before you nest it with B(A(range)), etc. This lets you progress in a step-by-step manner and see exactly where your formula breaks down. Similarly, if you're trying to understand complex formulas, peel the layers back until you reach the core (which is hopefully a position you understand). Then, build it back up in steps to get back to the full formula. For more detail about this approach, including examples and worksheets for each case, have a read of this post:

[Use The Onion Method To Approach Complex Formulas](https://www.benlcollins.com/?p=10559&preview=true)

*This is an updated version of an article that was previously published. We update our tutorials to ensure they're useful for our readers.*

[Back to top](#top)
