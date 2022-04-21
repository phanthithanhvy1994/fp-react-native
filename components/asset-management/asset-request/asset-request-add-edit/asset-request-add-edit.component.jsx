import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import AssetRequestForm from '../asset-request-form/asset-request-form.component';
import { AssetRequestConstant } from '../../../../constants/constants';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from '../asset-request-add-edit/asset-request-add-edit.style';

class AddEditAssetRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assetRequestNo: '',
    };
  }

  componentDidMount() {}

  getAssetRequestNo = (assetRequestNo) => this.setState({ assetRequestNo });

  render() {
    const { history, classes, isEditPage, match } = this.props;
    const { assetRequestNo } = this.state;
    const itemId = match.params.id;
    const pageHeader = {
      pageTitle: isEditPage
        ? `${AssetRequestConstant.pageTitle.assetRequestEdit} <No.${assetRequestNo}>`
        : AssetRequestConstant.pageTitle.assetRequestAdd,
    };
    return (
      <div className={classes.assetRequestForm}>
        <PageHeader {...pageHeader} />
        <div className={classes.assetRequestAddEditSearchCover}>
          <AssetRequestForm
            history={history}
            assetRequestId={itemId}
            isEditPage={isEditPage}
            getAssetRequestNo={this.getAssetRequestNo}
          />
        </div>
      </div>
    );
  }
}

AddEditAssetRequest.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isEditPage: PropTypes.any,
  match: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AddEditAssetRequest));
