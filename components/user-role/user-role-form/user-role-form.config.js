import { FieldConstant } from '../../../constants/constants';
import { Message } from '../../../constants/messages';

const fields = [
  {
    label: 'Role Name',
    id: 'roleName',
    fieldName: 'roleName',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    validation: {
      required: 'Required',
    },
  },
  {
    label: 'Description',
    id: 'description',
    fieldName: 'description',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
  },
];

const validation = [
  {
    name: 'roleName',
    rule: {
      required: `Role name ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'description',
    rule: {
      required: `Description ${Message.FIELD_REQUIRED}`,
    },
  },
];

export { fields, validation };
