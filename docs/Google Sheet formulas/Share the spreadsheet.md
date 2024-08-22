## 1. Inputting data

Blank spreadsheets never stay blank for long. Inputting data is the first challenge you come up against when you open your document. The following formulas and tricks help fill out your sheets.

### Importing from other spreadsheets

Anyone running a small business is all too familiar with the plague of having too [many different spreadsheets](https://paperform.co/blog/best-spreadsheet-software/) for different things.

If you’re looking to quickly move data from one spreadsheet to another, the

```
=IMPORTRANGE 
```

function is your friend. This makes it easy to import data from one Google Sheets spreadsheet into another one.

```
=IMPORTRANGE(“spreadsheet\_url”, “range\_string”)
```

. The spreadsheet\_URL in this formula is the spreadsheet’s key, highlighted here:

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh4.googleusercontent.com/qvmBPlcbOqcD59eONN95I1RsYMxn0VL8DJZy_HDivprdmxrgfNuSi5KrZkZ0EuLUzcAA44czMQDSbnTFErsk-0lJl0znhGiDtZjYQE5tTkOXh5AmH5mGYhdyo4R_DGcoS97lwoUFK-95Pg_tVQ)

Meanwhile, the range\_string should first define the name of the sheet that is being imported from (eg. “Sheet 1”), and then the range of data being imported. Here’s a sample formula:

```
=IMPORTRANGE("1-us8lMIEkn3I7YsHs1poPLS\_gR8OjpS6VlBMYOZqVjc","Sheet9!A2:B9")
```

Using this simple formula, you can add the data that you want from another spreadsheet, without wasting time copying and pasting.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh4.googleusercontent.com/UbWBaWtJSPw0OV7HB_5TAwnXN6_xeplXPkOx5rFJmqJSCBNmtatB99BHngFkZyJTrzTKt7K0UJ5-ZOrkl3-SBSkg7cLNIJ0PtbQfTa6iHgvjiyvceujBnoga4s1alWv9YFy41pNRUcOfx1VHzg)

Because it’s a dynamic formula,

```
=IMPORTRANGE
```

allows you to keep your spreadsheets up to date. If you change something in the original spreadsheet, the changes are automatically reflected in the cells you’ve imported.

### Dragging cell data

Google is pretty great at picking up patterns. You can use this to your advantage when you want to input predictable data.

Whenever you highlight a cell or range of cells, there is a blue square in the bottom right corner of your selection. By clicking this and dragging it to new rows, you copy the specific values of the cell you have highlighted.

Not only does this *copy* data, you can also use it to anticipate data. If you highlight three sequential values and drag them down, Google will automatically continue the pattern you have established.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/WPGSh5uJKInh-Etnz3FO2MJLsYQPRIxxPQ3GzpsdKIJxAJovu4r1rZl8rQOIW2x_1YeNEFNV2TXK0j8mdnlVGUjj4eXYeOOsW4BOKUdxt2ho2MRuYFh_8kB8Q_9-5xTYo-MuyT01LQmzNx-Bvg)

This can also be used to copy Google Sheets functions. For example, imagine you want to calculate the number of characters in a series of cells using the

```
 **=LEN**
```

function.

You might do this to make sure that your website URLs aren’t too long. You can apply the formula to your first cell, and then drag it down so that it responds to each cell of data.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/YoIjodpO9i1OU4T0hW9WbnEArPXEqCqOX-bn8cP2Jd8VDE4ik0ArsrutINrfhQr__g0pcpSqSoiaGMo2xDWsWgMhU3kEF8fT9SJJbKcU1RYv9kYQis0EnTeVf5cW3WvZzqgT5kPnIe1sHmhTYg)

Each formula references the cell in its corresponding row, copying the format of the original formula.

### Adding timestamps

There are a lot of handy keyboard shortcuts in Google Sheets, and the timestamp ones are definitely among the most useful.

When using Google Sheets as a task management tool, it can be useful to record when you’ve completed something.

