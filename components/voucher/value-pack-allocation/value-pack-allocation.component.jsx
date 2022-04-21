import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import PageHeader from '../../shared/page-header/page-header.component';
import FormFields from '../../shared/form/detail-form/form-fields.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import useStyles from './value-pack-allocation.style';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import BarcodeReader from 'react-barcode-reader';
import {
  ActionType,
  Action,
  ValuePackAllocationConstant,
} from '../../../constants/constants';
import {
  getVPAllocationInformation,
  getScanValuePackAllocationData,
  saveValuePackAllocation,
} from '../../../actions/value-pack-allocation.action';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { Message } from '../../../constants/messages';
import Button from '../../shared/buttons/button.component';
import { ReactComponent as ScanQR } from '../../../assets/scanQR.svg';
import FormLabelFields from '../../shared/form/detail-form/form-label-fields.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import {
  actions,
  columnsDetail,
  fieldsLabelArray,
  bottomGridButtonsArray,
  options,
  fieldArray,
} from './value-pack-allocation.config';

function ValuePackAllocation(props) {
  const {
    classes,
    updateAllFieldArray,
    updateDataDetailsOnGrid,
    dataDetailsOnGrid,
    match,
    history,
  } = props;

  const { errors, setValue, setError, clearErrors } = useForm({
    reValidateMode: 'onSubmit',
  });

  // Data for display in form fields/ form label fields and detail grid
  const [isShowLabelBottomGrid, setIsShowLabelBottomGrid] = useState(true);
  const [detailData, setDetailData] = useState(null);
  const [tempFieldArray, setTempFieldArray] = useState(null);
  const [fields, setFields] = useState({
    valuePackNo: match.params.valuePackNo,
  });
  const [isStartScanning, setIsStartScanning] = useState(false);
  const [totalValuePackQty, setTotalValuePackQty] = useState(0);

  const showErrorDialog = (msg) => {
    openDialog({
      title: Message.ERROR,
      type: dialogConstant.type.ERROR,
      content: msg,
      disableBackdropClick: true,
      actions: [
        {
          name: Action.ok,
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const handleStartScanning = () => {
    setIsStartScanning(true);
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

  /**
   * Load sale Order information and update
   * associated data
   * @param {*} valuePackNo
   */
  const loadVPAllocationInformation = (valuePackNo) => {
    getVPAllocationInformation(valuePackNo)
      .then((res) => {
        if (res.message) {
          showSystemErrorDialog(res.message);
          return;
        }
        const data = res.data || {};
        const tempFields = fields;
        let newTotalValuePackQty = 0;
        data.packVoucherDetails.forEach((item) => {
          newTotalValuePackQty += item.quantity;
        });
        setTotalValuePackQty(newTotalValuePackQty);
        setDetailData(data);
        setFields(tempFields);
        updateAllFieldArray(
          fieldArray(fields, onFieldChange, onClickLoadValuePackNoBtn)
        );

        if (data.packVoucherAllocations) {
          updateDataDetailsOnGrid({
            data: [...data.packVoucherAllocations],
          });
        }
      })
      .catch((errorRes) => {
        showSystemErrorDialog(errorRes);
      });
  };

  const clearAllDataOnForm = () => {
    setDetailData(null);
    updateDataDetailsOnGrid(null, false);
  };

  /**
   * Clear errorMsg if any
   * @param {String} fieldName
   * @param {Object} event
   */
  const onFieldChange = (fieldName, event) => {
    const { clearErrors } = event.target;
    let tempFields = fields;
    // Check value and clear error if not empty
    let value = event.target.value;
    value = typeof value === 'string' ? value.trim() : value;
    tempFields[fieldName] = value;
    if (value) {
      clearErrors && clearErrors(fieldName);
    }
    setFields(tempFields);
    clearAllDataOnForm();
  };

  /**
   * Handle for loading value pack information
   */
  const onClickLoadValuePackNoBtn = () => {
    if (!fields.valuePackNo || !fields.valuePackNo.trim()) {
      showErrorDialog(Message.VALUE_PACK_ALLOCATION.MISSING_VALUE_PACK_NO);
      return;
    }
    loadVPAllocationInformation(fields.valuePackNo);
  };

  const isMatchQtyOfValuePack = () => {
    let isMatchQtyOfValuePack = true;
    if (detailData && dataDetailsOnGrid) {
      detailData.packVoucherDetails.forEach((el) => {
        const voucherTypeArray = dataDetailsOnGrid.data.filter(
          (item) => item.voucherValue === el.voucherValue
        );
        if (voucherTypeArray.length > el.quantity) {
          isMatchQtyOfValuePack = false;
          return;
        }
      });
      return isMatchQtyOfValuePack;
    }
  };

  const mapGeneralInformationForSaving = (generalInformation) => {
    const result = {
      packNumber: generalInformation.packNumber,
      packName: generalInformation.packName,
      totalValue: Number(generalInformation.totalValue),
    };

    return result;
  };

  const mapDetailInformationForSaving = (detailInformation) => {
    const result = detailInformation.map((item) => ({
      serialNo: item.serialNo,
      voucherValue: item.voucherValue,
      status: item.voucherStatus,
      validFrom: item.validFrom,
      validTo: item.validTo,
    }));

    return result;
  };

  /**
   * Only allow save when have already scan at least 1 voucher
   */
  const onSave = () => {
    if (
      !fields.valuePackNo ||
      !dataDetailsOnGrid ||
      dataDetailsOnGrid.data.length === 0
    ) {
      showErrorDialog(Message.VOUCHER.NO_VOUCHER_SCANNED);
      return;
    }

    if (isShowLabelBottomGrid) {
      return;
    }

    // check scanning qty of voucher value type is over qty of voucher value type in a pack
    if (!isMatchQtyOfValuePack()) {
      openDialog({
        title: Message.ERROR,
        type: dialogConstant.type.ERROR,
        content:
          Message.VALUE_PACK_ALLOCATION
            .SCANNED_QTY_IS_OVER_QTY_OF_VOUCHER_IN_PACK,
        disableBackdropClick: true,
        actions: [
          {
            name: Action.ok,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
      return;
    }

    // mapping param for saving
    let saveParams = {};
    const generalInformation = mapGeneralInformationForSaving(detailData);
    saveParams = { ...generalInformation };

    const detailInformation = mapDetailInformationForSaving(
      dataDetailsOnGrid.data
    );
    saveParams.packVoucherAllocations = [...detailInformation];

    saveValuePackAllocation(saveParams).then(() => {
      openDialog({
        title: Message.INFORMATION,
        type: dialogConstant.type.INFO,
        content: Message.VALUE_PACK_ALLOCATION.ASSIGNED_VALUE_PACK_SUCCESSFULLY.replace(
          '%VALUE_PACK_NO%',
          fields.valuePackNo
        ),
        disableBackdropClick: true,
        actions: [
          {
            name: Action.ok,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              history.push('/voucher-management/value-pack-list');
            },
          },
        ],
      });
    });
  };

  const onCancel = () => {
    if (isStartScanning) {
      openDialog({
        title: Message.CONFIRM,
        type: dialogConstant.type.CONFIRM,
        content: Message.VALUE_PACK_ALLOCATION.CONFIRM_CANCEL_SCAN_PROCESS,
        disableBackdropClick: true,
        actions: [
          {
            name: Action.cancel,
            type: dialogConstant.button.NO_FUNCTION,
            className: buttonConstant.type.CANCEL,
          },
          {
            name: Action.ok,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              // Clear all data that scanned
              updateDataDetailsOnGrid(null, false);
            },
          },
        ],
      });
    }
  };

  const handleDelete = (rowData) => {
    let newDataOnGrid = dataDetailsOnGrid.data.filter(
      (item) => item.lineNumber !== rowData.lineNumber
    );

    // Re Update id after deleting rows
    let resetId = 1;
    newDataOnGrid = newDataOnGrid.map((el) => {
      const temp = { ...el, lineNumber: resetId };
      resetId += 1;
      return temp;
    });

    updateDataDetailsOnGrid({
      data: [...newDataOnGrid],
    });
  };

  useEffect(() => {
    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length
    ) {
      updateStateOfPaginationLabel(dataDetailsOnGrid.data);
    }
  }, [dataDetailsOnGrid]);

  useEffect(
    () => () => {
      updateDataDetailsOnGrid(null, false);
    },
    []
  );

  useEffect(() => {
    if (fields.saleOrderNo) {
      loadVPAllocationInformation(fields.saleOrderNo);
    }
  }, []);

  // Update fieldArray for first time load page
  if (!tempFieldArray) {
    updateAllFieldArray(
      fieldArray(detailData, onFieldChange, onClickLoadValuePackNoBtn)
    );
    setTempFieldArray(
      fieldArray(detailData, onFieldChange, onClickLoadValuePackNoBtn)
    );
  }

  const onFormFieldsChange = (newFieldArray) => {
    console.log('');
  };

  const renderBottomGridButtons = () => {
    let buttons = {};

    buttons =
      bottomGridButtonsArray(onCancel, onSave) &&
      bottomGridButtonsArray(onCancel, onSave).map((item, index) => (
        <Button
          key={index}
          title={item.title}
          className={item.className}
          classCustom={item.classCustom}
          handleClick={item.handleClick}
          hidden={item.hidden}
        />
      ));

    return buttons;
  };

  const renderInformation = () => {
    return (
      <FormLabelFields
        classFormFieldCustom="value-pack-allocation-general-information-form"
        fieldsLabelArray={fieldsLabelArray(detailData)}
      />
    );
  };

  const updateScannedValuePackAfterScan = (scannedValue) => {
    // Re Update id after add item
    let resetId = 1;
    let newDataOnGrid = [];
    if (dataDetailsOnGrid && dataDetailsOnGrid.data) {
      if (Array.isArray(scannedValue)) {
        newDataOnGrid = [...dataDetailsOnGrid.data, ...scannedValue];
      } else {
        newDataOnGrid = [...dataDetailsOnGrid.data];
        newDataOnGrid.push(scannedValue);
      }
    } else {
      if (Array.isArray(scannedValue)) {
        newDataOnGrid = [...scannedValue];
      } else {
        newDataOnGrid = [scannedValue];
      }
    }

    newDataOnGrid = newDataOnGrid.map((el) => {
      const temp = { ...el, lineNumber: resetId };
      resetId += 1;
      return temp;
    });

    updateDataDetailsOnGrid({
      data: [...newDataOnGrid],
    });
  };

  const updateStateOfPaginationLabel = (dataOnGrid) => {
    if (dataOnGrid.length >= totalValuePackQty) {
      setIsShowLabelBottomGrid(false);
    } else {
      setIsShowLabelBottomGrid(true);
    }
  };

  // check if scan voucher is scanned or not
  const isScannedVoucher = (serialNo) => {
    let dataScannedOnGrid = [];
    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length
    ) {
      dataScannedOnGrid = dataDetailsOnGrid.data;
    }

    return dataScannedOnGrid.findIndex((el) => el.serialNo === serialNo) !== -1;
  };

  const handleScan = (scanNo) => {
    // Check scan voucher is scanned or not
    // Prevent next action if voucher has scanned
    if (isScannedVoucher(scanNo)) {
      showErrorDialog(
        Message.VALUE_PACK_ALLOCATION.VOUCHER_ALREADY_SCANNED.replace(
          '%SERIAL_NO%',
          scanNo
        )
      );
      return;
    }
    // get Scan voucher info and show in detail list
    getScanValuePackAllocationData({
      voucherSerialNo: scanNo,
    })
      .then((res) => {
        if (res.message) {
          const message = res.message;
          const errorMessageCode =
            message.messages && message.messages[0].messageCode;
          if (
            errorMessageCode &&
            errorMessageCode ===
              ValuePackAllocationConstant.invalidVoucherSerialNoMsgCodeFormServer
          ) {
            showErrorDialog(
              Message.VALUE_PACK_ALLOCATION.INVALID_VOUCHER_SERIAL_NO.replace(
                '%SERIAL_NO%',
                scanNo
              )
            );
          }
        } else {
          updateScannedValuePackAfterScan(res.data);
        }
      })
      .catch((errorRes) => {
        const errorMessageCode =
          errorRes && errorRes.messages && errorRes.messages[0].messageCode;
        if (
          errorMessageCode &&
          errorMessageCode ===
            ValuePackAllocationConstant.invalidVoucherSerialNoMsgCodeFormServer
        ) {
          showErrorDialog(
            Message.VALUE_PACK_ALLOCATION.INVALID_VOUCHER_SERIAL_NO.replace(
              '%SERIAL_NO%',
              scanNo
            )
          );
        } else {
          showSystemErrorDialog(errorRes);
        }
      });
  };

  // In some cases, it still can the string but it jump into the error
  // handler instead of onScan handler. In these case, still send request for it
  const handleScanError = (scanNo) => {
    handleScan(scanNo);
  };

  const pageHeader = {
    pageTitle: 'Value Pack Allocation',
    showButton: true,
    buttonTitle: 'Start scanning',
    buttonAction: handleStartScanning,
    buttonCustomClass: 'value-pack-allocation-scanning-btn',
    buttonEndIcon: <ScanQR />,
  };

  return (
    <>
      <div className={classes.vPAllocationPageHeader}>
        <PageHeader {...pageHeader} />
        {isStartScanning && (
          <BarcodeReader onError={handleScanError} onScan={handleScan} />
        )}
      </div>
      <div
        className={`${classes.searchVPAllocationCover} value-pack-allocation-form`}
      >
        <div>
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
            title={'General Information'}
            customClasses={'detail-general-info'}
          >
            {renderInformation()}
          </Fieldset>
          <Fieldset title={'Details Information'}>
            <div className={classes.vPAllocationDetailGrid}>
              <TableGrid
                columns={columnsDetail}
                dataTable={dataDetailsOnGrid}
                options={options}
                actions={actions(handleDelete)}
                setFormErrorFn={setError}
                hidePagination={true}
              />

              <div className={classes.bottomGridLabelArea}>
                {isShowLabelBottomGrid && (
                  <span className="bottom-grid-label">
                    {Message.VALUE_PACK_ALLOCATION.PLEASE_SCAN}
                  </span>
                )}
              </div>
            </div>
          </Fieldset>
          <div className={classes.vPAllocationBottomGridBtn}>
            {renderBottomGridButtons()}
          </div>
        </div>
      </div>
    </>
  );
}

ValuePackAllocation.propTypes = {
  classes: PropTypes.object,
  dataDetailsOnGrid: PropTypes.any,
  updateAllFieldArray: PropTypes.func,
  updateDataDetailsOnGrid: PropTypes.func,
  match: PropTypes.object,
  history: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
  };
}

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
  mapStateToProps,
  mapDispatchToProps
)(withStyles(useStyles)(ValuePackAllocation));
