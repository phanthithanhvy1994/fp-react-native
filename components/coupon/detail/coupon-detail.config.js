import React from 'react';
import CreateIcon from '@material-ui/icons/Create';
import {
  FieldConstant,
  dateFormat,
  ButtonConstant,
  CouponConstant,
  EnumDate
} from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';
import { formatDropdownList } from '../../../util/format-util';
import Edit from '@material-ui/icons/Edit';

const serialCodeType = {
  1: 'Fix serial code',
  2: 'Running serial code',
};

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

const icons = {
  edit: <Edit />,
};

// Config for action in detail grid
const actions = (editItemHandler, selectItem, detailData) => {
  const Used = selectItem?.map(el => el.status).includes(CouponConstant.fieldEdit.used);
  const Expired = selectItem?.map(el => el.status).includes(CouponConstant.fieldEdit.expired);
  const InActive = selectItem?.map(el => el.status).includes(CouponConstant.fieldEdit.in_Active);
  const hiddenButtonEdit = Used || Expired || InActive;
  return [
    {
      tooltip: 'Edit Item',
      isFreeAction: true,
      icon: <CreateIcon />,
      onClick: () => { },
      customHandler: editItemHandler,
      hidden: selectItem.length > 0 && !hiddenButtonEdit ? false : true,
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
        return row.status === CouponConstant.fieldEdit.used
          || (row.status === CouponConstant.fieldEdit.blank)
          || (row.status === CouponConstant.fieldEdit.expired)
          || (row.status === CouponConstant.fieldEdit.in_Active)
          || selectItem?.map(el => el.couponDetailId).includes(row.couponDetailId);
      }
    },
  ];
};

const actionsBtnInGeneralForm = (editCouponDetail, confirmed) => [
  {
    title: 'Edit',
    customClassName: ButtonConstant.type.SECONDARY,
    customHandler: editCouponDetail,
    hidden: confirmed || false,
  },
  {
    title: 'Confirm',
    type: 'submit',
    hidden: confirmed || false,
  },
];

// For detail page
const fieldsLabelArrayCoupon = (detailData) => {

  const dateApply = detailData?.appliedOnDay?.map((data) =>
    Object.keys(EnumDate).find((key) => EnumDate[key] === data)
  );

  return [
    {
      label: 'Coupon Name',
      fieldName: 'couponName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.couponName) || '',
    },
    {
      label: 'Type',
      fieldName: 'couponTypeName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.couponTypeName) || '',
    },
    {
      label: 'Serial Code Type',
      fieldName: 'serialCodeType',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && serialCodeType[detailData.serialCodeType]) || '',
    },
    {
      label: 'Coupon Value Type',
      fieldName: 'couponValueType',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.couponValueType) || '',
    },
    {
      label: 'Coupon Value',
      fieldName: 'couponValue',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.couponValue) || '',
    },
    {
      label: 'S/N Prefix',
      fieldName: 'snPrefix',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.snPrefix) || '',
    },
    {
      label: 'Valid From',
      fieldName: 'fromValidDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        (detailData &&
          formatDateString(
            detailData.fromValidDate,
            dateFormat.mainDate,
            true
          )) ||
        '',
      hidden:
        detailData.validateDateType ===
          +CouponConstant.validateDateType.determined
          ? true
          : false,
    },
    {
      label: 'Valid To',
      fieldName: 'toValidDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        (detailData &&
          formatDateString(detailData.toValidDate, dateFormat.mainDate, true)) ||
        '',
      hidden:
        detailData.validateDateType ===
          +CouponConstant.validateDateType.determined
          ? true
          : false,
    },
    {
      label: 'Valid After',
      fieldName: 'validAfter',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: detailData.validAfter,
      hidden:
        (detailData.validateDateType === +CouponConstant.validateDateType.fixDate
          || detailData.validateDateType === undefined)
          ? true
          : false,
    },

    {
      label: 'Valid Duration',
      fieldName: 'validDuration',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: detailData.validDuration,
      hidden:
        (detailData.validateDateType === +CouponConstant.validateDateType.fixDate
          || detailData.validateDateType === undefined)
          ? true
          : false,
    },

    {
      label: 'Serial No. Digits',
      fieldName: 'serialNoDigits',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.serialNoDigits) || '',
    },
    {
      label: 'Coupon Serial No',
      fieldName: 'couponSerialNo',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.couponSerialNo) || '',
    },
    {
      label: 'Promotion',
      fieldName: 'promotionName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.promotionName) || '',
    },
    {
      label: 'Company Code',
      fieldName: 'companyName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.companyName) || '',
    },
    {
      label: 'Total Coupon Qty',
      fieldName: 'totalCouponQty',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalCouponQty) || '',
    },
    {
      label: 'Booklet Qty',
      fieldName: 'bookletQty',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.bookletQty) || '',
      hidden: (detailData &&
        (+detailData.couponType === +CouponConstant.typeCoupon.Electronic ||
          +detailData.couponType === +CouponConstant.typeCoupon.paperReceipt ||
          (+detailData.couponType === +CouponConstant.typeCoupon.paperLeaflet && +detailData.serialCodeType === +CouponConstant.serialCodeType.fix)))
    },
    {
      label: 'Qty per Booklet',
      fieldName: 'qtyPerBooklet',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.qtyPerBooklet) || '',
      hidden: (detailData &&
        (+detailData.couponType === +CouponConstant.typeCoupon.Electronic ||
          +detailData.couponType === +CouponConstant.typeCoupon.paperReceipt ||
          (+detailData.couponType === +CouponConstant.typeCoupon.paperLeaflet && +detailData.serialCodeType === +CouponConstant.serialCodeType.fix)))
    },
    {
      label: 'Total Active',
      fieldName: 'totalActive',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalActive) || 0,
    },
    {
      label: 'Total Ready to Sale',
      fieldName: 'totalReadyToSale',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalReadyToSale) || 0,
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
      label: 'Applied On',
      fieldName: 'appliedOnDay',
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


const columnsDetail = (statusOptions) => [
  {
    title: 'Status',
    field: 'status',
    render: (rowData) =>
      (rowData.status && CouponConstant.statusName[rowData.status]) || '',
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
    title: 'Serial No',
    field: 'serialNo',
    editable: 'never',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    }
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
    field: 'branchUsage',
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
    field: 'branchSold',
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
      return rowData.soldDate
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
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
];

const editSerialCoupon = (status, rowsSelected) => {
  const statusData = rowsSelected.map((item) => item.voucherStatus);
  const statusList = formatDropdownList(status);
  let isExpired = false;

  if (
    statusData.find((status) => status === CouponConstant.fieldEdit.expired)
  ) {
    isExpired = true;
  }
  return [
    {
      label: 'Status',
      id: 'status',
      fieldName: 'status',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      data: statusList || [],
      classCustom: 'Field-fldSelect',
      disabled: isExpired,
    },
    {
      label: 'Valid From',
      id: 'validFrom',
      fieldName: 'validFrom',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      classCustom: 'Field-fldPicker',
      validation: {
        required: 'Required',
      },
    },
    {
      label: 'Valid To',
      id: 'validTo',
      fieldName: 'validTo',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      classCustom: 'Field-fldPicker',
      // customOnChange: onChangeValidFrom,
      validation: {
        required: 'Required',
      },
      minDate: new Date(),
    },
  ];
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
    field: 'statusName',
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
  fieldsLabelArrayCoupon,
  columnsDetail,
  actionsBtnInGeneralForm,
  editSerialCoupon,
  columnPopupEdit,
  optionsPopupEdit,
};
