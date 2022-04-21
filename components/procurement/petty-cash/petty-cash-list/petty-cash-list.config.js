import React from 'react';
import Delete from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import { FieldConstant,  } from '../../../../constants/constants';

const columns = [
  { title: 'Status', field: 'status' },
  { title: 'Type', field: 'type' },
  { title: 'Amount', field: 'amount'},
  { title: 'Vender\'s Name', field: 'venderName'},
  { title: 'Submitted Date', field: 'submittedDate' },
  { title: 'Created By', field: 'createdBy' },
  { title: 'Approved By', field: 'approvedBy' },
  { title: 'Note', field: 'note' },
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
    fieldType: FieldConstant.type.SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
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
    label: 'Type',
    id: 'type',
    fieldName: 'type',
    fieldType: FieldConstant.type.SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Submitted Date',
    id: 'submittedDate',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      ge: null,
      eq: null,
    },
    searchInput: {
      label: 'Submitted Date',
      fieldName: 'submittedDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      placeholder: 'DD.MM.YYYY',
      format: 'dd.MM.yyyy',
    },
  },
  {
    label: 'PO Petty Cash (SAP)',
    id: 'poPettyCash',
    fieldName: 'poPettyCash',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: ' Invoice Date',
    id: 'invoiceDate',
    fieldName: 'invoiceDate',
    fieldType: FieldConstant.type.PICKER,
    required: false,
    className: FieldConstant.class.PICKER,
    classCustom: '',
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.SELECT,
    required: false,
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Vender\'s Name',
    id: 'venderName',
    fieldName: 'venderName',
    fieldType: FieldConstant.type.SELECT,
    required: false,
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Tax No.',
    id: 'taxNo',
    fieldName: 'taxNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Total Balence',
    id: 'totalBalence',
    fieldName: 'totalBalence',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
    endAdornment: {endTextLabel: 'bath'},
    disabled: true
  },
  {
    label: 'Maximum Allowance',
    id: 'maximumAllowance',
    fieldName: 'maximumAllowance',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
    endAdornment: {endTextLabel: 'bath'},
    disabled: true
  },
];


const icons = {
  delete: <Delete />,
  edit: <Edit />,
  view: <VisibilityIcon />,
};

const actions = (confirmDeleteItem, goToEditPage, goToDetailPage, handleDisabledAction) => [
 
  data => ({
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData.pettyCashId);
    },
    hidden: data.type === 1,
  }),
  data => ({
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData.pettyCashId);
    },
    hidden: data.type === 1,
    disabled: handleDisabledAction(data, 'edit'),
  }),
  data => ({
    icon: () => icons.delete,
    tooltip: 'Delete',
    hidden: data.type === 1,
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
    disabled: handleDisabledAction(data, 'delete')
  }),
];

export { columns, options, fields, actions };
