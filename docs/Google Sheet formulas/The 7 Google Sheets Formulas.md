# The 7 Google Sheets Formulas

Google Spreadsheets is one of the best tools you can use for analysis, especially when you work with numbers. There’s so much more than creating a sheet. With the right Google sheets formulas, you can extract useful insights for your business as well as manipulate information to make the right decisions.

[![Whatagraph marketing reporting tool](https://media.whatagraph.com/strapi_blog_files/6_FE_0wqh3w_E00y_Jhh_ZAKQC_7c_WT_Yi_W3_KO_Dgad_Dp_Wv_G_40805bded1.jpeg?width=992)](https://whatagraph.com/blog/author/indre-jankute-carmaciu)[

![Whatagraph marketing reporting tool](https://media.whatagraph.com/strapi_blog_files/google_sheets_formulas_pxjnftd_a891b1ccb7.png?width=992)

## Table of Contents

* Top 7 Google Sheets Formulas You Should Know
* 1.ARRAYFORMULA
* 2.V-LOOKUP
* 3.IFERROR
* 4.COUNTIF
* 5.IMPORTRANGE
* 6.LEN
* 7.SPLIT
* How Do You Create a Formula in Google Sheets?
* How Many Functions Does Google Sheets Have?

Knowing some of the most important and beneficial Google Spreadsheet formulas can save you hours in your work every day and make your life easier.

The good knows is that you don’t have to be a tech guru to use these formulas. Instead of wasting time on learning hundreds of [Google sheet formulas](https://whatagraph.com/blog/articles/password-protect-google-sheet), we’ve selected the 7 most important ones that offer limitless possibilities to automate your work.

You’ll also learn how to create your own formulas on Google Sheets, and a few other tips and tricks when it comes to using this awesome online spreadsheet tool.

So, let’s begin.

## Top 7 Google Sheets Formulas You Should Know

Before you find out the best Google Sheet formulas, it’s important to know how to use them.

Pick a cell you want to enter one of the formulas, and double-click on it. Then, enter the equal sign “=” and type in your formula. Google Sheets may also suggest a formula for you, based on the data.

Here are the seven most important formulas in Google Sheets.

### 1.ARRAYFORMULA

In most cases, you need to use a formula across a column or row, instead of a single cell. If you copy a formula from one cell, let’s say =A2 - B2 in cell C2, and paste it into cell C3, Google Sheets will automatically change the formula into = A3 - B3.

However, having plenty of formulas in your sheet can slow it down. Also, if you want to make a change in your formula, you’ll have to make the same change across each formula manually. Not only that this requires a lot of time, but it also requires plenty of processing power. What’s more, Google Sheets won’t automatically apply the formula to new columns or rows.

Luckily, an array formula lets you write a formula once and apply it to a complete column or row. So, you no longer have to spend time copying and pasting. Besides, if that one array formula breaks, you should check only one cell instead of hundreds of cells if you’re copy-pasting.

It’s a single formula with a single calculation with results sorting into more columns or rows. If you make a change in the formula, Google Sheets will automatically apply it to all data.

Keep in mind that everything in this formula must be a range. So, you write =ARRAYFORMULA before writing a standard additional formula, but with individual cells rewritten as ranges.

For example, =ARRAYFORMULA (SUM(B2:B5 – C2:C5).

```
=ARRAYFORMULA means we apply the formula to a range, and the second part of the formula (SUM(B2:B5 – C2:C5) is a standard additional formula applied to a range (cells B2 through B5 and C2 through C5).
```

Use this formula when you want to run any formula across more than one cell, instead of copy-pasting.

[![Read More](https://media.whatagraph.com/strapi_blog_files/Google_Analytics_Data_in_Google_Sheets_7195090f7f.png)](https://whatagraph.com/blog/articles/google-sheets-analytics)

### 2.V-LOOKUP

This is one of the most useful formulae when working with tons of data. It searches for a data point in the sheet, for example, an URL or a post title, and returns a useful piece of information for the data point in another sheet, such as conversion rate or monthly views.

Here’s an example of how you can use this formula to find out the traffic of a certain set of posts. Export the list with this information from your Google Analytics account, and put it in a different tab. Use the following V-LOOKUP formula to have views by URL pulled into the original tab.

=VLOOKUP(search\_key, range, index, is\_sorted)

Search\_key stands for the value you want to look for.

Range stands for the number of rows and columns included in the search.

Index stands for the column index of the value that will be returned, as long as the first column in the range is numbered 1.

Is\_sorted reveals if the column searched is sorted. According to Google, it’s best to set it to FALSE to ensure the exact much is returned instead of the nearest one.

### 3.IFERROR

This formula is a neat way to deal with cell errors. For example, when you try to divide a number by zero, you get an error #DIV/0! So, if there are other cells in your sheet with formulas that include the data in this cell, subsequent calculations will be prevented from working due to this error, and your sheet will become messy.

To avoid this, IFERROR lets you replace error values with a new, specific value that you determine.

=IFERROR (original\_formula, value\_if\_error)

Original formula stands for the traditional formula you want to use. Let’s say you have one column for page views, C2, and another for CTA clicks, D2. If you want to discover the highest-converting pages, you’ll need to divide page views by CTA clicks and get the result in a third column.

But, if part of your pages doesn’t have CTAs, they won’t have clicks. So, you’ll get #VALUE! on your Google Sheet as a number can’t be divided by zero.

The IFERRIOR formula allows you to substitute #VALUE! with another value. You can use (“ “) to keep your sheet look as neat as possible.

Here’s the formula for the above situation: =IFERROR(C2/D2, “ “)

[![Read More](https://media.whatagraph.com/strapi_blog_files/Google_Analytics_Data_in_Google_Sheets_a567a36180.png)](https://whatagraph.com/blog/articles/google-sheets-analytics)

### 4.COUNTIF

No more manually counting cells in your sheet. With this formula, you’ll find out the number of cells that meet your criteria without counting. This will save you valuable time and prevent you from making possible mistakes by missing some cells.

=COUNTIF (range, criterion)

For example, if you want to find out how many blog posts compete for the same keyword, let’s say “first trimester,” and the keyword is in Column C, your formula would be =COUNTIF (C2:C1000, “first trimester”).

It’s a simple formula, yet significant when you have to deal with a large database.

[![Create marketing reports from 40+ sources in minutes with Whatagraph](https://media.whatagraph.com/in_text_banner_5d34757765.png)](https://whatagraph.com/)### 5.IMPORTRANGE

With this Google sheets formula, you’ll no longer have to manually copy and paste tons of data from one sheet to another. It allows you to import data or a range of cells from a different sheet.

Say your colleague sends you a sheet of the content she updated last week. You want to add this data to the main sheet of all the content you publish. Instead of doing this manually, you can use this handy formula in the following way:

=IMPORTRANGE (sheet\_url, range\_string)

Sheet\_url stands for the URL of the spreadsheet.

Range\_string stands for the string you want to import in the sheet.

It would look something like this:

=IMPORTRANGE (https://docs.google.com/spreadsheets/d/1YU2AXBdj-3p\_4nS9uYOS3CggQdB9dt5ShVit6OX6jfk/edit#gid=0, “Sheet2!B2:C10”)

### 6.LEN

You have probably noticed by now that Google Analytics tends to cut off the https:// or http:// from each URL. Well, this can be a huge problem when you want to combine data from HubSpot and Google Analytics. Since the URLs are not identical, one containing https:// or http:// and the other not, you can’t use the V-LOOKUP formula here.

So, the LEN formula allows you to adapt the length of the https:// string without manually changing every URL.

=RIGHT(text,LEN(text)-n)

=LEFT(text,LEN(text)-n)

For example, the full URL is in column B (B2) and you want to make it identical with the URL in the tab from Google Analytics, which would involve omitting the https:// string.

You’ll use the following formula:

=RIGHT(B2, LEN(B2)-8)

RIGHT stands for the first characters in the cell. If you want to remove the last ones, use LEFT.

B2 stands for the cell where the full URL is.

LEN(B2)-8 stands for the text or the full URL minus the number of characters (https://) in order to be identical with the URL from the Google Analytics tab.

### 7.SPLIT

This formula lets you split data from one cell into multiple cells. For example, it allows you to split the first name and last name of your subscribers before you can add them to your mailing list.

Once you line up the names of all of your subscribers in a column (cells A3 to A10), the following two columns (B and C) will include the first and last names you’ll get after applying the SPLIT formula:

=SPLIT(Text, Delimiter)

For this example, you should write the following formula into cell B3.

=SPLIT(A3, “ “)

The first name will now be in B3 and the last name in C3. To avoid doing this for each cell (from A3 to A10), just drag cell B3 downwards to B10 to populate the other cells.

## How Do You Create a Formula in Google Sheets?

You can create simple formulas in Google Sheets that will multiply, divide, add, and subtract values. The formulas use standard operations: (+) for addition, (-) for subtraction, (\*) for multiplication, and (/) for division, and (^) for exponents.

As you’ve already noticed by now, each formula must start with (=).

* First, select the cell that will house the result, for example, A4.
* Enter the (=) sign.
* Type the cell you want to reference in your formula, for example, A2. You’ll notice a dotted border around cell A2.
* Type the desired operator, for example, the multiplication sign (\*).
* Type the cell you want to reference next in the formula, for example, A3.
* Press Enter, and you’ll notice the result in cell A4.

**Note**: If you change the value in one of the cells, either A2 or A3, the result in A4 will automatically change as well.
