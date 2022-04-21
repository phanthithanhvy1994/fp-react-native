import { FieldConstant } from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';

const addFields = [
  {
    label: 'Price List Name',
    id: 'bomPriceName',
    fieldName: 'bomPriceName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    required: true,
  },
  {
    label: 'Branch Group',
    id: 'branchGroupCode    ',
    fieldName: 'branchGroupCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    data: [],
  },
  {
    label: 'Channel',
    id: 'channel',
    fieldName: 'channel',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    data: [],
  },
  {
    label: 'Company Code',
    id: 'companyCode',
    fieldName: 'companyCode',
    fieldType: FieldConstant.type.SELECT,
    className: FieldConstant.class.SELECT,
    required: true,
    data: [],
  },
  {
    label: 'Start Date',
    id: 'startDate',
    fieldName: 'startDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    value: null,
    required: true,
  },
  {
    label: 'End Date',
    id: 'endDate',
    fieldName: 'endDate',
    fieldType: FieldConstant.type.PICKER,
    className: FieldConstant.class.PICKER,
    value: null,
    required: true,
  },
  {
    label: 'Note',
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

const validation = [
  {
    name: 'bomPriceName',
    rule: {
      required: `Price List Name ${Message.FIELD_REQUIRED}`,
      maxLength: {
        value: 256,
        message: `${Message.BRANCH_BOM_PRICE.MAX_LENGTH}`,
      },
    },
  },
  {
    name: 'branchGroupCode',
    rule: {
      required: `Branch Group ${Message.FIELD_REQUIRED}`,
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
];

export { addFields, validation };
