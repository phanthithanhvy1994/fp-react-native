import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { trackPromise } from 'react-promise-tracker';
import { connect } from 'react-redux';
import { getUserInfo } from '../../../actions/auth-action';
import {
  getBranchByUser,
  getMaterialGroup,
  getMaterialList,
  getMaterialType,
  getOrderType,
  getVendorByBranch,
  savePurchaseOrder,
  getPurchaseOrder,
  getHistoryData,
  getMaxAmount,
  getStorageType,
  approvePurchaseOrder,
} from '../../../actions/purchase-order-action';
// import {
//   getMaterialList,
// } from '../../../actions/material-action';
import {
  Action,
  ActionType,
  OrderConstant,
  dateFormat,
  userBranchInfo,
} from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { formatDateString } from '../../../util/date-util';
import { convertItemDataStructure } from '../../material/material.common';
import DetailForm from '../../shared/form/detail-form/detail-form.component';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
} from '../../shared/search-form/search-form.common';
import PageHeader from '../../shared/page-header/page-header.component';
import {
  actions,
  addItemsFieldArray,
  columnsDetailBranchPO,
  columnsDetailPTO,
  getFields,
  options,
  totalSummarizeInGrid,
  validation,
  bottomGridButtonsArray,
  fieldsLabelArray,
} from './purchase-order-form.config';
import {
  openDialog,
  showErrorDialog,
  showWarningDialog
} from '../../../redux/message-dialog/message-dialog.actions';
import { openRejectDialog } from '../../../redux/reject-dialog/reject-dialog.actions';
import { printFilePDF } from '../../../util/print-util';
import './purchase-order-form.style.scss';
import useStyles from '../purchase-order-list.style';
import { API_PATHS, DOMAIN } from '../../../services/service.config';
import {
  formatDropdownList,
  mapColumnAndDataForMessageSAP,
} from '../../../util/format-util';
import { getErrorMessage, getErrorMessageCode } from '../../../util/error-util';
import { getFinalBaseUnitValue } from '../../material/material.common';

