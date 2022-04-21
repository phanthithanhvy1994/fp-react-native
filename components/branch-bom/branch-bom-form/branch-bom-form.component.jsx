import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { trackPromise } from 'react-promise-tracker';
import PropTypes from 'prop-types';

import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { convertItemDataStructure } from '../../material/material.common';
import {
  Action,
  ActionType,
  ConfigEntity,
  dateFormat,
  BranchBOM,
} from '../../../constants/constants';
import DetailForm from '../../shared/form/detail-form/detail-form.component';
import {
  compareFields,
  comparedDetail,
  getFields,
  getFieldsTextOnly,
  validation,
  columnsDetail,
  options,
  actions,
  addItemsFieldArray,
  fieldsForm,
  addItemsFieldsGroup,
  addItemsFieldsMaterials,
  bottomGridButtons,
  informationConvert,
} from './branch-bom-form.config';
import {
  getMaterial,
  getItemDetail,
  getBranchBomList,
  insertBranchBOM,
  getDataProductType,
  getDataPriceType,
  getDataCategoryType,
  getDataSubCategoryType,
  getDataBomBranchLevelType,
  getDataBomBranchQuantityType,
  getDataStatusType,
  getDataCompanyCode,
  getDataIndicator,
  getDataDivision,
} from '../../../actions/branch-bom-action';
import { getAllBranchBOMGroup } from '../../../actions/branch-bom-group.action';
import {
  getMaterialType,
  getMaterialGroup,
} from '../../../actions/purchase-order-action';
import { getUserInfo } from '../../../actions/auth-action';
import './branch-bom-form.style.scss';
import { reStructureFields } from '../../branch-bom/branch-bom-util';
import { formatDateString } from '../../../util/date-util';
import { formatComboBox, formatDropdownList } from '../../../util/format-util';

class BranchBomForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: [],
      categories: [],
      materialGroup: [],
      materialType: [],
      btnActions: '',
      valueActions: '',
      levels: [],
      levelPopup: [],
      dataBranchBOM: {},
      dataDetail: {},
      statusBranchBOM: '',
      validate: validation(),
      product: [],
      price: [],
      sub_cate: [],
      quantity: [],
      companyCode: [],
      division: [],
      isAlwaysON: false,
      isServiceMaterial: false,
      entity: '',
      configItemDataOnGrid: [],
      titleSelectPopup: '',
      informationConvert: {},
    };
    this.loggedUser = getUserInfo();
    // Get dispatch action from props to use it to update data state later
    this.updateDetailFieldArray = props.updateDetailFieldArray;
    this.updateAllFieldArray = props.updateAllFieldArray;
    this.updateDetailAddItemsFieldArray = props.updateDetailAddItemsFieldArray;
    this.updateAllAddItemsFieldArray = props.updateAllAddItemsFieldArray;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.rowSizePopUp = 3;
    this.loadAddItemsData = this.loadAddItemsDataDefault;
    this.informationConvert = [];
    this.originBranchBOM = [];
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

  onOrderTypeChange = (e, newFieldArray) => {
    const { valueActions } = this.state;
    const selectedValue = e.target.value;
    const dataDetailsOnGrid = this.dataDetailsOnGrid;
    if(dataDetailsOnGrid && dataDetailsOnGrid.data.length > 0){
      openDialog({
        title: Message.warning,
        content: Message.BRANCH_BOM.CONFIRM_CHANGE_LEVEL,
        actions: [
          {
            name: this.props.t(Action.cancel),
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.CANCEL,
            action: () =>{
              this.updateDetailFieldArray({
                fieldName: fieldsForm.level,
                property: 'value',
                updatedData: String(valueActions),
              });
            }
          },
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              this.updateDataDetailsOnGrid({ data: [] });
              this.confirmChangeLevel(selectedValue);
            },
          },
        ],
      });
    }
    else{
      this.confirmChangeLevel(selectedValue, newFieldArray);
    }
    
  };

  confirmChangeLevel = (selectedValue, newFieldArray) =>{
    const { levels, isAlwaysON, configItemDataOnGrid, categories } = this.state;
    if (selectedValue.length > 0) {
      const levelPopup = levels.filter(
        (element) => element.value > selectedValue
      );
      this.setState({
        valueActions: selectedValue,
        levelPopup,
        validate: validation(selectedValue, isAlwaysON),
      });
      if (selectedValue === BranchBOM.levels.level_1) {
        const categoryData = categories.find(cat => cat.categoryCode === BranchBOM.category.combo);
        const fieldCategory =
          newFieldArray?.find((field) => field.fieldName === 'categoryCode') || {};
        fieldCategory.data = formatDropdownList([categoryData]);
        this.updateDisableFields(fieldsForm.indicatorCode, 'disabled', true);
        this.updateDisableFields(fieldsForm.indicatorCode, 'value', undefined);
        // Update product and category level 1
        this.updateDisableFields(fieldsForm.product, 'disabled', true);
        this.updateDisableFields(fieldsForm.product, 'value', 1);
        this.updateDisableFields(fieldsForm.category, 'disabled', false);
        this.updateDisableFields(fieldsForm.category, 'value', BranchBOM.category.combo);

        // New update for #FPBBS-1426
        this.updateDisableFields(fieldsForm.price, 'disabled', false);
        this.updateDisableFields(fieldsForm.sub_cate, 'disabled', false);
        this.updateDisableFields(
          fieldsForm.quantity,
          'operator.disabled',
          true
        );
        this.updateDisableFields(
          fieldsForm.quantity,
          'operator.value',
          BranchBOM.quantityUnit.Unit
        );
        this.updateDisableFields(
          fieldsForm.quantity,
          'searchInput.disabled',
          true
        );
        this.updateDisableFields(
          fieldsForm.quantity,
          'searchInput.value',
          1
        );
        this.updateDisableFields(fieldsForm.serviceMaterial, 'disabled', true);
        this.updateDisableFields(fieldsForm.serviceMaterial, 'value', false);
        this.setState({
          isServiceMaterial: false,
          configItemDataOnGrid: {
            ...configItemDataOnGrid,
            displayIndicatorDetail: false,
          },
        });
      } else if (selectedValue === BranchBOM.levels.level_2) {
        this.updateDisableFields(fieldsForm.indicatorCode, 'disabled', false);
        // Update disable and value 
        this.updateDisableFields(fieldsForm.indicatorCode, 'value', undefined);
        this.updateDisableFields(fieldsForm.product, 'disabled', false);
        this.updateDisableFields(fieldsForm.product, 'value', undefined);
        this.updateDisableFields(fieldsForm.category, 'disabled', true);
        this.updateDisableFields(fieldsForm.category, 'value', undefined);

        // New update for #FPBBS-1426
        this.updateDisableFields(fieldsForm.price, 'disabled', false);
        this.updateDisableFields(fieldsForm.sub_cate, 'disabled', false);
        this.updateDisableFields(
          fieldsForm.quantity,
          'operator.disabled',
          false
        );
        this.updateDisableFields(
          fieldsForm.quantity,
          'searchInput.disabled',
          false
        );
        this.updateDisableFields(fieldsForm.serviceMaterial, 'disabled', false);
        this.setState({
          configItemDataOnGrid: {
            ...configItemDataOnGrid,
            displayIndicatorDetail: true,
          },
        });
      } else {
        this.updateDisableFields(fieldsForm.indicatorCode, 'disabled', true);
        this.updateDisableFields(fieldsForm.indicatorCode, 'value', undefined);
        // Update disable and value
        this.updateDisableFields(fieldsForm.product, 'disabled', false);
        this.updateDisableFields(fieldsForm.product, 'value', undefined);

        // New update for #FPBBS-1426
        this.updateDisableFields(fieldsForm.price, 'disabled', true);
        this.updateDisableFields(fieldsForm.price, 'value', '');
        this.updateDisableFields(fieldsForm.category, 'disabled', true);
        this.updateDisableFields(fieldsForm.category, 'value', '');
        this.updateDisableFields(fieldsForm.sub_cate, 'disabled', true);
        this.updateDisableFields(fieldsForm.sub_cate, 'value', '');
        this.updateDisableFields(
          fieldsForm.quantity,
          'operator.disabled',
          false
        );
        this.updateDisableFields(
          fieldsForm.quantity,
          'searchInput.disabled',
          false
        );
        this.updateDisableFields(fieldsForm.serviceMaterial, 'disabled', true);
        this.updateDisableFields(fieldsForm.serviceMaterial, 'value', false);
        this.setState({
          isServiceMaterial: false,
          configItemDataOnGrid: {
            ...configItemDataOnGrid,
            displayIndicatorDetail: true,
          },
        });
      }
    } else {
      this.setState({ valueActions: '' });
    }
  }

  updateDisableFields = (fieldName, property, valueUpdate) => {
    this.updateDetailFieldArray({
      fieldName: fieldName,
      property: property,
      updatedData: valueUpdate,
    });
  };

  serviceMaterial = (e) => {
    const isServiceMaterial = e.target.value;
    this.setState({
      isServiceMaterial: isServiceMaterial,
    });
  };

  alwaysON = (e) => {
    const { valueActions } = this.state;
    const isAlwaysON = e.target.value;
    this.setState({
      alwaysON: isAlwaysON,
      validate: validation(valueActions, isAlwaysON),
    });
    this.updateDisableFields(fieldsForm.endDate, 'disabled', isAlwaysON);
    this.updateDisableFields(fieldsForm.endDate, 'value', '');
    // Update new requirement
    // this.updateDisableFields(fieldsForm.startDate, 'disabled', isAlwaysON);
    // this.updateDisableFields(fieldsForm.startDate, 'value', '');
  };

  onChangeProduct = (e, newFieldArray) => {
    const { product } = this.state;
    const value = e.target.value;
    const categoryData = product.find((el) => el.value === value)
      .childCategories.filter(item => item.categoryCode !== BranchBOM.category.combo);
    const fieldCategory =
      newFieldArray?.find((field) => field.fieldName === BranchBOM.categoryCode) || {};
    const valueLevel =
      newFieldArray?.find((field) => field.fieldName ===  BranchBOM.level).value;
    fieldCategory.data = formatDropdownList(categoryData);
    if (categoryData.length > 0 && valueLevel !== BranchBOM.levels.level_3) {
      fieldCategory.disabled = false;
    } else {
      fieldCategory.disabled = true;
    }
  };

  onChangeStartDate = (e) => {
    const startDate = e.target.value;
    this.updateDisableFields(fieldsForm.endDate, 'minDate', startDate);
  };

  onChangeEndDate = (e) => {
    const endDate = e.target.value;
    this.updateDisableFields(fieldsForm.startDate, 'maxDate', endDate);
  };

  onChangeQuantityHeader = (e, newFieldArray) => {
    const quantityType = newFieldArray.find(item => item.label === BranchBOM.quantity).operator.value;
    const decimal = quantityType === BranchBOM.quantityUnit.KG ? true : false;
    this.updateDisableFields(
      fieldsForm.quantity, 'searchInput.isDecimal', decimal);
    this.updateDisableFields(
      fieldsForm.quantity, 'searchInput.maxVal', decimal ? 999999999.999 : 999999999);
    this.updateDisableFields(
      fieldsForm.quantity, 'searchInput.value', 0);
  }

  // Load order type option data for multiselect field
  loadProduct = () =>
    getDataProductType().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.product,
        property: 'data',
        updatedData: formatDropdownList(data),
      });
      this.setState({ product: formatDropdownList(data) });
    });

  loadPrice = () =>
    getDataPriceType().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.price,
        property: 'data',
        updatedData: formatDropdownList(data),
      });
      this.setState({ price: formatDropdownList(data) });
    });
  loadCategory = () =>
    getDataCategoryType().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.category,
        property: 'data',
        updatedData: formatDropdownList(data),
      });
      this.setState({ categories: formatDropdownList(data) });
    });
  loadSubCategory = () =>
    getDataSubCategoryType().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.sub_cate,
        property: 'data',
        updatedData: formatDropdownList(data),
      });
      this.setState({ sub_cate: formatDropdownList(data) });
    });
  loadLevel = () =>
    getDataBomBranchLevelType().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.level,
        property: 'data',
        updatedData: formatComboBox(data),
      });
      this.setState({ levels: formatComboBox(data) });
    });
  loadQuantity = () =>
    getDataBomBranchQuantityType().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.quantity,
        property: 'operator.data',
        updatedData: formatComboBox(data),
      });
      this.updateDetailFieldArray({
        fieldName: fieldsForm.quantity,
        property: 'operator.value',
        updatedData:
          formatComboBox(data).length > 0 ? formatComboBox(data)[1].value : '',
      });
      this.setState({ quantity: formatComboBox(data) });
    });

  loadCompanyCode = () =>
    getDataCompanyCode().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.companyCode,
        property: 'data',
        updatedData: formatDropdownList(data),
      });
      this.setState({ companyCode: formatDropdownList(data) });
    });
  loadIndicator = () =>
    getDataIndicator().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.indicatorCode,
        property: 'data',
        updatedData: formatComboBox(data),
      });
      this.setState({
        configItemDataOnGrid: {
          indicator: formatComboBox(data),
          displayIndicatorDetail: true,
        },
      });
    });
  loadDivision = () =>
    getDataDivision().then((res) => {
      const { data } = res;
      this.updateDetailFieldArray({
        fieldName: fieldsForm.division,
        property: 'data',
        updatedData: formatComboBox(data),
      });
      this.setState({ division: formatComboBox(data) });
    });
  loadMultipleSelect = () => {
    let statusDB = [];
    let materialType = [];
    let materialGroupDB = [];
    // Status Data
    getDataStatusType().then((res) => {
      const { data } = res;
      statusDB = formatComboBox(data);
    });
    // Material Type Data
    getMaterialType().then((res) => {
      const { data } = res;
      materialType = formatDropdownList(data);
    });
    // Material Group Data
    getMaterialGroup().then((res) => {
      const { data } = res;
      materialGroupDB = formatDropdownList(data);
      this.setState({
        status: statusDB,
        materialType: materialType,
        materialGroup: materialGroupDB,
      });
    });
  };

  // Button update status
  handleButton = (action) => {
    const { dataDetail } = this.state;
    let title = '';
    let content = '';
    let status;

    if (action === BranchBOM.statusName.active) {
      title = Message.CONFIRM;
      content = Message.BRANCH_BOM.ACTIVE_CONFIRM;
      status = BranchBOM.status.active;
    } else if (action === BranchBOM.statusName.inactive) {
      title = Message.CONFIRM;
      content = Message.BRANCH_BOM.IN_ACTIVE_CONFIRM;
      status = BranchBOM.status.inactive;
    } else if (action === BranchBOM.statusName.confirmed) {
      title = Message.INFORMATION;
      content = Message.BRANCH_BOM.CONFIRM;
      status = BranchBOM.status.confirmed;
    } else if (action === BranchBOM.statusName.unconfirmed) {
      title = Message.INFORMATION;
      content = Message.BRANCH_BOM.UN_CONFIRM;
      status = BranchBOM.status.unconfirmed;
    } else if (action === BranchBOM.statusName.closed) {
      title = Message.CONFIRM;
      content = Message.BRANCH_BOM.CLOSE_CONFIRM;
      status = BranchBOM.status.closed;
    }
    const paramsUpdateStatus = {
      ...dataDetail,
      status: status,
    };
    openDialog({
      title: title,
      content: content.replace('<BOM Code>', ` ${dataDetail.bomBranchCode}`)
        .replace('<BOM Name>', ` ${dataDetail.bomBranchName}`),
      actions: [
        {
          name: this.props.t(Action.cancel),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: this.props.t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            insertBranchBOM(paramsUpdateStatus, Action.update)
              .then((res) => {
                if (!res.message) {
                  this.props.history.push('/catalog/branch-bom');
                  this.setState({
                    statusBranchBOM: status,
                  });
                } else {
                  openDialog({
                    title: Message.warning,
                    content: res.message.messages[0].messageContent,
                    actions: [
                      {
                        name: 'OK',
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                        action: () => {},
                      },
                    ],
                  });
                }
              })
              .catch(() => {
                openDialog({
                  title: Message.warning,
                  content: Message.SAVE_UNSUCCESSFULLY,
                });
              });
          },
        },
      ],
    });
  };
  handleActive = () => {
    this.handleButton(BranchBOM.statusName.active);
  };

  handleInActive = () => {
    this.handleButton(BranchBOM.statusName.inactive);
  };

  handleConfirm = () => {
    const { dataDetail } = this.state;
    const toDate = formatDateString(
      new Date(),
      dateFormat.savingDateTimeStartDate,
      true
    );
    if (
      (+dataDetail.startDate > +toDate && +toDate < +dataDetail.endDate) 
      || (+dataDetail.startDate > +toDate  && dataDetail.alwaysOn === 1) 
    ) {
      this.handleButton(BranchBOM.statusName.confirmed);
      return;
    }
    else if(
      (+dataDetail.startDate <= +toDate && +toDate <= +dataDetail.endDate)
      || (+dataDetail.startDate <= +toDate && dataDetail.alwaysOn === 1)
    ){
      this.handleButton(BranchBOM.statusName.active);
      return;
    }
    openDialog({
      title: Message.ERROR,
      content: Message.BRANCH_BOM.NOT_CONFIRM.replace(
        '<BOM Code>',
        ` ${dataDetail.bomBranchCode}`
      ).replace(
        '<BOM Name>', 
        `${dataDetail.bomBranchCode}`
      ),
      actions: [
        {
          name: this.props.t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  handleUnConfirm = () => {
    this.handleButton(BranchBOM.statusName.unconfirmed);
  };

  handleClose = () => {
    this.handleButton(BranchBOM.statusName.closed);
  };

  handleEdit = () => {
    const { dataDetail } = this.state;
    this.props.history.push(`/catalog/branch-bom/edit/${dataDetail.id}`);
  };

  //Edit branch BOM
  updateDataDetail = () => {
    const { isEditPage, idItem, getBranchBOMCode } = this.props;
    const {
      product,
      price,
      sub_cate,
      levels,
      quantity,
      companyCode,
      division,
      configItemDataOnGrid,
    } = this.state;

    getItemDetail(idItem).then((res) => {
      const categoryData = formatComboBox(
        product.find((el) => el.value === res.data.productCode).childCategories
      );
      const levelPopup = levels.filter(
        (element) => element.value > res.data.level
      );
      if (isEditPage) {
        this.originBranchBOM = {...res.data};
        this.updateAllFieldArray(
          getFields(
            this.onOrderTypeChange,
            this.serviceMaterial,
            this.alwaysON,
            this.onChangeProduct,
            this.onChangeStartDate,
            this.onChangeQuantityHeader,
            this.onChangeEndDate,
            isEditPage,
            res.data,
            product,
            price,
            categoryData,
            sub_cate,
            levels,
            quantity,
            companyCode,
            division,
            configItemDataOnGrid.indicator
          )
        );
        this.setState({
          valueActions: String(res.data.level),
          isServiceMaterial: res.data.serviceMaterial,
          validate: validation(
            String(res.data.level),
            res.data.alwaysOn === 1 ? true : false
          ),
          configItemDataOnGrid: {
            ...configItemDataOnGrid,
            displayIndicatorDetail:
              String(res.data.level) === BranchBOM.levels.level_1
                ? false
                : true,
          },
          levelPopup
        });
      } else {
        this.setState({
          dataDetail: res.data,
          statusBranchBOM: res.data.status,
        });
      }
      getBranchBOMCode(res.data.bomBranchCode);
      res.data.bomBranchDetailRestVOs?.map(itemRow => {
        itemRow.lineNumber = itemRow.lineItem;
        return itemRow;
      });
      this.updateDataDetailsOnGrid({
        data: convertItemDataStructure(
          res.data.bomBranchDetailRestVOs,
          this.informationConvert
        ),
      });
    });
  };

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    const { entity } = this.state;
    let searchPopup = {};
    if (entity === ConfigEntity.BOM_BRANCH) {
      const reStructureParam = reStructureFields(searchFields);
      searchPopup = reStructureParam;
    }
    if (entity === ConfigEntity.MATERIAL) {
      const reStructureParam = {
        // Search exactly for code
        sku: {
          like:
            searchFields.sku && searchFields.sku.length > 0
              ? searchFields.sku?.trim()
              : undefined,
        },
        materialDescription: {
          // Search like with name
          like:
            searchFields.description && searchFields.description.length > 0
              ? searchFields.description?.trim()
              : undefined,
        },
        materialType: {
          in:
            searchFields.materialType && searchFields.materialType.length > 0
              ? searchFields.materialType?.map(
                (searchFields) => searchFields.value
              )
              : undefined,
        },
        materialGroup: {
          in:
            searchFields.materialGroup && searchFields.materialGroup.length > 0
              ? searchFields.materialGroup?.map(
                (searchFields) => searchFields.value
              )
              : undefined,
        },
      };
      searchPopup = reStructureParam;
    }
    if (entity === ConfigEntity.BOM_GROUP) {
      const reStructureParam = {
        bomGroupCode: {
          like:
            searchFields.bomGroupCode && searchFields.bomGroupCode.length > 0
              ? searchFields?.bomGroupCode
              : undefined,
        },
        bomGroupName: {
          like:
            searchFields.bomGroupName && searchFields.bomGroupName.length > 0
              ? searchFields?.bomGroupName
              : undefined,
        },
        level: {
          in:
            searchFields.level && searchFields.level.length > 0
              ? searchFields.level?.map(searchFields => searchFields.value)
              : undefined,
        },
      };
      searchPopup = reStructureParam;
    }
    return searchPopup;
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsDataDefault = () =>
    trackPromise(
      new Promise((resolve) => {
        resolve({});
      })
    );

  isValidDetailListInformation = (detailList, level) => {
    const isInvalidQuantity = [];
    const isInvalidIndicator = [];
    const errorMsg = [];
    if (level === BranchBOM.levels.level_1) {
      detailList.forEach((el) => {
        if (!el.indicatorCode) {
          isInvalidIndicator.push(el.lineItem);
        }
      });
    }

    detailList.forEach((el) => {
      if (
        el.entity === ConfigEntity.BOM_GROUP &&
        !el.quantity &&
        el.buffet === 0
      ) {
        isInvalidQuantity.push(el.lineItem);
      } else if (el.entity !== ConfigEntity.BOM_GROUP && !el.quantity) {
        isInvalidQuantity.push(el.lineItem);
      }
    });

    if (isInvalidIndicator.length > 0) {
      errorMsg.push(
        `${BranchBOM.indicator} ${Message.common['comMSG001']}
        <No: ${isInvalidIndicator.join(', ')}>`
      );
    }
    if (isInvalidQuantity.length > 0) {
      errorMsg.push(
        `${BranchBOM.quantity} ${Message.common['comMSG001']}
        <No: ${isInvalidQuantity.join(', ')}>`
      );
    }

    if (errorMsg.length > 0) {
      openDialog({
        title: Message.warning,
        type: dialogConstant.type.WARNING,
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

  onCustomSaveDraft = (fieldArray, dataDetailsOnGrid) => {
    const { isServiceMaterial } = this.state;
    const { isEditPage, idItem } = this.props;
    let isHeadersChanged = false;
    let isDetailChanged = false;

    let dataPostFieldArr = {};
    fieldArray.map((object) => {
      if (object.fieldName === fieldsForm.quantity) {
        dataPostFieldArr[object.operator.fieldName] = object.operator.value;
        dataPostFieldArr[object.searchInput.fieldName] = +object.searchInput
          .value;
      } else if (
        object.fieldName === fieldsForm.startDate ||
        object.fieldName === fieldsForm.endDate
      ) {
        dataPostFieldArr[object.fieldName] = formatDateString(
          object.value,
          dateFormat.savingDateTime,
          true
        );
      } else if (
        object.fieldName === fieldsForm.alwaysOn ||
        object.fieldName === fieldsForm.serviceMaterial
      ) {
        dataPostFieldArr[object.fieldName] = object.value ? 1 : 0;
      } else {
        dataPostFieldArr[object.fieldName] = object.value;
      }
      return dataPostFieldArr;
    });

    const dataPostDetailOnGrid = dataDetailsOnGrid?.data?.map((object) => {
      let data = {
        lineItem: object.no,
        entity: object.entity,
        quantity: object.quantity,
        indicatorCode: object.indicator || object.indicatorCode,
        startDate: dataPostFieldArr.startDate,
        endDate: dataPostFieldArr.endDate,
      };
      if (object.entity === ConfigEntity.MATERIAL) {
        data = { ...data, itemCode: object.sku || object.itemCode };
      } else if (object.entity === ConfigEntity.BOM_BRANCH) {
        data = { ...data, bomBranchCode: object.bomBranchCode };
      } else {
        data = {
          ...data,
          bomGroupCode: object.bomGroupCode || object.branchGroupCode,
          buffet: object.buffet ? 1 : 0,
          dishQuantity: object.dishQuantity,
        };
      }
      return data;
    });

    dataPostFieldArr = {
      ...dataPostFieldArr,
      id: idItem || '',
      bomBranchDetailRestVOs: dataPostDetailOnGrid,
    };

    if (isEditPage) {
      const originDetail = [...this.originBranchBOM?.bomBranchDetailRestVOs];
      const updatedDetail = [...dataPostFieldArr?.bomBranchDetailRestVOs];
  
      // Check change header or data grid detail
      isHeadersChanged = !compareFields.every((fieldName) => {
        return (
          this.originBranchBOM[fieldName] ? (this.originBranchBOM[fieldName] === dataPostFieldArr[fieldName]) : true
        );
      });

      if (originDetail.length !== updatedDetail.length) {
        isDetailChanged = true;
      } else {
        updatedDetail.forEach(updatedItem => {
          if (!isDetailChanged) {
            const originItemIndex = originDetail.findIndex(
              el => el.itemCode ?  el.itemCode === updatedItem.itemCode :
                el.bomGroupCode ?  el.bomGroupCode === updatedItem.bomGroupCode : el.bomBranchCode === updatedItem.bomBranchCode
            );
            if (!originDetail[originItemIndex]) {
              isDetailChanged = true;
            } else {
              isDetailChanged = !comparedDetail.every((fieldName) => {
                return (
                  updatedDetail.length > 0 &&
                  fieldName === 'quantity' ?
                    +originDetail[originItemIndex][fieldName] === +updatedItem[fieldName] :
                    originDetail[originItemIndex][fieldName] === updatedItem[fieldName]
                );
              });
            }
          }
        });
      }
    }

    const promise = new Promise((resolve, reject) => {
      if (isEditPage && !isHeadersChanged && !isDetailChanged) {
        openDialog({
          title: Message.INFORMATION,
          content: Message.BRANCH_BOM.NOTHING_CHANGED,
          type: dialogConstant.type.INFORMATION,
          actions: [
            {
              name: this.props.t(Action.ok),
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
        reject();
        return;
      }
      if (!dataPostDetailOnGrid && !isServiceMaterial) {
        openDialog({
          title: Message.warning,
          content: Message.BRANCH_BOM.VALIDATE_TABLE_GRID,
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
      } else if (
        dataPostDetailOnGrid &&
        !this.isValidDetailListInformation(
          dataPostDetailOnGrid,
          dataPostFieldArr.level
        )
      ) {
        reject();
      } else {
        insertBranchBOM(
          dataPostFieldArr,
          isEditPage ? Action.update : Action.insert
        )
          .then((res) => {
            if (!res.message) {
              const msg = isEditPage ? Message.BRANCH_BOM.UPDATE_BRANCH_BOM : Message.BRANCH_BOM.SAVE_DRAFT_CONFIRM;
              openDialog({
                title: Message.INFORMATION,
                content: msg.replace(
                  '<BOM Code>',
                  ` ${res.data.bomBranchCode}`
                ).replace(
                  '<BOM Name>',
                  ` ${res.data.bomBranchName}`
                ),
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
            else{
              openDialog({
                title: Message.warning,
                content: res.message.messages[0].messageContent,
                actions: [
                  {
                    name: 'OK',
                    type: dialogConstant.button.FUNCTION,
                    className: buttonConstant.type.PRIMARY,
                    action: () => {},
                  },
                ],
              });
            }
          })
          .catch(() => {
            openDialog({
              title: Message.warning,
              content: Message.SAVE_UNSUCCESSFULLY,
              actions: [
                {
                  name: this.props.t(Action.ok),
                  type: dialogConstant.button.FUNCTION,
                  className: buttonConstant.type.PRIMARY,
                  action: () => {},
                },
              ],
            });
            reject();
          });
      }
    });
    return promise;
  };

  componentDidMount() {
    const { isEditPage, isDetailsPage } = this.props;
    const initData = [
      this.loadProduct(),
      this.loadPrice(),
      this.loadCategory(),
      this.loadSubCategory(),
      this.loadLevel(),
      this.loadQuantity(),
      this.loadMultipleSelect(),
      this.loadCompanyCode(),
      this.loadIndicator(),
      this.loadDivision(),
    ];
    Promise.all(initData).then((res) => {
      this.loadMultipleSelect();
      this.updateAllAddItemsFieldArray(addItemsFieldArray);
      if (isEditPage || isDetailsPage) {
        this.updateDataDetail();
      }
    });
    this.loadMultipleSelect();
  }

  addBranchBomHandler = () => {
    const { levelPopup, product, status } = this.state;
    const newCategoryArr = [];
    product.forEach((item) => {
      newCategoryArr.push(...item.childCategories);
    });
    this.rowSizePopUp = 3;
    this.updateAllAddItemsFieldArray(
      addItemsFieldArray(levelPopup, formatDropdownList(newCategoryArr), status)
    );
    this.setState({
      entity: ConfigEntity.BOM_BRANCH,
      titleSelectPopup: 'Select Branch BOM',
      informationConvert: informationConvert.BOM_BRANCH,
    });
    this.loadAddItemsData = (params) => {
      const paramSearch = {
        level: { in: levelPopup?.map((param) => param.value) },
        countFlag: 1,
        deleteFlag: 0,
        status: { in: [String(BranchBOM.status.active)] },
        ...params
      };
      return trackPromise(
        getBranchBomList(paramSearch).then(
          (res) =>
            new Promise((resolve) => {
              const branchBOMList = res.data.map((item) => ({
                ...item,
                quantity: 0,
              }));
              res.data = branchBOMList;
              resolve({ ...res, entity: ConfigEntity.BOM_BRANCH });
            })
        )
      );
    };
  };

  addMaterialHandler = () => {
    const { materialGroup, materialType } = this.state;
    this.rowSizePopUp = 4;
    this.updateAllAddItemsFieldArray(
      addItemsFieldsMaterials(materialType, materialGroup)
    );
    this.setState({
      entity: ConfigEntity.MATERIAL,
      titleSelectPopup: 'Select Items',
      informationConvert: informationConvert.MATERIAL,
    });
    this.loadAddItemsData = (params) => {
      const paramSearch = {
        ...params,
        countFlag: 1,
        deleteFlag: 0,
      };
      return trackPromise(
        getMaterial(paramSearch).then(
          (res) =>
            new Promise((resolve) => {
              resolve({ ...res, entity: ConfigEntity.MATERIAL });
            })
        )
      );
    };
  };

  addBranchBomGroup = () => {
    const { levelPopup } = this.state;
    this.rowSizePopUp = 3;
    this.updateAllAddItemsFieldArray(addItemsFieldsGroup(levelPopup));
    this.setState({
      entity: ConfigEntity.BOM_GROUP,
      titleSelectPopup: 'Select Branch BOM Group',
      informationConvert: informationConvert.BOM_GROUP,
    });
    this.loadAddItemsData = (params) => {
      const paramSearch = {
        level: { in: levelPopup?.map((param) => param.value) },
        countFlag: 1,
        deleteFlag: 0,
        ...params,
      };
      return trackPromise(
        getAllBranchBOMGroup(paramSearch).then(
          (res) =>
            new Promise((resolve) => {
              resolve({ ...res, entity: ConfigEntity.BOM_GROUP });
            })
        )
      );
    };
  };

  onCustomEdit = () => {
    const { idItem } = this.props;
    const url = '/catalog/branch-bom/edit/';
    return url + idItem;
  };

  componentWillUnmount() {
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
    const {
      addItemsFieldList,
      isEditPage,
      isDetailsPage,
      history,
    } = this.props;
    const {
      valueActions,
      dataDetail,
      statusBranchBOM,
      isServiceMaterial,
      configItemDataOnGrid,
      validate,
      titleSelectPopup,
      informationConvert,
    } = this.state;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields(
        this.onOrderTypeChange,
        this.serviceMaterial,
        this.alwaysON,
        this.onChangeProduct,
        this.onChangeStartDate,
        this.onChangeQuantityHeader,
        this.onChangeEndDate,
        isEditPage
      );
      this.updateAllFieldArray(this.fieldArray);
    }
    const listConfig = {
      actions: actions({
        addBranchBomHandler: this.addBranchBomHandler,
        addMaterialHandler: this.addMaterialHandler,
        addBranchBomGroup: this.addBranchBomGroup,
        hidden: valueActions,
        isServiceMaterial: isServiceMaterial,
      }),
      options: options(isDetailsPage),
      history,
      validation: validate,
      addItemsFieldList,
      informationConvert: informationConvert,
      columnsDetail,
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
      onCustomSave: this.onCustomSaveDraft,
      updateFormFieldsArray: this.updateFormFieldsArray,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
      isNoHistory: true,
      rowSizePopUp: this.rowSizePopUp,
      classPopUp: `Grid-PopUp-BOM-${this.rowSizePopUp}`,
      isDetailsPage,
      fieldsLabelArray: getFieldsTextOnly(dataDetail),
      rowSize: isDetailsPage ? 3 : 4,
      classFormFieldCustom: 'return-request-general-info-form',
      isHiddenBtnSubmit: true,
      customClassNameForDetailGrid: 'grid-large-content',
      bottomGridButtonsArray:
        (isDetailsPage &&
          bottomGridButtons(
            statusBranchBOM,
            this.handleActive,
            this.handleInActive,
            this.handleUnConfirm,
            this.handleConfirm,
            this.handleClose,
            this.handleEdit
          )) ||
        [],
      isMultipleAddItemsEntity: true,
      onCustomEdit: this.onCustomEdit,
      configItemDataOnGrid,
      titleSelectPopup: titleSelectPopup,
    };
    return (
      <>
        <DetailForm {...listConfig} />
      </>
    );
  }
}

BranchBomForm.propTypes = {
  t: PropTypes.any,
  updateDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.any,
  dataDetailsOnGrid: PropTypes.object,
  updateDataDetailsOnGrid: PropTypes.func,
  isEditPage: PropTypes.bool,
  idItem: PropTypes.any,
  isDetailsPage: PropTypes.bool,
  history: PropTypes.object,
  getBranchBOMCode: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    addItemsFieldList: state.addItemsFormStore.fieldArray,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(BranchBomForm));
