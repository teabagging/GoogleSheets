# Create & use named functions

Named functions let you create custom functions that can use built-in Sheets formulas. We've added the ability to import named functions so you can use them in more than one sheet.

<iframe href="//www.youtube.com/watch?v=iQ0dwMPe6Is" data-videoid="iQ0dwMPe6Is" class="embedded-video-large" frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" title="Named functions tutorial" width="400" height="230" src="https://www.youtube.com/embed/iQ0dwMPe6Is?autoplay=0&cc_lang_pref=en&cc_load_policy=1&controls=2&rel=0&hl=en&enablejsapi=1&origin=https%3A%2F%2Fsupport.google.com&widgetid=1" id="widget2"></iframe>

To get an example spreadsheet and follow along with the video, click "Make a copy" below.

[Make a copy](https://docs.google.com/spreadsheets/d/1DX-dim522sIEwFax42nKYUTARaJxQPgVzXgBAaGPs9s/copy)

## Open named functions

1. In a new or existing spreadsheet, click **Data** ![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Named functions**.

For a cell with a formula:

1. Right-click the cell with a formula.
2. Click **View more cell actions **![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Define named function**.

## Create a named function

![](https://storage.googleapis.com/support-kms-prod/tUv3kiArVBS8G0XkoNhkpI9LbXyjCeaWV4p6)

When you create a named function, use text as placeholders for inputs.

For example, the `<a href="https://support.google.com/docs/answer/3093364" rel="noopener">IF function</a>`, takes in a maximum of 3 arguments:

`IF(logical_expression, value_if_true, value_if_false)`

If you insert the text “`logical_expression`”, “`value_if_true`” or “`value_if_false`" as arguments into a cell, you get an error. These arguments are placeholders and descriptions of the type of inputs the function expects. If you want to take in various inputs to your function, when you write a named function, you must define argument placeholders.

Before, you could only create custom functions with App Script, which requires you to write Javascript. With named functions, you can create custom functions with an intuitive interface without writing any code.

The 4 primary components in a named function include:

* **Function name**
  * The name of the function you use to insert the function into a cell. This is capitalized.
  * Requirements:
    * Can’t be named the same as a built-in Sheets function like `SUM`.
    * Can’t be named `TRUE` or `FALSE`.
    * Can’t be in either "A1" or "R1C1" syntax.
      * For example, if you give your function a name like "A1” or “AA11," you get an error.
    * Can’t start with a number.
    * Must be shorter than 255 characters.
    * Must have no spaces.
    * Must have no special characters except for underscores.
* **Function description**
  * The description of the function that appears in the "About" section of the function help box.
* **Argument placeholders [OPTIONAL]**
  * Placeholders are descriptions of the type of inputs the function expects. For example, argument names “`CELL`'' or “`RANGE`” are for when the input you expect is a single cell, or a range of cells, respectively.
  * Requirements:
    * Can’t be the same name as another argument placeholder in the named function.
    * Can’t be in either "A1" or "R1C1" syntax.
      * For example, if you give your placeholder a name like "A1” or “AA11," you get an error.
    * Must have no spaces.
    * Must have no special characters except for underscores.
* **Formula definition**
  * It’s the written formula that you insert into a cell. When you include defined arguments, the function expects inputs for each argument when inserting the function into a cell.
  * Requirements:
    * Must be a parseable formula.
    * Must have no missing parentheses.
    * Must have no misplaced commas.

### Other details

After you set up the primary components above, you can add more details on the second page. For every argument placeholder you define, these fields are available:

* **Argument description**
  * This is a short description of what the function expects for this argument. For example, “A single value you’re searching for.”
* **Argument example**
  * This is an example input for this argument. For example, an argument that should be a range of cells: “B3:B14.”

These extra details, along with the primary components, are used to fill the function help box when adding the named function to a cell:

![Sample of Named function arguments.](https://storage.googleapis.com/support-kms-prod/iAd8gmW4uYFirFhwpN6ki9QQVDCJRgJhCAz6)

## Import named functions

As you create more named functions or start to find useful ones that others created, you want to be able to use them in different sheets. To reuse created named functions, you can import them from another sheet into your current one:

1. On your computer, open [Google Sheets](https://sheets.google.com/)**.**
2. Open the sheet that you want to import the named functions to.
3. At the top, click **Data** ![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Named functions **![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Import function**.
4. Select the sheet that you want to import from.
5. Select the named functions that you want to import.
   * If you want to import all the named functions from the file, click **Import all**.
6. Click **Import**.

**Tips:**

* **If the named function that you selected to import has the same name as a named function that already exists in your active file:** The imported one overrides the existing named function.
* **If the named function that you selected to import depends on another named function, like formula definition:** Sheets will warn you about that dependency and highlight the dependent functions.
* **If the named function that you selected to import uses a formula that interacts with an external source, like** `<a href="https://support.google.com/docs/answer/3093333" rel="noopener"><strong>IMAGE</strong></a>`**:** Sheets warns you about that interaction.

## Examples

### Named function with 2 argument placeholders

* **Function name:** `CONTAINS`
* **Description:** Checks whether the value appears in a range. Returns `TRUE` if the value appears and `FALSE` if it doesn’t.
* **Argument placeholders:** `search_query`, `search_range`
* **Definition: **`=NOT(ISERROR(MATCH(search_query,search_range,0)))`
* **More details:**
  * **Argument description:** `search_query`
    * The value you're searching for
  * **Argument example:** `search_query`
    * B3
  * **Argument description:** `search_range`
    * The range you're looking for the value in
  * **Argument example:** `search_range`
    * B3:B14

### Named function with no argument placeholders

* **Function name:** `NAMED_FUNCTIONS_SLOGAN`
* **Description:** Outputs a nice sentence that describes named functions.
* **Definition:** `="Named functions help make my formulas easier to use and read."`

### Named function using recursion

* **Function name:** `REVERSE_WORDS`
* **Description:** Reverses the word order in a string
* **Placeholders:** `str`
* **Definition:**`=IF(ISERROR(FIND(" ", str)), str, REVERSE_WORDS(RIGHT(str, LEN(str)-FIND(" ", str)))&" "&LEFT(str, FIND(" ",str)-1))`
* **More details:**
  * **Argument description:** `str`
    * String you need reversed
  * **Argument example:** `str`
    * "reversed need you String"

### Named function using LAMBDA

* **Function name:** `COUNT_FORMULAS`
* **Description:** Calculates the number of formulas for a given range.
* **Placeholders:** `range`
* **Definition: **`=COUNTIF(MAP(range,LAMBDA(cell, ISFORMULA(cell))),"TRUE")`
* **More details:**
  * **Argument description:** `range`
    * The range you're looking for formulas in
  * **Argument example:** `search_range`
    * A2:D7

## FAQs

[Can I create a relative range in my named function?]

No. All ranges included in formula definitions are absolute. If not included in the definition in that format, it’s converted to absolute ranges. For example, “A1:B3” will be modified when saved to Sheet “1!\$A\$1:\$B\$3.” You can pass relative ranges as arguments to the named function.

[Can I use built-in function names as argument placeholder names like SUM?]

Yes. You can name argument placeholders the same as built-in functions. For example, you may name an argument placeholder “SUM.” However, if used together, the argument placeholder takes precedence over the built-in function.

[Can I import defined names without parameters into Sheets?]

Yes. Defined names without parameters can be imported into Sheets, but should be called without parentheses.

[Can I edit an imported defined named function without parameters in Sheets?]

Yes. Sheets update the defined name to follow the Sheets named function syntax. You must add parentheses to all cell references.

[Can I create a named function with the same name as a custom apps script function?]

No. You can’t create a named function with the same name as a custom apps script function that exists in the Sheet. You can add a custom function to a Sheet with the same name as an existing named function. However, the existing named function supersedes it.

[I get a “Calculation limit was reached while trying to compute this formula” error message for my recursive formula. How do I resolve it?]

This can happen in 2 cases:

* The computation for the formula takes too long.
* It uses too much memory.

To resolve it, use a simpler formula to reduce complexity.

[If a named function and named range both have the same name, which takes precedence?]

The named range takes precedence over the named function.
