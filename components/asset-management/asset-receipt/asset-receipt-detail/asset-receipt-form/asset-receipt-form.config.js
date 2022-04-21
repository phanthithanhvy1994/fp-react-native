import React from 'react';
import { FieldConstant, dateFormat } from '../../../../../constants/constants';
import { formatDateString } from '../../../../../util/date-util';

// Fields in detail form
const getFieldsTextOnly = (detailData) => [
  {
    label: 'Branch',
    fieldName: 'branchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.branchName) || '',
  },
  {
    label: 'Asset Receipt No.',
    fieldName: 'assetReceiptNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.assetReceiptNo) || detailData.assetReceiptNo || '',
  },
  {
    label: 'Asset Transfer No.',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.assetTransferNo) || '',
  },
  {
    label: 'From',
    fieldName: 'from',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.from) || '',
  },
  {
    label: 'Fixzy/SSD No.',
    fieldName: 'fixzyNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.fixzyNo) || '',
  },
  {
    label: 'Lending Period',
    fieldName: 'lendingPeriod',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.lendingPeriod) || '',
  },
  {
    label: 'Created By',
    fieldName: 'createdByName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.createdByName) || '',
  },
  {
    label: 'Created Date',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (detailData && formatDateString(detailData.createdDate, null, true)) ||'',
  },
  {
    label: 'Status',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.statusName) || '',
  },
  {
    label: 'Note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.note) || '',
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

const getFields = () => [];

// Columns in grid on Details page
const columnsDetailsConfig = [
  {
    title: 'No.',
    field: 'lineNumber',
    editable: 'never',
    width: 50,
  },
  {
    title: 'Item',
    field: 'item',
    editable: 'never',
    customType: 'imageInfo',
    infoList: [
      { fieldName: 'assetTypeName',
        noLabel: true,
        customDisplay: (data) => {
          return (
            `Asset Code: ${data.assetMasterTbl?.assetNo}`
          );
        },
      },
      { fieldName: 'description',
        noLabel: true,
        customDisplay: (data) => {
          return (
            `${data.assetMasterTbl?.description}`
          );
        },
      },
      { 
        fieldName: 'unitInfo',
        noLabel: true,
        customDisplay: (data) => {
          return (
            (data.assetMasterTbl?.uom &&
                `${data.assetMasterTbl?.quantity} ${data.assetMasterTbl?.uom}`) ||
              ''
          );
        },
      },
    ],
    cellStyle: {
      width: '27%',
    },
  },
  {
    title: 'Receiving Location (SAP)',
    field: 'receivingLocation',
    editable: 'never',
  },
  {
    title: 'Location (BBS)',
    field: 'locationBBS',
    editable: 'never',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.returnedQty > 0 && (
            <>
              {rowData.returnedQty || '0'} {rowData.uom}
            </>
          )}
        </>
      );
    },
  },
  {
    title: 'Transfer Qty.',
    field: 'transferQuantity',
    editable: 'never',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.quantity}
          <p>{rowData.assetMasterTbl?.uom}</p>
        </>
      );
    },
  },
  {
    title: 'Status',
    field: 'statusName',
    editable: 'never',
  },
  // {
  //   title: 'Adj. Qty.',
  //   field: 'adjQty',
  //   editable: 'never',
  // },
  {
    title: 'Adj. Qty.',
    field: 'adjQty',
    editable: 'never',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.adjustQuantity}
          <p>{rowData.assetMasterTbl?.uom}</p>
        </>
      );
    },
  },
];

const bottomGridButtons = [
  {
    title: 'Close',
    handleFor: 'close',
    className: 'btnNeutral',
    handleClick: null,
    hidden: true,
    displayByStatus: ['Open', 'Rejected'],
  },
];

const options = {
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: false,
};

// Config for summarize total area
const totalSummarizeInGrid = [];

export {
  getFields,
  getFieldsTextOnly,
  columnsDetailsConfig,
  options,
  bottomGridButtons,
  totalSummarizeInGrid,
};
