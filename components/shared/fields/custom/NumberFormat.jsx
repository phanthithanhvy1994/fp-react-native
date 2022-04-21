import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';


export default function NumberFormatCustom(props) {
  const { inputRef, onChange, isDecimal,  ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
      decimalScale={isDecimal ? 3 : 0}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isDecimal: PropTypes.any,
};