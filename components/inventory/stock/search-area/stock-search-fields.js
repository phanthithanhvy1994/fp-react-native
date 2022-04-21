import { FieldConstant } from '../../../../constants/constants';

const fields = (onBranchChange) => [
  {
    label: 'Branch',
    id: 'branch',
    fieldName: 'branch',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    className: FieldConstant.class.SELECT,
    customOnChange: onBranchChange,
  },
  {
    label: 'Storage Type',
    id: 'storageType',
    fieldName: 'storageType',
    fieldType: FieldConstant.type.SELECT,
    data: [],
    className: FieldConstant.class.SELECT,
  },
  {
    label: 'Material Group',
    id: 'material-group',
    fieldName: 'materialGroup',
    fieldType: FieldConstant.type.MULTI_SELECT,
    data: [],
    disabled: false,
    className: FieldConstant.class.SELECT,
  },
  {
    label: 'Material Code',
    id: 'material-code',
    fieldName: 'materialCode',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Material Description',
    id: 'material-description',
    fieldName: 'materialDescription',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Min Stock Level',
    id: 'minStockLevel',
    fieldName: 'minStockLevel',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    label: 'Max Stock Level',
    id: 'maxStockLevel',
    fieldName: 'maxStockLevel',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
  {
    fieldType: FieldConstant.type.NONE,
  },
];

export default fields;
