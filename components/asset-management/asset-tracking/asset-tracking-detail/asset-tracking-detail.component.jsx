import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './asset-tracking-detail.style';
import PageHeader from '../../../shared/page-header/page-header.component';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';

import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { withTranslation } from 'react-i18next';
import {
  ActionType,
} from '../../../../constants/constants';
import {
  options,
  fieldsLabelArray,
  columnsDetail,
  totalSummarizeInGrid
} from './asset-tracking-detail.config';
import {
  getAssetTrackingDetails,
  getAssetTrackingHistory
} from '../../../../actions/asset-tracking-action';
import { getMaterialImage } from '../../../../actions/material-action';

class AssetTrackingDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assetTrackingId: null,
      detailData: {},
      dataTable: {},
    };
    this.isMounting = true;
    this.updateHistoryData = props.updateHistoryData;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
  };

  /**
   * Load asset tracking details base on id
   * @param {object} inputParams 
   */
  loadTrackingDetails = (id) => {
    return new Promise((resolve, reject) => {
      getAssetTrackingDetails(id).then(res => {
        const detailData = res?.data;
        // Go to Error Page if have not data response
        if (!detailData) {
          this.props.history.push('/404');
          return;
        }

        let assetTrackingDetailVOs = [];
        for (let i = 0; i < detailData?.assetTrackingDetailVOs?.length; i++){
          for (let j = 0; j < detailData.assetTrackingDetailVOs[i]?.assetTrackingTranferDetailVOs?.length; j++ ){
            assetTrackingDetailVOs.push(detailData.assetTrackingDetailVOs[i].assetTrackingTranferDetailVOs[j]);
          }
        }

        assetTrackingDetailVOs = assetTrackingDetailVOs.map(
          (item, index) => {
            item.no = +index + 1;
            return item;
          });

        const dataTable = {
          data: assetTrackingDetailVOs && this.convertDataStructureForDetailGrid(assetTrackingDetailVOs),
        }; 

        if (this.isMounting) {
          this.updateDataDetailsOnGrid(dataTable);

          this.setState({
            detailData,
            dataTable,
          });
        }
        resolve(detailData);
      });
    });
  };

  //Load history of asset tracking 
  loadHistoryData = (id) => {
    // const params = { id: Number(id) };
    getAssetTrackingHistory(id).then((res) => {
      const data =
        (res.data &&
          res.data.map((el) => ({
            time: el.updateDate,
            note: el.action,
            userName: el.createdBy,
          }))) ||
        [];
      data.length > 0 && this.updateHistoryData(data);
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
    this.loadTrackingDetails(assetRequestId);
    this.loadHistoryData(assetRequestId);

    if (this.isMounting) {
      this.setState({
        assetRequestId
      });
    }
  };

  componentWillUnmount() {
    this.isMounting = false;
  };

  render() {
    const { t, isDetailsPage, classes, history, dataDetailsOnGrid } = this.props;
    const { detailData } = this.state;

    const pageHeader = {
      pageTitle: t('View Asset Transfer Tracking Details', {
        assetTrackingNo: detailData?.assetTrackingNo || '',
      }),
      showButton: false,
    };

    const listConfig = {
      options,
      columnsDetail,
      isDetailsPage,
      fieldsLabelArray: fieldsLabelArray(detailData),
      dataDetailsOnGrid,
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
          <div className={classes.assetTrackingDetailsSearch}>
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

AssetTrackingDetail.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(useStyles)(AssetTrackingDetail)));
