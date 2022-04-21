import React from 'react';
import PropTypes from 'prop-types';
import './error-boundary.styles.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error,
      errorInfo,
    });
    // You can also log error messages to an error reporting service here
  }

  refreshPage = () => {
    window.location.reload(false);
  };

  render() {
    if (this.state.errorInfo) {
      // Error path
      return (
        <Container className="error-boundary">
          <Row>
            <Col>
              <p className="text-danger">
                System error happened. Please try to reload the page. If problem
                does not resolve, please contact the administrator.
              </p>
              <Button onClick={this.refreshPage} variant="primary">
                Reload the page
              </Button>
              {/* <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details> */}
            </Col>
          </Row>
        </Container>
      );
    }
    // Normally, just render children
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
};

export default ErrorBoundary;
