import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import { trackPromise } from 'react-promise-tracker';

import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import { 
  columnsDetail,
  options,
  fieldArray,
  actions,
  addItemsFieldArray,
  validation,
  totalSummarizeInGrid
} from './petty-cash-form.config';
import {
  convertItemDataStructure,
} from './petty-cash-form.common';
import {
  getMaterialGroup,
  getMaterialType,
  getMaterialList,
  uploadImages,
  savePoPettyCash,
  getVendor
} from '../../../../actions/petty-cash-action';
import { getAllBranchCombo } from '../../../../actions/branch.action';

import useStyles from './petty-cash-form.style';
import { Action, ActionType, dateFormat, POPettyCashConstant, ReturnRequestConstant } from '../../../../constants/constants';
import { formatDropdownList } from '../../../../util/format-util';
import { mapPropertyForRequestParams, setPropertyForRequestParams, updatePropertyForRequestParams } from '../../../shared/search-form/search-form.common';
import { formatDateString } from '../../../../util/date-util';
import { Message } from '../../../../constants/messages';
import { buttonConstant, dialogConstant } from '../../../../util/constant';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';

const PettyCashForm = props => {
  const { 
    classes,
    history,
    isEditPage
  } = props;

  const [validate, setValidate]= useState(validation(false));
  const [pettyCashDetailItemVOs, setPettyCashDetailItemVOs]= useState([]);

  const informationConvert = [
    { label: ReturnRequestConstant.sku },
    { label: ReturnRequestConstant.description },
    { label: ReturnRequestConstant.orderUnit, color: 'secondary' },
  ];

  useEffect(()=>{
    props.updateStateFieldArray(fieldArray());
  },[]);

  useEffect(()=>{
    if(props.fieldArrayState) {
      setValidate(props.fieldArrayState[5].value === 'existedVendor'? validation(false) : validation(true));
    }
  },[props.fieldArrayState]);

  useEffect(()=>{
    props.updateAllAddItemsFieldArray(addItemsFieldArray);
    loadMaterialType();
    loadMaterialGroup();
  },[]);

  useEffect(()=>{
    Promise.all([
      getAllBranchCombo(),
      getVendor()
    ])
      .then(res=> {
        props.updateMultipleDetailFieldArray([
          {
            fieldName: POPettyCashConstant.branch,
            property: 'data',
            updatedData: formatDropdownList(res[0].data),
          },
          {
            fieldName: POPettyCashConstant.existedVendorName,
            property: 'data',
            updatedData: formatDropdownList(res[1].data),
          },
        ]);
      });
  },[]);

  const loadMaterialType = () => {
    getMaterialType().then((res) => {
      props.updateDetailAddItemsFieldArray({
        fieldName: ReturnRequestConstant.materialType,
        property: 'data',
        updatedData: formatDropdownList(res.data),
      });
    });
  };

  const loadMaterialGroup = () => {
    getMaterialGroup().then((res) => {
      props.updateDetailAddItemsFieldArray({
        fieldName: ReturnRequestConstant.materialGroup,
        property: 'data',
        updatedData: formatDropdownList(res.data),
      });
    });
  };

  const getAddItemsParams = (searchFields) => {
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

  const loadAddItemsData = (params) =>
    trackPromise(
      getMaterialList(params).then(
        (res) =>
        {
          return new Promise((resolve) => {
            resolve(res);
          });
        }
      )
    );

  const convertDataToGrid =(data, information)=> {
    setPettyCashDetailItemVOs(data);
    let dataRes;
    if(data.length> 0) {
      const firstValue =  data.find(x=> x.materialGroup);
      ['RM_EMERGENCY','RM_EXPENSE'].includes(firstValue.materialGroup)
        ? dataRes =  [{
          ...firstValue,
          ...firstValue.itemInfo,
          no: 1,
          common: {
            // Will use it when BE done
            imgUrl: '',
            id: firstValue.itemId,
          },
          information: information.map(el => ({
            // Get value from item if only define label
            // else keep current value as label, and get item value
            label: (el.label && !el.value && firstValue[el.label]) || el.label || '',
            value: (el.value && firstValue[el.value]) || '',
            color: el.color,
          })),
          itemName: `${firstValue.materialGroupName} Vat`,
          itemType: 'VAT'

        },
        {
          ...firstValue,
          ...firstValue.itemInfo,
          no: 2,
          common: {
            // Will use it when BE done
            imgUrl: '',
            id: firstValue.itemId,
          },
          information: information.map(el => ({
            // Get value from item if only define label
            // else keep current value as label, and get item value
            label: (el.label && !el.value && firstValue[el.label]) || el.label || '',
            value: (el.value && firstValue[el.value]) || '',
            color: el.color,
          })),
          itemName: `${firstValue.materialGroupName} Non-Vat`,
          itemType: 'NON_VAT'
        }]
        : dataRes =  [{
          ...firstValue,
          ...firstValue.itemInfo,
          no: 1,
          common: {
            // Will use it when BE done
            imgUrl: '',
            id: firstValue.itemId,
          },
          information: information.map(el => ({
            // Get value from item if only define label
            // else keep current value as label, and get item value
            label: (el.label && !el.value && firstValue[el.label]) || el.label || '',
            value: (el.value && firstValue[el.value]) || '',
            color: el.color,
          })),
          itemName: firstValue.materialGroupName,
        }];
    }
    return dataRes;
  };

  const  showMessageContentFromSystem = (res) => {
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

  const showSystemErrorDialog = (res) => {
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

  const isValidDetailListInformation = ( detailList) => {

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
    let isMissedAmount = [];
    let isMissedVat = [];
    let isMissedNote = [];
    let isMissedDeliveryDate = [];
    detailList.forEach((el) => {
      if( !el.quantity) {
        isInvalidQuantity.push(el.no);
      }
      if( !el.amount) {
        isMissedAmount.push(el.no);
      }
      if( !el.vat) {
        isMissedVat.push(el.no);
      }
      if( !el.note) {
        isMissedNote.push(el.no);
      }
      if( !el.deliveryDate) {
        isMissedDeliveryDate.push(el.no);
      }
    });

    if (isInvalidQuantity.length > 0) {
      errorMsg.push(
        `${POPettyCashConstant.label.quantity} ${Message.common['comMSG001']}
          <No: ${isInvalidQuantity.join(', ')}>`
      );
    }
    if (isMissedAmount.length > 0) {
      errorMsg.push(
        `${POPettyCashConstant.label.amount} ${Message.common['comMSG001']}
          <No: ${isMissedAmount.join(', ')}>`
      );
    }
    if (isMissedVat.length > 0) {
      errorMsg.push(
        `${POPettyCashConstant.label.vat} ${Message.common['comMSG001']}
          <No: ${isMissedVat.join(', ')}>`
      );
    }
    if (isMissedNote.length > 0) {
      errorMsg.push(
        `${POPettyCashConstant.label.note} ${Message.common['comMSG001']}
          <No: ${isMissedNote.join(', ')}>`
      );
    }
    if (isMissedDeliveryDate.length > 0) {
      errorMsg.push(
        `${POPettyCashConstant.label.deliveryDate} ${Message.common['comMSG001']}
          <No: ${isMissedDeliveryDate.join(', ')}>`
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

  const getAttachedImageForSaving = (uploadFileArray) => {
    let attachedImagesArray = uploadFileArray;
   
    let orderImageIndex = 1;
    attachedImagesArray.map((file) => {
      if (!file.isAttached) {
        orderImageIndex = orderImageIndex + 1;
        const fileExtension = file.name.split('.')[1];
        const newFileNameBaseOnItemId = `item_${orderImageIndex}.${fileExtension}`;
        file.newFileName = newFileNameBaseOnItemId;
      }
      return file;
    });
    return attachedImagesArray;
  };

  const convertPCDetailItemVOs =( data) =>data.map(el=> ({
    sku: el.sku,
    quantity: el.quantity,
    createdDate: '',
    updatedDate: '',
    createdBy: '',
    updatedBy: '',
    deleteFlag: 0,
  }));

  const getPettyVendorVO = generalInformation => {
    let body= {};
    if(generalInformation.vendor === POPettyCashConstant.newVendor){
      body.branchCode=generalInformation.branchCode;
      body.name1=generalInformation.name1;
      body.name2=generalInformation.name2;
      body.country=generalInformation.country;
      body.city=generalInformation.city;
      body.postalCode=generalInformation.postalCode;
      body.taxNo=generalInformation.taxNo;
      body.address1=generalInformation.address1;
      body.address2=generalInformation.address2;
      body.address3=generalInformation.address3;
      body.displayName=generalInformation.displayName;
      body.createdDate=generalInformation.createdDate;
      body.updatedDate=generalInformation.updatedDate;
      body.createdBy=generalInformation.createdBy;
      body.updatedBy=generalInformation.updatedBy;

    } else {
      body ={};
    }
    return body;
  };

  const mapDetailInformationForSaving = detailList => {
    return detailList.map(item => ({
      itemPettyCashTypeCode: item.materialType,
      itemPettyCashTypeName: item.materialTypeName,
      quantity: item.quantity,
      amount: item.amount,
      vat: item.vat,
      total: '',
      deliveryDate:
        (typeof item.deliveryDate === 'string' &&
          item.deliveryDate.match(dateFormat.serverFormatRegex) &&
          item.deliveryDate) ||
        formatDateString(
          item.deliveryDate || Date.now(),
          dateFormat.savingDateTime
        ),
      note: item.note,
      createdDate: '',
      updatedDate: '',
      updatedBy: '',
      createdBy: '',
      deleteFlag: 0,

    }));
  };

  const mapGeneralInformationForSaving = (generalInformation) => {
    const result = {};
    generalInformation.forEach((el) => {
      switch (el.fieldName) {
        case POPettyCashConstant.invoiceDate:
          result[el.fieldName] =
              el.value &&
              formatDateString(el.value, dateFormat.savingDateTime);
          break;
        // case POPettyCashConstant.uploadFile:
        //   break;
        default:
          result[el.fieldName] =
              typeof el.value === 'string' ? el.value.trim() : el.value;
          break;
      }
    });
    return result;
  };

  const prepareSavePoPettyCash = (params, action, savingType,reject,resolve) => 
    savePoPettyCash(params, action, savingType)
      .then(res => {
        if (res && res.message) {
          showMessageContentFromSystem(res);
          reject();
        }
        if (res && res.data) {
          const poPettyCashId = res.data.poPettyCashId;
          let msg = '';

          if (isEditPage) {
            msg =
    (savingType === Action.saveDraft &&
      Message.PETTY_CASH
        .DRAFT_PETTY_CASH_SAVED_SUCCESSFULLY) ||
    Message.PETTY_CASH.SUBMIT_PETTY_CASH_SUCCESSFULLY;
          } else {
            msg =
    (savingType === Action.saveDraft &&
      Message.PETTY_CASH.DRAFT_PETTY_CASH_SUCCESSFULLY) ||
    Message.PETTY_CASH.SUBMIT_PETTY_CASH_SUCCESSFULLY;
          }

          openDialog({
            title: Message.INFORMATION,
            type: dialogConstant.type.INFORMATION,
            content: msg.replace('%pcNo%', poPettyCashId),
            actions: [
              {
                name: props.t(Action.ok),
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
      .catch(res => showSystemErrorDialog(res));

  const onSave = (fieldArray, dataDetailsOnGrid, historyData,savingType) => {
    let params = {};
    const promise = new Promise((resolve, reject) => {
      let generalInformation = mapGeneralInformationForSaving(fieldArray);
      const attachedImagesForSaving = getAttachedImageForSaving(generalInformation.uploadFile);
      const detailsList = dataDetailsOnGrid && dataDetailsOnGrid.data;
      const detailInformation = mapDetailInformationForSaving (detailsList);
      if(!isValidDetailListInformation(detailsList)) {
        reject();
      } else {
        params = {
          ...params,
          pettyCashType: '',
          branchCode: generalInformation.branch,
          invoiceNo: generalInformation.invoiceNo,
          invoiceDate: generalInformation.invoiceDate,
          pettyVendorId: generalInformation.vendor === POPettyCashConstant.existedVendor
            ? generalInformation.existedVendorName
            : '',
          total: '',
          status: savingType === Action.saveDraft
            ? POPettyCashConstant.statusValue.draft
            : POPettyCashConstant.statusValue.waitingApproval,
          createdDate: '',
          updatedDate: '',
          updatedBy: '',
          deleteFlag: '',

          createdBy: ''
        };
        params.historyVOs = historyData;
        params.pettyCashDetailVOs	= detailInformation;
        params.pettyVendorVO	= getPettyVendorVO(generalInformation);
        params.pettyCashDetailItemVOs = convertPCDetailItemVOs(pettyCashDetailItemVOs);

        if(attachedImagesForSaving.length > 0){
          const formFileData = new FormData();
          attachedImagesForSaving.forEach((file) => {
            if (!file.isAttached) {
              formFileData.append('file', file, file.newFileName);
            }
          });
          uploadImages(formFileData)
            .then(uploadImagesRes => {
              params.pettyCashImageVOs= uploadImagesRes.map(image=> ({
                pettyCashImageId: image.id,
                pettyCashNo: image,
                imagePath: image.urlPath,
                updateDate: image,

              }));
              prepareSavePoPettyCash(params, Action.insert, savingType, reject, resolve);
            })
            .catch(res => reject());
        } else {
          prepareSavePoPettyCash(params, Action.insert, savingType, reject, resolve);
        }
        
        
      }
    });

    return promise;
  };

  const onCustomSaveDraft =(fieldArray, dataDetailsOnGrid, historyData) =>{
    onSave(fieldArray, dataDetailsOnGrid, historyData, Action.saveDraft);

  };

  const onCustomSave =(fieldArray, dataDetailsOnGrid, historyData) =>{
    onSave(fieldArray, dataDetailsOnGrid, historyData, Action.save);

  };

  const listConfig = {
    actions: actions(),
    columnsDetail,
    options,
    validation: validate,
    getAddItemsParams,
    loadAddItemsData,
    convertItemDataStructure,
    convertDataToGrid,
    totalSummarizeInGrid,
    isConvertDataToGrid: true,
    onCustomSaveDraft,
    onCustomSave,
    informationConvert,
    addItemsFieldList: props.addItemsFieldList,
    isDetailsPage: false,
    isFormGeneral: true,
    history: []
  };

  return (
    <div className={classes.addPettyCashForm}>
      <DetailForm {...listConfig}/>
    </div>
  );
};

PettyCashForm.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.any,
  fieldArray: PropTypes.any,
  updateStateFieldArray: PropTypes.any,
  updateAllAddItemsFieldArray: PropTypes.any,
  addItemsFieldList: PropTypes.any,
  updateDetailAddItemsFieldArray: PropTypes.any,
  history: PropTypes.any,
  fieldArrayState: PropTypes.any,
  isEditPage: PropTypes.any,
  updateMultipleDetailFieldArray: PropTypes.any,
  
};

const mapStateToProps = (state) => ({
  fieldArrayState: state.detailFormStore.fieldArray,
  addItemsFieldList: state.addItemsFormStore.fieldArray,
});
const mapDispatchToProps = (dispatch) => ({
  updateStateFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_ALL_FIELD_ARRAY,
      fieldArray: data,
    }),
  updateMultipleDetailFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY,
      detailsData: data,
    }),
  updateAllAddItemsFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_ALL_ADD_ITEMS_FIELD_ARRAY,
      fieldArray: data,
    }),
  updateDetailAddItemsFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_DETAIL_ADD_ITEMS_FIELD_ARRAY, ...data }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withStyles(useStyles)(PettyCashForm)));