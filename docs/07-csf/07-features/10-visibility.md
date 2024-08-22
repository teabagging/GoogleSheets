---
title: Sheet Visibility
sidebar_position: 10
---

<details>
  <summary><b>File Format Support</b> (click to show)</summary>

By default, all sheets in a workbook are "Visible". The standard "Hidden" state
is controlled through the context menu in the sheet tab bar. The "Very Hidden"
state is controlled through the "Visibility" property in the VBA editor.

| Formats   | Hidden | Very Hidden |
|:----------|:------:|:-----------:|
| XLSX/XLSM |   ✔    |      ✔      |
| XLSB      |   ✔    |      ✔      |
| XLML      |   ✔    |      ✔      |
| BIFF8 XLS |   ✔    |      ✔      |
| BIFF5 XLS |   ✔    |      ✔      |

</details>

Excel can hide sheet tabs from the lower tab bar. The sheet data is stored in
the file but the tabs are not displayed until they are unhidden.

Standard "hidden" sheets are listed in the "Unhide" menu.

Excel "very hidden" sheets cannot be revealed in the menu. They are only visible
in the Visual Basic Editor!

## Storage

The visibility setting is stored in the `Hidden` property of the corresponding
[metadata in the `wb.Workbook.Sheets` array](/docs/csf/book#sheet-metadata)

The recognized values are listed below:

| Value | Definition  | VB Editor "Visible" Property |
|:-----:|:------------|:-----------------------------|
|   0   | Visible     | `-1 - xlSheetVisible`        |
|   1   | Hidden      | ` 0 - xlSheetHidden`         |
|   2   | Very Hidden | ` 2 - xlSheetVeryHidden`     |

If the respective Sheet entry does not exist or if the `Hidden` property is not
set, the worksheet is visible.

### Parsing

Since worksheet visibility is stored in the workbook, both the workbook object
and the sheet name must be known to determine visibility setting.

```js
function get_sheet_visibility(workbook, sheet_name) {
  // if the metadata does not exist for the sheet, the sheet is visible
  if(!workbook.Workbook) return 0;
  if(!workbook.Workbook.Sheets) return 0;

  var idx = workbook.SheetNames.indexOf(sheet_name);
  if(idx == -1) throw new Error(`Sheet ${sheet_name} missing from workbook`);

  var meta = workbook.Workbook.Sheets[idx];
  return meta && meta.Hidden || 0;
}
```

Typically the distinction between "hidden" and "very hidden" is not relevant for
applications. The values were chosen to make logical negation work as expected:

```js
function is_sheet_visible(workbook, sheet_name) {
  return !get_sheet_visibility(workbook, sheet_name); // true if visible
}
```

### Writing

When assigning, the entire workbook metadata structure should be tested and
constructed if necessary:

```js
function set_sheet_visibility(workbook, sheet_name, Hidden) {
  var idx = workbook.SheetNames.indexOf(sheet_name);
  if(idx == -1) throw new Error(`Sheet ${sheet_name} missing from workbook`);

  // if the metadata does not exist for the sheet, create it
  if(!workbook.Workbook) workbook.Workbook = {};
  if(!workbook.Workbook.Sheets) workbook.Workbook.Sheets = [];
  if(!workbook.Workbook.Sheets[idx]) workbook.Workbook.Sheets[idx] = {};

  // set visibility
  workbook.Workbook.Sheets[idx].Hidden = Hidden;
}
```

## Demo

[This test file](pathname:///files/sheet_visibility.xlsx) has three sheets:

- "Visible" is visible
- "Hidden" is hidden
- "VeryHidden" is very hidden

![Screenshot](pathname:///files/sheet_visibility.png)

The live demo fetches the test file and displays visibility information.

```jsx live
function Visibility(props) {
  const [wb, setWB] = React.useState({SheetNames:[]});
  const [sheets, setSheets] = React.useState([]);
  const vis = [ "Visible", "Hidden", "Very Hidden" ];

  React.useEffect(() => { (async() => {
    const f = await fetch("/files/sheet_visibility.xlsx");
    const ab = await f.arrayBuffer();
    const wb = XLSX.read(ab);
    setWB(wb);
    /* State will be set to the `Sheets` property array */
    setSheets(wb.Workbook.Sheets);
  })(); }, []);

  return (<table>
    <thead><tr><th>Name</th><th>Value</th><th>Hidden</th></tr></thead>
    <tbody>{wb.SheetNames.map((n,i) => {
      const h = ((((wb||{}).Workbook||{}).Sheets||[])[i]||{}).Hidden||0;
      return ( <tr key={i}>
        <td>{n}</td>
        <td>{h} - {vis[h]}</td>
        <td>{!h ? "No" : "Yes"}</td>
      </tr> );
    })}</tbody></table>);
}
```

:::info pass

The live codeblock tests for visibility with:

```js
const h = ((((wb||{}).Workbook||{}).Sheets||[])[i]||{}).Hidden||0;
```

With modern JS, this can be written as

```js
const h = wb?.Workbook?.Sheets?.[i]?.Hidden||0;
```

:::

