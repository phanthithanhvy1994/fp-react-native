import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import MatButton from '@material-ui/core/Button';
import isEmpty from 'lodash/isEmpty';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useStyles from '../../../style/core/button/button';

class Button extends React.Component {
  render() {
    const {
      handleClick, // Event click
      title,
      type,
      disabled,
      hidden,
      className, // Setup color[btnPrimary, btnDanger, btnWarning, btnSuccess, btnSecondary]
      classCustom, // Customize class override css default class
      icon, // FontAwesome or material icons
      isFontAwesome, // True[FontAwesome] - False[Material UI]
      iconImg,
      endIcon,
    } = this.props;

    const { classes } = this.props;

    const classDefault = clsx(classCustom, classes.fpbBtn);

    return (
      <>
        <MatButton
          type={type}
          className={`${classDefault} ${classes[className]}`}
          onClick={handleClick}
          disabled={disabled}
          hidden={hidden}
          endIcon={endIcon}
        >
          {iconImg && <img src={iconImg} alt={'iconImg'} />}
          {!isEmpty(icon) && (
            <>
              {isFontAwesome ? (
                <FontAwesomeIcon className={classes.BtnIcon} icon={icon} />
              ) : (
                icon && <span className={classes.BtnIcon}>{icon}</span>
              )}
            </>
          )}
          {title}
        </MatButton>
      </>
    );
  }
}

Button.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  hidden: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.object,
  endIcon: PropTypes.any,
  classes: PropTypes.object,
  classCustom: PropTypes.any,
  isFontAwesome: PropTypes.any,
  iconImg: PropTypes.any,
};

export default withStyles(useStyles)(Button);
