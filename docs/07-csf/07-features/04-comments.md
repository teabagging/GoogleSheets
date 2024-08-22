---
title: Cell Comments and Notes
sidebar_label: Cell Comments
sidebar_position: 4
---

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

Comments and Notes have evolved over the years.

Excel 2.0 - '95 "Notes" were displayed in a master list.

Excel '97 - 2019 "Comments" float over the sheet and support styling.

Excel 365 introduced "Threaded Comments" which do not support rich text but do
allow users to "reply". The original "Comments" were renamed to "Notes".

| Formats           | Notes | Comment | Threaded |
|:------------------|:-----:|:-------:|:--------:|
| XLSX / XLSM       |   ✕   |    ✔    |    ✔     |
| XLSB              |   ✕   |    R    |    R     |
| NUMBERS           |   ✕   |    ✕    |    ✔     |
| XLS (BIFF8)       |   ✕   |    ✔    |    ✕     |
| XLML              |   ✕   |    ✔    |    ✕     |
| ODS / FODS / UOS  |   ✕   |    ✔    |    ✕     |
| SYLK              |   ✔   |    ✕    |    ✕     |
| XLS (BIFF5)       |   ✔   |    ✕    |    ✕     |
| XLS (BIFF 2/3/4)  |   ✔   |    ✕    |    ✕     |

X (✕) marks features that are not supported by the file formats. For example,
the NUMBERS file format supports plaintext threaded comments but does not
support Excel styled comments or Excel legacy notes.

The letter R (R) marks features parsed but not written in the format.

:::note pass

