import React from 'react';
import { FieldConstant, dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';
import Button from '../../../shared/buttons/button.component';

const titlePage = (id) => `View Asset Transfer Details <No. ${id}>`;

// Common option for detail information grid.
const options = {
  search: false,
  sorting: false,
  showTitle: false,
  paging: false,
};

// Config allow to add the same item multiple times on AddItems popup
const isShowScanTimeLine = true;

// Config for General information
const fieldsLabelArray = (data) => [
  {
    label: 'From',
    id: 'branchCodeFrom',
    fieldName: 'branchCodeFrom',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchCodeFrom) || '',
  },
  {
    label: 'To',
    id: 'branchCodeTo',
    fieldName: 'branchCodeTo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.branchCodeTo) || '',
  },
  {
    label: 'Type',
    id: 'assetTransferType',
    fieldName: 'assetTransferType',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.assetTransferType) || '',
  },
  {
    label: 'Asset Transfer No.',
    id: 'assetTransferNo',
    fieldName: 'assetTransferNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.assetTransferNo) || '',
  },
  {
    label: 'Asset Request No.',
    id: 'assetRequestNo',
    fieldName: 'assetRequestNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.assetRequestNo) || '',
  },
  {
    label: 'Fixzy/SSD No.',
    id: 'ssdNo',
    fieldName: 'ssdNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.ssdNo) || '',
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (data && formatDateString(data.createdDate, dateFormat.mainDate, true)) ||
      '',
  },
  {
    label: 'Submitted Date',
    id: 'submittedDate',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (data &&
        formatDateString(data.submittedDate, dateFormat.mainDate, true)) ||
      '',
  },
  {
    label: 'Lending Period',
    id: 'lending',
    fieldName: 'lending',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.lending) || '',
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.statusName) || '',
  },
  {
    label: 'Note',
    id: 'notes',
    fieldName: 'notes',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (data && data.notes) || '',
  },
];

// Config columns details
const columnsDetail = (handleWriteOff) => [
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
    customType: 'imageInfo',
    infoList: [
      {
        fieldName: 'assetCode',
        label: 'Asset Code',
      },
      {
        fieldName: 'decription',
        label: 'Description',
      },
      {
        fieldName: 'unit',
        noLabel: true,
        customDisplay: (data)=> `${data?.quantity} ${data.baseUom ?? ''}`
      },
    ],
  },
  {
    title: 'Asset Request No.',
    field: 'assetRequestNo',
    editable: 'never',
  },
  {
    title: 'Receiving Location (SAP)',
    field: 'assetLocationCode',
    editable: 'never',
  },
  {
    title: 'Transfer Quantity',
    field: 'quantity',
    editable: 'never',
  },
  {
    title: 'Received Quantity',
    field: 'receivedQty',
    editable: 'never',
  },
  {
    title: 'Status',
    field: 'statusName',
    editable: 'never',
  },
  {
    title: '',
    field: '',
    editable: 'never',
    render: function customEdit(rowData) {
      return rowData ? (
        <Button
          handleClick={() => handleWriteOff()}
          className="btnNeutral"
          isFontAwesome={false}
          title="Write-off"
          disabled={false}
          // classCustom={classes.btnClear}
        />
      ) : (
        ''
      );
    },
  },
];

// For detail page
const bottomGridButtonsArray = [
  {
    title: 'Print',
    handleFor: 'print',
    handleClick: null,
    className: 'btnSecondary',
    hidden: false,
  },
];

// Config for summarize total area
const totalSummarizeInGrid = [
  {
    label: 'Total',
    fieldName: 'quantity',
  },
];

export {
  titlePage,
  options,
  fieldsLabelArray,
  columnsDetail,
  bottomGridButtonsArray,
  totalSummarizeInGrid,
  isShowScanTimeLine,
};
