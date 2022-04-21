import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FormControl } from '@material-ui/core';
import FormErrors from '../shared/form/form-errors';
import authService from '../../services/auth-service';
import FormValidatorWrapper from '../shared/form/form-validator-wrapper.component';
import InputField from '../shared/form-elements/input-field.component';

class ResetPassword extends Component {
  state = {
    errors: {
      cognito: null,
      blankfield: false,
    },
    formState: {
      email: '',
      password: '',
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

    // email
    if (!this.state.formState.email) {
      this.addError('email', 'Please input email.');
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

  forgotPasswordHandler = async event => {
    event.preventDefault();

    // Form validation
    this.clearErrorState();
    // const error = Validate(event, this.state);
    // if (error) {
    //   this.setState({
    //     errors: { ...this.state.errors, ...error }
    //   });
    // }
    if (!this.validateForm()) {
      console.error('Form has error');
      return;
    }
    // AWS Cognito integration here
    try {
      await authService.forgotPassword(this.state.formState.email);
      this.props.history.push(
        `/confirm-reset-password?${this.state.formState.email}`
      );
    } catch (error) {
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
                    You will receive a verification code to reset your password.
                  </p>
                  <FormErrors formerrors={this.state.errors} />
                  <Row>
                    <Col sm={12}>
                      <FormValidatorWrapper error={this.state.errors.email}>
                        <FormControl fullWidth>
                          <InputField
                            name="email"
                            label="Email *"
                            error={!!this.state.errors.email}
                            onChange={this.handleChange}
                            value={this.state.formState.email}
                          />
                        </FormControl>
                      </FormValidatorWrapper>
                    </Col>
                    <Col sm={12} className="mt-3">
                      <span
                        onClick={this.forgotPasswordHandler}
                        className="gold-color bold link"
                      >
                        Submit
                      </span>
                      <p className="float-right d-inline-block">
                        <b>
                          <Link
                            className="text-secondary bold"
                            onClick={this.props.history.goBack}
                          >
                            Back to login
                          </Link>
                        </b>
                      </p>
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

ResetPassword.propTypes = {
  history: PropTypes.any,
  location: PropTypes.any,
  setTempUser: PropTypes.func,
};

export default ResetPassword;
