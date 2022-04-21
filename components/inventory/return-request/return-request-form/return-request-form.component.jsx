import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { trackPromise } from 'react-promise-tracker';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  updatePropertyForRequestParams,
} from '../../../shared/search-form/search-form.common';

import { getFinalBaseUnitValue } from '../../../material/material.common';
import {
  convertDataStructureForDetailGrid,
  convertItemDataStructure,
} from './return-request-form.common';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { openRejectDialog } from '../../../../redux/reject-dialog/reject-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { Message } from '../../../../constants/messages';
import { formatDateString } from '../../../../util/date-util';
import { printFilePDF } from '../../../../util/print-util';
import { API_PATHS, DOMAIN } from '../../../../services/service.config';
import {
  ReturnRequestConstant,
  OrderConstant,
  Action,
  ActionType,
  dateFormat,
  userBranchInfo,
} from '../../../../constants/constants';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import GoodsReceiptList from '../../goods-receipt/list/goods-receipt-list.component';
import {
  getFields,
  getFieldsTextOnly,
  validation,
  columnsDetailsConfig,
  options,
  bottomGridButtons,
  actions,
  totalSummarizeInGrid,
  columnsForVendor,
  columnsForFactory,
  addItemsFieldArray,
  isShowScanTimeLine,
  scanningTimeLineDataSample,
} from './return-request-form.config';

import {
  getReturnRequestDetailsById,
  confirmReturnRequest,
  closeReturnRequest,
  rejectReturnRequest,
  approveReturnRequest,
  getOrderType,
  getMaterialList,
  saveReturnRequest,
  getReason,
  getBranchByLoggedUser,
  getVendorByBranch,
  getReturnRequestDetailsByGoodsReceiptNo,
  getHistoryData,
  uploadReturnRequestImages,
} from '../../../../actions/return-request-action';

import {
  getMaterialGroup,
  getMaterialType,
} from '../../../../actions/purchase-order-action';
import { getUserInfo } from '../../../../actions/auth-action';
import './return-request-form.style.scss';
import {
  formatComboBox,
  formatDropdownList,
  mapColumnAndDataForMessageSAP,
} from '../../../../util/format-util';

