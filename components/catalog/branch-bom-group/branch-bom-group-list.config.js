import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import { BranchBOM, FieldConstant } from '../../../constants/constants';

const columns = [
  {
    title: 'Branch BOM Group Code',
    field: 'bomGroupCode',
    defaultSort: 'desc',
    width: 230,
  },
  { title: 'Name', field: 'bomGroupName',
    width: 230,
  },
  { title: 'Level', field: 'level' },
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
    label: 'Branch BOM Group Code',
    id: 'bomGroupCode',
    fieldName: 'bomGroupCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    classCustom: 'Field-fldText',
  },
  {
    label: 'Name',
    id: 'bomGroupName',
    fieldName: 'bomGroupName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    classCustom: 'Field-fldText',
  },
  {
    label: 'Level',
    id: 'level',
    fieldName: 'level',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    value: [{value: BranchBOM.levels.level_2, display: BranchBOM.levelName.level_2}],
    resetValue: [{value: BranchBOM.levels.level_2, display: BranchBOM.levelName.level_2}],
    disabled: true
  },
];

const icons = {
  view: <VisibilityIcon />,
  edit: <Edit />,
  delete: <Delete />,
};

const actions = (goToDetailPage, goToEditPage, confirmDeleteItem) => [
  {
    tooltip: 'View',
    icon: () => icons.view,
    onClick: (e, rowData) => {
      goToDetailPage(rowData);
    },
  },
  {
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData);
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
