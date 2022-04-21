import React from 'react';
import { dateFormat, FieldConstant, Voucher } from '../../../constants/constants';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Delete from '@material-ui/icons/Delete';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import { ReactComponent as ScanQR } from '../../../assets/scanQR.svg';
import { Message } from '../../../constants/messages';
import { formatDateString } from '../../../util/date-util';

const fieldArray = (detailData, onFieldChange, onClickLoadSOBtn) => [
  {
    label: 'Sale Order No.',
    id: Voucher.voucherActFieldName.receiptNumber,
    fieldName: Voucher.voucherActFieldName.receiptNumber,
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
    customOnChange: (event) => {
      onFieldChange(detailData, Voucher.voucherActFieldName.receiptNumber, event);
    },
    required: true,
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
      handleClick: () => {
        console.log('Go to scan QR');
      },
    },
    endAction: {
      className: 'btn-end-action',
      icon: function customIcon() {
        return <ChevronRightRoundedIcon/>;
      },
      onClick: onClickLoadSOBtn.bind(null, detailData)
    },
    value: (detailData && detailData.receiptNumber) || '',
    onItemKeyPress: (event) => {
      if (event && event.charCode === 13 && event.key === 'Enter') {
        onClickLoadSOBtn(detailData);
      }
    }
  },
  {
    label: 'Tracking No.',
    id: Voucher.voucherActFieldName.trackingNo,
    fieldName: Voucher.voucherActFieldName.trackingNo,
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
    required: true,
    customOnChange: (event) => {
      onFieldChange(detailData, Voucher.voucherActFieldName.trackingNo, event);
    },
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
      handleClick: () => {
        console.log('Go to scan QR');
      },
    },
    value: (detailData && detailData.trackingNo) || ''
  },
  {
    label: 'Valid From',
    id: 'validFrom',
    fieldName: 'validFrom',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
    customOnChange: (event) => {
      onFieldChange(detailData, 'validFrom', event);
    },
    value: detailData && detailData.validFrom
      && formatDateString(detailData.validFrom, dateFormat.mmddyyyy, true),
    hidden: detailData && detailData.soDoStatus === 'C'
  },
  {
    label: 'Valid To',
    id: 'validTo',
    fieldName: 'validTo',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
    customOnChange: (event) => {
      onFieldChange(detailData, 'validTo', event);
    },
    value: detailData && detailData.validTo
      && formatDateString(detailData.validTo, dateFormat.mmddyyyy, true),
    hidden: detailData && detailData.soDoStatus === 'C'
  },
  {
    fieldType: FieldConstant.type.NONE
  },
  {
    fieldType: FieldConstant.type.NONE
  },
  {
    fieldType: FieldConstant.type.NONE
  }
];

const fieldsLabelArray = (detailData) => [
  {
    label: 'Sold To',
    fieldName: Voucher.voucherActFieldName.soldTo,
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: detailData.soldTo && `${detailData?.soldTo} - ${detailData?.soldToName}`,
  },
  {
    label: 'Ship To',
    fieldName: Voucher.voucherActFieldName.shipTo,
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: detailData.shipTo && `${detailData.shipTo} - ${detailData.shipToName}`,
  },
  {
    label: 'Customer PO No.',
    fieldName: Voucher.voucherActFieldName.customerCode,
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.customerCode) || '',
  },
];

const columnsDetail = [
  {
    title: 'No.',
    field: 'lineNumber',
    editable: 'never',
  },
  {
    title: 'Type',
    field: 'typeName',
    editable: 'never',
  },
  {
    title: 'Material No.',
    field: 'sku',
    editable: 'never',
  },
  {
    title: 'Voucher Mat Desc',
    field: 'description',
    editable: 'never',
    render: function customRender(rowData) {
      return <span className={rowData.isTotalSummarize ? 'total-summarize-label' : ''}>{rowData.description}</span>;
    }
  },
  {
    title: 'Order Quantity',
    field: 'quantity',
    editable: 'never',
  },
  {
    title: 'Scanned Quantity',
    field: 'scannedQuantity',
    editable: 'never',
    render: (rowData) => {
      return rowData.totalScannedQuantity || rowData.scannedQuantity || '';
    }
  },
  {
    title: 'Campaign Name',
    field: 'itemCategory',
    editable: 'never',
    width: 200
  },
];

