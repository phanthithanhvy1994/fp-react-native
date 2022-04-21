import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './asset-request-detail.style';
import PageHeader from '../../../shared/page-header/page-header.component';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import {
  Action,
  ActionType,
  dialogConstant,
  AssetRequestConstant
} from '../../../../constants/constants';
import {
  options,
  fieldsLabelArray,
  columnsDetail,
  bottomGridButtonsArray,
  totalSummarizeInGrid
} from './asset-request-detail.config';
import {
  getValueAssetRequestDetails,
  updateStatusAssetRequest
} from '../../../../actions/asset-request-action';
import { API_PATHS, DOMAIN } from '../../../../services/service.config';
import { getMaterialImage } from '../../../../actions/material-action';
import { Message } from '../../../../constants/messages';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { buttonConstant } from '../../../../util/constant';
import { openRejectDialog } from '../../../../redux/reject-dialog/reject-dialog.actions';
import { printFilePDF } from '../../../../util/print-util';

class AssetRequestDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetRequestId: null,
      detailData: {},
      dataTable: {},
      status: null,
      assetRequestNo: null
    };
    this.isMounting = true;
    this.updateHistoryData = props.updateHistoryData;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
  };

  /**
   * Load asset request details base on id
   * @param {object} inputParams 
   */
  loadAssetRequestDetails = (id) => {
    return new Promise((resolve, reject) => {
      getValueAssetRequestDetails(id).then(res => {
        const detailData = res?.data;
        // Go to Error Page if have not data response
        if (!detailData) {
          this.props.history.push('/404');
          return;
        }

        const assetRequestDetailVO = detailData?.assetRequestDetails ? detailData.assetRequestDetails.map(
          (item, index) => {
            item.no = +index + 1;
            return item;
          }) : '';

        const dataTable = {
          data: assetRequestDetailVO && this.convertDataStructureForDetailGrid(assetRequestDetailVO),
        };
        const params = detailData?.assetRequestHistories; 

        if(params){
          const data = params.map((el) => ({
            time: el.updateDate,
            note: `${el.action} ${el.comment}`,
            userName: el.createdBy,
          })) || [];

          data.length > 0 && this.updateHistoryData(data);
        }    

        if (this.isMounting) {
          this.updateDataDetailsOnGrid(dataTable);

          this.setState({
            detailData,
            dataTable,
            status: detailData?.status ? +detailData.status : 0,
            assetRequestNo: detailData.assetRequestNo
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
        imgUrl: `${getMaterialImage()}?sku=${rowData.sku}`,
        id: rowData && rowData.id,        
      },
      description: rowData.categoryName, 
      ...rowData,
    }));

  componentDidMount = () => {
    const { match } = this.props;

    // id of records base on params URL
    const assetRequestId = match.params?.id;

    // Load data asset request details
    this.loadAssetRequestDetails(assetRequestId);

    if (this.isMounting) {
      this.setState({
        assetRequestId
      });
    }
  };

  /**
   * Back to  Asset Request List View
   */
  backToListView = () => {
    this.props.history.push('/asset-management/asset-request');
  }

  /**
   * Go to edit page base on asset request id
   */
  handleEdit = () => {
    const { assetRequestId } = this.state;
    const { history } = this.props;

    history.push(`/asset-management/asset-request/edit/${assetRequestId}`);
  };

  /**
   * Handle close asset request
   */
  handleClose = () => {
    const { assetRequestId, assetRequestNo } = this.state;
    const { t } = this.props;
    const msg = Message.ASSET_REQUEST.CLOSE;

    openDialog({
      title: Message.CONFIRM,
      content: msg.replace('%ARNo%', assetRequestNo || ''),
      actions: [
        {
          name: t('Cancel'),
          type: dialogConstant.button.NONE_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            updateStatusAssetRequest({ id: assetRequestId }, AssetRequestConstant.status.closed)
              .then(() => {
                // Load to back list view
                this.backToListView();
              })
              .catch((res) => {
                this.showSystemErrorDialog(res);
              });;
          },
        },
      ],
    });
  };

  rejectAR = (reasonData) =>
    this.updateARData({
      reason: reasonData,
    }).then(() => this.backToListView());

  /**
   * Handle reject Asset request
   * @param {*} data 
   */
  updateARData(data) {
    const { assetRequestId, assetRequestNo } = this.state;
    const params = {
      id: assetRequestId,
      rejectionReason: data.reason
    };
    const successMsg = Message.ASSET_REQUEST.REJECT;
    return new Promise((resolve, reject) => {
      updateStatusAssetRequest(params, AssetRequestConstant.status.rejected)
        .then(() => {
          openDialog({
            title: Message.INFORMATION,
            type: dialogConstant.type.INFO,
            content: successMsg.replace('%ARNo%', assetRequestNo),
            disableBackdropClick: true,
            actions: [
              {
                name: this.props.t(Action.ok),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY
              },
            ],
          });
          resolve();
        })
        .catch((res) => {
          this.showSystemErrorDialog(res);
          reject();
        });
    });
  }

  /**
   * Show dialog input reason reject when handle reject asset request
   */
  handleReject = () => {
    openRejectDialog({
      title: Message.REJECT_TITLE,
      messageTitle: Message.REJECT_MESSAGE_TITLE,
      submitApiFn: this.rejectAR,
      disableBackdropClick: true,
      actions: [
        {
          name: this.props.t(Action.cancel),
          type: dialogConstant.button.NONE_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: this.props.t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  /**
   * Handle approve asset request
   */
  handleApprove = () => {
    const { t } = this.props;
    const { assetRequestId, assetRequestNo } = this.state;
    const msg = Message.ASSET_REQUEST.APPROVE;

    updateStatusAssetRequest({ id: assetRequestId }, AssetRequestConstant.status.approved).then(
      (res) => {
        if (res) {
          openDialog({
            title: Message.INFORMATION,
            type: dialogConstant.type.INFORMATION,
            content: msg.replace('%ARNo%', assetRequestNo || ''),
            actions: [
              {
                name: t('OK'),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
              },
            ],
          });
          this.backToListView();
        }
      }
    ).catch((res) => {
      this.showSystemErrorDialog(res);
    });
  };

  /**
   * Show dialog display message when call api
   * @param {*} res 
   */
  showSystemErrorDialog = (res) => {
    const messageContent = (res && res.messages && res.messages[0].messageContent) || Message.SYSTEM_ERROR;

    openDialog({
      title: Message.ERROR,
      type: dialogConstant.type.ERROR,
      content: messageContent,
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
   * Handle print asset request
   */
  handlePrint = () => {
    const { assetRequestId } = this.state;
    const url = `${DOMAIN}${API_PATHS.printReturnRequest}?id=${assetRequestId}`;
    printFilePDF(url);
  };

  componentWillUnmount() {
    this.isMounting = false;
  };

  render() {
    const { t, isDetailsPage, classes, history, dataDetailsOnGrid } = this.props;
    const { detailData, status } = this.state;

    const pageHeader = {
      pageTitle: t('View Asset Request Details', {
        assetTransferNo: detailData?.assetRequestNo || '',
      }),
      showButton: false,
    };

    const listConfig = {
      options,
      columnsDetail,
      isDetailsPage,
      fieldsLabelArray: fieldsLabelArray(detailData),
      dataDetailsOnGrid,
      bottomGridButtonsArray: bottomGridButtonsArray(status),
      onCustomClose: this.handleClose,
      onCustomEdit: this.handleEdit,
      onCustomReject: this.handleReject,
      onCustomApprove: this.handleApprove,
      onCustomPrint: this.handlePrint,
      totalSummarizeInGrid,
      history
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.assetRequestDetailsSearch}>
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

AssetRequestDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(useStyles)(AssetRequestDetail)));
