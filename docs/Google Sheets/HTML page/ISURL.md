# ISURL

Checks whether a value is a valid URL.### Sample Usage

`ISURL("http://www.google.com")`

`ISURL("www.google.com")`

`ISURL("google.com")`

### Syntax

`ISURL(value)`

* `value` - The value to be verified as a URL.

### Notes

* Google Sheets automatically links text entered into a cell if a valid URL is detected. `ISURL` will return `TRUE` in these cases.
* A fully qualified URL is not required. In other words, "http" and "www" are not needed in all cases.
* Valid protocols include ftp, http, https, gopher, mailto, news, telnet, and aim.
* If a URL is flagged as "False," it may use a top-level domain that isn't on our list.

### See Also

[`ISEMAIL`](https://support.google.com/docs/answer/3256503):

This function checks if a value is a valid email address against certain 2-letter country or region codes and top-level domains including:

## Generic top-level domains

* .com
* .org
* .net
* .edu
* .gov
* .info
* .biz
* .name
* .pro

## Sponsored top-level domains

* .aero
* .asia
* .cat
* .coop
* .edu
* .gov
* .int
* .jobs
* .mil
* .museum
* .post
* .tel
* .travel
* .xxx

This list doesn’t include all top-level domains.

If an email is flagged as "False," it may use a top-level domain that isn't on our list.

[`ISERROR`](https://support.google.com/docs/answer/3093349): Checks whether a value is an error.

[`ISTEXT`](https://support.google.com/docs/answer/3093349): Checks whether a value is text.

[`ISBLANK`](https://support.google.com/docs/answer/3093290): Checks whether the referenced cell is empty.

[`HYPERLINK`](https://support.google.com/docs/answer/3093313): Creates a hyperlink inside a cell.
