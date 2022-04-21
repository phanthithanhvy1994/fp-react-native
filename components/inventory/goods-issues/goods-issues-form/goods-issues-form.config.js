import React from 'react';
import {
  FieldConstant,
  ReturnRequestConstant,
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import Fields from '../../../shared/fields/fields.component';
import { getFinalBaseUnitValue } from './goods-issues-form.common';
import { formatNumber } from '../../../../util/format-util';
import RequiredColumnTitle from '../../../shared/table-grid/required-column-title/required-column-title';


// Fields in general infomation form for add/edit
const getFields = (
  onOrderTypeChange,
  onOrderBranchChange,
  isEditPage
) => [
  {
    label: 'Department',
    id: 'departmentCode',
    fieldName: 'departmentCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    disabled: true,
    required: true,
    validation: {
      required: 'Required',
    },
  },
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onOrderBranchChange,
    required: true,
    validation: {
      required: 'Required',
    },
    disabled: isEditPage
  },
  {
    label: 'Type',
    id: 'typeCode',
    fieldName: 'typeCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onOrderTypeChange,
    required: true,
    validation: {
      required: 'Required',
    },
    disabled: isEditPage
  },
  {
    label: 'Header Note',
    id: 'headerNote',
    fieldName: 'headerNote',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    disabled: true,
    format: 'dd.MM.yyyy',
    value: Date.now()
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    disabled: true
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

const validation = () => [
  {
    name: 'departmentCode',
    rule: {
      required: `Department ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'branchCode',
    rule: {
      required: `Branch ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'typeCode',
    rule: {
      required: `Type ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'headerNote',
    rule: {
      maxLength: {
        value: 25,
        message: 'Header note should not exceed the maxLength than 25',
      },
      required: `Header Note ${Message.FIELD_REQUIRED}`,
    },
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
  selection: true,
};

// Config for summarize total area
const totalSummarizeInGrid = [];

// Config allow to add the same item multiple times on AddItems popup
const isShowScanTimeLine = true;

// Config for action in detail grid
const actions = (hidden = '') => [
  {
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: hidden === '',
    // tricky for removing material table warning
    icon: () => {},
    onClick: () => {},
  },
  {
    tooltip: 'Select Items',
    isFreeAction: true,
    hidden: hidden === '',
    isAddItemsPopup: true,
    // tricky for removing material table warning
    icon: () => {},
    onClick: () => {},
  },
];

// Columns of grid in add/edit page
const noField = {
  title: 'No.',
  field: 'no',
  editable: 'never',
  width: 30,
};
const itemField = {
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
            `${data.denominator} ${data.orderUnit} = ${data.numerator} ${data.baseUom}`) ||
          ''
        );
      },
    },
  ],
  cellStyle: {width: '25%'}
};

const totalIssueQtyField = {
  title: 'Total Issue Qty.',
  field: 'totalQuantity',
  editable: 'never',
  width: 180,
  render: function customRender(rowData) {
    return (
      <>
        <span>
          {formatNumber(getFinalBaseUnitValue(rowData))} {rowData.baseUom}
        </span>
      </>
    );
  },
};
const reasonField = (onFieldChange, configItemDataOnGrid) => ({
  title: <RequiredColumnTitle titleName="Reason" isRequired={true} />,
  field: 'reasonCode',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'reason',
        id: `reason${rowData.id}`,
        fieldType: FieldConstant.type.SELECT,
        className: FieldConstant.class.SELECT,
        classCustom: 'full-width-column-field',
        value: rowData.reasonCode || '',
        data: configItemDataOnGrid.reason,
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            'reasonCode',
            e.target.value,
            rowData
          )
        }
      />
    );
  },
  width: 180,
});
const internalOrder = (onFieldChange, configItemDataOnGrid) => ({
  title: 'Internal Order',
  field: 'internalOrder',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'internalOrder',
        id: `internalOrder${rowData.id}`,
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: configItemDataOnGrid.isInternalOrder ? '' : (rowData.internalOrder || ''),
        disabled: configItemDataOnGrid.isInternalOrder
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            'internalOrder',
            e.target.value,
            rowData
          )
        }
      />
    );
  },
  width: 180,
});
const costCenter = (onFieldChange, configItemDataOnGrid) => ({
  title: 'Cost Center',
  field: 'costCenter',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'costCenter',
        id: `costCenter${rowData.id}`,
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: (rowData.internalOrder?.startsWith('S') || !configItemDataOnGrid.isCostCenter) ? (rowData.costCenter || '') : '',
        disabled: rowData.internalOrder?.startsWith('S') ? false : configItemDataOnGrid.isCostCenter
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            'costCenter',
            e.target.value,
            rowData
          )
        }
      />
    );
  },
  width: 180,
});
const noteField = (onFieldChange) => ({
  title:  <RequiredColumnTitle titleName="Note" isRequired={true} />,
  field: 'note',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'note',
        id: `note${rowData.id}`,
        fieldType: FieldConstant.type.TEXT_AREA,
        className: FieldConstant.class.TEXT_AREA,
        noPlaceHolder: true,
        classCustom: 'full-width-column-field custom-height-column-field',
        value: rowData.note || '',
        rowsMin: 3,
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(ReturnRequestConstant.note, e.target.value, rowData)
        }
      />
    );
  },
  width: 180,
});
const issueOrderQtyField = (onFieldChange) => ({
  title: 'Issue Order Qty.',
  render: function customEdit(rowData) {
    const orderUnitQtyFields = [
      {
        label: '',
        fieldName: 'orderQuantity',
        id: `orderQuantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.orderQuantity || 0,
        disabled: rowData.orderUnit === rowData.baseUom ? true : false,
        // classCustom: rowData.orderUnit === rowData.baseUom ? 'btnDisable' : ''
      },
    ];

    return (
      <>
        <div className="qty-value">
          <Fields
            conditionalArray={orderUnitQtyFields}
            onChange={(item, newValue) => {
              onFieldChange('orderQuantity', newValue, rowData);
            }}
          />
        </div>

        <p className="order-unit-qty">{rowData.orderUnit}</p>
      </>
    );
  },
  width: 180,
});
const issueBasedQtyField = (onFieldChange) => ({
  title: 'Issue Bases Qty.',
  render: function customEdit(rowData) {
    const baseUnitQtyField = [
      {
        label: '',
        fieldName: 'baseQuantity',
        id: `baseQuantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.baseQuantity || 0,
      },
    ];
    return (
      <>
        <div className="qty-value">
          <Fields
            conditionalArray={baseUnitQtyField}
            onChange={(item, newValue) => {
              onFieldChange(
                'baseQuantity',
                newValue,
                rowData
              );
            }}
          />
        </div>
        <p className="base-unit-qty">{rowData.baseUom}</p>
      </>
    );
  },
  width: 180,
});

const columnsForVendor = (onFieldChange, configItemDataOnGrid) => [
  noField,
  itemField,
  issueOrderQtyField(onFieldChange),
  issueBasedQtyField(onFieldChange),
  totalIssueQtyField,
  reasonField(onFieldChange, configItemDataOnGrid),
  internalOrder(onFieldChange, configItemDataOnGrid),
  costCenter(onFieldChange, configItemDataOnGrid),
  noteField(onFieldChange),
];

// Fields in search form on 'Add items' form
const addItemsFieldArray = [
  {
    label: 'Material Type',
    id: 'materialType',
    fieldName: 'materialType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Material Code',
    id: 'materialCode',
    fieldName: 'materialCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Material Group',
    id: 'materialGroup',
    fieldName: 'materialGroup',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Material Description',
    id: 'materialDescription',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

export {
  getFields,
  validation,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  columnsForVendor,
  isShowScanTimeLine,
};
