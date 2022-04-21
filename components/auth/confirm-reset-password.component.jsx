import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import { FormControl } from '@material-ui/core';

import authService from '../../services/auth-service';
import FormValidatorWrapper from '../shared/form/form-validator-wrapper.component';
import FormErrors from '../shared/form/form-errors';

import InputField from '../shared/form-elements/input-field.component';

class ConfirmResetPassword extends Component {
  state = {
    errors: {
      cognito: null,
      blankfield: false,
    },
    formState: {
      verificationCode: '',
      newPassword: '',
    },
  };

  clearErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
      },
    });
  };

  validateForm = () => {
    let valid = true;

    // Clear all errors
    this.setState(prevState => ({
      ...prevState,
      errors: [],
    }));

    if (!this.state.formState.verificationCode) {
      this.addError('verificationCode', 'Please input verification code.');
      valid = false;
    }

    if (!this.state.formState.newPassword) {
      this.addError('newPassword', 'Please input new password.');
      valid = false;
    }

    if (
      this.state.formState.newPassword &&
      this.state.formState.newPassword.length < 8
    ) {
      this.addError('newPassword', 'The minimum length of password is 8.');
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

  passwordVerificationHandler = async event => {
    event.preventDefault();
    this.clearErrorState();

    if (!this.validateForm()) {
      return;
    }

    try {
      const email = this.props.location.search.replace('?', '');
      await authService.forgotPasswordSubmit(
        email,
        this.state.formState.verificationCode,
        this.state.formState.newPassword
      );
      this.props.history.push('/success-change-password');
    } catch (error) {
      console.log(error);
      let err = null;
      if (!error.message) {
        err = { message: error };
      } else {
        err = error;
      }
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err,
        },
      });
    }
  };

  // resendCode = event => {
  //   event.preventDefault();
  //   const email = this.props.location.search?.replace('?', '');
  //   if (!email) {
  //     return;
  //   }
  //   authService.resendCode(email);
  // };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove('is-danger');
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={8} className="col-centered">
            <Form>
              <Row className="bg-white p-4 mt-4">
                <Col md={8} xl={7} className="col-centered ">
                  <h2>Reset your password</h2>
                  <p className="text-secondary">
                    Enter the code you received from email and set a new
                    password.
                  </p>
                  <FormErrors formerrors={this.state.errors} />
                  <Row>
                    <Col sm={12}>
                      <FormValidatorWrapper
                        error={this.state.errors.verificationCode}
                      >
                        <FormControl fullWidth>
                          <InputField
                            name="verificationCode"
                            label="Verification Code"
                            error={!!this.state.errors.verificationCode}
                            onChange={this.handleChange}
                            value={this.state.formState.verificationCode}
                          />
                        </FormControl>
                      </FormValidatorWrapper>
                    </Col>

                    <Col sm={12}>
                      <FormValidatorWrapper
                        error={this.state.errors.newPassword}
                      >
                        <FormControl fullWidth>
                          <InputField
                            name="newPassword"
                            type="password"
                            label="New Password"
                            error={!!this.state.errors.newPassword}
                            onChange={this.handleChange}
                            value={this.state.formState.newPassword}
                          />
                        </FormControl>
                      </FormValidatorWrapper>
                    </Col>
                    <Col sm={12} className="mt-3">
                      {/* <Link
                        className="text-secondary light resend-code"
                        onClick={this.resendCode}
                      >
                        Resend Code
                      </Link> */}
                      <span
                        onClick={this.passwordVerificationHandler}
                        className="gold-color bold link float-right"
                      >
                        Verify
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

ConfirmResetPassword.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
};

export default ConfirmResetPassword;
