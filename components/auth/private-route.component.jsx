import React, { Component } from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import ErrorBoundary from '../shared/error-boundary/error-boundary.component';

class PrivateRoute extends Component {
  render() {
    const userInfo = localStorage.getItem('userInfo');
    const unLogin = isEmpty(userInfo);

    // eslint-disable-next-line no-shadow
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props => {
          if (unLogin) {
            return (
              <Redirect
                to={{ pathname: '/login', state: { from: props.location } }}
              />
            );
          }

          return (
            <ErrorBoundary>
              <Component {...props} />
            </ErrorBoundary>
          );
        }}
      />
    );
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.any,
};

export default PrivateRoute;
