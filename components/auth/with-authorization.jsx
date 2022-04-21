import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectTempUser, selectUser } from '../../redux/auth/AuthSelect';

class WithAuthorization extends React.Component {
  static defaultProps = {
    visibleRestriction: [], // If specified, only visible to specific ones
    enableRestriction: [], // If specified, only enable to specific ones
  };

  render() {
    const { user, children } = this.props;
    // TODO: check user role with visibleRestriction and enableRestriction
    return user ? children : null;
  }
}

WithAuthorization.propTypes = {
  user: PropTypes.any,
  children: PropTypes.any,
};

const mapStateToProps = createStructuredSelector({
  user: selectUser,
  tempUser: selectTempUser,
});

export default connect(mapStateToProps)(WithAuthorization);
