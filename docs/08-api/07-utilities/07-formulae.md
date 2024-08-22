---
sidebar_position: 7
title: Array of Formulae
---

**Extract all formulae from a worksheet**

```js
var fmla_arr = XLSX.utils.sheet_to_formulae(ws);
```

`XLSX.utils.sheet_to_formulae` generates an array of commands that represent
how a person would enter data into an application.

## Live Preview

After choosing a file, the demo will extract and display all formulae.

```jsx live
function SheetJSFormulaPreview() {
  const [__html, setHTML] = React.useState("Select a file");

  return ( <>
    <pre dangerouslySetInnerHTML={{ __html }}/>
    <input type="file" onChange={async(e) => {
      const wb = XLSX.read(await e.target.files[0].arrayBuffer());
      var res = "";
      wb.SheetNames.forEach((n, idx) => {
        const ws = wb.Sheets[n];
        res += `<b>Sheet #${idx+1} (${n})</b>\n`;
        res += XLSX.utils.sheet_to_formulae(ws).join("\n") + "\n\n";
      });
      setHTML(res);
    }}/>
  </> );
}
```

## Cell Processing

Cells are analyzed in "row-major order" (starting from the first row).

#### Cells without formulae

Cells without formulae are written as `A1-cell-address=value`:

```
A1=1                   // A1 is the numeric value 1
B1=TRUE                // B1 is the logical value TRUE
```

String literals are prefixed with a `'` in accordance with Excel:

```
A5='A4+A3              // A5 is the string "A4+A3"
```

#### Cells with formulae

Cells with formulae are written as `A1-cell-address=formula`:

```
A5=A4+A3               // A5 is a cell with formula =A4+A3
```

#### Array formulae

Array formulae are written as `A1-range=formula`.  They do not include the
displayed curly braces:

```
A4:B4=A2:B2*A3:B3      // A4:B4 array formula {=A2:B2*A3:B3}
```

Single-cell array formulae are written with single-cell ranges:

```
C4:C4=SUM(A2:A3*B2:B3) // C4 array formula {=SUM(A2:A3*B2:B3)}
```

## Demo

This example constructs a workbook including cells with no formulae, cells with
normal formulae, single-cell array formulae and array formulae spanning ranges.

For verification, the button writes a workbook whose formulae can be inspected.

```jsx live
function SheetJSToFormulae() {
  var ws = XLSX.utils.aoa_to_sheet([
    ["A", "B", "C"],
    [1, 2, { t: "n", f: "SUM(A2:B2)" }],
    [3, 4, { t: "n", f: "A3+B3" }]
  ]);
  XLSX.utils.sheet_set_array_formula(ws, "A4:B4", "A2:B2*A3:B3");
  XLSX.utils.sheet_set_array_formula(ws, "C4", "SUM(A2:A3*B2:B3)");
  const generate = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "SheetJSFormulae.xlsx");
  };

  var __html = `\
<i>Values</i>
[
  ["A", "B", "C"],
  [ 1 ,  2],
  [ 3 ,  4]
]
<i>Formulae</i>
C2     =SUM(A2:B2)
C3     =A3+B3
<i>Array Formulae</i>
A4:B4  {=A2:B2*A3:B3}
C4     {=SUM(A2:A3*B2:B3)}`;

  return ( <pre>
    <b>Original worksheet</b><br/>
    <button onClick={generate}><b>Export worksheet to XLSX</b></button>
    <div dangerouslySetInnerHTML={{__html}}/><br/>
    <b>XLSX.utils.sheet_to_formulae(ws).join("\n")</b><br/>
    <br/>{XLSX.utils.sheet_to_formulae(ws).join("\n")}
  </pre> );
}
```
