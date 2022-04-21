import { Message } from '../../../constants/messages';

const validation = [
  {
    name: 'code',
    rule: {
      maxLength: {
        value: 10,
        message: Message.Material.matMSG001,
      },
    },
  },
  {
    name: 'category',
  },
  {
    name: 'name',
    rule: {
      maxLength: {
        value: 10,
        message: Message.Material.matMSG001,
      },
    },
  },
];

export default validation;
