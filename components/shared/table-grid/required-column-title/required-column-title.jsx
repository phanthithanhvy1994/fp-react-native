import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import useStyles from './required-column-title.style';

const RequiredColumnTitle = props => {
  const { titleName, classes, isRequired } = props;

  return (
    <>
      <div className={classes.root}>
        {titleName} {isRequired && <div className={classes.requiredSpan}>*</div>}
      </div>
    </>
  );
};

RequiredColumnTitle.propTypes = {
  classes: PropTypes.any,
  titleName: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default withStyles(useStyles)(RequiredColumnTitle);
