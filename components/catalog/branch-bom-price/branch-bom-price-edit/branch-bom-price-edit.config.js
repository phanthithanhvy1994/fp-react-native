import { FieldConstant, BranchBOMPrice } from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';

const editFields = (status) => [
  {
    label: 'Price List Name',
    id: 'bomPriceName',
    fieldName: 'bomPriceName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
    disabled: !((status === BranchBOMPrice.status.draft) || (status === BranchBOMPrice.status.unConfirm))
  },
  {
    label: 'Start Date',
    id: 'startDate',
    fieldName: 'startDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
  },
  {
    label: 'End Date',
    id: 'endDate',
    fieldName: 'endDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    required: true,
  },
  {
    label: 'Company Code',
    id: 'companyCode',
    fieldName: 'companyCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    data: [],
    disabled: !((status === BranchBOMPrice.status.draft) || (status === BranchBOMPrice.status.unConfirm))
  },
  {
    label: 'Channel',
    id: 'channel',
    fieldName: 'channel',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    data: [],
    disabled: !((status === BranchBOMPrice.status.draft) || (status === BranchBOMPrice.status.unConfirm))
  },
  {
    label: 'Branch Group',
    id: 'branchGroupCode',
    fieldName: 'branchGroupCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    data: [],
    disabled: !((status === BranchBOMPrice.status.draft) || (status === BranchBOMPrice.status.unConfirm))
  },
  {
    label: 'Status',
    id: 'status',
    fieldName: 'status',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    disabled: true,
    data: [],
  },
  {
    label: 'Note',
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    disabled: !((status === BranchBOMPrice.status.draft) || (status === BranchBOMPrice.status.unConfirm))
  },
  {
    fieldName: 'none',
    fieldType: FieldConstant.type.NONE,
  },
];

const comparedFields = [
  'bomPriceName',
  'branchGroupCode',
  'companyCode',
  'channel',
  'startDate',
  'endDate',
  'status',
  'description',
];

const comparedDetail = [
  'itemCode',
  'price',
  'taxCode',
  'description',
];

const importHeaders = [
  'Branch BOM Code',
  'Branch BOM Name',
  'Sub BOM Code',
  'Sub BOM Name',
  'Level',
  'Indicator',
  'Price',
  'Tax Code',
  'Category',
];

const editOptions = (handleCustomRow) => ({
  search: false,
  toolbar: false,
  draggable: false,
  paging: false,
  sorting: true,
  exportButton: false,
  showTitle: false,
  selection: true,
  rowStyle: (rowData) => handleCustomRow(rowData)
});

const validation = [
  {
    name: 'bomPriceName',
    rule: {
      required: `Price List Name ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'branchGroupCode',
    rule: {
      required: `BOM Group Code ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'companyCode',
    rule: {
      required: `Company Code ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'channel',
    rule: {
      required: `Channel ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'startDate',
    rule: {
      required: `Start Date ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'endDate',
    rule: {
      required: `End Date ${Message.FIELD_REQUIRED}`,
    },
  },

  {
    name: 'status',
    rule: {
      required: `Status ${Message.FIELD_REQUIRED}`,
    },
  },
];

export {
  editFields,
  comparedFields,
  comparedDetail,
  importHeaders,
  editOptions,
  validation,
};
