import React from 'react';
import { Form } from 'react-bootstrap';

class Radio extends React.Component {
  render() {
    const { name, label } = this.props.option;
    const selectedValue = this.props.selectedValue;
    return (
      <div key={name} className="mb-2" style={{ width: '100%' }}>
        <Form.Check
          type="radio"
          id={`default-${name}`}
          name={name}
          label={label}
          onChange={this.props.handleChange}
          checked={selectedValue === name}
        />
      </div>
    );
  }
}

export default Radio;
