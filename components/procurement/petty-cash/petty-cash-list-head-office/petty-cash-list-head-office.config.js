import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { FieldConstant, dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

const columns = [
  { title: 'Maximum Allowance', field: 'maximumAllowance' },
  { title: 'Total Balence', field: 'totalBalence'},
  { title: 'Submitted Date', field: 'submittedDate' },
  { title: 'Submitted Time', field: 'submittedTime' },
  { title: 'Reimbursed Date', field: 'reimbursedDate' },
  { title: 'Branch', field: 'branch' },
  { title: 'Profit Center', field: 'profitCenter' },
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
    label: 'Reimbursed Date',
    id: 'reimbursedDate',
    fieldName: 'reimbursedDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      ge: null,
      eq: null,
    },
    searchInput: {
      label: 'Reimbursed Date',
      fieldName: 'reimbursedDate',
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
  }
];

const importHeaders = [
  'Branch\'s Profit Center',
  'Amount',
  'Date',
  'Email',
];

export { columns, options, fields, importHeaders };
