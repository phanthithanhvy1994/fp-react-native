import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { convertItemDataStructure } from '../../../../material/material.common';

import { ActionType, userBranchInfo } from '../../../../../constants/constants';
import DetailForm from '../../../../shared/form/detail-form/detail-form.component';
import {
  getFieldsTextOnly,
  columnsDetailsConfig,
  options,
  totalSummarizeInGrid,
  bottomGridButtons,
} from './asset-receipt-form.config';

import {
  getAssetReceiptDetailsById,
  getAssetReceiptHistoryData,
  addHistoryData,
} from '../../../../../actions/asset-receipt-action';
import { getUserInfo } from '../../../../.././actions/auth-action';
// import {  } from '../../../../../constants/constants';

class AssetReceiptForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fieldsLabelArray: [],
      columnsDetail: [...columnsDetailsConfig],
      options,
      dataDetail: '',
    };
    this.loggedUser = getUserInfo();
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    // Get dispatch action from props to use it to update data state later
    this.updateDetailFieldArray = props.updateDetailFieldArray;
    this.updateAllFieldArray = props.updateAllFieldArray;
    this.updateDetailAddItemsFieldArray = props.updateDetailAddItemsFieldArray;
    this.updateAllAddItemsFieldArray = props.updateAllAddItemsFieldArray;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.updateHistoryData = props.updateHistoryData;
    this.isMounting = true;
  }

  loadAssetReceiptDataById = (AssetReceiptId) => {
    getAssetReceiptDetailsById({ id: AssetReceiptId }).then((res) => {
      if (res.data.assetReceiptDetailVOs) {
        const tempDataGird = res.data.assetReceiptDetailVOs.map((item) => ({
          ...item,
          common: {
            imgUrl: '',
          },
        }));
        this.updateDataDetailsOnGrid({ data: tempDataGird });
      }
      // const detailData = res?.data;
      // let newAssetReceiptDetailVOs = [];
      // for (let i = 0; i < detailData?.assetReceiptDetailVOs?.length; i++){
      //   for (let j = 0; j < detailData.assetReceiptDetailVOs[i]?.assetTrackingTranferDetailVOs?.length; j++ ){
      //     assetReceiptDetailVOs.push(detailData.assetReceiptDetailVOs[i].assetTrackingTranferDetailVOs[j]);
      //   }
      // }


      let imgArr = '';
      // if (res.data.goodsReceiptImages.length !== 0) {
      //   imgArr = res.data.goodsReceiptImages.map((img) => ({
      //     id: img.goodsReceiptImageId,
      //     preview: img.imagePath || '',
      //   }));
      // }
      // Load data for general infomation form at Details page
      this.setState({
        columnsDetail: columnsDetailsConfig,
        // dataDetail: { ...res.data, imgArr: imgArr },
        dataDetail: { ...res.data},

      });


      getAssetReceiptHistoryData({
        goodsReceiptHistoryId: res.data.AssetReceiptId,
      }).then((res) => {
        if (res.data) {
          const historyFld = res.data.map((item) => ({
            time: item.createdDate,
            userName: item.createdBy,
            note: `${item.action}  ${item.document || ''}`,
          }));
          this.updateHistoryData(historyFld);
        }
      });
    });
  };

  componentDidMount() {
    const { AssetReceiptId, isDetailsPage } = this.props;
    // Load return request details information by return request id
    this.loadAssetReceiptDataById(AssetReceiptId, isDetailsPage);
  }

  componentWillUnmount() {
    this.isMounting = false;
  }

  render() {
    // fieldArray for fields in form
    // dataDetailsOnGrid is for the details information grid
    // addItemsFieldList is for all search fields on 'Add items' form
    // classFormFieldCustom is to custom width of fields in general information form =>
    // => eg: rowSize is equal to 3, the width of each field should equal to 33.33%
    const {
      addItemsFieldList,
      dataDetailsOnGrid,
      rowSize,
      isDetailsPage,
      classFormFieldCustom,
    } = this.props;

    // fieldsLabelArray for fields is text only in form, use for general information form
    const { columnsDetail, dataDetail } = this.state;
    const tempOption = this.state.options;
    const listConfig = {
      rowSize,
      classFormFieldCustom,
      isDetailsPage,
      options: tempOption,
      totalSummarizeInGrid,
      addItemsFieldList,
      dataDetailsOnGrid,
      bottomGridButtonsArray: bottomGridButtons,
      fieldsLabelArray: getFieldsTextOnly(dataDetail),
      columnsDetail,
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
      loadHistoryListHandler: getAssetReceiptHistoryData,
      addHistoryHandler: addHistoryData,
    };

    return <>{this.isMounting && <DetailForm {...listConfig} />}</>;
  }
}

AssetReceiptForm.propTypes = {
  t: PropTypes.any,
  fieldArray: PropTypes.any,
  rowSize: PropTypes.number,
  AssetReceiptId: PropTypes.string,
  isDetailsPage: PropTypes.bool,
  classFormFieldCustom: PropTypes.string,
  updateDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.array,
  dataDetailsOnGrid: PropTypes.object,
  updateDataDetailsOnGrid: PropTypes.func,
  historyData: PropTypes.any,
  updateHistoryData: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    fieldArray: state.detailFormStore.fieldArray,
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
    addItemsFieldList: state.addItemsFormStore.fieldArray,
    historyData: state.detailFormStore.history,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateDetailFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_DETAIL_FIELD_ARRAY, ...data }),
  updateAllFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_ALL_FIELD_ARRAY, fieldArray: data }),
  updateDetailAddItemsFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_DETAIL_ADD_ITEMS_FIELD_ARRAY, ...data }),
  updateAllAddItemsFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_ALL_ADD_ITEMS_FIELD_ARRAY,
      fieldArray: data,
    }),
  updateDataDetailsOnGrid: (data) =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
  updateHistoryData: (data) =>
    dispatch({
      type: ActionType.UPDATE_HISTORY_DATA,
      history: data,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AssetReceiptForm));
