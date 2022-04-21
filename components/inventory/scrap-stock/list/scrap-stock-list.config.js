import React from 'react';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FieldConstant } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';
import { dateFormat } from '../../../../constants/constants';

const columns = [
  { title: 'Status', field: 'statusName' },
  { title: 'Scrap Stock No.', field: 'scrapStockNo' },
  {
    title: 'Created Date',
    field: 'createDate',
    render: function customRender(rowData) {
      return formatDateString(rowData.createDate, dateFormat.mainDate, true);
    },
    defaultSort: 'desc',
  },
  { title: 'Created By', field: 'createBy' },
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

const fields = [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Scrap Stock No.',
    id: 'stockNo',
    fieldName: 'stockNo',
    fieldType: FieldConstant.type.TEXT,
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
    value: {},
    searchInput: {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
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
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Material Description',
    id: 'materialDes',
    fieldName: 'materialDes',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];
const validation = [
  {
    name: 'branch',
    rule: {
      required: 'error required',
    },
  },
  {
    name: 'scrapStockNo',
    rule: {
      required: 'error required',
    },
  },
  {
    name: 'createdDate',
    rule: {
      required: 'error required',
    },
  },
  {
    name: 'createdBy',
    rule: {
      required: 'error required',
    },
  },
  {
    name: 'inventory',
    rule: {
      required: 'error required',
    },
  },

  {
    name: 'status',
    rule: {
      required: 'error required',
    },
  },
];

const icons = {
  delete: <Delete />,
  edit: <Edit />,
  view: <VisibilityIcon />,
};

const actions = (
  confirmDeleteItem,
  goToEditPage,
  goToDetailPage,
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
      confirmDeleteItem(rowData);
    },
    disabled: handleDisableActionButton(data, 'delete'),
  }),
];

export { columns, options, fields, validation, actions };
