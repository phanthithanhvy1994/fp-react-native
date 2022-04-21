import React from 'react';
import { FieldConstant, dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

const priorityList = {
  1: 'Urgent',
  2: 'Normal'
};

const headerFields = (data) => [
  {
    label: 'Branch',
    id: 'branchCodeName',
    fieldName: 'branchCodeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchCodeName) || '',
  },
  {
    label: 'PO-STO',
    id: 'poNumber',
    fieldName: 'poNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.poNumber) || '',
  },
  {
    label: 'Status',
    id: 'doStatusName',
    fieldName: 'doStatusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.doStatusName) || '',
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data ? formatDateString(data.createdDate, dateFormat.mainDate, true) : '',
  },
  {
    label: 'Created By',
    id: 'createdBy',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.createdBy) || '',
  },
  {
    label: 'Type',
    id: 'doType',
    fieldName: 'doType',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.doTypeName) || 'Material', //TEMP FOR TEST
  },
  {
    label: 'Shipment No',
    id: 'shipmentNo',
    fieldName: 'shipmentNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.shipmentNo) || '',
  },
  {
    label: 'DO',
    id: 'doNumber',
    fieldName: 'doNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.doNumber) || '',
  },
  {
    label: 'Delivery Priority',
    id: 'priority',
    fieldName: 'priority',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data?.priority && priorityList[+data.priority]) || '',
  },
  {
    label: 'Order Method',
    id: 'orderMethod',
    fieldName: 'orderMethod',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.orderMethod) || '',
  },
  {
    label: 'Reference 1',
    id: 'yourRefer',
    fieldName: 'yourRefer',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.yourRefer) || '',
  },
  {
    label: 'Reference 2',
    id: 'ourRefer',
    fieldName: 'ourRefer',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.ourRefer) || '',
  },
];

const columnsDetail = [
  {
    title: 'No.',
    field: 'no',
    width: 50,
  },
  {
    title: 'Item',
    field: 'item',
    customType: 'imageInfo',
    infoList: [
      { fieldName: 'materialCode', label: 'Code' },
      { fieldName: 'materialDescription', noLabel: true },
    ],
    cellStyle: {
      width: '25%',
    },
  },
  {
    title: 'Batch No.',
    field: 'batchNo',
  },
  {
    title: 'Order Quantity',
    field: 'orderQty',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.orderQty}
          <p>{rowData.orderUnit}</p>
        </>
      );
    },
    width: 130,
  },
  {
    title: 'Delivery Quantity',
    field: 'deliverQty',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.deliverQty}
          <p>{rowData.orderUnit}</p>
        </>
      );
    },
    width: 130,
  },
  {
    title: 'Delivery Date',
    field: 'deliveredDate',
    render: (rowData) =>
      formatDateString(rowData.deliveredDate, dateFormat.mainDate, true),
    width: 130,
  },
  {
    title: 'Notes',
    field: 'note',
  },
  {
    title: 'Status',
    field: 'statusName',
  },
  {
    title: 'Adj Quantity',
    field: 'adjQty',
  },
];

// Config for summarize total area
const totalSummarizeInGrid = [
  {
    label: 'Order Quantity',
    fieldName: 'orderQty',
  },
  {
    label: 'Delivery Quantity',
    fieldName: 'deliverQty',
  },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

export { columnsDetail, totalSummarizeInGrid, options, headerFields };
