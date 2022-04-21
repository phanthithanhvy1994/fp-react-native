import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormControl } from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { selectTempUser } from '../../redux/auth/auth.selectors';
import authService from '../../services/auth-service';
import FormValidatorWrapper from '../shared/form/form-validator-wrapper.component';
import FormErrors from '../shared/form/form-errors';
import { removeTempUser, setUser } from '../../redux/auth/auth.actions';
import InputField from '../shared/form-elements/input-field.component';

class ChangePassword extends Component {
  state = {
    formState: {
      password: '',
      confirmPassword: '',
    },
    errors: {
      cognito: '',
      blankfield: false,
    },
  };

  updateFormState = (attribute, value) => {
    this.setState(prevState => ({
      ...prevState,
      formState: {
        ...prevState.formState,
        [attribute]: value,
      },
      // Clear error of input
      errors: {
        ...prevState.errors,
        [attribute]: null,
      },
    }));
  };

  validateForm = () => {
    let valid = true;

    // Clear all errors
    this.setState(prevState => ({
      ...prevState,
      errors: [],
    }));

    // Begin validate

    // Password
    if (!this.state.formState.password) {
      this.addError('password', 'Please input password.');
      valid = false;
    }

    // Confirm Password
    if (!this.state.formState.confirmPassword) {
      this.addError('confirmPassword', 'Please input confirmation password.');
      valid = false;
    }

    if (
      this.state.formState.password !== this.state.formState.confirmPassword
    ) {
      this.addError(
        'confirmPassword',
        'Please input confirmation password the same as password.'
      );
      valid = false;
    }

    if (
      this.state.formState.password &&
      this.state.formState.password.length < 8
    ) {
      this.addError('password', 'The minimum length of password is 8.');
      valid = false;
    }

    return valid;
  };

  addError = (fieldName, errorMessage) => {
    this.setState(prevState => ({
      ...prevState,
      errors: {
        ...prevState.errors,
        [fieldName]: errorMessage,
      },
    }));
  };

  handleChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.updateFormState(name, value);
  };

  handleSubmit = async event => {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }
    const { password } = this.state.formState;
    const { tempUser } = this.props;
    try {
      const user = await authService.completeNewPassword(tempUser, password);
      this.removeTempUser();
      Promise.all([
        authService.userAttributes(user),
        // UserManagementService.getUserAccessControl(user.username),
      ]).then(res => {
        const userAttr = res[0];
        localStorage.setItem('accessControl', JSON.stringify(res[1].data));
        setUser(user, userAttr);
      });
    } catch (error) {
      let err = null;
      if (!error.message) {
        err = { message: error };
      } else {
        err = error;
      }
      this.setState({
        errors: { ...this.state.errors, cognito: err },
      });
    }
  };

  removeTempUser = () => {
    removeTempUser();
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={8} className="col-centered">
            <Form>
              <Row className="bg-white p-4 mt-4">
                <Col md={8} lg={7} className="col-centered text-center">
                  <Form.Group as={Row} controlId="formHorizontalTitle">
                    <h2>Require a new password</h2>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formHorizontalTitle">
                    <FormErrors formerrors={this.state.errors} />
                  </Form.Group>
                </Col>

                <Col md={8} lg={7} className="col-centered text-center">
                  <Form.Group as={Row} controlId="formHorizontalPassword">
                    <FormValidatorWrapper error={this.state.errors.password}>
                      <FormControl fullWidth>
                        <InputField
                          name="password"
                          type="password"
                          label="Enter password"
                          value={this.state.formState.password}
                          onChange={this.handleChange}
                          error={!!this.state.errors.password}
                        />
                      </FormControl>
                    </FormValidatorWrapper>
                  </Form.Group>
                  <Form.Group
                    as={Row}
                    controlId="formHorizontalConfirmPassword"
                  >
                    <FormValidatorWrapper
                      error={this.state.errors.confirmPassword}
                    >
                      <FormControl fullWidth>
                        <InputField
                          name="confirmPassword"
                          type="password"
                          label="Enter password again"
                          value={this.state.formState.confirmPassword}
                          onChange={this.handleChange}
                          error={!!this.state.errors.confirmPassword}
                        />
                      </FormControl>
                    </FormValidatorWrapper>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formHorizontalHaveAnAccount">
                    <div className="w-100">
                      <span className="text-secondary float-left">
                        Have an account?
                      </span>
                      <Link
                        to="/login"
                        onClick={this.removeTempUser}
                        className="normal-link text-secondary"
                      >
                        Sign in
                      </Link>
                      <span
                        className="gold-color bold link float-right ml-5"
                        onClick={this.handleSubmit}
                      >
                        Submit
                      </span>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

ChangePassword.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  tempUser: PropTypes.any,
  setTempUser: PropTypes.func,
  removeUser: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  tempUser: selectTempUser,
});

// const mapDispatchToProps = dispatch => ({
//   setUser: (user, userAttr) => dispatch(setUser(user, userAttr)),
//   removeTempUser: () => dispatch(removeTempUser()),
// });

export default connect(
  mapStateToProps,
  null
)(ChangePassword);
