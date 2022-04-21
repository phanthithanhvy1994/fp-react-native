import React from 'react';
import {
  AssetTrackingConstant,
  dateFormat,
  FieldConstant,
} from '../../../../constants//constants';
import { formatDateString } from '../../../../util/date-util';

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
    label: 'Asset Transfer Tracking No.',
    id: 'assetTrackingNo',
    fieldName: 'assetTrackingNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.assetTrackingNo) || '',
  },
  {
    label: 'Status',
    id: 'statusName',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.statusName) || '',
  },
  {
    label: 'Create By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.createdBy) || '',
  },
  {
    label: 'Create Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.createdDate && formatDateString(data.createdDate, dateFormat.mainDate, true)) || '',
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
      { fieldName: 'assetTypeName',
        noLabel: true,
        customDisplay: (data) => {
          return (
            `Asset Code: ${data.assetMasterTbl.assetNo}`
          );
        },
      },
      { fieldName: 'description',
        noLabel: true,
        customDisplay: (data) => {
          return (
            `${data.assetMasterTbl.description}`
          );
        },
      },
      { 
        fieldName: 'unitInfo',
        noLabel: true,
        customDisplay: (data) => {
          return (
            (data.assetMasterTbl.uom &&
                `${data.assetMasterTbl.quantity} ${data.assetMasterTbl.uom}`) ||
              ''
          );
        },
      },
    ],
    cellStyle: {
      width: 220,
      fontSize: '12px'
    },
  },
  {
    title: 'Asset Transfer No.',
    field: 'assetTransferNo',
    editable: 'never',
    width: 220,
    cellStyle: {
      textAlign: 'center',
      fontSize: '12px'      
    },
  },
  {
    title: 'Transfer Quantity',
    field: 'quantity',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.quantity}
          <p>{rowData.assetMasterTbl.uom}</p>
        </>
      );
    },
    editable: 'never',
    width: 220,
    cellStyle: {
      textAlign: 'center', 
      fontSize: '12px'     
    },
  },
  {
    title: 'Tracking Status',
    field: 'confirmed',
    editable: 'never',
    render: function customRender(rowData) {
      return (
        `${+rowData.confirmed === AssetTrackingConstant.status.confirm ?
          AssetTrackingConstant.statusName.confirm : AssetTrackingConstant.statusName.unConfirm}`
      );
    },
    width: 220,
    cellStyle: {
      textAlign: 'center', 
      fontSize: '12px'     
    },
  },  
];

// Config for summarize total area
const totalSummarizeInGrid = [];

export {
  options,
  fieldsLabelArray,
  columnsDetail,
  totalSummarizeInGrid
};
