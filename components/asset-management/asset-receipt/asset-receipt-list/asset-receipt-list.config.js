import React from 'react';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { FieldConstant, dateFormat, GRConstant } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';
import moment from 'moment';

const columns = [
  {
    title: 'Status',
    field: 'statusName'
  },
  {
    title: 'Asset Receipt No.',
    field: 'assetReceiptNo'
  },
  {
    title: 'Asset Transfer No.',
    field: 'assetTransferNo',
    // defaultSort: 'desc'
  },
  {
    title: 'From',
    field: 'branchCodeFrom',
  },
  {
    title: 'Fixzy/SSD No.',
    field: 'fixzyNo'
  },
  {
    title: 'Submitted Date',
    field: 'submittedDate',
    render: function customRender(rowData) {
      return formatDateString(rowData.submittedDate, dateFormat.mainDate, true);
    },
  },  
  {
    title: 'Created Date',
    field: 'createdDate',
    render: function customRender(rowData) {
      return formatDateString(rowData.createdDate, dateFormat.mainDate, true);
    },
  },
  {
    title: 'Created By',
    field: 'createdBy'
  },


  { title: 'Branch', field: 'branchName' },
];

const columnsForSearchPopup = [
  { title: 'Status', field: 'statusName' },
  { title: 'Type', field: 'goodReceiptTypeName' },
  {
    title: 'PO/DO No.',
    field: 'refNumber',
    hidden: true,
  },
  { title: 'Vendor', field: 'vendorName' },
  { title: 'Invoice No./Delivery Note', field: 'deliveryNote' },
  {
    title: 'Submitted Date',
    field: 'submittedTime',
    render: function customRender(rowData) {
      return formatDateString(rowData.submittedTime, dateFormat.mainDate, true);
    },
  },
  { title: 'Created By', field: 'createdBy' },
  { title: 'Material Document', field: 'materialDocument' },

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

const fields = (isSearchPopup) => [
  {
    label: 'Branch',
    id: 'branch',
    fieldName: 'branch',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    // hidden: isSearchPopup,
  },
  {
    label: 'Asset Receipt No.',
    id: 'assetReceiptNo',
    fieldName: 'assetReceiptNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
    // hidden: isSearchPopup,
  },
  {
    label: 'Asset Transfer No.',
    id: 'assetTransferNo',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    label: 'From',
    id: 'from',
    fieldName: 'from',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    classCustom: '',
    // hidden: isSearchPopup,
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
    // hidden: isSearchPopup,
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {
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
    label: 'Submitted Date',
    id: 'submittedDate',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.RANGE_INPUT,
    className: FieldConstant.class.RANGE_INPUT,
    inputType: 'date',
    value: {},
    // initialValue: {
    //   ge: moment().subtract(1, 'months').format(dateFormat.yyyymmddStartDay),
    //   le: moment().format(dateFormat.yyyymmddEndDay),
    // },
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
    data: [],
    value: isSearchPopup ? { value: GRConstant.searchPopup.defaultStatusValue, display: GRConstant.searchPopup.defaultStatusDisplay } : ''
  },
  {
    label: 'Fixzy/SSD No.',
    id: 'fixzySsdNo',
    fieldName: 'fixzySsdNo',
    fieldType: FieldConstant.type.TEXT,
    required: false,
    data: [],
    className: FieldConstant.class.TEXT,
    classCustom: '',
  },
  {
    fieldType: FieldConstant.type.NONE,
    // hidden: !isSearchPopup,
  },
];

const icons = {
  view: <VisibilityIcon />,
};

const actions = (goToDetailPage) => [
  {
    icon: () => icons.view,
    tooltip: 'View',
    onClick: (event, rowData) => {
      goToDetailPage(rowData);
    },
  },
];

export { columns, columnsForSearchPopup, options, fields, actions };
