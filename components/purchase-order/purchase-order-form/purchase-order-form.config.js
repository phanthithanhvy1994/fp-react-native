import React from 'react';
import CheckIcon from '@material-ui/icons/Check';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
  FieldConstant,
  OrderConstant,
  dateFormat,
  NumberConstant,
  MaterialUnitIsDecimal
} from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import Fields from '../../shared/fields/fields.component';
import { getFinalBaseUnitValue, getAmount } from '../../material/material.common';
import { formatDateString } from '../../../util/date-util';
import { formatNumber, formatPrice } from '../../../util/format-util';
import { defaultColors } from '../../../style/const/style-const';

// Fields in detail form
const getFields = (detailData, onOrderTypeChange, isEditPage = false) => [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    // Commit code test
    // disabled: true,
    required: true,
    data: [],
  },
  {
    label: 'Order Type',
    id: 'orderType',
    fieldName: 'orderType',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onOrderTypeChange,
    required: true,
    data: [],
    disabled: isEditPage,
  },
  {
    label: 'Vendor',
    id: 'vendorCode',
    fieldName: 'vendorCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    disabled: true,
    data: [],
  },
  {
    label: 'Created Date',
    id: 'requestedDate',
    fieldName: 'requestedDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    value: (!isEditPage && Date.now()) || null,
    disabled: true,
    required: true,
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
  {
    label: 'Vendor Email',
    id: 'email',
    fieldName: 'email',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    hidden: !isEditPage,
    disabled: true
  },
  {
    label: 'Emergency Order',
    id: 'isEmergency',
    fieldName: 'isEmergency',
    fieldType: FieldConstant.type.CHECKBOX,
    className: FieldConstant.class.CHECKBOX,
    classCustom: !detailData || !detailData.orderType || (detailData.orderType === OrderConstant.orderTypeCode.branchPO) ? 'checkbox-disabled' : ''
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

const validation = [
  {
    name: 'branchCode',
    rule: {
      required: `Branch ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'orderType',
    rule: {
      required: `Order Type ${Message.FIELD_REQUIRED}`,
    },
  },
];

// Columns in detail grid
const noField = {
  title: 'No.',
  field: 'no',
  editable: 'never',
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
      isMultipleField: true,
      fieldName: 'minMax',
      data: [
        { fieldName: 'min', label: 'Min' },
        { fieldName: 'max', label: 'Max' },
      ]
    },
    { fieldName: 'volume', label: 'Vol' },
    {
      noLabel: true,
      fieldName: 'baseUnitInfo',
      customDisplay: (data) => {
        return (data.denominator && data.orderUnit 
          && `${data.denominator} ${data.orderUnit} = ${data.numerator} ${data.baseUnit}`)
          || '';
      }
    }
  ],
  cellStyle: {
    width: '17%',
  },
};
const averageField = {
  title: 'Average Usage',
  field: 'averageUsage',
  editable: 'never',
  render: function customRender(rowData) {
    return (<>
      {rowData.averageUsage || ''}
      <p>{(rowData.averageUsage && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const stockOnHandField = {
  title: 'Stock on Hand',
  field: 'stockOnHand',
  editable: 'never',
  render: function customRender(rowData) {
    return (<>
      {rowData.stockOnHand || ''}
      <p>{(rowData.stockOnHand && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const forecastStockOnHandField = {
  title: 'Expected SOH',
  field: 'forecastStockOnHand',
  editable: 'never',
  render: function customRender(rowData) {
    const forecastStockOnHand = rowData.availableQuantity || 0;
    return (<>
      <span className={forecastStockOnHand > rowData.min ? 'danger' : 'forecastStockOnHand'}>{forecastStockOnHand || ''}</span>
      <p className={forecastStockOnHand > rowData.min ? 'danger' : 'forecastStockOnHand'}>{(forecastStockOnHand && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const incomingField = {
  title: 'Incoming',
  field: 'incomingQuantity',
  editable: 'never',
  render: function customRender(rowData) {
    return (<>
      {rowData.incomingQuantity || ''}
      <p>{(rowData.incomingQuantity && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const outgoingField = {
  title: 'Outgoing',
  field: 'outgoingQuantity',
  editable: 'never',
  render: function customRender(rowData) {
    const outgoingQuantity = rowData.outgoingQuantity ? `-${rowData.outgoingQuantity}` : '';
    return (<>
      {outgoingQuantity || ''}
      <p>{(outgoingQuantity && rowData.baseUnit) || ''}</p>
    </>);
  }
};
const unitPriceField = {
  title: 'Unit Price',
  field: 'price',
  editable: 'never',
  render: function customRender(rowData) {
    return formatPrice(rowData.price || 0, 2);
  },
};
const deliveryDateField = (onFieldChange, isDetailsPage) => ({
  title: 'Delivery Date',
  field: 'deliveryDate',
  render: function customEdit(rowData) {
    let date = rowData.deliveryDate;
    date = typeof date === 'object' ? date.toLocaleDateString() : date;
    const fields = [
      {
        label: '',
        fieldName: 'deliveryDate',
        fieldType: FieldConstant.type.PICKER,
        className: FieldConstant.class.PICKER,
        value:
          (date && formatDateString(date, dateFormat.yyyymmdd, true)) || '',
      },
    ];
    return !isDetailsPage ? (
      <Fields
        conditionalArray={fields}
        onChange={e =>
          onFieldChange(OrderConstant.deliveryDate, e.target.value, rowData)
        }
      />
    ) : (
      formatDateString(fields[0].value, dateFormat.mainDate)
    );
  },
});
const baseUnitField = {
  title: 'Base Unit',
  field: 'baseUnit',
  editable: 'never',
  render: function customRender(rowData) {
    const finalBaseUnit = formatNumber(getFinalBaseUnitValue(rowData));
    return (
      <>
        {finalBaseUnit || ''}
        <p>{(finalBaseUnit && rowData.baseUnit) || ''}</p>
      </>
    );
  },
};
const totalAmountField = {
  title: 'Total Amount',
  field: 'amount',
  editable: 'never',
  render: function customRender(rowData) {
    return formatPrice(rowData.totalAmount || 0, NumberConstant.normalDecimalCharacter);
  },
};
const freeItemField = (onFieldChange, isDetailsPage) => ({
  title: 'Free Item',
  field: 'isFree',
  render: function custom(rowData) {
    const checkBoxField = {
      label: '',
      id: 'isFree',
      fieldName: 'isFree',
      fieldType: FieldConstant.type.CHECKBOX,
      className: FieldConstant.class.CHECKBOX,
      value: rowData.isFree,
    };
    return !isDetailsPage ? (
      <Fields
        conditionalArray={[checkBoxField]}
        onChange={e =>
          onFieldChange(OrderConstant.isFree, e.target.value, rowData)
        }
      />
    ) : (
      <CheckIcon
        hidden={!checkBoxField.value}
        style={{ color: defaultColors.primary }}
      />
    );
  },
});
const quantityField = (onFieldChange, isDetailsPage) => ({
  title: 'Quantity',
  field: 'quantity',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'quantity',
        id: `quantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.quantity !== undefined ? rowData.quantity : 0,
        numberDecimalCharacter: MaterialUnitIsDecimal.includes(rowData?.baseUnit) ? OrderConstant.configDecimal : 0
      },
    ];
    return (
      <>
        {!isDetailsPage ? (
          <Fields
            conditionalArray={fields}
            onChange={(item, newValue) =>
              onFieldChange(OrderConstant.quantity, newValue, rowData)
            }
          />
        ) : (
          fields[0].value
        )}
        <p>{rowData.orderUnit}</p>
      </>
    );
  },
  width: 162,
});
const mrpItemField = {
  title: 'MRP Item',
  field: 'mrp',
  editable: 'never',
  cellStyle: {
    color: defaultColors.secondary,
    fontSize: '12px',
  },
};
const columnsDetailPTO = (
  onFieldChange,
  configItemDataOnGrid,
  isDetailsPage
) => [
  noField,
  itemField,
  quantityField(onFieldChange, isDetailsPage),
  baseUnitField,
  stockOnHandField,
  forecastStockOnHandField,
  outgoingField,
  incomingField,
  averageField,
  unitPriceField,
  deliveryDateField(onFieldChange, isDetailsPage),
  totalAmountField,
  mrpItemField,
];

