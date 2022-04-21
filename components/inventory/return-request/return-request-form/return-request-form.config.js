import React from 'react';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import {
  FieldConstant,
  ReturnRequestConstant,
  MaterialUnitIsDecimal
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import Fields from '../../../shared/fields/fields.component';
import { getFinalBaseUnitValue } from '../../../material/material.common';
import { formatNumber } from '../../../../util/format-util';
import RequiredColumnTitle from '../../../shared/table-grid/required-column-title/required-column-title';

const dateTimeFormatForPicker = 'dd.MM.yyyy HH:mm:ss';

// Fields in detail form
const getFieldsTextOnly = () => [
  {
    label: 'Branch',
    fieldName: 'branchCodeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Return To',
    fieldName: 'orderTypeName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Goods Receipt No.',
    fieldName: 'goodReceiptNo',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Vendor',
    fieldName: 'vendorName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Created Date',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Status',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'PO-STO Return',
    fieldName: 'sapRequestNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Material Document',
    fieldName: 'materialDocument',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Approved By',
    fieldName: 'approvedBy',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Credit Note',
    fieldName: 'creditNote',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'DO No.',
    fieldName: 'doNumber',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
  {
    label: 'Note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: '',
  },
];

// Fields in general infomation form for add/edit
const getFields = (
  onOrderTypeChange,
  onGoodsReceiptNoChange,
  onInputSearchIconClick,
  isEditPage = false
) => [
  {
    label: 'Branch',
    id: 'branch',
    fieldName: 'branch',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    disabled: isEditPage,
    required: true,
    validation: {
      required: 'Required',
    },
    data: [],
  },
  {
    label: 'Return To',
    id: 'orderType',
    fieldName: 'orderType',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    customOnChange: onOrderTypeChange,
    required: true,
    validation: {
      required: 'Required',
    },
    data: [],
    disabled: isEditPage,
  },
  {
    label: 'Goods Receipt No.',
    id: 'goodsReceiptNo',
    fieldName: 'goodReceiptNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    endAdornment: {
      icon: function customIcon() {
        return <SearchIcon />;
      },
      handleClick: onInputSearchIconClick,
    },
    classCustom: 'search-icon-inside-input',
    customOnChange: onGoodsReceiptNoChange,
    disabled: true,
  },
  {
    label: 'Vendor',
    id: 'vendor',
    fieldName: 'vendor',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    disabled: true,
    data: [],
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    disabled: true,
    required: true,
    format: dateTimeFormatForPicker,
    validation: {
      required: 'Required',
    },
    value: Date.now(),
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
    label: 'Credit Note',
    id: 'creditNote',
    fieldName: 'creditNote',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    classCustom: 'upperCaseInput',
    autoUppercase: true,
    disabled: true,
  },
  {
    label: 'Note',
    id: 'note',
    fieldName: 'note',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    disabled: false,
  },
  {
    fieldType: FieldConstant.type.NONE
  }
];

const validation = (isReturnToVendorType) => [
  {
    name: 'branch',
    rule: {
      required: `Branch ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'orderType',
    rule: {
      required: `Return To ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'goodReceiptNo',
    rule: {
      required:
        isReturnToVendorType && `Goods Receipt No. ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'createdDate',
    rule: {
      required: `Created Date ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'creditNote',
    rule: {
      required: isReturnToVendorType && `Credit Note ${Message.FIELD_REQUIRED}`,
      maxLength: {
        value: 16,
        message: `The ${ReturnRequestConstant.label.creditNote} should not exceed the maxLength than 16`,
      },
    },
  },
  {
    name: 'note',
    rule: {
      maxLength: {
        value: 256,
        message: `The ${ReturnRequestConstant.label.note} should not exceed the maxLength than 256`,
      },
    },
  },
];

// Columns in grid on Details page
const columnsDetailsConfig = [
  {
    title: 'No.',
    field: 'lineNumber',
    editable: 'never',
    width: 30,
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
            (data.denomirator &&
              data.orderUnit &&
              `${data.denomirator} ${data.orderUnit} = ${data.numerator} ${data.baseUom}`) ||
            ''
          );
        },
      },
    ],
    cellStyle: {
      width: '18%',
    },
  },
  {
    title: 'Received Qty',
    field: 'actualQty',
    editable: 'never',
    width: 200,
    render: function customRender(rowData) {
      return (
        <>
          <span>
            {rowData.actualQty} {rowData.orderUnit}
          </span>
        </>
      );
    },
  },
  {
    title: 'Return Qty',
    field: 'quantity',
    editable: 'never',
    width: 200,
    render: function customRender(rowData) {
      const isEqualOrderUnitAndBaseUnit = rowData.orderUnit === rowData.baseUom;
      return (
        <>
          <p className="order-unit-qty">
            {rowData.quantity || '0'} {rowData.orderUnit}
          </p>
          {!isEqualOrderUnitAndBaseUnit && (
            <p>
              {rowData.returnQtyBu || '0'} {rowData.baseUom}
            </p>
          )}
        </>
      );
    },
  },
  {
    title: 'Base Unit',
    field: 'baseUnit',
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
  },
  {
    title: 'Batch No.',
    field: 'batchNo',
    editable: 'never',
    width: 200,
  },
  {
    title: 'Reason',
    field: 'reasonName',
    editable: 'never',
    width: 180,
  },
  {
    title: 'Complaint No.',
    field: 'complaintNo',
    editable: 'never',
    width: 180,
  },
  {
    title: 'Description',
    field: 'note',
    editable: 'never',
    width: 180,
  },
  {
    title: 'Attached Images',
    field: 'attachedImages',
    width: 200,
    render: function customEdit(rowData) {
      const fields = [
        {
          label: '',
          fieldName: 'attachedImages',
          id: `attachedImages${rowData.id}`,
          classCustom: 'attached-images-field',
          fieldType: FieldConstant.type.UPLOAD_FILE,
          config: {
            maxValue: 2,
            hideLabel: true,
            disableUpload: true,
            imgArr: rowData.attachedImages || [],
          },
        },
      ];
      return <Fields conditionalArray={fields} />;
    },
  },
];

