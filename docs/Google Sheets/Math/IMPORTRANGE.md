# IMPORTRANGE

Imports a range of cells from a specified spreadsheet.

### 

### Sample Usage

`IMPORTRANGE("``https://docs.google.com/spreadsheets/d/abcd123abcd123``", "sheet1!A1:C10")`

`IMPORTRANGE(A2,"B2")`

### Syntax

`IMPORTRANGE(spreadsheet_url, range_string)`

* `spreadsheet_url` - The URL of the spreadsheet from where data will be imported.
  * The value for `spreadsheet_url` must either be enclosed in quotation marks or be a reference to a cell containing the URL of a spreadsheet.
* `range_string` - A string, of the format `"[sheet_name!]range"` (e.g. `"Sheet1!A2:B6"` or `"A2:B6"`) specifying the range to import.
  * The `sheet_name` component of `range_string` is optional; by default `IMPORTRANGE` will import from the given range of the first sheet.
  * The value for `range_string` must either be enclosed in quotation marks or be a reference to a cell containing the appropriate text.

## Technical details & best practices

Any update to the source document `IMPORTRANGE` will cause all open receiving documents to refresh and show a green loading bar. `IMPORTRANGE` also waits for calculations to complete on the source document before it returns results to the receiving doc, even if there is no calculation to be done in the source range.

**Best Practices**

* Limit the number of receiving sheets because each receiving sheet must read from the source sheet
* Restructure and condense your result before you use `IMPORTRANGE`, especially if you import from a frequently updated Sheet.
  * For example, your goal is to calculate the sum of 1,000,000 rows in from another spreadsheet. It’s faster to calculate the sum on that spreadsheet and then use `IMPORTRANGE` to fetch that single-number sum than to use `IMPORTRANGE` to directly transfer all 1,000,000 rows of data and calculate the sum in your spreadsheet. This method condenses and aggregates information for `IMPORTRANGE` before it transfers.

`IMPORTRANGE` updates can propagate to other sheets when you chain sheets together. If sheet B has an `IMPORTRANGE(sheet A)` and sheet C has an `IMPORTRANGE(sheet B)`, it creates a chain. Any update to sheet A causes sheet B and sheet C to reload.

**Best Practices**

* Limit chains of `IMPORTRANGE` across multiple sheets.
* Avoid cycles of `IMPORTRANGE`. For example, you create a cycle if you use `IMPORTRANGE<span> </span>`on multiple spreadsheets that reference each other: Spreadsheet A’s data uses `IMPORTRANGE` on data from Spreadsheet B, and Spreadsheet B also uses `IMPORTRANGE` to fetch data from Spreadsheet A. This causes a loop between them where each continuously tries to reference the other and never results in an actual data output.
* There's a delay between the change in the source sheet and the affected sheet. This means that multiple layers of `IMPORTRANGE` across several chained documents can result in long delays between updates of the source sheet and results on the affected sheet.

`IMPORTRANGE` reloads when a document is first opened or opened within the past 5 minutes. As with the chain of updates, this requires `IMPORTRANGE` to "wake up" all documents it imports from.

**Best Practices**

* Understand that documents becoming active may take a while to update. Consider limiting chains of `IMPORTRANGE`.

## Permission & access

Spreadsheets must be explicitly granted permission to pull data from other spreadsheets using `IMPORTRANGE`. The first time the destination sheet pulls data from a new source sheet, the user will be prompted to grant permission.

If you try to use `IMPORTRANGE` to transfer data from a spreadsheet you own, this message appears:

