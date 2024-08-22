# Google Sheets Formulas


## Formulas

A formula in Google Sheets is used to do mathematical calculations. Formulas always start with the equal sign (`=`) typed in the cell, followed by your calculation.

Formulas can be used for calculations such as:

* `=1+1`
* `=2*2`
* `=4/2=2`

formulas can take cells as input.

Let's have a look at an example.

Type or copy the following values:

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_1.png)



Now we want to do a calculation with those values.

Step by step:

1. Select `C1` and type (`=`)
2. Select `A1`
3. Type (`+`)
4. Select `A2`
5. Press enter

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_2.png)

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_3.png)

**You got it!** You have successfully calculated `A1(2) + A2(4) = C1(6)`.

**Note:** Using cells to make calculations is an important part of Google Sheets and you will use this a lot as you learn.

Lets change from addition to multiplication, by replacing the (`+`) with a (`*`). It should now be `=A1*A2`, press enter to see what happens.

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_4.png)

You got `C1(8)`, right? **Well done!**

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_5.png)

Google Sheets is great in this way. It allows you to add values to cells and do calculations on them.

Now, try to change the multiplication (`*`) to subtraction (`-`) and dividing (`/`).

Delete all values in the sheet after you have tried the different combinations.

Let's add new data for the next example, where we will help the Pokemon trainers to count their Pokeballs.

Type or copy the following values:

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_6.png)



The data explained:

* Column `A`: Pokemon Trainers
* Row `1`: Types of Pokeballs
* Range `B2:D4`: Amount of Pokeballs, Great balls and Ultra balls

**Note:** It is important to practice reading data to understand its context. In this example you should focus on the trainers and their Pokeballs, which have three different types: Pokeball, Great ball and Ultra ball.

Let's help Iva to count her Pokeballs. You find Iva in `A2(Iva)`. The values in `row 2 B2(2), C2(3), D2(1)` belong to her.

Count the Pokeballs, step by step:

1. Select cell `E2` and type (`=`)
2. Select `B2`
3. Type (`+`)
4. Select `C2`
5. Type (`+`)
6. Select `D2`
7. Hit enter

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_7.png)

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_8.png)

Did you get the value `E2(6)`? **Good job!** You have helped Iva to count her Pokeballs.

Now, let's help Liam and Adora with counting theirs.

Do you remember the [fill function](https://www.w3schools.com/googlesheets/google_sheets_filling.php) that we learned about earlier? It can be used to continue calculations sidewards, downwards and upwards. Let's try it!

Lets use the fill function to continue the formula, step by step:

1. Select `E2`
2. Fill `E2:E4`

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_9.png)

**That is cool, right?** The fill function continued the calculation that you used for Iva and was able to understand that you wanted to count the cells in the next rows as well.

Now we have counted the Pokeballs for all the trainers; Iva(`6`), Liam(`12`) and Adora(`15`).

Let's see how many Pokeballs Iva, Liam and Adora have in total.

The total is called **SUM** in Google Sheets.

There are two ways to calculate the **SUM**.

* Adding cells
* SUM function

Google Sheets has many pre-made functions available for you to use. The **SUM** function is one of the most used ones. You will learn more about functions in a later chapter.

Let's try both approaches.

**Note:** You can navigate to the cells with your keyboard arrows instead of right clicking them. Try it!

Sum by adding cells, step by step:

1. Select cell E5, and type `=`
2. Select `E2`
3. Type (`+`)
4. Select `E3`
5. Type (`+`)
6. Select `E4`
7. Hit enter

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_10.png)

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_11.png)

The result is `E5(33)`.

Let's try the **SUM** function.

Remember to delete the values that you currently have in `E5`.

**SUM** function, step by step:

1. Type `E5(=)`
2. Write **SUM**
3. Double click **SUM** in the menu
4. Mark the range `E2:E4`
5. Hit enter

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_12.png)

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_13.png)

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_14.png)

**Great job!** You have successfully calculated the **SUM** using the **SUM** function.

Iva, Liam and Adora have `33` Pokeballs in total.

Let's change a value to see what happens. Type `B2(7)`:

![](https://www.w3schools.com/googlesheets/img_google_sheets_formulas_15.png)

The value in cell `B2` was changed from `2` to `7`. Notice that the formulas are doing calculations when we change the value in the cells, and the **SUM** is updated from `33` to `38`. It allows us to change values that are used by the formulas, and the calculations remain.

---

## Chapter Summary

Values used in formulas can be typed directly and by using cells. The formula updates the result if you change the value of cells, which is used in the formula. The fill function can be used to continue your formulas upwards, downwards and sidewards. Google Sheets has pre-built functions, such as **SUM**.

In the next chapter you will learn about relative and absolute references
