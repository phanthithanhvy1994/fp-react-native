import React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import Edit from '@material-ui/icons/Edit';
import {
  FieldConstant,
  dateFormat,
  ButtonConstant,
  EnumDate,
} from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';

const options = {
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: true,
};

const rowsPerPageOptionsCustom = [100, 300, 500];

const itemsPerPageCustom = 100;

const itemsPerPagePopup = 25;

const icons = {
  edit: <Edit />,
};

// Config for action in detail grid
const actions = (
  editItemHandler, 
  selectItem, 
) =>{ 
  const Used = selectItem?.map(el =>el.voucherStatus).includes(voucherDetail.Used);
  const Expired = selectItem?.map(el =>el.voucherStatus).includes(voucherDetail.Expired);
  const InActive = selectItem?.map(el =>el.voucherStatus).includes(voucherDetail.In_Active);
  const Blank = selectItem?.map(el =>el.voucherStatus).includes(voucherDetail.Blank);
  const hiddenButtonEdit = Used || Expired || InActive || Blank;
  return[
    {
      tooltip: 'Edit Item',
      isFreeAction: true,
      icon: <CreateIcon />,
      onClick: () => {},
      customHandler: editItemHandler,
      hidden: selectItem.length > 0 && !hiddenButtonEdit ? false :  true,
    },
    {
      tooltip: 'Edit',
      icon: () => icons.edit,
      onClick: (e, rowData) => {
        editItemHandler(rowData);
      },
      isActionRow: true,
      position: 'row',
      disabledFunc: (row) => {
        return row.voucherStatus === voucherDetail.Used || 
          row.voucherStatus === voucherDetail.In_Active ||
          row.voucherStatus === voucherDetail.Expired || 
          row.voucherStatus === voucherDetail.Blank || 
          selectItem?.map(el => el.voucherDetailId).includes(row.voucherDetailId)
          ? true: false ;
      },
    },
  ];
};

const actionsBtnInGeneralForm = (
  viewSaleOrderDetail,
  editVoucherDetail,
  confirmed,
  isEvoucher,
  detailData
) => [
  {
    title: 'View Sale Order Detail',
    customClassName: ButtonConstant.width.FULL_WIDTH,
    customHandler: viewSaleOrderDetail,
    hidden: confirmed || !isEvoucher || (isEvoucher && !detailData.saleOrderNo),
  },
  {
    title: 'Edit',
    customClassName: ButtonConstant.type.SECONDARY,
    customHandler: editVoucherDetail,
    hidden: confirmed,
  },
  {
    title: 'Confirm',
    type: 'submit',
    hidden: confirmed,
  },
];

// For detail page
const fieldsLabelArrayPaperVoucher = (detailData) => {
  const dateApply = detailData?.applyOnDay?.map((data) =>
    Object.keys(EnumDate).find((key) => EnumDate[key] === data)
  );
  return [
    {
      label: 'Voucher Name',
      fieldName: 'voucherName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherName) || '',
    },
    {
      label: 'Type',
      fieldName: 'voucherTypeName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherTypeName) || '',
    },
    {
      label: 'Voucher Mat Desc',
      fieldName: 'voucherValueTypeName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherValueTypeName) || '',
    },
    {
      label: 'Company Code',
      fieldName: 'companyCode',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.companyName) || '',
    },
    {
      label: 'S/N Prefix',
      fieldName: 'systemRunning',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.systemRunning) || '',
    },
    {
      label: 'Serial No. Digits',
      fieldName: 'voucherSerialNoDigit',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherSerialNoDigit) || '',
    },
    {
      label: 'Voucher Serial No',
      fieldName: 'voucherSerialNo',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherSerialNo) || '',
    },
    {
      label: 'Promotion',
      fieldName: 'promotionName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.promotionName) || '',
    },
    {
      label: 'Delivery Email',
      fieldName: 'deliveryEmail',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.deliveryEmail) || '',
    },
    {
      label: 'Applied On',
      fieldName: 'applyOnDay',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dateApply.join(', ') || '',
    },
    {
      label: 'Note',
      fieldName: 'note',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.note) || '',
    },
    {
      label: 'Total Voucher Qty',
      fieldName: 'totalVoucherQty',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalVoucherQty) || '',
    },
    {
      label: 'Booklet Qty',
      fieldName: 'bookletQty',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.bookletQty) || '',
    },
    {
      label: 'Qty per Booklet',
      fieldName: 'qtyPerBooklet',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.qtyPerBooklet) || '',
    },
    {
      label: 'Total Active',
      fieldName: 'totalActive',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalActive) || 0,
    },
    {
      label: 'Total Blank',
      fieldName: 'totalBlank',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalBlank) || 0,
    },
    {
      label: 'Total Used',
      fieldName: 'totalUsed',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalUsed) || 0,
    },
    {
      label: 'Total Expired',
      fieldName: 'totalExpired',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalExpired) || 0,
    },
    {
      label: 'Total Inactive',
      fieldName: 'totalInActive',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalInActive) || 0,
    },
    {
      label: 'Total Hold',
      fieldName: 'totalHold',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalHold) || 0,
    },
    {
      label: 'Total Ready to Sale',
      fieldName: 'totalReadyToSale',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalReadyToSale) || 0,
    },
  ];
};

