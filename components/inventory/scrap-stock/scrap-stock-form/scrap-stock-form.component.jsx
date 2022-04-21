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
  ScrapStockConstant,
  ActionType,
  Action,
  userBranchInfo,
} from '../../../../constants/constants';
import { dialogConstant, buttonConstant } from '../../../../util/constant';

import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import {
  getFields,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  columnsDetailsConfig,
  bottomGridButtons,
  getFieldsTextOnly,
  columnsDetail,
} from './scrap-stock-form.config';
import {
  getBranchByUser,
  getMaterialType,
  getMaterialGroup,
  getMaterialList,
  getScrapStockDetailsById,
  getScrapStockHistoryById,
  getScrapStockPDF,
  saveScrapStock,
  submitScrapStock,
  updateScrapStock,
} from '../../../../actions/scrap-stock-action';

import history from '../../../../util/history';
import { printFilePDF } from '../../../../util/print-util';
import { Message } from '../../../../constants/messages';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { openRejectDialog } from '../../../../redux/reject-dialog/reject-dialog.actions';
import {
  formatDropdownList,
  formatNumber,
  mapColumnAndDataForMessageSAP,
} from '../../../../util/format-util';

class ScrapStockForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actions,
      options,
      searchParam: '',
      dataItem: [],
      fieldsLabelArray: [],
      columnsDetail: columnsDetail,
      totalSummarizeInGrid: [...totalSummarizeInGrid],
    };
    this.informationConvert = [
      { label: ScrapStockConstant.sku },
      { label: ScrapStockConstant.description },
    ];
    this.loggedUser = JSON.parse(localStorage.getItem('userInfo'));
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    // Get dispatch action from props to use it to update data state later
    this.updateDetailFieldArray = props.updateDetailFieldArray;
    this.updateAllFieldArray = props.updateAllFieldArray;
    this.updateDetailAddItemsFieldArray = props.updateDetailAddItemsFieldArray;
    this.updateAllAddItemsFieldArray = props.updateAllAddItemsFieldArray;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.updateHistoryData = props.updateHistoryData;

    this.isViewMounted = true;
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

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
  loadBranchByUser = (userId, isSetDefaultBranch = false) => {
    getBranchByUser(userId).then((res) => {
      const defaultVal = isSetDefaultBranch && {
        value: this.loggedUser.branch,
        isArray: false,
      };
      this.updateDetailFieldArray({
        fieldName: ScrapStockConstant.branchCode,
        property: 'data',
        updatedData: formatDropdownList(res.data),
        defaultValue: defaultVal,
      });
    });
  };

  loadMaterialType = () => {
    getMaterialType().then((res) => {
      const defaultVal = {
        value: ScrapStockConstant.materialTypeSearch.value,
        isArray: true,
      };
      this.updateDetailAddItemsFieldArray({
        fieldName: ScrapStockConstant.materialType,
        property: 'data',
        updatedData: formatDropdownList(res.data),
        defaultValue: defaultVal,
      });
    });
  };

  loadMaterialGroup = () => {
    getMaterialGroup().then((res) => {
      const defaultVal = {
        value: ScrapStockConstant.specialGroup.value,
        isArray: true,
      };
      this.updateDetailAddItemsFieldArray({
        fieldName: ScrapStockConstant.specialGroup.materialGroup,
        property: 'data',
        updatedData: formatDropdownList(res),
        defaultValue: defaultVal,
      });
    });
  };

  updateDataDetail = () => {
    const { isEditPage, idItem, getScrapStockNo } = this.props;
    getScrapStockDetailsById({ id: idItem }).then((res) => {
      if (res.data) {
        getScrapStockNo && getScrapStockNo(res.data.scrapStockNo);
      } else {
        this.props.history.push('/404');
        return;
      }
      if (isEditPage) {
        this.updateAllFieldArray(
          getFields(this.onOrderTypeChange, isEditPage, res.data)
        );
        const editBranch = [
          {
            display: res.data.branchName,
            value: res.data.branchCode,
            isArray: true,
          },
        ];
        const defaultVal = {
          value: res.data.branchCode,
          isArray: false,
        };
        this.updateDetailFieldArray({
          fieldName: ScrapStockConstant.branchCode,
          property: 'data',
          updatedData: formatDropdownList(editBranch),
          defaultValue: defaultVal,
        });
        this.updateDetailFieldArray({
          fieldName: ScrapStockConstant.approveBy,
          property: 'value',
          updatedData: res.data.approveBy,
        });
        this.updateDetailFieldArray({
          fieldName: ScrapStockConstant.status,
          property: 'value',
          updatedData: res.data.statusName,
        });
        this.updateDetailFieldArray({
          fieldName: ScrapStockConstant.note,
          property: 'value',
          updatedData: res.data.note,
        });
        this.setState({ dataItem: res.data });
      } else {
        // Load data for general infomation form at Details page
        const fieldsLabel = [...getFieldsTextOnly()];
        fieldsLabel.forEach((item) => {
          const field = item;
          const { fieldName } = field;
          if (res.data[fieldName] === undefined) {
            field.value = '';
          } else {
            field.value = res.data[fieldName];
          }
        });
        // hidden or display bottom grid buttons base on status of Return Request
        const bottomButtons = [...bottomGridButtons];
        const { statusName } = res.data;
        bottomButtons.forEach((item) => {
          const button = item;
          const { displayByStatus } = button;

          button.hidden =
            displayByStatus &&
            displayByStatus.length &&
            displayByStatus.indexOf(statusName) === -1;
        });
        this.setState({
          fieldsLabelArray: fieldsLabel,
          columnsDetail: columnsDetailsConfig,
          bottomGridButtonsArray: bottomButtons,
          dataDetail: res.data,
          options: { ...options, selection: false },
        });
      }
      const tempDataGird = res.data.transferRequestItemVOs.map(
        (item, index) => ({
          ...item.itemVO,
          no: index + 1,
          id: item.itemVO.itemId,
          entity: 'item',
          common: {
            imgUrl: '',
            id: item.itemVO.itemId,
          },
          quantity: isEditPage
            ? item.quantity
            : formatNumber(item.quantity, ScrapStockConstant.configDecimal),
          note: item.note,
          totalQty: item.stockOnHand,
        })
      );

      this.updateDataDetailsOnGrid({
        data: tempDataGird,
      });
      getScrapStockHistoryById({
        transferRequestId: res.data.transferRequestId,
      }).then((res) => {
        if (res.data) {
          const historyFld = res.data.map((item) => ({
            time: item.updateDate,
            userName: item.createdBy,
            note: item.action,
            comment: item.comment,
          }));
          this.updateHistoryData(historyFld);
        }
      });
    });
  };

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    let params = {};
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      ScrapStockConstant.materialType
    );
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      ScrapStockConstant.materialGroup
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      ScrapStockConstant.materialCode
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      ScrapStockConstant.materialDescription
    );

    return params;
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsData = (params) => {
    const arraySearch = {
      materialType: { in: [ScrapStockConstant.materialTypeSearch.value] },
      materialGroup: { in: [ScrapStockConstant.specialGroup.value] },
    };
    return trackPromise(
      getMaterialList({
        ...params,
        ...arraySearch,
      }).then(
        (res) =>
          new Promise((resolve) => {
            const data = res.data.map((item) => ({
              ...item,
              totalQty: item.stockOnHand,
              isNegativeNum: true,
            }));
            const formatRes = res;
            formatRes.data = data;
            resolve(formatRes);
          })
      )
    );
  };

  mapDetailsInformationForSaving = (detailsInformation) => {
    let data = detailsInformation.map((el) => ({
      itemVO: {
        // Each rowData need id and entity to identify each record
        sku: el.sku,
        entity: el.entity,
        description: el.description,
        baseUom: el.baseUom,
        materialTypeName: el.materialType,
        materialGroupName: el.materialGroup,
      },
      quantity: el.quantity,
      note: el.note,
    }));

    return data;
  };

  mapGeneralInformationForSaving = (generalInformation) => {
    const result = {};
    generalInformation.forEach((el) => {
      if (el.value && el.fieldName !== ScrapStockConstant.status) {
        result[el.fieldName] =
          typeof el.value === 'string' ? el.value.trim() : el.value;
      }
    });

    return result;
  };

  showMessDialog = (content) => {
    openDialog({
      title: Message.ERROR,
      type: dialogConstant.type.ERROR,
      content: content,
      actions: [
        {
          name: this.props.t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  checkAvailableStock = (generalInformation) => {
    if (!generalInformation || generalInformation.length === 0) {
      this.showMessDialog(
        Message.SCRAP_STOCK.REQUIRED_FLD.replace(
          '%SSFld%',
          ScrapStockConstant.detailsInformation
        )
      );
      return false;
    }
    const errorMsg = [];
    let invalidQuantity = [];

    generalInformation.forEach((el) => {
      if (!el.quantity || !+el.quantity || +el.quantity === 0) {
        invalidQuantity.push(el.no);
      }
    });
    if (invalidQuantity.length > 0) {
      errorMsg.push(
        `${Message.SCRAP_STOCK.REQUIRED_FLD.replace(
          '%SSFld%',
          ScrapStockConstant.Quantity
        )}
          <No: ${invalidQuantity.join(', ')}>`
      );
    }

    if (errorMsg.length > 0) {
      this.showMessDialog(errorMsg);
    }

    return errorMsg.length === 0;
  };

  /**
   * Set status base on savingType and orderType
   * @param {String} savingType
   * @param {Object} generalInformation
   */
  mapToAssociateStatus = (savingType) => {
    let status = '';
    switch (savingType) {
      case Action.saveDraft:
        status = ScrapStockConstant.statusValue.draft;
        break;
      case Action.save:
        status = ScrapStockConstant.statusValue.waitingApproval;
        break;
      default:
        break;
    }
    return status;
  };
  handleActionSave = (actionType, msg, dataItem, resolve, reject) => {
    actionType
      .then((res) => {
        openDialog({
          title: Message.INFORMATION,
          content: msg.replace('%SSNo%', dataItem.scrapStockNo || res.data),
          actions: [
            {
              name: this.props.t('Ok'),
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {
                return resolve;
              },
            },
          ],
        });
      })
      .catch(() => {
        openDialog({
          title: Message.warning,
          content: Message.SAVE_UNSUCCESSFULLY,
          disableBackdropClick: true,
          actions: [
            {
              name: this.props.t(Action.ok),
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {
                return reject;
              },
            },
          ],
        });
      });
  };
  /**
   * handler for saving draft or saving normal
   * @param {Array} fieldArray
   * @param {Object} dataDetailsOnGrid
   * @param {String} savingType
   */
  onSave = (fieldArray, dataDetailsOnGrid, historyData, savingType) => {
    const { isEditPage, idItem } = this.props;
    const { dataItem } = this.state;
    let scrapStockNo = dataItem.scrapStockNo;
    let id = '';
    let params = {};
    if (isEditPage) {
      id = idItem;
    }
    const detailsList = dataDetailsOnGrid && dataDetailsOnGrid.data;
    const msg =
      savingType === Action.saveDraft
        ? Message.SCRAP_STOCK.SAVE_DRAFT_CONFIRM
        : Message.SCRAP_STOCK.SAVE_CONFIRM;
    const isAvailableStock = this.checkAvailableStock(detailsList);

    // Show message and action save data to DB
    const promise = new Promise((resolve, reject) => {
      if (!detailsList || !isAvailableStock) {
        reject();
        return;
      }
      const generalInformation = this.mapGeneralInformationForSaving(
        fieldArray
      );
      params = { ...params, ...generalInformation };

      if (isEditPage) {
        params.transferRequestId = id;
      }
      params.transferRequestItemVOs = this.mapDetailsInformationForSaving(
        detailsList
      );

      if (historyData) {
        params.historyVOs = historyData;
      }
      let msgConfirm = scrapStockNo
        ? Message.SCRAP_STOCK.SUBMIT_CONFIRM.replace('%SSNo%', scrapStockNo)
        : Message.SCRAP_STOCK.CREATE_SUBMIT_CONFIRM;
      const actionType =
        savingType === Action.saveDraft ? saveScrapStock : submitScrapStock;
      if (savingType !== Action.saveDraft) {
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
                return this.handleActionSave(
                  actionType(params),
                  msg,
                  dataItem,
                  resolve(),
                  reject()
                );
              },
            },
          ],
        });
      } else {
        return this.handleActionSave(
          actionType(params),
          msg,
          dataItem,
          resolve(),
          reject()
        );
      }
    });
    return promise;
  };

  updateSSData(data) {
    const { history, idItem } = this.props;
    const { dataDetail } = this.state;
    let params = {};
    params.transferRequestId = idItem;

    let successMsg = Message.SCRAP_STOCK.CLOSE_CONFIRM;
    const isRejected = data.status === ScrapStockConstant.statusValue.rejected;
    const isClosed = data.status === ScrapStockConstant.statusValue.closed;
    const type = { isRejected };
    if (isRejected) {
      successMsg = Message.SCRAP_STOCK.REJECT;
      params.notes = data.reason;
    }

    return new Promise((resolve, reject) => {
      openDialog({
        title: isClosed ? Message.CONFIRM : Message.INFORMATION,
        type: isClosed ? dialogConstant.type.CONFIRM : dialogConstant.type.INFO,
        content: successMsg.replace('%SSNo%', dataDetail.scrapStockNo),
        disableBackdropClick: true,
        actions: [
          isClosed && {
            name: this.props.t('Cancel'),
            type: dialogConstant.button.NO_FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              reject();
            },
          },
          {
            name: this.props.t(Action.ok),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              updateScrapStock(params, type)
                .then(() => {
                  resolve();
                  history.push('/inventory/scrap-stock');
                })
                .catch(() => {
                  openDialog({
                    title: Message.warning,
                    content: Message.SYSTEM_ERROR,
                    actions: [
                      {
                        name: this.props.t('Ok'),
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                      },
                    ],
                  });
                  reject();
                });
            },
          },
        ],
      });
    });
  }

  onCustomSaveDraft = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.saveDraft);

  onCustomSave = (fieldArray, dataDetailsOnGrid, historyData) =>
    this.onSave(fieldArray, dataDetailsOnGrid, historyData, Action.save);

  onCustomPrint = () => {
    //Temporary test
    const id = 45;
    const urlPDF = `${getScrapStockPDF()}?&'poRequestId:${id}`;
    printFilePDF(urlPDF);
  };

  onCustomEdit = () => {
    const { idItem } = this.props;
    const url = '/inventory/scrap-stock/edit/';
    return url + idItem;
  };

  onCustomClose = () => {
    this.updateSSData({ status: ScrapStockConstant.statusValue.closed });
  };

  handleApprove() {
    const { history, idItem } = this.props;
    const { dataDetail } = this.state;
    let params = {};
    params.transferRequestId = idItem;
    let isApproved = true;
    openDialog({
      title: Message.CONFIRM,
      content: Message.SCRAP_STOCK.APPROVE_CONFIRM.replace(
        '%SSNo%',
        dataDetail.scrapStockNo
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
            updateScrapStock(params, { isApproved })
              .then((res) => {
                if (res.message) {
                  const msg = mapColumnAndDataForMessageSAP(
                    res.message.messages
                  );
                  // Display message from SAP
                  openDialog({
                    title: Message.ERROR,
                    type: dialogConstant.type.ERROR,
                    content: msg,
                    isTableLayout: true,
                    actions: [
                      {
                        name: 'OK',
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                        action: () => {
                          this.updateDataDetail();
                        },
                      },
                    ],
                  });
                } else {
                  openDialog({
                    title: Message.INFORMATION,
                    type: dialogConstant.type.INFO,
                    content: Message.SCRAP_STOCK.APPROVE.replace(
                      '%SSNo%',
                      dataDetail.scrapStockNo
                    ),
                    actions: [
                      {
                        name: this.props.t(Action.ok),
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                        action: () => {
                          history.push('/inventory/scrap-stock');
                        },
                      },
                    ],
                  });
                }
              })
              .catch(() => {
                openDialog({
                  title: Message.warning,
                  content: Message.SYSTEM_ERROR,
                  actions: [
                    {
                      name: this.props.t('Ok'),
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                    },
                  ],
                });
              });
          },
        },
      ],
    });
  }

  onCustomApprove = () => {
    this.handleApprove();
  };

  afterSubmitReject = (res) => {
    const { history } = this.props;
    const { dataDetail } = this.state;
    const msg = Message.SCRAP_STOCK.REJECT;
    if (res) {
      openDialog({
        title: Message.INFORMATION,
        type: dialogConstant.type.INFORMATION,
        content: msg.replace('%SSNo%', dataDetail.scrapStockNo),
        actions: [
          {
            name: this.props.t(Action.ok),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              history.push('/inventory/scrap-stock');
            },
          },
        ],
      });
    }
  };

  handelRejectReturnRequest = (reasonData) => {
    const { idItem } = this.props;
    const bodyParams = {
      transferRequestId: idItem,
      reason: reasonData,
    };

    return new Promise((resolve) => {
      updateScrapStock(bodyParams, { isRejected: true }).then((res) => {
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
  updateActionAdd() {
    const { isDetailsPage } = this.props;
    let tempActions;
    if (isDetailsPage) {
      tempActions = this.updateButtonActionState([], isDetailsPage);
    } else {
      const updatedAction = [
        { name: Action.select, isHidden: false },
        { name: Action.remove, isHidden: false },
      ];
      tempActions = this.updateButtonActionState(updatedAction);
    }
    this.setState({ actions: tempActions });
  }

  componentDidMount() {
    const { isEditPage, isDetailsPage } = this.props;
    this.updateButtonActionState([]);
    if (isEditPage || isDetailsPage) {
      this.updateDataDetail();
    } else {
      this.loadBranchByUser(
        this.loggedUser.userId,
        true /** set default branch when initial */
      );
    }
    this.updateActionAdd();

    this.updateAllAddItemsFieldArray(addItemsFieldArray);

    // Load option data for multiselect item in 'Add items' form
    this.loadMaterialType();
    this.loadMaterialGroup();
  }

  componentWillUnmount() {
    this.isViewMounted = false;
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
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
    const {
      addItemsFieldList,
      isDetailsPage,
      classFormFieldCustom,
      historyData,
      rowSize,
      isEditPage,
    } = this.props;

    const {
      fieldsLabelArray,
      columnsDetail,
      totalSummarizeInGrid,
    } = this.state;
    const btnActions = this.state.actions;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields(this.onInventoryChange, isEditPage);
      this.updateAllFieldArray(this.fieldArray);
    }

    const tempOption = this.state.options;

    const listConfig = {
      rowSize,
      actions: btnActions,
      options: tempOption,
      validation: '',
      totalSummarizeInGrid: totalSummarizeInGrid,
      addItemsFieldList,
      informationConvert: this.informationConvert,
      isDetailsPage,
      fieldsLabelArray: fieldsLabelArray || getFieldsTextOnly(),
      columnsDetail,
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
      onCustomClose: this.onCustomClose,
      onCustomPrint: this.onCustomPrint,
      onCustomReject: this.onCustomReject,
      onCustomApprove: this.onCustomApprove,
      onCustomSave: this.onCustomSave,
      onCustomEdit: this.onCustomEdit,
      onCustomSaveDraft: this.onCustomSaveDraft,
      updateFormFieldsArray: this.updateFormFieldsArray,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
      bottomGridButtonsArray: bottomGridButtons,
      classFormFieldCustom,
      history,
      historyData,
    };
    return <>{this.isViewMounted && <DetailForm {...listConfig} />}</>;
  }
}

ScrapStockForm.propTypes = {
  t: PropTypes.any,
  updateDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.any,
  dataDetailsOnGrid: PropTypes.object,
  updateDataDetailsOnGrid: PropTypes.func,
  isEditPage: PropTypes.any,
  idItem: PropTypes.any,
  history: PropTypes.object,
  isDetailsPage: PropTypes.any,
  classFormFieldCustom: PropTypes.string,
  historyData: PropTypes.any,
  updateHistoryData: PropTypes.func,
  rowSize: PropTypes.number,
  getScrapStockNo: PropTypes.func,
};

function mapStateToProps(state) {
  return {
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
)(withTranslation()(ScrapStockForm));
