import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PageHeader from '../../shared/page-header/page-header.component';
import DetailForm from '../../shared/form/detail-form/detail-form.component';
import useStyles from './voucher-activation.style';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { ActionType, dateFormat, Voucher } from '../../../constants/constants';
import { getSaleOrder, saveVoucherActivation } from '../../../actions/voucher-action';
import {
  showErrorDialog,
  showConfirmDialog,
  showInformationDialog
} from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { formatDateString, convertToDateServerFormat } from '../../../util/date-util';
import { getErrorMessage } from '../../../util/error-util';
import ScanPopup from './scan/scan-popup.component';
import {
  actions,
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  totalSummarizeInGrid,
  options,
  fieldArray,
  validation,
  scanOptions,
  scanActions,
  scanFieldsLabelArray,
  scanColumnsDetail,
  scanBottomGridButtonsArray,
} from './voucher-activation.config';
import { deleteAllScannedVoucher } from '../../../actions/voucher-action';

function VoucherActivation(props) {
  const {
    classes,
    updateAllFieldArray,
    updateDataDetailsOnGrid,
    match
  } = props;

  const pageHeader = {
    pageTitle: 'Voucher Activation',
    showButton: false,
  };

  // Data for display in form fields/ form label fields and detail grid
  const [detailData, setDetailData] = useState({
    receiptNumber: match.params.saleOrderNo
  });
  // each line item in grid
  const [scanDetailData, setScanDetailData] = useState(null);
  const [tempFieldArray, setTempFieldArray] = useState(null);
  const [isShowScanPopup, setIsShowScanPopup] = useState(false);
  const [finalListScannedVouchers, setFinalListScannedVouchers] = useState([]);

  // Handler for action in page
  const closeScanPopup = () => {
    setIsShowScanPopup(false);
  };

  // Only show scanned voucher that user has added for the current line
  const goToDetailPage = (rowData) => {
    setScanDetailData({
      ...rowData,
      receiptNumber: detailData && detailData.receiptNumber
    });
    setIsShowScanPopup({ onlyViewAddedVoucher: true });
  };

  // Only show voucher that user scan by barcode scanner
  const goToScanPage = (event, rowData) => {
    let isScrollToErrorView = false;
    const { setError } = event.target;
    // Before go to scan page, check if all required fields are valid
    validation.forEach((el) => {
      if (detailData.soDoStatus !== 'C' || (el.name !== 'validFrom' && el.name !== 'validTo')) {
        const inputValue =
        typeof detailData[el.name] === 'string'
          ? detailData[el.name].trim()
          : detailData[el.name];
        if (el.rule.required && !inputValue) {
          setError(el.name, {
            type: 'manual',
            message: el.rule.required,
          });
          if (!isScrollToErrorView) {
            window.scroll({
              top: 0,
              behavior: 'smooth',
            });
            isScrollToErrorView = true;
          }
        }
      }
    });

    if (!isScrollToErrorView) {
      setIsShowScanPopup(true);
      setScanDetailData({
        ...rowData,
        receiptNumber: detailData && detailData.receiptNumber,
      });
    }
  };

  /**
   * Reset all information (except sale order no)
   * @param {String} receiptNumber
   */
  const resetVoucherActivation = (receiptNumber) => {
    const tempFields = { receiptNumber };
    setDetailData({ receiptNumber });
    updateAllFieldArray(
      fieldArray(tempFields, onFieldChange, onClickLoadSOBtn)
    );
    updateDataDetailsOnGrid({ data: [] });
  };

  const isValidDetailForDisplaying = (dataList) => {
    let isValid = true;
    dataList.forEach(el => {
      if (isInvalidDate(el.validFrom) || isInvalidDate(el.validTo)) {
        showErrorDialog(Message.VOUCHER.SO_C_MISSING_VALID_FROM_TO);
        isValid = false;
      }
    });

    return isValid;
  };

  const isInvalidDate = (date) => {
    if (!date || date === 'Invalid date') {
      return true;
    }
    return false;
  };

  /**
   * Load sale Order information and update
   * associated data
   * @param {*} receiptNumber
   */
  const loadSOInformation = (receiptNumber, customData) => {
    getSaleOrder({
      saleOrderNo: receiptNumber,
    })
      .then((res) => {
        if (res.message && res.message.messages) {
          const err = res.message.messages[0] && res.message.messages[0].messageContent;
          showErrorDialog(err);
          resetVoucherActivation(receiptNumber);
          return;
        }
        if (res.data && res.data.soDoStatus === 'C' && !isValidDetailForDisplaying((res.data && res.data.saleReceiptDetailRestVOS) || [])) {
          return;
        }
        let no = 1;
        // Set no for detail list
        const data = (res.data && { ...res.data, receiptNumber }) || { receiptNumber };
        const tempFields = {
          ...data,
          receiptNumber,
          validFrom: formatDateString(data.validFrom, dateFormat.mmddyyyy, true),
          validTo: formatDateString(data.validTo, dateFormat.mmddyyyy, true),
          trackingNo: data.trackingNo || ''
        };

        setDetailData(tempFields);
        updateAllFieldArray(
          fieldArray(tempFields, onFieldChange, onClickLoadSOBtn)
        );
        updateDataDetailsOnGrid({
          data:
            data.saleReceiptDetailRestVOS &&
            data.saleReceiptDetailRestVOS.map((el) => {
              el.lineNumber = no;
              el.totalScannedQuantity = el.scannedQuantity;
              no += 1;
              return el;
            }),
        });
      })
      .catch(() => {
        showErrorDialog(Message.SYSTEM_ERROR);
      });
  };

  /**
   * Clear errorMsg if any
   * @param {String} fieldName
   * @param {Object} event
   */
  const onFieldChange = (detailData, fieldName, event) => {
    const { clearErrors } = event.target;
    let tempFields = { ...detailData };
    // Check value and clear error if not empty
    let value = event.target.value;
    value = typeof value === 'string' ? value.trim() : value;
    tempFields[fieldName] = value;
    if (value) {
      clearErrors && clearErrors(fieldName);
    }
    setDetailData(tempFields);
    updateAllFieldArray(
      fieldArray(tempFields, onFieldChange, onClickLoadSOBtn)
    );

    // remove all data when changing order no
    if (fieldName === 'receiptNumber') {
      setDetailData({});
      updateDataDetailsOnGrid({ data: [] });
      updateFinalListScannedVouchers([]);
    }
  };

  /**
   * Handle for loading sale order information
   */
  const onClickLoadSOBtn = (data) => {
    if (!data.receiptNumber || !data.receiptNumber.trim()) {
      showErrorDialog(Message.VOUCHER.MISSING_SALE_ORDER_NO);
      return;
    }
    loadSOInformation(data.receiptNumber);
  };

  /**
   *
   * @param {String} sku
   * @param {Array} scannedVouchers all new scanned vouchers are assigned for SO
   * @param {Object} deleteVoucher only have value incase delete 1 rơ in scan popup
   */
  const updateFinalListScannedVouchers = (
    sku,
    scannedVouchers,
    deleteVoucher,
  ) => {
    // No need to update anything if use delete a scan row in scan popup but that scan row is not added
    // to the outside yet(means user scan then delete without click to 'Add' button)
    if (deleteVoucher &&
      finalListScannedVouchers[sku]
      && finalListScannedVouchers[sku].findIndex(el => el.serialNo === deleteVoucher.serialNo) === -1) {
      return;
    }
    setFinalListScannedVouchers(scannedVouchers || []);

    const lineIndex = detailData && detailData.saleReceiptDetailRestVOS && detailData.saleReceiptDetailRestVOS.findIndex(
      (el) => el.sku === sku
    );
    if (lineIndex !== -1 && detailData && detailData.saleReceiptDetailRestVOS) {
      const scannedQuantity = +detailData.saleReceiptDetailRestVOS[lineIndex]
        .scannedQuantity;
      detailData.saleReceiptDetailRestVOS[lineIndex] = {
        ...detailData.saleReceiptDetailRestVOS[lineIndex],
        totalScannedQuantity:
          scannedQuantity +
          (scannedVouchers[sku] ? scannedVouchers[sku].length : -1),
      };
      setDetailData(detailData);
      updateDataDetailsOnGrid({
        receiptNumber: detailData.receiptNumber,
        data: [...detailData.saleReceiptDetailRestVOS],
      });
    }
  };

  const convertDate = (date) => {
    return (typeof date === 'string' &&
      date.match(dateFormat.serverFormatRegex) &&
      date) ||
      formatDateString(
        date || Date.now(),
        dateFormat.savingDateTime
      );
  };

  const isValidDateRange = (from, to) => {
    if (convertToDateServerFormat(from) > convertToDateServerFormat(to)) {
      return false;
    }
    return true;
  };

  const isValidData = (data) => {
    const requiredLabel = [];
    // Branch, Order Type, Created Date are required
    if (!data.receiptNumber) {
      requiredLabel.push(Voucher.voucherActLabelName.receiptNumber);
    }
    if (!data.trackingNo) {
      requiredLabel.push(Voucher.voucherActLabelName.trackingNo);
    }
    if (data.soDoStatus !== 'C' && !data.validFrom) {
      requiredLabel.push(Voucher.voucherActLabelName.voucherStartDate);
    }
    if (data.soDoStatus !== 'C' && !data.validTo) {
      requiredLabel.push(Voucher.voucherActLabelName.voucherEndDate);
    }
    if (requiredLabel.length > 0) {
      const msgLabel = requiredLabel.length === 1 ? 'comMSG001' : 'comMSG003';
      showErrorDialog(`${requiredLabel.join(',')} ${Message.common[msgLabel]}`);
      return false;
    }

    // Check valid From is over valid To
    if (data.soDoStatus !== 'C' && !isValidDateRange(data.validFrom, data.validTo)) {
      showErrorDialog(Message.VOUCHER.INVALID_DATE_RANGE);
      return false;
    }

    return true;
  };

  /**
   * Only allow save when have already scan at least 1 voucher
   */
  const onSave = () => {
    const scannedList = (finalListScannedVouchers && Object.values(finalListScannedVouchers).filter(el => Array.isArray(el))) || [];

    if (!scannedList || scannedList.length === 0 ||
      scannedList.reduce((prev, curr) => [...prev, ...curr]).length === 0
    ) {
      showErrorDialog(Message.VOUCHER.NO_VOUCHER_SCANNED);
      return;
    }

    if (!isValidData(detailData)) {
      return;
    }

    // Map data for saving
    const voucherActives = [];
    detailData.saleReceiptDetailRestVOS.forEach(item => {
      if (finalListScannedVouchers[item.sku]) {
        voucherActives.push({
          saleOrderNo: detailData.receiptNumber,
          materialNo: item.sku,
          trackingNo: detailData.trackingNo,
          customerOrderNo: detailData.customCode,
          validFrom: convertDate(detailData.validFrom),
          validTo: convertDate(detailData.validTo),
          voucherSerialNos: finalListScannedVouchers[item.sku] && finalListScannedVouchers[item.sku].map(el => el.serialNo)
        });
      }
    });
    saveVoucherActivation({
      voucherActives
    }).then(res => {
      let errorMsg = '';
      if ((errorMsg = getErrorMessage(res))) {
        showErrorDialog(errorMsg);
        return;
      };
      showInformationDialog(Message.SAVED_DATA_SUCCESSFULLY);
      setFinalListScannedVouchers(null);
      loadSOInformation(detailData.receiptNumber, {
        trackingNo: detailData.trackingNo,
        validFrom: detailData.validFrom,
        validTo: detailData.validTo
      });
    });
  };

  useEffect(() => {
    if (detailData && detailData.receiptNumber) {
      loadSOInformation(detailData.receiptNumber);
    }
  }, []);

  /**
   * Update Quantity after deleting all scanned voucher
   * @param {Object} rowData 
   */
  const updateQuantityAfterDelete = (rowData) => {
    if (detailData.saleReceiptDetailRestVOS) {
      const lineIndex = detailData.saleReceiptDetailRestVOS.findIndex(el => el.sku === rowData.sku);
      if (detailData.saleReceiptDetailRestVOS[lineIndex]) {
        detailData.saleReceiptDetailRestVOS[lineIndex].totalScannedQuantity = 0;
        detailData.saleReceiptDetailRestVOS[lineIndex].scannedQuantity = 0;
        setDetailData({ ...detailData });
        updateDataDetailsOnGrid({
          data: [...detailData.saleReceiptDetailRestVOS]
        });
      }
    }
  };

  const removeAllScannedVouchers = (rowData) => {
    updateFinalListScannedVouchers([]);
    deleteAllScannedVoucher({
      saleOrderNo: detailData.receiptNumber,
      materialNo: rowData.sku
    }).then(res => {
      if (getErrorMessage(res)) {
        showErrorDialog(getErrorMessage(res));
        return;
      } else {
        updateQuantityAfterDelete(rowData);
      }
    });
  };

  const confirmDeleteItem = (rowData) => {
    showConfirmDialog(Message.VOUCHER.REMOVE_ALL_SCANNED_VOUCHERS, removeAllScannedVouchers.bind(null, rowData));
  };

  // Update fieldArray for first time load page
  if (!tempFieldArray) {
    updateAllFieldArray(
      fieldArray(detailData, onFieldChange, onClickLoadSOBtn)
    );
    setTempFieldArray(fieldArray(detailData, onFieldChange, onClickLoadSOBtn));
  }

  const listConfig = {
    // FOR DETAIL PAGE
    isDetailsPage: true,
    forceShowFormFields: true,
    bottomGridButtonsArray: bottomGridButtonsArray(detailData, onSave),
    showTotalByColumn: true,
    totalSummarizeInGrid,
    columnsDetail,
    fieldsLabelArray: fieldsLabelArray(detailData),
    actions: actions(detailData, goToDetailPage, goToScanPage, confirmDeleteItem),
    options,
    validation,
    forceShowRouteLeavingGuard: true,
    history: props.history
  };
  let saleOrderData = detailData || {};
  saleOrderData = {
    ...saleOrderData,
    ...detailData
  };

  return (
    <>
      <PageHeader {...pageHeader} />
      <div
        className={`${classes.searchVOActivationCover} voucher-activation-form`}
      >
        <DetailForm {...listConfig} />
        {isShowScanPopup && (
          <ScanPopup
            open={!!isShowScanPopup}
            showScanPopupParams={
              !isShowScanPopup || isShowScanPopup === true
                ? {}
                : isShowScanPopup
            }
            handleClose={closeScanPopup}
            scanColumns={scanColumnsDetail}
            scanOptions={scanOptions}
            scanActions={scanActions}
            scanBottomGridButtonsArray={scanBottomGridButtonsArray}
            scanDetailData={scanDetailData || {}}
            saleOrderData={saleOrderData || {}}
            scanFieldsLabelArray={scanFieldsLabelArray}
            updateFinalListScannedVouchers={updateFinalListScannedVouchers}
            setIsShowScanPopup={setIsShowScanPopup}
            finalListScannedVouchers={finalListScannedVouchers}
          />
        )}
      </div>
    </>
  );
}

VoucherActivation.propTypes = {
  classes: PropTypes.object,
  updateAllFieldArray: PropTypes.func,
  updateDataDetailsOnGrid: PropTypes.func,
  match: PropTypes.object,
  saleOrderLinkNo: PropTypes.string,
  history: PropTypes.object
};

const mapDispatchToProps = (dispatch) => ({
  updateAllFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_ALL_FIELD_ARRAY, fieldArray: data }),
  updateDataDetailsOnGrid: (data) =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(useStyles)(VoucherActivation));
