import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  FieldConstant,
  dateFormat
} from '../../../constants/constants';
import {
  formatDateString
} from '../../../util/date-util';

const titlePage = 'Asset Transfer List';
const fields = (requestFrom, requestTo, status, type, sap, bbs) => [
  {
    label: 'From',
    id: 'branchCodeFrom',
    fieldName: 'branchCodeFrom',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: requestFrom || [],
  },
  {
    label: 'To',
    id: 'branchCodeTo',
    fieldName: 'branchCodeTo',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: requestTo || [],
  },
  {
    label: 'Asset Transfer No.',
    id: 'assetTransferNo',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Asset Request No.',
    id: 'assetRequestNo',
    fieldName: 'assetRequestNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
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
    label: 'Submitted Date',
    id: 'submittedDate',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {},
    searchInput: {
      label: 'Submitted Date',
      fieldName: 'submittedDate',
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
    data: status || [],
  },
  {
    label: 'Fixzy/SSD No.',
    id: 'ssdNo',
    fieldName: 'ssdNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Type',
    id: 'assetTransferType',
    fieldName: 'assetTransferType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: type || [],
  },
  {
    fieldType: FieldConstant.type.NONE
  },
  {
    fieldType: FieldConstant.type.NONE
  }
];

const columns = [
  {
    title: 'Status',
    field: 'statusName',
    width: 100,
  },
  {
    title: 'Type',
    field: 'assetTransferTypeName',
  },
  {
    title: 'To',
    field: 'branchCodeTo',
  },
  {
    title: 'Asset Transfer No.',
    field: 'assetTransferNo',
  },
  {
    title: 'Asset Request No.',
    field: 'assetRequestNo',
  },
  {
    title: 'Fixzy/SsdNo',
    field: 'ssdNo',
  },
  {
    title: 'Submitted Date',
    field: 'submitedDate',
    render: (rowData) => {
      return formatDateString(rowData.submitedDate, dateFormat.mainDate, true);
    },
  },
  {
    title: 'Created Date',
    field: 'createdDate',
    render: (rowData) => {
      return formatDateString(rowData.createdDate, dateFormat.mainDate, true);
    },
  },
  {
    title: 'Created By',
    field: 'createdBy',
  },
  {
    title: 'From',
    field: 'branchCodeFrom',
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
  view: < VisibilityIcon /> ,
};

const actions = (
  goToDetailPage,
) => [{
  tooltip: 'View',
  icon: () => icons.view,
  onClick: (e, rowData) => {
    goToDetailPage(rowData.assetTransferId);
  },
},];


export {
  titlePage,
  fields,
  columns,
  options,
  actions
};
