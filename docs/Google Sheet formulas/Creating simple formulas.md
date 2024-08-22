### Creating simple formulas

A convenient and time-saving feature of Google Sheets is its ability to add, subtract, multiply, and divide numerical information for you. Google Sheets uses mathematical expressions called **formulas** that make handling these calculations easy. In this lesson, we'll focus on formulas that contain **one mathematical operator**.

Most of the time, you will be using a **cell's address** in the formula. This is called using a **cell reference**. The advantage of using cell references is that you can change a value in a referenced cell and the formula will automatically recalculate. Using cell references in your formulas will make sure the values in your formulas are accurate.

Watch the video below to learn how to work with simple formulas in Google Sheets.

<iframe src="https://www.youtube.com/embed/llkP9DxRAPI?rel=0&showinfo=0" allowfullscreen="" frameborder="0"></iframe>

#### Mathematical operators

Google Sheets uses standard operators for formulas: a **plus sign** for addition (**+**), **minus sign** for subtraction (**-**), **asterisk** for multiplication (**\***), **forward slash** for division (**/**), and **caret** (**^**) for exponents.

![Standard operators](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/simpform_graphic_operators4.png)

All formulas must begin with an **equals sign** (**=**). This is because the cell contains—or is equal to—the formula and the value it calculates.

#### Using cell references

When a formula contains a cell address, it is using a **cell reference**. Creating a formula with cell references is useful because you can update the numerical values in cells without having to rewrite the formula.

![Using cell references to recalculate a formula](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_cells_collage.jpg)

By combining a mathematical operator with cell references, you can create a variety of simple formulas in Google Sheets. Formulas can also include a combination of a cell reference and a number.

![Examples of simple formulas](https://media.gcflearnfree.org/ctassets/topics/198/simpform_graphic_formulas5.png)

### Creating formulas

In our example, we'll use simple formulas and cell references to help calculate a budget.

#### To create a formula:

1. Select the **cell** that will display the calculated value.
   ![Selecting cell](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_budget.png)
2. Type the **equals sign (=)**.
3. Type the **cell** **address** of the cell you want to reference first in the formula. A dotted border will appear around the cell being referenced.
   ![Typing a cell address](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_formula_address.png)
4. Type the **operator** you want to use. For example, type the **addition sign **(**+**).
5. Type the **cell address** of the cell you want to reference second in the formula.
   ![Completing the formula](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_formula_operator.png)
6. Press the **Enter** key on your keyboard. The formula calculates, and Google Sheets displays the result.
   ![The result](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_formula_answer2.png)

To see how the formula recalculates, try changing the value in either cell. The formula automatically displays the new value.

![The recalculated value](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_formula_recalculate2.png)

Google Sheets **will not always tell you** if your formula contains an error, so it's up to you to check all of your formulas. To learn how to do this, read our article on why you should [Double-Check Your Formulas](http://www.gcflearnfree.org/excelformulas/doublecheck-your-formulas/1/ "Double-Check Your Formulas").

#### To create a formula using the point-and-click method:

Rather than type cell addresses, you can **point and click** the cells you want to include in your formula.

1. Select the **cell** that will display the calculated value.![Selecting the cell](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_select_cell.png)
2. Type the **equals sign** (**=**).
3. Click the **cell** you want to reference first in the formula. The address of the cell appears in the formula.
   ![Entering the first cell reference](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_cell_formula.png)
4. Type the **operator** you want to use in the formula. For example, type the **multiplication sign **(**\***).
5. Click the **cell** you want to reference second in the formula. The address of the cell appears in the formula.![Completing the cell reference](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_cell_multiply.png)
6. Press the **Enter** key on your keyboard. The formula will be calculated, and the value will appear in the cell.
   ![The calculated value](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_cell_value.png)

#### To edit a formula:

Sometimes you may want to modify an existing formula. In our example, we typed an incorrect cell address in our formula, so we need to correct it.

1. Double-click the **cell** containing the formula you want to edit. The formula will be displayed in the cell.![Viewing the formula](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_incorrect_cell.png)
2. Make the desired edits to the formula. In our example, we will replace **C4** with **C5**.![Editing the formula](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_correct_cell.png)
3. When you're finished, press the **Enter** key on your keyboard. The formula recalculates, and the new value displays in the cell.![Viewing the recalculated result](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_result_cell.png)

### Challenge!

1. Open our [example file](https://docs.google.com/spreadsheets/d/1CgVTIhvBNdVQnNdAq0YmQij0z5qSSPORd98WNMSxYXs/edit#gid=1518128607). Make sure you're signed in to Google, then click **File** > **Make a copy**.
2. Select the **Challenge** sheet.
3. In cell **D4**, create a formula that **multiplies** cells B4 and C4. Be sure to use cell references.
4. Use the **fill handle** to copy the formula to cells D5 and D6.
5. In cell **D7**, create a formula that **adds** cells D4, D5, and D6.
6. Change the quantity in cell **B4** to 15. You should also see cells D4 and D7 change.
7. When you're finished, your spreadsheet should look something like this:
   ![simple formulas challenge](https://media.gcflearnfree.org/content/55e073e57dd48174331f51b8_01_17_2014/google_sheets_simple_formulas_edited.png)

#### Lesson 13: Creating Complex Formulas

### Introduction

You may have experience working with formulas that contain only one operator, such as **7+9**. More complex formulas can contain **several mathematical operators**, such as **5+2\*8**. When there's more than one operation in a formula, the **order of operations** tells Google Sheets which operation to calculate first. To write formulas that will give you the correct answer, you'll need to understand the order of operations.

Watch the video below to learn how to create complex formulas.

<iframe src="https://www.youtube.com/embed/iJE0S4Wkk_o?rel=0&showinfo=0" allowfullscreen="" frameborder="0"></iframe>

#### Order of operations

Google Sheets calculates formulas based on the following **order of operations**:

1. Operations enclosed in **parentheses**
2. **E****xponential** calculations (3^2, for example)
3. **M****ultiplication** and **division**, whichever comes first
4. **A****ddition** and **subtraction**, whichever comes first

A mnemonic that can help you remember the order is **P**lease **E**xcuse **M**y **D**ear **A**unt **S**ally.

Click the arrows in the slideshow below to learn how the order of operations is used to calculate formulas in Google Sheets.

**arrow\_back\_ios*** ![PEMDAS, 10+(6-3)/2^2*4-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order1.png)While this formula may look complicated, we can use the order of operations step by step to find the right answer.

* ![P parentheses: 10+(6-3)/2^2*4-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order2.png)First, we'll start by calculating anything inside parentheses. In this case, there's only one thing we need to calculate: 6-3=3.
* ![E exponents: 10+3/2^2*4-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order3.png)As you can see, the formula already looks simpler. Next, we'll look to see if there are any exponents. There is one: 2^2=4.
* ![MD multiplication division, whichever comes first: 10+3/4*4-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order4.png)Next, we'll solve any multiplication and division, working from left to right. Because the division operation comes before the multiplication, it's calculated first: 3/4=0.75.
* ![MD multiplication division, whichever comes first: 10+0.75*4-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order5.png)Now, we'll solve our remaining multiplication operation: 0.75\*4=3.
* ![AS addition subtraction, whichever comes first: 10+3-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order6.png)Next, we'll calculate any addition or subtraction, again working from left to right. Addition comes first: 10+3=13.
* ![AS addition subtraction, whichever comes first: 13-1](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order7.png)Finally, we have one remaining subtraction operation: 13-1=12.
* ![answer: 13-1=12](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order8.png)Now we have our answer: 12. And this is the exact same result you would get if you entered the formula into Excel.
* ![GCFLearnFree.org](https://media.gcflearnfree.org/content/5633ce29927faf14d04cade9_10_30_2015/complex_order9.png)
  arrow\_back\_ios

#### Creating complex formulas

In the example below, we'll demonstrate how Google Sheets solves a complex formula using the order of operations. The complex formula in cell **D6** calculates the sales tax by adding the prices together and multiplying by the 5.5% tax rate (which is written as 0.055).

![Entering a complex formula](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/google_sheets_order_operations.png)

Google Sheets follows the order of operations and first adds the values inside the parentheses: **(D3+D4+D5) = \$274.10**. Then it multiplies by the tax rate: **\$274.10\*0.055**. The result will show that the tax is **\$15.08**.

![The result in D6](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/google_sheets_parentheses.png)

It's especially important to follow the order of operations when creating a formula. Otherwise, Google Sheets won't calculate the results accurately. In our example, if the** parentheses** are not included, the multiplication is calculated first and the result is incorrect. Parentheses are often the best way to define which calculations will be performed first in Google Sheets.

![Result of an incorrect formula](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/complex_formula_incorrect_order.png)

#### To create a complex formula using the order of operations:

In the example below, we'll use **cell references** along with **numerical values** to create a complex formula that will calculate the **subtotal** for a catering invoice. The formula will calculate the cost of each menu item first, then add these values.

1. Select the **cell** that will contain the formula. In our example, we'll select cell **C****5**.
   ![Selecting a cell](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/select.png)
2. Enter your **formula**. In our example, we'll type **=B3\*C3+B4\*C4**. This formula will follow the order of operations, first performing the multiplication: **2.79\*****35** **= 97.65** and **2.29\*20 = 45.80**. It then will add these values to calculate the total: **97.65+45.80**.
   ![Entering the formula](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/formula.png)
3. Double-check your formula for accuracy, then press **Enter** on your keyboard. The formula will calculate and display the **result**. In our example, the result shows that the subtotal for the order is **\$143.45**.
   ![The displayed result](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/result.png)

Google Sheets **will not always tell you** if your formula contains an error, so it's up to you to check all of your formulas. To learn how to do this, read our article on why you should [Double-Check Your Formulas](http://www.gcflearnfree.org/excelformulas/doublecheck-your-formulas/1/ "Double-Check Your Formulas").

### Challenge!

1. Open our [example file](https://docs.google.com/spreadsheets/d/1302SuCoRhZVeKMuEeH9b53Iu8VxlwXP_hokSuuS66yE/edit#gid=2111628341). Make sure you're signed in to Google, then click **File** > **Make a copy**.
2. Select the **Challenge** sheet. Let's say we want to compare two discounts. The first discount takes 20% off the total, and the second discount takes \$30 off the total.
3. In cell **D6**, create a **formula** that calculates the total using the 20% off discount.
   **Hint:** Because we're taking 20% off, 80% of the total will remain. To calculate this, multiply 0.80 by the sum of the line totals.
4. In cell **D7**, create a **formula** that subtracts 30 from the total.
5. When you're finished, your spreadsheet should look like this:
   ![complex formulas challenge example](https://media.gcflearnfree.org/content/55e073e67dd48174331f51b9_01_17_2014/google_sheets_complex_formulas_final_edit2.png)

[![Continue next lesson arrow](https://media.gcflearnfree.org/assets/edu-gcfglobal-site/images/outline-arrow_downward.svg)
