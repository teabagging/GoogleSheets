# Format numbers in a spreadsheet

You can format your data in several different ways in Google Sheets so that your spreadsheet and its contents are displayed how you want them.

[Computer] [Android][iPhone & iPad]

## Format numbers, dates, and currencies

To format or change the format of numbers, dates or currencies in a spreadsheet:

![Format numbers in sheets](https://storage.googleapis.com/support-kms-prod/tTL3zochVUTPypX4Ap538wuawPAVrW0K4ViU)

1. On your computer, open a spreadsheet in [Google Sheets](https://docs.google.com/spreadsheets/).
2. Select the range of cells you'd like to format or modify.
3. Click **Format** ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Number.**
4. Select the format to apply to the range of cells.

## Custom formatting of numbers, dates, and currencies

You can apply custom formatting for currencies, dates, and numbers. For each of these, you can search in the text boxes found in the formatting menus to find the format that works for your spreadsheet. If you don’t find what you are looking for, you can now create your own custom formatting within the menus.

[Custom date formatting]

To apply a custom date or time format to your spreadsheet:

1. On your computer, open a spreadsheet in [Google Sheets](https://docs.google.com/spreadsheets/).
2. Highlight the data you want to format.
3. Click **Format** ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Number**.
4. Click **Custom date and time**.
5. Search in the menu text box to select a format. You can also add your own custom date or time format into the text box.
6. Click **Apply**.

By default, the time and date options that surface will be based on your [spreadsheet locale](https://support.google.com/docs/answer/58515).

If you want to add more detailed time or date values to your formatting, for example the hour or minute, click the down arrow in the right corner of the menu text box and select an additional value. You can adjust the specific formatting for these values by clicking on the arrows in the value and choosing an option. To delete a value from your formatting, click the value and select **Delete**.

[Custom currency formatting]

To apply a custom currency format to your spreadsheet:

1. On your computer, open a spreadsheet in [Google Sheets](https://docs.google.com/spreadsheets/).
2. Highlight the data you want to format.
3. Click **Format** ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Number**.
4. Click **Custom currency**.
5. Search in the menu text box to select a format. You can also add your own custom currency format into the text box.
6. Click **Apply**.

You can also change a few properties about the currency (for example, how many decimal places to show) by clicking the drop-down menu in the right corner of the input box and choosing a desired option.

[Custom number formatting]

To apply a custom number format to your spreadsheet:

1. On your computer, open a spreadsheet in [Google Sheets](https://docs.google.com/spreadsheets/).
2. Highlight the data you want to format.
3. Click **Format** ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Number**.
4. Click **Custom number format**.
5. Search in the menu text box to select a format. You can also add your own custom number format into the text box.
6. Click **Apply**.

When creating a custom format, note that the formatting can consist of up to 4 parts separated by semicolons: positive;negative;zero;non-numeric. Financial formats are also supported.

You can use colors in the formatting, for example to differentiate between positive and negative numbers, by adding a color in brackets (for example, [Red]) anywhere within the desired part of the format. Formatting colors must be used in English. The colors that can be used are:

* Black
* White
* Red
* Blue
* Green
* Magenta
* Yellow
* Cyan
* Color# ([where # is replaced by a number between 1-56 to choose from a different variety of colors](https://developers.google.com/sheets/api/guides/formats#meta_instructions))

Here is a list of common syntax characters that can be used to create a custom number format:


| Character       | Description                                                                                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0               | A digit in the number. An insignificant 0 will appear in the results.                                                                                                                                                                                                                                                                                                    |
| #               | A digit in the number. An insignificant 0 will not appear in the results.                                                                                                                                                                                                                                                                                                |
| ?               | A digit in the number. An insignificant 0 will appear as a space in the results.                                                                                                                                                                                                                                                                                         |
| \$              | Formats numbers as a dollar value.                                                                                                                                                                                                                                                                                                                                       |
| .(period)       | Formats numbers with a decimal separator.* The[spreadsheet locale](https://support.google.com/docs/answer/58515) determines which character is used as the decimal separator for all numeric values.* When you press the decimal key on a numeric keypad, the [spreadsheet locale](https://support.google.com/docs/answer/58515) also determines the character inserted. |
| ,(comma)        | Formats numbers with a thousands separator.                                                                                                                                                                                                                                                                                                                              |
| /               | Formats numbers as a fraction.                                                                                                                                                                                                                                                                                                                                           |
| %               | Formats numbers as a percent                                                                                                                                                                                                                                                                                                                                             |
| E               | Formats numbers as an exponent.                                                                                                                                                                                                                                                                                                                                          |
| "text"          | Adds text to the formula. Insert the desired text within quotations for it to appear.                                                                                                                                                                                                                                                                                    |
| @               | Displays text entered into a cell.                                                                                                                                                                                                                                                                                                                                       |
| \*              | Repeats the following character to fill in the remaining space in the cell.                                                                                                                                                                                                                                                                                              |
| \_ (underscore) | Adds a space equal in width to the following character.                                                                                                                                                                                                                                                                                                                  |