const bottomGridButtons = [
  {
    title: 'Edit',
    handleFor: 'edit',
    className: 'btnSecondary',
    handleClick: null,
    hidden: false,
    // status: Draft, Rejected, Failed
    displayByStatus: [1, 5, 8],
    // orderType: Vendor, Factory
    displayByOrderType: [1,2]
  },
  {
    title: 'Print',
    handleFor: 'print',
    className: 'btnSecondary',
    handleClick: null,
    hidden: false,
    // Display all
    displayByStatus: [1,2,3,4,6,7,8],
    // orderType: Vendor, Factory
    displayByOrderType: [1,2]
  },
  {
    title: 'Confirm Pick Up',
    handleFor: 'confirmPickUp',
    className: 'btnPrimary',
    handleClick: null,
    hidden: false,
    // display when status is Approved and Return To Factory
    displayByStatus: [3],
    // orderType: Factory
    displayByOrderType: [1]
  },
  {
    title: 'Close Document',
    handleFor: 'close',
    className: 'btnNeutral',
    handleClick: null,
    hidden: false,
    // status: Draft, In-process, Failed, Rejected
    displayByStatus: [1, 4, 5, 8],
    // orderType: Vendor, Factory
    displayByOrderType: [1,2]
  },
  {
    title: 'Reject',
    handleFor: 'reject',
    className: 'btnDanger',
    handleClick: null,
    hidden: false,
    // status: Waiting for Approval
    displayByStatus: [2],
    // orderType: Vendor, Factory
    displayByOrderType: [1,2]
  },
  {
    title: 'Approve',
    handleFor: 'approve',
    className: 'btnPrimary',
    handleClick: null,
    hidden: false,
    // status: Waiting for Approval
    displayByStatus: [2],
    // orderType: Vendor, Factory
    displayByOrderType: [1,2]
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
const isShowScanTimeLine = false;

// Config for action in detail grid
const actions = (beforeLoadItemHandler) => [
  {
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: true,
    // tricky for removing material table warning
    icon: () => {},
    onClick: () => {},
  },
  {
    tooltip: 'Select Items',
    isFreeAction: true,
    hidden: true,
    isAddItemsPopup: true,
    // tricky for removing material table warning
    icon: () => {},
    onClick: () => {},
  },
  {
    icon: <RefreshIcon />,
    tooltip: 'Load Items',
    isFreeAction: true,
    hidden: true,
    // tricky for removing material table warning
    onClick: () => {},
    beforeLoadItemHandler,
  },
];

// Columns of grid in add/edit page
const noField = {
  title: 'No.',
  field: 'no',
  editable: 'never',
  width: 30,
};

const attachedImagesField = (onFieldChange) => ({
  title: 'Attached Images',
  field: 'attachedImages',
  render: function customEdit(rowData) {
    const isAttachedImagesField = true;
    const fields = [
      {
        label: '',
        fieldName: 'attachedImages',
        id: `attachedImages${rowData.id}`,
        fieldType: FieldConstant.type.UPLOAD_FILE,
        classCustom: 'attached-images-field',
        config: {
          maxValue: 2,
          hideLabel: true,
          imgArr: rowData.attachedImages,
          isEdit: true,
        },
        value: rowData.attachedImages || [],
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) => {
          onFieldChange(
            ReturnRequestConstant.attachedImages,
            e.target.value,
            rowData,
            null,
            isAttachedImagesField
          );
        }}
      />
    );
  },
  width: 200,
});
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
          (data.denomirator &&
            data.orderUnit &&
            `${data.denomirator} ${data.orderUnit} = ${data.numerator} ${data.baseUom}`) ||
          ''
        );
      },
    },
  ],
  cellStyle: {
    width: '18%',
  },
};
const receivedQtyField = {
  title: 'Received Qty',
  field: 'actualQty',
  editable: 'never',
  width: 200,
  render: function customRender(rowData) {
    return (
      <>
        <span>
          {rowData.actualQty} {rowData.orderUnit}
        </span>
      </>
    );
  },
};

