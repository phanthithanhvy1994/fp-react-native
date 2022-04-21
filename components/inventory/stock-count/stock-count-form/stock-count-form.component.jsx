import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getUserInfo } from '../../../../actions/auth-action';
import { getAllBranchCombo } from '../../../../actions/branch.action';
import { printFilePDF } from '../../../../util/print-util';
import {
  getStockCountData,
  getStockCountType,
  getStockListForCounting,
  saveStockCount,
  getHistoryData,
  updateStockCountData,
  importStockItem,
  updateStockCountStatus,
  getReason
} from '../../../../actions/stock-count-action';
import {
  Action,
  ActionType,
  StockCount,
  userBranchInfo,
  ActionBottomGridButtonConstant
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { convertItemDataStructure } from '../../../material/material.common';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import {
  columnsDetail,
  getFields,
  options,
  validation,
  customToolbarContent,
  informationConvert,
  bottomGridButtonsArray,
  fieldsLabelArray,
  comparedInfoDiv,
  getTotalCounted,
  getGap
} from './stock-count-form.config';
import {
  openDialog,
  showErrorDialog,
  showConfirmDialog,
  showInformationDialog,
} from '../../../../redux/message-dialog/message-dialog.actions';
import { openRejectDialog } from '../../../../redux/reject-dialog/reject-dialog.actions';
// import { printFilePDF } from '../../../../util/print-util';
import useStyles from './stock-count-form.style';
import {
  formatDropdownList,
  mapColumnAndDataForMessageSAP,
  formatComboBox
} from '../../../../util/format-util';
import { API_PATHS, DOMAIN } from '../../../../services/service.config';
import { getErrorMessage } from '../../../../util/error-util';

class StockCountForm extends Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    this.state = {
      options,
      detailData: {
        branchCode: userBranchInfo.defaultBranch
      },
      // Prevent showing popup confirm leave page
      // In case: go to edit page but not have permission to edit it
      // it will redirect to detail page without confirm leave page
      notAllowConfirmLeavePage: false,
      listCounting: null,
      configItemDataOnGrid: []
    };
    this.loggedUser = getUserInfo();
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    // Get dispatch action from props to use it to update data state later
    this.updateDetailFieldArray = props.updateDetailFieldArray;
    this.updateMultipleDetailFieldArray = props.updateMultipleDetailFieldArray;
    this.updateAllFieldArray = props.updateAllFieldArray;
    this.updateDetailAddItemsFieldArray = props.updateDetailAddItemsFieldArray;
    this.updateAllAddItemsFieldArray = props.updateAllAddItemsFieldArray;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.updateHistoryData = props.updateHistoryData;

    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

  // Load stockcount type option data for multiselect field
  loadStockCountType = () =>
    new Promise((resolve) =>
      getStockCountType()
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadBranch = (userId) =>
    new Promise((resolve) =>
      getAllBranchCombo(userId)
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  /**
   * Remap all information in Details Information area before saving
   * @param {Object} detailsInformation 
   */
  mapDetailsInformationForSaving = (detailsInformation) => detailsInformation.map((el) => ({
    // Each rowData need id and entity to identify each record
    orderQuantity: (el.orderQuantity && +el.orderQuantity) || 0,
    sku: el.sku,
    basedQuantity: (el.basedQuantity && +el.basedQuantity) || 0,
    totalCounted: getTotalCounted(el),
    stockOnHandQuantity: el.stockOnHandQuantity,
    gapQuantity: getGap(el),
    description: el.description,
    threshold: el.threshold,
    reason: el.reason
  }));

  /**
   * Set status base on savingType and orderType
   * @param {String} savingType
   * @param {Object} generalInformation
   */
  mapToAssociateStatus = (savingType, generalInformation) => {
    let status = this.state.detailData.status;
    switch (savingType) {
      case Action.saveDraft:
        status = status === StockCount.statusValue.counting ? status : StockCount.statusValue.draft;
        break;
      default:
        status = StockCount.statusValue.waitingForApproval;
        break;
    }
    return +status;
  };

  mapGeneralInformationForSaving = (generalInformation, savingType) => {
    const result = {};
    generalInformation.forEach((el) => {
      result[el.fieldName] = typeof el.value === 'string' ? el.value.trim() : el.value;
    });
    return result;
  };

  isGapOverThreshold = (gap, threshold, stockOnHand) => {
    const gapPercent = (+(gap || 0)*100)/+(stockOnHand || 1);
    return gapPercent > threshold;
  };

  /**
   * Check Detail List is valid or not: quantity must be number
   * and detail list must be not empty
   * @param {Array} detailList
   */
  isValidDetailListInformation = (detailList, generalInformation, savingType) => {
    if (!detailList || detailList.length === 0) {
      openDialog({
        title: Message.ERROR,
        content: Message.DETAILS_REQUIRED,
        disableBackdropClick: true,
        actions: [
          {
            name: this.props.t(Action.ok),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return false;
    }

    if (savingType === Action.saveDraft) {
      return true;
    }

    let isEmptyOrderQuantity = [];
    let isEmptyBaseQuantity = [];
    let isRequiredNote = [];
    const errorMsg = [];

    detailList.forEach((el) => {
      if (!el.orderQuantity || !+el.orderQuantity) {
        isEmptyOrderQuantity.push(el.no);
      }

      if (!el.basedQuantity || !+el.basedQuantity) {
        isEmptyBaseQuantity.push(el.no);
      }

      if (this.isGapOverThreshold(getGap(el), el.threshold, el.stockOnHandQuantity) && (!el.description || !el.description.trim())) {
        isRequiredNote.push(el.no);
      }
    });

    if (isEmptyOrderQuantity.length > 0) {
      errorMsg.push(`${StockCount.label.orderQuantity} ${Message.FIELD_REQUIRED}
        <No: ${isEmptyOrderQuantity.join(', ')}>`
      );
    }

    if (isEmptyBaseQuantity.length > 0) {
      errorMsg.push(`${StockCount.label.basedQuantity} ${Message.FIELD_REQUIRED}
        <No: ${isEmptyBaseQuantity.join(', ')}>`
      );
    }

    if (isRequiredNote.length > 0) {
      errorMsg.push(`${StockCount.label.note} ${Message.FIELD_REQUIRED}
        <No: ${isRequiredNote.join(', ')}>`
      );
    }

    if (errorMsg.length > 0) {
      openDialog({
        title: Message.ERROR,
        content: errorMsg,
        disableBackdropClick: true,
        actions: [
          {
            name: this.props.t(Action.ok),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
    }

    return errorMsg.length === 0;
  };

  /**
   * Check general information is valid or not
   * @param {Object} generalInformation
   */
  isValidGeneralInformation = (generalInformation) => {
    const requiredLabel = [];
    // Branch, Stock Count Type are required
    if (!generalInformation.branchCode) {
      requiredLabel.push(StockCount.label.branch);
    }
    if (!generalInformation.stockCountTypeValue) {
      requiredLabel.push(StockCount.label.stockCountType);
    }

    if (requiredLabel.length > 0) {
      const msgLabel = requiredLabel.length === 1 ? 'comMSG001' : 'comMSG003';
      openDialog({
        title: Message.ERROR,
        content: `${requiredLabel.join(',')} ${Message.common[msgLabel]}`,
        disableBackdropClick: true,
        actions: [
          {
            name: this.props.t(Action.ok),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return false;
    }

    return true;
  };

  /**
   * Show error message or show successfully message after saving
   */
  handleAfterSaving = (res, savingType, resolve, reject) => {
    if (res.message && res.message.messages) {
      let msgContent = '';
      const sapError = res.message.messages.filter(
        (el) => el.errorSAPRestVO
      );
      if (sapError.length > 0) {
        msgContent = mapColumnAndDataForMessageSAP(
          res.message.messages
        );
      } else {
        msgContent = res.message.messages[0].messageContent;
      }
      showErrorDialog(msgContent, !!(sapError.length > 0));
      reject();
      return;
    }
    const draftMsg =
      (savingType === Action.saveDraft && Message.STOCK_COUNT.DRAFT_SUCCESSFULLY)
      || Message.STOCK_COUNT.SUBMIT_SUCCESSFULLY;

    openDialog({
      title: Message.INFORMATION,
      content: draftMsg.replace('%requestNo%', res.data),
      disableBackdropClick: true,
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
  };
  handleActionSave = (params, savingType, resolve, reject) => {
    // Perform saving
    saveStockCount(params, !params.id ? Action.insert : Action.update)
      .then((res) => {
        if (res && res.status === '200') {
          this.handleAfterSaving(res, savingType, resolve, reject);
        }
      })
      .catch((err) => {
        showErrorDialog(Message.SAVE_UNSUCCESSFULLY);
        reject();
      });
  };
  /**
   * handler for saving draft or saving normal
   * @param {Array} fieldArray
   * @param {Object} dataDetailsOnGrid
   * @param {String} savingType
   */
  onSave = (fieldArray, dataDetailsOnGrid, historyData, savingType) => {
    const { requestNo } = this.state.detailData;
    let params = {};
    const promise = new Promise((resolve, reject) => {
      const generalInformation = this.mapGeneralInformationForSaving(
        fieldArray
      );
      // Get all data on detail grid
      // Dont allow empty detail list
      const detailsList = dataDetailsOnGrid && dataDetailsOnGrid.data;

      if (!this.isValidGeneralInformation(generalInformation)) {
        reject();
      } else if (
        !this.isValidDetailListInformation(
          detailsList,
          generalInformation,
          savingType
        )
      ) {
        reject();
      } else {
        // Update status
        const status = this.mapToAssociateStatus(
          savingType,
          generalInformation
        );
        params = { ...params, ...generalInformation, status };

        params.stockCountDetailVOs = this.mapDetailsInformationForSaving(
          detailsList,
          generalInformation.orderType
        );
        params.stockCountId =
          this.state.detailData && this.state.detailData.stockCountId;
        params.historyVOs = historyData;
        if (savingType === Action.save) {
          openDialog({
            title: Message.CONFIRM,
            content: Message.STOCK_COUNT.SUBMIT_CONFIRM.replace(
              '%requestNo%',
              (requestNo && `: <${requestNo}>`) || ''
            ),
            actions: [
              {
                name: this.props.t('Cancel'),
                type: dialogConstant.button.NONE_FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  return;
                },
              },
              {
                name: this.props.t('Ok'),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  this.handleActionSave(params, savingType, resolve, reject);
                },
              },
            ],
          });
        } else {
          this.handleActionSave(params, savingType, resolve, reject);
        }
      }
    });

    return promise;

  };

  onCustomSaveDraft = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.saveDraft);

  onCustomSave = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.save);

  convertDetailListData = (detailList) => {
    let lineNumber = 0;
    const tempDetailList = detailList.map(el => {
      lineNumber += 1;
      return {
        ...el,
        lineNumber
      };
    });
    return convertItemDataStructure(tempDetailList, informationConvert);
  };

  loadReason = () => {
    getReason('RR_REASON_TYPE').then((res) => {
      this.setState({
        configItemDataOnGrid: { reason: formatComboBox(res.data) },
      });
    });
  };

  /**
   * Load Stock Count data for edit and detail page
   * @param {String} id 
   */
  loadStockCount = (id, isEditPage, comboboxValues) => {
    getStockCountData({ id }).then((res) => {
      if (getErrorMessage(res)) {
        showErrorDialog(getErrorMessage(res));
        return;
      }
      if (!res.data) {
        this.props.history.push('/404');
      }
      const detailData = res.data;

      // Prevent edit unavailable item by redirect to detail page
      const status = detailData && detailData.status && detailData.status.toString();
      if (
        !this.props.isDetailsPage &&
        status !== StockCount.statusValue.draft &&
        status !== StockCount.statusValue.rejected &&
        status !== StockCount.statusValue.failed &&
        status !== StockCount.statusValue.counting
      ) {
        this.setState({ notAllowConfirmLeavePage: true }, () => {
          this.props.history.push(`/end-of-day/stock-count/detail/${id}`);
        });
        return;
      }

      // Convert structure data for detail list to display on grid
      const detailList = (detailData && detailData.stockCountDetailVOs
        && this.convertDetailListData(detailData.stockCountDetailVOs)) || [];
      this.setState({
        detailData: detailData,
        listCounting: detailList
      });
      this.updateDataDetailsOnGrid({
        data: detailList
      });
      this.updateAllFieldArray(getFields(
        this.state.detailData,
        this.onBranchChange,
        this.onStockCountTypeChange,
        isEditPage
      ));

      // Update data for General Information area
      const multipleUpdatedField = [
        {
          fieldName: StockCount.searchFieldName.branch,
          property: 'data',
          updatedData: formatDropdownList(comboboxValues[0].data),
          defaultValue: {
            value: detailData && detailData.branchCode,
            isArray: false,
          },
        },
        {
          fieldName: StockCount.stockCountTypeValue,
          property: 'data',
          updatedData: formatComboBox(comboboxValues[1].data),
          defaultValue: {
            value: detailData && detailData.stockCountTypeValue,
            isArray: false,
          },
        },
        {
          fieldName: StockCount.description,
          property: 'value',
          updatedData: detailData && detailData.description,
        },
      ];
      if (isEditPage) {
        this.updateMultipleDetailFieldArray(multipleUpdatedField);
      }
    });
  };

  loadHistoryData = (id) => {
    getHistoryData({ id }).then((res) => {
      const data =
        (res.data &&
          res.data.map((el) => ({
            time: el.updateDate,
            note: `${el.action} ${el.comment}`,
            userName: el.createdBy,
          }))) ||
        [];
      data.length > 0 && this.updateHistoryData(data);
    });
  };

  customOnchange(fieldName) {
    if (fieldName === StockCount.orderQuantity || fieldName === StockCount.basedQuantity) {
      this.setState({
        detailData: {
          ...this.state.detailData,
          stockCountDetailVOs: [...this.dataDetailsOnGrid.data]
        }
      });
    }
  };

  componentDidMount() {
    const { isEditPage, isDetailsPage, itemId } = this.props;

    // Load History Data
    if (isEditPage || isDetailsPage) {
      this.loadHistoryData(itemId);
    }

    if (!this.isViewMounted) {
      return;
    }
    // load all neccessary data option and update to redux store
    Promise.all([
      this.loadBranch(),
      this.loadStockCountType(),
    ]).then((values) => {
      if (!this.isViewMounted) {
        return;
      }
      !isDetailsPage && this.loadReason();
      if (isEditPage || isDetailsPage) {
        this.loadStockCount(itemId, isEditPage, values);
      } else {
        // Update banch, Stock count Type option
        this.updateMultipleDetailFieldArray([
          {
            fieldName: StockCount.searchFieldName.branch,
            property: 'data',
            updatedData: formatDropdownList(values[0].data),
            defaultValue: !isDetailsPage ? {
              value: this.loggedUser.branch,
              isArray: false,
            } : null,
          },
          {
            fieldName: StockCount.stockCountTypeValue,
            property: 'data',
            updatedData: formatComboBox(values[1].data),
          },
        ]);
      }
    });
  }

  // Handler when clicking 'Load Stock' btn
  getLoadedItemForDetailGrid = () => {
    const detailData = this.state.detailData || {};
    return new Promise((resolve) => {
      getStockListForCounting({
        branchCode: {
          eq: detailData.branchCode,
        },
        stockCountType: detailData.stockCountTypeValue,
      }).then((res) => {
        const data = (res.data && convertItemDataStructure(res.data, informationConvert)) || [];
        
        if (data.length === 0) {
          showErrorDialog(Message.NO_ITEM_FOUND);
          return;
        }
        this.setState({
          listCounting: data
        });
        resolve(data);
      });
    });
  };

  onCustomEdit = () => {
    const { itemId } = this.props;
    const url = '/end-of-day/stock-count/edit/';
    return url + itemId;
  };

  updateStockCountData = (serverPath, params, successMsg) => {
    return new Promise((resolve, reject) => {
      updateStockCountData(serverPath, params).then(res => {
        if (getErrorMessage(res)) {
          showErrorDialog(getErrorMessage(res));
          return;
        }
        if (!successMsg) {
          this.props.history.push('/end-of-day/stock-count');
        } else {
          showInformationDialog(successMsg, () => {
            this.props.history.push('/end-of-day/stock-count');
          });
        }
        resolve();
      });
    });
  };

  onCustomClose = () => {
    showConfirmDialog(
      Message.STOCK_COUNT.CLOSE_CONFIRM.replace('%REQUEST_NO%', this.state.detailData && this.state.detailData.requestNo),
      () => 
        this.updateStockCountData(
          API_PATHS.closeStockCount,
          { stockCountId: this.state.detailData.stockCountId },
        )
    );
  };

  onCustomApprove = () => {
    const { detailData } = this.state;
    openDialog({
      title: Message.CONFIRM,
      content: Message.STOCK_COUNT.APPROVE_CONFIRM.replace(
        '%requestNo%',
        detailData.requestNo
      ),
      type: dialogConstant.type.CONFIRM,
      actions: [
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: this.props.t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            this.updateStockCountData(
              API_PATHS.approveStockCount,
              { stockCountId: this.state.detailData.stockCountId },
              Message.STOCK_COUNT.APPROVED_SC_SUCCESSFULLY.replace(
                '%REQUEST_NO%',
                this.state.detailData && this.state.detailData.requestNo
              )
            );
          },
        },
      ],
    });
  };

  onCustomPrint = () => {
    const id = this.state.detailData && this.state.detailData.stockCountId;
    const url = `${DOMAIN}${API_PATHS.exportStockCount}?id=${id}`;
    printFilePDF(url);
  };

  rejectSC = (reasonData, handleFor) => {
    const serverPath = handleFor === ActionBottomGridButtonConstant.CANCEL ? API_PATHS.cancelStockCount : API_PATHS.rejectStockCount;
    const successMessage = handleFor === ActionBottomGridButtonConstant.CANCEL ?
      Message.STOCK_COUNT.CANCELLED_SC_SUCCESSFULLY : Message.STOCK_COUNT.REJECTED_SC_SUCCESSFULLY;

    return this.updateStockCountData(serverPath, {
      stockCountId: this.state.detailData.stockCountId,
      reason: reasonData,
    }, successMessage.replace('%REQUEST_NO%', this.state.detailData.requestNo));
  };

  onCustomReject = (fieldsLabel, data, handleFor) => {
    openRejectDialog({
      title: handleFor === ActionBottomGridButtonConstant.CANCEL ? Message.CANCEL_TITLE : Message.REJECT_TITLE,
      messageTitle: handleFor === ActionBottomGridButtonConstant.CANCEL ? Message.CANCEL_MESSAGE_TITLE : Message.REJECT_MESSAGE_TITLE,
      submitApiFn: this.rejectSC,
      disableBackdropClick: true,
      isNormalInput: true,
      maxLength: 25,
      handleFor,
      actions: [
        {
          name: this.props.t(Action.cancel),
          type: dialogConstant.button.NO_FUNCTION,
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

  componentWillUnmount() {
    this.isViewMounted = false;
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

  updateDataDetailsOnGridForEachPage = (dataDetailsOnGrid) => {
    this.dataDetailsOnGrid = dataDetailsOnGrid;
  };

  updateFormFieldsArray = (newFieldArray) => {
    this.fieldArray = newFieldArray;
  };

  /**
   * update branchCode when changing branch
   * @param {Object} e 
   * @param {Array} newFieldArray 
   */
  onBranchChange = (e, newFieldArray) => {
    const branchIndex = newFieldArray.findIndex(el => el.fieldName === StockCount.branch);
    if (newFieldArray[branchIndex]) {
      this.setState({
        detailData: {
          ...this.state.detailData,
          branchCode: newFieldArray[branchIndex].value
        }
      });
    }
  };

  /**
   * Update STock Count Type and list counting to update start stockcount btn
   * @param {Array} newFieldArray 
   */
  updateThingsRelateToStockType = (newFieldArray) => {
    const stockCountTypeIndex = newFieldArray.findIndex(el => el.fieldName === StockCount.stockCountTypeValue);
    if (newFieldArray[stockCountTypeIndex]) {
      this.setState({
        detailData: {
          ...this.state.detailData,
          stockCountTypeValue: newFieldArray[stockCountTypeIndex].value,
          stockCountDetailVOs: [],
          status: this.props.isEditPage ? this.state.detailData.status : ''
        },
        listCounting: []
      });
    }
  };

  /**
   * Show confirm and do associate action if user cancel or submit the confirmation
   */
  confirmChangeStockCount = (oldFieldArray, newFieldArray) => {
    if (!this.dataDetailsOnGrid || !this.dataDetailsOnGrid.data || this.dataDetailsOnGrid.data.length === 0) {
      this.updateThingsRelateToStockType(newFieldArray);
      return;
    }
    const cancelHandler = () => {
      // Kepp current state and current order Type
      const stockCountTypeIndex = oldFieldArray.findIndex(
        (el) => el.fieldName === StockCount.stockCountTypeValue
      );

      this.updateDetailFieldArray({
        fieldName: StockCount.stockCountTypeValue,
        property: 'value',
        updatedData: oldFieldArray[stockCountTypeIndex].value,
      });
    };
    const submitHandler = () => {
      // Remove all data on grid
      this.updateDataDetailsOnGrid({});
      this.updateThingsRelateToStockType(newFieldArray);
    };

    showConfirmDialog(Message.STOCK_COUNT.CHANGE_STOCK_COUNT_TYPE, submitHandler, cancelHandler);
  }

  /**
   * update stock count type code when changing stock count type
   * @param {Object} e 
   * @param {Array} newFieldArray 
   */
  onStockCountTypeChange = (e, newFieldArray, oldFieldArray) => {
    this.confirmChangeStockCount(oldFieldArray, newFieldArray);
  };

  /**
   * Disable some fields after status change to counting
   */
  updateDataRelateToStatus = () => {
    this.setState({
      detailData: {
        ...this.state.detailData,
        status: StockCount.statusValue.counting,
      }
    });
    if (this.props.isEditPage) {
      // Disable branch and stock count type value
      // Update data for General Information area
      const multipleUpdatedField = [
        {
          fieldName: StockCount.searchFieldName.branch,
          property: 'disabled',
          updatedData: true,
        },
        {
          fieldName: StockCount.stockCountTypeValue,
          property: 'disabled',
          updatedData: true,
        },
      ];
      this.updateMultipleDetailFieldArray(multipleUpdatedField);
    }
  };

  startStockCountHandler = () => {
    if (this.state.detailData.stockCountId) {
      updateStockCountStatus({
        stockCountId: this.state.detailData.stockCountId,
        status: StockCount.statusValue.counting
      }).then((res) => {
        if (res.status === '200') {
          this.updateDataRelateToStatus();
        }
      });
    } else {
      this.updateDataRelateToStatus();
    }
  };

  /**
   * Convert data between send request to server.
   * Send request to server to get information and update data to grid
   */
  importData = () => {
    if (!this.state.importDataList || this.state.importDataList.length === 0) {
      showErrorDialog('Please choose a file to import!');
      return;
    }
    const importData = this.state.importDataList.map(el => ({
      materialCode: el['Material Code'],
      materialDescription: el['Material Description'],
      countedOrderQuantity: isNaN(+el['Counted Order Quantity']) ? 0 : +el['Counted Order Quantity'],
      countedBasedQuantity: isNaN(+el['Counted Based Quantity']) ? 0 : +el['Counted Based Quantity'],
    }));

    importStockItem({
      stockCountImport: importData
    }).then(res => {
      const errorMsg = getErrorMessage(res);
      if (errorMsg) {
        showErrorDialog(errorMsg);
        return;
      }
      const list = (this.dataDetailsOnGrid && [...this.dataDetailsOnGrid.data]) || [];
      const importList = res.data.stockCountDetailVOs || [];
      const allLineItems = [
        ...convertItemDataStructure(importList, informationConvert),
        ...list.filter(el => importList.findIndex(importLine => importLine.sku === el.sku) === -1)
      ].map((el, index) => ({
        ...el,
        stockCountId: (this.state.detailData && this.state.detailData.stockCountId) || el.stockCountId,
        lineNumber: index + 1,
        no: index + 1,
      }));
      this.updateDataDetailsOnGrid({
        data: [...allLineItems]
      });
    });
  };

  handleImportData = (data) => {
    this.setState({
      importDataList: data
    });
  };

  getNumOfDifferentQuantity = (detailData) => {
    let number = 0;
    detailData && detailData.stockCountDetailVOs && detailData.stockCountDetailVOs.forEach(el => {
      const totalCounted = getTotalCounted(el);
      if (totalCounted !== +el.stockOnHandQuantity) {
        number += 1;
      }
    });
    return number;
  };

  filterExportData = (data) => {
    return data.map(el => ({
      materialCode: el.sku,
      materialDescription: el.materialDescription,
      countedOrderQuantity: el.orderQuantity,
      countedBaseQuantity: el.basedQuantity
    }));
  };

  /**
   * Export multiple table in detail page
   */
  getExportDetailData = (data) => {
    if (!data || !this.props.isDetailsPage) {
      return [];
    }
    const exportArray = [
      [],
      ['Branch', data.branchName],
      ['Stock Count Type', data.stockCountTypeName],
      ['Status', data.statusName],
      ['Approved By', data.approvedBy],
      ['Cancel Reason', data.cancelReason],
      ['Material Document', data.materialDocument],
      ['Note', data.description],
      [],
      ['No.', 'Material Code', 'Material Description', 'Consumption Qty.', 'Counted Order Qty.', 'Counted Based Qty.', 'Total Counted', 'Stock On Hand', 'Gap', 'Yield/Loss', 'Reason', 'Note']
    ];

    const listItems = data.stockCountDetailVOs || [];
    if (listItems.length > 0) {
      let no = 0;
      listItems.forEach(el => {
        no += 1;
        exportArray.push([
          no,
          el.sku,
          el.materialDescription,
          el.consumptionQuantity,
          el.orderQuantity,
          el.basedQuantity,
          getTotalCounted(el),
          el.stockOnHandQuantity,
          getGap(el),
          el.yieldLoss,
          el.reason,
          el.description
        ]);
      });
    }
    exportArray.push([]);
    exportArray.push(['Compare the imported data with stock on hand']);
    const numDiff = this.getNumOfDifferentQuantity(data);
    const numSame = listItems.length - numDiff;
    exportArray.push(['The counted quantity and system quantity are different', numDiff]);
    exportArray.push(['The counted quantity is equal to the system quantity.', numSame]);
    return exportArray;
  };

  render() {
    // fieldArray for fields in form
    // dataDetailsOnGrid is for the details information grid
    const {
      isEditPage,
      isDetailsPage,
      history,
      classes,
    } = this.props;
    const btnActions = this.state.actions;
    const tempOptions = this.state.options;
    const detailData = this.state.detailData;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields(
        this.state.detailData,
        this.onBranchChange,
        this.onStockCountTypeChange,
        isEditPage
      );
      this.updateAllFieldArray(this.fieldArray);
    }
    const detailNo = this.state.detailData && this.state.detailData.requestNo;
    let title = 'Create Stock Count';
    if (isEditPage) {
      title = `Edit Stock Count ${detailNo ? `<No. ${detailNo}>` : ''}`;
    } else if (isDetailsPage) {
      title = `View Stock Count Details  ${
        detailNo ? `<No. ${detailNo}>` : ''
      }`;
    }

    const pageHeader = {
      pageTitle: title,
      showButton: false,
    };

    const exportData = this.getExportDetailData(this.state.detailData);

    const listConfig = {
      history,
      actions: btnActions,
      options: tempOptions,
      validation,
      totalSummarizeInGrid: this.state.totalSummarizeInGridArea,
      customRowImageClass: this.state.customRowImageClass,
      columnsDetail: columnsDetail(this.state.detailData, this.customOnchange.bind(this)) || [],
      isConfigDisabledBtnSubmit: !detailData || !detailData.status ||
        detailData.status.toString() !== StockCount.statusValue.counting, 
      comparedInfoDiv: comparedInfoDiv(this.state.detailData, this.getNumOfDifferentQuantity),
      customToolbarContent: customToolbarContent(
        this.state.detailData,
        isDetailsPage,
        this.state.listCounting,
        this.startStockCountHandler.bind(this),
        this.filterExportData,
        this.importData,
        this.handleImportData,
      ),
      configItemDataOnGrid: this.state.configItemDataOnGrid,
      onCustomSaveDraft: this.onCustomSaveDraft,
      onCustomSave: this.onCustomSave,
      getLoadedItemForDetailGrid: this.getLoadedItemForDetailGrid,
      customClassNameForDetailGrid: 'grid-large-content',
      notAllowConfirmLeavePage: this.state.notAllowConfirmLeavePage,
      updateFormFieldsArray: this.updateFormFieldsArray,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
      // FOR DETAIL PAGE
      isDetailsPage,
      bottomGridButtonsArray: bottomGridButtonsArray(this.state.detailData, exportData),
      fieldsLabelArray: fieldsLabelArray(this.state.detailData),
      onCustomReject: this.onCustomReject,
      onCustomApprove: this.onCustomApprove,
      onCustomClose: this.onCustomClose,
      onCustomEdit: this.onCustomEdit,
      onCustomPrint: this.onCustomPrint,
    };

    return (
      <>
        <PageHeader {...pageHeader} />
        <div className={`${classes.searchSCCover} ${classes.stockCountDiv}`}>
          <DetailForm {...listConfig} />
        </div>
      </>
    );
  }
}

StockCountForm.propTypes = {
  fieldArray: PropTypes.any,
  updateDetailFieldArray: PropTypes.any,
  updateMultipleDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.any,
  dataDetailsOnGrid: PropTypes.object,
  updateDataDetailsOnGrid: PropTypes.func,
  updateColumnsDetail: PropTypes.func,
  updateAddItemsSelections: PropTypes.func,
  updateHistoryData: PropTypes.func,
  t: PropTypes.func,
  isEditPage: PropTypes.any,
  isDetailsPage: PropTypes.any,
  itemId: PropTypes.string,
  history: PropTypes.object,
  fieldsLabelArray: PropTypes.any,
  classes: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    addItemsFieldList: state.addItemsFormStore.fieldArray,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateDetailFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_DETAIL_FIELD_ARRAY, ...data }),
  updateMultipleDetailFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY,
      detailsData: data,
    }),
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
  updateColumnsDetail: (data) =>
    dispatch({
      type: ActionType.UPDATE_COLUMNS_DETAIL,
      columnsDetail: data,
    }),
  updateAddItemsSelections: (data) =>
    dispatch({
      type: ActionType.UPDATE_ADD_ITEMS_SELECTIONS,
      addItemsSelections: data,
    }),
  updateHistoryData: (data) =>
    dispatch({ type: ActionType.UPDATE_HISTORY_DATA, history: data }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withStyles(useStyles)(StockCountForm)));
