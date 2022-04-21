import React from 'react';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import { FieldConstant } from '../../../constants/constants';

const columns = [
  { title: 'Role Name', field: 'roleName', defaultSort: 'asc' },
  { title: 'Description', field: 'description' },
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
    label: 'Role Name',
    id: 'roleName',
    fieldName: 'roleName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Description',
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

const icons = {
  delete: <Delete />,
  edit: <Edit />,
};

const actions = (confirmDeleteItem, goToEditPage) => [
  {
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData.roleId);
    },
  },
  {
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
  },
];

export { columns, options, fields, actions };
