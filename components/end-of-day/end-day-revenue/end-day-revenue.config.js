import {
  FieldConstant,
  dateFormat
} from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';

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
    data: []
  },
  {
    label: 'Created Date',
    id: 'createdDate',
    fieldName: 'createdDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    inputType: 'date',
    value: new Date() ,
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
  { title: 'No', field: 'no'},
  { title: 'Reference', field: 'reference'},
  { title: 'Doc Header Text', field: 'docHeaderText'},
  { title: 'Posting Key', field: 'postingKey'},
  { title: 'GL Account', field: 'glAccount'},
  { title: 'Customer No.', field: 'customer'},
  { title: 'Vendor', field: 'vendor'},
  { title: 'Amount', field: 'amount' },
  { title: 'Tax Code', field: 'taxCode' },
  { title: 'Calculate Tax', field: 'calculateTax' },
  { title: 'Tax Amount', field: 'taxAmount' },
  { title: 'Tax Base Amount', field: 'taxBaseAmount'},
  { title: 'Payment Type', field: 'paymentType'},
  { title: 'Profit Center', field: 'profitCenter'},
  { title: 'Assignment', field: 'assignment'},
  { title: 'Text', field: 'text'},
  { title: 'Branch', field: 'branch' },
  { title: 'Menu Name', field: 'menuName' },
  { title: 'Promotion Category', field: 'promotionCategory' },
  { title: 'Product Category', field: 'productCategory' },
  { title: 'Service Mode', field: 'serviceMode' },
  { title: 'SGL', field: 'sgl'},
  { title: 'Payment Term', field: 'paymentTerm' },
  { title: 'Payment Method', field: 'paymentMethod' },
  { title: 'Baseline Date/Due on', field: 'baselineDate' },
  { title: 'Value Date', field: 'valueDate' },
  { title: 'Payment Block', field: 'paymentBlock' },
  { title: 'Cost Center', field: 'costCenter' },
  { title: 'Order', field: 'order' },
  { title: 'Reference Key 2', field: 'referenceKey2'},
  { title: 'Reference Key 3', field: 'referenceKey3' },
  { title: 'Trading Partner', field: 'tradingPartner' },
  { title: 'Customer Branch Code', field: 'customerBranchCode' },
  { title: 'Controlling Area', field: 'controllingArea' },
  { title: 'Sales Organization', field: 'salesOrganization' },
  { title: 'Distribution Channel', field: 'distributionChannel' },
  { title: 'Division', field: 'division' },
  { title: 'Customer', field: 'customerNo'},
  { title: 'Customer Group', field: 'customerGroup'},
  { title: 'Customer Group1', field: 'customerGroup1' },
  { title: 'Customer Group2', field: 'customerGroup2' },
  { title: 'Country', field: 'country' },
  { title: 'Sales Office', field: 'salesOffice' },
  { title: 'Sales Group', field: 'salesGroup' },
  { title: 'Product', field: 'product' },
  { title: 'Material Group 1', field: 'materialGroup1' },
];

const fieldsLabelArray = (dataDetails) => {
  const field = [
    {
      label: 'Company Code',
      fieldName: 'companyCode',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dataDetails?.companyCode || ''
    },
    {
      label: 'Doc Type',
      fieldName: 'docType',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dataDetails?.docType || ''
    },
    {
      label: 'Created Date',
      fieldName: 'createdDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: formatDateString(dataDetails?.createdDate, dateFormat.mainDate, true) || ''
    },
    {
      label: 'Currency',
      fieldName: 'currency',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dataDetails?.currency || ''
    },
    {
      label: 'Submitted Date',
      fieldName: 'submittedDate',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: formatDateString (dataDetails?.submittedDate, dateFormat.mainDate, true) || ''
    },
    {
      label: 'Business Place',
      fieldName: 'businessPlace',
      fieldType: FieldConstant.type.TEXT_ONLY,
      value: dataDetails?.businessPlace || ''
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
    hidden: isSubmitted
  },
];

const exportConfigs = {
  fileName: 'Revenue-List',
  headers: [
    'No',
    'Company Code',
    'Created Date',
    'Submitted Date',
    'Doc Type',
    'Currency',
    'Exchange Rate',
    'Reference',
    'Doc Header Text',
    'Business Place',
    'Posting Key',
    'GL Account',
    'Customer',
    'Amount',
    'Tax Code',
    'Calculate Tax',
    'Tax Amount',
    'Tax Base Amount',
    'Payment Type',
    'Profit Center',
    'Assignment',
    'Text',
    'Branch',
    'Menu Name',
    'Promotion Category',
    'Product Category',
    'Service Mode',
    'SGL',
    'Payment Term',
    'Payment Method',
    'Baseline Date/Due on',
    'Value Date',
    'Payment Block',
    'Cost Center',
    'Order',
    'Reference Key 2',
    'Reference Key 3',
    'Trading Partner',
    'Customer Branch Code',
    'Controlling Area',
    'Sales Organization',
    'Distribution Channel',
    'Division',
    'Customer',
    'Customer Group',
    'Customer Group1',
    'Customer Group2',
    'Country',
    'Sales office',
    'Sales group',
    'Product',
    'MaterialGroup 1',
  ],
  unusedFields: ['Description'],
};

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

export {
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  options,
  fieldArray,
  exportConfigs
};
