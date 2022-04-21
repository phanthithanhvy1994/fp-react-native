import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { trackPromise } from 'react-promise-tracker';
import { updateBranchBOMGroup, addBranchBOMGroup } from '../../../../actions/branch-bom-group.action';
import { showError } from '../branch-bom-group.util';
import { Message } from '../../../../constants/messages';

import {
  ActionType,
  ConfigEntity,
  Action,
  OrderConstant,
  BranchBOM
} from '../../../../constants/constants';

import { getDataBomBranchLevelType, getBranchBomList } from '../../../../actions/branch-bom-action';
import { getBranchBOMGroup } from '../../../../actions/branch-bom-group.action';

import {
  getFields,
  getFieldsTextOnly,
  validation,
  columnsDetail,
  options,
  actions,
  addItemsFieldArray,
  fieldsForm,
  informationConvert,
  bottomGridButtons,
} from './branch-bom-group-form.config';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import { getUserInfo } from '../../../../actions/auth-action';
import { convertItemDataStructure } from '../../../material/material.common';
import { formatComboBox } from '../../../../util/format-util';
import { reStructureFields } from '../branch-bom-group.util';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../../util/constant';

class BranchBomGroupForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      btnActions: '',
      // valueActions: '',
      levels: [],
      levelPopup: [],
      dataBranchBOM: {},
      dataDetail: {},
      statusBranchBOM: '',
      validate: validation(),
      entity: '',
      configItemDataOnGrid: [],
      titleSelectPopup: 'Select Branch BOM',
      notAllowConfirmLeavePage: false
    };
    this.loggedUser = getUserInfo();
    // Get dispatch action from props to use it to update data state later
    this.updateDetailFieldArray = props.updateDetailFieldArray;
    this.updateAllFieldArray = props.updateAllFieldArray;
    this.updateDetailAddItemsFieldArray = props.updateDetailAddItemsFieldArray;
    this.updateAllAddItemsFieldArray = props.updateAllAddItemsFieldArray;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
    this.updateAddItemsSelections = props.updateAddItemsSelections;
    this.rowSizePopUp = 3;
    this.loadAddItemsData = this.loadAddItemsDataDefault;
    this.informationConvert = [];
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

  loadLevel = () =>
    getDataBomBranchLevelType().then((res) => {
      const { data } = res;
      const defaultValue = {
        value: '2',
        isArray: false
      };
      this.updateDetailFieldArray({
        fieldName: fieldsForm.level,
        property: 'data',
        updatedData: formatComboBox(data),
        defaultValue: defaultValue,
      });
      this.setState({ levels: formatComboBox(data) });
    });

  componentDidMount() {
    const { isEditPage, isDetailsPage } = this.props;
    const initData = [
      this.loadLevel(),
    ];
    Promise.all(initData).then((res) => {
      this.updateAllAddItemsFieldArray(addItemsFieldArray);
      if (isEditPage || isDetailsPage) {
        this.updateDataDetail();
      }
    });
  }

  // Toogle 'Select Branch Boms' and 'Remove Branch Boms'
  // onOrderTypeChange = (e) => {
  //   const {valueActions} = this.state;
  //   const selectedValue = e.target.value;
  //   const dataDetailsOnGrid = this.dataDetailsOnGrid;
  //   if(dataDetailsOnGrid && dataDetailsOnGrid.data.length > 0){
  //     openDialog({
  //       title: Message.warning,
  //       content: Message.BRANCH_BOM_GROUP.CONFIRM_CHANGE_LEVEL,
  //       actions: [
  //         {
  //           name: this.props.t(Action.cancel),
  //           type: dialogConstant.button.FUNCTION,
  //           className: buttonConstant.type.CANCEL,
  //           action: () =>{
  //             this.updateDetailFieldArray({
  //               fieldName: OrderConstant.level,
  //               property: 'value',
  //               updatedData: String(valueActions),
  //             });
  //           }
  //         },
  //         {
  //           name: 'OK',
  //           type: dialogConstant.button.FUNCTION,
  //           className: buttonConstant.type.PRIMARY,
  //           action: () => {
  //             this.updateDataDetailsOnGrid({ data: [] });
  //             this.changeLevel(selectedValue);
  //           },
  //         },
  //       ],
  //     });
  //   } else {
  //     this.changeLevel(selectedValue);
  //   }
  // }

  // changeLevel = (selectedValue) => {
  //   const {levels} = this.state;
  //   if (selectedValue.length > 0) {
  //     const levelPopup = levels.filter((element) => element.value === selectedValue);
  //     this.setState({
  //       valueActions: selectedValue,
  //       levelPopup
  //     });
  //   } else {
  //     this.setState({
  //       valueActions: '',
  //     });
  //   }
  // }

  //Pop Up Select Branch BOM Group
  addBranchBomGroupHandler = () => {
    this.rowSizePopUp = 3;
    this.updateAllAddItemsFieldArray(
      addItemsFieldArray()
    );
    this.setState({
      entity: ConfigEntity.BOM_BRANCH,
    });
    this.loadAddItemsData = (params) => {
      const paramSearch = {
        ...params,
        countFlag: 1,
        deleteFlag: 0,
        status: { in: [String(BranchBOM.status.active)] },
        level: { in: [BranchBOM.levels.level_2] },
      };
      // }
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

  handleEdit = () => {
    const { dataDetail } = this.state;
    this.props.history.push(`/catalog/branch-bom-group/Edit-Branch-BOM-Group/${dataDetail.bomGroupId}`);
  };

  //Edit branch BOM Group
  updateDataDetail = () => {
    const { isEditPage, idItem, getBranchBOMGroupCode } = this.props;
    const { levels } = this.state;
    getBranchBOMGroup({ id: idItem }).then((res) => {
      if (isEditPage) {
        if(res.data.existed === BranchBOM.existsInBranchBom) {
          this.setState({ notAllowConfirmLeavePage: true }, () => {
            this.props.history.push('/404');
          });
        } else {
          const levelPopup = levels.filter((el) => +el.value === res.data.level);
          this.updateAllFieldArray(
            getFields(
              // this.onOrderTypeChange,
              // isEditPage,
              res.data,
              levels,
            )
          );
          this.setState({
            dataDetail: res.data,
            // valueActions: String(res.data.level),
            levelPopup
          });
        }
      } else {
        this.setState({
          dataDetail: res.data,
        });
      }
      getBranchBOMGroupCode(res.data.bomGroupCode);
      this.updateDataDetailsOnGrid({
        data: convertItemDataStructure(
          res.data?.bomBranchDetailRestVOS?.map((item, index) => {
            item.no = index + 1;
            return item;
          }),
          this.informationConvert
        ),
      });
    });
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

  // filterDetail = (data) => {
  //   return {
  //     ...data,
  //     bomBranchDetailRestVOS: data.bomBranchDetailRestVOS?.map((branchBOM) => {
  //       return {
  //         bomBranchCode: branchBOM.bomBranchCode,
  //       };
  //     }),
  //   };
  // };

  //Save Branch Bom Group:
  onCustomSave = () => {
    const { fieldArray, dataDetailsOnGrid, isEditPage } = this.props;
    const {dataDetail} = this.state;
    const dataDetails = dataDetailsOnGrid?.data;
    let updatedBOMGroupHeaders = this.mapGeneralInformationForSaving(fieldArray);
    let data;

    if (dataDetails) {
      data = {
        ...dataDetail,
        ...updatedBOMGroupHeaders
      };

      data.bomBranchDetailRestVOS = dataDetails;

    };

    const promise = new Promise((resolve, reject) => {
      if (!data || !data.bomBranchDetailRestVOS ||  data.bomBranchDetailRestVOS.length ===0) {
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
        reject();
      } else {
        if(isEditPage) {
          const updatedBOMGroup = {
            ...data,
            bomGroupId: data.bomGroupId,
          };
          updateBranchBOMGroup(updatedBOMGroup).then(
            (res) => {
              if (res && res.status === '200') {
                if (res.message && res.message.messages) {
                  showError(res.message.messages[0].messageContent);
                } else {
                  openDialog({
                    title: Message.INFORMATION,
                    content: Message.BRANCH_BOM_GROUP.UPDATE_SUCCESSFUL.replace(
                      '<bomGroupName>',
                      `${updatedBOMGroup.bomGroupName}`
                    ).replace(
                      '<bomGroupCode>',
                      `${updatedBOMGroup.bomGroupCode}`
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
                  this.updateAddItemsSelections([]);
                }
              }
            },
            (err) => {
              showError(err.messages[0].messageContent);
            }
          );
        } else {
          addBranchBOMGroup(data).then(
            (res) => {
              if (res && res.status === '200') {
                if (res.message && res.message.messages) {
                  showError(res.message.messages[0].messageContent);
                } else {
                  openDialog({
                    title: Message.INFORMATION,
                    content: Message.BRANCH_BOM_GROUP.ADD_SUCCESSFUL.replace(
                      '<bomGroupName>',
                      `${data.bomGroupName}`
                    ).replace(
                      '<bomGroupCode>',
                      `${res.data.bomGroupCode}`
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
                  this.updateAddItemsSelections([]);
                }
              }
            }, 
            (err) => {
              showError(err.messages[0].messageContent);
            }
          );
        }
      }
    });
    return promise;
  }

  // Get search params in 'Add items' form
  getAddItemsParams = (searchFields) => {
    return reStructureFields(searchFields);
  };

  // Handler for loading specific data for 'Add items' form
  loadAddItemsDataDefault = () =>
    trackPromise(
      new Promise((resolve) => {
        resolve({});
      })
    );

  componentWillUnmount() {
    this.fieldArray = [];
    this.dataDetailsOnGrid = {};
  }

  //Page navigation
  updateDataDetailsOnGridForEachPage = (dataDetailsOnGrid) => {
    this.dataDetailsOnGrid = dataDetailsOnGrid;
  };

  render() {
    const {
      addItemsFieldList,
      isDetailsPage,
      history,
    } = this.props;
    const {
      dataDetail,
      configItemDataOnGrid,
      validate,
      titleSelectPopup,
      // valueActions
    } = this.state;
    if (!this.fieldArray || this.fieldArray.length === 0) {
      this.fieldArray = getFields();
      this.updateAllFieldArray(this.fieldArray);
    }
    const listConfig = {
      actions: actions({
        addBranchBomGroupHandler: this.addBranchBomGroupHandler,
        isDetailsPage,
      }),
      options: options(isDetailsPage),
      history,
      totalSummarizeInGrid: [],
      validation: validate,
      addItemsFieldList,
      informationConvert,
      columnsDetail: columnsDetail(isDetailsPage),
      convertItemDataStructure,
      getAddItemsParams: this.getAddItemsParams,
      loadAddItemsData: this.loadAddItemsData,
      updateFormFieldsArray: this.updateFormFieldsArray,
      updateDataDetailsOnGridForEachPage: this
        .updateDataDetailsOnGridForEachPage,
      isNoHistory: true,
      rowSizePopUp: this.rowSizePopUp,
      classPopUp: `Grid-PopUp-BOM-${this.rowSizePopUp}`,
      isDetailsPage,
      fieldsLabelArray: getFieldsTextOnly(dataDetail),
      rowSize: 3,
      classFormFieldCustom: 'return-request-general-info-form',
      isHiddenBtnSubmit: isDetailsPage,
      titleSubmit: 'Save',
      onCustomSave: this.onCustomSave,
      customClassNameForDetailGrid: 'grid-large-content',
      bottomGridButtonsArray:
        (isDetailsPage &&
          bottomGridButtons(
            this.handleEdit,
            isDetailsPage,
            dataDetail
          )) ||
        [],
      isMultipleAddItemsEntity: true,
      onCustomEdit: this.onCustomEdit,
      configItemDataOnGrid,
      titleSelectPopup: titleSelectPopup,
      isHiddenBtnDraft: true,
      notAllowConfirmLeavePage: this.state.notAllowConfirmLeavePage,
    };
    return (
      <>
        <DetailForm {...listConfig} />
      </>
    );
  }
}

BranchBomGroupForm.propTypes = {
  t: PropTypes.any,
  updateDetailFieldArray: PropTypes.any,
  updateAllFieldArray: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  updateAddItemsSelections: PropTypes.func,
  addHandler: PropTypes.func,
  addItemsFieldList: PropTypes.any,
  updateDataDetailsOnGrid: PropTypes.func,
  isEditPage: PropTypes.bool,
  idItem: PropTypes.any,
  isDetailsPage: PropTypes.bool,
  history: PropTypes.object,
  getBranchBOMGroupCode: PropTypes.func,
  getUpdatedBOMGroup: PropTypes.func,
  fieldArray: PropTypes.any,
  dataDetailsOnGrid: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    addItemsFieldList: state.addItemsFormStore.fieldArray,
    fieldArray: state.detailFormStore.fieldArray,
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid
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
  updateAddItemsSelections: (data) =>
    dispatch({
      type: ActionType.UPDATE_ADD_ITEMS_SELECTIONS,
      addItemsSelections: data,
    })
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(BranchBomGroupForm));
