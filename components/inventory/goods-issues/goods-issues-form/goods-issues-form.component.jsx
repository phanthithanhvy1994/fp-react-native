import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { trackPromise } from 'react-promise-tracker';
import PropTypes from 'prop-types';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
} from '../../../shared/search-form/search-form.common';
import {
  convertItemDataStructure,
  convertDataStructureForDetailGrid,
  getFinalBaseUnitValue
} from './goods-issues-form.common';
import {
  getGoodsIssuesType,
  getGoodsIssuesStatus,
  saveGoodIssue,
  getGoodsIssuesById,
  getMaterialList,
  getGIDepartment,
  getGIBranch,
} from '../../../../actions/goods-issues-action';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { Message } from '../../../../constants/messages';
import { formatDateString } from '../../../../util/date-util';
import { formatNumber } from '../../../../util/format-util';
import {
  Action,
  ActionType,
  dateFormat,
  userBranchInfo,
  GoodsIssuesConstant
} from '../../../../constants/constants';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import {
  getFields,
  validation,
  columnsForVendor,
  options,
  actions,
  totalSummarizeInGrid,
  addItemsFieldArray,
  isShowScanTimeLine,
} from './goods-issues-form.config';

import {
  getReason,
} from '../../../../actions/return-request-action';

import {
  getMaterialGroup,
  getMaterialType,
} from '../../../../actions/purchase-order-action';
import { getUserInfo } from '../../../../actions/auth-action';
import './goods-issues-form.style.scss';
import {
  formatComboBox,
  formatDropdownList,
} from '../../../../util/format-util';