Sure, you can always manually input the date and time, but that’s pretty tedious, especially if you have to do it over and over. It’s much easier to hit a couple of keys.

* Date: Command/Ctrl + ;
* Time: Command/Ctrl + Shift + :

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/aR_fI4cD_7KgOsCsIlTj3fGNJpdIT9kQ1-cnj2Tv20r-5YKfm5Qj6Ftf1xf6urhBfUjcXMvrVpHP6Kv7KlijvkZIidZTu5CJKiIs62B_tGDc7LjGoLwHIlYFX0h4YO1TiBUmKPcPstJ6obNkcg)

The format of your time and date is set automatically by your locale. You can change these settings by navigating to Format > Number and then selecting “Date” or “Time”.

These shortcuts not only save time, but also keep reporting precise. You can’t beat that.

### Integrating with other apps

While Google Sheets is a powerful tool on its own, it reaches another level of sophistication and usefulness when integrated with other apps.

The [Google Sheets integration with Paperform](https://paperform.co/integrations/google-sheets/#:~:text=Paperform%20is%20a%20powerful%20online,with%20media%2C%20colors%20and%20fonts.) is a great example. If you’re looking to collect data of any kind—whether that’s online orders, client responses, survey responses, contact information or more, [Paperform does it with style](https://paperform.co/blog/add-paperform-responses-to-google-sheets/).

<iframe width="200" height="113" src="https://www.youtube.com/embed/pnZWM6Z8Kb8?feature=oembed" frameborder="0" allowfullscreen=""></iframe>

When you integrate Paperform with Google Sheets, your collected data is automatically sent to Google Sheets the second it is submitted. This will save you a ton of time when it comes to managing data.

It also means that when it comes time to analyse that data, all the information gathered in your forms has been automatically organised in a spreadsheet and is ready to go.

### Form a better life now.

[Get Started](https://paperform.co/register/)

## 2. Data analysis

Once you have inputted your data, you have to work with it. Most of the formulas in Google Sheets are used to [analyse blocks of data](https://paperform.co/blog/cross-tabulation/). Here are some of the most useful ones.

### Array formula

When you use a formula for a large database, you often don't want it to apply to only a single cell. When you need the formula to apply to more than one cell, one option is to drag it to copy it into other cells, and the formula will adjust to match the new range of cells.

However, there can be issues with this approach, as it essentially creates a new formula in every cell. Firstly, this can cause the sheet to load and process slower if you're using a lot of data, and secondly, it means that you need to change each formula individually if you want to make adjustments.

An array formula can fix both of these problems. With just one formula, you can create a calculation that spans multiple rows and columns. If you decide that you want to make any changes later, your changes will apply to all of your data.

```
=ARRAYFORMULA(array\_formula)
```

For example, you might want to subtract the cells in one column from the cells in another, and then add the totals together. Instead of doing this using two different formulas, you can use an array formula.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/yeQa2ElwjOEzYTsln2nkQ6Gw69LXTaytO-WpjlIWGBAANCVdo_odSPXMdkcKb54VAhjqwwcoNaaqEfZohwdMmK75Hto_WBQrtxlEjqUWhtkq5p0KGGClM4rXI0j888mv8L_tSJxs0lDZEenjag)

```
=ARRAYFORMULA(SUM(C2:C9-D2:D9))
```

Here you can see that the array formula helps us calculate the total revenue made from these orders, adjusted for the cost of offering discounts.

The SUM part of the formula is a standard formula, but the ARRAYFORMULA allows you to calculate a range instead of a single cell.

### Conditional counting

Sometimes you need to count how many cell values meet certain criteria. Of course, you could count them manually, but this is time-consuming, and you could easily miss some cells (especially if you’re dealing with large data sets).

Using the

```
=COUNTIF
```

formula, you can specify the range that you want to search and the criteria that you want to search by.

```
=COUNTIF(range, criterion)
```

For example, you might be looking through a list of contacts for people whose job title includes the word executive. If job titles are listed in column A, your formula might look something like

```
=COUNTIF(A2:A500, "executive")
```

.

Or, if you were looking for items in your inventory that had sold fewer than 10 units, and unit numbers were listed in column E, you might write

```
=COUNTIF(E2:E500, "<10")
```

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh5.googleusercontent.com/xWfU3dcFlF0u6eVY98xQ39arr78wCYaIsfY-JayCWFnjlIFcQI4az17cbrGVzxK-zO6mj8Ghd970rfW_AXMnKP67UQUwBH-Ao4xOg0MN-Cy81jMLOseCsVFZ5DIdolEXiINk_0GtxIuyqRFwpQ)

It's a simple formula, but it's still useful when you need to count the frequency of a value from a large database in a matter of seconds.

### Finding data

Spreadsheets can get big, and this can make finding information in them tricky. Sometimes it’s useful to simplify your data by grabbing bits and pieces.

The

```
=VLOOKUP
```

formula finds the data you specify, and then returns information from a cell in the same row, from a chosen column. You might use it to look up an item’s price by searching for the item’s name.

```
VLOOKUP(search\_key, range, index, [is\_sorted])
```

The search\_key can either refer to a cell (“F3”) or a static piece of data (“Row counter”) that you’re looking for. The range is the area that the formula looks within, and the index refers to which column of information you want to see.

Is\_sorted refers to whether your search key must be exact (“FALSE”), or if you want the closest match (“TRUE”).

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/pWWj_t_bskDrydlsBlhflrM-ynkcZeAXtIJPXoQaPfR9cmmqkoNmxaqy75R2dXCCvmXXXWAlJeScx3o9RExY6os6quFeepX8LgyCCW9BYW6-o4mEgK6i9NUS1agJwRFIm_r5oYzJHTfyoMETlA)

