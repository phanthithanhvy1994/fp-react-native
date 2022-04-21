import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import useStyles from '../branch-bom-price-list.style';

import { addFields, validation } from './branch-bom-price-add.config';
import FPDialog from '../../../shared/dialog/dialog.component';
import AddForm from '../../../shared/add-form/add-form.component';
import Fieldset from '../../../shared/fieldset/fieldset.component';
import Button from '../../../shared/buttons/button.component';

import {
  BRANCH_GROUP_CODE,
  CHANNEL,
  COMPANY_CODE,
} from '../branch-bom-price.constant';
import { BranchBOMPrice, ButtonConstant, dateFormat } from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';

import { getDataCompanyCode } from '../../../../actions/branch-bom-action';
import { addBranchBOMPrice } from '../../../../actions/branch-bom-price.action';
import { getAllBranchGroup } from '../../../../actions/branch-group.action';
import { getAllChannel } from '../../../../actions/channel.action';
import { formatDateString } from '../../../../util/date-util';
import { showInformation, showError } from '../branch-bom-price.util';
import {
  formatComboBox,
  formatDropdownList,
} from '../../../../util/format-util';

const BranchBOMPriceAdd = (props) => {
  const { t } = useTranslation();
  const { classes, onSave } = props;
  const ref = useRef(null);

  const customClass = 'branch-bom-price-add-bar';

  const [addFieldArray, setAddFieldArray] = useState(addFields);
  const [newBOMPriceHeaders, setNewBOMPriceHeaders] = useState();

  const [isClosedDialog, setIsClosedDialog] = useState(false);

  const { handleSubmit, errors, register, setValue, clearErrors } = useForm({
    reValidateMode: 'onSubmit',
  });

  useEffect(() => {
    // Get combobox data and reload into state
    Promise.all([
      getAllBranchGroup(),
      getAllChannel(),
      getDataCompanyCode(),
    ]).then((res) => {
      setAddFieldArray((oldState) => {
        const data = [...oldState];
        // Rebuild Branch group
        data.find((obj) => obj.fieldName === BRANCH_GROUP_CODE)[
          'data'
        ] = formatDropdownList(res[0].data);

        // Rebuild Channel
        data.find((obj) => obj.fieldName === CHANNEL)['data'] = formatComboBox(
          res[1].data
        );

        // Rebuild Company Code
        data.find((obj) => obj.fieldName === COMPANY_CODE)[
          'data'
        ] = formatDropdownList(res[2].data);

        clearErrors();
        return [...data];
      });
    });
  }, [clearErrors]);

  const saveBOMPrice = () => {
    let status = BranchBOMPrice.status.draft;
    const endDate = formatDateString(
      newBOMPriceHeaders.endDate,
      dateFormat.savingDateTimeEndDate
    );
    const currentDate = formatDateString(Date.now(), dateFormat.savingDateTime);
    if (endDate < currentDate) {
      status = BranchBOMPrice.status.expired;
    }
    const newData = {
      ...newBOMPriceHeaders,
      channel: +newBOMPriceHeaders.channel,
      startDate: formatDateString(
        newBOMPriceHeaders.startDate,
        dateFormat.savingDateTimeStartDate
      ),
      endDate: endDate,
      status: status,
    };

    const isDateInvalid =
      newBOMPriceHeaders.startDate > newBOMPriceHeaders.endDate;
    if (isDateInvalid) {
      showError(Message.BRANCH_BOM_PRICE.DATE_VALIDATION);
      return;
    }
    openDialog({
      title: Message.CONFIRM,
      content: Message.BRANCH_BOM_PRICE.CREATE_SAVE_CONFIRM,
      type: dialogConstant.type.CONFIRM,
      actions: [
        {
          name: 'Cancel',
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            addBranchBOMPrice(newData).then(
              (res) => {
                if (res && res.status === '200') {
                  if (res.message && res.message.messages) {
                    if (
                      res.message.messages[0].messageCode ===
                      Message.BRANCH_BOM_PRICE.ERROR_DUPPLICATE
                    ) {
                      showError(
                        `${Message.BRANCH_BOM_PRICE.ADD_DUPPLICATED}`.replace(
                          'priceListName',
                          `${newData.bomPriceName}`
                        )
                      );
                    } else {
                      showError(res.message.messages[0].messageContent);
                    }
                  } else {
                    setNewBOMPriceHeaders();
                    setAddFieldArray(addFields);
                    onSave();
                    setIsClosedDialog(true);
                    onClearFields();

                    showInformation(
                      `${Message.BRANCH_BOM_PRICE.SAVE_SUCCESS}`.replace(
                        'priceListName',
                        `${newData.bomPriceName}`
                      )
                    );
                  }
                }
              },
              (err) => {
                showError(err.messages[0].messageContent);
              }
            );
          },
        },
      ],
    });
  };

  const onFormFieldsChange = (data) => {
    setNewBOMPriceHeaders(data);
  };

  const onClearFields = () => {
    clearErrors();
    ref.current.clearFields();
  };

  return (
    <div className={classes.btnAdd}>
      <FPDialog
        buttonType={'btnSecondary'}
        title={t('Create Price List')}
        isClosed={isClosedDialog}
        isFullWidth={false}
        titleDialog={t('Create New Branch BOM Price List')}
        classCustomDialog={classes.titlePage}
      >
        <div className={classes.addForm}>
          <Fieldset title={'General Information'}>
            <form
              className={customClass}
              onSubmit={handleSubmit(() => {
                saveBOMPrice();
              })}
              noValidate
            >
              <AddForm
                allowDefaultClass={false}
                addFieldArray={addFieldArray}
                onFormFieldsChange={onFormFieldsChange}
                disableButtons={false}
                validation={validation}
                handleSubmit={handleSubmit}
                register={register}
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
                ref={ref}
              />
              <span className={classes.floatRightButton}>
                <Button
                  handleClick={onClearFields}
                  className={ButtonConstant.type.NEUTRAL}
                  isFontAwesome={false}
                  title="Clear"
                  disabled={false}
                  classCustom={classes.btnClear}
                />
                <Button
                  type="submit"
                  className={ButtonConstant.type.PRIMARY}
                  isFontAwesome={false}
                  title="Save"
                  classCustom={classes.btnSave}
                />
              </span>
            </form>
          </Fieldset>
        </div>
      </FPDialog>
    </div>
  );
};

BranchBOMPriceAdd.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  isOpen: PropTypes.bool,
  onSave: PropTypes.func,
  BOMPriceList: PropTypes.array,
};

export default withRouter(withStyles(useStyles)(BranchBOMPriceAdd));