class GoodsIssuesForm extends Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    this.state = {
      actions: actions(),
      options,
      fieldsLabelArray: [],
      valueAction: '',
      configItemDataOnGrid: [],
      selectedRowOnGrid: [],
      goodsIssuesNumber: null,
      columnsDetail: [],
      validate: validation(),
      branchValue: userBranchInfo.defaultBranch,
      notAllowConfirmLeavePage: false,
    };
    this.loggedUser = getUserInfo();
    this.informationConvert = [
      { label: GoodsIssuesConstant.sku },
      { label: GoodsIssuesConstant.description },
      // { label: GoodsIssuesConstant.orderUnit, color: 'secondary' },
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
    this.fieldArray = [];
    this.dataDetailsOnGrid = null;
  }

  /**
   * Show/hide some element on grid base on ordertype data
   */
  onOrderTypeChange = (e) => {
    const { valueAction } = this.state;
    const selectedValue = e.target.value;
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    if(dataDetailsOnGrid && dataDetailsOnGrid.data.length > 0){
      openDialog({
        title: Message.warning,
        content: Message.GOODS_ISSUES.CHANGE_TYPE.replace('Field Name', GoodsIssuesConstant.type),
        actions: [
          {
            name: this.props.t(Action.cancel),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.CANCEL,
            action: () =>{
              this.updateDetailFieldArray({
                fieldName: 'typeCode',
                property: 'value',
                updatedData: String(valueAction),
              });
            }
          },
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              this.updateDataDetailsOnGrid({ data: [] });
              this.changeType(selectedValue);
            },
          },
        ],
      });
    }
    else{
      this.changeType(selectedValue);
    }
  };

  onOrderBranchChange = (e) => {
    const { branchValue } = this.state;
    const selectedValue = e.target.value;
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    const fieldArray = this.fieldArray;
    const history = this.props.historyData;
    //If change Branch, data on General, Detail Information, History will be reset
    if((fieldArray && (fieldArray[2].value || fieldArray[3].value)) || (dataDetailsOnGrid && dataDetailsOnGrid.data.length > 0) ||
      (history && history.length > 0)){
      openDialog({
        title: Message.warning,
        content: Message.GOODS_ISSUES.CHANGE_BRANCH.replace('Field Name', GoodsIssuesConstant.branch),
        actions: [
          {
            name: this.props.t(Action.cancel),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.CANCEL,
            action: () =>{
              this.updateDetailFieldArray({
                fieldName: 'branchCode',
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
                  fieldName: 'typeCode',
                  property: 'value',
                  updatedData: '',
                },
                {
                  fieldName: 'headerNote',
                  property: 'value',
                  updatedData: '',
                },
              ]);
              this.setState({valueAction: ''});
              this.changeBranch(selectedValue);
            },
          },
        ],
      });
    }
    else{
      this.changeBranch(selectedValue);
    }
  }

  changeType = (type) => {
    const { configItemDataOnGrid } = this.state;
    if (type.length > 0) {
      this.setState({
        valueAction: type,
      });
    } else {
      this.setState({
        valueAction: '',
      });
    }

    if (type ===  GoodsIssuesConstant.types.internal_order) {
      this.setState({
        configItemDataOnGrid: {
          ...configItemDataOnGrid,
          isCostCenter: true,
          isInternalOrder: false
        },
      });
    } else {
      this.setState({
        configItemDataOnGrid: {
          ...configItemDataOnGrid,
          isCostCenter: false,
          isInternalOrder: true
        },
      });
    }
  }

  changeBranch = (branch) => {
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

  /**
   * Show/hide some element on grid base on type data
   */
  updateThingsRelateToType = (selectedValue) => {
    const { configItemDataOnGrid } = this.state;
    if (selectedValue === GoodsIssuesConstant.types.internal_order) {
      this.setState({
        configItemDataOnGrid: {
          ...configItemDataOnGrid,
          isCostCenter: true,
          isInternalOrder: false
        },
      });
    } else {
      this.setState({
        configItemDataOnGrid: {
          ...configItemDataOnGrid,
          isCostCenter: false,
          isInternalOrder: true
        },
      });
    }
  };

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    let params = {};

    params = mapPropertyForRequestParams(
      params,
      searchFields,
      GoodsIssuesConstant.materialType
    );
    params = mapPropertyForRequestParams(
      params,
      searchFields,
      GoodsIssuesConstant.materialGroup
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      GoodsIssuesConstant.materialCode,
    );
    params = setPropertyForRequestParams(
      params,
      searchFields,
      GoodsIssuesConstant.materialDescription
    );

    return params;
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsData = (params) => {
    const branchIndex = this.fieldArray.findIndex(
      (el) => el.fieldName === 'branchCode'
    );
    const branchValue = this.fieldArray[branchIndex].value;
    return trackPromise(
      getMaterialList({
        ...params,
        countFlag: 1,
        deleteFlag: 0,
        branchCode: branchValue,
      }).then(
        (res) =>
          new Promise((resolve) => {
            resolve(res);
          })
      )
    );
  };

  /**
   * Check Detail List is valid or not: quantity must be number
   * and detail list must be not empty, volume must be less than or equal to maxVolume
   * @param {Array} detailList
   */
  isValidDetailListInformation = (detailList, type) => {
    if (!detailList || detailList.length === 0) {
      openDialog({
        title: Message.warning,
        // type: dialogConstant.type.WARNING,
        content: `${GoodsIssuesConstant.label.detailsInformation} ${Message.common.comMSG001}`,
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
    let isMissedReason = [];
    let isInternal = [];
    let isCostCenter = [];
    let isCostCenterNumber = [];
    let isNote = [];
    let isMaxLengthNote = [];
    let isInputPrice = [];

    detailList.forEach((el) => {
      if (!el.reasonCode) {
        isMissedReason.push(el.no);
      }

      if (type === GoodsIssuesConstant.types.cost_center) {
        if (!el.costCenter || el.costCenter.length !== 10) {
          isCostCenter.push(el.no);
        } else if (isNaN(el.costCenter)) {
          isCostCenterNumber.push(el.no);
        };
      } else {
        if (!el.internalOrder || el.internalOrder.length !== 8) {
          isInternal.push(el.no);
        }
        if (el.internalOrder?.startsWith('S')) {
          if (!el.costCenter || el.costCenter.length !== 10) {
            isCostCenter.push(el.no);
          } else if (isNaN(el.costCenter)) {
            isCostCenterNumber.push(el.no);
          }
        }
      }

      if (!el.note) {
        isNote.push(el.no);
      } else if (el.note.length > 50) {
        isMaxLengthNote.push(el.no);
      }
      
      if (!((el.orderQuantity && +el.orderQuantity) || (el.baseQuantity && +el.baseQuantity))) {
        isInputPrice.push(el.no);
      }
    });

    if (isMissedReason.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.reason} ${Message.common['comMSG001']}
        <No: ${isMissedReason.join(', ')}>`
      );
    }

    if (isInternal.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.internalOrder} ${Message.GOODS_ISSUES.INTERNAL_ORDER_INVALID}
        <No: ${isInternal.join(', ')}>`
      );
    }

    if (isCostCenter.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.costCenter} ${Message.GOODS_ISSUES.COST_CENTER_INVALID}
        <No: ${isCostCenter.join(', ')}>`
      );
    }

    //Check cost center is digit
    if (isCostCenterNumber.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.costCenter} ${Message.GOODS_ISSUES.ONLY_NUMBER}
        <No: ${isCostCenterNumber.join(', ')}>`
      );
    }

    if (isNote.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.note} ${Message.common['comMSG001']}
        <No: ${isNote.join(', ')}>`
      );
    }

    if (isMaxLengthNote.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.note} ${Message.GOODS_ISSUES.MAX_LENGTH_NOTE}
        <No: ${isMaxLengthNote.join(', ')}>`
      );
    }

    if (isInputPrice.length > 0) {
      errorMsg.push(
        `${GoodsIssuesConstant.label.quantity} ${Message.common['comMSG001']}
        <No: ${isInputPrice.join(', ')}>`
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
  handleActionSave = (params, isEditPage, savingType, resolve, reject) => {
    saveGoodIssue(
      params,
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
          const goodsIssuesNumber = res.data.goodsIssuesNumber;
          let msg = '';

          if (isEditPage) {
            msg =
              (savingType === Action.saveDraft &&
                Message.GOODS_ISSUES.DRAFT_UPDATE_SUCCESSFULLY) ||
              Message.GOODS_ISSUES.SUBMIT_SUCCESSFULLY;
          } else {
            msg =
              (savingType === Action.saveDraft &&
                Message.GOODS_ISSUES.DRAFT_SAVE_SUCCESSFULLY) ||
              Message.GOODS_ISSUES.SUBMIT_SUCCESSFULLY;
          }

          openDialog({
            title: Message.INFORMATION,
            type: dialogConstant.type.INFORMATION,
            content: msg.replace('%GOOD_ISSUE_NO%', goodsIssuesNumber),
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
  };
  /**
   * handler for saving draft or saving normal
   * @param {Array} fieldArray
   * @param {Object} dataDetailsOnGrid
   * @param {String} savingType
   */
  onSave = (fieldArray, dataDetailsOnGrid, historyData, savingType) => {
    let params = {};
    const { isEditPage, goodsIssuesId } = this.props;
    const { goodsIssuesNumber } = this.state;

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
          generalInformation.typeCode
        )
      ) {
        reject();
      } else {
        // Update status for edit
        if (isEditPage) {
          params = {
            ...params,
            ...generalInformation,
            status: +GoodsIssuesConstant.statusValue.draft,
            goodsIssuesId: Number(goodsIssuesId),
          };
        } else {
          params = {
            ...params,
            ...generalInformation,
            status: +GoodsIssuesConstant.statusValue.draft
          };
        }

        params.goodsIssuesDetailVO = this.mapDetailsInformationForSaving(
          detailsList
        );

        params.goodsIssuesHistoryVO = historyData;
        if (savingType === Action.save) {
          openDialog({
            title: Message.CONFIRM,
            content: Message.GOODS_ISSUES.SUBMIT_CONFIRM.replace(
              '%giNo%',
              (goodsIssuesNumber && `: <${goodsIssuesNumber}>`) || ''
            ),
            actions: [
              {
                name: this.props.t('Cancel'),
                type: dialogConstant.button.NONE_FUNCTION,
                className: buttonConstant.type.PRIMARY,
              },
              {
                name: this.props.t('Ok'),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  this.handleActionSave(
                    params,
                    isEditPage,
                    savingType,
                    resolve,
                    reject
                  );
                },
              },
            ],
          });
        } else {
          return this.handleActionSave(
            params,
            isEditPage,
            savingType,
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
    generalInformation.forEach((el) => {
      switch (el.fieldName) {
        case GoodsIssuesConstant.createdDate:
          result[el.fieldName] =
            el.value &&
            formatDateString(
              typeof el.value === 'object'
                ? el.value.toLocaleDateString()
                : el.value,
              dateFormat.savingDateTime
            );
          break;
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
      goodsIssuesId: el.goodsIssuesId,
      sku: el.sku,
      reasonCode: el.reasonCode,
      note: el.note,
      orderQuantity: el.orderQuantity ? +el.orderQuantity : 0,
      baseQuantity: +el.baseQuantity,
      totalQuantity: +formatNumber(getFinalBaseUnitValue(el)),
      internalOrder: this.state.configItemDataOnGrid.isInternalOrder ? '' : el.internalOrder,
      costCenter: (el.internalOrder?.startsWith('S') || !this.state.configItemDataOnGrid.isCostCenter) ? el.costCenter : '',
      entity: el.entity,
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
        fieldName: GoodsIssuesConstant.departmentCode,
        property: 'value',
        updatedData: detailData.departmentCode,
      },
      {
        fieldName: GoodsIssuesConstant.branchCode,
        property: 'value',
        updatedData: detailData.branchCode,
      },
      {
        fieldName: GoodsIssuesConstant.typeCode,
        property: 'value',
        updatedData: detailData.typeCode,
      },
      {
        fieldName: GoodsIssuesConstant.createdDate,
        property: 'value',
        updatedData: new Date(
          formatDateString(
            detailData.createdDate,
            dateFormat.yyyymmdd,
            true
          )
        ),
      },
      {
        fieldName: GoodsIssuesConstant.headerNote,
        property: 'value',
        updatedData: detailData.headerNote,
      },
      {
        fieldName: GoodsIssuesConstant.GIstatus,
        property: 'value',
        updatedData: detailData.status,
      },
    ]);
  };

  loadDepartment = () =>
    new Promise((resolve) =>
      getGIDepartment()
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  // Load type option data for dropdown box
  loadType = () =>
    new Promise((resolve) =>
      getGoodsIssuesType()
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadStatus = () =>
    new Promise((resolve) =>
      getGoodsIssuesStatus().then((res) => {
        resolve(res);
      }).catch(() => {
        resolve({ data: [] });
      })
    );

    loadBranchByUser = () =>
      new Promise((resolve) =>
        getGIBranch()
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
        fieldName: GoodsIssuesConstant.materialType,
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
        fieldName: GoodsIssuesConstant.materialGroup,
        property: 'data',
        updatedData: formatDropdownList(res.data),
      });
    });
  };

  //TODO
  loadReason = () => {
    const { configItemDataOnGrid } = this.state;
    getReason('RR_REASON_TYPE').then((res) => {
      this.setState({
        configItemDataOnGrid: {
          ...configItemDataOnGrid,
          reason: formatComboBox(res.data),
        },
      });
    });
  };

  handleRowSelect = (selectedRows) => {
    this.setState({
      selectedRowOnGrid: selectedRows,
    });
  };

  //TODO
  loadGoodsIssuesDataById = (goodsIssuesId) => {
    const promise = new Promise((resolve) => {
      getGoodsIssuesById(goodsIssuesId).then((res) => {
        const { getGoodsIssuesNumber, history } = this.props;
  
        if (!res || !res.data || !(res.data.status === +GoodsIssuesConstant.statusValue.draft || 
          res.data.status === +GoodsIssuesConstant.statusValue.failed)) {
          this.setState({ notAllowConfirmLeavePage: true }, () => {
            history.push('/404');
          });
          return;
        } else {
          getGoodsIssuesNumber && getGoodsIssuesNumber(res.data.goodsIssuesNumber);
          this.setState({
            goodsIssuesNumber: res.data.goodsIssuesNumber,
            valueAction: res.data.typeCode,
            branchValue: res.data.branchCode,
          });
  
          this.updateDataForFieldsArray(res.data);
          this.updateThingsRelateToType(res.data.typeCode);
          this.updateDataDetailsOnGrid({
            data: convertDataStructureForDetailGrid(
              res.data.goodsIssuesDetailVO
            ),
          });
          const history = (res.data && res.data.goodsIssuesHistoryVO &&
            res.data.goodsIssuesHistoryVO.map((el) => ({
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

  componentDidMount() {
    const { goodsIssuesId, isEditPage } = this.props;
    if (!this.isViewMounted) {
      return;
    }

    const defaultValBranch = {
      value: this.loggedUser.branch,
      isArray: false,
    };
    const defaultValDepartment = {
      value: 1,
      isArray: false,
    };

    if (isEditPage) {
      this.loadGoodsIssuesDataById(goodsIssuesId).then(
        res => {
          defaultValBranch.value = res.branchCode;
        }
      );
    }

    Promise.all([
      //TODO
      this.loadDepartment(),
      this.loadType(),
      this.loadBranchByUser(),
      this.loadStatus(),
    ]).then((values) => {
      if (!this.isViewMounted) {
        return;
      }

      // Update Department, Branch, Type Status
      this.updateMultipleDetailFieldArray([
        //TODO
        {
          fieldName: 'departmentCode',
          property: 'data',
          updatedData: formatComboBox(values[0].data),
          defaultValue: defaultValDepartment,
        },
        {
          fieldName: 'branchCode',
          property: 'data',
          updatedData: formatDropdownList(values[2].data),
          defaultValue: defaultValBranch,
        },
        {
          fieldName: 'typeCode',
          property: 'data',
          updatedData: formatComboBox(values[1].data),
        },
        {
          fieldName: 'status',
          property: 'data',
          updatedData: formatComboBox(values[3].data),
        },
      ]);
      this.loadReason();
      this.updateAllAddItemsFieldArray(addItemsFieldArray);
      // Load option data for multiSelect item in 'Add items' form
      this.loadMaterialType();
      this.loadMaterialGroup();
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
    } = this.state;
    const temptOptions = this.state.options;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields(
        this.onOrderTypeChange,
        this.onOrderBranchChange,
        isEditPage,
      );
      this.updateAllFieldArray(this.fieldArray);
    }

    const listConfig = {
      rowSize,
      classFormFieldCustom,
      actions: actions(this.state.valueAction),
      options: temptOptions,
      validation: validate,
      totalSummarizeInGrid,
      addItemsFieldList,
      informationConvert: this.informationConvert,
      fieldsLabelArray: fieldsLabelArray,
      columnsDetail: columnsForVendor || [],
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
    };

    return (
      <>
        <DetailForm {...listConfig} />
      </>
    );
  }
}

GoodsIssuesForm.propTypes = {
  t: PropTypes.any,
  fieldArray: PropTypes.any,
  rowSize: PropTypes.number,
  goodsIssuesId: PropTypes.string,
  isDetailsPage: PropTypes.bool,
  isEditPage: PropTypes.bool,
  classFormFieldCustom: PropTypes.string,
  updateDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.array,
  dataDetailsOnGrid: PropTypes.object,
  updateDataDetailsOnGrid: PropTypes.func,
  updateMultipleDetailFieldArray: PropTypes.any,
  history: PropTypes.object,
  updateOpenStateSearchPopup: PropTypes.func,
  updateHistoryData: PropTypes.func,
  historyData: PropTypes.any,
  updateAddItemsSelections: PropTypes.func,
  getGoodsIssuesNumber: PropTypes.func,
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
)(withTranslation()(GoodsIssuesForm));
