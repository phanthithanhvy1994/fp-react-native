import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import React, { Component } from 'react';
import { ReactComponent as GoIcon } from '../../../assets/go.svg';
import { withRouter } from 'react-router-dom';
import FPDialog from '../../shared/dialog/dialog.component';
import Field from '../../shared/fields/fields.component';
import useStyles from './voucher-so-create.style';
import { addFields } from './voucher-so-create.config';
import { Button } from '@material-ui/core';
import { getSaleOrder } from '../../../actions/voucher-action';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { withTranslation } from 'react-i18next';
import {dialogConstant} from '../../../constants/constants';
import {buttonConstant} from '../../../util/constant';

class VoucherWithSOCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addFieldArray: [...addFields],
      // Flag close dialog.
      isClosed: false,
    };
  }

  /**
   * Set new value to Sale Order No.
   * @param {String} newValue
   */
  setValueOfAddFieldArray = (newValue) => {
    let addFieldArray = [...this.state.addFieldArray],
      addFields = {
        ...addFieldArray[0],
        value: newValue,
      };

    return [addFields];
  };

  /**
   * Handle change value input of Sale order No.
   * @param {*} event
   */
  onChange = (event) => {
    const addFieldArray = this.setValueOfAddFieldArray(event.target.value);
    this.setState({ addFieldArray });
  };

  /**
   * Handle event when enter key is pressed in dialog go to Sale order details
   * @param {*} event 
   */
  onKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.loadSaleOrder();
    }
  }
  /**
   * Go to Sale Order Detail Screen.
   * @param {*} id
   */
  goToSaleOrderDetails = (id) => {
    this.props.history.push(
      `/voucher-management/voucher-list/sale-order-detail/${id}`
    );
  };

  /**
   * Show message dialog and close dialog create Voucher with SO.
   * @param {*} id
   */
  backToVoucherList = (id) => {
    const msg = Message.VOUCHER.NOT_FOUND_SALE_ORDER;
    const addFieldArray = this.setValueOfAddFieldArray('');

    // Close dialog and reset value of Sale order No.
    this.setState({
      isClosed: !this.state.isClosed,
      addFieldArray,
    });

    // Open message dialog.
    openDialog({
      title: Message.INFORMATION,
      type: dialogConstant.type.INFO,
      content: msg.replace('%SONo%', id),
      actions: [
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  /**
   * Check for existence of SO base on SO No.
   */
  loadSaleOrder = () => {
    const { addFieldArray } = this.state;
    const saleOrderNo = addFieldArray[0].value;

    // Do nothing if saleOrderId is empty
    if (!saleOrderNo) {
      const msg = Message.VOUCHER.MISSING_SALE_ORDER_NO;
      
      // Open message dialog.
      openDialog({
        title: Message.ERROR,
        type: dialogConstant.type.ERROR,
        content: msg,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return;
    }

    return new Promise((resolve, reject) => {
      getSaleOrder({saleOrderNo})
        .then((res) => {
          if (res.message) {
            this.backToVoucherList(saleOrderNo);
          } else {
            this.goToSaleOrderDetails(saleOrderNo);
          }
        });
    });
  };

  render() {
    const { t, classes } = this.props;
    const { addFieldArray, isClosed } = this.state;

    return (
      <FPDialog
        // Config close dialog
        isClosed={isClosed}
        // Config width of dialog not full width
        isFullWidth={false}
        buttonType="btnSecondary"
        title={t('Create Voucher with SO')}
        titleDialog={t('Create Voucher with SO')}
        classCustomDialog={classes.voucherCreateDialog}
      >
        <div className="subtitle"></div>
        <div className={`${classes.titlePage}`}>
          <div>
            <Field conditionalArray={addFieldArray} onChange={this.onChange} onKeyPress={this.onKeyPress}/>
          </div>
          <div>
            <Button onClick={this.loadSaleOrder}>
              <GoIcon />
            </Button>
          </div>
        </div>
      </FPDialog>
    );
  }
}

VoucherWithSOCreate.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  updateStateFieldArray: PropTypes.any,
};

export default withRouter(
  withTranslation()(withStyles(useStyles)(VoucherWithSOCreate))
);
