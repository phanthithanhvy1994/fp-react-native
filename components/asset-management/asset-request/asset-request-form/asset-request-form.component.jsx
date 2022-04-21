import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { trackPromise } from 'react-promise-tracker';
import PropTypes from 'prop-types';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
} from '../../../shared/search-form/search-form.common';
import { convertItemDataStructure } from '../../../material/material.common';
import {
  getAssetType,
  getAssetCategory,
  getAssetSubCategory,
  getAssetItemList,
  getRequestBranch,
  getValueAssetRequestDetails,
  saveAssetRequest
} from '../../../../actions/asset-request-action';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { Message } from '../../../../constants/messages';
import {
  Action,
  ActionType,
  userBranchInfo,
  AssetRequestConstant
} from '../../../../constants/constants';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import {
  getFields,
  validation,
  columnsDetail,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  isShowScanTimeLine,
} from './asset-request-form.config';
import { getUserInfo } from '../../../../actions/auth-action';
// import './goods-issues-form.style.scss';
import {
  formatComboBox,
  formatDropdownList,
} from '../../../../util/format-util';

class AssetRequestForm extends Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    this.state = {
      actions: actions(),
      options,
      fieldsLabelArray: [],
      requestTo: '',
      assetRequestNo: null,
      validate: validation(),
      branchValue: userBranchInfo.defaultBranch,
      notAllowConfirmLeavePage: false,
      assetType: [],
      assetCategory: [],
      assetSubCategory: [],
      prevAssetCategory: '',
      selectedItem: 0,
      numItemsInCart: 0,
      isResetItems: false
    };
    this.loggedUser = getUserInfo();
    this.informationConvert = [
      { label: 'assetTypeName'},
      { label: 'assetCategoryName' },
      { label: 'assetSubCategoryName' },
      { label: 'description' },
      { label: 'unitPrice' },
    ];
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    // Get dispatch action from props to use it to update data state later
    this.updateDetailFieldArray = props.updateDetailFieldArray;
    this.updateAllFieldArray = props.updateAllFieldArray;
    this.updateDetailAddItemsFieldArray = props.updateDetailAddItemsFieldArray;
    this.updateAllAddItemsFieldArray = props.updateAllAddItemsFieldArray;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.updateMultipleDetailFieldArray = props.updateMultipleDetailFieldArray;
    this.updateHistoryData = props.updateHistoryData;
    this.updateAddItemsSelections = props.updateAddItemsSelections;
    this.fieldArray = [];
    this.dataDetailsOnGrid = null;
    this.loadAddItemsData = this.loadAddItemsDataDefault;
  }

  //Check data when change Request To field
  onRequestToChange = (e) => {
    const { requestTo } = this.state;
    const selectedValue = e.target.value;
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    if(dataDetailsOnGrid && dataDetailsOnGrid.data.length > 0){
      openDialog({
        title: Message.warning,
        content: Message.ASSET_REQUEST.CHANGE_REQUEST_TO.replace('Field Name', AssetRequestConstant.requestTo),
        actions: [
          {
            name: this.props.t(Action.cancel),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.CANCEL,
            action: () =>{
              this.updateDetailFieldArray({
                fieldName: 'branchCodeTo',
                property: 'value',
                updatedData: String(requestTo),
              });
            }
          },
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              this.updateDataDetailsOnGrid({ data: [] });
              this.changeRequestTo(selectedValue);
            },
          },
        ],
      });
    }
    else{
      this.changeRequestTo(selectedValue);
    }
  };

  //Check data when change Request From field
  onRequestFromChange = (e) => {
    const { branchValue } = this.state;
    const selectedValue = e.target.value;
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    const fieldArray = this.fieldArray;
    const history = this.props.historyData;
    //If change branch, reset data on General, detail information, history
    if((fieldArray && (fieldArray[1].value || fieldArray[2].value || fieldArray[3].value)) ||
      (dataDetailsOnGrid && dataDetailsOnGrid.data.length > 0) ||
      (history && history.length > 0)){
      openDialog({
        title: Message.warning,
        content: Message.ASSET_REQUEST.CHANGE_REQUEST_FROM.replace('Field Name', AssetRequestConstant.requestFrom),
        actions: [
          {
            name: this.props.t(Action.cancel),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.CANCEL,
            action: () =>{
              this.updateDetailFieldArray({
                fieldName: 'branchCodeFrom',
                property: 'value',
                updatedData: String(branchValue),
              });
            }
          },
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              this.updateDataDetailsOnGrid({ data: [] });
              this.updateHistoryData([]);
              this.updateMultipleDetailFieldArray([
                {
                  fieldName: 'branchCodeTo',
                  property: 'value',
                  updatedData: '',
                },
                {
                  fieldName: 'ssdNo',
                  property: 'value',
                  updatedData: '',
                },
                {
                  fieldName: 'notes',
                  property: 'value',
                  updatedData: '',
                },
              ]);
              this.setState({requestTo: ''});
              this.changeRequestFrom(selectedValue);
            },
          },
        ],
      });
    }
    else{
      this.changeRequestFrom(selectedValue);
    }
  }

  changeRequestTo = (requestTo) => {
    if (requestTo.length > 0) {
      this.setState({
        requestTo: requestTo,
      });
    } else {
      this.setState({
        requestTo: '',
      });
    }
  }

  changeRequestFrom = (branch) => {
    if (branch.length > 0) {
      this.setState({
        branchValue: branch,
      });
    } else {
      this.setState({
        branchValue: '',
      });
    }
  }

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    let params = {};

    params = mapPropertyForRequestParams(
      params,
      searchFields,
      AssetRequestConstant.searchItem.assetType
    );
    params = {
      ...params,
      assetCategory: searchFields.assetCategory
    };
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      AssetRequestConstant.searchItem.assetSubCategory
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      AssetRequestConstant.searchItem.assetDescription
    );

    return params;
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsDataDefault = () =>
    trackPromise(
      new Promise((resolve) => {
        resolve({});
      })
    );

  //Handler for 'Add Items' when click 'Select Items'
  addAssetHandler = () => {
    const { assetType, assetCategory, assetSubCategory } = this.state;
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    this.setState({isResetItems: false});
    //initial value for  categoryType field in search popup
    let initialValue = assetCategory[0] && assetCategory[0].categoryCode;
    //get Asset Type of first line item
    if (dataDetailsOnGrid && dataDetailsOnGrid.data && dataDetailsOnGrid.data.length > 0) {
      initialValue = dataDetailsOnGrid.data[0].assetCategoryCode;
    }
    this.updateAllAddItemsFieldArray(
      addItemsFieldArray(assetType, assetCategory, assetSubCategory, initialValue, initialValue)
    );
    // Handler for loading specific data for 'Add items' form
    this.loadAddItemsData = (params) => {
      return this.tempFunc(params, initialValue).then(
        paramSearch => getAssetItemList(paramSearch).then(
          (res) =>
            new Promise((resolve) => {
              resolve(res);
            })
        )
      );
    };
  }

  //Handle when user change assetCategory field
  tempFunc = (params, initialValue) => {
    const { assetType, assetCategory, assetSubCategory, prevAssetCategory, selectedItem } = this.state;
    const branchCodeToIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === 'branchCodeTo'
    );
    const requestTo = this.fieldArray[branchCodeToIndex].value;
    let paramSearch = {
      ...params,
      countFlag: 1,
      deleteFlag: 0,
      requestTo: requestTo,
    };
    let temp = this;
    const promise = new Promise((resolve, reject) => {
      if (params.assetCategory && prevAssetCategory !== params.assetCategory && selectedItem > 0) {
        openDialog({
          title: Message.warning,
          content: Message.ASSET_REQUEST.CHANGE_ASSET_CATEGORY.replace('Field Name', AssetRequestConstant.label.assetCategory),
          actions: [
            {
              name: temp.props.t(Action.cancel),
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.CANCEL,
              action: () => {
                temp.updateAllAddItemsFieldArray(
                  addItemsFieldArray(assetType, assetCategory, assetSubCategory, initialValue, prevAssetCategory)
                );
              }
            },
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {
                temp.setState(
                  {
                    prevAssetCategory: params.assetCategory,
                    isResetItems: true,
                  }
                );
                paramSearch = {
                  ...paramSearch,
                  assetCategory: params.assetCategory
                };
                temp.updateAddItemsSelections([]);
                resolve(paramSearch);
              },
            }
          ],
        });
      } else if (!params.assetCategory) {
        temp.setState({prevAssetCategory: initialValue});
        paramSearch = {
          ...paramSearch,
          assetCategory: initialValue
        };
        resolve(paramSearch);
      } else {
        paramSearch = {
          ...paramSearch,
          assetCategory: params.assetCategory
        };
        resolve(paramSearch);
      }
    });
    return promise;
  }

  //Get number of selected item.
  numItemsInCart = (number) => {
    if (number !== this.state.selectedItem) {
      this.setState({selectedItem: number});
    }
  }

  updateIsResetItems = () => {
    this.setState({isResetItems: false});
  }


  /**
   * Check Detail List is valid or not: quantity must be number
   * and detail list must be not empty, volume must be less than or equal to maxVolume
   * @param {Array} detailList
   */
  isValidDetailListInformation = (detailList) => {
    if (!detailList || detailList.length === 0) {
      openDialog({
        title: Message.warning,
        content: `${AssetRequestConstant.label.detailsInformation} ${Message.common.comMSG001}`,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return false;
    }

    const errorMsg = [];
    let isDeliveryDate = [];
    let isQuantity = [];
    let isMaxLengthNote = [];

    detailList.forEach((el) => {
      if (!el.deliveryDate) {
        isDeliveryDate.push(el.no);
      }

      if (el.notes && el.notes.length > 50) {
        isMaxLengthNote.push(el.no);
      }
      
      if (!(el.damagedQty && +el.damagedQty > 0) && (!el.quantity || +el.quantity === 0)) {
        isQuantity.push(el.no);
      }
    });

    if (isDeliveryDate.length > 0) {
      errorMsg.push(
        `${AssetRequestConstant.label.deliveryDate} ${Message.common['comMSG001']}
        <No: ${isDeliveryDate.join(', ')}>`
      );
    }

    if (isQuantity.length > 0) {
      errorMsg.push(
        `${AssetRequestConstant.label.quantity} ${Message.common['comMSG001']}
        <No: ${isQuantity.join(', ')}>`
      );
    }

    if (isMaxLengthNote.length > 0) {
      errorMsg.push(
        `${AssetRequestConstant.label.note} ${Message.ASSET_REQUEST.MAX_LENGTH_NOTE}
        <No: ${isMaxLengthNote.join(', ')}>`
      );
    }

    if (errorMsg.length > 0) {
      openDialog({
        title: Message.warning,
        // type: dialogConstant.type.WARNING,
        content: errorMsg,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
    }

    return errorMsg.length === 0;
  };

  /**
   * handler for saving draft or saving normal
   * @param {Array} fieldArray
   * @param {Object} dataDetailsOnGrid
   * @param {String} savingType
   */
  onSave = (fieldArray, dataDetailsOnGrid, historyData, savingType) => {
    let params = {};
    const { isEditPage, assetRequestId } = this.props;

    const promise = new Promise((resolve, reject) => {
      const generalInformation = this.mapGeneralInformationForSaving(
        fieldArray
      );

      // Get all data on detail grid
      // Don't allow empty detail list
      const detailsList = dataDetailsOnGrid && dataDetailsOnGrid.data;
      if (
        !this.isValidDetailListInformation(
          detailsList,
        )
      ) {
        reject();
      } else {
        // Update status for edit/add
        let status = savingType === Action.saveDraft ? AssetRequestConstant.status.draft :
          AssetRequestConstant.status.wait;
        if (isEditPage) {
          params = {
            ...params,
            ...generalInformation,
            status: status,
            id: Number(assetRequestId),
          };
        } else {
          params = { 
            ...params,
            ...generalInformation,
            status: status
          };
        }

        params.assetRequestDetails = this.mapDetailsInformationForSaving(
          detailsList
        );

        params.assetRequestHistories = historyData;

        // Perform saving
        saveAssetRequest(
          params,
          isEditPage ? Action.update : Action.insert,
          savingType
        )
          .then((res) => {
            if (res && res.message) {
              this.showMessageContentFromSystem(res);
              reject();
            }

            if (res && res.data) {
              const assetRequestNo = res.data.assetRequestNo;
              let msg = '';

              if (isEditPage) {
                msg =
                  (savingType === Action.saveDraft &&
                    Message.ASSET_REQUEST
                      .DRAFT_UPDATE_SUCCESSFULLY) ||
                  Message.ASSET_REQUEST.SUBMIT_SUCCESSFULLY;
              } else {
                msg =
                  (savingType === Action.saveDraft &&
                    Message.ASSET_REQUEST.DRAFT_SAVE_SUCCESSFULLY) ||
                  Message.ASSET_REQUEST.SUBMIT_SUCCESSFULLY;
              }

              openDialog({
                title: Message.INFORMATION,
                type: dialogConstant.type.INFORMATION,
                content: msg.replace('%ASSET_REQUEST_NO%', assetRequestNo),
                actions: [
                  {
                    name: this.props.t(Action.ok),
                    type: dialogConstant.button.FUNCTION,
                    className: buttonConstant.type.PRIMARY,
                    action: () => {
                      resolve();
                    },
                  },
                ],
              });
            }
          })
          .catch((res) => {
            this.showSystemErrorDialog(res);
            reject();
          });
      }
    });

    return promise;
  };

  mapGeneralInformationForSaving = (generalInformation) => {
    const result = {};
    generalInformation.forEach((el) => {
      switch (el.fieldName) {
        default:
          result[el.fieldName] =
            typeof el.value === 'string' ? el.value.trim() : el.value;
          break;
      }
    });

    return result;
  };

  mapDetailsInformationForSaving = (detailsInformation) =>
    detailsInformation.map((el) => ({
      assetRequestId: el.assetRequestId,
      assetRequestMasterId: +el.sku,
      unitPrice: el.unitPrice,
      notes: el.notes,
      deliveryDate: el.deliveryDate,
      damagedQty: el.damagedQty,
      amount: el.amount,
      quantity: +el.quantity
    }));

  // Save Draft
  onCustomSaveDraft = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.saveDraft);

  // Submit
  onCustomSave = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.save);

  showMessageContentFromSystem = (res) => {
    let contentMsg = '';
    const messageContent =
      res &&
      res.message &&
      res.message.messages &&
      res.message.messages[0].messageContent;

    if (messageContent) {
      contentMsg = messageContent;
    }
    openDialog({
      title: Message.ERROR,
      type: dialogConstant.type.ERROR,
      content: contentMsg,
      actions: [
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  showSystemErrorDialog = (res) => {
    let contentMsg = '';
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
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  updateDataForFieldsArray = (detailData) => {

    this.updateMultipleDetailFieldArray([
      {
        fieldName: AssetRequestConstant.general.requestFrom,
        property: 'value',
        updatedData: detailData.branchCodeFrom,
      },
      {
        fieldName: AssetRequestConstant.general.requestTo,
        property: 'value',
        updatedData: detailData.branchCodeTo,
      },
      {
        fieldName: AssetRequestConstant.general.ssdNo,
        property: 'value',
        updatedData: detailData.ssdNo,
      },
      {
        fieldName: AssetRequestConstant.general.note,
        property: 'value',
        updatedData: detailData.notes,
      },
    ]);
  };

  loadAssetType = () => {
    let assetType = [];
    getAssetType().then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      assetType = formatComboBox(res.data);
      this.setState({
        assetType
      });
    });
  };

  handleRowSelect = (selectedRows) => {
    this.setState({
      selectedRowOnGrid: selectedRows,
    });
  };

  //TODO
  loadAssetRequestDataById = (assetRequestId) => {
    const promise = new Promise((resolve) => {
      getValueAssetRequestDetails(assetRequestId).then((res) => {
        const { getAssetRequestNo } = this.props;
  
        if(res.data) {
          getAssetRequestNo && getAssetRequestNo(res.data.assetRequestNo);
          this.setState({
            assetRequestNo: res.data.assetRequestNo,
            requestTo: res.data.branchCodeTo,
            branchValue: res.data.branchCodeFrom,
          });
  
          const assetRequestDetailVO = res.data?.assetRequestDetails ? res.data?.assetRequestDetails.map(
            (item, index) => {
              item.no = +index + 1;
              item.entity = 'asset_request_master';
              item.sku = String(item.assetRequestMasterId);
              return item;
            }) : '';
  
          this.updateDataForFieldsArray(res.data);
          this.updateDataDetailsOnGrid({
            data: convertItemDataStructure(
              assetRequestDetailVO,
              [],
              'quantity',
              res.data
            ),
          });
          const history = (res.data && res.data.assetRequestHistories &&
            res.data.assetRequestHistories.map((el) => ({
              time: el.updateDate,
              note: `${el.action} ${el.comment}`,
              userName: el.createdBy,
            }))) ||
            [];
          history.length > 0 && this.updateHistoryData(history);
          resolve(res.data);
        }
      });
    });
    return promise;
  };

  loadAssetType = () => {
    let assetType = [];
    getAssetType().then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      assetType = formatComboBox(res.data);
      this.setState({
        assetType
      });
    });
  };

  loadAssetCategory = () => {
    let assetCategory = [];
    getAssetCategory().then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      assetCategory = formatComboBox(res.data);
      this.setState({
        assetCategory
      });
    });
  };

  loadAssetSubCategory = () => {
    let assetSubCategory = [];
    getAssetSubCategory().then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      assetSubCategory = formatComboBox(res.data);
      this.setState({
        assetSubCategory
      });
    });
  };

  componentDidMount() {
    const { assetRequestId, isEditPage } = this.props;
    if (!this.isViewMounted) {
      return;
    }
    const defaultValBranch = {
      value: this.loggedUser.branch,
      isArray: false,
    };
    if (isEditPage) {
      this.loadAssetRequestDataById(assetRequestId).then(
        res => defaultValBranch.value = res.branchCodeFrom
      );
    }
    Promise.all([
      getRequestBranch(),
    ]).then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      // Update Request From, Request To
      this.updateMultipleDetailFieldArray([
        //TODO
        {
          fieldName: 'branchCodeFrom',
          property: 'data',
          updatedData: formatDropdownList(res[0].data),
          defaultValue: defaultValBranch,
        },
        {
          fieldName: 'branchCodeTo',
          property: 'data',
          updatedData: formatDropdownList(res[0].data),
        },
      ]);
      this.updateAllAddItemsFieldArray(addItemsFieldArray);
      // Load option data for item in 'Add items' form
      this.loadAssetType();
      this.loadAssetCategory();
      this.loadAssetSubCategory();
    });
  }

  componentWillUnmount() {
    this.isViewMounted = false;
    this.fieldArray = [];
  }

  updateFormFieldsArray = (newFieldArray) => {
    this.fieldArray = newFieldArray;
  };

  updateDataDetailsOnGridForEachPage = (dataDetailsOnGrid) => {
    this.dataDetailsOnGrid = dataDetailsOnGrid;
  };
  
  render() {
    // fieldArray for fields in form
    // dataDetailsOnGrid is for the details information grid
    // addItemsFieldList is for all search fields on 'Add items' form
    // classFormFieldCustom is to custom width of fields in general information form =>
    // => eg: rowSize is equal to 3, the width of each field should equal to 33.33%
    const {
      addItemsFieldList,
      rowSize,
      classFormFieldCustom,
      history,
      historyData,
      isEditPage
    } = this.props;

    // fieldsLabelArray for fields is text only in form, use for general information form
    const {
      fieldsLabelArray,
      configItemDataOnGrid,
      validate,
      requestTo
    } = this.state;
    const temptOptions = this.state.options;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields(
        this.onRequestToChange,
        this.onRequestFromChange,
        isEditPage,
      );
      this.updateAllFieldArray(this.fieldArray);
    }

    const listConfig = {
      rowSize,
      classFormFieldCustom,
      actions: actions(requestTo === '' ? true : false, this.addAssetHandler),
      options: temptOptions,
      validation: validate,
      totalSummarizeInGrid,
      addItemsFieldList,
      informationConvert: this.informationConvert,
      fieldsLabelArray: fieldsLabelArray,
      columnsDetail: columnsDetail || [],
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
      onCustomSaveDraft: this.onCustomSaveDraft,
      onCustomSave: this.onCustomSave,
      updateFormFieldsArray: this.updateFormFieldsArray,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
      customClassNameForDetailGrid: 'grid-large-content',
      isShowScanTimeLine,
      history,
      configItemDataOnGrid,
      historyData,
      handleRowSelect: this.handleRowSelect,
      notAllowConfirmLeavePage: this.state.notAllowConfirmLeavePage,
      numItemsInCart: this.numItemsInCart,
      updateIsResetItems: this.updateIsResetItems,
      isResetItems: this.state.isResetItems
    };

    return (
      <>
        <DetailForm {...listConfig} />
      </>
    );
  }
}

