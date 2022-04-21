import React from 'react';
import { Nav } from 'react-bootstrap';
import _ from 'lodash';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';

class NavLinkWrapper extends React.Component {
  render() {
    const { title, eventKey, fields, listErrors, ...otherProps } = this.props;
    let isError = false;
    _.forEach(fields, field => {
      if (listErrors[field]) {
        isError = true;
        return false;
      }
    });
    return (
      <Nav.Link eventKey={eventKey} {...otherProps}>
        {title}{' '}
        {isError && !otherProps.disabled ? (
          <PriorityHighIcon color="error" fontSize="small" />
        ) : null}
      </Nav.Link>
    );
  }
}

export default NavLinkWrapper;