const fieldsLabelArrayEVoucher = (detailData) => {
  const dateApply = detailData?.applyOnDay?.map((data) =>
    Object.keys(EnumDate).find((key) => EnumDate[key] === data)
  );
  return [
    {
      label: 'Voucher Name',
      fieldName: 'voucherName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherName) || '',
      sorting: false,
    },
    {
      label: 'Type',
      fieldName: 'voucherTypeName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherTypeName) || '',
    },
    {
      label: 'Voucher Mat Desc',
      fieldName: 'voucherValueTypeName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherValueTypeName) || '',
    },
    {
      label: 'Company Code',
      fieldName: 'companyCode',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.companyName) || '',
    },
    {
      label: 'S/N Prefix',
      fieldName: 'systemRunning',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.systemRunning) || '',
    },
    {
      label: 'Serial No. Digits',
      fieldName: 'voucherSerialNoDigit',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherSerialNoDigit) || '',
    },
    {
      label: 'Voucher Serial No',
      fieldName: 'voucherSerialNo',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.voucherSerialNo) || '',
    },
    {
      label: 'Promotion',
      fieldName: 'promotionName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.promotionName) || '',
    },
    {
      label: 'Delivery Email',
      fieldName: 'deliveryEmail',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.deliveryEmail) || '',
    },
    {
      label: 'Channel',
      fieldName: 'channel',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.channel) || '',
    },
    {
      label: 'Sale Order No',
      fieldName: 'saleOrderNo',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.saleOrderNo) || '',
    },
    {
      label: 'Market Place',
      fieldName: 'marketPlace',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.marketPlace) || '',
    },
    {
      label: 'Valid From',
      fieldName: 'validFrom',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        (detailData &&
          formatDateString(detailData.validFrom, dateFormat.mainDate, true)) ||
        '',
      hidden: detailData.otherPlatform === 1 ? true : false,
    },
    {
      label: 'Valid To',
      fieldName: 'validTo',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        (detailData &&
          formatDateString(detailData.validTo, dateFormat.mainDate, true)) ||
        '',
      hidden: detailData.otherPlatform === 1 ? true : false,
    },
    {
      label: 'Valid After',
      fieldName: 'validAfter',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: detailData && detailData.validAfter,
      hidden: detailData.otherPlatform === 0 ? true : false,
    },
    {
      label: 'Valid Duration',
      fieldName: 'validDuration',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: detailData && detailData.validDuration,
      hidden: detailData.otherPlatform === 0 ? true : false,
    },
    {
      label: 'Total Voucher Qty',
      fieldName: 'totalVoucherQty',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalVoucherQty) || '',
    },
    {
      label: 'Total Active',
      fieldName: 'totalActive',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalActive) || 0,
    },
    {
      label: 'Total Blank',
      fieldName: 'totalBlank',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalBlank) || 0,
    },
    {
      label: 'Total Used',
      fieldName: 'totalUsed',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalUsed) || 0,
    },
    {
      label: 'Total Expired',
      fieldName: 'totalExpired',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalExpired) || 0,
    },
    {
      label: 'Total Inactive',
      fieldName: 'totalInActive',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalInActive) || 0,
    },
    {
      label: 'Total Hold',
      fieldName: 'totalHold',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalHold) || 0,
    },
    {
      label: 'Total Ready to Sale',
      fieldName: 'totalReadyToSale',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalReadyToSale) || 0,
    },
    {
      label: 'Applied On',
      fieldName: 'applyOnDay',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dateApply.join(', ') || '',
    },
    {
      label: 'Note',
      fieldName: 'note',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.note) || '',
    },
  ];
};
const columnsDetail = (isEvoucher) => [
  {
    title: 'Status',
    field: 'voucherStatusName',
    editable: 'never',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Serial No.',
    field: 'serialNo',
    editable: 'never',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Valid From',
    field: 'validFrom',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.validFrom
        ? formatDateString(rowData.validFrom, dateFormat.mainDate, true)
        : '';
    },
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Valid To',
    field: 'validTo',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.validTo
        ? formatDateString(rowData.validTo, dateFormat.mainDate, true)
        : '';
    },
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Sale Order NO.',
    field: 'saleOrderNo',
    editable: 'never',
    hidden: isEvoucher,
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'POS ID',
    field: 'posId',
    editable: 'never',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Used Date',
    field: 'usedDate',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.usedDate
        ? formatDateString(rowData.usedDate, dateFormat.mainDate, true)
        : '';
    },
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Used Time',
    field: 'usedTime',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.usedTime
        ? formatDateString(rowData.usedTime, dateFormat.time, true)
        : '';
    },
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Branch Usage',
    field: 'branchUsageName',
    editable: 'never',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Profit Center',
    field: 'profitCenter',
    editable: 'never',
    hidden: isEvoucher,
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Branch Sold',
    field: 'branchSoldName',
    editable: 'never',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Sold Date',
    field: 'soldDate',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.validTo
        ? formatDateString(rowData.soldDate, dateFormat.mainDate, true)
        : '';
    },
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Booklet Code',
    field: 'bookletCode',
    editable: 'never',
    hidden: isEvoucher,
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Value Pack No',
    field: 'valuePackNo',
    editable: 'never',
    hidden: isEvoucher,
    width: 140,
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
];