**Important:** VLOOKUP is short for vertical lookup. If you have your data displayed in horizontal rows instead, you can use HLOOKUP in exactly the same way.

### Ask questions

It wouldn’t be a Google tool if you couldn’t ask it questions, right? Google Sheets has an incredibly powerful feature that allows you to ask it questions and extract data based on your spreadsheet.

By using the ‘Explore’ button on the bottom right-hand corner of your spreadsheet, you can quickly get answers to questions like “Which rep sold the most aggregate units?” in a matter of seconds.

The Sheet uses AI to quickly calculate a sum of each rep’s sold units and feed through an answer by generating a pivot table. Here’s how this looks:

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh5.googleusercontent.com/_oGG8KxZ_BPUZV2zz24WPi3IOcDp6uPCQ5VHk2oYfx0iEJAHCYiOCbuyy7ZmvC11qElBpCUQXBM6fRmMtwnBA437WmOUThpxLPnOaxmrPbkWDtNcUaVYNXhHkxLLGd3yZwPzhH63pHTBp390VA)

Pivot tables allow you to simplify and summarise your data. They work in Google Sheets in much the same way as they do in Microsoft Excel—basically, they group values together so that you can view your data through a chosen lens.

The Explore function lets you create them in a more conversational way, so you know exactly what questions the table is answering.

Google even comes up with some questions you might be interested in, which can guide your analysis. You can also quickly apply attractive theming to your tables from this menu.

### Translate languages

The internet has opened up possibilities to work with people from all over the world. One of the ways Google has made this easier is through its Google Translate app, which helps you to translate languages.

It might not be perfect, but it can often provide a fairly accurate translation, especially if you're translating something back into English.

Google has built-in a formula that means you can make use of the Google Translate app without leaving your spreadsheet.

```
 =GOOGLETRANSLATE("text", "source\_language", "target\_language")
```

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh5.googleusercontent.com/YWJNdtB3u2YpEjvZGeBJKGX9iePana8jL02QJ3OTwkKUeN4IWPe6A1jYQZ97NKmAEtEDD3_sAUPPeGRC5alH6Rbmsnue0tDGqceci0-wAwsQrE90qdMCl14IV39DO1ZlQrXlVJaiZ47671EPzQ)

