import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FieldConstant, dateFormat, GRConstant } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';
import moment from 'moment';

const columns = [
  { title: 'Status', field: 'sapExportedStatusName' },
  { title: 'Type', field: 'goodReceiptTypeName' },
  { title: 'PO-STO No.', field: 'poStoNumber', defaultSort: 'desc' },
  {
    title: 'PO/DO No.',
    field: 'refNumber',
  },
  { title: 'Vendor', field: 'vendorName' },
  {
    title: 'Factory',
    field: 'factoryName',
  },
  { title: 'Invoice No./Delivery Note', field: 'deliveryNote' },
  {
    title: 'Submitted Date',
    field: 'submittedTime',
    render: function customRender(rowData) {
      return formatDateString(rowData.submittedTime, dateFormat.mainDate, true);
    },
  },
  { title: 'Created By', field: 'createdBy' },
  { title: 'Material Document', field: 'materialDocument' },
  { title: 'Branch', field: 'branchName' },
];

const columnsForSearchPopup = [
  { title: 'Status', field: 'sapExportedStatusName' },
  { title: 'Type', field: 'goodReceiptTypeName' },
  {
    title: 'PO/DO No.',
    field: 'refNumber',
    hidden: true,
  },
  { title: 'Vendor', field: 'vendorName' },
  { title: 'Invoice No./Delivery Note', field: 'deliveryNote' },
  {
    title: 'Submitted Date',
    field: 'submittedTime',
    render: function customRender(rowData) {
      return formatDateString(rowData.submittedTime, dateFormat.mainDate, true);
    },
  },
  { title: 'Created By', field: 'createdBy' },
  { title: 'Material Document', field: 'materialDocument' },
  { title: 'Branch', field: 'branchName' },
];

const options = {
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const fields = (isSearchPopup) => [
  {
    label: 'Branch',
    id: 'branch',
    fieldName: 'branch',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    hidden: isSearchPopup,
  },
  {
    label: 'PO-STO No.',
    id: 'poStoNumber',
    fieldName: 'poStoNumber',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
    hidden: isSearchPopup,
  },
  {
    label: 'PO/DO No.',
    id: 'refNumber',
    fieldName: 'refNumber',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Type',
    id: 'goodReceiptType',
    fieldName: 'goodReceiptType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    classCustom: '',
    hidden: isSearchPopup,
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
    hidden: isSearchPopup,
  },
  {
    label: 'Submitted Date',
    id: 'submittedTime',
    fieldName: 'submittedTime',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {},
    initialValue: {
      ge: isSearchPopup ? null : moment().subtract(1, 'months').format(dateFormat.yyyymmddStartDay),
      le: isSearchPopup ? null : moment().format(dateFormat.yyyymmddEndDay),
    },
    searchInput: {
      label: 'Submitted Date',
      fieldName: 'submittedTime',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Status',
    id: 'sapExportedStatus',
    fieldName: 'sapExportedStatus',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    value: isSearchPopup ? {value: GRConstant.searchPopup.defaultStatusValue, display: GRConstant.searchPopup.defaultStatusDisplay} : ''
  },
  {
    label: 'Invoice No./Delivery Note',
    id: 'deliveryNote',
    fieldName: 'deliveryNote',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Vendor',
    id: 'vendor',
    fieldName: 'vendor',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Material Description',
    id: 'materialDescription',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Batch No.',
    id: 'batchNo',
    fieldName: 'batchNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
    hidden: isSearchPopup,
  },
  {
    label: 'Material Document',
    id: 'materialDocument',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    fieldType: FieldConstant.type.NONE,
    hidden: !isSearchPopup,
  },
];

const icons = {
  view: <VisibilityIcon />,
};

const actions = (goToDetailPage) => [
  {
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData);
    },
  },
];

export { columns, columnsForSearchPopup, options, fields, actions };
