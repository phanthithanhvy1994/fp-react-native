import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import { FieldConstant } from '../../constants/constants';
import { ReactComponent as ScanQR } from '../../assets/scanQR.svg';

const fields = (
  voucherName,
  channel,
  status,
  companyCode,
  voucherMat,
  getVoucherPromotion
) => [
  {
    label: 'Company Code',
    id: 'companyCode',
    fieldName: 'companyCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: companyCode || [],
  },
  {
    label: 'Created Date',
    id: 'created_date',
    fieldName: 'created_date',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    classCustom: 'lineHeight',
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Created Date',
      fieldName: 'created_date',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Valid From',
    id: 'valid_from',
    fieldName: 'valid_from',
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
      fieldName: 'valid_from',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Valid To',
    id: 'valid_to',
    fieldName: 'valid_to',
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
      fieldName: 'valid_to',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Active Date',
    id: 'active_date',
    fieldName: 'active_date',
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
      fieldName: 'active_date',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Used Date',
    id: 'used_date',
    fieldName: 'used_date',
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
      fieldName: 'used_date',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Expired Date',
    id: 'expired_date',
    fieldName: 'expired_date',
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
      fieldName: 'expired_date',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Channel',
    id: 'channelVoucher',
    fieldName: 'channelVoucher',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: channel || [],
  },
  {
    label: 'Sale Order No.',
    id: 'saleOrderNo',
    fieldName: 'saleOrderNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
  },
  {
    label: 'Voucher Name',
    id: 'voucherId',
    fieldName: 'voucherId',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: voucherName || [],
  },
  {
    label: 'Booklet Code',
    id: 'bookletCode',
    fieldName: 'bookletCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
    },
  },
  {
    label: 'Voucher Serial No.',
    id: 'voucherSerialNo',
    fieldName: 'voucherSerialNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
    },
  },
  {
    label: 'Voucher Mat Desc',
    id: 'voucherMatDesc',
    fieldName: 'voucherMatDesc',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: voucherMat || [],
  },
  {
    label: 'Customer PO No.',
    id: 'customerOrderNo',
    fieldName: 'customerOrderNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
  },
  {
    label: 'Tracking No.',
    id: 'trackingNo',
    fieldName: 'trackingNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: status || [],
  },
  {
    label: 'Promotion',
    id: 'promotion',
    fieldName: 'promotion',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: getVoucherPromotion || [],
  },
  {
    label: 'Draft Voucher',
    id: 'draftVoucher',
    fieldName: 'draftVoucher',
    fieldType: FieldConstant.type.CHECKBOX,
    className: FieldConstant.class.CHECKBOX,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
    classCustom: 'hidden-field'
  },
];

const columnsDefault = [
  {
    title: 'Type',
    field: 'voucherTypeName',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Voucher Name',
    field: 'voucherName',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Voucher Mat Desc',
    field: 'voucherValueTypeName',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Voucher Value',
    field: 'voucherValue',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Total Voucher Qty',
    field: 'totalVoucherQty',
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px',
    },
  },
  {
    title: 'Sale Order No.',
    field: 'saleOrderNo',
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
};

const action = (goToDetailPage, goToEditPage) => {
  return [
    {
      tooltip: 'View',
      icon: () => icons.view,
      onClick: (e, rowData) => {
        goToDetailPage(rowData);
      },
      position: 'row',
    },
    {
      tooltip: 'Edit',
      icon: () => icons.edit,
      onClick: (e, rowData) => {
        goToEditPage(rowData);
      },
      position: 'row',
      disabledFunc: (row) => {
        return row.update !== undefined ? !+row.update : true;
      },
    },
  ];
};

const importHeaders = [
  'Status',
  'Type',
  'Voucher Value',
  'Voucher Name',
  'Voucher Mat Desc',
  'Ref Number',
  'S/N Prefix',
  'Booklet Code',
  'Voucher Serial No',
  'Valid From',
  'Valid To',
  'Active Date',
  'Used Date',
  'Branch Sold',
  'Usage Branch',
  'Market Place',
  'Sold To Name',
  'Campaign Name',
  'Sale Order No',
  'Channel',
  'POS ID',
  'QC No.',
  'Profit Center',
  'ID Round No.',
  'Defered Disc',
  'Company Code',
];

const exportConfigs = {
  fileName: 'VOU_',
  headers: importHeaders,
  unusedFields: ['Description'],
};

const exportFields = (typeExport, email) => [
  {
    label: 'Type',
    id: 'type',
    fieldName: 'type',
    fieldType: FieldConstant.type.RADIO,
    className: FieldConstant.class.RADIO,
    classCustom: 'exportType',
    required: true,
    data: [
      { value: true, name: 'Internal Using' },
      { value: false, name: 'External Using' },
    ],
    value: typeExport,
  },
  {
    label: 'Email',
    id: 'email',
    fieldName: 'email',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    classCustom: 'ExportEmail',
    required: true,
    disabled: typeExport,
    value: email,
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
