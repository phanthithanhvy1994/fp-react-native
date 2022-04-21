import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import Fieldset from '../../shared/fieldset/fieldset.component';
import Fields from '../../shared/fields/fields.component';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { default as ButtonCustom } from '../../shared/buttons/button.component';
import { styleForm } from './coupon-add.style';
import {Message} from '../../../constants/messages';
import {buttonConstant} from '../../../util/constant';
import {withStyles} from '@material-ui/styles';
import {
  fieldArray,
  fieldButton
} from './coupon-add.config';
import {
  ButtonConstant,
  CouponConstant,
  dialogConstant,
  EnumDate,
  FieldConstant,
  dateFormat
} from '../../../constants/constants';
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@material-ui/core';
import {
  getCouponType,
  getCompanyCode,
  getCouponTypeSNPrefix,
  getSerialNo,
  getIssueType,
  getCouponValueType,
  getCouponPromotion,
  saveCoupon
} from '../../../actions/coupon-action';
import { 
  formatComboBox,
  formatDropdownList
} from '../../../util/format-util';
import {formatDateString} from '../../../util/date-util';

class CouponAddNew extends React.Component {

  constructor(props) {
    super(props);
    const { detailData, isEditPage } = this.props;

    this.state = {
      type: isEditPage ? String(detailData?.couponType) : '',
      openBookletGroup: isEditPage ? (detailData?.couponType === +CouponConstant.typeCoupon.paperLeaflet && detailData?.serialCodeType !== CouponConstant.serialCodeType.fix) : false,
      fields: [],
      fieldsInitial: [],
      appliedOn: detailData?.appliedOnDay?.map(data =>
        Object.keys(EnumDate).find(key => EnumDate[key] === data)
      )?.filter(date => date) || [],
      comboOptions: {},
      optionsRadio: {},
      validateDateTypeSelect: detailData?.validateDateType || CouponConstant.validateDateType.fixDate,
    };
    this.isMounting = true;
    this.errorFormat = false;
    this.errorDate = false;
  };

  componentDidMount = () => {
    this.loadComboOptions();
  };

  componentWillUnmount() {
    this.isMounting = false;
  };

  /**
   * Get combo options from response API
   */
  loadComboOptions = () => {
    // Get combo options
    // TODO: Waiting API
    const {comboOptions, type} = this.state;
    const {detailData} = this.props;
    const body = {
      type:'P-COUPON'
    };

    Promise.all([
      getCouponType(),
      getCompanyCode(),
      getCouponTypeSNPrefix(),
      getSerialNo(),
      getIssueType(),
      getCouponValueType(body),
      getCouponPromotion()
    ]).then((res) => {
      comboOptions.typeCouponCombo = formatComboBox(res[0]?.data);
      comboOptions.companyCodeCombo = formatDropdownList(res[1]?.data);
      comboOptions.pCouponTypeOfSNPrefixOption = formatDropdownList(res[2]?.data?.slice(0, 2));
      comboOptions.eCouponTypeOfSNPrefixOption = formatDropdownList(res[2]?.data?.slice(2, 4));
      comboOptions.serialNoCombo = formatComboBox(res[3]?.data);
      comboOptions.issueCombo = formatDropdownList(res[4]?.data);
      comboOptions.couponValueTypeCombo = formatDropdownList(res[5]?.data);
      comboOptions.promotionCombo = res[6]?.data.map(
        (item) => ({
          ...item,
          value: item.code,
          display: item.value
        })
      );

      const optionsRadio = {
        serialCodeTypeCombo: [
          { value: '1', name: 'Fix Serial Code' },
          { value: '2', name: 'Running Serial Code' },
        ],
        validateDateTypeCombo: [
          { value: '1', name: 'Fix Date' },
          { value: '2', name: 'Determined from the date of sale' },
        ]
      };
      const newType = type || (comboOptions?.typeCouponCombo && comboOptions.typeCouponCombo[1]?.value) || '';
      const fields = fieldArray(detailData, null, newType, comboOptions, optionsRadio);

      this.setState({
        type: newType,
        fieldsInitial: JSON.parse(JSON.stringify(fields)),
        fields,
        optionsRadio, 
        comboOptions
      });
    });
  };

