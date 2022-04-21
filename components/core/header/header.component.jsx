import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core';

import UserDropdown from './user-dropdown.component';

import history from '../../../util/history';
import logo from '../../../assets/header/logo.svg';

import useStyle from './header.style';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.setState({
      user: this.props.userInfo,
    });
  }

  componentWillUnmountount() {
    this.setState({
      user: null,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userInfo !== this.props.userInfo) {
      this.setState({
        user: this.props.userInfo,
      });
    }
  }

  render() {
    const { user } = this.state;
    const { classes, t } = this.props;
    const isLogin = history.location.pathname === '/login';
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <div className={classes.divTitle}>
              <img className={classes.iconLogo} src={logo} alt="icon-logo" />
              <Typography className={classes.title}>BBS</Typography>
            </div>
            {user ? (
              <>
                <UserDropdown user={user}></UserDropdown>
              </>
            ) : (
              !isLogin && (
                <Link className={classes.btnLogin} to="/login">
                  {t('Login')}
                </Link>
              )
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Header.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
  userInfo: PropTypes.any,
};

export default withTranslation()(withStyles(useStyle)(Header));
