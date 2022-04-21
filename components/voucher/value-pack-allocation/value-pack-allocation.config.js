import React from 'react';
import {
  FieldConstant,
  Voucher,
  ValuePackAllocationConstant,
  dateFormat,
} from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';
import Delete from '@material-ui/icons/Delete';
import ChevronRightRoundedIcon from '@material-ui/icons/ChevronRightRounded';
import { ReactComponent as ScanQR } from '../../../assets/scanQR.svg';
import { Message } from '../../../constants/messages';

const fieldArray = (detailData, onFieldChange, onClickLoadVPNoBtn) => [
  {
    label: 'Value Pack No',
    id: Voucher.valuePackAllocationFieldName.valuePackNo,
    fieldName: Voucher.valuePackAllocationFieldName.valuePackNo,
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
    customOnChange: (event) => {
      onFieldChange(Voucher.valuePackAllocationFieldName.valuePackNo, event);
    },
    required: true,
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
      handleClick: () => {
        console.log('Go to scan QR');
      },
    },
    endAction: {
      className: 'btn-end-action',
      icon: function customIcon() {
        return <ChevronRightRoundedIcon />;
      },
      onClick: onClickLoadVPNoBtn,
    },
    value: (detailData && detailData.valuePackNo) || '',
  },
];

const fieldsLabelArray = (detailData) => {
  const fields = [
    {
      label: 'Value Pack Name',
      fieldName: Voucher.valuePackAllocationFieldName.packName,
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.packName) || '',
    },
    {
      label: 'Total Value',
      fieldName: Voucher.valuePackAllocationFieldName.totalValue,
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: (detailData && detailData.totalValue) || '',
    },
  ];

  if (
    detailData &&
    detailData.packVoucherDetails &&
    detailData.packVoucherDetails.length
  ) {
    detailData.packVoucherDetails.forEach((item) => {
      const voucherTypeField = {
        label: `Voucher ${item.voucherValue} ${ValuePackAllocationConstant.valueUnit}`,
        fieldName: ValuePackAllocationConstant.generalFieldName.quantity,
        fieldType: FieldConstant.type.TEXT_ONLY,
        value: item.quantity || '',
      };

      fields.push(voucherTypeField);
    });
  }

  return fields;
};

const columnsDetail = [
  {
    title: 'Item No',
    field: 'lineNumber',
    editable: 'never',
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    },
    width: 150,
  },
  {
    title: 'Voucher Serial No',
    field: 'serialNo',
    editable: 'never',
  },
  {
    title: 'Voucher Value',
    field: 'voucherValue',
    editable: 'never',
    cellStyle: {
      textAlign: 'center',
    },
    headerStyle: {
      textAlign: 'center',
    },
    render: function customRender(rowData) {
      return (
        <>
          <span>
            {rowData.voucherValue} {ValuePackAllocationConstant.valueUnit}
          </span>
        </>
      );
    },
  },
  {
    title: 'Status',
    field: 'voucherStatusName',
    editable: 'never',
  },
  {
    title: 'Valid From',
    field: 'validFrom',
    editable: 'never',
    render: (rowData) =>
      formatDateString(rowData.validFrom, dateFormat.mainDate, true),
  },
  {
    title: 'Valid To',
    field: 'validTo',
    editable: 'never',
    render: (rowData) =>
      formatDateString(rowData.validTo, dateFormat.mainDate, true),
  },
];

const actions = (handleDelete) => [
  {
    icon: Delete,
    tooltip: 'View',
    onClick: (event, rowData) => {
      handleDelete(rowData);
    },
  },
];

const bottomGridButtonsArray = (onCancel, onSave) => [
  {
    title: 'Cancel',
    handleFor: 'cancel',
    className: 'btnNeutral',
    classCustom: 'noOutLineBtn',
    handleClick: onCancel,
  },
  {
    title: 'Save',
    handleFor: 'save',
    className: 'btnPrimary',
    handleClick: onSave,
  },
];

const options = {
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: false,
};

const bottomGridLabel = 'Please scan!';

const totalSummarizeInGrid = [
  { fieldName: 'orderQuantity', label: 'Total Order Quantity' },
  { fieldName: 'scannedQuantity', label: 'Total Scanned Quantity' },
];

const validation = [
  {
    name: Voucher.valuePackAllocationFieldName.valuePackNo,
    rule: {
      required: `Value Pack No ${Message.FIELD_REQUIRED}`,
    },
  },
];

export {
  actions,
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  totalSummarizeInGrid,
  options,
  bottomGridLabel,
  validation,
  fieldArray,
};
