import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';

import logoHome from '../../assets/logoHome.png';
import useStyles from './home.style';

class Home extends React.Component {
  render() {
    const { t, classes } = this.props;

    return (
      <div className={classes.home}>
        <div>
          <Typography>{t('Welcome to')}</Typography>
          <img src={logoHome} alt="" />
        </div>
      </div>
    );
  }
}
Home.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.any,
};
export default withTranslation()(withStyles(useStyles)(Home));
