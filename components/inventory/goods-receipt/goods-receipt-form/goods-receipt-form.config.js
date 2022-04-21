import React from 'react';
import { FieldConstant, dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';

// Fields in detail form
const getFieldsTextOnly = (detailData) => [
  {
    label: 'Branch',
    fieldName: 'branchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.branchName) || '',
  },
  {
    label: 'PO/DO No.',
    fieldName: 'sapReceiptNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.poNumber) || detailData.doNumber || '',
  },
  {
    label: 'Type',
    fieldName: 'goodReceiptTypeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.goodReceiptTypeName) || '',
  },
  {
    label: 'Created By',
    fieldName: 'createdBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.createdBy) || '',
  },
  {
    label: 'Invoice No./Delivery Note',
    fieldName: 'deliveryNote',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.deliveryNote) || '',
  },
  {
    label: 'Vendor',
    fieldName: 'vendorName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.vendorName) || '',
  },
  {
    label: 'Factory',
    fieldName: 'factory',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.factory) || '',
  },
  {
    label: 'Material Document',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.materialDocument) || '',
  },
  {
    label: 'Submitted Date',
    fieldName: 'submittedTime',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (detailData && formatDateString(detailData.submittedTime || detailData.submittedTime2 || detailData.submittedTime1, null, true)) ||
      '',
  },
  {
    label: 'Remaining Time',
    fieldName: 'remainingTime',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (detailData &&
        formatDateString(detailData.remainingTime, dateFormat.time, true)) ||
      '',
  },
  {
    label: 'Truck Temperature',
    fieldName: 'truckTemperature',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.truckTemperature) || '',
  },
  {
    label: 'Note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.note) || '',
  },
  {
    label: 'Upload File',
    id: 'uploadFile',
    fieldName: 'uploadFile',
    fieldType: FieldConstant.type.UPLOAD_FILE,
    config: {
      maxValue: 4,
      disableUpload: true,
      imgArr: (detailData && detailData.imgArr) || [],
    },
    value: [],
  },
  {
    label: 'Status',
    fieldName: 'sapExportedStatusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.sapExportedStatusName) || '',
  },
  {
    label: 'Product Temperature',
    fieldName: 'productTemperature1',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.productTemperature1) || '',
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
      { fieldName: 'sku', label: 'Code' },
      { fieldName: 'description', noLabel: true },
      {
        noLabel: true,
        fieldName: 'baseUnitInfo',
        customDisplay: (data) => {
          return (
            (data.denominator &&
              data.orderUnit &&
              `${data.denominator} ${data.orderUnit} = ${data.numerator} ${data.baseUnit}`) ||
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
    title: 'Batch No.',
    field: 'batchNo',
    editable: 'never',
  },
  {
    title: 'Returned Qty',
    field: 'returnedQty',
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
    title: 'Quantity',
    field: 'quantity',
    editable: 'never',
    render: function customEdit(rowData) {
      const isBuffet = rowData.buffet;
      const fields = [
        {
          label: '',
          fieldName: 'quantity',
          fieldType: FieldConstant.type.QUANTITY,
          className: FieldConstant.class.QUANTITY,
          value: isBuffet ? '' : rowData.quantity || 1,
        },
      ];

      return (
        <>
          {fields[0].value} {rowData.uom}
        </>
      );
    },
  },
  {
    title: 'Type',
    field: 'deliveryTypeName',
    editable: 'never',
  },
  {
    title: 'Adj Qty',
    field: 'adjQty',
    editable: 'never',
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
