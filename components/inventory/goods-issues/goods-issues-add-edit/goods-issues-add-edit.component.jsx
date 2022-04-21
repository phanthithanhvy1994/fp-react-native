import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import GoodsIssuesForm from '../goods-issues-form/goods-issues-form.component';
import { GoodsIssuesConstant } from '../../../../constants/constants';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from '../goods-issues-add-edit/goods-issues-add-edit.style';

class AddEditGoodsIssues extends Component {
  constructor(props) {
    super(props);

    this.state = {
      goodsIssuesNumber: '',
    };
  }

  componentDidMount() {}

  getGoodsIssuesNumber = (goodsIssuesNumber) => this.setState({ goodsIssuesNumber });

  render() {
    const { history, classes, isEditPage, match } = this.props;
    const { goodsIssuesNumber } = this.state;
    const itemId = match.params.id;
    const pageHeader = {
      pageTitle: isEditPage
        ? `${GoodsIssuesConstant.pageTitle.goodsIssuesEdit} <No.${goodsIssuesNumber}>`
        : GoodsIssuesConstant.pageTitle.goodsIssuesAdd,
    };
    return (
      <div className={classes.goodsIssuesForm}>
        <PageHeader {...pageHeader} />
        <div className={classes.goodsIssuesAddEditSearchCover}>
          <GoodsIssuesForm
            history={history}
            goodsIssuesId={itemId}
            isEditPage={isEditPage}
            getGoodsIssuesNumber={this.getGoodsIssuesNumber}
          />
        </div>
      </div>
    );
  }
}

AddEditGoodsIssues.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isEditPage: PropTypes.any,
  match: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AddEditGoodsIssues));
