import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import {
  FieldConstant,
  dateFormat
} from '../../../../constants/constants';
import {
  formatDateString
} from '../../../../util/date-util';
import moment from 'moment';


const titlePage = 'Asset Transfer Tracking List';
const currentDate = formatDateString(Date.now(), dateFormat.mainDate);

const fields = [
  {
    label: 'Asset Transfer Tracking No.',
    id: 'assetTrackingNo',
    fieldName: 'assetTrackingNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    maxLength: 10,
  },
  {
    label: 'Asset Transfer No.',
    id: 'assetTransferNo',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.SELECT,
    data: [],
  },

  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    maxLength: 12,
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',    
    value:{
      ge: moment().subtract(1, 'months').format(dateFormat.yyyymmddStartDay),
      le: moment().format(dateFormat.yyyymmddEndDay),
    },

    initialValue: {
      ge: moment().subtract(1, 'months').format(dateFormat.yyyymmddStartDay),
      le: moment().format(dateFormat.yyyymmddEndDay),
    },
    // value: {},
    searchInput: {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
    },
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
    width: 205,
  },
  {
    title: 'Asset Transfer Tracking No.',
    field: 'assetTrackingNo',
    // width: 350,
  },
  {
    title: 'Created Date',
    field: 'createdDate',
    render: (rowData) => {
      return formatDateString(rowData.createdDate, dateFormat.mainDate, true);
    },
    width: 304,
  },
  {
    title: 'Created By',
    field: 'createdBy',
    width: 304,
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
  view: < VisibilityIcon />,
};

const actions = (
  goToDetailPage,
) => [{
  tooltip: 'View',
  icon: () => icons.view,
  onClick: (e, rowData) => {
    goToDetailPage(rowData.assetTrackingId);
  },
},];


export {
  titlePage,
  fields,
  columns,
  options,
  actions
};