[SheetJS Pro](https://sheetjs.com/pro) supports comment rich text and styling.

:::

</details>

Comments and notes are cell annotations. Cells with comments or notes are marked
with a small triangle or `¬` in the upper-right corner.

Excel notes are standalone text boxes with adjustable background colors and
support for rich text. Historically people "replied" to comments by adding text
to the end of existing comments.

Excel comments are simple text boxes that allow users to enter plain text. Users
can reply to comments.

The following screenshot shows a spreadsheet with comments and a note.

- The note is associated with cell A1 (the cell with the red triangle). It has
a green gradient background fill.
- The comments are associated with cell A2 (the cell with the blue `¬`). There
are 2 comments from different authors. A "Reply" box appears below the thread.

![Excel comments and notes](pathname:///comments/types.png)

:::info pass

Google Sheets "notes" do not currently support rich text or background colors.

Apple Numbers supports "comments" but does not support "notes".

:::

## Basic Structure

Cell comments are objects stored in the `c` array of cell objects.

The comment content is split into parts based on the comment author.

The `a` field of each comment part is the author of the comment and the `t`
field is the plain text representation.

For example, the following snippet appends a cell comment into cell `A1`:

```js
/* get cell A1, creating an empty cell if necessary */
var cell = ws["A1"];
if(!ws["A1"]) ws["A1"] = { t: "z" };

/* create comment array if it does not exist */
if(!cell.c) cell.c = [];

/* create a comment part */
var comment_part = {
  a: "SheetJS",
  t: "I'm a little comment, short and stout!"
};

/* Add comment part to the comment array */
cell.c.push(comment_part);
```

:::note XLSB Author limits

XLSB enforces a 54 character limit on the Author name.  Names longer than 54
characters may cause issues with other formats.

:::

## Demos

#### Export

<details open>
  <summary><b>Live Export Example</b> (click to hide)</summary>

This example creates a small worksheet with a comment in cell A1:

```jsx live
function SheetJSComments1() {
  return (<button onClick={() => {
    var ws = XLSX.utils.aoa_to_sheet([["SheetJS"]]);

    if(!ws.A1.c) ws.A1.c = [];
    ws.A1.c.push({a:"SheetJS", t:"I'm a little comment, short and stout!"});

    var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSComments1.xlsx");
  }}>Click me to generate a sample file</button>);
}
```

</details>

#### Import

<details>
  <summary><b>Live Import Example</b> (click to show)</summary>

This example displays every comment in the workbook:

```jsx live
function SheetJSParseComments(props) {
  const [__html, setHTML] = React.useState("");

  return ( <>
    <input type="file" onChange={async(e) => {
      /* parse workbook */
      const file = e.target.files[0];
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);

      const html = [];
      wb.SheetNames.forEach(n => {
        var ws = wb.Sheets[n]; if(!ws) return;
        var ref = XLSX.utils.decode_range(ws["!ref"]);
        for(var R = 0; R <= ref.e.r; ++R) for(var C = 0; C <= ref.e.c; ++C) {
          var addr = XLSX.utils.encode_cell({r:R,c:C});
          if(!ws[addr] || !ws[addr].c) continue;
          var comments = ws[addr].c;
          if(!comments.length) continue;
          var threaded = !!comments[0].T;
          var msg = comments.map(c => c.t).join(threaded ? "\n" : "");
          console.log(comments);
          html.push(`${n}:${addr}:${+!!threaded}:${msg}`);
        }
      });
      setHTML(html.join("\n"));
    }}/>
    <pre dangerouslySetInnerHTML={{ __html }}/>
  </> );
}
```

</details>

## Visibility

The `hidden` property of the comment block indicates comment visibility. If set
to `true`, the comment will not be visible until users hover over the comment.

```js
if(!cell.c) cell.c = [];
// highlight-next-line
cell.c.hidden = true;
cell.c.push({a:"SheetJS", t:"This comment will be hidden"});
```

<details>
  <summary><b>Live Example</b> (click to show)</summary>

The following demo creates a worksheet with two comments. The comment in cell A1
will be visibile and the comment in cell A2 will be hidden.

```jsx live
function SheetJSComments2() {
  return (<button onClick={() => {
    var ws = XLSX.utils.aoa_to_sheet([["SheetJS"], [5433795]]);

    if(!ws.A1.c) ws.A1.c = [];
    ws.A1.c.push({a:"SheetJS", t:"This comment is visible"});

    if(!ws.A2.c) ws.A2.c = [];
    ws.A2.c.hidden = true;
    ws.A2.c.push({a:"SheetJS", t:"This comment will be hidden"});

    var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSComments2.xlsx");
  }}>Click me to generate a sample file</button>);
}
```

</details>

## Threaded Comments

Threaded comments are plain text comment snippets with author metadata and
parent references. They are supported in XLSX, XLSB, and NUMBERS files.

To mark a comment as threaded, each comment part must have a true `T` property:

```js
if(!cell.c) cell.c = [];

var part1 = {
  a:"SheetJS",
  t:"This is threaded",
// highlight-next-line
  T: true
};
cell.c.push(part1);

var part2 = {
  a:"JSSheet",
  t:"This is also threaded",
};
// The next line uses Object Spread syntax to add T: true
// highlight-next-line
cell.c.push({ ...part2, T: true});
```

There is no Active Directory or Office 365 metadata associated with authors.

<details open>
  <summary><b>Live Example</b> (click to hide)</summary>

```jsx live
function SheetJSThreadedComments() {
  return ( <button onClick={() => {
    var ws = XLSX.utils.aoa_to_sheet([["SheetJS"], [5433795]]);

    /* normal comment */
    if(!ws.A1.c) ws.A1.c = [];
    ws.A1.c.push({a:"SheetJS", t:"This is not threaded"});

    /* threaded comment */
    if(!ws.A2.c) ws.A2.c = [];

    /* add parts */
    ws.A2.c.push({a:"SheetJS", t:"This is threaded", T: true});

    var part = {a:"JSSheet", t:"This is also threaded"};
    ws.A2.c.push({...part, T: true});

    /* create workbook and export */
    var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSThreadedComments.xlsx");
  }}>Click me to generate a sample file</button> );
}
```

</details>
