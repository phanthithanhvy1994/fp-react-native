import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Button from '../../shared/buttons/button.component';
import VoucherWithSOCreate from '../voucher-so-create/voucher-so-create.component';

class VoucherButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bomSearchFields: [],
      bomListData: {},
    };
    this.isMounting = true;
  }

  voucherWithoutSO = () => {
    this.props.handleOpenPopup(true);
  };

  voucherWithSO = () => {
    this.props.handleOpenPopup(true);
  };

  render() {
    // const { open } = this.state;
    const { t, history, classes } = this.props;
    return (
      <div className="btn-group">
        <Button
          title={t('Voucher Activation')}
          className="btnSecondary"
          classCustom={classes.btnAdd}
          isFontAwesome={false}
          handleClick={() =>
            history.push('/voucher-management/voucher-list/activation')
          }
        />
        <Button
          title={t('Create Voucher without SO')}
          className="btnSecondary"
          classCustom={classes.btnAdd}
          isFontAwesome={false}
          handleClick={() => this.voucherWithoutSO()}
        />
        <VoucherWithSOCreate />
      </div>
    );
  }
}

VoucherButton.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailPage: PropTypes.any,
  history: PropTypes.object,
  match: PropTypes.any,
  handleOpenPopup: PropTypes.any,
};

export default withTranslation()(withStyles()(VoucherButton));
