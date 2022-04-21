import React, { Component } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { FormControl } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FormValidatorWrapper from '../shared/form/form-validator-wrapper.component';
import FormErrors from '../shared/form/form-errors';
import FormWrapper from '../shared/form/form-wrapper';
// import { generatePassword } from '../../util/form-util';
// import { UserRole } from '../../data/master-data';
import InputField from '../shared/form-elements/input-field.component';
import SelectField from '../shared/form-elements/select-field.component';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialForm: {
        firstName: '',
        lastName: '',
        email: '',
        companyCode: '',
      },
      errors: {
        cognito: null,
        blankfield: false,
      },
      companyCode: [],
    };
  }

  componentDidMount() {}

  handleSubmit = async formState => {
    console.log(formState);
    //     const {
    //  firstName, lastName, email, companyCode
    // } = formState;
    // const user = {
    //   companyCode,
    //   email,
    //   firstName,
    //   lastName,
    //   role: UserRole.REQUESTOR,
    //   temporaryPassword: generatePassword(),
    // };
  };

  handleValidate = formState => {
    const errors = [];

    if (!formState.firstName) {
      errors.push({ name: 'firstName', message: 'First name is required.' });
    }

    if (!formState.lastName) {
      errors.push({ name: 'lastName', message: 'Last name is required.' });
    }

    if (!formState.email) {
      errors.push({ name: 'email', message: 'Email is required.' });
    }

    if (!formState.companyCode) {
      errors.push({
        name: 'companyCode',
        message: 'Please select a company code.',
      });
    }

    return errors;
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
            <FormWrapper
              initialValues={this.state.initialForm}
              handleSubmit={this.handleSubmit}
              handleValidate={this.handleValidate}
              render={({
                formError,
                formState,
                onChange,
                onSelectChange,
                onFormSubmit,
              }) => (
                <Form>
                  <Row className="bg-white p-4 mt-4">
                    <Col md={8} lg={7} className="col-centered">
                      <h2>Welcome to Project Name</h2>
                      <hr
                        style={{
                          color: 'DarkSlateGray',
                          backgroundColor: 'DarkSlateGray',
                          height: 2,
                        }}
                      />
                      <p>Please create a new account to login</p>
                      <FormErrors formerrors={this.state.errors} />
                      <Row>
                        <Col sm={12}>
                          <FormValidatorWrapper error={formError.firstName}>
                            <FormControl fullWidth>
                              <InputField
                                name="firstName"
                                label="First Name *"
                                value={formState.firstName}
                                onChange={onChange}
                                error={!!formError.firstName}
                                type="text"
                              />
                            </FormControl>
                          </FormValidatorWrapper>
                        </Col>
                        <Col sm={12}>
                          <FormValidatorWrapper error={formError.lastName}>
                            <FormControl fullWidth>
                              <InputField
                                name="lastName"
                                label="Last Name *"
                                value={formState.lastName}
                                onChange={onChange}
                                error={!!formError.lastName}
                                type="text"
                              />
                            </FormControl>
                          </FormValidatorWrapper>
                        </Col>
                        <Col sm={12}>
                          <FormValidatorWrapper error={formError.email}>
                            <FormControl fullWidth>
                              <InputField
                                name="email"
                                label="Email *"
                                value={formState.email}
                                onChange={onChange}
                                error={!!formError.email}
                                disabled={this.state.isEditing}
                              />
                            </FormControl>
                          </FormValidatorWrapper>
                        </Col>

                        <Col sm={12}>
                          <FormValidatorWrapper error={formError.companyCode}>
                            <FormControl fullWidth>
                              <SelectField
                                label="Entity *"
                                name="companyCode"
                                options={this.state.companyCode.map(code => ({
                                  key: code.label,
                                  value: code.value,
                                }))}
                                onChange={e => onSelectChange(e, 'companyCode')}
                                value={formState.companyCode}
                                error={!!formError.companyCode}
                              />
                            </FormControl>
                          </FormValidatorWrapper>
                        </Col>

                        <Col sm={12}>
                          <Form.Group
                            as={Row}
                            controlId="formHorizontalHaveAnAccount"
                            className="px-3"
                          >
                            <div className="w-100">
                              <span className="text-secondary float-left">
                                Have an account?
                              </span>
                              <Link
                                to="/login"
                                className="normal-link ml-2 text-secondary"
                              >
                                Sign in
                              </Link>
                              <span
                                className="gold-color bold link float-right ml-5"
                                onClick={onFormSubmit}
                              >
                                Create account
                              </span>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Form>
              )}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Register;
