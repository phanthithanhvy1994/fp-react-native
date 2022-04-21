import { FieldConstant } from '../../../constants/constants';
import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

const fields = [
  {
    label: 'User Code',
    id: 'userCode',
    fieldName: 'userCode',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Full Name',
    id: 'fullName',
    fieldName: 'fullName',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Role',
    id: 'roleCode',
    fieldName: 'roleCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
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
    label: 'Department',
    id: 'departmentCode',
    fieldName: 'departmentCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
  {
    label: 'Telephone',
    id: 'telephone',
    fieldName: 'telephone',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Email',
    id: 'email',
    fieldName: 'email',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Position',
    id: 'position',
    fieldName: 'position',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Division',
    id: 'division',
    fieldName: 'division',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Employee ID',
    id: 'employeeID',
    fieldName: 'employeeID',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Username',
    id: 'username',
    fieldName: 'username',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'Account Status',
    id: 'accountStatus',
    fieldName: 'accountStatus',
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
];

const columnsDefault = [
  {
    title: 'Status',
    field: 'statusName',
  },
  {
    title: 'User Code',
    field: 'userCode',
  },
  {
    title: 'Username',
    field: 'username',
  },
  {
    title: 'First Name',
    field: 'firstName',
  },
  {
    title: 'Last Name',
    field: 'lastName',
  },
  {
    title: 'Department',
    field: 'departmentName',
  },
  {
    title: 'Position',
    field: 'positionName',
  },
  {
    title: 'Division',
    field: 'divisionName',
  },
  {
    title: 'Telephone',
    field: 'telephone',
  },
  {
    title: 'Email',
    field: 'email',
  },
];

const options = {
  search: false,
  draggable: false,
  toolbar: true,
  paging: false,
  exportButton: false,
  sorting: true,
  showTitle: false,
  selection: false,
};

const icons = {
  view: <VisibilityIcon />,
  edit: <Edit />,
  delete: <Delete />,
};
const action = (goToDetailPage, goToEditPage, confirmDeleteItem) => [
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
      goToEditPage(rowData);
    },
  },
  {
    icon: () => icons.delete,
    tooltip: 'Delete',
    position: 'row',
    onClick: (e, rowData) => {
      confirmDeleteItem(rowData);
    },
  },
];

export {
  fields,
  options,
  columnsDefault,
  action
};
