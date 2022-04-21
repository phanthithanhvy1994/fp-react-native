import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';
import {
  FieldConstant,
  OrderConstant,
  ConfigEntity,
  dateFormat,
  BranchBOM,
  MaterialUnitIsDecimal
} from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import Fields from '../../shared/fields/fields.component';
import { formatDateString } from '../../../util/date-util';

const compareFields = [
  'bomBranchName',
  'startDate',
  'endDate',
  'qty',
  'serviceMaterial',
  'alwaysOn',
  'quantity'
];
const comparedDetail = [
  'quantity',
  'indicatorCode',
];

// Fields in add and edit form
const getFields = (
  onOrderTypeChange,
  serviceMaterial,
  alwaysOn,
  onChangeProduct,
  onChangeStartDate,
  onChangeQuantityHeader,
  onChangeEndDate,
  isEditPage = false,
  res,
  product,
  price,
  categories,
  sub_cate,
  levels,
  quantity,
  companyCode,
  division,
  indicator,
  valueActions
) => {
  const toDate = formatDateString(
    new Date(),
    dateFormat.savingDateTimeStartDate,
    true
  );
  return [
    {
      label: 'Level',
      id: 'level',
      fieldName: 'level',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      customOnChange: onOrderTypeChange,
      required: true,
      validation: {
        required: 'Required',
      },
      data: levels || [],
      disabled: isEditPage,
      value: res?.level || valueActions,
    },
    {
      label: 'Product',
      id: 'productCode',
      fieldName: 'productCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      customOnChange: onChangeProduct,
      required: true,
      validation: {
        required: 'Required',
      },
      data: product || [],
      disabled: isEditPage,
      value: res?.productCode,
    },
    {
      label: 'Price',
      id: 'priceCode',
      fieldName: 'priceCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      validation: {
        required: 'Required',
      },
      disabled: isEditPage,
      data: price || [],
      value: res?.priceCode,
    },
    {
      label: 'Category',
      id: 'categoryCode',
      fieldName: 'categoryCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      disabled: true,
      validation: {
        required: 'Required',
      },
      data: categories || [],
      value: res?.categoryCode,
    },
    {
      label: 'Sub Category',
      id: 'subCategoryCode',
      fieldName: 'subCategoryCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      disabled: isEditPage,
      validation: {
        required: 'Required',
      },
      data: sub_cate || [],
      value: res?.subCategoryCode,
    },
    {
      label: 'Branch BOM Name',
      id: 'bomBranchName',
      fieldName: 'bomBranchName',
      fieldType: FieldConstant.type.TEXT,
      className: FieldConstant.class.TEXT,
      required: true,
      disabled: !(res?.status === BranchBOM.status.draft ||
        res?.status === BranchBOM.status.unconfirmed || !isEditPage),
      validation: {
        required: 'Required',
      },
      maxLength: 18,
      value: res?.bomBranchName,
    },
    {
      label: 'Start Date',
      id: 'startDate',
      fieldName: 'startDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      customOnChange: onChangeStartDate,
      classCustom: 'field-half-width',
      required: true,
      // disabled: res?.alwaysOn,
      validation: {
        required: 'Required',
      },
      value: formatDateString(res?.startDate, dateFormat.yyyymmdd, true),
      minDate: new Date(),
      maxDate: new Date(formatDateString(res?.endDate, dateFormat.yyyymmdd, true)),
    },
    {
      label: 'End Date',
      id: 'endDate',
      fieldName: 'endDate',
      fieldType: FieldConstant.type.PICKER,
      className: FieldConstant.class.PICKER,
      customOnChange: onChangeEndDate,
      classCustom: 'field-half-width',
      required: true,
      disabled: res?.alwaysOn,
      validation: {
        required: 'Required',
      },
      value: formatDateString(res?.endDate, dateFormat.yyyymmdd, true),
      minDate: (res?.startDate > toDate) ? 
        new Date(formatDateString(res?.startDate, dateFormat.yyyymmdd, true)) : 
        new Date(),
    },
    {
      label: 'Quantity',
      id: 'quantity',
      fieldName: 'qty',
      fieldType: FieldConstant.type.RANGE_INPUT,
      className: FieldConstant.class.RANGE_INPUT,
      classCustom: 'selectRight number-field-without-spin',
      classSelectRight: true,
      searchInput: {
        fieldName: 'quantity',
        fieldType: FieldConstant.type.NUMBER_DECIMAL,
        className: FieldConstant.class.TEXT,
        numberFormat: true,
        value: res?.quantity || 1,
        required: true,
        classCustom: 'Field-fldText',
        disabled: String(res?.level) === BranchBOM.levels.level_1,
        isDecimal: false,
        minVal: 0,
        maxVal: 999999999,
        // validation: {
        //   required: 'Required',
        // },
        // Config input number can not negative
        // minVal: FieldConstant.define.ZERO,
      },
      operator: {
        fieldName: 'quantityType',
        fieldType: FieldConstant.type.SELECT,
        customOnChange: onChangeQuantityHeader,
        data: quantity || [],
        value: res?.quantityType || '',
        className: FieldConstant.class.SELECT,
        classCustom: 'Field-fldSelect',
        disabled: isEditPage,
      },
    },
    {
      label: 'Indicator (Finance)',
      id: 'indicatorCode',
      fieldName: 'indicatorCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      // customOnChange: onOrderTypeChange,
      required: true,
      validation: {
        required: 'Required',
      },
      data: indicator || [],
      disabled: isEditPage,
      value: res?.indicatorCode,
    },
    {
      label: 'Division',
      id: 'division',
      fieldName: 'division',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      disabled: isEditPage,
      validation: {
        required: 'Required',
      },
      data: division || [],
      value: res?.division,
    },
    {
      label: 'Company Code',
      id: 'companyCode',
      fieldName: 'companyCode',
      fieldType: FieldConstant.type.SELECT,
      className: FieldConstant.class.SELECT,
      required: true,
      disabled: isEditPage,
      validation: {
        required: 'Required',
      },
      data: companyCode || [],
      value: res?.companyCode,
    },
    {
      label: 'Service Material',
      id: 'serviceMaterial',
      fieldName: 'serviceMaterial',
      fieldType: FieldConstant.type.CHECKBOX,
      className: FieldConstant.class.CHECKBOX,
      customOnChange: serviceMaterial,
      classCustom: 'field-half-width',
      value: res?.serviceMaterial,
      disabled:
        res?.level === Number(BranchBOM.levels.level_1) ||
        res?.level === Number(BranchBOM.levels.level_3),
    },
    {
      label: 'Always ON',
      id: 'alwaysOn',
      fieldName: 'alwaysOn',
      fieldType: FieldConstant.type.CHECKBOX,
      className: FieldConstant.class.CHECKBOX,
      customOnChange: alwaysOn,
      classCustom: 'field-half-width',
      value: res?.alwaysOn,
    },
    {
      fieldType: FieldConstant.type.NONE,
    },
  ];
};

