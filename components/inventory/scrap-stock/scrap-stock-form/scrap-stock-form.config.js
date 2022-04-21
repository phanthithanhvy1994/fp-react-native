import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';

import {
  FieldConstant,
  ScrapStockConstant,
  MaterialUnitIsDecimal
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import Fields from '../../../shared/fields/fields.component';

const getFields = () => [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    data: [],
    disabled: true,
    required: true,
  },
  {
    label: 'Approve By',
    id: 'approveBy',
    fieldName: 'approveBy',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    disabled: true,
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    disabled: true,
  },
  {
    label: 'Note',
    id: 'note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    maxLength: 256,
  },
];

const validation = [
  {
    name: 'branch',
    rule: {
      required: `Branch ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'inventory',
    rule: {
      required: `Inventory ${Message.FIELD_REQUIRED}`,
    },
  },
];

// Columns in detail grid
const columnsDetail = (onFieldChange) => [
  {
    title: 'No.',
    field: 'no',
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
      { fieldName: 'materialTypeName', label: 'Type' },
      { fieldName: 'materialGroupName', label: 'Group' },
    ],
    cellStyle: {
      width: 300,
    },
  },
  {
    title: 'Quantity',
    field: 'quantity',
    render: function customEdit(rowData) {
      const fields = [
        {
          label: '',
          fieldName: 'quantity',
          fieldType: FieldConstant.type.QUANTITY,
          className: FieldConstant.class.QUANTITY,
          value: rowData.quantity !== undefined ? rowData.quantity : 0,
          maximumValue: 999999999,
          minimumValue: rowData.totalQty && -Math.abs(rowData.totalQty),
          numberDecimalCharacter:  MaterialUnitIsDecimal.includes(rowData?.baseUom) ? ScrapStockConstant.configDecimal : 0,
        },
      ];
      return (
        <div className="quantity">
          <Fields
            conditionalArray={fields}
            onChange={(item, newValue) =>
              onFieldChange(ScrapStockConstant.quantity, newValue, rowData)
            }
          />
        </div>
      );
    },
    width: 200,
  },
  {
    title: 'Base Unit',
    field: 'baseUnit',
    editable: 'never',
    render: function customRender(rowData) {
      return rowData.baseUom;
    },
    width: 100,
  },
  {
    title: 'Note',
    field: 'note',
    render: function custom(rowData) {
      const fields = [
        {
          fieldName: 'note',
          fieldType: FieldConstant.type.TEXT_AREA,
          className: FieldConstant.class.TEXT_AREA,
          value: rowData.note || '',
          rowsMin: 3,
          noPlaceHolder: true,
          classCustom: 'noteFld',
          maxLength: 256,
        },
      ];
      return (
        <Fields
          conditionalArray={fields}
          onChange={(e) =>
            onFieldChange(ScrapStockConstant.note, e.target.value, rowData)
          }
        />
      );
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

// Config for action in detail grid
const actions = [
  {
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: true,
  },
  {
    tooltip: 'Select Items',
    isFreeAction: true,
    hidden: true,
    isAddItemsPopup: true,
  },
  {
    icon: <RefreshIcon />,
    tooltip: 'Load Items',
    isFreeAction: true,
    hidden: true,
  },
];

// Fields in search form on 'Add items' form
const addItemsFieldArray = [
  {
    label: 'Material Type',
    id: 'materialType',
    fieldName: 'materialType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    disabled: true,
    data: [],
  },
  {
    label: 'Special Material Group',
    id: 'materialGroup',
    fieldName: 'materialGroup',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
    disabled: true,
  },
  {
    label: 'Material Code',
    id: 'sku',
    fieldName: 'sku',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Material Description',
    id: 'materialDescription',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

// Fields in detail form
const getFieldsTextOnly = () => [
  {
    label: 'Branch',
    fieldName: 'branchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
  },
  {
    label: 'Status',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
  },
  {
    label: 'Approved By',
    fieldName: 'approvedBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
  },
  {
    label: 'Note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
  },
  {
    label: 'Material Document',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT_ONLY,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

// Columns in grid on Details page
const columnsDetailsConfig = [
  {
    title: 'No.',
    field: 'no',
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
      { fieldName: 'materialTypeName', label: 'Type' },
      { fieldName: 'materialGroupName', label: 'Group' },
    ],
    cellStyle: {
      width: 300,
    },
  },
  {
    title: 'Quantity',
    field: 'quantity',
    editable: 'never',
    width: 150,
  },
  {
    title: 'Base Unit',
    field: 'baseUnit',
    editable: 'never',
    width: 100,
    render: function customRender(rowData) {
      return rowData.baseUom;
    },
  },
  {
    title: 'Note',
    field: 'note',
    editable: 'never',
    maxLength: 256,
  },
];
const bottomGridButtons = [
  {
    title: 'Close Document',
    handleFor: 'close',
    className: 'btnNeutral',
    handleClick: null,
    hidden: false,
    displayByStatus: ['Rejected', 'Draft', 'Failed'],
  },
  {
    title: 'Edit',
    handleFor: 'edit',
    className: 'btnSecondary',
    handleClick: null,
    hidden: false,
    displayByStatus: ['Rejected', 'Draft'],
  },
  // Temporary disable
  // {
  //   title: 'Print',
  //   handleFor: 'print',
  //   className: 'btnSecondary',
  //   handleClick: null,
  //   hidden: false,
  //   displayByStatus: ['Approved'],
  // },
  {
    title: 'Reject',
    handleFor: 'reject',
    className: 'btnDanger',
    handleClick: null,
    hidden: false,
    displayByStatus: ['Waiting for Approval'],
  },
  {
    title: 'Approve',
    handleFor: 'approve',
    className: 'btnPrimary',
    handleClick: null,
    hidden: false,
    displayByStatus: ['Waiting for Approval', 'Failed'],
  },
];

export {
  getFields,
  validation,
  columnsDetail,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  columnsDetailsConfig,
  bottomGridButtons,
  getFieldsTextOnly,
};