The text part of the code can either point to a cell, or you can type in the words you want to translate directly into the formula.

In this example, the text points to cell I9, the source\_language is in German (initials “de”) and we’re translating it to the target\_language of English (initials “en”).

If you’re unsure what language is being used, for example when a customer has filled out a feedback form without indicating their language, you can use

```
 =DETECTLANGUAGE(“text or range”) 
```

to get the two-letter initials that correspond to the language.

### Form a better life now.

[Get Started](https://paperform.co/register/)

## 3. Formatting and appearance

The way you present your data helps it be more understandable. There’s nothing more satisfying than a well-organised spreadsheet. These tips make formatting your Sheets easy.

### Clean up data

Let’s say you’ve made the perfect customer feedback form and hooked it up with Google Sheets so that you can analyse your data.

When the results come in, *inevitably* people will fill it out with strange capitalisation, or with weird spaces where there shouldn’t be. Don’t pull out your hair just yet, we can make everything look beautiful in no time.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh4.googleusercontent.com/_izU1qxBlEKD3M3QWkUy46NU6-_zpaOn0vYomtxpoT6Lyhp9X6YtmYxLL77nCnkzTRMT0rFn98GFLjEIG28teuJf1MbyD8ReAqctumuyW2m4y1Q8e2YipAU-EdOvzGm_AO0_c3R_HS-hJW6sRg)

Our first column is looking a little rough. First, we can get rid of the spaces by using the

```
=TRIM
```

function, then pointing it at cell A2. By clicking the blue square in the bottom right corner of the highlighted box, we can then drag the formula down to apply to each cell.

Next, we can use

```
=PROPER
```

to make each word capitalised. By pointing

```
=PROPER
```

at cell B2, you can make sure that the changes are made to the text that’s already been trimmed. =UPPER can be used if you’d like the words to be entirely capitalised, and

```
=LOWER
```

can be used to make the words lowercase.

If you’d like to have one column for first names and a second column for last names, we can use the =SPLIT function to divide the content of a cell. Here, the delimiter we’ve split the content around is a blank space.

### Sort data

It can be handy to sort your data for all kinds of reasons. The

```
=SORT
```

function allows you to sort your data in either ascending or descending order. You can even sort by multiple columns.

```
=SORT(range, column\_index, ascending\_order)
```

. Here you can see we have a list of employees. The =SORT formula lets us organise them by department, then last name.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/1yJ27m4vk2W42wkRo2nvUr6V9CqJrhIpw-cW7516SvhwiLrD1K26palmkDaxhlPIf7BXZv6exs91tb1Lv0wcCCZ22UuTUzfb39x3dG0gl3O-LpXAPtDxha4jJFPFmk_zJRSJo-RBYTGf22YrPQ)

### Make heat maps

Being able to view your data more visually doesn't just make your sheets look good. It also makes it easier to find the information you need and take it in.

Heat maps are a great way of highlighting certain values and seeing important data with a glance. You can add a colour scale using conditional formatting so you can easily see higher and lower values.

When you select Format > Conditional Formatting, you can create a colour scale rule and apply it to the range that you want to use.

You can make it easier to sense the popularity of a product by creating a heat map that highlights the quantity ordered for each through colours. In this example, a product with plenty in stock is green, while one that has run out is red.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh4.googleusercontent.com/76Z7Ku66LcEKl_2-yz9HQ4VNaOoA6d0JcbVD1Y2RdTnwxFNCg6dBffdlc9PYcRDVVk8T_u-XwYSTDtHf2k3IzaZIQ06bXVGiraZN6b5ewTxM8_BhMbNPSZ8sHaDYlel2NwoupiMO7u4bSWD3Ow)

## 4. Collaboration

The major advantage of the Google Suite is how easy it is to work as a team. The following tips are useful when you want to collaborate with your coworkers.

### Share Sheets

Sharing Google Sheets with your team is as simple as clicking the 'Share' button at the top-right corner of the screen.

