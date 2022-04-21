const validation = [
  {
    name: 'code',
    rule: {
      required: 'error required',
      maxLength: {
        value: 10,
        message: 'error maxLength message',
      },
    },
  },
  {
    name: 'name',
    rule: {
      required: 'error required',
      minLength: {
        value: 2,
        message: 'error minLength message',
      },
    },
  },
  {
    name: 'telephone',
    rule: {
      required: 'error required',
      pattern: {
        value: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
        message: 'error telephone valid',
      },
    },
  },
  {
    name: 'email',
    rule: {
      required: 'error required',
      pattern: {
        value: /^[a-z][a-z0-9_/.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/,
        message: 'error email valid',
      },
    },
  },
  {
    name: 'role',
    rule: {
      min: {
        value: 20,
        message: 'error min message',
      },
    },
  },
  {
    name: 'position',
    rule: {
      max: {
        value: 10,
        message: 'error max message',
      },
    },
  },
  {
    name: 'branch',
    rule: {
      required: 'error required',
    },
  },
  {
    name: 'account',
    rule: {
      required: 'error required',
    },
  },
];

export default validation;
