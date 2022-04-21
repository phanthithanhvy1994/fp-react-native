export const Message = {
  common: {
    comMSG001: 'is required',
    comMSG002: 'No result found',
    comMSG003: 'are required',
  },
  CONFIRM_CLOSE_ADD_ITEM: 'Are you sure you want to discard ALL changes?',
  Material: { matMSG001: 'Maxlenght is over' },
  NO_RECORD_EDIT_TABLE: 'Please add items to the list.',
  NO_RECORD_LIST_TABLE: 'No result found',
  FIELD_REQUIRED: 'is required',
  DELETE_CONFIRM: 'are you sure?',
  DELETE_CONFIRM_INSTANCE: 'Are you sure want to delete this %INSTANCE%?',
  DELETED_MSG_INSTANCE: 'The %INSTANCE% has been deleted',
  DELETE_CONFIRM_TITLE: 'Confirm Delete',
  CLOSE_STATUS_CONFIRM_TITLE: 'Confirm Close',
  CLOSE_STATUS_CONFIRM_INSTANCE:
    'Are you sure want to close this %INSTANCE%? You can not edit after closing',
  REJECT_TITLE: 'Reject',
  REJECT_MESSAGE_TITLE: 'Reject message',
  CANCEL_TITLE: 'Cancel',
  CANCEL_MESSAGE_TITLE: 'Cancel message',
  ERROR: 'Error',
  ERROR_PAGE: '500 - Our server is on a break!',
  NOT_FOUND_PAGE: '404 - Sorry, page not found!',
  warning: 'Warning',
  CONFIRM: 'Confirm',
  INFORMATION: 'Information',
  CHOOSE_AT_LEAST_ONE: 'Please select at least one item!',
  NOT_EDIT: 'Branch BOM cannot edit',
  NOT_DELETE: 'Branch BOM cannot delete',
  INVALID_NUMBER: '%fieldName% can only contain numbers',
  NOTIFICATION: 'Notification',
  SYSTEM_ERROR: 'System error occur',
  ADDED_SUCCESSFULLY: 'Added Successfully',
  DETAILS_REQUIRED: 'Details Information is required.',
  NO_ITEM_FOUND: 'No item found!',
  CHANGED_SUCCESSFULLY: 'Changed Successfully',
  NOTHING_CHANGED: 'Nothing change',  SAVED_DATA_SUCCESSFULLY: 'Save data successfully!',
  PURCHASE_ORDER: {
    DRAFT_ORDER_SUCCESSFULLY: 'The PO %poNo% has been created.',
    DRAFT_UPDATE_ORDER_SUCCESSFULLY: 'The PO %poNo% has been saved.',
    SUBMIT_ORDER_SUCCESSFULLY: 'The PO %poNo% has been submitted.',
    CLEAR_ALL_DETAILS_LIST:
      'Are you sure you want to change the [Order Type]? All items below will be removed.',
    REFRESH_ALL_DETAILS_LIST:
      'Are you sure you want to reload the list? All items below will be refreshed.',
    OVER_MAX_VOLUMN: 'Item Volumn can not be greater than Max volumn',
    OVER_MAX_AMOUNT: 'Total amount can not be greater than: ',
    CLOSED_PO_SUCCESSFULLY: 'This PO has been closed.',
    REJECTED_PO_SUCCESSFULLY: 'This PO has been rejected.',
    APPROVED_PO_SUCCESSFULLY: 'The PO %PO_NO% has been approved.',
    DELIVERY_DATE_EMPTY: 'Delivery Date is required.',
    QUANTITY_EMPTY: 'Quantity is required.',
    SUBMIT_CONFIRM: 'Are you sure want to submit this PO%PO_NO%?',
    CLOSE_CONFIRM: 'Are you sure want to close this PO: <No.%PO_NO%>?',
    APPROVE_CONFIRM: 'Are you sure want to approve this PO: <No.%PO_NO%>?',
  },
  BRANCH_BOM: {
    DELETE_CONFIRM: 'Are you sure to delete this Branch BOM: <BOM Name> <BOM Code>?',
    ACTIVE_CONFIRM: 'Are you sure to active this Branch BOM: <BOM Name> <BOM Code>?',
    IN_ACTIVE_CONFIRM: 'Are you sure to Inactive this Branch BOM: <BOM Name> <BOM Code>?',
    NOTHING_CHANGED: 'There is nothing changed.',
    CONFIRM: 'The Branch BOM: <BOM Name> <BOM Code> has been confirmed.',
    NOT_CONFIRM:
      'This Branch BOM <BOM Name> <BOM Code> cannot be confirmed with validation date passed.',
    UN_CONFIRM: 'The Branch BOM: <BOM Name> <BOM Code> has been unconfirmed.',
    CLOSE_CONFIRM: 'Are you sure to close this Branch BOM: <BOM Name> <BOM Code>?',
    SAVE_DRAFT_CONFIRM: 'The Branch BOM: <BOM Name> <BOM Code> has been created.',
    UPDATE_BRANCH_BOM: 'The Branch BOM: <BOM Name> <BOM Code> has been saved.',
    FIIELD_SIZE:
      '<Field Name> should not exceed the maxlength than <Field size>.',
    VALIDATE_TABLE_GRID: 'Details Information is required',
    CONFIRM_CHANGE_LEVEL:
      'Data from "Detail Information" will be reset when other Level is selected.',
  },
  BRANCH_BOM_PRICE: {
    MAX_LENGTH: 'Price List Name should not exceed the maxlength than 256.',
    PRICE_LIST_MAX_LENGTH:
      'Price List should not exceed the maxlength than 256.',
    SAVE_SUCCESS: 'The Price List <priceListName> has been saved.',
    ADD_DUPPLICATED: 'The Price List <priceListName> has been created.',
    UPDATE_SUCCESS: 'The Price List <priceListName> has been changed.',
    DATE_VALIDATION: 'The End Date must be later than Start Date.',
    NOTHING_CHANGED: 'There is nothing changed.',
    EDIT_DUPPLICATED: 'Existed a Price List having the same value.',
    EMPTY_PRICE: 'Please input price!',
    EMPTY_START_DATE: 'Please input Start Date!',
    EMPTY_END_DATE: 'Please input End Date!',
    VALIDATE_DATE: 'Please input End Date > Start Date!',
    CAN_NOT_ACTIVATE:
      'Can not activate this Price List. Price List Items are empty!',
    CAN_NOT_CONFIRM:
      'Can not confirm this Price List. Price List Items are empty!',
    INVALID_ITEM_WITH_CATEGORY:
      'Can not add Branch BOM Code <%BRANCH_BOM_CODE%> to this Price List!',
    CHILDREN_PRICE_NOT_EQUAL_PARENT_PRICE:
      'Total price in item is not equal to the price of Branch BOM level 1',
    ERROR_DUPPLICATE: 'RET_W030305_BP',
    ACTIVE_CONFIRM: 'Are you sure want to active this Price List: <%PR%>?',
    INACTIVE_CONFIRM: 'Are you sure want to inactive this Price List: <%PR%>?',
    CLOSE_CONFIRM: 'Are you sure want to close this Price List: <%PR%>?',
    PR_CONFIRM: 'Are you sure want to confirm this Price List: <%PR%>?',
    SAVE_CONFIRM: 'Are you sure want to save this Price List: <%PR%>?',
    CREATE_SAVE_CONFIRM: 'Are you sure want to save this Price List?',
  },
  BRANCH_BOM_GROUP: {
    ADD_SUCCESSFUL: 'The Branch BOM Group <bomGroupName> <bomGroupCode> has been created.',
    UPDATE_SUCCESSFUL: 'The Branch BOM Group <bomGroupName> <bomGroupCode> has been changed.',
    DELETE: 'Are you sure to delete this Branch BOM Group: <bomGroupName> <bomGroupCode>?',
    NOT_EDIT: 'The Branch BOM Group: <bomGroupName> <bomGroupCode> cannot be edited because it was added to a Branch BOM.',
    NOT_DELETE: 'The Branch BOM Group: <bomGroupName> <bomGroupCode> cannot be deleted because it was added to a Branch BOM. ',
    CONFIRM_CHANGE_LEVEL: 'Data from "Detail Information" will be reset when other Level is selected.',
  },
  UPLOAD_FILE: {
    FILE_SIZE: 'Maximum upload size: 4MB',
    FILE_TYPE:
      'Only files with the following extensions are allowed: png, jpg, jpeg.',
  },
  RETURN_REQUEST: {
    DRAFT_RETURN_SUCCESSFULLY:
      'The Return Request No. %rrNo% has been created.',
    SUBMIT_RETURN_SUCCESSFULLY:
      'The Return Request No. %rrNo% has been submitted.',
    DRAFT_RETURN_SAVED_SUCCESSFULLY:
      'The Return Request No. %rrNo% has been saved.',
    APPROVED_RETURN_SUCCESSFULLY:
      'The Return Request %rrNo% has been approved.',
    DELETED_RETURN_SUCCESSFULLY: 'The Return Request %rrNo% has been deleted.',
    REJECTED_RETURN_SUCCESSFULLY:
      'The Return Request %rrNo% has been rejected.',
    CLOSE_RETURN_CONFIRM:
      'Are you sure you want to close this Return Request: %rrNo%? You can not edit after closing.',
    CLOSE_RETURN_SUCCESSFULLY: 'The Return Request %rrNo% has been closed.',
    CONFIRM_PICK_UP_SUCCESSFULLY: 'Confirmed Pick Up successfully.',
    OVER_STOCK_INFO: 'Item %itemNo% is over stock in inventory.',
    SYSTEM_ERROR: 'System error occur',
    SELECT_AT_LEAST_ONE_RETURN: 'Please select at least one item to return.',
    PLEASE_INPUT_GOODS_RECEIPT_NO: 'Please input the Goods Receipt No.',
    CONFIRM_CHANGE_GOODS_RECEIPT_NO:
      'Are you sure you want to change the Goods Receipt No? All items below will be removed.',
    CONFIRM_RELOAD_ITEMS_BY_GOODS_RECEIPT_NO:
      'Are you sure you want to reload Goods Receipt? All data will be refreshed.',
    NOT_FOUND_GOODS_RECEIPT_NO: 'The Goods Receipt No. %grNo% not found.',
    CLEAR_ALL_DETAILS_LIST_WHEN_CHANGE_RETURN_TO:
      'Are you sure you want to change the [Return To]? All items below will be removed.',
    CLOSE_CONFIRM: 'Are you sure want to close this Return Request: No.%rrNo%?',
    SUBMIT_CONFIRM: 'Are you sure want to submit this Return Request%rrNo%?',
    APPROVE_CONFIRM:
      'Are you sure want to approve this Return Request: No.%rrNo%?',
    PICKUP_CONFIRM:
      'Are you sure want to confirm pick up this Return Request: No.%rrNo%?',
  },
  REDIRECT_WITHOUT_SAVING:
    'Your unsaved changes will be lost. Are you sure you want to leave this page?',
  SAVE_UNSUCCESSFULLY: 'Error occur. Saving unsuccessfully.',
  DELETE_UNSUCCESSFULLY: 'System error occur. Delete unsuccessfully.',
  SCRAP_STOCK: {
    SAVE_DRAFT_CONFIRM: 'The Scrap Stock: No.%SSNo% has been saved.',
    SAVE_CONFIRM: 'The Scrap Stock: No.%SSNo% has been submitted.',
    CLOSE_CONFIRM: 'Are you sure to close this Scrap Stock: No.%SSNo%?',
    SUBMIT_CONFIRM: 'Are you sure to submit this Scrap Stock: No.%SSNo%?',
    CREATE_SUBMIT_CONFIRM: 'Are you sure to submit this Scrap Stock?',
    APPROVE_CONFIRM: 'Are you sure to approve this Scrap Stock: No.%SSNo%?',
    APPROVE: 'The Scrap Stock No.%SSNo% has been approved.',
    REJECT: 'The Scrap Stock No.%SSNo% has been rejected.',
    AVAILABLE_CONFIRM:
      'No available stock in the inventory. The Scrap Stock <No.%SSNo%> cannot be submitted.',
    REQUIRED_FLD: '%SSFld% is required.',
  },
  VOUCHER: {
    MISSING_SALE_ORDER_NO: 'Please input or scan Sale Order No!',
    NOT_FOUND_SALE_ORDER: 'The SO <%SONo%> is not valid in system.',
    NO_VOUCHER_SCANNED: 'No Voucher is scanned.',
    CANCEL_VOUCHER_SCANNED: 'Are you sure you want to cancel?',
    OVER_SCANNED_QUANTITY: 'Scanned quantity is over quantity of voucher.',
    SCAN_ERROR: 'Scan error! Please try again.',
    VOUCHER_ALREADY_SCANNED: 'A scanned voucher is duplicated.',
    NO_DATA_VOUCHER_EXPORT: 'Please select voucher to export',
    CONFIRM_DELETE_VALUE_PACK:
      'Are you sure you want to delete this Value Pack : <%VPNo%>?',
    EXPORT: 'The file was successfully exported',
    CONFIRM_VOUCHER: 'Voucher list is created and email is sent successfully!',
    SAVE_SUCCESSFULLY: 'Voucher <%voucherName%> is created.',
    UPDATE_SUCCESSFULLY: 'Voucher <%voucherName%> is updated.',
    REQUIRED_FLD: '<%FldName%> is required.',
    EXIST_VOUCHER: 'Existed a Voucher with the same Voucher Name, Type and Voucher Value Type.',
    ERROR_VALID_TO: 'The Valid To must be later than Valid From.',
    SELECT_PROMOTION_CODE: 'Please selected Promotion Code.',
    MATERIAL_CODE_NOT_EXIST:
      'This Material Code is not existed in BBS. Please help to recheck!',
    VALIDATION_STATUS: 'Can not change Active to <StatusName> !',
    VALIDATION_STATUS_INACTIVE: 'Can not change Inactive to <StatusName> !',
    VALIDATION_STATUS_CHANGE_ACTIVE: 'Can not change <StatusName> to Active !',
    VALIDATION_STATUS_CHANGE_INACTIVE: 'Can not change <StatusName> to Inactive !',
    VALIDATION_STATUS_CHANGE_READY_TO_SAVE: 'Can not change Ready to Sale to <StatusName> !',
    VALIDATION_STATUS_USED: 'Can not change status from Used to another status',
    VALIDATION_VALID_TO: 'Please change Valid To',
    VALIDATION_EXPIRED_EVOUCHER: 'E-voucher is expired. Can not change to <StatusName> !',
    CONFIRM_EDIT_STATUS: 'Your voucher have been updated successfully!',
    INPUT_NUMBER: 'Must be integer number.',
    DATE_NUMBER: '<%FldName%> must be integer number.',
    REMOVE_ALL_SCANNED_VOUCHERS:
      'Are you sure you want to remove all scanned vouchers in this item?',
    SO_C_MISSING_VALID_FROM_TO: 'This Sale Order No is not valid. Please check the [Voucher Start Date] and [Voucher End Date]!',
    INVALID_DATE_RANGE: 'The Valid To must be later than Valid From.',
    INVALID_VALID_TO: 'The Valid To must be later current date.',
    VOUCHER_CONFIRM: 'Are you sure want to confirm this Voucher <%VOUCHER%>?',
  },
  ADD_VALUE_PACK: {
    CREATE_VALUE_PACK_SUCCESSFULLY: 'Value Pack is created successfully!',
    PLEASE_SELECT_VOUCHER_VALUE_TYPE: 'Please select Voucher Mat Desc!',
    NOT_EQUAL_TO_TOTAL_VALUE_OF_VALUE_PACK:
      'Total is not equal to total value of a value pack!',
    NO_VOUCHER_IS_ADDED_INTO_THIS_PACK: 'No voucher is added into this pack!',
    FIELD_SIZE:
      '<Field Name> should not exceed the maxLength than <Field size>.',
    FIELD_VALUE_NUMBER:
      '<Field Name> should be greater than <Field value number>',
  },
  COUPON: {
    NO_COUPON_SCANNED: 'No coupon is scanned.',
    CANCEL_COUPON_SCANNED: 'Are you sure you want to cancel?',
    OVER_SCANNED_QUANTITY: 'Scanned quantity is over quantity of coupon.',
    SCAN_ERROR: 'Scan error! Please try again.',
    COUPON_ALREADY_SCANNED: 'The coupon <%SERIAL_NO%> have already scanned.',
    SAVE_SUCCESSFULLY: 'Save successfully!',
    UPDATE_SUCCESSFULLY: 'Coupon is updated successfully!',
    SAVE_SUCCESS: 'Coupon <%CpName%> is created.',
    UPDATE_SUCCESS: 'Coupon <%CpName%> is updated.',
    REQUIRED_FLD: '<%FldName%> is required.',
    EXIST_COUPON: 'Existed a Coupon with the same Coupon Name, Type and Coupon Value Type.',
    ERROR_END_DAY: 'The End Date must be later than Start Date.',
    INVALID_VALID_TO: 'The Valid To must be later current date.',
    INPUT_NUMBER: 'Must be integer number.',
    SELECT_PROMOTION_CODE: 'Please selected Promotion Code.',
    NO_DATA_COUPON_EXPORT: 'Please select coupon to export',
    CONFIRM_COUPON: 'Coupon is created and email is sent successfully!',
    VALIDATION_ACTIVE_STATUS: 'Can not change Active to <StatusName> !',
    VALIDATION_INACTIVE_STATUS: 'Can not change Inactive to <StatusName> !',
    VALIDATION_NOT_CHANGE_USED:
      'Can not change status from Used to another status',
    VALIDATION_VALID_TO: 'Please change Valid To',
    VALIDATION_NOTHING_CHANGE: 'There are nothing changed.',
    NO_DATA_EXPORT: 'No data to export',
    COUPON_CONFIRM: 'Are you sure want to confirm this Coupon <%COUPON%>?',
  },

  VALUE_PACK_ALLOCATION: {
    PLEASE_SCAN: 'Please scan!',
    MISSING_VALUE_PACK_NO: 'Please input or scan Value Pack No!',
    CONFIRM_CANCEL_SCAN_PROCESS: 'Are you sure you want to cancel?',
    NO_VOUCHER_IS_SCANNED: 'No Voucher is scanned.',
    VALUE_PACK_NO_NOT_EXISTED:
      'Value Pack No <@valuePackNo> is not existed in system.',
    VOUCHER_ALREADY_SCANNED: 'The voucher <%SERIAL_NO%> have already scanned.',
    SCANNED_QTY_IS_OVER_QTY_OF_VOUCHER_IN_PACK:
      'Scanned quantity is over quantity of voucher in a pack.',
    ASSIGNED_VALUE_PACK_SUCCESSFULLY:
      'This Value Pack <%VALUE_PACK_NO%> is assigned.',
    INVALID_VOUCHER_SERIAL_NO: 'This code <%SERIAL_NO%> is not valid!',
  },

  IMPORT_EXPORT: {
    NO_FILE_SELECT: 'No file selection',
    CHOOSE_FILE_IMPORT: 'Please choose a file to import!',
    IMPORT_SUCCESSFUL: 'Import successfully',
    VALIDATE_EMAIL: 'Invalid email format.',
  },

  END_OF_DAY: {
    SUBMIT_SUCCESSFUL: 'Submit successfully!',
  },

  MATERIAL_CONSUMPTION: {
    SUBMIT_CONFIRM: 'Are you sure want to submit this Material Consumption?',
  },

  STOCK_COUNT: {
    DELETE_CONFIRM:
      'Are you sure to delete this Stock Count Request. <%REQUEST_NO%>?',
    APPROVED_SC_SUCCESSFULLY:
      'The Stock Count <%REQUEST_NO%> has been approved.',
    REJECTED_SC_SUCCESSFULLY:
      'The Stock Count <%REQUEST_NO%> has been rejected.',
    CANCELLED_SC_SUCCESSFULLY:
      'The Stock Count <%REQUEST_NO%> has been cancelled.',
    CLOSE_CONFIRM:
      'Are you sure to close this Stock Count Request: <%REQUEST_NO%>?',
    CREATED_SUCCESSFULLY: 'The Stock Count <%REQUEST_NO%> has been created.',
    DRAFT_SUCCESSFULLY: 'The Stock Count <%requestNo%> has been saved.',
    SUBMIT_SUCCESSFULLY: 'The Stock Count <%requestNo%> has been submitted.',
    CHANGE_STOCK_COUNT_TYPE: `Data from ${'Details Information'} will be reset when other Stock Count Type is selected`,
    SUBMIT_CONFIRM: 'Are you sure want to submit this Stock Count%requestNo%?',
    APPROVE_CONFIRM:
      'Are you sure want to approve this Stock Count: No.%requestNo%?',
  },
  INVENTORY: {
    CONFIRM_DELETE: 'Are you sure you want to delete this GI : <%VPNo%>?',
  },
  GOODS_ISSUES: {
    DRAFT_SAVE_SUCCESSFULLY: 'The GI No. <%GOOD_ISSUE_NO%> has been created.',
    SUBMIT_SUCCESSFULLY: 'The GI No. <%GOOD_ISSUE_NO%> has been submitted.',
    DRAFT_UPDATE_SUCCESSFULLY: 'The GI No. <%GOOD_ISSUE_NO%> has been saved.',
    INTERNAL_ORDER_INVALID: 'must contain 8 characters. Please check again!',
    COST_CENTER_INVALID: 'must contain 10 digits. Please check again!',
    MAX_LENGTH_NOTE: 'should not exceed the maxLength than 50',
    CHANGE_BRANCH: 'Are you sure you want to change the <Field Name>? All data will be refreshed.',
    CHANGE_TYPE: 'Are you sure you want to change the <Field Name>? All items below will be removed.',
    ONLY_NUMBER: ' can only contain numbers.',
    CLOSE_STATUS_CONFIRM: 'Are you sure want to close this GI: %INSTANCE%?',
    CLOSE_SUCCESSFULLY: 'The Goods Issue  %rrNo% has been closed.',
    SUBMIT_CONFIRM: 'Are you sure want to submit this Goods Issue%giNo%?',
  },

  ASSET_REQUEST: {
    CONFIRM_DELETE: 'Are you sure to delete this Asset Request: <%ARNo%>?',
    DRAFT_SAVE_SUCCESSFULLY: 'The AR No. <%ASSET_REQUEST_NO%> has been created.',
    SUBMIT_SUCCESSFULLY: 'The AR No. <%ASSET_REQUEST_NO%> has been submitted.',
    DRAFT_UPDATE_SUCCESSFULLY: 'The AR No. <%ASSET_REQUEST_NO%> has been saved.',
    MAX_LENGTH_NOTE: 'should not exceed the maxLength than 50',
    CHANGE_REQUEST_FROM: 'Are you sure you want to change the <Field Name>? All data will be refreshed.',
    CHANGE_REQUEST_TO: 'Are you sure you want to change the <Field Name>? All items below will be removed.',
    CHANGE_ASSET_CATEGORY: 'Are you sure you want to change the <Field Name>? All items below will be removed.',
    CHANGE_DESTINATION_LOCATION: 'Are you sure you want to change the <Field Name>? All items below will be removed.',
    APPROVE: 'The Asset Request <%ARNo%> has been approved.',
    REJECT: 'The Asset Request <%ARNo%> has been rejected.',
    CLOSE: 'Are you sure to close this Asset Request: <%ARNo%>?'
  },

  MASTER_DATA: {
    INCORRECT_FILE_TYPE_TITLE: 'Incorrect file type',
    INCORRECT_FILE_TYPE_CONTENT: 'File type is not correct! (csv,xls,xlsx).',
    INVALID_FILE_TITLE: 'Invalid file',
    INVALID_FILE_CONTENT: 'File is not valid!',
    INVALID_DATA_IN_FILE: 'Invalid data in the file!',
  },

  USER: {
    DELETE_CONFIRM: 'Are you sure to delete this user ?',
  },

  PETTY_CASH: {
    DRAFT_PETTY_CASH_SUCCESSFULLY:
      'The Petty Cash No. %pcNo% has been created.',
    SUBMIT_PETTY_CASH_SUCCESSFULLY:
      'The Petty Cash No. %pcNo% has been submitted.',
    DRAFT_PETTY_CASH_SAVED_SUCCESSFULLY:
      'The Petty Cash No. %pcNo% has been saved.',
    APPROVE: 'The Petty Cash <%PCNo%> has been approved.',
    REJECT: 'The Petty Cash <%PCNo%> has been rejected.',
    CLOSE: 'Are you sure to close this Petty Cash: <%PCNo%>?'
  }
};
