import React from 'react';
import Delete from '@material-ui/icons/Delete';
import Edit from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FieldConstant, dateFormat } from '../../constants/constants';
import { formatDateString } from '../../util/date-util';

const columns = [
  { title: 'Status', field: 'statusName' },
  { title: 'Order Type', field: 'orderTypeName' },
  {
    title: 'PO/PO STO No.',
    render: function customRender(rowData) {
      return rowData.sapResquestNumber;
    }
  },
  {
    title: 'Created Date',
    field: 'requestedDate',
    defaultSort: 'desc',
    render: function customRender(rowData) {
      return formatDateString(rowData.requestedDate, dateFormat.mainDate, true);
    }
  },
  {
    title: 'Vendor',
    field: 'vendorName',
  },
  { title: 'Created By ', field: 'createdBy' },
  { title: 'Approved By', field: 'approver' },
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
    label: 'Vendor',
    id: 'vendorCode',
    fieldName: 'vendorCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
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
    label: 'Delivery Date',
    id: 'deliveryDate',
    fieldName: 'deliveryDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {},
    searchInput: {
      label: 'Delivery Date',
      fieldName: 'deliveryDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
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
    label: 'Order Type',
    id: 'orderType',
    fieldName: 'orderType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
  },
  {
    label: 'PO/PO STO No.',
    id: 'sapResquestNumber',
    fieldName: 'sapResquestNumber',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Material Description.',
    id: 'description',
    fieldName: 'description',
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

const actions = (confirmDeleteItem, goToEditPage, goToDetailPage, handleDisabledAction) => [
  {
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData.id);
    },
  },
  data => ({
    icon: () => icons.edit,
    tooltip: 'Edit',
    onClick: (e, rowData) => {
      goToEditPage(rowData.id);
    },
    disabled: handleDisabledAction(data, 'edit')
  }),
  data => ({
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      confirmDeleteItem(rowData);
    },
    disabled: handleDisabledAction(data, 'delete')
  }),
];

export { columns, options, fields, actions };
