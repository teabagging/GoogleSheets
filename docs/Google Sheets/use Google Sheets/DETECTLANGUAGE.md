# DETECTLANGUAGE

Identifies the language used in text within the specified range.

### Sample Usage

`DETECTLANGUAGE(A2:A7)`

`DETECTLANGUAGE("Bonjour")`

`DETECTLANGUAGE(A2)`

### Syntax

`DETECTLANGUAGE(text_or_range)`

* `text_or_range` - The text or reference to cells containing text to evaluate.
  * If `text_or_range` is specified as a range, it must be a one-dimensional column range.

### Notes

* If the range specified contains multiple languages, the first text found will be evaluated.

### See Also

[`GOOGLETRANSLATE`](https://support.google.com/docs/answer/3093331): Translates text from one language into another.

### Examples

Accepts both in-cell string and cell reference as the parameters and returns the language code.

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHUwS0tkZUYwY0dfUXJvUFk1cW1xR0E&single=true&gid=0&output=html&widget=true" width="500"></iframe>

Edge cases .

<iframe height="300" src="https://docs.google.com/spreadsheet/pub?key=0As3tAuweYU9QdHUwS0tkZUYwY0dfUXJvUFk1cW1xR0E&single=true&gid=1&output=html&widget=true" width="500"></iframe>