const editSerialVoucher = (
  status,
  onChangeValidFrom,
  Evoucher,
  rowsSelected
) => {
  // Waiting BA
  // const statusData = rowsSelected.map(item => item.voucherStatus);
  // let isExpired = false;
  // if (statusData.find(status => status === voucherDetail.Expired)) {
  //   isExpired = true;
  // }
  return [
    {
      label: 'Status',
      id: 'status',
      fieldName: 'status',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      data: status || [],
      // disabled: isExpired,
    },
    {
      label: 'Valid From',
      id: 'validFrom',
      fieldName: 'validFrom',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      classCustom: 'Field-fldPicker',
      customOnChange: onChangeValidFrom,
      validation: {
        required: 'Required',
      },
      disabled: Evoucher,
    },
    {
      label: 'Valid To',
      id: 'validTo',
      fieldName: 'validTo',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      classCustom: 'Field-fldPicker',
      validation: {
        required: 'Required',
      },
      disabled: Evoucher,
      minDate: new Date(),
    },
  ];
};

const voucherDetail = {
  status: 'status',
  validFrom: 'validFrom',
  validTo: 'validTo',
  Used: 'U',
  Active: 'A',
  Ready_To_Sale: 'S',
  In_Active: 'I',
  Expired: 'E',
  Blank: 'B',
};

const statusNameVoucher = {
  A: 'Active',
  S: 'Ready To Sale',
  U: 'Used',
  E: 'Expired',
  R: 'Reserve for Sales',
  I: 'Inactive',
  H: 'Hold',
  B: 'Blank',
};

const columnPopupEdit = [
  {
    title: 'Item No',
    field: 'profitCenter',
    editable: 'never',
    render: (rowData) => rowData.tableData.id + 1,
    width: 90,
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
    headerStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Status',
    field: 'voucherStatusName',
    editable: 'never',
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
    render: function customRender(rowData) {
      return rowData.validFrom
        ? formatDateString(rowData.validFrom, dateFormat.mainDate, true)
        : '';
    },
  },
  {
    title: 'Valid To',
    field: 'validTo',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.validFrom
        ? formatDateString(rowData.validTo, dateFormat.mainDate, true)
        : '';
    },
  },
];

const optionsPopupEdit = {
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
  headerStyle: {
    position: 'sticky',
    top:'0'
  },
  maxBodyHeight: '120px'
};

export {
  actions,
  options,
  fieldsLabelArrayPaperVoucher,
  fieldsLabelArrayEVoucher,
  columnsDetail,
  actionsBtnInGeneralForm,
  editSerialVoucher,
  voucherDetail,
  statusNameVoucher,
  rowsPerPageOptionsCustom,
  itemsPerPageCustom,
  columnPopupEdit,
  optionsPopupEdit,
  itemsPerPagePopup
};