It works in much the same way as it does in Google Docs. You can share with individuals by typing in their email addresses or create a link that anyone can use.

There are three levels of sharing: Viewer, Commenter and Editor. Viewers and Commenters can’t change the data in a spreadsheet at all, which is handy for when you want to show off your stuff without the risk of someone else swooping in and changing it.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh6.googleusercontent.com/cPtypiZFyIPTyb4m81YsXtc3jZsuKsXShGYjdmnrhL9hCRnuRWkKJz6BEhA_Q3Va-JzPX2p4QT-_SsMeYtqXrcNZodKtOkOmKCkvChlqvjU-FcAgJNjtVYVn77NufZg3WI9c_4jjFV5YzywFCw)

### Protect your data

It can be risky to give people Editor access to your Sheets. There are a few ways you can make sure that your data is protected from other users’ clumsy keyboards.

One method is to single out sheets or ranges and restrict who can edit them, or set it up so that a warning pops up whenever an edit is made.

You do this by navigating to '

```
Data > Protect sheets and ranges
```

'. From there, a side menu allows you to view all the protected sheets and ranges.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/wXnvaWIV7WGahMKk74X-cuz3_omrVAM2XWjGsauldVbXxQiWyMUko6uExeF0dGRT37i3VDGv5sXF6emkteySzUlNDK0fwOJrehrhZ6mp9Bw0d3ROzWL5RNmDWbj58Ajra7YGcSi4L3G1UhUdYQ)

You can also set up notification rules via the Tools menu so that you receive an email when changes are made.

Another way to prevent accidental edits is to set data validation, which you can find in the Data menu. This means that only certain kinds of data can be inputted into the cell, so people can’t accidentally add dates into a row dedicated to names.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/Sfrw6oO4DQrPp1FXIpcT1FIRsHbUmLX5j94grnZ1ItbWRo00j99WElvZKwcdorFgTGC20sVKpKSTp3KlnZmDtAB--0xlX5tCdXJMidsdrSVE4QrSC1x0MmA7-YUKeYWZxyv-cTu8K_oNY3vwhg)

### Comments and notes

Sometimes you want to be able to add extra information to a specific cell. There are two ways to do this, depending on whether or not you want to attribute the information to a user or not.

If you right-click on a cell and add a “Note”, that information will show as a black triangle in the upper-right corner of the cell and will appear when you hover over the cell.

You might do this so that the information is associated with the sheet itself, rather than a specific user.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/B97ie6erWOqGBHPDQBEf5I5O8ZnqwX_De9f4qNcrvHmCLq7X0_xoeBjQrFhlVe8VcXf_nCGcOKtcKrf3TmAf6hlPIV9dpKHgEj-J1vgrXTrSNlJ9-uwHGEWI3Aor__J0Yi3fcfPhAdAlOcNbWg)

The other way you can add information is through comments. These are attached to your Google account and have the added functionality of replies.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/lv91Bfi8dqRMwdiQU2R1Zh1MeY3TJvMdOsa-nFa8iNfggeoAm897ZeRM67m7oQr-4rqAM8UOuyyUTcfNRZAQACjmgBn_Cy4wx8lypbSR1W_PaHKJvhXU2j6yXoAz0bCabdV6A11CJYs6Tpzqcg)

Comments are indicated with a yellow arrow in the top-right corner of the cell, as well as in the Sheet tab. You can view all comments across a sheet from the Comments menu in the top-right corner of Google Sheets.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh5.googleusercontent.com/EPuXpYrEXZABeLnsqHN7nYxT9Z_baie7Hu6gGIH7ycAs8pLmljXlFE8bKZz3uEtnRuGIElFoVvG92TrYz1fXg9S14xKTDgHKwaOw9TK1FLgeZG8TfnBjW4Z2YCQitUYmdiQydh78iOFqJGJCbQ)

Comments allow for communication between multiple users of a sheet. You can reply to comments, and even use the @ symbol to notify other users of your comment. Comments are compiled in a side menu, so you never miss out on the conversation.

