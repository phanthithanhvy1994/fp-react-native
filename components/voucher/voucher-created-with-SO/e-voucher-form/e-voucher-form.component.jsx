import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withTranslation } from 'react-i18next';
import { DialogActions, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DialogContent from '@material-ui/core/DialogContent';
import { useStyles } from '../../../shared/form/detail-form/add-items/add-items.style';
import { styleForm } from './e-voucher-form.style';
import { default as style } from '../../voucher-list.style';
import Fields from '../../../shared/fields/fields.component';
import Fieldset from '../../../shared/fieldset/fieldset.component';
import { default as ButtonCustom } from '../../../shared/buttons/button.component';
import {
  ButtonConstant,
  dialogConstant,
  FieldConstant,
  EnumDate,
  dateFormat,
  Voucher,
  Action,
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { buttonConstant } from '../../../../util/constant';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { formatDateString } from '../../../../util/date-util';
import {
  formatComboBox,
  formatDropdownList,
} from '../../../../util/format-util';
import {
  getEVoucherTypeSNPrefix,
  getSerialNo,
  getIssueBy,
  getCompanyCode,
  getChannel,
  getVoucherPromotion,
  getVoucherValueType,
  createVoucher,
} from '../../../../actions/voucher-action';

function EVoucherCreateSO(props) {
  const {
    isOpenMenu,
    t,
    onClose,
    fieldArray,
    titlePopup,
    fieldButton,
    detailData,
    saleOrderNo,
    isEditPage,
    onUpdated,
  } = props;

  const classes = { ...useStyles(), ...styleForm() };
  // const handleChange = event => {
  //   setType(event.target.value);
  // };
  const [listOptions, setListOptions] = useState({});
  const [stateOfChannel, setStateOfChannel] = useState({});

  const updateChannelFieldState = () => {
    let channelState = {};

    if (
      (detailData.saleOrderType === Voucher.typeOfSaleOrder.zs01 ||
        detailData.saleOrderType === Voucher.typeOfSaleOrder.zs02) &&
      (detailData.soDoStatus === Voucher.statusOfSoDo.a ||
        detailData.soDoStatus === Voucher.statusOfSoDo.b)
    ) {
      channelState.value = Voucher.valueOptionOfChannel.b2b;
      channelState.disabled = true;
    } else if (
      (detailData.saleOrderType === Voucher.typeOfSaleOrder.zs01 ||
        detailData.saleOrderType === Voucher.typeOfSaleOrder.zs02) &&
      detailData.soDoStatus === Voucher.statusOfSoDo.c
    ) {
      channelState.value = Voucher.valueOptionOfChannel.b2c;
      channelState.disabled = true;
    } else if (detailData.saleOrderType === Voucher.typeOfSaleOrder.zs03) {
      channelState.value = Voucher.valueOptionOfChannel.internalUsing;
      channelState.disabled = true;
    }

    setStateOfChannel(channelState);
  };

  // Get list options in form
  useEffect(() => {
    if (!isOpenMenu) {
      return;
    }
    const bodyRequest = {
      materialNo: {
        eq: detailData?.sku,
      },
    };

    // update value and state (enabled/disabled) for channel fields base on saleOrderType and soDoStatus
    updateChannelFieldState();

    Promise.all([
      getVoucherValueType(bodyRequest),
      getEVoucherTypeSNPrefix(),
      getCompanyCode(),
      getSerialNo(),
      getIssueBy(),
      getChannel(),
      getVoucherPromotion(),
    ]).then((res) => {
      setListOptions((oldState) => {
        const listOptions = {};

        listOptions.voucherValueTypeOption = formatDropdownList(res[0].data);
        listOptions.typeOfSNPrefixOption = formatDropdownList(res[1].data);
        listOptions.companyCodeOption = formatDropdownList(res[2].data);
        listOptions.serialNoOption = formatComboBox(res[3].data);
        listOptions.issueByOption = formatDropdownList(res[4].data);
        listOptions.channelOption = formatComboBox(res[5].data);
        listOptions.promotionOption = formatComboBox(res[6].data);

        return listOptions;
      });
    });
  }, [isOpenMenu, detailData]);
  const fieldsInitial = fieldArray(
    detailData,
    listOptions,
    saleOrderNo,
    stateOfChannel
  );
  const [fields, setFields] = useState(fieldsInitial);
  const appliedOnDetailData = detailData?.applyOnDay?.map((data) =>
    Object.keys(EnumDate).find((key) => EnumDate[key] === data)
  );
  const [appliedOn, setAppliedOn] = useState(appliedOnDetailData || []);

  // Fix issue not update new value
  useEffect(() => {
    setFields(fieldArray(detailData, listOptions, saleOrderNo, stateOfChannel));
  }, [fieldArray, detailData, listOptions, saleOrderNo]);

  const { errors, setValue } = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
  });

  // TODO: Validation
  // useOnMount(() => {
  //   if (validation) {
  //     validation.forEach(valid => register(valid.name, valid.rule));
  //   }
  // });

  const handleOnChange = (e, value) => {
    let newFields = [...fields];
    let fieldName = '';
    let newValue = '';

    if (e.fieldType === FieldConstant.type.QUANTITY) {
      fieldName = e.fieldName;
      newValue = value;
    }
    if (!fieldName) {
      fieldName = e.target.name;
      newValue = e.target.value;
    }
    // Set new value base on name field
    switch (fieldName) {
      // Change type of Voucher
      case Voucher.createVoucherFieldName.voucherPrefixType:
        newFields[1].map((field) => {
          return field.fieldName === fieldName
            ? (field.value = newValue)
            : field;
        });
        newFields[2].map((field) => {
          return field.fieldName === Voucher.createVoucherFieldName.serialType
            ? (field.value = newValue)
            : field;
        });
        newFields[4].map((field) => {
          return field.fieldName === Voucher.createVoucherFieldName.promotion
            ? (field.hidden = Voucher.typeOfSNPrefixVoucher.cash.includes(
              newValue
            ))
            : field;
        });
        setFields(newFields);
        setValue(fieldName, newValue);
        setValue(Voucher.createVoucherFieldName.serialType, newValue);
        break;

      default:
        for (const field of newFields) {
          field.map((obj) => {
            if (obj.fieldName === fieldName) {
              obj.value = newValue;
            }
            return obj;
          });
        }
        setFields(newFields);
        setValue(fieldName, newValue);
    }
  };

  const choseDateApply = (btn) => {
    let newFields = [...fields];

    setAppliedOn((prevState) => {
      let newApply = [...prevState];

      if (newApply.includes(btn.label)) {
        const index = newApply.indexOf(btn.label);
        newApply.splice(index, 1);
      } else {
        newApply.push(btn.label);
      }

      newFields[6].find((obj) => (obj.value = newApply));
      return newApply;
    });
    setFields(newFields);
  };

  const renderFields = (fieldArr) => {
    const array = [];
    const rowSize = 2;
    // calculate field per row
    const noOfRows = Math.ceil(fieldArr.length / rowSize);
    // Loop to get amount field per row
    const data = fieldArr;

    while (array.length < noOfRows) {
      const startValue = array.length * rowSize;
      array.push(data.slice(startValue, startValue + rowSize));
    }
    // Return row
    return array.map((item, index) => (
      <Fields
        key={index}
        conditionalArray={item}
        onChange={handleOnChange}
        errors={errors}
      />
    ));
  };

  // Handle close dialog and reset value on form
  const handleOnClose = (saveResult) => {
    onClose(saveResult);
    setAppliedOn(appliedOnDetailData || []);
  };

  const onClearFields = () => {
    setAppliedOn(appliedOnDetailData || []);
    // Reset all fields in the pop up to be empty and default value (if any)
    setFields(fieldsInitial);
  };

  /**
   * Show message dialog
   * @param {String} title
   * @param {String} type
   * @param {String} message
   */
  const showMessageDialog = (title, type, message) => {
    return openDialog({
      title: title,
      type: type,
      content: message,
      actions: [
        {
          name: Action.ok,
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const onSubmit = () => {
    const newFields = [...fields];
    let isError = false;
    let validFrom = '';
    let voucherName = '';
    for (const field of newFields) {
      for (const item of field) {
        if (item.fieldName === Voucher.createVoucherFieldName.name) {
          voucherName = item.value;
        }
        // Check field required
        if (
          !item.hidden &&
          item.required &&
          item.value?.length === 0 &&
          !item.match
        ) {
          let msg = '';
          if (item.fieldName === Voucher.createVoucherFieldName.promotion) {
            msg = Message.VOUCHER.SELECT_PROMOTION_CODE;
          } else {
            msg = Message.VOUCHER.REQUIRED_FLD.replace('%FldName%', item.label);
          }
          showMessageDialog(Message.ERROR, dialogConstant.type.ERROR, msg);
          isError = true;
          break;
        }
        // Check date valid from and to
        if (item.fieldName === Voucher.createVoucherFieldName.validFrom) {
          validFrom = item.value;
        }
        if (
          !item.hidden &&
          !item.disabled &&
          item.fieldName === Voucher.createVoucherFieldName.validTo
        ) {
          if (item.value - validFrom < 0) {
            const msg = Message.VOUCHER.ERROR_VALID_TO;

            showMessageDialog(
              Message.ERROR,
              dialogConstant.type.ERROR,
              msg
            );
            isError = true;
          } else {
            const currentDate = formatDateString(new Date(), dateFormat.savingDate);
            const validTo = formatDateString(item?.value, dateFormat.savingDate);
  
            if (validTo < currentDate) {
              const msg = Message.VOUCHER.INVALID_VALID_TO;
  
              showMessageDialog(
                Message.ERROR,
                dialogConstant.type.ERROR,
                msg
              );
              isError = true;
            }
          }
        }
      }
      if (isError) {
        break;
      }
    }
    if (!isError) {
      let dataForm = {
        voucherType: 'E',
        voucherId: isEditPage ? detailData?.voucherId : '',
      };
      // Get data form Add coupon
      for (const field of newFields) {
        field.map((item) => {
          if (item.fieldName === Voucher.createVoucherFieldName.applyOn) {
            return (dataForm[item.id] = item.value.map(
              (date) => EnumDate[date]
            ));
          }
          if (item.fieldType === FieldConstant.type.PICKER) {
            return (dataForm[item.id] = formatDateString(
              item.value,
              dateFormat.savingDateTime
            ));
          }
          return !item.hidden ? (dataForm[item.id] = item.value) : item;
        });
      }
      createVoucher(dataForm).then((res) => {
        if (res.message) {
          // when already existed by keys [Voucher Name],[Valid From],[Valid To] on DB, status 400
          showMessageDialog(
            Message.ERROR,
            dialogConstant.type.ERROR,
            (res.message.messages && res.message.messages[0].messageContent) || '');
        } else {
          handleOnClose({ isSaveSuccessfully: true });
          onUpdated && onUpdated();
          // When save success
          const msg = (isEditPage
            ? Message.VOUCHER.UPDATE_SUCCESSFULLY
            : Message.VOUCHER.SAVE_SUCCESSFULLY
          )?.replace('%voucherName%', voucherName || '');
          showMessageDialog(Message.INFORMATION, dialogConstant.type.INFO, msg);
        }
      });
    }
  };

  return (
    <>
      <form noValidate className={`${classes.form} ${classes.root}`}>
        <Dialog
          className={`${classes.createdDialog} `}
          open={isOpenMenu}
          onClose={handleOnClose}
          disableBackdropClick={true}
        >
          <div className={`${classes.titlePage} subtitle`}>
            <DialogTitle id="customized-dialog-title">
              {t(titlePopup)}
            </DialogTitle>
            <span onClick={handleOnClose} className="btnClose">
              <CloseIcon className="btnPrimary" />
            </span>
          </div>
          {isOpenMenu && (
            <DialogContent dividers>
              <div className={classes.contentGroup}>
                <div className={classes.leftGroup}>
                  <div className={classes.generalGroupField}>
                    {renderFields(fields[0])}
                  </div>
                  <div className={'formGroupField'}>
                    <div className={'leftFormGroupField leftGroupField'}>
                      <Fieldset
                        title={'S/N Prefix'}
                        customClasses="prefixGroup"
                      >
                        {renderFields(fields[1])}
                      </Fieldset>
                    </div>
                    <div className={'rightFormGroupField rightGroupField'}>
                      <Fieldset
                        title={'Serial No.'}
                        customClasses="serialGroup"
                      >
                        {renderFields(fields[2])}
                      </Fieldset>
                    </div>
                  </div>
                  <div className={'comboGroupField'}>
                    {renderFields(fields[3])}
                  </div>
                  <div>
                    <p className="ApplyDate">Applied On</p>
                    <ButtonGroup
                      size="small"
                      aria-label="small outlined button group"
                    >
                      {fieldButton?.map((btn, i) => (
                        <Button
                          key={i}
                          onClick={() => choseDateApply(btn)}
                          className={
                            appliedOn.includes(btn.label) ? 'checkedApply' : ''
                          }
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </div>
                </div>

                <div className={`${classes.haftGroup} ${classes.rightGroup}`}>
                  {renderFields(fields[4])}
                  {renderFields(fields[5])}
                </div>
              </div>
            </DialogContent>
          )}
          <DialogActions className={`${classes.btnAction}`}>
            <ButtonCustom
              handleClick={onClearFields}
              className={ButtonConstant.type.NEUTRAL}
              isFontAwesome={false}
              title="Clear"
              disabled={false}
              classCustom={classes.btnClear}
            />
            <ButtonCustom
              type="submit"
              className={ButtonConstant.type.SECONDARY}
              isFontAwesome={false}
              title="Save Draft"
              classCustom={classes.btnPrimary}
              handleClick={onSubmit}
            />
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
}

EVoucherCreateSO.propTypes = {
  isOpenMenu: PropTypes.bool,
  isEditPage: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdated: PropTypes.func,
  t: PropTypes.any,
  fieldArray: PropTypes.any,
  titlePopup: PropTypes.any,
  fieldButton: PropTypes.any,
  detailData: PropTypes.any,
  saleOrderNo: PropTypes.any,
};

export default withTranslation()(withStyles(style)(EVoucherCreateSO));
