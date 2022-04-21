import React from 'react';
import { Visibility, Edit, Delete } from '@material-ui/icons';
import { FieldConstant, dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

const columns = [
  { title: 'Status', field: 'statusName' },
  { title: 'Return To', field: 'orderTypeName' },
  { title: 'Vendor', field: 'vendorName' },
  { title: 'Return Request No.', field: 'requestNumber' },
  { title: 'Goods Receipt No.', field: 'goodReceiptNo' },
  { title: 'PO STO Return No.', field: 'sapRequestNumber' },
  { title: 'Material Document', field: 'materialDocument' },
  { title: 'DO No.', field: 'doNumber' },
  { title: 'Credit Note', field: 'creditNote' },
  {
    title: 'Created Date',
    field: 'createdDate',
    defaultSort: 'desc',
    render: function customRender(rowData) {
      return formatDateString(rowData.createdDate, dateFormat.mainDate, true);
    },
    width: 200,
  },
  { title: 'Created By', field: 'createdBy' },
  { title: 'Approved By', field: 'approver' },
  { title: 'Branch', field: 'branchCode' },
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

const fields = [
  {
    label: 'Branch',
    id: 'branch',
    fieldName: 'branch',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.SELECT,
    data: [],
  },
  {
    label: 'Vendor',
    id: 'vendor',
    fieldName: 'vendor',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Goods Receipt No.',
    id: 'goodsReceiptNo',
    fieldName: 'goodsReceiptNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
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
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Return To',
    id: 'orderType',
    fieldName: 'orderType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
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
    label: 'Return Request No.',
    id: 'returnRequestNo',
    fieldName: 'returnRequestNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'PO STO Return No.',
    id: 'sapRequestNumber',
    fieldName: 'sapRequestNumber',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Material Document',
    id: 'materialDocument',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Batch No.',
    id: 'batchNo',
    fieldName: 'batchNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Complaint No.',
    id: 'complaintNo',
    fieldName: 'complaintNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Reason',
    id: 'reason',
    fieldName: 'reason',
    fieldType: FieldConstant.type.SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Material Description',
    id: 'materialDescription',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Credit Note.',
    id: 'creditNote',
    fieldName: 'creditNote',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'DO No.',
    id: 'doNo',
    fieldName: 'doNumber',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];
const validation = [];

const icons = {
  view: <Visibility />,
  delete: <Delete />,
  edit: <Edit />,
};

const actions = (
  goToDetailPage,
  goToEditPage,
  confirmDelete,
  handleDisableActionButton
) => [
  {
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData);
    },
  },
  (data) => ({
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (event, rowData) => {
      goToEditPage(rowData);
    },
    disabled: handleDisableActionButton(data, 'edit'),
  }),
  (data) => ({
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDelete(rowData);
    },
    disabled: handleDisableActionButton(data, 'delete'),
  }),
];

export { columns, options, fields, validation, actions };
