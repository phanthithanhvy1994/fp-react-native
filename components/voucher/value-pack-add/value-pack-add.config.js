import React from 'react';
import { Delete } from '@material-ui/icons';
import {
  FieldConstant,
  AddValuePackConstant,
} from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import Fields from '../../shared/fields/fields.component';

const fields = [
  {
    label: 'Value Pack Name',
    id: 'valuePackName',
    fieldName: 'valuePackName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    validation: {
      required: 'Required',
    },
  },
  {
    label: 'Total Value',
    id: 'totalValue',
    fieldName: 'totalValue',
    fieldType: FieldConstant.type.QUANTITY,
    required: true,
    value: '',
    maximumValue: 999999999,
    numberDecimalCharacter: 0,
    increaseInValue: 100,
    isOnFormField: true,
    unitLabel: AddValuePackConstant.valueUnit,
    validation: {
      required: 'Required',
    },
  },
  {
    label: 'Value Pack Qty',
    id: 'valuePackQty',
    fieldName: 'valuePackQty',
    fieldType: FieldConstant.type.QUANTITY,
    required: true,
    maximumValue: 999999999,
    numberDecimalCharacter: 0,
    increaseInValue: 10,
    isOnFormField: true,
    validation: {
      required: 'Required',
    },
    value: 1,
  },
  {
    label: 'Note',
    fieldName: 'note',
    id: 'note',
    fieldType: FieldConstant.type.TEXT_AREA,
    className: FieldConstant.class.TEXT_AREA,
    noPlaceHolder: true,
    classCustom: 'add-value-pack-text-area',
  },
];

const validation = [
  {
    name: 'valuePackName',
    rule: {
      required: `${AddValuePackConstant.fieldsLabel.valuePackName} is required`,
      maxLength: {
        value: 64,
        message: Message.ADD_VALUE_PACK.FIELD_SIZE.replace(
          '<Field Name>',
          AddValuePackConstant.fieldsLabel.valuePackName
        ).replace('<Field size>', 64),
      },
    },
  },
  {
    name: 'totalValue',
    rule: {
      required: `${AddValuePackConstant.fieldsLabel.totalValue} is required`,
      maxLength: {
        value: 5,
        message: Message.ADD_VALUE_PACK.FIELD_SIZE.replace(
          '<Field Name>',
          AddValuePackConstant.fieldsLabel.totalValue
        ).replace('<Field size>', 5),
      },
      min: {
        value: 1,
        message: Message.ADD_VALUE_PACK.FIELD_VALUE_NUMBER.replace(
          '<Field Name>',
          AddValuePackConstant.fieldsLabel.totalValue
        ).replace('<Field value number>', 0),
      },
    },
  },
  {
    name: 'valuePackQty',
    rule: {
      required: `${AddValuePackConstant.fieldsLabel.valuePackQty} is required`,
      min: {
        value: 1,
        message: Message.ADD_VALUE_PACK.FIELD_VALUE_NUMBER.replace(
          '<Field Name>',
          AddValuePackConstant.fieldsLabel.valuePackQty
        ).replace('<Field value number>', 0),
      },
    },
  },
  {
    name: 'note',
    rule: {
      maxLength: {
        value: 256,
        message: Message.ADD_VALUE_PACK.FIELD_SIZE.replace(
          '<Field Name>',
          AddValuePackConstant.fieldsLabel.note
        ).replace('<Field size>', 256),
      },
    },
  },
];

const totalSummarizeInGrid = { fieldName: 'valueTotal', label: 'Total' };

const columnsDefault = (onFieldChange) => [
  {
    title: 'Voucher Mat Desc',
    field: 'voucherValueType',
  },
  {
    title: 'Quantity',
    field: 'quantity',
    width: 170,
    render: function customEdit(rowData) {
      const quantityField = [
        {
          label: '',
          fieldName: 'quantity',
          id: `quantity${rowData.id}`,
          fieldType: FieldConstant.type.QUANTITY,
          className: FieldConstant.class.QUANTITY,
          value: rowData.quantity || 0,
          maximumValue: '999999999',
          minimumValue: '1',
          numberDecimalCharacter: 0,
        },
      ];

      return (
        <>
          <Fields
            conditionalArray={quantityField}
            onChange={(item, newValue) => {
              onFieldChange(AddValuePackConstant.quantity, newValue, rowData);
            }}
          />
        </>
      );
    },
    headerStyle: {
      textAlign: 'center',
    },
    cellStyle: {
      textAlign: 'center',
    },
  },
  {
    title: 'Value',
    field: 'value',
    render: function customRender(rowData) {
      return (
        <>
          {rowData.value} {AddValuePackConstant.valueUnit}
        </>
      );
    },
    headerStyle: {
      textAlign: 'right',
    },
    cellStyle: {
      textAlign: 'right',
      paddingRight: '15px',
    },
  },
];

const fieldOnTopGrid = [
  {
    label: 'Voucher Mat Desc',
    id: 'voucherValueType',
    fieldName: 'voucherValueType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.SELECT,
    data: [],
    required: true,
  },
];

const options = {
  search: false,
  draggable: false,
  toolbar: false,
  paging: false,
  exportButton: false,
  sorting: false,
  showTitle: false,
  selection: false,
};

const icons = {
  delete: <Delete />,
};

const actions = (removeVoucherValueItems) => [
  {
    icon: () => icons.delete,
    tooltip: 'Delete',
    onClick: (event, rowData) => {
      removeVoucherValueItems(rowData);
    },
    position: 'row',
  },
];

export {
  fields,
  validation,
  options,
  columnsDefault,
  totalSummarizeInGrid,
  fieldOnTopGrid,
  actions,
};
