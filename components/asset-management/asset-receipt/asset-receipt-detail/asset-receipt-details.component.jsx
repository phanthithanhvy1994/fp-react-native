import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import AssetReceiptForm from '../asset-receipt-detail/asset-receipt-form/asset-receipt-form.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import { getAssetReceiptDetailsById } from '../../../../actions/asset-receipt-action';
import useStyles from './asset-receipt-details.styles';

class AssetReceiptDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      AssetReceiptId: '',
      MaterialDocumentNo: '',
    };
    this.isMounting = true;
  }

  componentDidMount() {
    const AssetReceiptId = get(this.props, 'match.params.id');
    if (!AssetReceiptId) {
      this.props.history.push('asset-receiving/detail/');
      return;
    }
    getAssetReceiptDetailsById({ id: AssetReceiptId }).then((res) => {
      res.data
        ? this.setState({
            AssetReceiptId,
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
    const { AssetReceiptId, MaterialDocumentNo } = this.state;
    const pageHeader = {
      pageTitle: t('View Asset Receipt Details', {
        id: MaterialDocumentNo,
      }),
      showButton: false,
    };

    return (
      <>
        <PageHeader {...pageHeader} />
        <div className={classes.search}>
          {AssetReceiptId && (
            <AssetReceiptForm
              rowSize={3}
              classFormFieldCustom={classes.detailForm}
              AssetReceiptId={AssetReceiptId}
              isDetailsPage={true}
            />
          )}
        </div>
      </>
    );
  }
}

AssetReceiptDetails.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AssetReceiptDetails));