const actions = (saleOrderData, goToDetailPage, goToScanPage, confirmDeleteItem, handleDisabledAction) => [
  data => ({
    icon: <ScanQR />,
    tooltip: 'Scan',
    onClick: (event, rowData) => {
      goToScanPage(event, rowData);
    },
    hidden: data.isHideAllActions || (data.typeName && data.typeName.toLowerCase()) === Voucher.eVoucher.toLowerCase(),
    isCustomGridAction: true,
    disabled: data.quantity === data.scannedQuantity
  }),
  {
    icon: VisibilityIcon,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData);
    },
    hiddenFunc: rowData => rowData.isHideAllActions || (rowData.typeName && rowData.typeName.toLowerCase()) === Voucher.eVoucher.toLowerCase(),
  },
  data => ({
    icon: <Delete />,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
    disabled: !data.allowDelete,
    hidden: data.isHideAllActions || (data.typeName && data.typeName.toLowerCase()) === Voucher.eVoucher.toLowerCase(),
    isCustomGridAction: true
  }),
];

const bottomGridButtonsArray = (saleOrderData, onSave) => [
  {
    title: 'Save',
    handleFor: 'save',
    className: 'btnPrimary',
    customHandleClick: true,
    handleClick: onSave,
    hidden: saleOrderData && saleOrderData.status === Voucher.statusValue.completed,
  },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const totalSummarizeInGrid = [
  { fieldName: 'description', label: 'Total', isOnlyShowLabelTotal: true },
  { fieldName: 'quantity', label: 'Total Order Quantity' },
  { fieldName: 'totalScannedQuantity', label: 'Total Scanned Quantity' },
];

const validation = [
  {
    name: Voucher.voucherActFieldName.receiptNumber,
    rule: {
      required: `Sale Order No ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: Voucher.voucherActFieldName.trackingNo,
    rule: {
      required: `Tracking No ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'validFrom',
    rule: {
      required: `Valid From ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'validTo',
    rule: {
      required: `Valid To ${Message.FIELD_REQUIRED}`,
    },
  },
];

// FOR SCAN POPUP
const scanOptions = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const scanActions = (scanDeleteRow) => [
  {
    icon: Delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      scanDeleteRow(rowData);
    },
  }
];

const scanColumnsDetail = [
  {
    title: 'Item No.',
    field: 'lineNumber',
    editable: 'never',
    width: 100,
    cellStyle: {
      textAlign: 'center'
    }
  },
  {
    title: 'Serial No.',
    field: 'serialNo',
    editable: 'never',
  },
  {
    title: 'Valid From',
    field: 'validFrom',
    editable: 'never',
  },
  {
    title: 'Valid To',
    field: 'validTo',
    editable: 'never',
  },
  {
    title: 'Status',
    field: 'voucherStatusName',
    editable: 'never',
  },
];

const scanFieldsLabelArray = (detailData) => [
  {
    label: 'Sale Order No.',
    fieldName: Voucher.voucherActFieldName.receiptNumber,
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.receiptNumber) || '',
  },
  {
    label: 'Material No.',
    fieldName: 'sku',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.sku) || '',
  },
  {
    label: 'Voucher Mat Desc',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.description) || '',
  },
  {
    label: 'Type',
    fieldName: Voucher.voucherActFieldName.typeName,
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.typeName) || '',
  },
  {
    label: 'Order Quantity',
    fieldName: 'quantity',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.quantity) || '',
  },
  {
    label: 'Scanned Quantity',
    fieldName: 'scannedQuantity',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && (detailData.totalScannedQuantity || detailData.scannedQuantity)) || '',
  },
];

const scanBottomGridButtonsArray = (addVouchersHandler, cancelVouchersHandler, onlyViewAddedvouchers) => [
  {
    title: 'Cancel',
    className: 'btnNeutral',
    handleClick: cancelVouchersHandler,
    hidden: !!onlyViewAddedvouchers,
  },
  {
    title: 'Add',
    className: 'btnPrimary',
    handleClick: addVouchersHandler,
    hidden: !!onlyViewAddedvouchers,
  },
];

export {
  actions,
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  totalSummarizeInGrid,
  options,
  validation,
  fieldArray,
  scanOptions,
  scanActions,
  scanColumnsDetail,
  scanFieldsLabelArray,
  scanBottomGridButtonsArray,
};
