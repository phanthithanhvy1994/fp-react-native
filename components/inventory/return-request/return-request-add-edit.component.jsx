import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import ReturnRequestForm from './return-request-form/return-request-form.component';
import { ReturnRequestConstant } from '../../../constants/constants';
import PageHeader from '../../shared/page-header/page-header.component';
import useStyles from './details/return-request-details.style';

class AddEditReturnRequest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      returnRequestNo: '',
    };
  }

  componentDidMount() {}

  getReturnRequestNo = (returnRequestNo) => this.setState({ returnRequestNo });

  render() {
    const { history, classes, isEditPage, match } = this.props;
    const { returnRequestNo } = this.state;
    const itemId = match.params.id;
    const pageHeader = {
      pageTitle: isEditPage
        ? `${ReturnRequestConstant.pageTitle.returnRequestEdit} <No.${returnRequestNo}>`
        : ReturnRequestConstant.pageTitle.returnRequestAdd,
    };
    return (
      <div className={classes.returnRequestForm}>
        <PageHeader {...pageHeader} />
        <div className={classes.returnRequestAddEditSearchCover}>
          <ReturnRequestForm
            history={history}
            returnRequestId={itemId}
            isEditPage={isEditPage}
            getReturnRequestNo={this.getReturnRequestNo}
          />
        </div>
      </div>
    );
  }
}

AddEditReturnRequest.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isEditPage: PropTypes.any,
  match: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AddEditReturnRequest));
