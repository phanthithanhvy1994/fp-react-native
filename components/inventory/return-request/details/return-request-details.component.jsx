import React, { Component } from 'react';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PageHeader from '../../../shared/page-header/page-header.component';
import { ReturnRequestConstant } from '../../../../constants/constants';
import ReturnRequestForm from '../return-request-form/return-request-form.component';
import useStyles from './return-request-details.style';

class ReturnRequestDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      returnRequestId: '',
      returnRequestNo: '',
    };
  }

  componentDidMount() {
    const returnRequestId = get(this.props, 'match.params.id');
    if (!returnRequestId) {
      this.props.history.push('/inventory/return-request');
      return;
    }

    this.setState({
      returnRequestId,
    });
  }

  getReturnRequestNo = returnRequestNo => this.setState({ returnRequestNo });

  render() {
    const { history, classes } = this.props;
    const { returnRequestId, returnRequestNo } = this.state;
    const pageHeader = {
      pageTitle: `${ReturnRequestConstant.pageTitle.returnRequestDetails} <No.${returnRequestNo}>`,
    };

    return (
      <>
        <PageHeader {...pageHeader} />
        {returnRequestId && (
          <div className={classes.returnRequestDetailSearchCover}>
            <ReturnRequestForm
              rowSize={3}
              classFormFieldCustom="return-request-general-info-form"
              returnRequestId={returnRequestId}
              isDetailsPage={true}
              history={history}
              getReturnRequestNo={this.getReturnRequestNo}
            />
          </div>
        )}
      </>
    );
  }
}

ReturnRequestDetails.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(ReturnRequestDetails));
