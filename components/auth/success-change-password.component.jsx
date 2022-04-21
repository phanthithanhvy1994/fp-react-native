import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class SuccessChangePassword extends Component {
  render() {
    return (
      <Row>
        <Col md={6} className="col-centered text-center mt-5">
          <section className="section auth">
            <div className="container">
              <h1>Change Password</h1>
              <p>Your password has been successfully updated!</p>
            </div>
            <Link to="/login">Login</Link>
          </section>
        </Col>
      </Row>
    );
  }
}

export default SuccessChangePassword;
