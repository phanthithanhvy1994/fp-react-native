import React from 'react';
import PropTypes from 'prop-types';
import useStyles from '../asset-transfer-list.style';
import PageHeader from '../../../shared/page-header/page-header.component';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import {
  ActionType,
} from '../../../../constants/constants';
import {
  titlePage,
  options,
  fieldsLabelArray,
  columnsDetail,
  bottomGridButtonsArray,
  totalSummarizeInGrid,
  isShowScanTimeLine,
} from './asset-transfer-detail.config';
import {
  getAssetTransferDetail,
} from '../../../../actions/asset-transfer-action';
import { getMaterialImage } from '../../../../actions/material-action';
import { printFilePDF } from '../../../../util/print-util';
import { API_PATHS, DOMAIN } from '../../../../services/service.config';


class AssetTransferDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: {},
      dataTable: {},
      buttonsStatus: 1,
      scanningTimeLineData: [],
      assetTransferId: null,
    };
    this.isMounting = true;
    this.updateHistoryData = props.updateHistoryData;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
  };

  /**
   * Load asset transfer details base on id
   * @param {object} inputParams 
   */
  loadAssetTransferDetails = (id) => {
    getAssetTransferDetail(id).then(res => {
      const detailData = res?.data;
      // Go to Error Page if have not data response
      if (!detailData) {
        this.props.history.push('/404');
        return;
      }

      const dataOnTableGrid = detailData?.assetTransferDetailTbls ? detailData.assetTransferDetailTbls
        .map(item => 
          item?.assetTransferRequestDetailVOS.map(
            (child, index) => {
              child.no = +index + 1;
              child.assetRequestNo = item?.assetRequestNo;
              return child;
            })).flat() : '';

      const dataTable = {
        data: dataOnTableGrid && this.convertDataStructureForDetailGrid(dataOnTableGrid),
      };
      const historyTimeLine = detailData?.assetTransferHistoryVO;

      if (historyTimeLine) {
        const reHistoryTimeLine = historyTimeLine.map((el) => ({
          time: el.updateDate,
          note: `${el.action} ${el.comment}`,
          userName: el.createdBy,
        })) || [];

        reHistoryTimeLine.length > 0 && this.updateHistoryData(reHistoryTimeLine);
      }
      if (this.isMounting) {
        this.updateDataDetailsOnGrid(dataTable);
        this.setState({
          detailData,
          dataTable,
          buttonsStatus: detailData?.status || 1,
          scanningTimeLineData: detailData?.scanningTimeLineData
        });
      }
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

  /**
   * Event life cycle 
   */
  componentDidMount = () => {
    const { match } = this.props;

    // id of records base on params URL
    const assetTransferId = match.params?.id;

    // Load data asset transfer details
    this.loadAssetTransferDetails(assetTransferId);
    this.setState({assetTransferId});
  };

  /**
   * Event life cycle 
   */
  componentWillUnmount() {
    this.isMounting = false;
  };

  onCustomPrint = () => {
    const { assetTransferId } = this.state;
    if (assetTransferId) {
      // DOING: Waiting API print Asset Transfer BE
      const url = `${DOMAIN}${API_PATHS.printAssetTransfer}?id=${assetTransferId}`;
      printFilePDF(url);
    }
  }

  handleWriteOff = () => {
    alert('Write Off');
  }

  render() {
    const { isDetailsPage, classes, history, dataDetailsOnGrid } = this.props;
    const { detailData, scanningTimeLineData, assetTransferId } = this.state;
    const pageHeader = {
      pageTitle: titlePage(assetTransferId),
      showButton: false,
    };
    const listConfig = {
      options,
      columnsDetail: columnsDetail(()=> this.handleWriteOff()),
      isDetailsPage,
      fieldsLabelArray: fieldsLabelArray(detailData),
      dataDetailsOnGrid,
      bottomGridButtonsArray,
      onCustomPrint: this.onCustomPrint,
      totalSummarizeInGrid,
      history,
      isShowScanTimeLine,
      scanningTimeLineData
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.assetTranferSearchCover}>
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

AssetTransferDetail.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
  isDetailsPage: PropTypes.any,
  updateDataDetailsOnGrid: PropTypes.any,
  match: PropTypes.object,
  updateHistoryData: PropTypes.func,
  dataDetailsOnGrid: PropTypes.any,
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(useStyles)(AssetTransferDetail)));
