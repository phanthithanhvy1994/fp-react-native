import React from 'react';
import PropTypes from 'prop-types';
import formStyles from '../../../style/core/search/search';
import useStyles from './fieldset.style';

function Fieldset(props) {
  const { title, children, customClasses } = props;
  const formClasses = formStyles();
  const classes = useStyles();
  return (
    <fieldset className={`${formClasses.fpbForm} ${classes.fieldsetCls} ${customClasses || ''}`}>
      <legend>{title}</legend>
      {children}
    </fieldset>
  );
}

Fieldset.propTypes = {
  title: PropTypes.string,
  children: PropTypes.any,
  customClasses: PropTypes.any,
};

export default Fieldset;
