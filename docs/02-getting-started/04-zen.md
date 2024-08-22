---
title: Zen of SheetJS
sidebar_position: 4
hide_table_of_contents: true
---

SheetJS design and development is guided by a few key principles.

### Data processing should fit in any workflow

The library does not impose a separate lifecycle.  It fits nicely in websites
and apps built using any framework.  The plain JS data objects play nice with
Web Workers and future APIs.

### JavaScript is a powerful language for data processing

The ["Common Spreadsheet Format"](/docs/csf/general) is a simple object
representation of the core concepts of a workbook. [Utilities](/docs/api/utilities/)
provide low-level tools for working with the object.

SheetJS provides convenient methods for processing common JavaScript data
structures. The [Export Tutorial](/docs/getting-started/examples/export)
combines powerful JS Array methods with a network request library to download
data, select the information we want and create a workbook file.

### File formats are implementation details

The parser covers a wide gamut of common spreadsheet file formats to ensure that
"HTML-saved-as-XLS" files work as well as actual XLS or XLSX files.

The writer supports a number of common output formats for broad compatibility
with the data ecosystem.

To the greatest extent possible, data processing code should not have to worry
about the specific file formats involved.

### Data processing should be confidential

All SheetJS-related methods run locally. No data is sent to a third party in
processing data. No telemetry is collected.

SheetJS libraries are regularly used in offline scenarios to process personally
identifiable information (PII) and other classified data.
