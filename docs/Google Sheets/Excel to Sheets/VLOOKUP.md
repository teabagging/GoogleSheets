# VLOOKUP

If you have known information on your spreadsheet, you can use `VLOOKUP` to search for related information by row. For example, if you want to buy an orange, you can use `VLOOKUP` to search for the price.

![VLOOKUP formula example](https://lh3.googleusercontent.com/VOvPOX4k-wVnkNEPEX_HcOAjOu-xMtEdwAfK_CrcNVfBVVRNDBocpF2C2T5ZvYX2yytH=w761)

[VLOOKUP for BigQuery]

### Syntax

=VLOOKUP(`search_key,``range, index,` [`is_sorted`])

### **Inputs**

1. **`search_key`:** The value to search for in the first column of the range.
2. **`range`:** The upper and lower values to consider for the search.
3. **`index`:** The index of the column with the return value of the range. The index must be a positive integer.
4. **`is_sorted`:** Optional input. Choose an option:
   * `FALSE` = Exact match. This is recommended.
   * `TRUE`= Approximate match. This is the default if `is_sorted` is unspecified.
     **Important:** Before you use an approximate match, sort your search key in ascending order. Otherwise, you may likely get a wrong return value. [Learn why you may encounter a wrong return value](https://support.google.com/docs/answer/3093318?hl=en#Vlookupexactorapproximatetitle).

### Return value

The first matched value from the selected `range`.

[Technical details:]

## Basic VLOOKUP examples:

### **VLOOKUP on different search keys**

Use `VLOOKUP` to find the price of an Orange and Apple.

![VLOOKUP on different search keys example](https://lh3.googleusercontent.com/nbSF_Z-8BJm1TYvGotGscAJxvvP4MRLr-uZwUoA6nJb3-Yv9LOH3BQpofd65Acgj060=w706)

[Try it out](https://docs.google.com/spreadsheets/d/1NrLakbxIxEqvu31Pgzg5HNRo6rhXlvFSiBkEXI7I4ks/copy#gid=1562879455)

[Explanation:]

### VLOOKUP on different column indexes

Use `VLOOKUP` to find the quantity of Oranges in the second index column.

![VLOOKUP on different column indexes example](https://lh3.googleusercontent.com/X0T3U0COy9qgkVzJugyITBwH-2W2vH7Qng4yVh_LiL7mm145NFA4fTG1ul-gEbVQptA=w800)

[Try it out](https://docs.google.com/spreadsheets/d/1NrLakbxIxEqvu31Pgzg5HNRo6rhXlvFSiBkEXI7I4ks/copy#gid=2055913414)

[Explanation:]

### [VLOOKUP exact match or approximate match]

* Use `VLOOKUP` exact match to find an exact ID.
* Use `VLOOKUP` approximate match to find the approximate ID.

![VLOOKUP exact match or approximate match example](https://lh3.googleusercontent.com/VSFyToHtnKjpYO_i2kn0xPSBgu7063rLobXCdVitBmaVXb01SZdLMfxizkgHIQ8_iR5Q=w800)

[Try it out](https://docs.google.com/spreadsheets/d/1NrLakbxIxEqvu31Pgzg5HNRo6rhXlvFSiBkEXI7I4ks/copy#gid=61262510)

[Explanation:]

## Common VLOOKUP applications

### [Replace error value from VLOOKUP]

You may want to replace an error value returned by `VLOOKUP` when your search key doesn’t exist. In this case, if you don’t want #N/A, you can use `IFNA` functions to replace #N/A. [Learn more about IFNA](https://support.google.com/docs/answer/3093318?hl=en#vlookupifna).

![Replace error value from VLOOKUP example](https://lh3.googleusercontent.com/khBezbYJdKWQn7RJM_g7G5z0ZqC09NozbEdrhTVA1vlRUymhxn3anEaA8zJHEMV2H8k=w800)

[Try it out](https://docs.google.com/spreadsheets/d/1NrLakbxIxEqvu31Pgzg5HNRo6rhXlvFSiBkEXI7I4ks/copy#gid=361679153)


| Originally,`VLOOKUP` returns #N/A because the search key “Pencil” does not exist in the “Fruit” column.`IFNA` replaces #N/A error with the second input specified in the function. In our case, it’s “NOT FOUND.” | =IFNA(VLOOKUP(G3, B4:D8, 3, FALSE),"NOT FOUND")Return value = “NOT FOUND” |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |

**Tip:** If you want to replace other errors such as #REF!, [learn more about IFERROR](https://support.google.com/docs/answer/3093304).

### VLOOKUP with multiple criteria

`VLOOKUP` can’t be directly applied on multiple criteria. Instead, create a new helper column to directly apply `VLOOKUP` on multiple criteria to combine multiple existing columns.

![VLOOKUP with multiple criteria example](https://lh3.googleusercontent.com/3K_fM8i53zmH8r6HXpBERQXjP94kWbuXPWeB9rW4GU9d4LAZh8UPvRFtEPBXvMFv3g=w800)

[Try it out](https://docs.google.com/spreadsheets/d/1NrLakbxIxEqvu31Pgzg5HNRo6rhXlvFSiBkEXI7I4ks/copy#gid=714315357)


| 1. You can create a Helper column if you use "&" to combine First Name and Last Name. | =C4&D4 and drag it down from B4 to B8 gives you the Helper column. |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 2. Use cell reference B7, JohnLee, as the search key.                                 | =VLOOKUP(B7, B4:E8, 4, FALSE)Return value = "Support"              |

### VLOOKUP with wildcard or partial matches

In `VLOOKUP`, you can also use wildcards or partial matches. You can use these wildcard characters:

* A question mark "?" matches any single character.
* An asterisk "\*" matches any sequence of characters.

To use wildcards in `VLOOKUP`, you must use an exact match: "`is_sorted` = `FALSE`".

![VLOOKUP with wildcard example](https://lh3.googleusercontent.com/Q7wQop75P9Qpl6jlZBAiZVKwwH7Jh-EicmKhxVOtyjRNdTeu_GLRN_2tK5MOohDS8fg=w800)

[Try it out](https://docs.google.com/spreadsheets/d/1NrLakbxIxEqvu31Pgzg5HNRo6rhXlvFSiBkEXI7I4ks/copy#gid=562610592)


| "St\*" is used to match anything that starts with "St" regardless of the number of characters, such as "Steve", "St1", "Stock", or "Steeeeeeve". | =VLOOKUP("St\*", B4:D8, 3, FALSE)Return value = "Marketing" |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