class ReturnRequestForm extends Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    this.state = {
      actions: actions(this.beforeLoadItemHandler),
      options,
      fieldsLabelArray: [],
      bottomGridButtonsArray: [],
      columnsForDetailsPage: [],
      scanningTimeLineData: [],
      configItemDataOnGrid: [],
      customRowImageClass: '',
      requestNumber: null,
      columnsDetail: [],
      initialImages: [],
      validate: validation(),
      reasonRequiresComplaintNo: [],
    };
    this.loggedUser = getUserInfo();
    this.informationConvert = [
      { label: ReturnRequestConstant.sku },
      { label: ReturnRequestConstant.description },
      { label: ReturnRequestConstant.orderUnit, color: 'secondary' },
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
    this.updateOpenStateSearchPopup = props.updateOpenStateSearchPopup;
    this.updateHistoryData = props.updateHistoryData;

    this.fieldArray = [];
    this.dataDetailsOnGrid = null;
    this.selectedRowOnGrid = [];
    this.lastUpdatedSelectedRows = [];

    // Note: orderType is used for "Return To" field
  }

  beforeLoadItemHandler = () => {
    let isStopLoading = false;
    if (this.fieldArray) {
      const goodsReceiptNoField = this.fieldArray.find(
        (x) => x.fieldName === ReturnRequestConstant.goodReceiptNo
      );
      const goodsReceiptVal = goodsReceiptNoField.value;
      // Check goodsReceiptNo has value or no
      if (!goodsReceiptVal) {
        isStopLoading = true;
        // Show warning if goodsReceiptNo has no input value
        openDialog({
          title: Message.ERROR,
          content: Message.RETURN_REQUEST.PLEASE_INPUT_GOODS_RECEIPT_NO,
          type: dialogConstant.type.ERROR,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
      }
    }
    return isStopLoading;
  };

  /**
   * Update state of fields relate to Order Type
   */
  updateFieldStateByOrderType = (selectedValue) => {
    // Set new value for Order type
    this.fieldArray.forEach((field) => {
      const { fieldName } = field;
      if (fieldName === ReturnRequestConstant.orderType) {
        field.value = selectedValue;
      }
    });

    if (
      selectedValue === ReturnRequestConstant.orderTypeCode.returnToFactory ||
      selectedValue ===
        ReturnRequestConstant.orderTypeCode.returnToFactoryDisplay
    ) {
      this.fieldArray.forEach((field) => {
        const { fieldName } = field;
        if (fieldName === ReturnRequestConstant.goodReceiptNo) {
          field.disabled = true;
          field.value = null;
          field.required = false;
        }

        if (fieldName === ReturnRequestConstant.creditNote) {
          field.disabled = true;
          field.value = null;
          field.required = false;
        }

        if (fieldName === ReturnRequestConstant.vendor) {
          field.disabled = true;
          field.value = null;
          field.required = false;
        }
      });
    } else if (
      selectedValue === ReturnRequestConstant.orderTypeCode.returnToVendor ||
      selectedValue ===
        ReturnRequestConstant.orderTypeCode.returnToVendorDisplay
    ) {
      this.fieldArray.forEach((field) => {
        const { fieldName } = field;
        if (fieldName === ReturnRequestConstant.goodReceiptNo) {
          field.disabled = false;
          field.required = true;
        }

        if (fieldName === ReturnRequestConstant.creditNote) {
          field.disabled = false;
          field.required = true;
        }
      });
    }

    this.updateAllFieldArray(this.fieldArray);
  };

  /**
   * Show/hide some element on grid base on ordertype data
   */
  updateThingsRelateToOrderType = (selectedValue) => {
    let updatedAction = [];
    let tempActions = [];
    let isHideSelectionColumn = false;
    let columnsDetail;

    if (
      selectedValue === ReturnRequestConstant.orderTypeCode.returnToFactory ||
      selectedValue ===
        ReturnRequestConstant.orderTypeCode.returnToFactoryDisplay
    ) {
      updatedAction = [
        { name: Action.select, isHidden: false },
        { name: Action.remove, isHidden: false },
        { name: Action.load, isHidden: true },
      ];
      this.updateFieldStateByOrderType(selectedValue);
      tempActions = this.updateButtonActionState(updatedAction);
      columnsDetail = columnsForFactory;
      this.setState({
        validate: validation(false /*isReturnToVendorType*/),
      });
    } else if (
      selectedValue === ReturnRequestConstant.orderTypeCode.returnToVendor ||
      selectedValue ===
        ReturnRequestConstant.orderTypeCode.returnToVendorDisplay
    ) {
      updatedAction = [
        { name: Action.select, isHidden: true },
        { name: Action.remove, isHidden: true },
        { name: Action.load, isHidden: false },
      ];
      this.updateFieldStateByOrderType(selectedValue);
      tempActions = this.updateButtonActionState(updatedAction);
      columnsDetail = columnsForVendor;
      this.setState({
        validate: validation(true /*isReturnToVendorType*/),
      });
    } else {
      // Hide all action button
      tempActions = this.updateButtonActionState([], true);
      isHideSelectionColumn = true;
      columnsDetail = [];
    }

    this.setState({
      actions: [...tempActions],
      options: { ...options, selection: !isHideSelectionColumn },
      columnsDetail,
    });
  };

  confirmRemoveAllDetailsList = (orderType, oldFieldArray) => {
    openDialog({
      title: Message.warning,
      type: dialogConstant.type.WARNING,
      content:
        Message.RETURN_REQUEST.CLEAR_ALL_DETAILS_LIST_WHEN_CHANGE_RETURN_TO,
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
            this.updateDataDetailsOnGrid(null);
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
      this.updateThingsRelateToOrderType(orderType, newFieldArray);
    }
  };

  confirmChangeGoodReceiptNo = (
    goodsReceiptNo,
    oldFieldArray,
    isSelectGoodsReceiptNo = false,
    selectedRowData
  ) => {
    openDialog({
      title: Message.CONFIRM,
      type: dialogConstant.type.CONFIRM,
      content: Message.RETURN_REQUEST.CONFIRM_CHANGE_GOODS_RECEIPT_NO,
      disableBackdropClick: true,
      actions: [
        {
          name: this.props.t(Action.cancel),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.NEUTRAL,
          action: () => {
            // Keep current state and current order Type
            const goodsReceiptIndex = oldFieldArray.findIndex(
              (el) => el.fieldName === ReturnRequestConstant.goodReceiptNo
            );

            this.updateDetailFieldArray({
              fieldName: ReturnRequestConstant.goodReceiptNo,
              property: 'value',
              updatedData: oldFieldArray[goodsReceiptIndex].value,
            });

            if (isSelectGoodsReceiptNo) {
              this.updateOpenStateSearchPopup(false);
            }
          },
        },
        {
          name: this.props.t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            // Remove all data on grid and update others config
            this.updateDataDetailsOnGrid(null);
            this.props.updateAddItemsSelections([]);
            if (isSelectGoodsReceiptNo && selectedRowData) {
              this.updateDetailFieldArray({
                fieldName: ReturnRequestConstant.goodReceiptNo,
                property: 'value',
                updatedData: selectedRowData.receiptNumber,
              });
              this.updateDetailFieldArray({
                fieldName: ReturnRequestConstant.vendor,
                property: 'value',
                updatedData: selectedRowData.vendorCode,
              });
              this.updateOpenStateSearchPopup(false);
            }
          },
        },
      ],
    });
  };

  onGoodsReceiptNoChange = (e, newFieldArray, oldFieldArray) => {
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    const goodsReceiptNo = e.target.value;

    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length > 0
    ) {
      this.confirmChangeGoodReceiptNo(goodsReceiptNo, oldFieldArray);
    }
  };

  onInputSearchIconClick = () => {
    this.updateOpenStateSearchPopup(true);
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

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    let params = {};

    params = mapPropertyForRequestParams(
      params,
      searchFields,
      ReturnRequestConstant.materialType
    );
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      ReturnRequestConstant.materialGroup
    );
    params = updatePropertyForRequestParams(
      params,
      searchFields,
      ReturnRequestConstant.materialCode,
      ReturnRequestConstant.sku
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      ReturnRequestConstant.materialDescription
    );

    return params;
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsData = (params) =>
    trackPromise(
      getMaterialList(params).then(
        (res) =>
          new Promise((resolve) => {
            resolve(res);
          })
      )
    );

  isHasReturnQuantity = (orderQty = 0, baseQty = 0, orderUnit, baseUom) => {
    let isHasReturnQty = true;
    const isEqualOrderUnitAndBaseUnit = orderUnit === baseUom;

    const isHasNoOrderQty = Number(orderQty) === 0;

    const isHasNoBaseQty = Number(baseQty) === 0;

    if (isEqualOrderUnitAndBaseUnit) {
      if (isHasNoOrderQty) {
        isHasReturnQty = false;
      }
    } else {
      if (isHasNoOrderQty && isHasNoBaseQty) {
        isHasReturnQty = false;
      }
    }

    return isHasReturnQty;
  };

  getLastUpdatedSelectedRows = (oldSelectedRows, allRowOnGrid) => {
    let newSelectedRowsArr = [];
    oldSelectedRows.forEach((row) => {
      const newRow = allRowOnGrid.find((el) => el.no === row.no);
      if (!_.isEmpty(allRowOnGrid)) {
        newSelectedRowsArr.push(newRow);
      }
    });

    if (newSelectedRowsArr.length === 0) {
      this.lastUpdatedSelectedRows = oldSelectedRows;
      return oldSelectedRows;
    }

    this.lastUpdatedSelectedRows = newSelectedRowsArr;
    return newSelectedRowsArr;
  };

  /**
   * Check Detail List is valid or not: quantity must be number
   * and detail list must be not empty, volume must be less than or equal to maxVolume
   * @param {Array} detailList
   */
  isValidDetailListInformation = (detailList, orderType) => {
    if (!detailList || detailList.length === 0) {
      openDialog({
        title: Message.warning,
        type: dialogConstant.type.WARNING,
        content: `${ReturnRequestConstant.label.detailsInformation} ${Message.common.comMSG001}`,
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
    let isInvalidQuantity = [];
    let isMissedBatchNo = [];
    let isMissedReason = [];
    let isMissedComplaintNo = [];
    const { reasonRequiresComplaintNo } = this.state;

    const lastUpdatedSelectedRows = this.getLastUpdatedSelectedRows(
      this.selectedRowOnGrid,
      detailList
    );

    if (
      orderType === ReturnRequestConstant.orderTypeCode.returnToVendor ||
      orderType === ReturnRequestConstant.orderTypeCode.returnToVendorDisplay
    ) {
      if (this.selectedRowOnGrid.length === 0) {
        openDialog({
          title: Message.ERROR,
          type: dialogConstant.type.ERROR,
          content: `${Message.RETURN_REQUEST.SELECT_AT_LEAST_ONE_RETURN}`,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
        return false;
      } else {
        lastUpdatedSelectedRows.forEach((el) => {
          if (
            !this.isHasReturnQuantity(
              el.quantity,
              el.returnQtyBu,
              el.orderUnit,
              el.baseUom
            )
          ) {
            isInvalidQuantity.push(el.no);
          }
          if (!el.reasonCode) {
            isMissedReason.push(el.no);
          }
          if (
            reasonRequiresComplaintNo.includes(el.reasonCode) &&
            !el.complaintNo
          ) {
            isMissedComplaintNo.push(el.no);
          }
        });
      }
    } else {
      detailList.forEach((el) => {
        if (
          !this.isHasReturnQuantity(
            el.quantity,
            el.returnQtyBu,
            el.orderUnit,
            el.baseUom
          )
        ) {
          isInvalidQuantity.push(el.no);
        }
        if (el.batch && !el.batchNo) {
          isMissedBatchNo.push(el.no);
        }
        if (!el.reasonCode) {
          isMissedReason.push(el.no);
        }
        if (
          reasonRequiresComplaintNo.includes(el.reasonCode) &&
          !el.complaintNo
        ) {
          isMissedComplaintNo.push(el.no);
        }
      });
    }

    if (isInvalidQuantity.length > 0) {
      errorMsg.push(
        `${ReturnRequestConstant.label.returnQty} ${Message.common['comMSG001']}
        <No: ${isInvalidQuantity.join(', ')}>`
      );
    }
    if (isMissedReason.length > 0) {
      errorMsg.push(
        `${ReturnRequestConstant.label.reason} ${Message.common['comMSG001']}
        <No: ${isMissedReason.join(', ')}>`
      );
    }

    if (isMissedComplaintNo.length > 0) {
      errorMsg.push(
        `${ReturnRequestConstant.label.complaintNo} ${
          Message.common['comMSG001']
        }
        <No: ${isMissedComplaintNo.join(', ')}>`
      );
    }

    if (isMissedBatchNo.length > 0) {
      errorMsg.push(
        `${ReturnRequestConstant.label.batchNo} ${
          Message.common['comMSG001']
        } <No: ${isMissedBatchNo.join(', ')}>`
      );
    }

    if (errorMsg.length > 0) {
      openDialog({
        title: Message.ERROR,
        type: dialogConstant.type.ERROR,
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
   * handler for get the image ids is removed
   * @param {Array} generalInformation
   */
  getDeletedImageIds = (dataDetailOnGrid) => {
    let attachedImagesArray = [];
    let deletedImages = [];
    let deletedImageIds = [];
    const { initialImages } = this.state;

    const detailListInformation = dataDetailOnGrid && dataDetailOnGrid.data;
    if (detailListInformation && detailListInformation.length > 0) {
      detailListInformation.forEach((item) => {
        if (item.attachedImages && item.attachedImages.length) {
          item.attachedImages.forEach((img) => {
            attachedImagesArray.push(img);
          });
        }
      });
    }

    // get images is removed from initialImages
    deletedImages = _.differenceBy(initialImages, attachedImagesArray, 'id');
    if (deletedImages && deletedImages.length) {
      deletedImages.forEach((item) => {
        deletedImageIds.push({ id: item.id });
      });
    }

    return deletedImageIds;
  };

  getAttachedImageForSaving = (dataDetailOnGrid) => {
    let attachedImagesArray = [];
    const detailListInformation = dataDetailOnGrid && dataDetailOnGrid.data;
    if (detailListInformation && detailListInformation.length > 0) {
      detailListInformation.forEach((item) => {
        if (item.attachedImages && item.attachedImages.length) {
          item.attachedImages.forEach((img) => {
            attachedImagesArray.push(img);
          });
        }
      });
    }

    let orderImageIndex = 1;
    attachedImagesArray.map((file) => {
      if (!file.isAttached) {
        orderImageIndex = orderImageIndex + 1;
        const fileExtension = file.name.split('.')[1];
        const newFileNameBaseOnItemId = `item_${file.itemId}_${orderImageIndex}.${fileExtension}`;
        file.newFileName = newFileNameBaseOnItemId;
      }
      return file;
    });

    return attachedImagesArray;
  };

  handleActionSave = (
    hasNewAttachedFile,
    imagesFilesArray,
    isEditPage,
    savingType,
    saveParams,
    initialImageIds,
    deletedImageIds,
    initialImages,
    resolve,
    reject
  ) => {
    if (hasNewAttachedFile) {
      const formFileData = new FormData();
      imagesFilesArray.forEach((file) => {
        if (!file.isAttached) {
          formFileData.append('file', file, file.newFileName);
        }
      });

      uploadReturnRequestImages(formFileData)
        .then((uploadImagesRes) => {
          if (uploadImagesRes.data.length) {
            const insertedImageIds = uploadImagesRes.data.map((item) => ({
              id: item.id,
            }));

            if (insertedImageIds && insertedImageIds.length) {
              if (isEditPage && savingType === Action.saveDraft) {
                saveParams.returnRequestVO.images = _.differenceBy(
                  [...initialImageIds, ...insertedImageIds],
                  deletedImageIds,
                  'id'
                );
              } else {
                saveParams.images = _.differenceBy(
                  [...initialImageIds, ...insertedImageIds],
                  deletedImageIds,
                  'id'
                );
              }
            }

            // Perform saving
            saveReturnRequest(
              saveParams,
              isEditPage ? Action.update : Action.insert,
              savingType
            )
              .then((res) => {
                // Show response message from system with status 400
                if (res && res.message) {
                  this.showMessageContentFromSystem(res);
                  reject();
                }

                if (res && res.data) {
                  const requestNumber = res.data.requestNumber;
                  let msg = '';

                  if (isEditPage) {
                    msg =
                      (savingType === Action.saveDraft &&
                        Message.RETURN_REQUEST
                          .DRAFT_RETURN_SAVED_SUCCESSFULLY) ||
                      Message.RETURN_REQUEST.SUBMIT_RETURN_SUCCESSFULLY;
                  } else {
                    msg =
                      (savingType === Action.saveDraft &&
                        Message.RETURN_REQUEST.DRAFT_RETURN_SUCCESSFULLY) ||
                      Message.RETURN_REQUEST.SUBMIT_RETURN_SUCCESSFULLY;
                  }

                  openDialog({
                    title: Message.INFORMATION,
                    type: dialogConstant.type.INFORMATION,
                    content: msg.replace('%rrNo%', requestNumber),
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
        })
        .catch((uploadImagesRes) => {
          this.showSystemErrorDialog(uploadImagesRes);
          reject();
        });
    } else {
      // Perform saving
      // handle for delete images
      if (deletedImageIds.length) {
        const newImagesArray = _.differenceBy(
          initialImages,
          deletedImageIds,
          'id'
        );

        if (isEditPage && savingType === Action.saveDraft) {
          saveParams.returnRequestVO.images = newImagesArray;
        } else {
          saveParams.images = newImagesArray;
        }
      }
      saveReturnRequest(
        saveParams,
        isEditPage ? Action.update : Action.insert,
        savingType
      )
        .then((res) => {
          // Show response message from system with status 400
          if (res && res.message) {
            this.showMessageContentFromSystem(res);
            reject();
          }

          if (res && res.data) {
            const requestNumber = res.data.requestNumber;
            let msg = '';

            if (isEditPage) {
              msg =
                (savingType === Action.saveDraft &&
                  Message.RETURN_REQUEST.DRAFT_RETURN_SAVED_SUCCESSFULLY) ||
                Message.RETURN_REQUEST.SUBMIT_RETURN_SUCCESSFULLY;
            } else {
              msg =
                (savingType === Action.saveDraft &&
                  Message.RETURN_REQUEST.DRAFT_RETURN_SUCCESSFULLY) ||
                Message.RETURN_REQUEST.SUBMIT_RETURN_SUCCESSFULLY;
            }

            openDialog({
              title: Message.INFORMATION,
              type: dialogConstant.type.INFORMATION,
              content: msg.replace('%rrNo%', requestNumber),
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
  };
  /**
   * handler for saving draft or saving normal
   * @param {Array} fieldArray
   * @param {Object} dataDetailsOnGrid
   * @param {String} savingType
   */
  onSave = (fieldArray, dataDetailsOnGrid, historyData, savingType) => {
    let params = {};
    let saveParams = {};
    const { initialImages, requestNumber } = this.state;
    const { isEditPage, returnRequestId } = this.props;

    const initialImageIds = initialImages.map((item) => ({ id: item.id }));

    const deletedImageIds = this.getDeletedImageIds(dataDetailsOnGrid);
    const attachedImagesForSaving = this.getAttachedImageForSaving(
      dataDetailsOnGrid
    );

    const promise = new Promise((resolve, reject) => {
      const generalInformation = this.mapGeneralInformationForSaving(
        fieldArray
      );

      // Get all data on detail grid
      // Dont allow empty detail list
      const detailsList = dataDetailsOnGrid && dataDetailsOnGrid.data;
      if (
        !this.isValidDetailListInformation(
          detailsList,
          generalInformation.orderType
        )
      ) {
        reject();
      } else {
        // Update status for edit
        if (isEditPage) {
          params = {
            ...params,
            ...generalInformation,
            returnRequestId: Number(returnRequestId),
          };
        } else {
          params = { ...params, ...generalInformation };
        }

        if (
          generalInformation.orderType ===
            ReturnRequestConstant.orderTypeCode.returnToVendor ||
          generalInformation.orderType ===
            ReturnRequestConstant.orderTypeCode.returnToVendorDisplay
        ) {
          params.returnRequestDetailTbls = this.mapDetailsInformationForSaving(
            this.lastUpdatedSelectedRows
          );
        } else {
          params.returnRequestDetailTbls = this.mapDetailsInformationForSaving(
            detailsList
          );
        }

        params.historyVOs = historyData;

        if (isEditPage && savingType === Action.saveDraft) {
          saveParams = {
            returnRequestVO: params,
          };
        } else {
          saveParams = params;
        }

        // Handle for saving uploaded images
        let imagesFilesArray = [];
        imagesFilesArray = attachedImagesForSaving;

        const hasNewAttachedFile =
          imagesFilesArray.length &&
          !!imagesFilesArray.filter((item) => !item.isAttached).length;
        let msgConfirm = Message.RETURN_REQUEST.SUBMIT_CONFIRM.replace(
          '%rrNo%',
          (requestNumber && `: No.${requestNumber}`) || ''
        );
        if (savingType === Action.save) {
          openDialog({
            title: Message.CONFIRM,
            content: msgConfirm,
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
                    hasNewAttachedFile,
                    imagesFilesArray,
                    isEditPage,
                    savingType,
                    saveParams,
                    initialImageIds,
                    deletedImageIds,
                    initialImages,
                    resolve,
                    reject
                  );
                },
              },
            ],
          });
        } else {
          this.handleActionSave(
            hasNewAttachedFile,
            imagesFilesArray,
            isEditPage,
            savingType,
            saveParams,
            initialImageIds,
            deletedImageIds,
            initialImages,
            resolve,
            reject
          );
        }
      }
    });

    return promise;
  };

  mapGeneralInformationForSaving = (generalInformation) => {
    const result = {};
    let branchCode = '1000';
    let vendorCode = '';
    generalInformation.forEach((el) => {
      if (el.fieldName === ReturnRequestConstant.branch) {
        branchCode = el.value;
      }
      if (el.fieldName === ReturnRequestConstant.vendor) {
        vendorCode = el.value;
      }
      result[el.fieldName] = el.value;
      // remove createdDate when insert/update
      if (el.fieldName === ReturnRequestConstant.createdDate) {
        result[el.fieldName] = undefined;
      }
      // temp data for test
      result.branchCode = branchCode;
      result.branch = undefined;
      result.vendorCode = vendorCode;
      result.vendor = undefined;
      result.status = undefined;
    });

    return result;
  };

  mapDetailsInformationForSaving = (detailsInformation) =>
    detailsInformation.map((el) => ({
      returnRequestDetailId: el.returnRequestDetailId,
      batchNo: el.batchNo,
      uom: el.baseUom,
      sku: el.sku,
      reasonCode: el.reasonCode,
      complaintNo: el.complaintNo,
      note: el.note,
      quantity: el.quantity || '0',
      returnQtyBu: el.returnQtyBu || '0',
      baseUnit: getFinalBaseUnitValue(el),
      entity: el.entity,
    }));

  // Save Draft
  onCustomSaveDraft = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.saveDraft);

  // Submit
  onCustomSave = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.save);

  backToReturnRequestList = () => {
    const { history } = this.props;
    // Go to Return Request list after approved successfully
    history.push('/inventory/return-request');
  };

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

  onCustomClose = () => {
    const { returnRequestId } = this.props;
    const { requestNumber } = this.state;
    openDialog({
      title: Message.CLOSE_STATUS_CONFIRM_TITLE,
      type: dialogConstant.type.CONFIRM,
      content: Message.CLOSE_STATUS_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `Return Request: ${requestNumber}`
      ),
      actions: [
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: this.props.t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            closeReturnRequest(returnRequestId)
              .then((res) => {
                if (res) {
                  const msg = Message.RETURN_REQUEST.CLOSE_RETURN_SUCCESSFULLY;
                  openDialog({
                    title: Message.INFORMATION,
                    type: dialogConstant.type.INFORMATION,
                    content: msg.replace('%rrNo%', requestNumber),
                    actions: [
                      {
                        name: 'OK',
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                      },
                    ],
                  });
                  this.backToReturnRequestList();
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

  onCustomPrint = () => {
    const { returnRequestId } = this.props;
    if (returnRequestId) {
      const url = `${DOMAIN}${API_PATHS.printReturnRequest}?id=${returnRequestId}`;
      printFilePDF(url);
    }
  };

  afterSubmitReject = (res) => {
    const { requestNumber } = this.state;
    const msg = Message.RETURN_REQUEST.REJECTED_RETURN_SUCCESSFULLY;
    if (res) {
      openDialog({
        title: Message.INFORMATION,
        type: dialogConstant.type.INFORMATION,
        content: msg.replace('%rrNo%', requestNumber),
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });

      this.backToReturnRequestList();
    }
  };

  handelRejectReturnRequest = (reasonData) => {
    const { returnRequestId } = this.props;
    const bodyParams = {
      returnRequestId: returnRequestId,
      rejectedReason: reasonData,
    };

    return new Promise((resolve) => {
      rejectReturnRequest(bodyParams).then((res) => {
        resolve(res);
      });
    });
  };

  onCustomReject = () => {
    openRejectDialog({
      title: Message.REJECT_TITLE,
      messageTitle: Message.REJECT_MESSAGE_TITLE,
      submitApiFn: this.handelRejectReturnRequest,
      afterSubmitFn: this.afterSubmitReject,
      actions: [
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: this.props.t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  onCustomApprove = () => {
    const { returnRequestId } = this.props;
    const { requestNumber } = this.state;
    openDialog({
      title: Message.CONFIRM,
      content: Message.RETURN_REQUEST.APPROVE_CONFIRM.replace(
        '%rrNo%',
        requestNumber
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
            approveReturnRequest(returnRequestId).then((res) => {
              if (!res.data && res.message) {
                const msgContent = mapColumnAndDataForMessageSAP(
                  res.message.messages
                );

                // Display message from SAP
                openDialog({
                  title: Message.ERROR,
                  type: dialogConstant.type.ERROR,
                  isTableLayout: true,
                  content: msgContent,
                  actions: [
                    {
                      name: 'OK',
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                    },
                  ],
                });
              } else if (res.data) {
                const msg = Message.RETURN_REQUEST.APPROVED_RETURN_SUCCESSFULLY;
                openDialog({
                  title: Message.INFORMATION,
                  type: dialogConstant.type.INFORMATION,
                  content: msg.replace('%rrNo%', requestNumber),
                  actions: [
                    {
                      name: 'OK',
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                    },
                  ],
                });

                this.backToReturnRequestList();
              }
            });
          },
        },
      ],
    });
  };

  onCustomEdit = () => {
    const { returnRequestId } = this.props;
    const url = '/inventory/return-request/edit/';
    return url + returnRequestId;
  };

  onCustomConfirmPickUp = () => {
    const { returnRequestId } = this.props;
    const { requestNumber } = this.state;
    openDialog({
      title: Message.CONFIRM,
      content: Message.RETURN_REQUEST.PICKUP_CONFIRM.replace(
        '%rrNo%',
        requestNumber
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
            confirmReturnRequest(returnRequestId).then((res) => {
              if (!res.data && res.message) {
                const msgContent = res.message.messages;

                openDialog({
                  title: Message.ERROR,
                  type: dialogConstant.type.ERROR,
                  isTableLayout: true,
                  content: msgContent,
                  actions: [
                    {
                      name: 'OK',
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                    },
                  ],
                });
              } else if (res.data) {
                openDialog({
                  title: Message.INFORMATION,
                  type: dialogConstant.type.INFORMATION,
                  content: Message.RETURN_REQUEST.CONFIRM_PICK_UP_SUCCESSFULLY,
                  actions: [
                    {
                      name: 'OK',
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                      action: () => {
                        this.backToReturnRequestList();
                      },
                    },
                  ],
                });
              }
            });
          },
        },
      ],
    });
  };

  getScanningTimeLine = (res) => {
    let scanningData = [];

    if (res && res.scanningTimeLine) {
      scanningData = res.scanningTimeLine;
    } else {
      // temp data for test
      scanningData = scanningTimeLineDataSample;
    }
    return scanningData;
  };

  updateDataForFieldsArray = (detailData) => {
    let savedImgArray = [];

    // update config for Attached Images field
    if (detailData.images) {
      savedImgArray = detailData.images.map((img) => ({
        id: img.id,
        preview: img.urlPath || '',
        isAttached: true,
      }));

      this.setState({
        initialImages: savedImgArray,
      });
    }

    this.updateMultipleDetailFieldArray([
      {
        fieldName: ReturnRequestConstant.branch,
        property: 'value',
        updatedData: detailData.branchCode,
      },
      {
        fieldName: ReturnRequestConstant.vendor,
        property: 'value',
        updatedData: detailData.vendorCode,
      },
      {
        fieldName: ReturnRequestConstant.orderType,
        property: 'value',
        updatedData: detailData.orderType,
      },
      {
        fieldName: ReturnRequestConstant.createdDate,
        property: 'value',
        updatedData: new Date(
          formatDateString(
            detailData.createdDate,
            dateFormat.yyyymmddHHmmss,
            true
          )
        ),
      },
      {
        fieldName: ReturnRequestConstant.status,
        property: 'value',
        updatedData: detailData.statusName,
      },
      {
        fieldName: ReturnRequestConstant.note,
        property: 'value',
        updatedData: detailData.note,
      },
      {
        fieldName: ReturnRequestConstant.creditNote,
        property: 'value',
        updatedData: detailData.creditNote,
      },
      {
        fieldName: ReturnRequestConstant.goodReceiptNo,
        property: 'value',
        updatedData: detailData.goodReceiptNo,
      },
    ]);
  };

  getDataWithAttachedImagesInLineItems = (res) => {
    let savedImgArray = [];
    let returnRequestDetailTbls = res.returnRequestDetailTbls || [];

    // update config for Attached Images field
    if (res.images && res.images.length) {
      savedImgArray = res.images.map((img) => ({
        id: img.id,
        preview: img.urlPath || '',
        isAttached: true,
      }));
    }

    if (returnRequestDetailTbls && returnRequestDetailTbls.length) {
      returnRequestDetailTbls.forEach((item) => {
        item.attachedImages = savedImgArray.filter(
          (el) => el.preview.split('item_')[1].split('_')[0] === item.sku
        );
      });
    }

    return returnRequestDetailTbls;
  };

  loadReturnRequestDataById = (returnRequestId) => {
    getReturnRequestDetailsById({ id: returnRequestId }).then((res) => {
      const { isDetailsPage, isEditPage, getReturnRequestNo } = this.props;

      if (res) {
        getReturnRequestNo && getReturnRequestNo(res.requestNumber);
        this.setState({
          requestNumber: res.requestNumber,
        });

        if (isEditPage) {
          this.updateDataForFieldsArray(res);
          this.updateThingsRelateToOrderType(res.orderType);
          const dataWithAttachedImagesInLineItems = this.getDataWithAttachedImagesInLineItems(
            res
          );
          this.updateDataDetailsOnGrid({
            data: convertDataStructureForDetailGrid(
              dataWithAttachedImagesInLineItems
            ),
          });
        }
        if (isDetailsPage) {
          const dataWithAttachedImagesInLineItems = this.getDataWithAttachedImagesInLineItems(
            res
          );
          this.updateDataDetailsOnGrid({
            data: convertDataStructureForDetailGrid(
              dataWithAttachedImagesInLineItems
            ),
          });

          // get scanning time data on Details page
          const scanningTimeLineData = this.getScanningTimeLine(res);

          // Load data for general infomation form at Details page
          const fieldsLabel = [...getFieldsTextOnly()];
          fieldsLabel.forEach((item) => {
            const field = item;
            const { fieldName } = field;
            field.value = res[fieldName] || '';

            // convert createdDate with format
            if (fieldName === ReturnRequestConstant.createdDate) {
              field.value = formatDateString(res[fieldName], null, true);
            }
          });

          // hidden or display bottom grid buttons base on status of Return Request
          const bottomButtons = [...bottomGridButtons];
          const { status, orderType } = res;
          bottomButtons.forEach((item) => {
            const button = item;
            const { displayByStatus,  displayByOrderType} = button;

            //Check displayByStatus
            let displayStatus =
              displayByStatus &&
              displayByStatus.length &&
              displayByStatus.indexOf(status) !== -1;

            //Check displayByOrderType
            let displayOrderType =
              displayByOrderType &&
              displayByOrderType.length &&
              displayByOrderType.indexOf(+orderType) !== -1;

            button.hidden = !(displayStatus && displayOrderType);
          });

          const newColumnsDetails = this.updateColumnsOnDetailsByOrderType(
            orderType
          );

          // Update state to hide Action buttons on grid at Details page
          const tempActions = this.updateButtonActionState([], true);

          this.setState({
            fieldsLabelArray: fieldsLabel,
            columnsForDetailsPage: newColumnsDetails,
            bottomGridButtonsArray: bottomButtons,
            actions: [...tempActions],
            scanningTimeLineData,
          });
        }
      }
    });
  };

  updateColumnsOnDetailsByOrderType = (orderTypeValue) => {
    const columnsForDetailsPage = [...columnsDetailsConfig];
    let columns = [];

    if (
      orderTypeValue ===
        ReturnRequestConstant.orderTypeCode.returnToFactoryDisplay ||
      orderTypeValue === ReturnRequestConstant.orderTypeCode.returnToFactory
    ) {
      columns = columnsForDetailsPage.filter(
        (item) => item.field !== 'actualQty'
      );
    } else {
      columns = columnsForDetailsPage.filter(
        (item) => item.field !== 'batchNo'
      );
    }

    return columns;
  };

  // Handler when clicking 'Load Items' btn
  getLoadedItemForDetailGrid = () => {
    const goodReceiptIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === ReturnRequestConstant.goodReceiptNo
    );

    return new Promise((resolve) => {
      getReturnRequestDetailsByGoodsReceiptNo(
        this.fieldArray[goodReceiptIndex].value
      ).then((res) => {
        if (res.data && res.data.length === 0) {
          openDialog({
            title: Message.ERROR,
            content: Message.RETURN_REQUEST.NOT_FOUND_GOODS_RECEIPT_NO.replace(
              '%grNo%',
              this.fieldArray[goodReceiptIndex].value
            ),
            type: dialogConstant.type.ERROR,
            actions: [
              {
                name: 'OK',
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
              },
            ],
          });
        }
        const data = convertDataStructureForDetailGrid(res.data);
        if (data && data.length) {
          data.forEach((item) => {
            item.attachedImages = [];
          });
        }
        resolve(data);
      });
    });
  };

  // Load order type option data for dropdown box
  loadOrderType = () =>
    new Promise((resolve) =>
      getOrderType('ORDER_TYPE')
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadBranchByUser = (userId) =>
    new Promise((resolve) =>
      getBranchByLoggedUser(userId)
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
        fieldName: ReturnRequestConstant.materialType,
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
        fieldName: ReturnRequestConstant.materialGroup,
        property: 'data',
        updatedData: formatDropdownList(res.data),
      });
    });
  };

  getReasonRequiresComplaintNo = (data) => {
    const dataCombo = data;
    let reasonHasRequiredFlag = [];
    if (dataCombo && dataCombo.length) {
      dataCombo.forEach((item) => {
        if (item.requiredFlag) {
          reasonHasRequiredFlag.push(item.typeCode);
        }
      });
    }

    return reasonHasRequiredFlag;
  };

  loadReason = () => {
    getReason('RR_REASON_TYPE').then((res) => {
      this.setState({
        configItemDataOnGrid: { reason: formatComboBox(res.data) },
        reasonRequiresComplaintNo: this.getReasonRequiresComplaintNo(res.data),
      });
    });
  };

  removeSelectionOptionOnGrid = () => {
    this.setState({
      options: { ...options, selection: false },
    });
  };

  handleRowClick = (e, selectedRowData) => {
    // check is double click row event
    e.target.ondblclick = () => {
      const dataDetailsOnGrid = this.dataDetailsOnGrid;
      const goodReceiptIndex = this.fieldArray.findIndex(
        (el) => el.fieldName === ReturnRequestConstant.goodReceiptNo
      );

      const goodsReceiptNo = this.fieldArray[goodReceiptIndex].value;
      if (goodsReceiptNo) {
        if (
          dataDetailsOnGrid &&
          dataDetailsOnGrid.data &&
          dataDetailsOnGrid.data.length > 0
        ) {
          this.confirmChangeGoodReceiptNo(
            goodsReceiptNo,
            this.fieldArray,
            true,
            selectedRowData
          );
        } else {
          if (selectedRowData) {
            this.updateDetailFieldArray({
              fieldName: ReturnRequestConstant.goodReceiptNo,
              property: 'value',
              updatedData: selectedRowData.receiptNumber,
            });

            this.updateDetailFieldArray({
              fieldName: ReturnRequestConstant.vendor,
              property: 'value',
              updatedData: selectedRowData.vendorCode,
            });
          }

          this.updateOpenStateSearchPopup(false);
        }
      } else {
        if (selectedRowData) {
          this.updateDetailFieldArray({
            fieldName: ReturnRequestConstant.goodReceiptNo,
            property: 'value',
            updatedData: selectedRowData.receiptNumber,
          });

          this.updateDetailFieldArray({
            fieldName: ReturnRequestConstant.vendor,
            property: 'value',
            updatedData: selectedRowData.vendorCode,
          });
        }

        this.updateOpenStateSearchPopup(false);
      }
    };
  };

  handleRowSelect = (selectedRows) => {
    this.selectedRowOnGrid = selectedRows;
  };

  loadHistoryData = (id) => {
    const params = { returnRequestId: Number(id) };
    getHistoryData(params).then((res) => {
      const data =
        (res.data &&
          res.data.map((el) => ({
            time: el.updateDate,
            note: `${el.action} ${el.document}`,
            userName: el.createdBy,
          }))) ||
        [];
      data.length > 0 && this.updateHistoryData(data);
    });
  };

  componentDidMount() {
    const { returnRequestId, isDetailsPage, isEditPage } = this.props;
    if (!this.isViewMounted) {
      return;
    }
    if (isDetailsPage || isEditPage) {
      this.loadHistoryData(returnRequestId);
      // Load return request details information by return request id
      this.loadReturnRequestDataById(returnRequestId);
    }

    if (!isDetailsPage) {
      Promise.all([
        this.loadOrderType(),
        this.loadBranchByUser(this.loggedUser.userId),
        this.loadVendorByBranch(this.loggedUser.branch),
      ]).then((values) => {
        if (!this.isViewMounted) {
          return;
        }
        const defaultVal = {
          value: this.loggedUser.branch,
          isArray: false,
        };
        // Update Order Type, Vendor, Branch option
        this.updateMultipleDetailFieldArray([
          {
            fieldName: ReturnRequestConstant.orderType,
            property: 'data',
            updatedData: formatComboBox(values[0].data),
          },
          {
            fieldName: ReturnRequestConstant.branch,
            property: 'data',
            updatedData: formatDropdownList(values[1].data),
            defaultValue: defaultVal,
          },
          {
            fieldName: ReturnRequestConstant.vendor,
            property: 'data',
            updatedData: formatComboBox(values[2].data),
          },
        ]);
        this.loadReason();
        this.updateAllAddItemsFieldArray(addItemsFieldArray);
        // Load option data for multiselect item in 'Add items' form
        this.loadMaterialType();
        this.loadMaterialGroup();
      });
    }

    // Remove selection option to hide selection columns on grid
    this.removeSelectionOptionOnGrid();

    // set custom class for row image
    this.setState({
      customRowImageClass: 'return-request-item-grid',
    });
  }

  componentWillUnmount() {
    this.isViewMounted = false;
    this.fieldArray = [];
    this.selectedRowOnGrid = [];
    this.lastUpdatedSelectedRows = [];
    this.setState({
      initialImages: [],
    });
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
      isDetailsPage,
      isEditPage,
      classFormFieldCustom,
      history,
      historyData,
    } = this.props;

    // fieldsLabelArray for fields is text only in form, use for general information form
    const {
      fieldsLabelArray,
      bottomGridButtonsArray,
      columnsForDetailsPage,
      scanningTimeLineData,
      configItemDataOnGrid,
      customRowImageClass,
      validate,
    } = this.state;
    const btnActions = this.state.actions;
    const temptOptions = this.state.options;
    if (!isDetailsPage && (!this.fieldArray || this.fieldArray.length === 0)) {
      this.fieldArray = getFields(
        this.onOrderTypeChange,
        this.onGoodsReceiptNoChange,
        this.onInputSearchIconClick,
        isEditPage
      );
      this.updateAllFieldArray(this.fieldArray);
    }

    // Set columns for grid at Details page or Add/Edit page
    let columnsForGrid = [];
    let searchPopupChildComponentConfig = {};
    if (isDetailsPage) {
      columnsForGrid = columnsForDetailsPage;
    } else {
      columnsForGrid = this.state.columnsDetail;
      searchPopupChildComponentConfig = {
        component: (
          <GoodsReceiptList
            isSearchPopup
            handleRowClick={this.handleRowClick}
          />
        ),
        title: 'Search Goods Receipt',
      };
    }

    const listConfig = {
      rowSize,
      classFormFieldCustom,
      isDetailsPage,
      actions: btnActions,
      bottomGridButtonsArray,
      options: temptOptions,
      validation: validate,
      totalSummarizeInGrid,
      addItemsFieldList,
      informationConvert: this.informationConvert,
      fieldsLabelArray: fieldsLabelArray || getFieldsTextOnly(),
      columnsDetail: columnsForGrid || [],
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
      onCustomClose: this.onCustomClose,
      onCustomPrint: this.onCustomPrint,
      onCustomReject: this.onCustomReject,
      onCustomApprove: this.onCustomApprove,
      onCustomConfirmPickUp: this.onCustomConfirmPickUp,
      onCustomSaveDraft: this.onCustomSaveDraft,
      onCustomEdit: this.onCustomEdit,
      onCustomSave: this.onCustomSave,
      getLoadedItemForDetailGrid: this.getLoadedItemForDetailGrid,
      updateFormFieldsArray: this.updateFormFieldsArray,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
      customClassNameForDetailGrid: 'grid-large-content',
      isShowScanTimeLine,
      scanningTimeLineData,
      history,
      configItemDataOnGrid,
      searchPopupChildComponentConfig,
      historyData,
      handleRowSelect: this.handleRowSelect,
      customRowImageClass,
      customConfirmRefreshAllDetailsListMessage:
        Message.RETURN_REQUEST.CONFIRM_RELOAD_ITEMS_BY_GOODS_RECEIPT_NO,
    };

    return (
      <>
        <DetailForm {...listConfig} />
      </>
    );
  }
}

ReturnRequestForm.propTypes = {
  t: PropTypes.any,
  fieldArray: PropTypes.any,
  rowSize: PropTypes.number,
  returnRequestId: PropTypes.string,
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
  getReturnRequestNo: PropTypes.func,
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
  updateOpenStateSearchPopup: (data) =>
    dispatch({
      type: ActionType.UPDATE_OPEN_STATE_SEARCH_POPUP,
      openSearchPopup: data,
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
)(withTranslation()(ReturnRequestForm));
