---
title: Rational Approximation
hide_table_of_contents: true
---

<head>
  <script src="https://cdn.sheetjs.com/frac-1.1.3/package/dist/frac.min.js"></script>
</head>

The SheetJS `frac` library computes rational approximations to floating point
numbers with bounded denominator. It is a core component in number formatting,
powering "Fraction with up to 1 digit" and related number formats.

The library is also available for standalone use on the SheetJS CDN[^1].

Source code and project documentation are hosted on the SheetJS git server at
https://git.sheetjs.com/sheetjs/frac

## Live Demo

The formatted text is calculated from the specified number format and value.
Please [report an issue](https://git.sheetjs.com/sheetjs/frac/issues) if a
particular format is not supported.

```jsx live
function SheetJSFrac() {
  const [val, setVal] = React.useState(0.6994);
  const [text, setText] = React.useState("");

  if(typeof frac == "undefined") return ( <b>ERROR: Reload this page</b> );

  const fmt = arr => `${(""+arr[1]).padStart(3)} / ${(""+arr[2]).padEnd(3)}`;
  React.useEffect(() => {
    if(typeof frac == "undefined") return setText("ERROR: Reload this page!");
    let v = +val;
    if(!isFinite(v)) return setText(`ERROR: ${val} is not a valid number!`);
    try {
      fmt(frac(val, 9)); setText("");
    } catch(e) { setText("ERROR: " + (e && e.message || e)); }
  }, [val]);
  const g = { backgroundColor:"#C6EFCE", color:"#006100", whiteSpace:"pre-wrap" };
  const b = { backgroundColor:"#FFC7CE", color:"#9C0006" };

  return ( <table>
    <tr><td><b>Number Value</b></td><td colspan="2">
      <input type="text" value={val} onChange={e => setVal(e.target.value)}/>
    </td></tr>
    <tr><td></td><th>Mediant</th><th>Cont</th></tr>
    <tr><td><b>Up to 1 Digit</b></td>
      <td><code style={text?b:g}>{text||fmt(frac(val,9))}</code></td>
      <td><code style={text?b:g}>{text||fmt(frac.cont(val,9))}</code></td>
    </tr>
    <tr><td><b>Up to 2 Digits</b></td>
      <td><code style={text?b:g}>{text||fmt(frac(val,99))}</code></td>
      <td><code style={text?b:g}>{text||fmt(frac.cont(val,99))}</code></td>
    </tr>
    <tr><td><b>Up to 3 Digits</b></td>
      <td><code style={text?b:g}>{text||fmt(frac(val,999))}</code></td>
      <td><code style={text?b:g}>{text||fmt(frac.cont(val,999))}</code></td>
    </tr>
  </table> );
}
```

## API

In the browser, the library exports the `frac` global. In NodeJS, the library
default export is a function.

#### Algorithms

The "Mediant" algorithm (`frac` in the browser; the default export in NodeJS)
calculates the exact solution.

The "Continued Fractions" algorithm (`frac.cont` in the browser; the `cont`
field in the NodeJS export) calculates an approximate solution. Excel uses this
approach since the mediant algorithm has exponential worst-case performance.

:::caution LibreOffice bugs

There are known rounding bugs in LibreOffice[^2] which result in inaccurate
fraction calculations.

The LibreOffice developers believe these numerical errors are desirable:

> "We ignore the last two bits for many stuff to improve the user experience."

It is strongly recommended to use a different spreadsheet tool for accurate data
processing involving fractions and numeric data.

:::

#### Functions

Both functions accept three arguments:

```js
var frac_mediant   = frac(value, denominator, mixed);
var frac_cont = frac.cont(value, denominator, mixed);
```

- `value`: original value
- `D`: maximum denominator (e.g. 99 = "Up to 2 digits")
- `mixed`: if `true`, return a mixed fraction.

The return value is an array with three integers:

```js
var [ int, num, den ] = result;
```

- `int` (first element) represents the integer part of the estimate.
- `num` (second element) is the numerator of the fraction
- `den` (second element) is the positive denominator of the fraction

The estimate can be recovered from the array:

```js
var estimate = int + num / den;
```

If `mixed` is `false`, then `int = 0` and `0` &lt; `den` &leq; `D`

If `mixed` is `true`, then `0` &leq; `num` &lt; `den` &leq; `D`

:::info Negative Values

When `mixed` is true, `int` will be the floor of the result. For example, in

```js
var result = frac( -0.125 , 9, true);
```

the result will be `[ -1, 7, 8 ]`. This is interpreted as

```
-0.125 ~ (-1) + (7/8)
```

:::

[^1]: See https://cdn.sheetjs.com/frac/ for more details.
[^2]: See [issue #83511](https://bugs.documentfoundation.org/show_bug.cgi?id=83511) in the LibreOffice bug tracker.
