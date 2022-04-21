import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

class FormWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      formState: props.initialValues,
      prevProps: props.initialValues,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!_.isEqual(nextProps.initialValues, prevState.prevProps)) {
      // receive new props
      return {
        formState: nextProps.initialValues,
        prevProps: nextProps.initialValues,
      };
    }
    return {
      formState: prevState.formState,
    };
  }

  render() {
    return (
      <>
        {this.props.render({
          formError: this.state.errors,
          formState: this.state.formState,
          onChange: this.onChange,
          onNumericChange: this.onNumericChange,
          onFormSubmit: this.onFormSubmit,
          onSelectChange: this.onSelectChange,
          onUploadFiles: this.onUploadFiles,
          onCheckboxChange: this.onCheckboxChange,
          onTagInputChange: this.onTagInputChange,
        })}
      </>
    );
  }

  onNumericChange = (value, name) => {
    this.updateFormState(name, value.toString());
  };

  onTagInputChange = (value, name) => {
    this.updateFormState(name, value);
  };

  onSelectChange = (event, name, childrenToClear) => {
    if (name) {
      const value = _.get(event, 'target.value', '');
      const eventValue = value || (event.value ? event.value : event);
      const oldValue = this.state.formState[name];
      this.updateFormState(name, eventValue);
      if (childrenToClear) {
        // Only clear children when new item selected
        if (oldValue !== eventValue) {
          childrenToClear.map(child => this.updateFormState(child, ''));
        }
      }
    }
  };

  onUploadFiles = (fileItems, name) => {
    this.updateFormState(
      name,
      fileItems.map(fileItem => fileItem.file)
    );
  };

  onCheckboxChange = (name, value) => {
    this.updateFormState(name, value);
  };

  onChange = event => {
    const { name } = event.target;
    const { value } = event.target;
    this.updateFormState(name, value);
  };

  onFormSubmit = (event, name) => {
    event.preventDefault();
    if (!this.validateForm()) {
      console.error('Form has error');
    } else {
      this.props.handleSubmit(this.state.formState, name);
    }
  };

  updateFormState = (attribute, value) => {
    this.setState(prevState => {
      const newFormState = { ...prevState.formState };
      _.set(newFormState, attribute, value);
      return {
        ...prevState,
        formState: newFormState,
        // Clear error of input
        errors: {
          ...prevState.errors,
          [attribute]: null,
        },
      };
    });
  };

  validateForm = () => {
    let valid = true;

    // Clear all errors
    this.setState(prevState => ({
      ...prevState,
      errors: [],
    }));
    const formErrors = this.props.handleValidate(this.state.formState);
    if (formErrors && formErrors.length > 0) {
      valid = false;
      formErrors.map(error => this.addError(error.name, error.message));
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
}

FormWrapper.propTypes = {
  handleValidate: PropTypes.func,
  handleSubmit: PropTypes.func,
  render: PropTypes.func,
  initialValues: PropTypes.any,
};

export default FormWrapper;
