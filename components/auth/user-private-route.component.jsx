import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import authService from '../../services/auth-service';

class UserPrivateRoute extends React.Component {
  render() {
    // eslint-disable-next-line no-shadow
    const { component: Component, ...rest } = this.props;
    const user = authService.getUserInfo();
    return (
      <Route
        {...rest}
        render={props => {
          if (user === 1) {
            return (
              <Redirect
                to={{ pathname: '/', state: { from: props.location } }}
              />
            );
          }

          return <Component {...props} />;
        }}
      />
    );
  }
}

UserPrivateRoute.propTypes = {
  component: PropTypes.any,
};

export default UserPrivateRoute;