AssetRequestForm.propTypes = {
  t: PropTypes.any,
  fieldArray: PropTypes.any,
  rowSize: PropTypes.number,
  assetRequestId: PropTypes.string,
  isDetailsPage: PropTypes.bool,
  isEditPage: PropTypes.bool,
  classFormFieldCustom: PropTypes.string,
  updateDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.any,
  dataDetailsOnGrid: PropTypes.object,
  updateDataDetailsOnGrid: PropTypes.func,
  updateMultipleDetailFieldArray: PropTypes.any,
  history: PropTypes.object,
  updateOpenStateSearchPopup: PropTypes.func,
  updateHistoryData: PropTypes.func,
  historyData: PropTypes.any,
  updateAddItemsSelections: PropTypes.func,
  getAssetRequestNo: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    addItemsFieldList: state.addItemsFormStore.fieldArray,
    // Data on Add History section
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
  updateMultipleDetailFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY,
      detailsData: data,
    }),
  // Update data on Add History section
  updateHistoryData: (data) =>
    dispatch({ type: ActionType.UPDATE_HISTORY_DATA, history: data }),
  updateAddItemsSelections: (data) =>
    dispatch({
      type: ActionType.UPDATE_ADD_ITEMS_SELECTIONS,
      addItemsSelections: data,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AssetRequestForm));
