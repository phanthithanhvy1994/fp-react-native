import React from 'react';
import {
  CouponConstant,
  dateFormat,
  FieldConstant,
  POPettyCashConstant
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { formatDateString } from '../../../../util/date-util';
import Fields from '../../../shared/fields/fields.component';
import Calendar from '../../../shared/fields/custom/Calendar';

import RequiredColumnTitle from '../../../shared/table-grid/required-column-title/required-column-title';

const fieldArray = (
  detailData,
  couponName,
  type,
  comboOptions
) => [
  // Left Top Dialog
  {
    label: 'Branch',
    id: 'branch',
    fieldName: 'branch',
    classParent: 'branch ',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.TEXT,
    data: [],
    required: true,
    value: detailData?.branch || '',
  },
  {
    label: 'Invoice No.',
    id: 'invoiceNo',
    fieldName: 'invoiceNo',
    classParent: 'invoiceNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    classCustom: 'full-width',
    value:  detailData?.couponType || type,
    data: comboOptions?.typeCouponCombo || [],
  },
  {
    label: 'Invoice Date',
    id: 'invoiceDate',
    fieldName: 'invoiceDate',
    classParent: 'invoiceDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
    classCustom: 'half-width',
    data: comboOptions?.companyCodeCombo || [],
    value: detailData?.invoiceDate || '',
  },
  {
    label: 'Note',
    id: 'note',
    fieldName: 'note',
    classParent: `type-of-${type} full-width`,
    classCustom: 'full-width',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    value: detailData?.note || couponName || '',
  },
  {
    label: '',
    classCustom: 'attached-images-field',
    fieldType: FieldConstant.type.UPLOAD_FILE,
    config: {
      maxValue: 3,
      hideLabel: true,
      disableUpload: false,
      imgArr: [],
    },
    id: 'uploadFile',
    fieldName: 'uploadFile',
    value: [],
  },
  
  {
    label: 'Vendor',
    id: 'vendor',
    fieldName: 'vendor',
    classCustom: 'vendorRadio',
    fieldType: FieldConstant.type.RADIO,
    className: FieldConstant.class.RADIO,
    required: true,
    value:'existedVendor',
    data: [],
    hidden: type === CouponConstant.typeCoupon.paperLeaflet
  },
  {
    label: 'Existed Vendor Name',
    id: 'existedVendorName',
    fieldName: 'existedVendorName',
    classCustom: 'existedVendorName',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    value:'',
    data: [],
    hidden: false
  },
  {
    label: 'Name 1',
    id: 'name1',
    fieldName: 'name1',
    classParent: 'vendor-quater-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    value: '',
  },
  {
    label: 'Name 2',
    id: 'name2',
    fieldName: 'name2',
    classParent: 'vendor-quater-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    value: '',
  },
  {
    label: 'Address 1',
    id: 'address1',
    fieldName: 'address1',
    classParent: 'vendor-half-width',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    value: '',
  },
  {
    label: 'Address 2',
    id: 'address2',
    fieldName: 'address2',
    classParent: 'vendor-half-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    value: '',
  },
  {
    label: 'Address 3',
    id: 'address3',
    fieldName: 'address3',
    classParent: 'vendor-half-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: false,
    value: '',
  },
  {
    label: 'City',
    id: 'city',
    fieldName: 'city',
    classParent: 'vendor-quater-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    value: '',
  },
  {
    label: 'Postal Code',
    id: 'postalCode',
    fieldName: 'postalCode',
    classParent: 'vendor-quater-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    value: '',
  },
  {
    label: 'Country',
    id: 'country',
    fieldName: 'country',
    classParent: 'vendor-quater-width ',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    value: 'TH',
  },
  {
    label: 'Tax No.',
    id: 'taxNo',
    fieldName: 'taxNo',
    classParent: 'vendor-quater-width',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    value: '',
  },
];

const validation = (isExsistVendor) => [
  {
    name: 'branch',
    rule: {
      required: `${POPettyCashConstant.label.branch} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'invoiceNo',
    rule: {
      required: `${POPettyCashConstant.label.invoiceNo} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'invoiceDate',
    rule: {
      required: `${POPettyCashConstant.label.invoiceDate} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'existedVendorName',
    rule: {
      required: !isExsistVendor && `${POPettyCashConstant.label.existedVendorName} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'name1',
    rule: {
      required: isExsistVendor && `${POPettyCashConstant.label.name1} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'address1',
    rule: {
      required: isExsistVendor && `${POPettyCashConstant.label.address1} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'city',
    rule: {
      required: isExsistVendor && `${POPettyCashConstant.label.city} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'postalCode',
    rule: {
      required: isExsistVendor && `${POPettyCashConstant.label.postalCode} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'country',
    rule: {
      required: isExsistVendor && `${POPettyCashConstant.label.country} ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'taxNo',
    rule: {
      required: isExsistVendor && `${POPettyCashConstant.label.taxNo} ${Message.FIELD_REQUIRED}`,
    },
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
    data: [],
  },
  {
    label: 'Material Group',
    id: 'materialGroup',
    fieldName: 'materialGroup',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
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

const actions = (beforeLoadItemHandler) => [
  {
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: false,
    // tricky for removing material table warning
    icon: () => {},
    onClick: () => {},
  },
  {
    tooltip: 'Select Items',
    isFreeAction: true,
    hidden: false,
    isAddItemsPopup: true,
    // tricky for removing material table warning
    icon: () => {},
    onClick: () => {},
  },
];

const noField = {
  title: 'No.',
  field: 'no',
  editable: 'never',
  width: 30,
};

const itemField = {
  title: 'Item',
  field: 'itemName',
  editable: 'never',
  width: 200,
};
const quantityField = (onFieldChange) => ({
  title: <RequiredColumnTitle titleName="Quantity" isRequired={true} />,
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
});
const amountField = (onFieldChange) => ({
  title: <RequiredColumnTitle titleName="Amount (Baht)" isRequired={true} />,
  field: 'amount',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'amount',
        id: `amount${rowData.id}`,
        fieldType: FieldConstant.type.NUMBER,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: rowData.amount || '',
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            POPettyCashConstant.amount,
            e.target.value,
            rowData
          )
        }
      />
    );
  },
});
const vatField = (onFieldChange) => ({
  title: <RequiredColumnTitle titleName="VAT" isRequired={true} />,
  field: 'vat',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'vat',
        id: `vat${rowData.id}`,
        fieldType: FieldConstant.type.NUMBER,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: rowData.vat || '',
        disabled: rowData.itemType === 'NON_VAT' || false
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            POPettyCashConstant.vat,
            e.target.value,
            rowData
          )
        }
      />
    );
  },
});
const noteField = (onFieldChange) => ({
  title: <RequiredColumnTitle titleName="Note" isRequired={true} />,
  field: 'note',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'note',
        id: `note${rowData.id}`,
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: rowData.note || '',
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            POPettyCashConstant.note,
            e.target.value,
            rowData
          )
        }
      />
    );
  },
});
const deliveryDateField = (onFieldChange, isDetailsPage) => ({
  title: <RequiredColumnTitle titleName="Delivery Date" isRequired={true} />,
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
});

const columnsDetail = (onFieldChange) => [
  noField,
  itemField,
  quantityField(onFieldChange),
  amountField(onFieldChange),
  vatField(onFieldChange),
  noteField(onFieldChange),
  deliveryDateField(onFieldChange),
];

const totalSummarizeInGrid = [
  {
    label: 'Total',
    fieldName: 'amount',
  },
];

export { columnsDetail, options, fieldArray, actions, addItemsFieldArray, validation, totalSummarizeInGrid };