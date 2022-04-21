import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Button from '../../shared/buttons/button.component';
import './coupon-button.scss';

class CouponButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bomSearchFields: [],
      bomListData: {},
    };
    this.isMounting = true;
  }

  addNewCoupon = () => {
    this.props.handleOpenPopup(true);
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div className="btn-group">
        <Button
          title={t('Create New Coupon')}
          className="btnSecondary"
          classCustom={classes.btnAdd}
          handleClick={() => this.addNewCoupon()}
        />
      </div>
    );
  }
}

CouponButton.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailPage: PropTypes.any,
  match: PropTypes.any,
  handleOpenPopup: PropTypes.func
};

export default withTranslation()(withStyles()(CouponButton));
