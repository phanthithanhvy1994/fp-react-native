import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core';

import { signOut } from '../../../actions/auth-action';
import history from '../../../util/history';

import useStyle from './header.style';
import avatar from '../../../assets/header/md-avatar.svg';

class UserDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
    };
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  signOut = () => {
    this.handleClose();
    signOut();
    localStorage.clear();
    history.push('/login');
  };

  render() {
    const { anchorEl } = this.state;
    const { user, t, classes } = this.props;

    return (
      <div>
        <Button
          aria-controls="menu"
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <img src={avatar} alt="Avatar" />
          <span className={classes.userTitle}>
            {t('Welcome')},<span>{user.userName}</span>
          </span>

          <ExpandMoreIcon></ExpandMoreIcon>
        </Button>
        <Menu
          className={classes.userDropdown}
          elevation={0}
          getContentAnchorEl={null}
          id="menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <MenuItem onClick={this.handleClose}> {t('Profile')}</MenuItem>
          <Divider />
          <MenuItem onClick={this.signOut}>{t('Logout')}</MenuItem>
        </Menu>
      </div>
    );
  }
}

UserDropdown.propTypes = {
  user: PropTypes.any,
  t: PropTypes.any,
  classes: PropTypes.object,
};
export default withTranslation()(withStyles(useStyle)(UserDropdown));
