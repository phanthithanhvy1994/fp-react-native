import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import { CouponConstant, FieldConstant } from '../../../constants/constants';
import { ReactComponent as ScanQR } from '../../../assets/scanQR.svg';
const fields = (
  companyCode,
  couponType,
  couponCode,
  couponValueType,
  couponDetailStatus,
  promotionCode,
  onChangeType
) => [
  {
    label: 'Company Code',
    id: 'companyCode',
    fieldName: 'companyCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: (companyCode && companyCode.data) || [],
    value: (companyCode && companyCode.defaultVal) || [],
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Valid From',
    id: 'validFrom',
    fieldName: 'validFrom',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    classCustom: 'lineHeight',
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Valid From',
      fieldName: 'validFrom',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Valid To',
    id: 'validTo',
    fieldName: 'validTo',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    classCustom: 'lineHeight',
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Valid To',
      fieldName: 'validTo',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Active Date',
    id: 'activeDate',
    fieldName: 'activeDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    classCustom: 'lineHeight',
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Active Date',
      fieldName: 'activeDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Used Date',
    id: 'usedDate',
    fieldName: 'usedDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    classCustom: 'lineHeight',
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Used Date',
      fieldName: 'usedDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Expired Date',
    id: 'expiredDate',
    fieldName: 'expiredDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    classCustom: 'lineHeight',
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Expired Date',
      fieldName: 'expiredDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Type',
    id: 'couponType',
    fieldName: 'couponType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    customOnChange: onChangeType,
    required: false,
    data: couponType || [],
  },
  {
    label: 'Coupon Name',
    id: 'couponCode',
    fieldName: 'couponCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: couponCode || [],
  },
  {
    label: 'Coupon Serial No.',
    id: 'couponSerialNoDetail',
    fieldName: 'couponSerialNoDetail',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    maxLength: 25,
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
      handleClick: () => {
        console.log('Go to scan QR');
      },
    },
    required: false,
  },
  {
    label: 'Booklet Code',
    id: 'bookletCodeDetail',
    fieldName: 'bookletCodeDetail',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
      handleClick: () => {
        console.log('Go to scan QR');
      },
    },
    required: false,
  },
  {
    label: 'Coupon Value Type',
    id: 'couponValueType',
    fieldName: 'couponValueType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: couponValueType || [],
  },
  {
    label: 'Status',
    id: 'couponDetailStatus',
    fieldName: 'couponDetailStatus',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: couponDetailStatus || [],
  },
  {
    label: 'Promotion',
    id: 'promotionCode',
    fieldName: 'promotionCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: promotionCode || [],
  },
  {
    label: 'Draft Coupon',
    id: 'draftCoupon',
    fieldName: 'draftCoupon',
    fieldType: FieldConstant.type.CHECKBOX,
    className: FieldConstant.class.CHECKBOX,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

const columnsDefault = [
  {
    title: 'Coupon Name',
    field: 'couponName',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Type',
    field: 'couponTypeName',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Total Coupon Qty',
    field: 'totalCouponQty',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Coupon Value Type',
    field: 'couponValueType',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Coupon Value',
    field: 'couponValue',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Note',
    field: 'note',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
];

const options = {
  search: false,
  draggable: false,
  toolbar: false,
  paging: false,
  exportButton: false,
  sorting: true,
  showTitle: false,
  selection: true,
};

const icons = {
  view: <VisibilityIcon />,
  edit: <Edit />,
  scanQR: <ScanQR />,
};

const action = (goToDetailPage, showEditDialog, goToScanPage) => [
  {
    tooltip: 'View',
    icon: () => icons.view,
    onClick: (e, rowData) => {
      goToDetailPage(rowData);
    },
    position: 'row',
  },
  {
    icon: () => icons.edit,
    tooltip: 'Edit',
    position: 'row',
    onClick: (e, rowData) => {
      showEditDialog(rowData);
    },
    //TODO: Default is true
    disabledFunc: (row) => {
      return +row.update === CouponConstant.couponUpdated.updated
        ? true
        : false; // Fix bug: FPBBS-1602:
    },
  },
  {
    icon: () => icons.scanQR,
    tooltip: 'ScanQR',
    position: 'row',
    onClick: (e, rowData) => {
      goToScanPage(rowData);
    },
    disabledFunc: (data) => {
      // Only allow scan for "Paper - Leaflet" and coupon that not complete scan yet
      return (
        !data.couponTypeName ||
        data.couponTypeName.toLowerCase() !==
          CouponConstant.typeNameCoupon.paperleft.toLowerCase() ||
        +data.scannedQuantity === +data.totalCouponQty
      );
    },
  },
];

const importHeaders = [
  'Coupon Serial No',
  'Coupon Name',
  'Coupon Type',
  'Serial Code Type',
  'Coupon Value Type',
  'Coupon Value',
  'Valid From',
  'Valid To',
  'Status',
  'Sold Date',
  'Usaged Date',
  'Branch Sold',
  'Branch Usage',
  'Create Date',
  'Company Code',
];

const exportConfigs = {
  fileName: 'Coupon_',
  headers: importHeaders,
  unusedFields: ['Description'],
};

const exportFields = (typeExport) => [
  {
    label: 'Type',
    id: 'type',
    fieldName: 'type',
    fieldType: FieldConstant.type.RADIO,
    className: FieldConstant.class.RADIO,
    required: true,
    data: [{ value: 'internal', name: 'Internal Using' }],
    value: typeExport,
  },
];

export {
  fields,
  options,
  columnsDefault,
  action,
  exportConfigs,
  importHeaders,
  exportFields,
};