const baseUnitField = {
  title: 'Base Unit',
  field: 'baseUnit',
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
const batchNoField = (onFieldChange) => ({
  title: 'Batch No',
  field: 'batchNo',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'batchNo',
        id: `batchNo${rowData.id}`,
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: rowData.batchNo || '',
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(ReturnRequestConstant.batchNo, e.target.value, rowData)
        }
      />
    );
  },
  width: 200,
});
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
            ReturnRequestConstant.reasonCode,
            e.target.value,
            rowData
          )
        }
      />
    );
  },
  width: 180,
});
const complaintNoField = (onFieldChange) => ({
  title: 'Complaint No',
  field: 'complaintNo',
  render: function customEdit(rowData) {
    const fields = [
      {
        label: '',
        fieldName: 'complaintNo',
        id: `complaintNo${rowData.id}`,
        fieldType: FieldConstant.type.TEXT,
        className: FieldConstant.class.TEXT,
        classCustom: 'full-width-column-field',
        value: rowData.complaintNo || '',
      },
    ];
    return (
      <Fields
        conditionalArray={fields}
        onChange={(e) =>
          onFieldChange(
            ReturnRequestConstant.complaintNo,
            e.target.value,
            rowData
          )
        }
      />
    );
  },
  width: 180,
});
const descriptionField = (onFieldChange) => ({
  title: 'Description',
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
const returnQtyField = (onFieldChange) => ({
  title: <RequiredColumnTitle titleName="Return Qty" isRequired={true} />,
  render: function customEdit(rowData) {
    const isEqualOrderUnitAndBaseUnit = rowData.orderUnit === rowData.baseUom;
    const orderUnitQtyFields = [
      {
        label: '',
        fieldName: 'quantity',
        id: `quantity${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.quantity || 0,
        numberDecimalCharacter:  MaterialUnitIsDecimal.includes(rowData?.orderUnit) ? ReturnRequestConstant.configDecimal : 0
      },
    ];

    const baseUnitQtyField = [
      {
        label: '',
        fieldName: 'returnQtyBu',
        id: `returnQtyBu${rowData.id}`,
        fieldType: FieldConstant.type.QUANTITY,
        className: FieldConstant.class.QUANTITY,
        value: rowData.returnQtyBu || 0,
        numberDecimalCharacter:  MaterialUnitIsDecimal.includes(rowData?.baseUom) ? ReturnRequestConstant.configDecimal : 0
      },
    ];
    return (
      <>
        <div className="qty-value">
          <Fields
            conditionalArray={orderUnitQtyFields}
            onChange={(item, newValue) => {
              onFieldChange(ReturnRequestConstant.quantity, newValue, rowData);
            }}
          />
        </div>

        <p className="order-unit-qty">{rowData.orderUnit}</p>
        {!isEqualOrderUnitAndBaseUnit && (
          <>
            <div className="qty-value">
              <Fields
                conditionalArray={baseUnitQtyField}
                onChange={(item, newValue) => {
                  onFieldChange(
                    ReturnRequestConstant.returnQtyBu,
                    newValue,
                    rowData
                  );
                }}
              />
            </div>
            <p className="base-unit-qty">{rowData.baseUom}</p>
          </>
        )}
      </>
    );
  },
  width: 200,
});

const columnsForVendor = (onFieldChange, configItemDataOnGrid) => [
  noField,
  itemField,
  receivedQtyField,
  returnQtyField(onFieldChange),
  baseUnitField,
  reasonField(onFieldChange, configItemDataOnGrid),
  complaintNoField(onFieldChange),
  descriptionField(onFieldChange),
  attachedImagesField(onFieldChange),
];

const columnsForFactory = (onFieldChange, configItemDataOnGrid) => [
  noField,
  itemField,
  returnQtyField(onFieldChange),
  baseUnitField,
  batchNoField(onFieldChange),
  reasonField(onFieldChange, configItemDataOnGrid),
  complaintNoField(onFieldChange),
  descriptionField(onFieldChange),
  attachedImagesField(onFieldChange),
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
];

const scanningTimeLineDataSample = [
  {
    time: Date.now(),
    userCode: '0000000',
    name: 'test06554521',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUsera5645454545',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUser',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUser',
  },
  {
    time: Date.now(),
    userCode: '2222222',
    name: 'testUser',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUser',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUser',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUserEnd',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUser',
  },
  {
    time: Date.now(),
    userCode: '31101996',
    name: 'testUser',
  },
];

export {
  getFields,
  getFieldsTextOnly,
  validation,
  columnsDetailsConfig,
  options,
  bottomGridButtons,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  columnsForVendor,
  columnsForFactory,
  isShowScanTimeLine,
  scanningTimeLineDataSample,
};
