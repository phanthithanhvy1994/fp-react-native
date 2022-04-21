import { Message } from '../../constants/messages';

const loginFields = [
  {
    id: 'Username',
    fieldName: 'username',
    fieldType: 'text',
    required: false,
    className: 'loginField',
    placeholder: 'Username',
    startAdornment: 'PersonIcon',
  },
  {
    id: 'password',
    fieldName: 'password',
    fieldType: 'password',
    required: false,
    className: 'loginField',
    placeholder: 'Password',
    startAdornment: 'LockIcon',
  },
];

const validation = [
  {
    name: 'username',
    rule: {
      required: `Username ${Message.FIELD_REQUIRED}`,
    },
  },
  {
    name: 'password',
    rule: {
      required: `Password ${Message.FIELD_REQUIRED}`,
    },
  },
];

export { loginFields, validation };