  /**
   * Handle change on field
   * @param {*} e 
   * @param {*} value 
   */
  handleOnChange = (e, value) => {
    const { fields, optionsRadio, comboOptions, type, openBookletGroup, validateDateTypeSelect } = this.state;
    const { detailData } = this.props;
    const { fieldsName, validateDateType, serialCodeType } = CouponConstant;
    let newOpenBooklet = openBookletGroup;
    let newValidateDateType = validateDateTypeSelect;
    let fieldNameChange;
    let newValue;

    if (e.fieldType === FieldConstant.type.QUANTITY) {
      fieldNameChange = e.fieldName;
      newValue = value;
    }

    if (!fieldNameChange) {
      fieldNameChange = e.target.name;
      newValue =  e.target.value;
    }

    if (!this.isMounting) {
      return;
    }

    // Check case change radio field, value is true
    if (value === true) {
      switch (fieldNameChange) {
        // Show or hide Total field
        case fieldsName.serialCodeType:
        case fieldsName.serialCodeTypeReceipt:
        case fieldsName.serialCodeTypeElectronic:
          const isFixSerialCode = newValue === serialCodeType.fix;

          // Set value to serial code
          fields[1].map(
            (field) => {
              if (field.fieldName.includes(fieldsName.serialCodeType) && !field.hidden) {
                field.value = newValue;
              };
              return field;
            }
          );

          // Show/hide total coupon
          if (type === CouponConstant.typeCoupon.paperLeaflet) {
            fields[5].map(
              (field) => (field.hidden = isFixSerialCode)
            );
            newOpenBooklet = !isFixSerialCode;
          } else {
            fields[1].map(
              (field) => {
                if (field.fieldName === fieldsName.totalCouponElectronic) {
                  field.hidden = isFixSerialCode;
                }
                return field;
              }
            );
          }
          break;
        case fieldsName.amountValue:
          fields[2].map(field => {
            if (field.fieldType === FieldConstant.type.RADIO) {
              field.data[0].inputField.value = newValue;
            }
            return fields;
          });
          break;

        case fieldsName.percentageValue:
          fields[2].map(field => {
            if (field.fieldType === FieldConstant.type.RADIO) {
              field.data[1].inputField.value = newValue;
            }
            return fields;
          });
          break;

          // Show or hide valid date
        case fieldsName.validateDateType:
          const isDeterminedDate = (newValue === validateDateType.determined);
          newValidateDateType = newValue;
          fields[1].map(field => (field.fieldName === fieldNameChange) ? (field.value = newValue) : field);
          //Show valid after and valid duration, hide valid from and valid to
          fields[3].map(field => {
            switch(field.fieldName) {
              case fieldsName.validFrom: 
              case fieldsName.validTo: 
                field.hidden = isDeterminedDate;
                break;

              case fieldsName.validAfter: 
              case fieldsName.validDuration: 
                field.hidden = !isDeterminedDate;
                break;
              default:
                break;
            }
            return field;
          });

          break;
        
        // Show or hide input fields under button radio coupon Value Type
        case fieldsName.couponValueType:
          fields[2].map(field => {
            return (field.fieldName === fieldsName.couponValueType) ? (
              field.value = newValue,
              field.data.map(item => 
              {
                item.inputField.value = '';
                item.inputField.hidden = (item.value !== newValue);
                return item;
              }
              )
            ): field;
          });
          break;
      
        default:
          for (const field of fields) {
            field.map(obj => (obj.fieldName === fieldNameChange) ? (obj.value = newValue) : obj);
          };
          break;
      }

      this.setState({
        fields,
        openBookletGroup: newOpenBooklet,
        validateDateTypeSelect: newValidateDateType
      });
      return true;
    }

    // Set new value base on name field
    switch (fieldNameChange) {
      // Change type of Coupon
      case fieldsName.type:
        const newDetailData = (detailData && {...detailData, couponType: newValue}) || {};
        let couponValue = '';

        fields[0].map(
          (item) => {
            if (item.fieldName === CouponConstant.fieldsName.name ) {
              couponValue = item.value;
            }
            return item;
          }
        );

        const newFields = fieldArray(newDetailData, couponValue, newValue, comboOptions, optionsRadio);

        // Check case change Type Serial No when select type 
        const eTypeSerial = comboOptions.eCouponTypeOfSNPrefixOption.map((item) => +item.value);
        const pTypeSerial = comboOptions.pCouponTypeOfSNPrefixOption.map((item) => +item.value);

        let isChange = false;
        let newValueTypeSerial = '';

        if (detailData && newValue === CouponConstant.typeCoupon.Electronic) {
          if (pTypeSerial.includes(+detailData.typeSystemRunning)) {
            isChange = true;
            newValueTypeSerial = eTypeSerial[0];
          }
        } else if (eTypeSerial.includes(+detailData.typeSystemRunning)) {
          isChange = true;
          newValueTypeSerial = pTypeSerial[0];
        }

        if (isChange) {
          newFields[6].map(field => {
            return (field.fieldName === fieldNameChange) ? (field.value = newValueTypeSerial) : field;
          });
  
          // Set value of serial type base on value of refix type
          newFields[7].map(field => {
            return (field.fieldName === fieldsName.serialType) ? (field.value = newValueTypeSerial) : field;
          });
          
          // Show and hide Promotion code base on value of refixType is Produce or Cash
          (newValue === CouponConstant.typeCoupon.paperLeaflet? newFields[3] : newFields[8]).map(field => {
            return (field.fieldName === fieldsName.promotion) ? (
              field.hidden = true) : field;
          });
        }

        this.setState ({
          // Hide Booklet Group when change type (serial Code type default of Leaflet is Fix Serial Code)
          openBookletGroup: detailData?.serialCodeType ? (newValue === CouponConstant.typeCoupon.paperLeaflet && detailData.serialCodeType !== CouponConstant.serialCodeType.fix) : false,
          // Change type to new value of type
          type: newValue,
          // Change fields base on new type
          fields: newFields,
          appliedOn: newDetailData?.appliedOnDay?.map(data =>
            Object.keys(EnumDate).find(key => EnumDate[key] === data)
          )?.filter(date => date) || [],
        });
        break;

      // Change type of S/N Prefix
      case fieldsName.prefixType: 
        // Set new value for S/N Prefix Type
        fields[6].map(field => {
          return (field.fieldName === fieldNameChange) ? (field.value = newValue) : field;
        });

        // Set value of serial type base on value of refix type
        fields[7].map(field => {
          return (field.fieldName === fieldsName.serialType) ? (field.value = newValue) : field;
        });
        
        // Show and hide Promotion code base on value of refixType is Produce or Cash
        (type === CouponConstant.typeCoupon.paperLeaflet? fields[3] : fields[8]).map(field => {
          return (field.fieldName === fieldsName.promotion) ? (
            field.hidden = (CouponConstant.product.includes(+newValue) ? false : true)
          ) : field;
        });

        this.setState({
          fields
        });
        break;
      
      // Change other fields
      default:
        for (const field of fields) {
          field.map(obj => (obj.fieldName === fieldNameChange) ? (obj.value = newValue) : obj);
        };

        this.setState({
          fields
        });
        break;
    }
  };

