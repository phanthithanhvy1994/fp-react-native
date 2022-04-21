import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import GoodsReceiptForm from '../goods-receipt-form/goods-receipt-form.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import { getGoodsReceiptDetailsById } from '../../../../actions/goods-receipt-action';
import useStyles from './goods-receipt-details.styles';

class GoodsReceiptDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      GoodsReceiptId: '',
      MaterialDocumentNo: '',
    };
    this.isMounting = true;
  }

  componentDidMount() {
    const GoodsReceiptId = get(this.props, 'match.params.id');
    if (!GoodsReceiptId) {
      this.props.history.push('/inventory/goods-receipt');
      return;
    }
    getGoodsReceiptDetailsById({ id: GoodsReceiptId }).then((res) => {
      res.data
        ? this.setState({
            GoodsReceiptId,
            MaterialDocumentNo: res.data.materialDocument,
          })
        : this.props.history.push('/404');
    });
  }

  componentWillUnmount() {
    this.isMounting = false;
  }

  render() {
    const { t, classes } = this.props;
    const { GoodsReceiptId, MaterialDocumentNo } = this.state;
    const pageHeader = {
      pageTitle: t('View Goods Receipt Details', {
        id: MaterialDocumentNo,
      }),
      showButton: false,
    };

    return (
      <>
        <PageHeader {...pageHeader} />
        <div className={classes.search}>
          {GoodsReceiptId && (
            <GoodsReceiptForm
              rowSize={3}
              classFormFieldCustom={classes.detailForm}
              GoodsReceiptId={GoodsReceiptId}
              isDetailsPage={true}
            />
          )}
        </div>
      </>
    );
  }
}

GoodsReceiptDetails.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(GoodsReceiptDetails));
