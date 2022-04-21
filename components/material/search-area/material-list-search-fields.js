import { FieldConstant, CategoryConstant } from '../../../constants/constants';

const fields = [
  {
    label: 'Material Type',
    id: 'materialType',
    fieldName: CategoryConstant.materialType,
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Material Group',
    id: 'materialGroup',
    fieldName: CategoryConstant.materialGroup,
    fieldType: FieldConstant.type.MULTI_SELECT,
    required: false,
    data: [],
    className: FieldConstant.class.SELECT,
    classCustom: '',
  },
  {
    label: 'Material Code',
    id: 'materialCode',
    fieldName: CategoryConstant.materialCode,
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: 'Field-fldText',
  },
  {
    label: 'Material Description',
    id: 'materialDescription',
    fieldName: CategoryConstant.materialDescription,
    fieldType: FieldConstant.type.TEXT,
    required: false,
    className: FieldConstant.class.TEXT,
    classCustom: 'Field-fldText',
  },
];

export default fields;
