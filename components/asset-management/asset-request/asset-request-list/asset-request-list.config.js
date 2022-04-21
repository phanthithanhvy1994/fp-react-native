import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Edit from '@material-ui/icons/Edit';
import Delete from '@material-ui/icons/Delete';
import { FieldConstant, dateFormat, AssetRequestConstant } from '../../../../constants/constants';
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
    label: 'Asset Request No.',
    id: 'assetRequestNo',
    fieldName: 'assetRequestNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    value: ''
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [], 
    value: ''
  },
  {
    label: 'Request From (Branch)',
    id: 'branchCodeFrom',
    fieldName: 'branchCodeFrom',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [], 
    value: ''
  },
  {
    label: 'Request To (Branch)',
    id: 'branchCodeTo',
    fieldName: 'branchCodeTo',
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
    label: 'Delivery Date',
    id: 'deliveryDate',
    fieldName: 'deliveryDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
      createdDateFrom: '',
      createdDateTo: '',
    },
    searchInput: {
      label: 'Delivery Date',
      fieldName: 'deliveryDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
  },
  {
    label: 'Approved By',
    id: 'approvedBy',
    fieldName: 'approvedBy',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    value: '',
  },
  {
    label: 'Asset Location (SAP)',
    id: 'assetLocationCode',
    fieldName: 'assetLocationCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    value: ''
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
    title: 'Request No.',
    field: 'assetRequestNo',
  },
  {
    title: 'Created Date',
    field: 'createdDate',
    render: (rowData) =>
      formatDateString(rowData.createdDate, dateFormat.mainDate, true),
  },
  {
    title: 'Created By',
    field: 'createdBy',
  },
  {
    title: 'Request From (Branch)',
    field: 'branchNameFrom',
  },
  {
    title: 'Request To (Branch)',
    field: 'branchNameTo',
  },
  {
    title: 'Approved By',
    field: 'approvedBy',
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
    disabledFunc: (row) => !(row.status === AssetRequestConstant.status.draft || row.status === AssetRequestConstant.status.rejected),
  },
  {
    tooltip: 'Delete',
    icon: () => icons.delete,
    onClick: (e, rowData) => {
      confirmDeleteItem(rowData);
    },
    position: 'row',
    disabledFunc: (row) =>(row.status !== AssetRequestConstant.status.draft),
  },
];

export {
  fields,
  options,
  columnsDefault,
  action,
};
