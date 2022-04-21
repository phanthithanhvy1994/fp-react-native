import React, { Component } from 'react';

import { Col, Form, Row } from 'react-bootstrap';
import authService from '../../../services/auth-service';
import { UserRole } from '../../../data/master-data';

export default class CustomField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRole: '',
    };
  }
  componentDidMount() {
    authService.getUserInfo().then(
      result => this.setState({ userRole: result.role }),
      error => {
        console.error(error);
      }
    );
  }

  render() {
    const { readOnly, fieldName, value, handleChange, name } = this.props;
    return (
      <>
        {this.state.userRole === UserRole.GSCCA_SUPPER_USER ? (
          <Form.Group as={Row} controlId="formHorizontalCustomField">
            <Form.Label column sm={4}>
              {fieldName}
            </Form.Label>
            <Col sm={8}>
              {readOnly ? (
                <Form.Label>{value}</Form.Label>
              ) : (
                <Form.Control
                  name={name}
                  type="text"
                  placeholder={fieldName}
                  onChange={handleChange}
                  value={value}
                />
              )}
            </Col>
          </Form.Group>
        ) : null}
      </>
    );
  }
}
