import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import ClearIcon from '@material-ui/icons/Clear';
import BarcodeReader from 'react-barcode-reader';
import {
  Action,
  ActionType,
  CouponConstant,
} from '../../../constants/constants';
import { openDialog, showErrorDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { Message } from '../../../constants/messages';
import Button from '../../shared/buttons/button.component';
import FormFields from '../../shared/form/detail-form/form-fields.component';
import FormLabelFields from '../../shared/form/detail-form/form-label-fields.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import {
  getCouponScanInformation,
  scanningCouponData,
  updateScanCouponList,
  // deleteCoupon
} from '../../../actions/coupon-action';
import {
  actions,
  options,
  bottomGridButtonsArray,
  fieldArray,
  fieldsLabelArray,
  columnsDetail,
  validation,
} from './coupon-scan.config';
import useStyles from './coupon-scan.style';
import { getErrorMessage } from '../../../util/error-util';
import { convertToDateServerFormat } from '../../../util/date-util';

function CouponScan(props) {
  const {
    classes,
    open,
    handleClose,
    // setIsShowScanPopup,
    showScanPopupParams,
    updateAllFieldArray,
    parentScope
  } = props;

  const couponData = showScanPopupParams && showScanPopupParams.couponData;

  const [tempFieldArray, setTempFieldArray] = useState(null);
  const [detailData, setDetailData] = useState({});
  const [addedCouponSerialNo, setAddedCouponSerialNo] = useState([]);
  const [fields, setFields] = useState(null);

  const { handleSubmit, errors, register, setValue, setError, clearErrors } = useForm({
    reValidateMode: 'onSubmit'
  });

  detailData.scannedQuantity = (detailData.scanItemList && detailData.scanItemList.length) || 0;
  const isRemindScan = detailData.scannedQuantity < detailData.totalCouponQty;
  let no = 0;
  detailData.scanItemList = detailData.scanItemList && detailData.scanItemList.map(el => {
    no += 1;
    return { ...el, lineNumber: no };
  });

  const saveHandler = () => {
    // Only allow save when have at least 1 coupon is scanned
    if (!addedCouponSerialNo || addedCouponSerialNo.length === 0) {
      showErrorDialog(Message.COUPON.NO_COUPON_SCANNED);
    } else {
      // Prevent add scan voucher if scan quantity over than order quantity
      if (detailData.scannedQuantity > detailData.totalCouponQty) {
        showErrorDialog(Message.COUPON.OVER_SCANNED_QUANTITY);
      } else {
        // Perform saving
        detailData.scannedQuantity = detailData.scanItemList.length;
        const tempList = detailData.scanItemList.filter(el => !el.isAlreadySaved);
        const tempDetailData = {
          list: tempList.map(el => ({
            couponDetailId: el.couponDetailId,
            couponId: detailData.couponId,
            categoryClass: el.categoryClass,
            categoryCode: el.categoryCode,
            serialNo: el.serialNo,
            status: el.status,
            statusName: el.statusName,
            validFrom: convertToDateServerFormat(el.validFrom),
            validTo: convertToDateServerFormat(el.validTo),
            bookletCode: el.bookletCode,
            serialCodeTypeName: el.serialCodeTypeName
          }))
        };
        updateScanCouponList(tempDetailData).then(res => {
          if (getErrorMessage(res)) {
            showErrorDialog(getErrorMessage(res));
            return;
          }
          openDialog({
            title: Message.INFORMATION,
            content: Message.COUPON.SAVE_SUCCESSFULLY,
            disableBackdropClick: true,
            actions: [
              {
                name: Action.ok,
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  // setIsShowScanPopup(false);
                  handleClose.call(parentScope, {...detailData});
                }
              },
            ],
          });
        });
      }
    }
  };

  // Only deleted added scan coupon which are not saved yet
  const deleteAllAddedScanCoupon = () => {
    const scannedList = (detailData && detailData.scanItemList) || [];
    const tempScannedList = scannedList.filter(el => addedCouponSerialNo.findIndex(coupon => coupon.serialNo === el.serialNo) === -1);
    detailData.scannedQuantity = tempScannedList.length;
    setDetailData({
      ...detailData,
      scanItemList: tempScannedList
    });
  };

  const cancelHandler = () => {
    const tempScannedCoupon = detailData && detailData.scanItemList;
    if (tempScannedCoupon && tempScannedCoupon.length > 0) {
      openDialog({
        title: Message.CONFIRM,
        content: Message.COUPON.CANCEL_COUPON_SCANNED,
        disableBackdropClick: true,
        actions: [
          {
            name: Action.cancel,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.NEUTRAL,
          },
          {
            name: Action.ok,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              deleteAllAddedScanCoupon();
            }
          },
        ],
      });
    }
  };

  // Delete the selected row
  const scanDeleteRow = (rowData) => {
    const tempScannedCoupon = detailData && detailData.scanItemList;
    const result = tempScannedCoupon.filter(el => el.serialNo !== rowData.serialNo);
    detailData.scannedQuantity = (result && result.length) || 0;

    // If delete the saved coupon (means coupon have scanned and saved before)
    // need to call to API  to delete it
    if (rowData.isAlreadySaved) {
      updateScanCouponList({
        list: [{
          ...rowData,
          status: 'B',
          couponId: couponData.couponId
        }]
      }).then((res) => {
        if (getErrorMessage(res)) {
          showErrorDialog(getErrorMessage(res));
          return;
        } else {
          setDetailData({
            ...detailData,
            scanItemList: result
          });
        }
      });
    } else {
      setDetailData({
        ...detailData,
        scanItemList: result
      });
    }
  };

  // check if scan voucher is scanned or not
  const isScannedCoupon = (serialNo) => {
    const tempScannedCoupon = (detailData && detailData.scanItemList) || [];

    return tempScannedCoupon.findIndex(el => el.serialNo === serialNo) !== -1;
  };

  const updateScannedCouponAfterScan = (coupon, scanNo) => {
    // Update scanned voucher list
    let scannedList = (detailData && detailData.scanItemList) || [];
    // Add list of coupon when scan booklet coupon
    if (Array.isArray(coupon)) {

      let scannedListLength = scannedList.length;
      const temp = coupon.filter(
        el => scannedList.findIndex(tempSerial => tempSerial.serialNo === el.serialNo) === -1
      ).map(el => {
        scannedListLength += 1;
        return { ...el, lineNumber: scannedListLength, validFrom: fields.validFrom, validTo: fields.validTo };
      });

      if (temp.length === 0) {
        showErrorDialog(
          Message.COUPON.COUPON_ALREADY_SCANNED.replace('%SERIAL_NO%', scanNo)
        );
      } else {
        const scanItemList = [
          ...scannedList,
          ...temp
        ];
        setDetailData({
          ...detailData,
          scanItemList
        });
        setAddedCouponSerialNo([...addedCouponSerialNo, ...temp]);
      }
      return;
    }
    // Add 1 coupon to list when scan 1 coupon
    setDetailData({
      ...detailData,
      scanItemList: [
        ...scannedList,
        {
          ...coupon,
          lineNumber: scannedList.length + 1,
          validFrom: fields.validFrom,
          validTo: fields.validTo
        }
      ]
    });
    setAddedCouponSerialNo([...addedCouponSerialNo, coupon]);
  };

  /**
   * Check if required fields are not typing value yet
   */
  const isMissingRequiredFields = () => {
    let isMissing = false;
    validation.forEach(el => {
      if (!fields || !fields[el.name]) {
        isMissing = true;
        setError(el.name, {
          type: 'manual',
          message: el.rule.required
        });
      }
    });
    return isMissing;
  };

  const handleScan = (scanNo) => {
    // Prevent scan when not type required fields
    if (isMissingRequiredFields()) {
      return;
    }
    // Check scan voucher is scanned or not
    // Prevent next action if voucher has scanned
    if (isScannedCoupon(scanNo)) {
      showErrorDialog(
        Message.COUPON.COUPON_ALREADY_SCANNED.replace('%SERIAL_NO%', scanNo)
      );
      return;
    }
    // get Scan coupon info and show in detail list
    scanningCouponData({
      couponScan: scanNo,
      couponId: couponData.couponId
    }).then(res => {
      if (getErrorMessage(res)) {
        showErrorDialog(getErrorMessage(res));
      } else {
        updateScannedCouponAfterScan(res.data, scanNo);
      }
    }).catch(() => {
      showErrorDialog(Message.COUPON.SCAN_ERROR);
    });
  };

  // In some cases, it still can the string but it jump into the error
  // handler instead of onScan handler. In these case, still send request for it
  const handleScanError = (scanNo) => {
    handleScan(scanNo);
  };

  /**
   * Clear errorMsg if any
   * @param {Object} fields 
   */
  const onFormFieldsChange = (fieldsArr, fieldName) => {
    if (!fieldName) {
      return;
    }
    // Check value and clear error if not empty
    const tempFields = {};
    fieldsArr.forEach(el => {
      const value = typeof el.value === 'string' ? el.value.trim() : el.value;
      if (value) {
        clearErrors && clearErrors(el.fieldName);
      }
      tempFields[el.fieldName] = el.value;
    });
    // Update valid from, valid To for all new scanned item if they're changed.
    // Dont update for items which be saved before
    if (fieldName === CouponConstant.couponFieldName.validFrom || fieldName === CouponConstant.couponFieldName.validTo) {
      detailData.scanItemList = detailData.scanItemList && detailData.scanItemList.map(el => ({
        ...el,
        validFrom: el.isAlreadySaved ? el.validFrom : tempFields.validFrom,
        validTo: el.isAlreadySaved ? el.validTo : tempFields.validTo
      }));
      setDetailData({ ...detailData });
    }
    setFields({ ...tempFields });
  };

  /**
   * Load Coupon information and update
   * associated data
   * @param {*} data 
   */
  const loadCouponInformation = (data) => {
    // Only get active scanned (and saved) coupon
    getCouponScanInformation({
      couponId: data.couponId,
      couponStatus: 'A'
    }).then(res => {
      if (res.message && res.message.messages) {
        showErrorDialog(res.message.messages[0] && res.message.messages[0].messageContent);
        return;
      }
      let no = 0;
      // Set no for detail list
      const data = couponData;
      data.scanItemList = res.data.map(el => {
        no += 1;
        return { ...el, lineNumber: no, isAlreadySaved: true };
      });
      setDetailData(data);
    }).catch(() => {
      showErrorDialog(Message.SYSTEM_ERROR);
    });
  };

  useEffect(() => {
    if (couponData) {
      updateAllFieldArray(fieldArray(couponData));
      loadCouponInformation(couponData);
    }
    if (!tempFieldArray) {
      updateAllFieldArray(fieldArray(detailData));
      setTempFieldArray(fieldArray(detailData));
    };

    if (validation) {
      validation.forEach(valid => register(valid.name, valid.rule));
    }
  }, []);

  const dataTable = {
    data: (detailData && detailData.scanItemList) || []
  };


  return (
    <Dialog
      className={`${classes.detailDialog} ${classes.addItemsPopUp} scan-popup`}
      open={open}
    >
      <div className={`${classes.titlePage} subtitle`}>
        <DialogTitle id="customized-dialog-title">Coupon Scanning</DialogTitle>
        <span onClick={handleClose.bind(parentScope, detailData)}>
          <ClearIcon className='clear-icon'/>
        </span>
      </div>
      <DialogContent dividers>
        <form
          onSubmit={handleSubmit(() => {
            console.log('handle submit');
          })}
          noValidate
          className={`${classes.form} ${classes.root} coupon-popup-form`}
        >
          <div>
            <FormFields
              classCustom="user-search-bar"
              errors={errors}
              setValue={setValue}
              setError={setError}
              clearErrors={clearErrors}
              onFormFieldsChange={onFormFieldsChange}
            />
          </div>
          <Fieldset
            title='General Information'
            customClasses='detail-general-info scan-popup'
          >
            <FormLabelFields
              fieldsLabelArray={fieldsLabelArray(detailData)}
            />
          </Fieldset>

          <Fieldset
            title='Details Information'
            customClasses='detail-list-info scan-popup'
          >
            <TableGrid
              columns={columnsDetail(detailData)}
              options={options}
              actions={actions(scanDeleteRow)}
              dataTable={dataTable}
              hidePagination={true}
              forceUseDataTable={true}
            />
            <div className={`${classes.emptyScanRow} remind-scan`}>
              {isRemindScan && 'Please Scan!'}
            </div>
          </Fieldset>
          <div className='bottom-div-btn'>
            {bottomGridButtonsArray &&
            bottomGridButtonsArray(saveHandler, cancelHandler).map((item, index) => (
              <Button
                key={index}
                title={item.title}
                className={item.className}
                handleClick={item.handleClick}
                hidden={item.hidden}
              />
            ))}
          </div>
        </form>
      </DialogContent>
      <BarcodeReader
        onError={handleScanError}
        onScan={handleScan}
      />
    </Dialog>
  );
}

CouponScan.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  setIsShowScanPopup: PropTypes.func,
  finalListScannedCoupon: PropTypes.any,
  showScanPopupParams: PropTypes.object,
  history: PropTypes.object,
  couponData: PropTypes.object,
  updateAllFieldArray: PropTypes.func,
  parentScope: PropTypes.object
};

const mapDispatchToProps = (dispatch) => ({
  updateAllFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_ALL_FIELD_ARRAY, fieldArray: data }),
});
  

export default connect(null, mapDispatchToProps)(withStyles(useStyles)(CouponScan));