class PurchaseOrderForm extends Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    this.state = {
      actions,
      options,
      detailData: null,
      // Prevent showing popup confirm leave page
      // In case: go to edit page but not have permission to edit it
      // it will redirect to detail page without confirm leave page
      notAllowConfirmLeavePage: false,
      // update Class for 'Item' column which contains image
      // Incase it is PO STO and rowData is MRP, the border of image will change
      customRowImageClass: '',
      columnsDetail: columnsDetailBranchPO,
      fixedNotifyContents: '',
    };
    this.loggedUser = getUserInfo();
    this.informationConvert = [
      { label: OrderConstant.sku },
      { label: OrderConstant.description },
    ];
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

  /**
   * Show hide actions button, selection column, totalsummarize area,
   * change border of image on row base on Order Type selection
   */
  updateThingsRelateToOrderType = (orderType) => {
    const { isDetailsPage } = this.props;
    let updatedAction = [];
    let tempActions = [];
    let isHideSelectionColumn = false;
    let totalSummarizeInGridArea = null;
    let { customRowImageClass } = this.state;
    let columnsDetail;

    if (orderType === OrderConstant.orderTypeCode.poSTO) {
      updatedAction =
        (!isDetailsPage && [
          { name: Action.select, isHidden: true },
          { name: Action.remove, isHidden: true },
          { name: Action.load, isHidden: false },
        ]) ||
        [];
      tempActions = this.updateButtonActionState(updatedAction, isDetailsPage);
      isHideSelectionColumn = true;
      columnsDetail = columnsDetailPTO;
      totalSummarizeInGridArea = totalSummarizeInGrid(orderType);
      customRowImageClass = 'po-sto';
    } else if (orderType === OrderConstant.orderTypeCode.branchPO) {
      updatedAction =
        (!isDetailsPage && [
          { name: Action.select, isHidden: false },
          { name: Action.remove, isHidden: false },
          { name: Action.load, isHidden: true },
        ]) ||
        [];
      tempActions = this.updateButtonActionState(updatedAction, isDetailsPage);
      isHideSelectionColumn = isDetailsPage || false;
      columnsDetail = columnsDetailBranchPO;
      totalSummarizeInGridArea = totalSummarizeInGrid(orderType);
      customRowImageClass = 'branch-po';
    } else {
      // Hide all ation button
      tempActions = this.updateButtonActionState([], true);
      isHideSelectionColumn = true;
      columnsDetail = [];
      customRowImageClass = '';
    }

    this.updateMultipleDetailFieldArray([
      {
        fieldName: OrderConstant.isEmergency,
        property: 'classCustom',
        updatedData:
          !orderType || orderType === OrderConstant.orderTypeCode.branchPO
            ? 'checkbox-disabled'
            : '',
      },
      {
        fieldName: OrderConstant.isEmergency,
        property: 'disabled',
        updatedData: !orderType || orderType === OrderConstant.orderTypeCode.branchPO,
      },
      {
        fieldName: OrderConstant.isEmergency,
        property: 'value',
        updatedData: false,
      }
    ]);

    this.setState({
      actions: [...tempActions],
      options: { ...options, selection: !isHideSelectionColumn },
      totalSummarizeInGridArea,
      customRowImageClass,
      columnsDetail: columnsDetail,
      detailData: {
        ...this.state.detailData,
        orderType,
        isEmergency: false
      },
    });
  };

  confirmRemoveAllDetailsList = (orderType, oldFieldArray) => {
    openDialog({
      title: Message.CONFIRM,
      content: Message.PURCHASE_ORDER.CLEAR_ALL_DETAILS_LIST,
      disableBackdropClick: true,
      actions: [
        {
          name: this.props.t(Action.cancel),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.NEUTRAL,
          action: () => {
            // Kepp current state and current order Type
            const orderTypeIndex = oldFieldArray.findIndex(
              (el) => el.fieldName === OrderConstant.orderType
            );

            this.updateDetailFieldArray({
              fieldName: OrderConstant.orderType,
              property: 'value',
              updatedData: oldFieldArray[orderTypeIndex].value,
            });
          },
        },
        {
          name: this.props.t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            // Remove all data on grid and update others config
            // relate to order Type selection
            this.updateDataDetailsOnGrid({});
            this.props.updateAddItemsSelections([]);
            this.updateThingsRelateToOrderType(orderType);
          },
        },
      ],
    });
  };

  /**
   * Show/hide some element on grid base on ordertype data
   */
  onOrderTypeChange = (e, newFieldArray, oldFieldArray) => {
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    const orderType = e.target.value;
    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length > 0
    ) {
      this.confirmRemoveAllDetailsList(orderType, oldFieldArray);
    } else {
      this.updateThingsRelateToOrderType(orderType);
    }
  };

  /**
   * Show/hide Action button on detail grid
   * @param {Array} updateInfo
   */
  updateButtonActionState = (updateInfo = [], isHidden = false) => {
    let tempActions = this.state.actions;

    if (updateInfo.length === 0) {
      tempActions = tempActions.map((action) => ({
        ...action,
        hidden: isHidden,
      }));
    } else {
      updateInfo.forEach((updatedAction) => {
        const actionIndex = tempActions.findIndex(
          (el) => el.tooltip === updatedAction.name
        );
        tempActions[actionIndex].hidden = updatedAction.isHidden;
      });
    }
    return tempActions;
  };

  // Load order type option data for multiselect field
  loadOrderType = () =>
    new Promise((resolve) =>
      getOrderType()
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadBranchByUser = (userId) =>
    new Promise((resolve) =>
      getBranchByUser(userId)
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadVendorByBranch = (branch) =>
    new Promise((resolve) =>
      getVendorByBranch(branch)
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadMaterialType = () => {
    getMaterialType().then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      this.updateDetailAddItemsFieldArray({
        fieldName: OrderConstant.materialType,
        property: 'data',
        updatedData: formatDropdownList(res.data),
      });
    });
  };

  loadMaterialGroup = () => {
    getMaterialGroup().then((res) => {
      if (!this.isViewMounted) {
        return;
      }
      this.updateDetailAddItemsFieldArray({
        fieldName: OrderConstant.materialGroup,
        property: 'data',
        updatedData: formatDropdownList(res.data),
      });
    });
  };

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    let params = {};

    params = mapPropertyForRequestParams(
      params,
      searchFields,
      OrderConstant.searchFieldName.vendor
    );
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      OrderConstant.materialType
    );
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      OrderConstant.materialGroup
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      OrderConstant.materialCode
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      OrderConstant.materialDescription
    );

    return params;
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsData = (params) => {
    const orderTypeIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === OrderConstant.orderType
    );
    const orderTypeValue = this.fieldArray[orderTypeIndex].value;

    //Commit test code
    const branchIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === 'branchCode'
    );
    const branchValue = this.fieldArray[branchIndex].value;
    //END

    return trackPromise(
      getMaterialList({
        ...params,
        countFlag: 1,
        deleteFlag: 0,
        orderType: orderTypeValue,
        branchCode: branchValue,
        //Commit test code
        // branchCode: this.loggedUser.branch,
      }).then(
        (res) =>
          new Promise((resolve) => {
            resolve(res);
          })
      )
    );
  };

  mapDetailsInformationForSaving = (detailsInformation, orderType) => {
    if (orderType === OrderConstant.orderTypeCode.poSTO) {
      detailsInformation = detailsInformation.filter((el) => +el.quantity > 0);
    }
    return detailsInformation.map((el) => ({
      // Each rowData need id and entity to identify each record
      id: el.id,
      entity: el.entity,
      lineNumber: el.no,
      sku: el.sku,
      materialDescription: el.description,
      materialTypeName: el.materialType,
      materialGroupName: el.materialGroup,
      requestQty: el.quantity,
      amount: el.amount,
      orderUnit: el.orderUnit,
      denominator: el.denominator,
      numerator: el.numerator,
      baseUnit: el.baseUnit,
      averageUsage: el.averageUsage,
      // These information will be used later
      // min: el.min,
      // max: el.max,
      stockOnHand: el.stockOnHand,
      availableQuantity: el.availableQuantity,
      suggestedQty: getFinalBaseUnitValue(el),
      incomingQuantity: el.incomingQuantity,
      outgoingQuantity: el.outgoingQuantity,
      volume: el.volume,
      maxVolume: el.maxVolume,
      price: el.price,
      // If date string is already follow server format, no need to convert it
      deliveryDate:
        (typeof el.deliveryDate === 'string' &&
          el.deliveryDate.match(dateFormat.serverFormatRegex) &&
          el.deliveryDate) ||
        formatDateString(
          el.deliveryDate || Date.now(),
          dateFormat.savingDateTime
        ),
      taxAmount: el.taxAmount,
      tax: el.tax,
      totalAmount: el.totalAmount,
      isFree: +!!el.isFree,
      mrp: el.mrp,
    }));
  };

  mapGeneralInformationForSaving = (generalInformation) => {
    const result = {};
    generalInformation.forEach((el) => {
      switch (el.fieldName) {
        case OrderConstant.requestedDate:
          result[el.fieldName] =
            el.value &&
            formatDateString(
              typeof el.value === 'object'
                ? el.value.toLocaleDateString()
                : el.value,
              dateFormat.savingDateTime
            );
          break;
        case OrderConstant.isEmergency:
          result[el.fieldName] = +!!el.value;
          break;
        default:
          result[el.fieldName] =
            typeof el.value === 'string' ? el.value.trim() : el.value;
          break;
      }
    });
    return result;
  };

  /**
   * Set status base on savingType and orderType
   * @param {String} savingType
   * @param {Object} generalInformation
   */
  mapToAssociateStatus = (savingType, generalInformation) => {
    let status = '';
    switch (savingType) {
      case Action.saveDraft:
        status = OrderConstant.statusValue.draft;
        break;
      case Action.save:
        status =
          (generalInformation.orderType === OrderConstant.orderTypeCode.poSTO &&
            OrderConstant.statusValue.inProcess) ||
          OrderConstant.statusValue.waitingApproval;
        break;
      default:
        break;
    }
    return status;
  };

  /**
   * Check general information is valid or not
   * @param {Object} generalInformation
   */
  isValidGeneralInformation = (generalInformation) => {
    const requiredLabel = [];
    const { t } = this.props;
    // Branch, Order Type, Created Date are required
    if (!generalInformation.branchCode) {
      requiredLabel.push(t(OrderConstant.label.branch));
    }
    if (!generalInformation.orderType) {
      requiredLabel.push(t(OrderConstant.label.orderType));
    }
    if (!generalInformation.requestedDate) {
      requiredLabel.push(t(OrderConstant.label.createdDate));
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
   * Check Detail List is valid or not: quantity must be number
   * and detail list must be not empty, volume must be less than or equal to maxVolume
   * @param {Array} detailList
   */
  isValidDetailListInformation = (detailList, orderType) => {
    if (!detailList || detailList.length === 0) {
      openDialog({
        title: Message.ERROR,
        content: `${OrderConstant.label.detailsInformation} ${Message.common.comMSG001}`,
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

    let invalidQuantity = [];
    let overMaxVolume = [];
    let totalAmount = 0;
    let isEmptyDeliveryDate = [];
    let isEmptyQuantity = [];
    const errorMsg = [];

    detailList.forEach((el) => {
      if (typeof +el.quantity !== 'number' || el.quantity < 0) {
        invalidQuantity.push(el.no);
      }
      if (el.maxVolume && el.volume * (el.quantity || 0) > el.maxVolume) {
        overMaxVolume.push(el.no);
      }

      if (orderType === OrderConstant.orderTypeCode.branchPO) {
        totalAmount += +el.amount;
      }

      if (!el.deliveryDate) {
        isEmptyDeliveryDate.push(el.no);
      }

      if (!el.quantity || !+el.quantity) {
        isEmptyQuantity.push(el.no);
      }
    });

    if (
      invalidQuantity.length > 0 &&
      orderType !== OrderConstant.orderTypeCode.poSTO
    ) {
      errorMsg.push(
        `${Message.INVALID_NUMBER.replace(
          '%fieldName%',
          OrderConstant.label.quantity
        )}
        <No: ${invalidQuantity.join(', ')}>`
      );
    }
    if (overMaxVolume.length > 0) {
      errorMsg.push(
        `${Message.PURCHASE_ORDER.OVER_MAX_VOLUMN}
        <No: ${overMaxVolume.join(', ')}>`
      );
    }
    if (isEmptyQuantity.length > 0) {
      // For POSTO only show error when all quantity empty,
      // if it has at least 1 item has quantity > 0 an dothers are empty,
      // still allow save, but only save items which are having quantity
      if (
        orderType === OrderConstant.orderTypeCode.poSTO &&
        isEmptyQuantity.length === detailList.length
      ) {
        errorMsg.push(Message.PURCHASE_ORDER.QUANTITY_EMPTY);
      } else if (orderType === OrderConstant.orderTypeCode.branchPO) {
        errorMsg.push(
          `${Message.INVALID_NUMBER.replace(
            '%fieldName%',
            OrderConstant.label.quantity
          )}
          <No: ${isEmptyQuantity.join(', ')}>`
        );
      }
    }
    if (isEmptyDeliveryDate.length > 0) {
      errorMsg.push(
        `${Message.PURCHASE_ORDER.DELIVERY_DATE_EMPTY}
        <No: ${isEmptyDeliveryDate.join(', ')}>`
      );
    }

    if (this.maxAmount !== null && totalAmount > this.maxAmount) {
      errorMsg.push(
        `${Message.PURCHASE_ORDER.OVER_MAX_AMOUNT} <${this.maxAmount}>`
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

  isErrorSaving = (res) => {
    let isError = false;
    if (res.message && res.message.messages && res.message.messages.length > 0) {
      let msgContent = '';
      // get SAP err message
      const sapError = res.message.messages.filter(
        (el) => el.errorSAPRestVO
      );
      if (sapError.length > 0) {
        msgContent = mapColumnAndDataForMessageSAP(
          res.message.messages
        );
        showErrorDialog(msgContent, !!(sapError.length > 0));
        isError = true;
      } else {
        // get normal message
        msgContent = res.message.messages[0] && res.message.messages[0].messageContent;

        if (OrderConstant.message.warningCode.indexOf(getErrorMessageCode(res)) !== -1) {
          return { isWarning: true, message: msgContent };
        } else if (msgContent) {
          showErrorDialog(msgContent, !!(sapError.length > 0));
          isError = true;
        }
      }
    }
    return isError;
  };

  showSuccessfulMsg = (res, savingType, isEditPage, resolve) => {
    const draftMsg =
      (isEditPage &&
        Message.PURCHASE_ORDER.DRAFT_UPDATE_ORDER_SUCCESSFULLY) ||
      Message.PURCHASE_ORDER.DRAFT_ORDER_SUCCESSFULLY;
    const msg =
      (savingType === Action.saveDraft && draftMsg) ||
      Message.PURCHASE_ORDER.SUBMIT_ORDER_SUCCESSFULLY;

    openDialog({
      title: Message.INFORMATION,
      content: msg.replace('%poNo%', (res.data && res.data.PO_NUMBER) || '' ),
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
  }

  handleActionSave = (
    savingType,
    params,
    action,
    isEditPage,
    resolve,
    reject
  ) => {
    // Perform saving
    savePurchaseOrder(params, action)
      .then((res) => {
        if (res && res.status === '200') {
          const errorSaving = this.isErrorSaving(res);
          if (errorSaving === true) {
            reject();
            return;
          } else if (
            typeof errorSaving === 'object' &&
            errorSaving.isWarning === true
          ) {
            showWarningDialog(
              errorSaving.message,
              this.showSuccessfulMsg.bind(
                this,
                res,
                savingType,
                isEditPage,
                resolve
              )
            );
            return;
          }
          this.showSuccessfulMsg(res, savingType, isEditPage, resolve);
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
    let params = {};
    const { isEditPage } = this.props;
    const { detailData } = this.state;
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
          generalInformation.orderType
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

        params.poRequestDetailVOs = this.mapDetailsInformationForSaving(
          detailsList,
          generalInformation.orderType
        );
        params.id = this.state.detailData && this.state.detailData.id;
        params.poResquestNumber =
          this.state.detailData && this.state.detailData.poResquestNumber;
        params.poRequestHistoryVOs = historyData;

        // Change API when submitting poSTO to /submit
        let action = isEditPage ? Action.update : Action.insert;
        action =
          params.orderType === OrderConstant.orderTypeCode.poSTO &&
          savingType === Action.save
            ? Action.submit
            : action;
        if (savingType !== Action.saveDraft) {
          openDialog({
            title: Message.CONFIRM,
            content: Message.PURCHASE_ORDER.SUBMIT_CONFIRM.replace(
              '%PO_NO%',
              (detailData.poResquestNumber &&
                `: <No.${detailData.poResquestNumber}>`) ||
                ''
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
                  this.handleActionSave(
                    savingType,
                    params,
                    action,
                    isEditPage,
                    resolve,
                    reject
                  );
                },
              },
            ],
          });
        } else {
          this.handleActionSave(
            savingType,
            params,
            action,
            isEditPage,
            resolve,
            reject
          );
        }
      }
    });

    return promise;
  };

  onCustomSaveDraft = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.saveDraft);

  onCustomSave = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.save);

  loadPurchaseOrder = (id) => {
    const { isEditPage, history, isDetailsPage } = this.props;
    getPurchaseOrder({ poRequestId: id }).then((res) => {
      const detailData = res.data;
      if (!detailData) {
        this.setState({ notAllowConfirmLeavePage: true }, () => {
          history.push('/404');
        });
        return;
      }
      // Prevent edit unavailable item by redirect to detail page
      const status = detailData.status && detailData.status.toString();
      if (
        !isDetailsPage &&
        status !== OrderConstant.statusValue.draft &&
        status !== OrderConstant.statusValue.rejected
      ) {
        this.setState({ notAllowConfirmLeavePage: true }, () => {
          history.push(`/procurement/purchase-order/detail/${detailData.id}`);
        });
        return;
      }
      // Update data on form after getdata successfully
      this.setState({ detailData });
      this.updateThingsRelateToOrderType(detailData.orderType, detailData);
      this.updateDataDetailsOnGrid({
        data: convertItemDataStructure(
          detailData.poRequestDetailVOs,
          this.informationConvert,
          OrderConstant.requestQty,
          detailData
        ),
      });

      // Update data for General Information area
      const multipleUpdatedField = [
        {
          fieldName: OrderConstant.searchFieldName.branch,
          property: 'value',
          updatedData: detailData.branchCode,
        },
        {
          fieldName: OrderConstant.searchFieldName.vendor,
          property: 'value',
          updatedData: detailData.vendorCode,
        },
        {
          fieldName: OrderConstant.orderType,
          property: 'value',
          updatedData: detailData.orderType,
        },
        {
          fieldName: OrderConstant.email,
          property: 'value',
          updatedData: detailData.email,
        },
        {
          fieldName: OrderConstant.requestedDate,
          property: 'value',
          updatedData: formatDateString(
            detailData.requestedDate,
            dateFormat.yyyymmdd,
            true
          ),
        },
        {
          fieldName: OrderConstant.status,
          property: 'value',
          updatedData: detailData.statusName,
        },
        {
          fieldName: OrderConstant.note,
          property: 'value',
          updatedData: detailData.note,
        },
        {
          fieldName: OrderConstant.isEmergency,
          property: 'value',
          updatedData: detailData.isEmergency,
        },
      ];
      if (isEditPage) {
        this.updateMultipleDetailFieldArray(multipleUpdatedField);
      }
    });
  };

  loadHistoryData = (id) => {
    const params = { poRequestId: { eq: id } };
    getHistoryData(params).then((res) => {
      const data =
        (res.data &&
          res.data.map((el) => ({
            time: el.updateDate,
            note: `${el.action} ${el.document ? el.document : ''}`,
            userName: el.createdBy,
          }))) ||
        [];
      data.length > 0 && this.updateHistoryData(data);
    });
  };

  loadMaxAmountByBranch = (branchCode) => {
    return getMaxAmount({
      branchCode,
    }).then((res) => {
      if (getErrorMessage(res)) {
        showErrorDialog(getErrorMessage(res));
        return;
      }
      this.maxAmount = res.maxAmount;
    });
  };

  /**
   * Get all storage type by branch and day name
   * @param {String} branchCode 
   */
  loadStorageType = (branchCode) => {
    const today = Date.now();
    const dayOfWeekName = formatDateString(today, 'dddd');
    return getStorageType({
      branchCode,
      dayOfWeekName: dayOfWeekName && dayOfWeekName.toUpperCase()
    }).then((res) => {
      if (getErrorMessage(res)) {
        showErrorDialog(getErrorMessage(res));
        return;
      }
      this.setState({ fixedNotifyContents: res.data && res.data[0] && res.data[0].storageType });
    });
  };

  componentDidMount() {
    const { isEditPage, isDetailsPage, itemId } = this.props;

    if (!isEditPage) {
      // When init add page, order type is null
      this.updateThingsRelateToOrderType();
    }

    // Load History Data
    if (isEditPage || isDetailsPage) {
      this.loadHistoryData(itemId);
    }
    this.loadStorageType(this.loggedUser.branch);
    this.loadMaxAmountByBranch(this.loggedUser.branch);

    this.updateAllAddItemsFieldArray(addItemsFieldArray);
    if (!this.isViewMounted) {
      return;
    }
    // load all neccessary data option and update to redux store
    Promise.all([
      this.loadOrderType(),
      this.loadBranchByUser(this.loggedUser.userId),
      this.loadVendorByBranch(this.loggedUser.branch),
    ]).then((values) => {
      if (!this.isViewMounted) {
        return;
      }
      // Update Order Type, Vendor, Branch option
      this.updateMultipleDetailFieldArray([
        {
          fieldName: OrderConstant.orderType,
          property: 'data',
          updatedData: formatDropdownList(values[0].data),
        },
        {
          fieldName: OrderConstant.searchFieldName.branch,
          property: 'data',
          updatedData: formatDropdownList(values[1].data),
          defaultValue: {
            // Commit code test
            value: this.loggedUser.branch,
            isArray: false,
          },
        },
        {
          fieldName: OrderConstant.searchFieldName.vendor,
          property: 'data',
          updatedData: formatDropdownList(values[2].data),
        },
      ]);

      // Also update option data for vendor field in add items form
      this.updateDetailAddItemsFieldArray({
        fieldName: OrderConstant.searchFieldName.vendor,
        property: 'data',
        updatedData: formatDropdownList(values[2].data),
      });

      if (isEditPage || isDetailsPage) {
        this.loadPurchaseOrder(itemId);
      }
    });
    // Load option data for multiselect item in 'Add items' form
    this.loadMaterialType();
    this.loadMaterialGroup();
  }

  // Handler when clicking 'Load Items' btn
  getLoadedItemForDetailGrid = () => {
    const orderTypeIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === OrderConstant.orderType
    );
    const orderTypeValue = this.fieldArray[orderTypeIndex].value;

    //Commit test code
    const branchIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === 'branchCode'
    );
    const branchValue = this.fieldArray[branchIndex].value;
    //END
    return new Promise((resolve) => {
      getMaterialList({
        orderType: orderTypeValue,
        branchCode: branchValue,
        //Commit test code
        // branchCode: this.loggedUser.branch,
      }).then((res) => {
        let data = convertItemDataStructure(
          res.data,
          this.informationConvert,
          OrderConstant.requestQty,
          this.state.detailData
        );
        // Sort by MRP item
        data = data && data.sort((prev, cur) => +(cur.mrp === 'MRP') - +(prev.mrp === 'MRP'));
        resolve(data);
      });
    });
  };

  handleActionUpdate = (
    isApproved,
    data,
    isEmergency,
    successMsg,
    history,
    reject,
    resolve
  ) => {
    (isApproved
      ? approvePurchaseOrder({ id: this.state.detailData.id })
      : savePurchaseOrder({ ...this.state.detailData, ...data, isEmergency })
    )
      .then((res) => {
        if (
          res.message &&
          res.message.messages &&
          res.message.messages.length > 0
        ) {
          let msgContent = '';
          const sapError = res.message.messages.filter(
            (el) => el.errorSAPRestVO
          );
          if (sapError.length > 0) {
            msgContent = mapColumnAndDataForMessageSAP(res.message.messages);
          } else {
            msgContent = res.message.messages[0].messageContent;
          }
          showErrorDialog(msgContent, !!(sapError.length > 0));
          reject();
          return;
        } else {
          openDialog({
            title: Message.INFORMATION,
            content: isApproved
              ? successMsg.replace('%PO_NO%', res.data.PO_NUMBER)
              : successMsg,
            disableBackdropClick: true,
            actions: [
              {
                name: this.props.t(Action.ok),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  history.push('/procurement/purchase-order');
                },
              },
            ],
          });
          resolve();
        }
      })
      .catch((res) => {
        openDialog({
          title: Message.warning,
          content: Message.SAVE_UNSUCCESSFULLY,
          disableBackdropClick: true,
          actions: [
            {
              name: this.props.t(Action.ok),
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
        reject();
      });
  };

  updatePOData = (data, isApproved = false) => {
    const { history } = this.props;
    const { detailData } = this.state;
    let successMsg = Message.PURCHASE_ORDER.CLOSED_PO_SUCCESSFULLY;
    if (data.status === OrderConstant.statusValue.rejected) {
      successMsg = Message.PURCHASE_ORDER.REJECTED_PO_SUCCESSFULLY;
    } else if (data.status === OrderConstant.statusValue.inProcess) {
      successMsg = Message.PURCHASE_ORDER.APPROVED_PO_SUCCESSFULLY;
    }
    const isEmergency =
      (this.state.detailData && +(this.state.detailData.isEmergency || 0)) || 0;
    return new Promise((resolve, reject) => {
      if (data.status !== OrderConstant.statusValue.rejected) {
        openDialog({
          title: Message.CONFIRM,
          content: isApproved
            ? Message.PURCHASE_ORDER.APPROVE_CONFIRM.replace(
              '%PO_NO%',
              detailData.sapResquestNumber
            )
            : Message.PURCHASE_ORDER.CLOSE_CONFIRM.replace(
              '%PO_NO%',
              detailData.sapResquestNumber
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
                this.handleActionUpdate(
                  isApproved,
                  data,
                  isEmergency,
                  successMsg,
                  history,
                  reject,
                  resolve
                );
              },
            },
          ],
        });
      } else {
        this.handleActionUpdate(
          isApproved,
          data,
          isEmergency,
          successMsg,
          history,
          reject,
          resolve
        );
      }
    });
  };

  onCustomClose = () => {
    this.updatePOData({ status: OrderConstant.statusValue.closed });
  };

  onCustomApprove = () => {
    this.updatePOData({ status: OrderConstant.statusValue.inProcess }, true);
  };

  rejectPO = (reasonData) =>
    this.updatePOData({
      status: OrderConstant.statusValue.rejected,
      reason: reasonData,
    });

  onCustomReject = () => {
    openRejectDialog({
      title: Message.REJECT_TITLE,
      messageTitle: Message.REJECT_MESSAGE_TITLE,
      submitApiFn: this.rejectPO,
      disableBackdropClick: true,
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

  onCustomPrint = () => {
    const id = this.state.detailData && this.state.detailData.id;
    const url = `${DOMAIN}${API_PATHS.exportPO}?id=${id}`;
    printFilePDF(url);
  };

  onCustomEdit = () => {
    const { itemId } = this.props;
    const url = '/procurement/purchase-order/edit/';
    return url + itemId;
  };

  componentWillUnmount() {
    this.isViewMounted = false;
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

  updateDataDetailsOnGridForEachPage = (dataDetailsOnGrid) => {
    this.dataDetailsOnGrid = dataDetailsOnGrid;
  };

  /**
   * Return poSTO number if orderType is PO-STO
   * else return poNumber
   */
  getDetailNo = () => {
    const { detailData } = this.state;
    return (detailData && detailData.sapResquestNumber) || '';
  };

  updateFormFieldsArray = (newFieldArray) => {
    this.fieldArray = newFieldArray;
  };

  render() {
    // fieldArray for fields in form
    // dataDetailsOnGrid is for the details information grid
    // addItemsFieldList is for all search fields on 'Add items' form
    const {
      addItemsFieldList,
      isEditPage,
      isDetailsPage,
      history,
      classes,
    } = this.props;
    const btnActions = this.state.actions;
    const tempOptions = this.state.options;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields(
        this.state.detailData,
        this.onOrderTypeChange,
        isEditPage
      );
      this.updateAllFieldArray(this.fieldArray);
    }
    const detailNo = this.getDetailNo(this.state.detailData);
    let title = 'Create Purchase Order';
    if (isEditPage) {
      title = `Edit Purchase Order ${detailNo ? `<No. ${detailNo}>` : ''}`;
    } else if (isDetailsPage) {
      title = `View Purchase Order Details  ${
        detailNo ? `<No. ${detailNo}>` : ''
      }`;
    }

    const pageHeader = {
      pageTitle: title,
      showButton: false,
      showFixedNotify: !!this.state.fixedNotifyContents,
      fixedNotifyContents: this.state.fixedNotifyContents,
    };

    const listConfig = {
      history,
      actions: btnActions,
      options: tempOptions,
      validation,
      totalSummarizeInGrid: this.state.totalSummarizeInGridArea,
      customRowImageClass: this.state.customRowImageClass,
      addItemsFieldList,
      informationConvert: this.informationConvert,
      columnsDetail: this.state.columnsDetail || [],
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
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
      bottomGridButtonsArray: bottomGridButtonsArray(this.state.detailData),
      fieldsLabelArray: fieldsLabelArray(this.state.detailData),
      onCustomClose: this.onCustomClose,
      onCustomReject: this.onCustomReject,
      onCustomApprove: this.onCustomApprove,
      onCustomPrint: this.onCustomPrint,
      onCustomEdit: this.onCustomEdit,
    };

    return (
      <>
        <PageHeader {...pageHeader} />
        <div className={`${classes.searchPOCover} purchaseOrderCover`}>
          <DetailForm {...listConfig} />
        </div>
      </>
    );
  }
}

PurchaseOrderForm.propTypes = {
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
)(withTranslation()(withStyles(useStyles)(PurchaseOrderForm)));