  /**
   * Handle click date on Applied on
   * @param {*} btn 
   */
  choseDateApply = btn => {
    const { fields, appliedOn } = this.state;

    if (appliedOn.includes(btn.label)) {
      const index = appliedOn.indexOf(btn.label);

      appliedOn.splice(index, 1);
    } else {
      appliedOn.push(btn.label);
    }

    fields[4].find(obj => (obj.value = appliedOn));

    this.isMounting && this.setState({ fields, appliedOn });
  };

  /**
   * Render to Fields base on field Array
   * @param {Array} fieldArr 
   */
  renderFields = fieldArr => {
    return (
      <Fields
        conditionalArray={fieldArr}
        onChange={this.handleOnChange}
      />
    );
  };

  /**
   * Show message dialog
   * @param {String} title 
   * @param {String} type 
   * @param {String} message 
   */
  showMessageDialog = (title, type, message) => {
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

  /**
   * Calculate total Booklet base on total coupon and number of coupon
   */
  totalBooklet = () => {
    const { fields } = this.state;
    const totalCoupon = fields[5].find(field => field.fieldName === CouponConstant.fieldsName.totalCoupon).value;
    const numberOfCoupon = fields[5].find(field => field.fieldName === CouponConstant.fieldsName.numberOfCoupon).value;

    if ((totalCoupon/numberOfCoupon)%1 !== 0) {
      this.errorFormat = true;
      return Math.ceil(totalCoupon/numberOfCoupon);
    }

    this.errorFormat = false;
    return totalCoupon/numberOfCoupon;
  };

  inputValidDate = () => {
    const { validateDateTypeSelect, fields } = this.state;

    if (+validateDateTypeSelect === +CouponConstant.validateDateType.determined) {
      const validAfter = fields && fields[3].find((field) => field.fieldName === CouponConstant.fieldsName.validAfter).value;
      const validDuration = fields && fields[3].find((field) => field.fieldName === CouponConstant.fieldsName.validDuration).value;
      this.errorDate = false;

      if (
        validAfter%1 !== 0 || validDuration%1 !== 0 ||
        validAfter < 0 || validDuration < 0
      ) {
        this.errorDate = true;
      }
      
      return <span className={`valid-date ${this.errorDate ? 'is-error' : 'no-error'}`} > {Message.COUPON.INPUT_NUMBER} </span>;
    }
  };

  // Handle close dialog and reset value on form
  handleOnClose = () => {
    const { onClose } = this.props;

    onClose();
    this.setState({
      appliedOn: []
    });
  };

  /**
   * Handle click Clear button, reset all value of fields
   */
  onClearFields = () => {
    const { fieldsInitial } = this.state;
    const { isEditPage , detailData } = this.props;
    this.setState({
      fields: JSON.parse(JSON.stringify(fieldsInitial)),
      appliedOn: detailData?.appliedOnDay?.map(data =>
        Object.keys(EnumDate).find(key => EnumDate[key] === data)
      )?.filter(date => date) ||[],
      openBookletGroup: isEditPage ? 
        (detailData?.couponType === +CouponConstant.typeCoupon.paperLeaflet && detailData?.serialCodeType !== CouponConstant.serialCodeType.fix)
        : false,
    });
  };

  /**
   * Handle submit data when click Save Draft button
   * @param {*} data 
   */
  onSubmit = () => {
    const { fields } = this.state;
    const { isEditPage, detailData } = this.props;
    let isError = false;
    let validFrom = '';
  
    if (this.errorFormat || this.errorDate) {
      return;
    }

    for (const field of fields) {
      for (const item of field) {
        // Check field required
        if (!item.hidden && item.required && !item.match && !item.disabled) {
          let msg = '';
          let inValid = false;

          if (item.fieldName === CouponConstant.fieldsName.couponValueType) {
            item.data?.map(
              typeValue => {
                if (typeValue.value === item.value && !typeValue.inputField.value) {
                  inValid = true;
                  msg = Message.COUPON.REQUIRED_FLD.replace(
                    '%FldName%',
                    item.label
                  );
                }
                return item;
              }
            );
          } else if (item.value?.length === 0) {
            if (item.fieldName === CouponConstant.fieldsName.promotion) {
              msg = Message.COUPON.SELECT_PROMOTION_CODE;
            } else {
              msg = Message.COUPON.REQUIRED_FLD.replace(
                '%FldName%',
                item.label
              );
            }
            inValid = true;
          }
          
          if (inValid) {
            this.showMessageDialog(
              Message.ERROR,
              dialogConstant.type.ERROR,
              msg
            );
            isError = true;
            break;
          }
        }

        // Check date valid from and to
        if (item.fieldName === CouponConstant.fieldsName.validFrom) {
          validFrom = item.value;
        }
        if (!item.hidden && !item.disabled && (item.fieldName === CouponConstant.fieldsName.validTo)) {
          if ( (item.value - validFrom < 0)) {
            const msg = Message.COUPON.ERROR_END_DAY;

            this.showMessageDialog(
              Message.ERROR,
              dialogConstant.type.ERROR,
              msg
            );
            isError = true;
          } else {
            const currentDate = formatDateString(new Date(), dateFormat.savingDate);
            const validTo = formatDateString(item?.value, dateFormat.savingDate);
  
            if (validTo < currentDate) {
              const msg = Message.COUPON.INVALID_VALID_TO;
  
              this.showMessageDialog(
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
        couponId: isEditPage ? detailData.couponId : ''
      };
      
      // Get data form Add coupon
      for (const field of fields) {
        field.map(item => {
          if (!item.hidden && item.fieldName === CouponConstant.fieldsName.applyOn) {
            return dataForm[item.id] = item?.value?.map((date) => (EnumDate[date]))?.filter((date) => (date !== null));
          }
          if (!item.hidden && item.fieldType === FieldConstant.type.PICKER) {
            return dataForm[item.id] = formatDateString(item.value, dateFormat.savingDateTime);
          }
          if (!item.hidden && item.fieldName === CouponConstant.fieldsName.couponValueType) {
            const typeSelect = item.data.find((type) => (!type.inputField.hidden));

            if (typeSelect.inputField.fieldName === CouponConstant.fieldsName.percentageValue) {
              dataForm[item.id] = typeSelect.inputField.value + '%';
              dataForm[item.fieldName] = CouponConstant.couponValueType.percentage;
            } else {
              dataForm[item.id] = typeSelect.inputField.value;
              dataForm[item.fieldName] = CouponConstant.couponValueType.amount;
            };

            return dataForm;
          }
          return (!item.hidden) ? (dataForm[item.id] = item.value) : item;
        });
      };

      saveCoupon(dataForm).then((res) => {
        if (res.message) {
          // when already existed by keys [Coupon Name],[Valid From],[Valid To] on DB
          const msg = Message.COUPON.EXIST_COUPON;
          this.showMessageDialog(
            Message.ERROR,
            dialogConstant.type.ERROR,
            msg
          );
        } else {
          // When save success
          const { onUpdate } = this.props;
          const msg = (isEditPage ? Message.COUPON.UPDATE_SUCCESS : Message.COUPON.SAVE_SUCCESS).replace(
            '%CpName%', res.data?.couponName
          );
          onUpdate && onUpdate();
          this.handleOnClose();
          this.showMessageDialog(
            Message.INFORMATION,
            dialogConstant.type.INFO,
            msg
          );
        }
      });
    }
  };

  render() {

    const { classes, t, isOpenDialog, isEditPage } = this.props;
    const { openBookletGroup, fields, appliedOn, type } = this.state;

    return (
      <>
        { this.isMounting && isOpenDialog && (fields.length > 0) && (
          <Dialog
            className={`${classes.addDialog} `}
            open={isOpenDialog}
            onClose={this.handleOnClose}
            disableBackdropClick={true}
          >
            <div className={`${classes.titlePage} subtitle`}>
              <DialogTitle id="customized-dialog-title">
                {t(isEditPage ? 'Update Coupon' : 'Create Coupon')}
              </DialogTitle>
              <span onClick={this.handleOnClose} className='close-btn'>
                <CloseIcon className="btnPrimary" />
              </span>
            </div>
            <DialogContent dividers>
              <div className={classes.dialogContentCoupon}>
                <div className={classes.topDialog}>
                  <div className={classes.leftTopDialog}>
                    {this.renderFields(fields[0])}
                    <div className={`type-of-${type} type-radio`}>
                      {this.renderFields(fields[1])}
                    </div>
                  </div>
                  <div className={`${classes.rightTopDialog} ${type === CouponConstant.typeCoupon.paperReceipt ? 'part-width' : 'half-width'}`}>

                    {this.renderFields(fields[2])}

                    {this.renderFields(fields[3])}
                    {this.inputValidDate()}
                  </div>
                  
                </div>
                <div className={classes.bottomDialog}>
                  <div className={classes.leftBottomDialog}>
                    {/* Applied On */}
                    <p className="ApplyDate">Applied On <span>*</span></p>
                    <ButtonGroup
                      size="small"
                      aria-label="small outlined button group"
                    >
                      {fieldButton?.map((btn, i) => (
                        <Button
                          key={i}
                          onClick={() => this.choseDateApply(btn)}
                          className={
                            appliedOn.includes(btn.label) ? 'checkedApply' : ''
                          }
                        >
                          {btn.label}
                        </Button>
                      ))}
                    </ButtonGroup>

                    {/* Booklet group */}
                    { openBookletGroup && 
                      <Fieldset title={'Booklet'} customClasses="bookletGroup">
                        <div className="booklet-cls">
                          {this.renderFields(fields[5])}
                          <p className="totalBooklet">
                            <span>Total Booklet</span> 
                            {this.totalBooklet()}
                          </p>
                        </div>
                        <div className="booklet-error">
                          <span className={`${this.errorFormat ? 'is-error' : 'no-error'}`} > {Message.COUPON.INPUT_NUMBER} </span>
                        </div>
                      </Fieldset>
                    }

                    <div className={classes.groupSerialNo}>
                      {/* SN Prefix */}
                      <Fieldset
                        title={'S/N Prefix'}
                        customClasses="prefixGroup"
                      >
                        {this.renderFields(fields[6])}
                      </Fieldset>

                      {/* Serial No */}
                      <Fieldset
                        title={'Serial No.'}
                        customClasses="serialGroup"
                      >
                        {this.renderFields(fields[7])}
                      </Fieldset>
                    </div>
                  </div>
                  <div className={`${classes.rightBottomDialog} ${type === CouponConstant.typeCoupon.Electronic ? 'half-width' : 'part-width'}`}>
                    {this.renderFields(fields[8])}
                  </div>
                </div>
              </div>
            </DialogContent>

            <DialogActions>
              <span className={`${classes.buttonDialog}`}>
                <ButtonCustom
                  handleClick={this.onClearFields}
                  className={ButtonConstant.type.NEUTRAL}
                  isFontAwesome={false}
                  title="Clear"
                  disabled={false}
                  classCustom='clearDialog'
                />
                <ButtonCustom
                  handleClick={this.onSubmit}
                  className={ButtonConstant.type.PRIMARY}
                  isFontAwesome={false}
                  title="Save Draft"
                  classCustom='submitDialog'
                />
              </span>
            </DialogActions>
          </Dialog>
        )}
      </>
    );
  }
};

CouponAddNew.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  detailData: PropTypes.any,
  isOpenDialog: PropTypes.bool,
  isEditPage: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdate: PropTypes.func,
  classes: PropTypes.object
};
export default withTranslation()(withStyles(styleForm)(CouponAddNew));
