import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { FieldConstant, dateFormat } from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';

const columns = [
  { title: 'PO-STO', field: 'poNumber' },
  { title: 'DO Number', field: 'doNumber'},
  { title: 'Branch', field: 'branchCodeName', width: '10%' },
  { title: 'Order Method', field: 'orderMethod' },
  {
    title: 'Created Date',
    field: 'createdDate',
    render: (rowData) =>
      formatDateString(rowData.createdDate, dateFormat.mainDate, true),
  },
  { title: 'Total DO Quantity', field: 'totalDoQty' },
  { title: 'Total PO Quantity', field: 'totalPoDty' },
  { title: 'Status', field: 'doStatusName' },
  { title: 'Type', field: 'doTypeName', render: (rowData) => rowData?.doTypeName || 'Material'}, //TEMP FOR TEST
  { title: 'Created By', field: 'createdBy' },
  { title: 'Shipment No', field: 'shipmentNo' },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const fields = [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
  {
    label: 'Delivery Date',
    id: 'deliveryDate',
    fieldName: 'deliveryDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      ge: null,
      eq: null,
    },
    searchInput: {
      label: 'Delivery Date',
      fieldName: 'deliveryDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      placeholder: 'DD.MM.YYYY',
      format: 'dd.MM.yyyy',
    },
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      ge: null,
      eq: null,
    },
    searchInput: {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      placeholder: 'DD.MM.YYYY',
      format: 'dd.MM.yyyy',
    },
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
  {
    label: 'DO',
    id: 'doNumber',
    fieldName: 'doNumber',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'PO-STO',
    id: 'poNumber',
    fieldName: 'poNumber',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Type',
    id: 'doType',
    fieldName: 'doType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
  {
    label: 'Shipment No.',
    id: 'shipmentNo',
    fieldName: 'shipmentNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Reference 1',
    id: 'yourRefer',
    fieldName: 'yourRefer',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Reference 2',
    id:'ourRefer',
    fieldName: 'ourRefer',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Material Description',
    id:'materialDescription',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

const validation = [
  {
    name: 'poNumber',
    rule: {
      maxLength: {
        value: 12,
        message: 'PO Number reaches max length.',
      },
    },
  },
  {
    name: 'doNumber',
    rule: {
      maxLength: {
        value: 12,
        message: 'DO Number reaches max length.',
      },
    },
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

export { columns, options, fields, validation, actions };
