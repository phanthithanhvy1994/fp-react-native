import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';

import { FieldConstant, dateFormat, BranchBOMPrice } from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';
import { Message } from '../../../constants/messages';

import {
  PRICE_LIST_NAME,
  BOM_PRICE,
  PRICE_LIST_NO,
  BRANCH_GROUP,
  BRANCH_GROUP_NAME,
  SEARCH_CHANNEL,
  CHANNEL_NAME,
  START_DATE,
  END_DATE,
  STATUS,
  STATUS_NAME,
  DESCRIPTION,
  CREATED_BY,
  MODIFIED_BY,
  COMPANY_CODE,
} from './branch-bom-price.constant';

const columns = [
  { title: 'Status', field: STATUS_NAME, width: 80 },
  { title: 'Price List No', field: PRICE_LIST_NO, defaultSort: 'desc' },
  { title: 'Price List Name', field: PRICE_LIST_NAME },
  { title: 'Channel', field: CHANNEL_NAME },
  { title: 'Branch Group', field: BRANCH_GROUP_NAME },
  {
    title: 'Start Date',
    field: START_DATE,
    render: (rowData) =>
      formatDateString(rowData.startDate, dateFormat.mainDate, true),
  },
  {
    title: 'End Date',
    field: END_DATE,
    render: (rowData) => formatDateString(rowData.endDate, dateFormat.mainDate , true),
  },
  { title: 'Note', field: DESCRIPTION },
  { title: 'Created By', field: CREATED_BY },
  { title: 'Last Modified By', field: MODIFIED_BY },
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
    label: 'Company Code',
    id: COMPANY_CODE,
    fieldName: COMPANY_CODE,
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    classCustom: '',
  },
  {
    label: 'Branch Group',
    id: BRANCH_GROUP,
    fieldName: BRANCH_GROUP,
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    classCustom: '',
  },
  {
    label: 'Channel',
    id: SEARCH_CHANNEL,
    fieldName: SEARCH_CHANNEL,
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
  {
    label: 'Start Date',
    id: START_DATE,
    fieldName: START_DATE,
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      startDate: null,
      endDate: null,
    },
    searchInput: {
      label: 'Start Date',
      fieldName: START_DATE,
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      placeholder: 'DD.MM.YYYY',
      format: 'dd.MM.yyyy',
    },
  },
  {
    label: 'Status',
    id: STATUS,
    fieldName: STATUS,
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.MULTI_SELECT,
    classCustom: '',
  },
  {
    label: 'Price List',
    id: BOM_PRICE,
    fieldName: BOM_PRICE,
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
    classCustom: 'hidden-field'
  },
];

const validation = [
  {
    name: BOM_PRICE,
    rule: {
      maxLength: {
        value: 256,
        message: `${Message.BRANCH_BOM_PRICE.PRICE_LIST_MAX_LENGTH}`,
      },
    },
  },
];

const icons = {
  view: <VisibilityIcon />,
  edit: <Edit />,
  delete: <Delete />,
};

const actions = (goToDetailPage, goToEditPage, confirmDeleteItem) => [
  {
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData);
    },
  },
  (rowData) => ({
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData);
    },
  }),
  (rowData) => ({
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
    disabled: (rowData.status !== BranchBOMPrice.status.draft),
  }),
];

export { columns, options, fields, validation, actions };
