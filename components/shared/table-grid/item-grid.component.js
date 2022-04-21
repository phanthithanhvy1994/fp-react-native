import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { withStyles } from '@material-ui/core/styles';
import { stylesItemGrid } from '../../../style/core/table/table';
import NoImage from '../../../assets/no-image.png';

class ItemGrid extends Component {
  render() {
    const { image, children, classes, customClass } = this.props;

    return (
      <Row className={customClass || ''}>
        <Col className={classes.itemLeft}>
          <img src={image} alt="Pineapple" className={classes.image} onError={e => {
            e.target.src = NoImage;
          }}/>
        </Col>
        <Col className={classes.itemRight}>{children}</Col>
      </Row>
    );
  }
}

ItemGrid.propTypes = {
  image: PropTypes.string,
  children: PropTypes.any,
  classes: PropTypes.object,
  customClass: PropTypes.any,
};

export default withStyles(stylesItemGrid)(ItemGrid);
