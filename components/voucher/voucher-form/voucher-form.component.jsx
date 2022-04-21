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
import { useStyles } from '../../shared/form/detail-form/add-items/add-items.style';
import { styleForm } from './voucher-form.style';
import { default as style } from '../voucher-list.style';
import Fields from '../../shared/fields/fields.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import { default as ButtonCustom } from '../../shared/buttons/button.component';
import { ButtonConstant, dateFormat, dialogConstant, EnumDate, FieldConstant, Voucher } from '../../../constants/constants';
import {openDialog} from '../../../redux/message-dialog/message-dialog.actions';
import {buttonConstant} from '../../../util/constant';
import {Message} from '../../../constants/messages';
import { 
  formatComboBox,
  formatDropdownList
} from '../../../util/format-util';
import {
  getCompanyCode,
  getIssueBy,
  getVoucherPromotion,
  getSerialNo,
  getEVoucherTypeSNPrefix,
  getPVoucherTypeSNPrefix,
  getVoucherValueType,
  createVoucher
} from '../../../actions/voucher-action';
import {formatDateString} from '../../../util/date-util';

// function useOnMount(handler) {
//   return React.useEffect(handler, []);
// }

// NOT YET
function VoucherForm(props) {
  const { isOpenMenu, t, onClose, fieldArray, titlePopup, fieldButton, isEditPage, detailData, onUpdated } = props;
  const [type, setType] = React.useState(detailData?.voucherType || Voucher.physVoucher);
  const classes = { ...useStyles(), ...styleForm() };
  const [listOptions, setListOptions] = useState({});
  const [activation, setActivation] = useState(detailData?.activation || 0);
  const fieldsInitial = fieldArray(detailData, type, listOptions);
  const [fields, setFields] = useState(fieldsInitial);
  const appliedOnDetailData = detailData?.applyOnDay?.map(data =>
    Object.keys(EnumDate).find(key => EnumDate[key] === data)
  );
  const [appliedOn, setAppliedOn] = useState( appliedOnDetailData || []);
  let errorFormat = false;
  let errorDate = false;
  // Fix issue not update new value
  useEffect(() => {
    setFields(fieldArray(detailData, type, listOptions));
  }, [fieldArray, type, listOptions, detailData]);

  const {
    setValue,
  } = useForm({
    reValidateMode: 'onSubmit',
    submitFocusError: false,
  });

  // Get list options in form
  useEffect(() => {
    if (!isOpenMenu) {
      return;
    }

    Promise.all([
      getEVoucherTypeSNPrefix(),
      getPVoucherTypeSNPrefix(),
      getSerialNo(),
      getIssueBy(),
      getCompanyCode(),
      getVoucherValueType({
        type:'P-VOUCHER'
      }),
      getVoucherValueType({
        type:'E-VOUCHER'
      }),
      getVoucherPromotion()
    ]).then((res) => {
      setListOptions((oldState) => {
        const listOptions = {};

        listOptions.eVoucherTypeOfSNPrefixOption = formatDropdownList(res[0].data);
        listOptions.pVoucherTypeOfSNPrefixOption = formatDropdownList(res[1].data);
        listOptions.serialNoOption = formatComboBox(res[2].data);
        listOptions.issueByOption = formatDropdownList(res[3].data);
        listOptions.companyCodeOption = formatDropdownList(res[4].data);
        listOptions.pVoucherValueTypeOption = formatDropdownList(res[5].data);
        listOptions.eVoucherValueTypeOption = formatDropdownList(res[6].data);
        listOptions.promotionOption = formatComboBox(res[7].data);

        return listOptions;
      });
    });
  }, [isOpenMenu]);

  const handleOnChange = (e, value) => {
    let newFields = [...fields];
    let fieldName;
    let newValue;

    if (e.fieldType === FieldConstant.type.QUANTITY) {
      fieldName = e.fieldName;
      newValue = value;
    }
    if (!fieldName) {
      fieldName = e.target.name;
      newValue =  e.target.value;
    }
    // Check case change radio field, value is true
    if (value === true) {
      if (fieldName === Voucher.createVoucherFieldName.type) {
        setType(newValue);
        setAppliedOn(appliedOnDetailData || []);
      } else {
        newFields[7].map((field) => {
          if (field.fieldName === Voucher.createVoucherFieldName.validFrom || field.fieldName === Voucher.createVoucherFieldName.validTo) {
            field.hidden = !!+newValue;
          }
          if (field.fieldName === Voucher.createVoucherFieldName.validAfter || field.fieldName === Voucher.createVoucherFieldName.validDuration) {
            field.hidden = !+newValue;
          }
          if (field.fieldName === Voucher.createVoucherFieldName.activation) {
            field.value = +newValue;
            setActivation(+newValue);
          }
          return field;
        });
        setFields(newFields);
      }
    } else {
      // Set new value base on name field
      switch (fieldName) {
        // Change type of Voucher
        case Voucher.createVoucherFieldName.voucherPrefixType:
          newFields[4].map(field => {
            return (field.fieldName === fieldName) ? (field.value = newValue) : field;
          });
          newFields[5].map(field => {
            return (field.fieldName === Voucher.createVoucherFieldName.serialType) ? (field.value = newValue) : field;
          });
          newFields[6].map(field => {
            return (field.fieldName === Voucher.createVoucherFieldName.promotion) ? (field.hidden = (Voucher.typeOfSNPrefixVoucher.cash.includes(newValue))) : field;
          });
          setFields(newFields);
          setValue(fieldName, newValue);
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

      newFields[3].find((obj) => (obj.value = newApply));
      return newApply;
    });
    setFields(newFields);
  };

  /**
   * Render to Fields base on field Array
   * @param {Array} fieldArr 
   */
  const renderFields = (fieldArr) => {
    return (
      <Fields
        conditionalArray={fieldArr}
        onChange={handleOnChange}
      />
    );
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
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const renderLayoutVoucher = () => {
    return (type === Voucher.physVoucher) ? (
      <Fieldset title={'Booklet'} customClasses="bookletGroup">
        <div className="booklet-cls">
          {renderFields(fields[2])}
          <p className="totalBooklet">Total Booklet: <span className="numOfTotal">
            {totalBooklet()}
          </span></p>
        </div>
        <div className="booklet-error"> 
          <span className={`${errorFormat ? 'is-error' : 'no-error'}`} > {Message.VOUCHER.INPUT_NUMBER} </span>
        </div>
      </Fieldset>
    ) : (
      <>
        <div className="eVoucher">{renderFields(fields[7])}</div>
        {inputValidDate()}
      </>
    );
  };

  const inputValidDate = () => {
    if (activation) {
      const validAfter = fields && fields[7].find((field) => field.fieldName === Voucher.createVoucherFieldName.validAfter).value;
      const validDuration = fields && fields[7].find((field) => field.fieldName === Voucher.createVoucherFieldName.validDuration).value;
      errorDate = false;

      if (
        validAfter%1 !== 0 || validDuration%1 !== 0 ||
        validAfter === '-0'||
        +validAfter < 0 || validDuration < 0
      ) {
        errorDate = true;
      }
      
      return <span className={`valid-date ${errorDate ? 'is-error' : 'no-error'}`} > {Message.VOUCHER.INPUT_NUMBER} </span>;
    }
  };

  const totalBooklet = () => {
    const newFields = [...fields];
    const totalVoucher = newFields && newFields[2].find((field) => field.fieldName === Voucher.createVoucherFieldName.totalVoucherQty).value;
    const numberVoucher = newFields && newFields[2].find((field) => field.fieldName === Voucher.createVoucherFieldName.qtyPerBooklet).value;

    if ((totalVoucher/numberVoucher)%1 !== 0) {
      errorFormat = true;
      return Math.ceil(totalVoucher/numberVoucher);
    }
    errorFormat = false;
    return totalVoucher/numberVoucher;
  };

  const onClearFields = () => {
    // Reset all fields in the pop up to be empty and default value (if any)
    setAppliedOn(appliedOnDetailData || []);
    setFields(fieldsInitial);
  };

  // Handle close dialog and reset value on form
  const handleOnClose = () => {
    onClose();
    setAppliedOn(appliedOnDetailData || []);
  };

  const onSubmit = () => {
    const newFields = [...fields];
    let isError = false;
    let validFrom = '';
    let voucherName = '';

    if (errorFormat || errorDate) {
      return;
    }

    for (const field of newFields) {
      for (const item of field) {

        if (item.fieldName === Voucher.createVoucherFieldName.name) {
          voucherName = item.value;
        }
        // Check field required
        if (!item.hidden && item.required && (item.value?.length === 0) && !item.match) {
          let msg = '';

          if (item.fieldName === Voucher.createVoucherFieldName.promotion) {
            msg = Message.VOUCHER.SELECT_PROMOTION_CODE;
          } else {
            msg = Message.VOUCHER.REQUIRED_FLD.replace(
              '%FldName%',
              item.label
            );
          }
          showMessageDialog(
            Message.ERROR,
            dialogConstant.type.ERROR,
            msg
          );
          isError = true;
          break;
        }

        // Check valid After and valid Duration is integer
        if (
          !item.hidden &&
          (item.fieldName === Voucher.createVoucherFieldName.validAfter || item.fieldName === Voucher.createVoucherFieldName.validDuration)
          && (item.value%1 !== 0)
        ) {
          const msg = Message.VOUCHER.DATE_NUMBER.replace(
            '%FldName%',
            item.label
          );

          showMessageDialog(
            Message.ERROR,
            dialogConstant.type.ERROR,
            msg
          );
          isError = true;
          break;
        }

        // Check date valid from and to
        if (item.fieldName === Voucher.createVoucherFieldName.validFrom) {
          validFrom = item.value;
        }

        if (!item.hidden && !item.disabled && (item.fieldName === Voucher.createVoucherFieldName.validTo)) {
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
      };
      if (isError) {
        break;
      }
    };

    if (!isError) {
      let dataForm = {
        voucherId: isEditPage ? detailData?.voucherId : ''
      };
      
      // Get data form Add voucher
      for (const field of newFields) {
        field.map(item => {
          if (item.fieldName === Voucher.createVoucherFieldName.applyOn) {
            return dataForm[item.id] = item?.value?.map((date) => (EnumDate[date]))?.filter((date) => (date !== null));
          }
          if (!item.hidden && item.fieldType === FieldConstant.type.PICKER) {
            return dataForm[item.id] = formatDateString(item.value, dateFormat.savingDateTime);
          }
          return (!item.hidden) ? (dataForm[item.id] = item.value) : item;
        });
      };

      createVoucher(dataForm).then((res) => {
        if (res.message) {
          // when already existed by keys [Voucher Name],[Voucher Mat Desc],[YY] on DB, status 400
          showMessageDialog(
            Message.ERROR,
            dialogConstant.type.ERROR,
            (res.message.messages && res.message.messages[0].messageContent) || ''
          );
        } else {
          handleOnClose();
          onUpdated && onUpdated();
          // When save success
          const msg = (isEditPage ? Message.VOUCHER.UPDATE_SUCCESSFULLY : Message.VOUCHER.SAVE_SUCCESSFULLY).replace(
            '%voucherName%',
            voucherName || ''
          );
          showMessageDialog(
            Message.INFORMATION,
            dialogConstant.type.INFO,
            msg
          );
        }
      });
    }
  };

  return (
    <>
      <form
        noValidate
        className={`${classes.form} ${classes.root}`}
      >
        <Dialog
          className={`${classes.createdDialog} `}
          open={isOpenMenu}
          onClose={onClose}
          disableBackdropClick={true}
        >
          <div className={`${classes.titlePage} subtitle`}>
            <DialogTitle id="customized-dialog-title">
              {t(titlePopup)}
            </DialogTitle>
            <span onClick={onClose} className="btnClose">
              <CloseIcon/>
            </span>
          </div>
          {isOpenMenu && (
            <DialogContent dividers>
              <div className={classes.contentGroup}>
                <div className={classes.leftGroup} id="leftGroup">
                  <div className={'generalField'}>
                    {renderFields(fields[0])}
                    {renderFields(fields[1])}
                  </div>

                  {renderLayoutVoucher()}
                  <p className="ApplyDate">Applied On <span>*</span></p>
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
                  <div className={classes.groupPrefixSerial}>
                    <div
                      className={`${classes.haftGroup} ${classes.leftGroup}`}
                    >
                      <Fieldset
                        title={'S/N Prefix'}
                        customClasses="prefixGroup"
                      >
                        {renderFields(fields[4])}
                      </Fieldset>
                    </div>

                    <div
                      className={`${classes.haftGroup} ${classes.rightGroup}`}
                    >
                      <Fieldset
                        title={'Serial No.'}
                        customClasses="serialGroup"
                      >
                        {renderFields(fields[5])}
                      </Fieldset>
                    </div>
                  </div>
                </div>
                <div
                  className={classes.rightGroup}
                >
                  {renderFields(fields[6])}
                </div>
              </div>
            </DialogContent>
          )}
          <DialogActions className={'btnAction'}>
            <ButtonCustom
              handleClick={onClearFields}
              className={ButtonConstant.type.NEUTRAL}
              isFontAwesome={false}
              title="Clear"
              disabled={false}
              classCustom={classes.btnClear}
            />
            <ButtonCustom
              handleClick={onSubmit}
              type="submit"
              className={ButtonConstant.type.SECONDARY}
              isFontAwesome={false}
              title="Save Draft"
              classCustom={classes.btnPrimary}
            />
          </DialogActions>
        </Dialog>
      </form>
    </>
  );
}

VoucherForm.propTypes = {
  isOpenMenu: PropTypes.bool,
  isEditPage: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdated: PropTypes.func,
  t: PropTypes.any,
  fieldArray: PropTypes.any,
  titlePopup: PropTypes.any,
  fieldButton: PropTypes.any,
  detailData: PropTypes.any,
};

export default withTranslation()(withStyles(style)(VoucherForm));