const getFieldsTextOnly = (data) => [
  {
    label: 'Company Code',
    fieldName: 'companyCode',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.companyCode || '',
  },
  {
    label: 'Branch BOM Name',
    fieldName: 'bomBranchName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.bomBranchName || '',
  },
  {
    label: 'Category',
    fieldName: 'category',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.categoryName || '',
  },
  {
    label: 'Indicator (Finance)',
    fieldName: 'indicatorName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.indicatorName || '',
  },
  {
    label: 'Level',
    fieldName: 'level',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.levelName || '',
  },
  {
    label: 'Status',
    fieldName: 'statusName',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: data?.statusName || '',
  },
  {
    label: 'Start Date',
    fieldName: 'start_date',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: formatDateString(data?.startDate, dateFormat.mainDate, true) || '',
  },
  {
    label: 'End Date',
    fieldName: 'end_date',
    fieldType: FieldConstant.type.TEXT_ONLY,
    value: formatDateString(data?.endDate, dateFormat.mainDate, true) || '',
  },
];

const validation = (valueActions, alwaysON) => [
  {
    name: 'productCode',
    rule: {
      required: valueActions !== BranchBOM.levels.level_1 && `Product ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'priceCode',
    rule: {
      required: valueActions !== BranchBOM.levels.level_3 && `Price ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'categoryCode',
    rule: {
      required: valueActions !== BranchBOM.levels.level_3 && `Category ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'subCategoryCode',
    rule: {
      required: valueActions !== BranchBOM.levels.level_3 && `Sub Category ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'companyCode',
    rule: {
      required: `Company Code ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'bomBranchName',
    rule: {
      required: `Branch BOM Name ${Message.FIELD_REQUIRED}`,
      maxLength: {
        value: 100,
        message: Message.BRANCH_BOM.FIIELD_SIZE.replace(
          '<Field Name>',
          'Branch BOM Name'
        ).replace('<Field size>', 100),
      },
    },
  },
  {
    name: 'level',
    rule: {
      required: `Level ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'quantity',
    rule: {
      required:
        valueActions !== BranchBOM.levels.level_1 &&
        `Quantity ${Message.FIELD_REQUIRED}`,
      min: {
        value: 0.001,
        message: `Quantity ${Message.FIELD_REQUIRED}`,
      },

    },
  },
  {
    name: 'indicatorCode',
    rule: {
      required:
        valueActions !== BranchBOM.levels.level_1 &&
        valueActions !== BranchBOM.levels.level_3 &&
        `Indicator (Finance) ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'startDate',
    rule: {
      // UPDATE: NEW REQUIREMENT
      // required: !alwaysON && `Start Date ${Message.FIELD_REQUIRED}`,
      required: `Start Date ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'endDate',
    rule: {
      required: !alwaysON && `End Date ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'division',
    rule: {
      required: `Division ${Message.FIELD_REQUIRED}`,
    },
  },
];

// Columns in detail grid
const columnsDetail = (
  onFieldChange,
  configItemDataOnGrid,
  isDetailsPage,
  customRowImageClass,
  fieldsLabelArray
) => {
  const level = fieldsLabelArray.find((el) => el.label === 'Level').value;
  return [
    {
      title: 'No.',
      field: 'no',
      editable: 'never',
    },
    {
      title: 'Item',
      field: 'item',
      editable: 'never',
      render: (rowData) => {
        let infoList = [];
        if (rowData.entity === ConfigEntity.MATERIAL) {
          infoList = [
            { fieldName: 'sku', label: 'Code' },
            { fieldName: 'description', noLabel: true },
            { fieldName: 'baseUom', label: 'BOM Unit' },
            // { fieldName: 'materialType', label: 'Type' },
            // { fieldName: 'materialGroup', label: 'Group' },
          ];
        } else if (rowData.entity === ConfigEntity.BOM_BRANCH) {
          infoList = [
            { fieldName: 'bomBranchCode', label: 'Branch BOM Code' },
            { fieldName: 'bomBranchName', label: 'Name' },
            { fieldName: 'productUnit', label: 'Unit' },
            { fieldName: 'categoryName', label: 'Category' },
          ];
        } else {
          infoList = [
            { fieldName: 'bomGroupCode', label: 'Branch BOM Group Code' },
            {
              fieldName: 'bomGroupName',
              label: 'Name',
            },
          ];
        }
        return (
          <div>
            {infoList.map((el) => (
              <div key={el.fieldName} className="branchBOM-link">
                {el.label && `${el.label}:`} {rowData[el.fieldName]}
              </div>
            ))}
          </div>
        );
      },
      cellStyle: {
        width: '20%',
      },
    },
    {
      title: 'Status',
      field: 'statusName',
      editable: 'never',
      hidden: level === BranchBOM.levelName.level_1,
      render: (rowData) => {
        return rowData.entity === ConfigEntity.BOM_BRANCH
          ? rowData.statusName
          : '-';
      },
    },
    {
      title: 'Level',
      field: 'levelName',
      editable: 'never',
      render: (rowData) => {
        return rowData.entity !== ConfigEntity.MATERIAL
          ? rowData.levelName
          : '-';
      },
    },
    {
      title: 'Buffet',
      field: 'buffet',
      render: function customEdit(rowData) {
        const fields = [
          {
            label: '',
            fieldName: 'buffet',
            fieldType: FieldConstant.type.CHECKBOX,
            className: FieldConstant.class.CHECKBOX,
            value: rowData.buffet,
            classCustom: 'textAlign-center',
          },
        ];
        if (isDetailsPage) {
          return rowData.buffet === 1 ? <CheckIcon /> : '-';
        }
        return rowData.entity === ConfigEntity.BOM_GROUP ? (
          <Fields
            conditionalArray={fields}
            onChange={(newValue) => {
              const newValueClone = newValue.target.value;
              onFieldChange('buffet', newValueClone, rowData);
            }}
          />
        ) : (
          '-'
        );
      },
    },
    {
      title: 'Quantity',
      field: 'quantity',
      render: function customEdit(rowData) {
        const isBuffet = rowData.buffet;
        const fields = [
          {
            label: '',
            fieldName: 'quantity',
            fieldType: FieldConstant.type.QUANTITY,
            className: FieldConstant.class.QUANTITY,
            value: isBuffet ? '' : rowData.quantity || '',
            classCustom: isBuffet && 'disableQty',
            maximumValue: 999999999.999,
            minimumValue: 0,
            numberDecimalCharacter: MaterialUnitIsDecimal.includes(rowData?.baseUom) ? BranchBOM.configDecimal : 0,
          },
        ];
        if (isDetailsPage) {
          return rowData.quantity > 0
            ? rowData.buffet === 1
              ? '-'
              : rowData.quantity
            : '-';
        }
        return (
          <Fields
            conditionalArray={fields}
            onChange={(item, newValue) =>
              onFieldChange(
                OrderConstant.quantity,
                isBuffet ? '' : newValue,
                rowData
              )
            }
          />
        );
      },
      width: 150,
    },
    {
      title: 'Indicator',
      field: 'indicator',
      render: function customEdit(rowData) {
        const fields = [
          {
            label: '',
            fieldName: 'indicator',
            id: `indicator${rowData.id}`,
            fieldType: FieldConstant.type.SELECT,
            className: FieldConstant.class.SELECT,
            classCustom: 'full-width-column-field',
            value: rowData.indicator || rowData.indicatorCode || '',
            data: configItemDataOnGrid.indicator,
            disabled: configItemDataOnGrid.displayIndicatorDetail,
          },
        ];
        if (isDetailsPage) {
          return rowData.indicatorName || '-';
        }
        return (
          <Fields
            conditionalArray={fields}
            onChange={(e) =>
              onFieldChange('indicator', e.target.value, rowData)
            }
          />
        );
      },
      width: 200,
    },
  ];
};

const options = (isDetailsPage) => ({
  search: false,
  toolbar: true,
  draggable: false,
  paging: false,
  sorting: false,
  exportButton: false,
  showTitle: false,
  selection: !isDetailsPage,
});

// Config for action in detail grid
const actions = ({
  addBranchBomHandler,
  addMaterialHandler,
  addBranchBomGroup,
  hidden = '',
  isServiceMaterial,
}) => [
  {
    icon: () => ({}),
    tooltip: 'Remove',
    isFreeAction: true,
    hidden: hidden === '',
    onClick: () => {},
  },
  {
    icon: <AddIcon />,
    tooltip: 'Select Group',
    isFreeAction: true,
    customHandler: addBranchBomGroup,
    hidden:
      hidden === '' || hidden === BranchBOM.levels.level_3 || isServiceMaterial,
    isAddItemsPopup: true,
    onClick: () => {},
  },
  {
    icon: <AddIcon />,
    tooltip: 'Select Materials',
    isFreeAction: true,
    customHandler: addMaterialHandler,
    hidden: hidden === '',
    isAddItemsPopup: true,
    onClick: () => {},
  },
  {
    icon: <AddIcon />,
    tooltip: 'Select Branch BOMs',
    isFreeAction: true,
    customHandler: addBranchBomHandler,
    hidden:
      hidden === '' || hidden === BranchBOM.levels.level_3 || isServiceMaterial,
    isAddItemsPopup: true,
    onClick: () => {},
  },
];

// Fields in search form on 'Add items' form
const addItemsFieldArray = (level, category, status) => [
  {
    label: 'Branch BOM Code',
    id: 'bomBranchCode',
    fieldName: 'bomBranchCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
  },
  {
    label: 'Level',
    id: 'level',
    fieldName: 'level',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: level || [],
  },
  {
    label: 'Category',
    id: 'category',
    fieldName: 'category',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: category || [],
  },
  {
    label: 'Branch BOM Name',
    id: 'bomBranchName',
    fieldName: 'bomBranchName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    disabled: true,
    data: status || [],
    value: String(BranchBOM.status.active),
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

// Fields in search form on 'Add Group' form
const addItemsFieldsGroup = (level) => [
  {
    label: 'Branch BOM Group Code',
    id: 'bomGroupCode',
    fieldName: 'bomGroupCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    data: [],
  },
  {
    label: 'Name',
    id: 'bomGroupName',
    fieldName: 'bomGroupName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Level',
    id: 'level',
    fieldName: 'level',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: level || [],
  },
];

// Fields in search form on 'Add Materials' form
const addItemsFieldsMaterials = (materialType, materialGroup) => [
  {
    label: 'Material Type',
    id: 'materialType',
    fieldName: 'materialType',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: materialType || [],
  },
  {
    label: 'Material Group',
    id: 'materialGroup',
    fieldName: 'materialGroup',
    fieldType: FieldConstant.type.MULTI_SELECT,
    className: FieldConstant.class.MULTI_SELECT,
    data: materialGroup || [],
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
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

const bottomGridButtons = (
  status,
  handleActive,
  handleInActive,
  handleUnConfirm,
  handleConfirm,
  handleClose,
  handleEdit
) => [
  {
    title: 'Close Document',
    className: 'btnNeutral',
    handleClick: handleClose,
    hidden:
      status !== BranchBOM.status.draft && 
      status !== BranchBOM.status.inactive && 
      status !== BranchBOM.status.unconfirmed,
    customHandleClick: true,
  },
  {
    title: 'Edit',
    className: 'btnFullWidth',
    handleClick: handleEdit,
    // hidden:
    //   status !== BranchBOM.status.draft &&
    //   status !== BranchBOM.status.unconfirmed,
    customHandleClick: true,
  },
  {
    title: 'Inactive',
    className: 'btnDanger',
    handleClick: handleInActive,
    hidden: status !== BranchBOM.status.active,
    customHandleClick: true,
  },
  {
    title: 'Active',
    className: 'btnPrimary',
    handleClick: handleActive,
    hidden: status !== BranchBOM.status.inactive,
    customHandleClick: true,
  },
  {
    title: 'Unconfirm',
    className: 'btnDanger',
    handleClick: handleUnConfirm,
    hidden: status !== BranchBOM.status.confirmed,
    customHandleClick: true,
  },
  {
    title: 'Confirm',
    className: 'btnPrimary',
    handleClick: handleConfirm,
    hidden:
      status !== BranchBOM.status.draft &&
      status !== BranchBOM.status.unconfirmed,
    customHandleClick: true,
  },
];

//Fields for Branch BOM function Add/ Edit
const fieldsForm = {
  product: 'productCode',
  price: 'priceCode',
  category: 'categoryCode',
  sub_cate: 'subCategoryCode',
  level: 'level',
  quantity: 'qty',
  companyCode: 'companyCode',
  indicatorCode: 'indicatorCode',
  startDate: 'startDate',
  endDate: 'endDate',
  serviceMaterial: 'serviceMaterial',
  alwaysOn: 'alwaysOn',
  division: 'division',
};

const informationConvert = {
  MATERIAL: [
    { label: OrderConstant.sku },
    { label: OrderConstant.description },
  ],
  BOM_GROUP: [
    { label: OrderConstant.sku },
    { label: OrderConstant.bomGroupName },
    { label: 'Level:', value: OrderConstant.level },
  ],
  BOM_BRANCH: [
    { label: OrderConstant.sku },
    { label: OrderConstant.bomBranchName },
    { label: 'Level:', value: OrderConstant.level },
  ],
};

export {
  compareFields,
  comparedDetail,
  getFields,
  validation,
  columnsDetail,
  options,
  actions,
  addItemsFieldArray,
  fieldsForm,
  addItemsFieldsGroup,
  addItemsFieldsMaterials,
  getFieldsTextOnly,
  bottomGridButtons,
  informationConvert,
};
