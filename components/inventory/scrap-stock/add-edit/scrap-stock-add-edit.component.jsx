import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';

import PageHeader from '../../../shared/page-header/page-header.component';
import ScrapStockForm from '../scrap-stock-form/scrap-stock-form.component';
import useStyles from './scrap-stock-add-edit.style';

class ScrapStockAddEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrapStockNo: '',
    };
    this.isMounting = true;
  }

  getScrapStockNo = (scrapStockNo) => this.setState({ scrapStockNo });

  render() {
    const { classes, isEditPage, isDetailPage, match, history } = this.props;
    const idItem = match.params.id;
    let { scrapStockNo } = this.state;
    let titlePage;
    if (isEditPage) {
      titlePage = `Edit Scrap Stock <No.${scrapStockNo}>`;
    } else if (isDetailPage) {
      titlePage = `View Scrap Stock Details <No.${scrapStockNo}>`;
    } else {
      titlePage = 'Create Scrap Stock';
    }
    const pageHeader = {
      pageTitle: titlePage,
      showButton: false,
    };

    return (
      <div className={classes.scrapStock}>
        <PageHeader {...pageHeader} />
        <ScrapStockForm
          isEditPage={isEditPage}
          idItem={idItem}
          history={history}
          isDetailsPage={isDetailPage}
          classFormFieldCustom={classes.detailForm}
          getScrapStockNo={this.getScrapStockNo}
        />
      </div>
    );
  }
}

ScrapStockAddEdit.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.any,
  isEditPage: PropTypes.any,
  match: PropTypes.any,
  isDetailPage: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(ScrapStockAddEdit));
