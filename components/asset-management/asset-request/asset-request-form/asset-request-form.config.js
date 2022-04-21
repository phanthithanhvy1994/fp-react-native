import React from 'react';
import {
  AssetRequestConstant,
  dateFormat,
  FieldConstant,
} from '../../../../constants/constants';
import Fields from '../../../shared/fields/fields.component';
import { Message } from '../../../../constants/messages';
import RequiredColumnTitle from '../../../shared/table-grid/required-column-title/required-column-title';
import Calendar from '../../../shared/fields/custom/Calendar';
import { formatDateString,  } from '../../../../util/date-util';
import { formatNumber } from '../../../../util/format-util';


// Fields in general information form for add/edit
const getFields = (
  onRequestToChange,
  onRequestFromChange,
  isEditPage
) => [
  {
    label: 'Request From (Branch)',
    id: 'branchCodeFrom',
    fieldName: 'branchCodeFrom',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onRequestFromChange,
    disabled: isEditPage,
    required: true,
    validation: {
      required: 'Required',
    },
  },
  {
    label: 'Request To (Branch)',
    id: 'branchCodeTo',
    fieldName: 'branchCodeTo',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onRequestToChange,
    required: true,
    validation: {
      required: 'Required',
    },
    disabled: isEditPage
  },
  {
    label: 'Fixzy/SSD No.',
    id: 'ssdNo',
    fieldName: 'ssdNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    disabled: isEditPage
  },
  {
    label: 'Note',
    id: 'notes',
    fieldName: 'notes',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    fieldType: FieldConstant.type.NONE,
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
    name: 'branchCodeFrom',
    rule: {
      required: `Request From ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'branchCodeTo',
    rule: {
      required: `Request To ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'notes',
    rule: {
      maxLength: {
        value: 256,
        message: 'Note should not exceed the maxLength than 256',
      },
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

// Config allow to add the same item multiple times on AddItems popup
const isShowScanTimeLine = true;

// Config for action in detail grid
const actions = (isHidden, addAssetHandler) => [
  {
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: isHidden,
    icon: () => {},
    onClick: () => {},
  },
  {
    tooltip: 'Select Items',
    isFreeAction: true,
    hidden: isHidden,
    customHandler: addAssetHandler,
    isAddItemsPopup: true,
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
    { fieldName: 'assetTypeName', label: 'Asset Type' },
    { fieldName: 'assetCategoryName', label: 'Category' },
    { fieldName: 'assetSubCategoryName', label: 'Sub Category' },
  ],
  cellStyle: {width: '25%'}
};

const unitPrice = {
  title: 'Unit Price (Bath)',
  field: 'unitPrice',
  editable: 'never',
  width: 180,
};

const deliveryDate = (onFieldChange) => ({
  title:  <RequiredColumnTitle titleName="Delivery Date" isRequired={true} />,
  field: 'deliveryDate',
  render: function customEdit(rowData) {
    return (
      <>
        <Calendar
          onChange={(e) => {
            onFieldChange('deliveryDate', formatDateString(e.target.value, dateFormat.savingDateTime), rowData);
          }}
          
          item={{
            noLabel: true
          }}
          value={rowData.deliveryDate || ''}
          minDate={Date.now()}
        />
      </>
    );
  },
  width: 180,
});

const totalAmountField = {
  title: 'Total Amount',
  field: 'amount',
  editable: 'never',
  width: 180,
  render: function customRender(rowData) {
    return formatNumber(rowData.amount);
  },
};

const damageQuantity = {
  title: 'Damaged Qty.',
  field: 'damagedQty',
  editable: 'never',
  render: function customEdit(rowData) {
    const damagedQtyFields = [
      {
        label: '',
        fieldName: 'damagedQty',
        id: `damagedQty${rowData.id}`,
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: rowData.damagedQty ,
        disabled: true
      },
    ];

    return (!rowData.damagedQty || +rowData.damagedQty === 0) ? ('-') :
      (<Fields
        conditionalArray={damagedQtyFields}
      />);
  },
  width: 180,
};

const quantity = (onFieldChange) => ({
  title:  <RequiredColumnTitle titleName="Quantity" isRequired={true} />,
  field: 'quantity',
  render: function customEdit(rowData) {
    const orderUnitQtyFields = [
      {
        label: '',
        fieldName: 'quantity',
        id: `quantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.quantity || 0,
        hidden: rowData.damagedQty && +rowData.damagedQty !== 0
      },
    ];

    return (
      <>
        <div className="qty-value">
          <Fields
            conditionalArray={orderUnitQtyFields}
            onChange={(item, newValue) => {
              onFieldChange('quantity', newValue, rowData);
            }}
          />
        </div>
      </>
    );
  },
  width: 180,
});

const noteField = (onFieldChange) => ({
//   title:  <RequiredColumnTitle titleName="Note" isRequired={true} />,
  title: 'Note',
  field: 'notes',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'notes',
        id: `notes${rowData.id}`,
        fieldType: FieldConstant.type.TEXT_AREA,
        className: FieldConstant.class.TEXT_AREA,
        noPlaceHolder: true,
        classCustom: 'full-width-column-field custom-height-column-field',
        value: rowData.notes || '',
        rowsMin: 3,
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(AssetRequestConstant.note, e.target.value, rowData)
        }
      />
    );
  },
  width: 180,
});

// const assetLocation = {
//   title: 'Asset Location SAP',
//   field: 'assetLocation',
//   editable: 'never',
//   width: 180,
// };

const columnsDetail = (onFieldChange) => [
  noField,
  itemField,
  unitPrice,
  deliveryDate(onFieldChange),
  damageQuantity,
  quantity(onFieldChange),
  totalAmountField,
  // assetLocation,
  noteField(onFieldChange),
];

// Fields in search form on 'Add items' form
const addItemsFieldArray = (assetType, assetCategory, assetSubCategory, initialValue, prevAssetCategory) => [
  {
    label: 'Asset Type',
    id: 'assetType',
    fieldName: 'assetType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: assetType || [],
  },
  {
    label: 'Asset Category',
    id: 'assetCategory',
    fieldName: 'assetCategory',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    data: assetCategory || [],
    resetValue: initialValue,
    value: prevAssetCategory
  },
  {
    label: 'Asset Sub Category',
    id: 'assetSubCategory',
    fieldName: 'assetSubCategory',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: assetSubCategory || [],
  },
  {
    label: 'Asset Description',
    id: 'assetDescription',
    fieldName: 'assetDescription',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

// Config for summarize total area
const totalSummarizeInGrid = [
  {
    label: 'Total',
    fieldName: 'amount',
  },
];

export {
  getFields,
  validation,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  columnsDetail,
  isShowScanTimeLine,
};
