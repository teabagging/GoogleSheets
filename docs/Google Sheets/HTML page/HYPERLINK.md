# HYPERLINK

Creates a hyperlink inside a cell.

### Sample Usage

`HYPERLINK("http://www.google.com/","Google")`

### Syntax

`HYPERLINK(url, [link_label])`

* `url` - The full URL of the link location enclosed in quotation marks, or a reference to a cell containing such a URL.
  * Only certain link types are allowed. `http://`, `https://`, `mailto:`, `aim:`, `ftp://`, `gopher://`, `telnet://`, and `news://` are permitted; others are explicitly forbidden. If another protocol is specified, `link_label` will be displayed in the cell, but will not be hyperlinked.
  * If no protocol is specified, `http://` is assumed, and is prepended to `url`.
* `link_label` - **[** OPTIONAL - `url` by default **]** - The text to display in the cell as the link, enclosed in quotation marks, or a reference to a cell containing such a label.
  * If `link_label` is a reference to an empty cell, `url` will be displayed as a link if valid, or as plain text otherwise.
  * If `link_label` is the empty string literal (""), the cell will appear empty, but the link is still accessible by clicking or moving to the cell.

### Notes

* Failure to enclose `url` (or `link_label`, if provided) in quotation marks will cause an error.
* Google Sheets automatically converts most valid URL types when typed into a cell without the need to use this function.

### Examples

Creates a hyperlink inside the cell for specified `cell_text`.

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdDUtS3lESlJpMzU1d0t1NHUxX25VelE&single=true&gid=0&output=html&widget=true" width="500"></iframe>