![You need to connect these sheets error message](https://storage.googleapis.com/support-kms-prod/2eU8m1QEvoSdxGESsSE0aHvxKUYfvFr4pAW8)

1. Wait a few seconds after you complete your `IMPORTRANGE` function.
2. A #REF! error opens and prompts, “You need to connect these sheets. Allow Access.”
3. To grant the permission to the source spreadsheet, click **Allow Access**.

If you try to use `IMPORTRANGE` to transfer data from a spreadsheet that you don't own, in a few seconds this message appears:

![You don't have permissions to access that sheet message](https://storage.googleapis.com/support-kms-prod/lvKGHHQVDZetwMA8hw4b58AxrX5AoZoR95XM)

1. Enter your source spreadsheet URL on the browser.
2. Request your access to the spreadsheet.
3. Wait for the owner of the spreadsheet to grant access to you.

Once access is granted, any editor on the destination spreadsheet can use `IMPORTRANGE` to pull from any part of the source spreadsheet. The access remains in effect until the user who granted access is removed from the source. Note that the access granted to the destination sheet counts against the [600-user share limit](https://support.google.com/a/answer/7338880) for the source sheet.

## Performance

`IMPORTRANGE `is an external data function, just like `IMPORTXML` and `GOOGLEFINANCE`. That means it requires an internet connection to work. Sheets must download the entire range to your computer and will be affected by slow network, and is capped at 10MB of received data per request. If you experience slow performance with `IMPORTRANGE`, consider limiting the size of the imported ranges. Alternatively, put summarizing calculations in the source doc, so that less data needs to be transferred to your local Sheet and more of the calculation can be done remotely.

**Tip:** You can use other tools. AppsScript can read from other documents and can be triggered on edit and on a predefined schedule. Connected Sheets has scheduled refresh and is also better built for larger data set loads and imports.

## Usage Limits

![Loading data may take a while because of the large number of requests error message](https://storage.googleapis.com/support-kms-prod/HyhFCYmelulvVt5psMpsMydbpkm9psq5qv46)

When `IMPORTRANGE` functions create too much traffic, you might view the in-cell message “Loading…” with the detailed error message “Error Loading data may take a while because of the large number of requests. Try to reduce the amount of `IMPORTHTML`, `IMPORTDATA`, `IMPORTFEED`, or `IMPORTXML` functions across spreadsheets you’ve created.”

The limits are enforced on the creator of the document. A user must consider the sum of all Import functions usage across all open documents they create. An edit that a collaborator makes could also count against your quota.

To resolve the error message, we recommend users reduce the amount of churn on the import function. For example, if the resolved value for arg in `=IMPORTRANGE(arg)` frequently changes, many external calls may be issued, which may cause the throttle.

## Data Freshness

Google Sheets ensures that Sheets users get the fresh data while they keep their use reasonable. `IMPORTRANGE` automatically checks for updates every hour while the document is open, even if the formula and spreadsheet don’t change. If you delete, read, or overwrite the cells with the same formula, the reload of the functions trigger. If you open and reload the document, it doesn’t trigger a reload on `IMPORTRANGE`.

## Volatility

When you use `IMPORTRANGE`, you may receive an in-cell “#ERROR!” with a detailed error message “Error This function is not allowed to reference a cell with `NOW`, `RAND`, or `RANDBETWEEN`." Import functions can't directly or indirectly reference a volatile function like `NOW`, `RAND`, or `RANDBETWEEN`. This prevents our users’ spreadsheet from overload, as these volatile functions update frequently.

![This function is not allowed to reference a cell with NOW, RAND, or RANDBETWEEN error message](https://storage.googleapis.com/support-kms-prod/LqxvvktwEtFCSFfBMvqmIVtK1MEFvQTCa5xp)

**Tip:** The only exception is made for the `TODAY` function, which is volatile but doesn’t update more than once per day.

We recommend you:

1. Copy the result of those volatile functions.
2. Use **Special paste** ![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Values only**.
3. Reference those static values.

If you do this, all values become static. For example, if you copy and special paste `NOW` results as values, then the values you paste no longer change.

If you still have any questions, you can visit the [Google Docs Editors Help Community](https://support.google.com/docs/community) to seek help.

### See Also

[`IMPORTXML`](https://support.google.com/docs/answer/3093342): Imports data from any of various structured data types including XML, HTML, CSV, TSV, and RSS and ATOM XML feeds.

[`IMPORTHTML`](https://support.google.com/docs/answer/3093339): Imports data from a table or list within an HTML page.

[`IMPORTFEED`](https://support.google.com/docs/answer/3093337): Imports a RSS or ATOM feed.

[`IMPORTDATA`](https://support.google.com/docs/answer/3093335): Imports data at a given url in .csv (comma-separated value) or .tsv (tab-separated value) format.

[Learn how to optimize your data reference.](https://support.google.com/docs/answer/12159115)
