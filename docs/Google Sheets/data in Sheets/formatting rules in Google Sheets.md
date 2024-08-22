## formatting rules in Google Sheets

You can use wildcard characters to match multiple expressions. Wildcard characters can be used with the "Text contains" or "Text does not contain" fields while formatting.

* To match any single character, use a question mark (?). For example, a text rule containing "a?c" would format cells with "abc," but not "ac" or "abbc."
* To match zero (0) or more characters, use an asterisk (\*) . For example, a text rule containing "a\*c" would format cells with "abc," "ac," and "abbc" but not "ab" or "ca."
* To match a question mark or asterisk in text, you can escape the wildcard characters by adding a tilde (\~) in front of them. For example, a text rule containing "a\~?c" would format cells with "a?c" but not "abc" or "a\~?c."

**Notes**:

* To remove a rule, point to the rule and click Remove ![Remove](https://lh3.googleusercontent.com/BZ4bD0q7UU_F0Ljtv_oc3ZHPaPbdFA7Z-6jpNHxajcYmrOj1Jy1izEajlia5i6rJKnCv=w36-h36).
* Rules are evaluated in the order listed. The first rule found to be true will define the format of the cell or range. To reorder rules, click and drag them.
* If you copy and paste from a cell or range that has formatting rules, these rules will be applied when you paste the copied data.
