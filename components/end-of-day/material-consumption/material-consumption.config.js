import { FieldConstant } from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';
import { dateFormat } from '../../../constants/constants';

const fieldArray = [
  {
    label: 'Branch',
    id: 'branchCode',
    fieldName: 'branchCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.type.SELECT,
    data: [],
  },
  {
    label: 'Company Code',
    id: 'companyCode',
    fieldName: 'companyCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.type.SELECT,
    data: [],
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    inputType: 'date',
    value: new Date(),
    initialValue: new Date()
  },
  {
    label: 'Submitted Date',
    id: 'submittedDate',
    fieldName: 'submittedDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
  },
];

const columnsDetail = [
  {
    title: 'No',
    field: 'no',
  },
  {
    title: 'Item',
    field: 'itemName',
  },
  { title: 'Storage Type', field: 'storageTypeName' },
  { title: 'Quantity', field: 'quantity' },
  { title: 'Base Unit', field: 'baseUnit' },
  { title: 'Menu Name', field: 'menuName'},
  { title: 'Promotion Category', field: 'itemCategory' },
  { title: 'Product Category', field: 'productCategory'},
  { title: 'Service Mode ', field: 'serviceMode'},
  { title: 'Material Group', field: 'materialGroupName'},
  { title: 'Material Type', field: 'materialTypeName'},
];

const fieldsLabelArray = dataDetails => {
  const field = [
    {
      label: 'Branch',
      fieldName: 'branchName',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dataDetails?.branchName || '',
    },
    {
      label: 'Company Code',
      fieldName: 'companyCode',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dataDetails?.companyCode || '',
    },
    {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        formatDateString(dataDetails?.createdDate, dateFormat.mainDate, true) ||
        '',
    },
    {
      label: 'Submitted Date',
      fieldName: 'submittedDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value:
        formatDateString(
          dataDetails?.submittedDate,
          dateFormat.mainDate,
          true
        ) || '',
    },
  ];
  return field;
};

const bottomGridButtonsArray = (onSubmit, isSubmitted) => [
  {
    title: 'Submit',
    handleFor: 'submit',
    className: 'btnPrimary',
    handleClick: onSubmit,
    hidden: isSubmitted,
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

const exportConfigs = {
  fileName: 'Material-Consumption',
  headers: [
    'No',
    'Created Date',
    'Submitted Date',
    'Note',
    'GM Code',
    'Branch',
    'Company Code',
    'Item',
    'Storage Type',
    'Quantity',
    'Base Unit',
    'Menu Name',
    'Promotion Category',
    'Product Category',
    'Service Mode',
    'Material Group',
    'Material Type',
  ],
  unusedFields: ['Description'],
};

export {
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  options,
  fieldArray,
  exportConfigs,
};
