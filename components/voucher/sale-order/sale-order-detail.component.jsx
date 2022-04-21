import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core';
import DetailForm from '../../shared/form/detail-form/detail-form.component';
import { getSaleOrder } from '../../../actions/voucher-action';
import PageHeader from '../../shared/page-header/page-header.component';
import { ActionType, dialogConstant } from '../../../constants/constants';
import useStyles from './sale-order-detail.style';
import { Voucher } from '../../../constants/constants';
import { withTranslation } from 'react-i18next';
import EVoucherWithSO from '../voucher-created-with-SO/voucher-created-with-SO.component';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { buttonConstant } from '../../../util/constant';
import { Message } from '../../../constants/messages';
import {
  options,
  columnsDetail,
  fieldsLabelArraySaleOrder,
  actions,
  totalSummarizeInGrid,
} from './sale-order-detail.config';

class DetailSaleOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: {},
      totalSummarizeInGrid: [...totalSummarizeInGrid],
      isPopup: false,
      recordSelected: {},
      saleOrderNo: '',
      saleOrderType: '',
      soDoStatus: '',
    };
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.isMounting = true;
    this.dataDetailsOnGrid = null;
  }

  /**
   * Load sale order detail with id.
   * @param {String} id
   */
  loadSaleOrder = (id) => {
    return new Promise((resolve, reject) => {
      getSaleOrder({ saleOrderNo: id }).then((res) => {
        const detailData = res.data;

        // Add column No in grid
        detailData &&
          detailData.saleReceiptDetailRestVOS?.map(
            (item, index) => (item.no = index + 1)
          );
        // Update general information, detail on grid.
        if (this.isMounting) {
          this.setState({
            detailData,
            saleOrderNo: id,
            saleOrderType: detailData.saleOrderType,
            soDoStatus: detailData.soDoStatus,
          });
          // Update details information grid base on Sale Order items list.
          this.updateDataDetailsOnGrid({
            data: detailData?.saleReceiptDetailRestVOS || [],
          });
        }
        resolve(detailData);
      });
    });
  };

  componentDidMount() {
    const { match } = this.props;
    const itemId = match.params.id;

    // Load sale order base on id of URL parameters.
    this.loadSaleOrder(itemId);
  }

  componentWillUnmount() {
    this.isMounting = false;
  }

  /**
   * Go to create voucher page base on item.
   * @param {String} id
   */
  goToCreateVoucherPage = (item) => {
    // Check Material Code is not existed in BBS
    if (item.existed === '0') {
      openDialog({
        title: Message.warning,
        type: dialogConstant.type.ERROR,
        content: Message.VOUCHER.MATERIAL_CODE_NOT_EXIST,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return;
    }

    this.setState({
      isPopup: true,
      recordSelected: item,
    });
  };

  /**
   * Go to scan voucher page base on sale Order No.
   * @param {String} roleId
   */
  goToScanVoucherPage = (item) => {
    const { saleOrderNo } = this.state;

    saleOrderNo &&
      this.props.history.push(
        `/voucher-management/voucher-list/activation/${saleOrderNo}`
      );
  };

  handleClose = (saveResult) => {
    const { recordSelected } = this.state;
    this.setState({ isPopup: false });

    // re-update dataDetailsOnGrid to hide 'Create' action button after submit successfully
    if (saveResult.isSaveSuccessfully && this.dataDetailsOnGrid) {
      const saleOrderList =
        (this.dataDetailsOnGrid && this.dataDetailsOnGrid.data) || [];
      const selectedSaleOrderRowIndex =
        saleOrderList &&
        saleOrderList.findIndex(
          (el) => el.saleReceiptDetailId === recordSelected.saleReceiptDetailId
        );
      if (saleOrderList[selectedSaleOrderRowIndex]) {
        // update created = 1 for the row which will be updated info from server when reload the page
        saleOrderList[selectedSaleOrderRowIndex].created = 1;
      }

      this.updateDataDetailsOnGrid({
        data: [...saleOrderList],
      });
    }
  };

  /**
   * Handle hidden action button on Detail information grid
   * If type of SO is P-VOUCHER, hidden Create button
   * In contrast, hidden Scan button.
   * @param {*} rowData
   */
  handleHiddenActionButton = (rowData, isCreateBtn) => {
    const { typeName, created, quantity, scannedQuantity } = rowData;

    if (isCreateBtn) {
      return (
        +created || typeName?.toUpperCase() !== Voucher.eVoucher.toUpperCase()
      );
    }
    return (
      +created ||
      (quantity && quantity === scannedQuantity) ||
      typeName?.toUpperCase() !== Voucher.pVoucher.toUpperCase()
    );
  };

  updateDataDetailsOnGridForEachPage = (dataDetailsOnGrid) => {
    this.dataDetailsOnGrid = dataDetailsOnGrid;
  };

  render() {
    const { t, isDetailsPage, classes, match } = this.props;
    const {
      detailData,
      totalSummarizeInGrid,
      isPopup,
      recordSelected,
      saleOrderNo,
      saleOrderType,
      soDoStatus,
    } = this.state;

    // Config title page header for PageHeader.
    const pageHeader = {
      pageTitle: t('Sale Order Details', {
        no: match.params.id,
      }),
      showButton: false,
    };

    // Config for DetailForm
    const listConfig = {
      // Common option of Detail form.
      options,
      // For details information grid.
      columnsDetail,
      // Allow render details page.
      isDetailsPage,
      // For general information page.
      fieldsLabelArray: fieldsLabelArraySaleOrder(detailData),
      // Action for detail information grid.
      actions: actions(
        this.goToCreateVoucherPage,
        this.goToScanVoucherPage,
        this.handleHiddenActionButton
      ),
      // Total on detail information grid
      totalSummarizeInGrid,
      showTotalByColumn: true,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.saleOrderDetail}>
            <PageHeader {...pageHeader} />
            <div className={classes.searchCover}>
              <DetailForm {...listConfig} />
            </div>

            <EVoucherWithSO
              isOpenMenu={isPopup}
              onClose={this.handleClose}
              detailData={{ ...recordSelected, saleOrderType, soDoStatus }}
              saleOrderNo={saleOrderNo}
            />
          </div>
        )}
      </>
    );
  }
}

DetailSaleOrder.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  classes: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailsPage: PropTypes.any,
  updateDataDetailsOnGrid: PropTypes.any,
  match: PropTypes.object,
};

const mapDispatchToProps = (dispatch) => ({
  // Update data of details information grid
  updateDataDetailsOnGrid: (data) =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
});

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(withStyles(useStyles)(DetailSaleOrder)));