const columnsDetailBranchPO = (
  onFieldChange,
  configItemDataOnGrid,
  isDetailsPage
) => [
  noField,
  itemField,
  quantityField(onFieldChange, isDetailsPage),
  baseUnitField,
  stockOnHandField,
  forecastStockOnHandField,
  outgoingField,
  incomingField,
  averageField,
  unitPriceField,
  deliveryDateField(onFieldChange, isDetailsPage),
  totalAmountField,
  freeItemField(onFieldChange, isDetailsPage),
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
const totalSummarizeInGrid = (orderType) => {
  if (orderType === OrderConstant.orderTypeCode.poSTO) {
    return [{ fieldName: 'totalAmount', label: 'Total', currency: OrderConstant.currency }];
  } else {
    return [
      { fieldName: 'taxAmount', label: 'Total VAT', currency: OrderConstant.currency },
      { fieldName: 'totalAmount', label: 'Total', currency: OrderConstant.currency },
    ];
  }
};

// Config for action in detail grid
const actions = [
  {
    icon: () => {},
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: true,
    onClick: () => {},
  },
  {
    icon: () => {},
    tooltip: 'Select Items',
    isFreeAction: true,
    hidden: true,
    isAddItemsPopup: true,
    onClick: () => {},
  },
  {
    icon: <RefreshIcon />,
    tooltip: 'Load Items',
    isFreeAction: true,
    hidden: true,
    onClick: () => {},
  },
];

// Fields in search form on 'Add items' form
const addItemsFieldArray = [
  {
    label: 'Vendor',
    id: 'vendorCode',
    fieldName: 'vendorCode',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
  },
  {
    label: 'Material Type',
    id: 'materialType',
    fieldName: 'materialType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: [],
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
    label: 'Material Code',
    id: 'materialCode',
    fieldName: 'materialCode',
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
  {
    fieldType: FieldConstant.type.NONE
  }
];

// For detail page
const bottomGridButtonsArray = detailData => {
  const detailStatus =
    detailData && detailData.status && detailData.status.toString();

  return [
    {
      title: 'Close Document',
      handleFor: 'close',
      className: 'btnNeutral',
      handleClick: null,
      hidden: detailStatus === OrderConstant.statusValue.closed,
    },
    {
      title: 'Edit',
      handleFor: 'edit',
      className: 'btnSecondary',
      handleClick: null,
      hidden:
        detailStatus !== OrderConstant.statusValue.draft &&
        detailStatus !== OrderConstant.statusValue.rejected,
    },
    {
      title: 'Print',
      handleFor: 'print',
      className: 'btnSecondary',
      handleClick: null,
      hidden: false,
    },
    {
      title: 'Reject',
      handleFor: 'reject',
      className: 'btnDanger',
      handleClick: null,
      hidden:
        !detailData ||
        detailStatus !== OrderConstant.statusValue.waitingApproval,
    },
    {
      title: 'Approve',
      handleFor: 'approve',
      className: 'btnPrimary',
      handleClick: null,
      hidden:
        !detailData ||
        detailStatus !== OrderConstant.statusValue.waitingApproval,
    },
  ];
};

const fieldsLabelArray = detailData => [
  {
    label: 'Branch',
    fieldName: 'branch',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.branchName) || '',
  },
  {
    label: 'Order Type',
    fieldName: 'orderTypeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.orderTypeName) || '',
  },
  {
    label: 'Vendor',
    fieldName: 'vendorName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.vendorName) || '',
  },
  {
    label: 'Status',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.statusName) || '',
  },
  {
    label: 'Approved By',
    fieldName: 'approver',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.approver) || '',
  },
  {
    label:
      detailData && detailData.orderType === OrderConstant.orderTypeCode.poSTO
        ? 'PO-STO No.'
        : 'PO No.',
    fieldName: 'sapResquestNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.sapResquestNumber) || '',
  },
  {
    label: 'Created Date',
    fieldName: 'requestedDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value:
      (detailData && formatDateString(detailData.requestedDate, null, true)) ||
      '',
  },
  {
    label: 'Note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.note) || '',
  },
  {
    label: 'Vendor Email',
    fieldName: 'email',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: (detailData && detailData.email) || '',
  },
];

export {
  getFields,
  validation,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  columnsDetailPTO,
  columnsDetailBranchPO,
  bottomGridButtonsArray,
  fieldsLabelArray,
};
