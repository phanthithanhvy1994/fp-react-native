import React from 'react';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FieldConstant, StockCount, dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

const columns = [
  { title: 'Status', field: 'statusName' },
  { title: 'Request No.', field: 'requestNo', defaultSort: 'asc' },
  { title: 'Stock Count Type', field: 'stockCountTypeName' },
  {
    title: 'Created Date',
    field: 'createdDate',
    render: function customRender(rowData) {
      return formatDateString(rowData.createdDate, dateFormat.mainDate, true);
    }
  },
  { title: 'Created By', field: 'createdBy' },
  { title: 'Approved By', field: 'approvedBy' },
  { title: 'Branch', field: 'branchName' },
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

const fields = (branchCode) => [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    initialValue: [{value: branchCode}],
    data: [],
  },
  {
    label: 'Request No.',
    id: 'requestNo',
    fieldName: 'requestNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
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
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Stock Count Type',
    id: 'stockCountType',
    fieldName: 'stockCountType',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
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
    label: 'Approved By',
    id: 'approvedBy',
    fieldName: 'approvedBy',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Material Document No.',
    id: 'materialDocumentNo',
    fieldName: 'materialDocumentNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    fieldType: FieldConstant.type.NONE
  }
];

const icons = {
  delete: <Delete />,
  edit: <Edit />,
  view: <VisibilityIcon />,
};

const statusAllowEditStockCount = [
  StockCount.statusValue.draft,
  StockCount.statusValue.counting,
  StockCount.statusValue.rejected,
];

const statusAllowCloseStockCount = [
  StockCount.statusValue.draft,
  StockCount.statusValue.counting,
  StockCount.statusValue.rejected,
  StockCount.statusValue.failed,
];

const actions = (confirmDeleteItem, goToEditPage, goToDetailPage) => [
  {
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData);
    },
  },
  data => ({
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData);
    },
    disabled: !data.status || (data.status && statusAllowEditStockCount.indexOf(data.status.toString()) === -1)
  }),
  data => ({
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
    disabled: !data.status || (data.status.toString() !== StockCount.statusValue.draft)
  }),
];

export { columns, options, fields, actions, statusAllowEditStockCount, statusAllowCloseStockCount };
