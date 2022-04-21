import React,{ useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withRouter } from 'react-router-dom';

import useStyles from '../branch-bom-price-list.style';

import BranchBOMPriceForm from '../branch-bom-price-form/branch-bom-price-form.component';

import {
  editFields,
  comparedFields,
  comparedDetail,
  editOptions,
  validation,
} from './branch-bom-price-edit.config';
import { priceColumns, actions } from './price.config';
import { formatDateString } from '../../../../util/date-util';
import {
  dateFormat,
  BranchBOMPrice,
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';

import {
  CHANNEL,
  STATUS,
} from '../branch-bom-price.constant';

import {
  getBranchBOMPrice,
  updateBranchBOMPrice,
} from '../../../../actions/branch-bom-price.action';
import { getDataTaxCode } from '../../../../actions/branch-bom-action';
import { showError, showInformation } from '../branch-bom-price.util';
import { formatComboBox } from '../../../../util/format-util';

const BranchBOMPriceEdit = (props) => {
  const { location } = props;

  const pathname = location.pathname;
  const BOMPriceId =
    (location.state && location.state.id) || pathname.split('/').pop();

  const [taxCode, setTaxCode] = useState();

  useEffect(() => {
    getDataTaxCode().then((res) => {
      setTaxCode(formatComboBox(res.data));
    });
  }, []);
  

  const filterHeaderByStatus = (headers) => {
    // Re-set start date to current date if it is before current date
    const startDate = headers.startDate;
    const startDateTimestamp = new Date(
      startDate && +startDate.substring(0, 4),
      startDate && +startDate.substring(4, 6) - 1,
      startDate && +startDate.substring(6, 8)
    );
    let formattedStartDate;
    if (startDateTimestamp < new Date()) {
      formattedStartDate = formatDateString(
        new Date(),
        dateFormat.savingDateTimeStartDate,
        true
      );
    } else {
      formattedStartDate = headers.startDate;
    }

    // Re-set end date to current date if it is before current date
    const endDate = headers.endDate;
    const endDateTimestamp = new Date(
      endDate && +endDate.substring(0, 4),
      endDate && +endDate.substring(4, 6) - 1,
      endDate && +endDate.substring(6, 8)
    );
    let formattedEndDate;
    if (endDateTimestamp < new Date()) {
      formattedEndDate = formatDateString(
        new Date(),
        dateFormat.savingDateTimeStartDate,
        true
      );
    } else {
      formattedEndDate = headers.endDate;
    }

    return {
      ...headers,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
  };

  /**
   * Check if any row line has invalid category associate with channel value
   * @param {Object} data
   */
  const isInValidDetailsInformation = (data) => {
    const detailsList = data.bomPriceDetailVO || [];
    const channel = data.channel;
    let inValidBranchBomCode = [];
    let isInvalid = false;
    if (BranchBOMPrice.listChannelCodeAllowRestoCategory.indexOf(String(channel)) === -1) {
      inValidBranchBomCode = detailsList.filter(
        el =>  el.productName && el.productName.toLowerCase() === BranchBOMPrice.categoryName.restoPackaging.toLowerCase()
      ).map(el => el.bomBranchCode || el.itemCode);
      inValidBranchBomCode.length > 0 && (isInvalid = true);
    }

    isInvalid && showError(
      Message.BRANCH_BOM_PRICE.INVALID_ITEM_WITH_CATEGORY.replace('%BRANCH_BOM_CODE%', inValidBranchBomCode.join(','))
    );

    return isInvalid;
  };

  /**
   * Check if any update on check item
   * @param {Array} originChildList 
   * @param {Object} checkChildItem 
   */
  const isChangePriceAndVat = (originChildList, updatedChildList) => {
    let isUpdated = false;
    for (let index = 0; index < updatedChildList.length; index++) {
      const updatedItem = updatedChildList[index];
      const originItemIndex = originChildList.findIndex(
        el => (el.bomBranchCode || el.itemCode) === (updatedItem.bomBranchCode || updatedItem.itemCode)
      );
      const originItem = originChildList[originItemIndex] || null;
      isUpdated = !originItem || +originItem.price !== +updatedItem.price || +originItem.exVat !== +updatedItem.exVat;
      if (isUpdated) {
        return true;
      }
    }
    return false;
  };

  const getUpdatedBOMPrice = (originBOMPrice, data, statusActiveValue) => {
    return new Promise((resolve, reject) => {
      const updatedBOMPrice = {
        ...data,
        bomPriceId: BOMPriceId,
      };

      if (isInValidDetailsInformation(updatedBOMPrice)) {
        reject();
        return;
      };

      const isDateInvalid =
      updatedBOMPrice.startDate > updatedBOMPrice.endDate;
      if (isDateInvalid) {
        showError(Message.BRANCH_BOM_PRICE.DATE_VALIDATION);
        return;
      }
  
      const originDetail = [...originBOMPrice.bomPriceDetailVO];
      const updatedDetail = [...updatedBOMPrice.bomPriceDetailVO];
  
      // START Check if any price empty
      const isPriceEmpty = !updatedDetail.every((BOMPrice, index) => {
        return (
          Number.isInteger(+updatedDetail[index]['price']) &&
          +updatedDetail[index]['price'] !== 0
        );
      });
  
      if (isPriceEmpty) {
        showError(Message.BRANCH_BOM_PRICE.EMPTY_PRICE);
        reject();
        return;
      }
      // END
  
      // START Check if BOM Price is changed
      const isHeadersChanged = !comparedFields.every((fieldName) => {
        if (fieldName === CHANNEL || fieldName === STATUS) {
          return +originBOMPrice[fieldName] === +updatedBOMPrice[fieldName];
        }
  
        return (
          originBOMPrice[fieldName]?.trim() === updatedBOMPrice[fieldName]?.trim()
        );
      });
  
      let isDetailChanged;
  
      if (originDetail.length !== updatedDetail.length) {
        isDetailChanged = true;
      } else {
        const originList = (originBOMPrice && originBOMPrice.bomPriceDetailVO) || [];
        updatedDetail.forEach(updatedItem => {
          if (!isDetailChanged) {
            const originItemIndex = originList.findIndex(
              el => (el.bomBranchCode || el.itemCode) === (updatedItem.bomBranchCode || updatedItem.itemCode)
            );
            if (!originList[originItemIndex]) {
              isDetailChanged = true;
            } else {
              const childList = (originList[originItemIndex] && originList[originItemIndex].childBomPriceDetailVO) || [];
              const updatedChildList = updatedItem.childBomPriceDetailVO || [];
              // Check if any field of bomPriceDetailVO change 
              isDetailChanged = !comparedDetail.every((fieldName) => {
                return (
                  updatedDetail.length > 0 &&
                  fieldName === 'price' ?
                    +originList[originItemIndex][fieldName] === +updatedItem[fieldName] :
                    originList[originItemIndex][fieldName] === updatedItem[fieldName]
                );
              });
              // Check if price and exvat in children change(level 2, level 3)
              !isDetailChanged && (isDetailChanged = isChangePriceAndVat(childList, updatedChildList));
            }
          };
        });
      }
      // END
  
      //  START Check if BOM Price's status is Active, Confirmed and contains price list
      if (
        updatedBOMPrice.bomPriceDetailVO.length === 0 &&
        statusActiveValue.includes(updatedBOMPrice.status)
      ) {
        showError(updatedBOMPrice.status === BranchBOMPrice.status.active ?
          Message.BRANCH_BOM_PRICE.CAN_NOT_ACTIVATE : Message.BRANCH_BOM_PRICE.CAN_NOT_CONFIRM);
        reject();
        return;
      }
      // END

      if (!isHeadersChanged && !isDetailChanged) {
        showInformation(Message.BRANCH_BOM_PRICE.NOTHING_CHANGED);
        reject();
        return;
      }

      //Check parent price equal children price of level 1
      for (let index = 0; index < updatedDetail.length; index++) {
        let item = updatedDetail[index];
        if (item.level === BranchBOMPrice.levels.level_1) {
          let parentPrice = +item.price;
          let childrenPrice = 0;
          for (let i = 0; i < item.childBomPriceDetailVO.length ; i++) {
            let temp = item.childBomPriceDetailVO[i];
            childrenPrice += +temp.price || 0;
          }
          if (parentPrice !== childrenPrice) {
            showError(Message.BRANCH_BOM_PRICE.CHILDREN_PRICE_NOT_EQUAL_PARENT_PRICE);
            reject();
            return;
          }
        }
      }

      const filterBOMPrice =
        +originBOMPrice.status !== +updatedBOMPrice.status
          ? filterHeaderByStatus(updatedBOMPrice)
          : updatedBOMPrice;
  
      // Update status to Draft if change start date or end date
      if (filterBOMPrice && originBOMPrice && (
        originBOMPrice.startDate?.substring(0, 8) !== filterBOMPrice.startDate?.substring(0, 8) || 
        originBOMPrice.endDate?.substring(0, 8) !== filterBOMPrice.endDate?.substring(0, 8)
      )) {
        filterBOMPrice.status = BranchBOMPrice.status.draft;
      }

      // Update status to Expried if change end date < current date
      if (filterBOMPrice && originBOMPrice && (
        filterBOMPrice.endDate?.substring(0, 8) <
        formatDateString(Date.now(), dateFormat.savingDate)
      )) {
        filterBOMPrice.status = BranchBOMPrice.status.expired;
      }

      updateBranchBOMPrice(filterBOMPrice).then(
        (res) => {
          if (res && res.status === '200') {
            if (res.message && res.message.messages) {
              if (res.message.messages[0].messageCode === Message.BRANCH_BOM_PRICE.ERROR_DUPPLICATE) {
                showError(Message.BRANCH_BOM_PRICE.EDIT_DUPPLICATED);
              } else {
                showError(res.message.messages[0].messageContent);
              }
            } else {
              showInformation(
                `${Message.BRANCH_BOM_PRICE.UPDATE_SUCCESS}`.replace(
                  'priceListName',
                  `${filterBOMPrice.bomPriceName}`
                ),
                resolve
              );
            }
          }
        },
        (err) => {
          showError(err.messages[0].messageContent);
          reject();
        }
      );
    });
  };

  return (
    <>
      <BranchBOMPriceForm
        isEditPage={true}
        tableOptions={editOptions}
        columns={priceColumns(taxCode)}
        validation={validation}
        customClass={'user-search-bar'}
        getUpdatedBOMPrice={getUpdatedBOMPrice}
        customActions={actions}
        BOMPriceId={BOMPriceId}
        getBranchBOMPrice={getBranchBOMPrice}
        headerFields={editFields}
      />
    </>
  );
};

BranchBOMPriceEdit.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default withRouter(withStyles(useStyles)(BranchBOMPriceEdit));
