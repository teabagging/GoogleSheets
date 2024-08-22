---
title: Workbook Object
sidebar_position: 4
---

SheetJS workbook objects represent collections of worksheets and associated
workbook-level metadata.

For a given workbook object `wb`:

`wb.SheetNames` is an ordered list of the sheets in the workbook.

`wb.Sheets` is an object whose keys are worksheet names (from `SheetNames`) and
whose values are worksheet objects.

`wb.Props` is an object storing the standard properties.  `wb.Custprops` stores
custom properties.  Since the XLS standard properties deviate from the XLSX
standard, XLS parsing stores core properties in both places.

`wb.Workbook` stores [workbook-level attributes](#workbook-level-attributes).

When reading a file, `wb.bookType` is the determined book type.

## File Properties

The various file formats use different internal names for file properties.  The
workbook `Props` object normalizes the names:

<details open>
  <summary><b>File Properties</b> (click to hide)</summary>

| JS Name       | Excel Description              |
|:--------------|:-------------------------------|
| `Title`       | Summary tab "Title"            |
| `Subject`     | Summary tab "Subject"          |
| `Author`      | Summary tab "Author"           |
| `Manager`     | Summary tab "Manager"          |
| `Company`     | Summary tab "Company"          |
| `Category`    | Summary tab "Category"         |
| `Keywords`    | Summary tab "Keywords"         |
| `Comments`    | Summary tab "Comments"         |
| `LastAuthor`  | Statistics tab "Last saved by" |
| `CreatedDate` | Statistics tab "Created"       |

</details>

For example, to set the workbook title property:

```js
if(!wb.Props) wb.Props = {};
wb.Props.Title = "Insert Title Here";
```

Custom properties are added in the workbook `Custprops` object:

```js
if(!wb.Custprops) wb.Custprops = {};
wb.Custprops["Custom Property"] = "Custom Value";
```

Writers will process the `Props` key of the options object:

```js
/* force the Author to be "SheetJS" */
XLSX.write(wb, { Props: { Author: "SheetJS" } });
```

## Workbook-Level Attributes

`wb.Workbook` stores workbook-level attributes.

### Defined Names

`wb.Workbook.Names` is an array of defined name objects. Defined names are
discussed in more detail in ["Defined Names"](/docs/csf/features/names)

### Workbook Views

`wb.Workbook.Views` is an array of workbook view objects which have the keys:

| Key             | Description                                         |
|:----------------|:----------------------------------------------------|
| `RTL`           | If true, display right-to-left                      |

### Miscellaneous Workbook Properties

`wb.Workbook.WBProps` holds other workbook properties:

| Key             | Description                                                |
|:----------------|:-----------------------------------------------------------|
| `CodeName`      | [VBA Workbook Name](/docs/csf/features/vba)                |
| `date1904`      | epoch: 0/false for 1900 system, 1/true for 1904            |
| `filterPrivacy` | Warn or strip personally identifying info on save          |

### Sheet Metadata

`wb.Workbook.Sheets` is an array of sheet metadata objects which have the keys:

| Key             | Description                                         |
|:----------------|:----------------------------------------------------|
| `Hidden`        | [Sheet Visibility](/docs/csf/features/visibility)   |
| `CodeName`      | [VBA Sheet Code Name](/docs/csf/features/vba)       |
