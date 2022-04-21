import React from 'react';
import {
  FieldConstant,
  AssetRequestConstant,
  dateFormat
} from '../../../../constants//constants';
import { formatDateString } from '../../../../util/date-util';
import { formatNumber } from '../../../../util/format-util';

// Common option for detail information grid.
const options = {
  search: false,
  sorting: false,
  showTitle: false,
  paging: false,
};

// Config for General information
const fieldsLabelArray = (data) => [
  {
    label: 'Request Form (Branch)',
    id: 'branchNameFrom',
    fieldName: 'branchNameFrom',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchNameFrom) || '',
  },
  {
    label: 'Request To (Branch)',
    id: 'branchNameTo',
    fieldName: 'branchNameTo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchNameTo) || '',
  },
  {
    label: 'Approved By',
    id: 'approvedBy',
    fieldName: 'approvedBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.approvedBy) || '',
  },
  {
    label: 'Status',
    id: 'statusName',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.statusName) || '',
  },
  {
    label: 'Rejection Reason',
    id: 'rejectionReason',
    fieldName: 'rejectionReason',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.rejectionReason) || '',
  },
  {
    label: 'Fixzy/SSD No. ',
    id: 'ssdNo',
    fieldName: 'ssdNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.ssdNo) || '',
  },                                           
  {
    label: 'Notes',
    id: 'notes',
    fieldName: 'notes',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.notes) || '',
  },
];

// Config columns details
const columnsDetail = () => [
  {
    title: 'No.',
    field: 'no',
    editable: 'never',
    width: 16,
  },
  {
    title: 'Item',
    field: 'item',
    editable: 'never',
    width: 220,
    customType: 'imageInfo',
    infoList: [
      { fieldName: 'assetTypeName', label: 'Asset Type' },
      { fieldName: 'assetCategoryName', label: 'Category' },
      { fieldName: 'assetSubCategoryName', label: 'Sub Category' },
    ],
    cellStyle: {
      width: 318,
      fontSize: '12px'
    },
  },
  {
    title: 'Unit Price (Baht)',
    field: 'unitPrice',
    editable: 'never',
    width: 140,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px'      
    },
    render: (rowData) => formatNumber(+rowData.unitPrice),
  },
  {
    title: 'Delivery Date',
    field: 'deliveryDate',
    editable: 'never',
    width: 136,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right', 
      fontSize: '12px'     
    },
    render: (rowData) => formatDateString(rowData.deliveryDate, dateFormat.ddmmyyyy, true)
  },
  {
    title: 'Damaged Qty.',
    field: 'damagedQty',
    editable: 'never',
    width: 120,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',   
      fontSize: '12px'  
    },
    render: (rowData) => {
      return rowData?.damagedQty ? rowData?.damagedQty : '-';
    },
  },
  {
    title: 'Quantity',
    field: 'quantity',
    editable: 'never',
    width: 117,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',   
      fontSize: '12px'  
    },
  },
  {
    title: 'Total Amount',
    field: 'amount',
    editable: 'never',
    width: 159,
    headerStyle: {
      textAlign: 'right'
    },
    cellStyle: {
      textAlign: 'right',
      fontSize: '12px'
    },
    render: (rowData) => formatNumber(+rowData.amount),
  },
  {
    title: 'Note',
    field: 'notes',
    editable: 'never',
    width: 130,
    headerStyle: {
      textAlign: 'left'
    },    
    cellStyle: {
      textAlign: 'left',
      fontSize: '12px'
    }
  },   
];

// For detail page
const bottomGridButtonsArray = (status) => {
  return [
    {
      title: 'Edit',
      handleFor: 'edit',
      className: 'btnSecondary',
      handleClick: null,
      hidden: !(status === AssetRequestConstant.status.draft || status === AssetRequestConstant.status.rejected),    
    },
    {
      title: 'Close Document',
      handleFor: 'close',
      className: 'btnNeutral',
      handleClick: null,  
      hidden: !(status === AssetRequestConstant.status.draft || status === AssetRequestConstant.status.rejected) 
    },
    {
      title: 'Reject',
      handleFor: 'reject',
      className: 'btnDanger',
      handleClick: null,
      hidden: !(status === AssetRequestConstant.status.wait),   
    },
    {
      title: 'Approve',
      handleFor: 'approve',
      className: 'btnPrimary',
      handleClick: null,
      hidden: !(status === AssetRequestConstant.status.wait),     
    },
    {
      title: 'Print',
      handleFor: 'print',
      className: 'btnSecondary',
      handleClick: null,
      hidden: !(status === AssetRequestConstant.status.approved),     
    },
  ];
};
// Config for summarize total area
const totalSummarizeInGrid = [
  {
    label: 'Total',
    fieldName: 'amount',
  }
];

export {
  options,
  fieldsLabelArray,
  columnsDetail,
  bottomGridButtonsArray,
  totalSummarizeInGrid
};
