import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import Button from '../../shared/buttons/button.component';

import useStyles from './goods-issues-button.style';

import {  
  GoodsIssuesConstant,  
} from '../../../constants/constants';

class GoodsIssuesButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * Add new good issues
   */
  addNewGoodsIssues = () => {
    this.props.handleNewGoodIssues(true);
  }

  render() {
    const { t, classes } = this.props;
    return (
      <div className={classes.createGoodIssueBtn}>
        <Button
          // title={t('Create Goods Issue')}
          title={t(GoodsIssuesConstant.btnAdd)}
          className="btnSecondary"
          classCustom={classes.btnAdd}
          handleClick={() => this.addNewGoodsIssues()}
        />
      </div>
    );
  }
}

GoodsIssuesButton.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,  
  handleNewGoodIssues: PropTypes.func
};

export default withTranslation()(withStyles(useStyles)(GoodsIssuesButton));
