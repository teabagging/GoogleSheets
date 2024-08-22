# Create an in-cell dropdown list

Create dropdown lists in a cell with Google Sheets.

[Computer] [Android][iPhone & iPad]

## Create a dropdown list

![](https://storage.googleapis.com/support-kms-prod/RHtswM7peyT8pzR31uex0rKp2M7dE3gny0hp)

1. In Google Sheets, open a spreadsheet.
2. Select the cell or cells where you want to create a dropdown list.
3. Select an option:
   * Enter “@.” In the Menu, under the components section, click “**Dropdowns**."
     * **Tip:** You can also insert preset dropdowns for use cases such as "Project status" or "Priority."
   * At the top, click **Insert **![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Dropdown**.
   * Click **Data **![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Data validation **![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) Add rule ![](https://storage.googleapis.com/support-kms-prod/v2t6AeoMjLXpNfElQLXOgHndWIG4KVVP1DFU).
   * Right click on a cell ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Dropdown**.
4. On the Data validation rules panel, under "Criteria," select an option:
   * **Dropdown from a range:** Choose the cells to include in the list.
   * **Dropdown:** Enter the dropdown value.
     * Click **Add another item** to add additional dropdown values.
       * Optional: To allow multiple selections in your drop-down menus, select **Allow multiple selections**.
   * **Tip: **Remove any leading/trailing whitespace in dropdown options to allow multiple dropdown selections.
5. Optional: If you enter data in a cell that doesn’t match an item on the list, it is rejected. If you want people to be able to enter items not from the list:
   1. Click **Advanced options**.
   2. Under "If the data is invalid:," select **Show a warning**.
6. Click **Done**.

## Turn dropdown chip suggestions on or off

1. In Google Sheets, open a spreadsheet.
2. At the top, click **Tools** ![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Suggestion controls** ![and then](https://lh3.googleusercontent.com/3_l97rr0GvhSP2XV5OoCkV2ZDTIisAOczrSdzNCBxhIKWrjXjHucxNwocghoUa39gw=w36-h36) **Enable dropdown chip suggestions**.

## Create a dropdown list on cells with existing data

![](https://storage.googleapis.com/support-kms-prod/8KLVEs2b853PjRGaFwVUriCmzaQh0x9KtPen)

1. In Google Sheets, open a spreadsheet.
2. Select the cell or cells with existing data.
3. Right-click ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Dropdown**.
   1. If a selected cell includes an existing dropdown, other cell values are appended to the selected dropdown list rule.
   2. Dropdown options are created in the order of ranges that are selected. The order of options goes down columns first, then across rows.
   3. Optional: To add more dropdown values:
      1. Go to the Data validation rules panel.
      2. Under "Criteria," click **Add another item**.
4. Optional: If you enter data in a cell that doesn’t match an item on the list, it is rejected. If you want people to be able to enter items not from the list:
   1. Click **Advanced options**.
   2. Under "If the data is invalid:," select **Show a warning**.
5. Click **Done**.

## Change or delete a dropdown list

**Important:** If you delete a value with an assigned color from the criteria source range when the dropdown is populated from a range, the value and color will still appear under criteria, but as uneditable. To remove the value from the list, change the source range or any other item’s color.

1. In Google Sheets, open a spreadsheet.
2. Select the cell or cells you want to change, then select an option:
   * Click **Data **![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Data validation**.
   * Click the dropdown ![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) Edit button ![](https://storage.googleapis.com/support-kms-prod/Sdb16FcmyXPyT8d5uEImb7HxNpaoAb3bcvDt).
3. Edit the dropdown list:
   * To change the options listed, edit the items under "Criteria."
   * To delete a list, select an option:
     * Click **Remove Rule**.
     * If cells are empty, select the cells. Then, press the **Backspace** key.
     * If cells are empty, select the cells. Then, click **Edit **![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Delete **![and then](https://lh3.googleusercontent.com/QbWcYKta5vh_4-OgUeFmK-JOB0YgLLoGh69P478nE6mKdfpWQniiBabjF7FVoCVXI0g=h36) **Values**.
   * To change the display style: Click **Advanced options**. Then, under "Display Style," select either:
     * **Chip**
     * **Arrow**
     * **Plain text**
4. Click **Done**. If you change the content of the range you select, the changes are made in the list automatically.
