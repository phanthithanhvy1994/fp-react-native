import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Welcome extends Component {
  render() {
    return (
      <Row>
        <Col md={6} className="col-centered text-center mt-5">
          <section className="section auth">
            <div className="container">
              <h1>Welcome!</h1>
              <p>You have successfully registered a new account.</p>
              <p>
                We&apos;ve sent you a email. Please click on the confirmation
                link to verify your account.
              </p>
            </div>
            <Link to="/login">Login</Link>
          </section>
        </Col>
      </Row>
    );
  }
}

export default Welcome;
