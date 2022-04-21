import { dateFormat } from '../../../util/constant';

const fields = [
  {
    label: 'textBox',
    id: 'id',
    fieldName: 'textName',
    fieldType: 'text',
    required: true,
    className: 'fldText',
    classCustom: '',
  },
  {
    label: 'numberBox',
    id: 'id',
    fieldName: 'numberName',
    fieldType: 'number',
    required: true,
    className: 'fldText',
    classCustom: '',
  },
  {
    label: 'picker',
    id: 'id',
    fieldName: 'pickerName',
    fieldType: 'picker',
    format: dateFormat.mmddyyyy,
    required: true,
    className: 'fldPicker',
    classCustom: '',
  },
  {
    label: 'selectBox',
    id: 'id',
    fieldName: 'select',
    fieldType: 'select',
    required: true,
    data: [
      {
        display: 'Ten',
        value: 10,
      },
      {
        display: 'Twenty',
        value: 20,
      },
    ],

    className: 'fldSelect',
    classCustom: '',
  },
];

export default fields;