## 5. Bonus hacks

If spreadsheets aren't your idea of a fun Friday night, these Google Sheets features are bound to make you reconsider. There are some incredibly cool things that you can do with the platform, which take it beyond the workplace.

### Create works of art

Pixel art is a form of digital art where images are created by colouring individual pixels. It’s how early computer games were forced to render their art, and many modern ones continue to use the style. All you need is a grid and the ability to block colours in it, which Google Sheets easily delivers.

Fair Isle knitting works under the same principles as pixel art, where the crafter creates pictures by changing the individual stitches in a project. Because of this, Google Sheets is also the program of choice for some knitting, cross-stitch and other textile enthusiasts to plan their creations.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh6.googleusercontent.com/eWqZwd8zScBeAV6LWhVV_Alf3C-McZsVbxQ71TOqOtBO_H_q4pbFOQqL-H-ywBOqiaxCa1_dujCQy1E7T4Clrp3tzmpUYgZJBzJpQrbyYDBK0XEqRuMum8WW97Fy4vTi8CfOP0OdhPcaXjkNcA)

### Celebrate pride

Google Sheets gained an Easter egg in 2019 to celebrate Pride Month. When you type out the word “PRIDE” across five columns, the Sheet transforms to have the colours of the rainbow flag. In 2022, it updated to the colours of the Progress Pride flag, which explicitly supports transgender people, people of colour, and AIDS victims.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh3.googleusercontent.com/DC1cipoYhxmvnTyq5fhRDKglxsCVaffOVhGwA0T_uy3LubdWwqCKzDkB6rAAY8TrBy-piSM81lGAvT0gHLVFf0zFXapjqO-somjPXm3O07OCz94vQfctYbSeRz-fSh30hHa_r0OWcbN_ptrhzQ)

### Play tic tac toe

Because you can share documents, you can actually use Sheets to play grid-based games like chess, connect 4, and tic tac toe.

As anyone who has ever sat next to a friend in a boring class knows, all you need to play tic tac toe is a simple grid. Highlight a 3 x 3 lot of cells, and from within the Borders menu, choose Inner borders. Then resize the rows and columns of the grid so that it’s an even size.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh6.googleusercontent.com/PeCisEW8fvXVmcUQeTe6a6intr3kFSJsNGisOU8Jp_9f-f18q0yCvdJu1e5k8x4hLm7gKLdacapcU0xETit9scR33QIiVFhB5lnQ24Y6eg4nIjQJBbmKQZrt2xu88whiWvO9Ij-ifZ5dAhcVeQ)

To make it a little more visually interesting, let’s assign colours to our players. By using conditional formatting, we can set the grid up so that when an X is placed in the grid, the cell turns red, and when an O is placed, the cell turns blue.

We can also merge some cells below the grid, so that the players have a space to talk to each other.

![](https://img.paperform.co/fetch/f_webp,w_1400/https://lh6.googleusercontent.com/Wc3PFiaN1FrdF9chjQXDpH2EkfT8HvreGleCRkaJuZtQvs-SQv3b8CxzZzepNoCi6-dpMEA_7fHUH3jBCXEuA5mclkVcd1fjHmg26qWswOv81FKCEkj2L4CjDHPGVqr7v7QgGPaAmanfocMYdQ)

Now that the grid is set up, all that’s left to do is share the Sheet with a friend. You’re ready to play.

## Over to you

Google Sheets is one of the most useful and versatile apps in the Google Suite. By now, you’ve learned a boatload of new tricks and tips to make a lot more than just your standard spreadsheet.

And these are only the beginning—armed with your newfound appreciation for the versatility of Google Sheets, you can let your imagination run wild finding even more ways to use it.

Not sure how to get started? The first step is collecting useful data to power better decisions. With Paperform you can create stunning forms that integrate directly with Google Sheets, so you’ll always have something to play with. You can give it a try for free for 14 days, with no credit card required.
