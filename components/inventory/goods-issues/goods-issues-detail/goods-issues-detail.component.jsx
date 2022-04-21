import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './goods-issues-detail.style';
import PageHeader from '../../../shared/page-header/page-header.component';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import {
  ActionType,
  PaginationConfiguration,
  GoodsIssuesConstant
} from '../../../../constants/constants';

import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import {
  options,
  fieldsLabelArray,
  columnsDetail,
  bottomGridButtonsArray
} from './goods-issues-detail.config';

import {
  getValueGoodsIssuesDetails,
  getHistoryData,
  updateGoodsIssuesStatus
} from '../../../../actions/goods-issues-action';
import { getMaterialImage } from '../../../../actions/material-action';


class GoodsIssuesDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: {},
      dataTable: {},
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      // it will redirect to detail page without confirm leave page
      notAllowConfirmLeavePage: false,

      //Button Status : numberOfDraft = 1
      buttonsStatus: GoodsIssuesConstant.numberConstant.numberOfDraft, 
    };
    this.isMounting = true;
    this.updateHistoryData = props.updateHistoryData;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
  };

  /**
   * Load pack voucher details base on id
   * @param {object} inputParams 
   */
  loadGoodsIssuesDetails = (id) => {
    return new Promise((resolve, reject) => {
      getValueGoodsIssuesDetails(id).then(res => {
        const detailData = res?.data;
        // Go to Error Page if have not data response
        if (!detailData) {
          this.setState({ notAllowConfirmLeavePage: true }, () => {
            this.props.history.push('/404');
          });
          return;
        }
    
        const goodsIssuesDetailVO = detailData && detailData.goodsIssuesDetailVO ? detailData.goodsIssuesDetailVO : '';

        const dataTable = {
          // Total items on grid table
          totalItems: res?.totalRecord || 0,
          // Current page on paging
          currentPage: this.state.currentPage,
          data: goodsIssuesDetailVO && this.convertDataStructureForDetailGrid(goodsIssuesDetailVO),
        };

        // hidden or display bottom grid buttons base on status of Return Request        
        const { status } = res.data;

        if (this.isMounting) {
          this.updateDataDetailsOnGrid(dataTable);

          this.setState({
            detailData,
            dataTable,
            buttonsStatus: status
          });
        }
        resolve(detailData);
      });
    });
  };

  /**
   * Convert date image
   */
  convertDataStructureForDetailGrid = (data) =>
    data.map(rowData => ({
      common: {
        // Will use it when BE done
        imgUrl: `${getMaterialImage()}?sku=${rowData.sku}`,
        id: rowData && rowData.goodsIssuesDetailId,        
      },
      description: rowData.materialDescription, 
      ...rowData,
    }));

  /**
   * Event life cycle 
   */
  componentDidMount = () => {
    const { match, isDetailsPage } = this.props;

    // id of records base on params URL
    const goodIssuesId = match.params.id;


    // Load data goods issues details
    this.loadGoodsIssuesDetails(goodIssuesId);

    // Load History Data
    if (isDetailsPage) {
      this.loadHistoryData(goodIssuesId);
    }
  };

  /**
   * Event life cycle 
   */
  componentWillUnmount() {
    this.isMounting = false;
  };

  /**
   * Load History
   * @param {*} id 
   */
  loadHistoryData = (id) => {
    getHistoryData(id).then((res) => {
      const params = res.data.goodsIssuesHistoryVO; 
      if(params){
        const resHistory = params ;
        const data = (resHistory &&
          resHistory.map((el) => ({
            time: el.updateDate,
            note: `${el.action} ${el.document}`,
            userName: el.createdBy,
          }))) ||
          [];
        data.length > 0 && this.updateHistoryData(data);
      }      
    });
  };

  onCustomClose = () => {
    const {t} = this.props;

    // id of records base on params URL
    // Get status for update status
    const goodsIssuesStatus = GoodsIssuesConstant.numberConstant.numberOfClose; // 4: close
    const { detailData} = this.state;

    detailData.status = goodsIssuesStatus;
    
    openDialog({
      title: Message.CLOSE_STATUS_CONFIRM_TITLE,
      type: dialogConstant.type.CONFIRM,
      content: Message.GOODS_ISSUES.CLOSE_STATUS_CONFIRM.replace(
        '%INSTANCE%',
        `${detailData.goodsIssuesNumber}`
      ),
      actions: [
        {
          name: t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            updateGoodsIssuesStatus(detailData)
              .then((res) => {
                if (res) {
                  const msg = Message.GOODS_ISSUES.CLOSE_SUCCESSFULLY;
                  openDialog({
                    title: Message.INFORMATION,
                    type: dialogConstant.type.INFORMATION,
                    content: msg.replace('%rrNo%', detailData.goodsIssuesNumber),
                    actions: [
                      {
                        name: t('OK'),
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                      },
                    ],
                  });
                  this.backToGoodsIssuesList();
                }
              })
              .catch((res) => {
                this.showSystemErrorDialog(res);
              });
          },
        },
      ],
    });
  };

  /**
   * Show 
   * @param {} res 
   */
  showSystemErrorDialog = (res) => {
    let contentMsg = '';
    const {t} = this.props;
    const messageContent =
      res && res.messages && res.messages[0].messageContent;

    if (messageContent) {
      contentMsg = messageContent;
    }
    openDialog({
      title: Message.ERROR,
      type: dialogConstant.type.ERROR,
      content: contentMsg,
      actions: [
        {
          name: t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  backToGoodsIssuesList = () => {
    const { history } = this.props;
    // Go to Return Request list after approved successfully
    history.push('/inventory/goods-issues');
  };

  onCustomEdit = () => {
    const { match } = this.props;

    // id of records base on params URL
    const goodIssuesId = match.params.id;

    const url = '/inventory/goods-issues/edit/';
    return url + goodIssuesId;
  };

  render() {
    const { t, isDetailsPage, classes, history, dataDetailsOnGrid } = this.props;
    const { detailData, buttonsStatus, notAllowConfirmLeavePage } = this.state;

    const pageHeader = {
      pageTitle: t('View Goods Issues Details', {
        packNo: detailData.goodsIssuesNumber || '',
      }),
      showButton: false,
    };

    const listConfig = {
      // Option of Details form
      options,
      // Column in grid table
      columnsDetail,
      // Current screen is detail page
      isDetailsPage,
      // Field general information
      fieldsLabelArray: fieldsLabelArray(detailData),
      // Data grid on table
      dataDetailsOnGrid,
      bottomGridButtonsArray: bottomGridButtonsArray(buttonsStatus),
      onCustomClose: this.onCustomClose,
      onCustomEdit: this.onCustomEdit,
      history,
      notAllowConfirmLeavePage: notAllowConfirmLeavePage
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.goodIssuesDetailsSearch}>
            <PageHeader {...pageHeader} />
            <div className={classes.searchCover}>
              <DetailForm {...listConfig} />
            </div>
          </div>
        )}
      </>
    );
  }
};

GoodsIssuesDetail.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
  isDetailsPage: PropTypes.any,
  updateDataDetailsOnGrid: PropTypes.any,
  match: PropTypes.object,
  updateHistoryData: PropTypes.func,
  dataDetailsOnGrid: PropTypes.any
};

function mapStateToProps(state) {
  return {
    // Get data details on grids from store map to props
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
  };
}

const mapDispatchToProps = dispatch => ({
  // Update data of details information grid
  updateDataDetailsOnGrid: data =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
  updateHistoryData: (data) =>
    dispatch({ type: ActionType.UPDATE_HISTORY_DATA, history: data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(useStyles)(GoodsIssuesDetail)));
