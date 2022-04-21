import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ClearIcon from '@material-ui/icons/Clear';
import BarcodeReader from 'react-barcode-reader';
import {
  dateFormat
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import Button from '../../../shared/buttons/button.component';
import FormLabelFields from '../../../shared/form/detail-form/form-label-fields.component';
import Fieldset from '../../../shared/fieldset/fieldset.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import { useStyles } from './scan-popup.style';
import {
  getScanVoucherData,
  getSavedScannedVoucher
} from '../../../../actions/voucher-action';
import { convertToDateString } from '../../../../util/date-util';
import { getErrorMessage } from '../../../../util/error-util';
import {
  showErrorDialog,
  showConfirmDialog,
} from '../../../../redux/message-dialog/message-dialog.actions';

function ScanPopup(props) {
  const classes = useStyles();
  const {
    open,
    handleClose,
    scanFieldsLabelArray,
    scanColumns,
    scanOptions,
    scanActions,
    scanBottomGridButtonsArray,
    scanDetailData,
    updateFinalListScannedVouchers,
    finalListScannedVouchers,
    setIsShowScanPopup,
    showScanPopupParams,
    saleOrderData,
  } = props;

  const onlyViewAddedVoucher = !!showScanPopupParams.onlyViewAddedVoucher;

  const [addedVouchersSerialNo, setAddedVouchersSerialNo] = useState(finalListScannedVouchers || []);
  
  let no = 0;
  let tempScannedVouchers = (finalListScannedVouchers && finalListScannedVouchers[scanDetailData.sku]) || [];
  // Scanned voucher in Scan popup: only show which serial that has been scanned but not saved yet.
  // In Detail popup: only show which serial that has been scanned and saved to server.
  const [scannedVouchers, setScannedVouchers] = useState(tempScannedVouchers);
  // Only contains vouchers that has been scanned and saved.
  // Using in Scan popup to detect duplicate
  const [savedVouchers, setSavedVouchers] = useState([]);

  // In detail popup(read only) show all vouchers that saved and new scanned vouchers(which is not save)
  // In scan page only show vouchers that scanned but not saved for this SO
  if (onlyViewAddedVoucher) {
    tempScannedVouchers = [...tempScannedVouchers, ...scannedVouchers.filter(
      el => tempScannedVouchers.findIndex(temp => temp.serialNo === el.serialNo) === -1
    )];
    scanDetailData.totalScannedQuantity = tempScannedVouchers.length;
  } else {
    tempScannedVouchers = [...scannedVouchers];
    // Total quantity = (saved vouchers quantity) + (new scan vouchers quantity)
    scanDetailData.totalScannedQuantity = +(scanDetailData.scannedQuantity || 0) + tempScannedVouchers.length;
  }
  // Update validFrom and validTo base on Sale Order validfrom/validto
  tempScannedVouchers = tempScannedVouchers.map(el => {
    no = no + 1;
    el.lineNumber = no;
    const validFrom = (!el.isAlreadySaved && saleOrderData.soDoStatus !== 'C' && saleOrderData.validFrom) || scanDetailData.validFrom || el.validFrom;
    const validTo = (!el.isAlreadySaved && saleOrderData.soDoStatus !== 'C' && saleOrderData.validTo) || scanDetailData.validTo || el.validTo;
    return {
      ...el,
      lineNumber: no,
      validFrom: validFrom && convertToDateString(validFrom, dateFormat.mainDate),
      validTo: validTo && convertToDateString(validTo, dateFormat.mainDate)
    };
  });
  // Show 'Please scan' label when scanned quantity is smaller than order quantity
  const isRemindScan = +scanDetailData.totalScannedQuantity < +scanDetailData.quantity;
  const dataTable = {
    data: tempScannedVouchers || []
  };

  const updateScannedList = (scannedVouchers) => {
    const addedVouchers = addedVouchersSerialNo[scanDetailData.sku] || [];
    const tempScannedVoucherList = scannedVouchers.filter(
      el => addedVouchers.findIndex(added => added.serialNo === el.serialNo) === -1
    );

    const temp = {
      ...addedVouchersSerialNo,
      [scanDetailData.sku]: [
        ...tempScannedVoucherList,
        ...addedVouchers
      ]
    };
    setAddedVouchersSerialNo(temp);
    updateFinalListScannedVouchers(scanDetailData.sku, temp);
  };

  const addVouchersHandler = () => {
    // Only allow add when have at least 1 voucher is scanned
    if (!tempScannedVouchers || tempScannedVouchers.length === 0) {
      showErrorDialog(Message.VOUCHER.NO_VOUCHER_SCANNED);
    } else {
      // Prevent add scan voucher if scan quantity over than order quantity
      if (scanDetailData.totalScannedQuantity > scanDetailData.quantity) {
        showErrorDialog(Message.VOUCHER.OVER_SCANNED_QUANTITY);
      } else {
        updateScannedList(tempScannedVouchers);
        setIsShowScanPopup(false);
      }
    }
  };

  const deleteAllScanVouchers = () => {
    updateFinalListScannedVouchers(scanDetailData.sku, {
      ...finalListScannedVouchers,
      [scanDetailData.sku]: []
    });
    setScannedVouchers([]);
    setAddedVouchersSerialNo([]);
  };

  const cancelVouchersHandler = () => {
    if (tempScannedVouchers && tempScannedVouchers.length > 0) {
      showConfirmDialog(Message.VOUCHER.CANCEL_VOUCHER_SCANNED, deleteAllScanVouchers);
    }
  };

  const scanDeleteRow = (rowData) => {
    tempScannedVouchers = tempScannedVouchers.filter(el => el.serialNo !== rowData.serialNo);
    setScannedVouchers(tempScannedVouchers);
    setAddedVouchersSerialNo([...tempScannedVouchers]);
    updateFinalListScannedVouchers(scanDetailData.sku, {
      ...finalListScannedVouchers,
      [scanDetailData.sku]: [...tempScannedVouchers]
    }, rowData);
  };

  // check if scan voucher is scanned or not
  const isScannedVoucher = (serialNo) => {
    let scannedList = (addedVouchersSerialNo && Object.values(addedVouchersSerialNo).filter(el => Array.isArray(el))) || [];
    if (scannedList && scannedList.length > 0) {
      scannedList = scannedList.reduce((prev, cur) => [...prev, ...cur]);
    }
    return (scannedList && scannedList.findIndex(el => el.serialNo === serialNo) !== -1)
      || tempScannedVouchers.findIndex(el => el.serialNo === serialNo) !== -1
      || (savedVouchers && savedVouchers.findIndex(el => el.serialNo === serialNo) !== -1);
  };

  const updateScannedVouchersAfterScan = (vouchers, scanNo) => {
    // Update scanned voucher list
    if (Array.isArray(vouchers)) {
      let scannedList = (addedVouchersSerialNo && Object.values(addedVouchersSerialNo).filter(el => Array.isArray(el))) || [];
      if (scannedList && scannedList.length > 0) {
        scannedList = scannedList.reduce((prev, cur) => [...prev, ...cur]);
      }

      const temp = vouchers.filter(
        el => tempScannedVouchers.findIndex(tempSerial => tempSerial.serialNo === el.serialNo) === -1
          && scannedList.findIndex(tempSerial => tempSerial.serialNo === el.serialNo) === -1
      ).slice(0, scanDetailData.quantity - scanDetailData.totalScannedQuantity);

      if (temp.length === 0) {
        showErrorDialog(Message.VOUCHER.VOUCHER_ALREADY_SCANNED);
      } else {
        setScannedVouchers([...tempScannedVouchers, ...temp]);
      }
      return;
    }
    tempScannedVouchers.push(vouchers);
    setScannedVouchers(cloneDeep(tempScannedVouchers));
  };

  const handleScan = (scanNo) => {
    const { sku } = scanDetailData;
    // Not allow scan in View mode
    if (onlyViewAddedVoucher) {
      return;
    }
    // Check scan voucher is scanned or not
    // Prevent next action if voucher has scanned
    if (isScannedVoucher(scanNo)) {
      showErrorDialog(Message.VOUCHER.VOUCHER_ALREADY_SCANNED);
      return;
    }

    if ((+scanDetailData.totalScannedQuantity + 1) > scanDetailData.quantity) {
      showErrorDialog(Message.VOUCHER.OVER_SCANNED_QUANTITY);
      return;
    }

    // get Scan voucher info and show in detail list
    getScanVoucherData({
      saleOrderNo: saleOrderData.receiptNumber,
      code: scanNo,
      materialNo: sku,
      type: 'P'
    }).then(res => {
      if (res.message && res.message.messages) {
        const err = res.message.messages[0] && res.message.messages[0].messageContent;
        showErrorDialog(err);
      } else {
        updateScannedVouchersAfterScan(res.data, scanNo);
      }
    }).catch(() => {
      showErrorDialog(Message.VOUCHER.SCAN_ERROR);
    });
  };

  // In some cases, it still can the string but it jump into the error
  // handler instead of onScan handler. In these case, still send request for it
  const handleScanError = (scanNo) => {
    handleScan(scanNo);
  };

  useEffect(() => {
    // Get all scanned voucher which have been saved before
    getSavedScannedVoucher({
      saleOrderNo: scanDetailData.receiptNumber,
      materialNo: scanDetailData.sku
    }).then((res) => {
      if (getErrorMessage(res)) {
        showErrorDialog(getErrorMessage(res));
        return;
      }
      if (onlyViewAddedVoucher) {
        const tempList = tempScannedVouchers || [];
        setScannedVouchers([
          ...tempList,
          ...res.data.map(el => ({ ...el, isAlreadySaved: true }))
        ]);
      } else {
        // Using in scanning popup to detect which has been scan and saved
        // when saving 1 serial no
        setSavedVouchers([
          ...res.data.map(el => ({ ...el, isAlreadySaved: true }))
        ]);
      }
    }).catch(() => {
      // catch err
    });
  }, []);

  return (
    <Dialog
      className={`${classes.detailDialog} ${classes.addItemsPopUp} scan-popup`}
      open={open}
    >
      <div className={`${classes.titlePage} subtitle`}>
        <DialogTitle id="customized-dialog-title">Scanning Details</DialogTitle>
        <span onClick={handleClose}>
          <ClearIcon className='clear-icon'/>
        </span>
      </div>
      <DialogContent dividers>
        <Fieldset
          title='General Information'
          customClasses='detail-general-info scan-popup'
        >
          <FormLabelFields
            fieldsLabelArray={scanFieldsLabelArray(scanDetailData)}
          />
        </Fieldset>

        <Fieldset
          title='Details Information'
          customClasses='detail-list-info scan-popup'
        >
          <TableGrid
            columns={scanColumns}
            options={scanOptions}
            // Dont allow delete action when viewing detail
            actions={onlyViewAddedVoucher ? [] : scanActions(scanDeleteRow)}
            dataTable={dataTable}
            hidePagination={true}
            forceUseDataTable={true}
          />
          <div className={`${classes.emptyScanRow} remind-scan`}>
            {!onlyViewAddedVoucher && isRemindScan && 'Please Scan!'}
          </div>
        </Fieldset>
        <div className='bottom-div-btn'>
          {scanBottomGridButtonsArray &&
          scanBottomGridButtonsArray(addVouchersHandler, cancelVouchersHandler, onlyViewAddedVoucher).map((item, index) => (
            <Button
              key={index}
              title={item.title}
              className={item.className}
              handleClick={item.handleClick}
              hidden={item.hidden}
            />
          ))}
        </div>
      </DialogContent>
      <BarcodeReader
        onError={handleScanError}
        onScan={handleScan}
      />
    </Dialog>
  );
}

ScanPopup.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  scanColumns: PropTypes.array,
  scanOptions: PropTypes.object,
  scanActions: PropTypes.func,
  scanBottomGridButtonsArray: PropTypes.any,
  scanDetailData: PropTypes.object,
  scanFieldsLabelArray: PropTypes.func,
  updateFinalListScannedVouchers: PropTypes.func,
  setIsShowScanPopup: PropTypes.func,
  finalListScannedVouchers: PropTypes.any,
  showScanPopupParams: PropTypes.object,
  saleOrderData: PropTypes.object
};

export default ScanPopup;
