import React from 'react';
import {FieldConstant} from '../../../constants/constants';
import {ReactComponent as ScanQR} from '../../../assets/scanQR.svg';

const addFields = [
  {
    label: 'Sale Order No.',
    id: 'saleOrderNo',
    fieldName: 'saleOrderNo',
    fieldType: FieldConstant.type.TEXT,
    className: FieldConstant.class.TEXT,
    // Show asterisk in label.
    required: true,
    // Icon action in input field.
    endAdornment: {
      icon: function customIcon() {
        return <ScanQR />;
      },
      handleClick: () => {
      },
      disabled: false,
    },
    classCustom: 'customField'
  }
];

export { addFields };