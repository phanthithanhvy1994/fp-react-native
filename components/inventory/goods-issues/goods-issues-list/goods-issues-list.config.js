import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { FieldConstant, dateFormat, GoodsIssuesConstant } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

const options = {
  search: false,
  draggable: false,
  toolbar: false,
  paging: false,
  exportButton: false,
  sorting: true,
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
    value: ''
  },
  {
    label: 'Department',
    id: 'departmentCode',
    fieldName: 'departmentCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [], 
    value: ''
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      createdDateFrom: '',
      createdDateTo: '',
    },
    searchInput: {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Submitted Date',
    id: 'submittedDate',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      submittedDateFrom: '',
      submittedDateTo: '',
    },
    searchInput: {
      label: 'Submitted Date',
      fieldName: 'submittedDate',
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
    data: [],
    className: FieldConstant.class.TEXT,
    value: '',
  },

  {
    label: 'Type',
    id: 'type',
    fieldName: 'type',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    data: [],
    value: ''
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    required: false,
    // match: true,
    data: [],
    value: ''
  },
  {
    label: 'Material Document',
    id: 'materialDocument',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    value: '',
  },

  {
    label: 'Material Description',
    id: 'materialDescription',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    value: '',
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

const columnsDefault = [
  {
    title: 'Status',
    field: 'statusName',
  },
  {
    title: 'Type',
    field: 'typeName',
  },
  {
    title: 'GI No.',
    field: 'goodsIssuesNumber',
  },
  {
    title: 'Material Document',
    field: 'materialDocument',
  },
  {
    title: 'Department',
    field: 'departmentName',
  },
  {
    title: 'Submitted Date',
    field: 'submittedDate',
    render: (rowData) =>
      formatDateString(rowData.submittedDate, dateFormat.mainDate, true),
  },
  {
    title: 'Create Date',
    field: 'createdDate',
    render: (rowData) =>
      formatDateString(rowData.createdDate, dateFormat.mainDate, true),
  },
  {
    title: 'Created By',
    field: 'createdBy',
  },
  {
    title: 'Branch',
    field: 'branchName',
  },
];

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
    disabledFunc: (row) =>(row.statusName !== GoodsIssuesConstant.statusList.failed &&
                           row.statusName !== GoodsIssuesConstant.statusList.draft),
  },
  {
    tooltip: 'Delete',
    icon: () => icons.delete,
    onClick: (e, rowData) => {
      confirmDeleteItem(rowData);
    },
    position: 'row',
    disabledFunc: (row) =>(row.statusName !== GoodsIssuesConstant.statusList.draft),
  },
];

export {
  fields,
  options,
  columnsDefault,
  action,
};
