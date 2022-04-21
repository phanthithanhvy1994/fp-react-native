import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { cloneDeep } from 'lodash';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import TableGrid from '../../shared/table-grid/table-grid.component';
import PageHeader from '../../shared/page-header/page-header.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import AddIcon from '@material-ui/icons/Add';

import { AddValuePackConstant, Action } from '../../../constants/constants';

import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import searchTitleStyle from '../../../style/core/search/search-title';
import Button from '../../shared/buttons/button.component';
import AddForm from '../../shared/add-form/add-form.component';
import {
  getVoucherValueType,
  addNewValuePack,
} from '../../../actions/value-pack-add.action';
import Fields from '../../shared/fields/fields.component';
import { onChangeInput } from '../../../util/form-util';

import {
  fields,
  validation,
  options,
  columnsDefault,
  fieldOnTopGrid,
  actions,
  totalSummarizeInGrid,
} from './value-pack-add.config';

import useStyles from './value-pack-add.style';

// TODO: waiting API call get level and category
const ValuePackAdd = (props) => {
  const { classes, history } = props;
  const [addValuePackFields] = useState(fields);
  const [addValuePackFieldsClone, setAddValuePackFieldsClone] = useState();
  const [addValuePackDataOnGrid, setAddValuePackDataOnGrid] = useState({});
  const [fieldOnTopGridArray, setFieldOnTopGridArray] = useState(
    fieldOnTopGrid
  );
  const [totalSummarizeData] = useState(totalSummarizeInGrid);

  const [valueToTalOnGrid, setValueTotalOnGrid] = useState(0);
  const [pageHeaderConfigs] = useState({
    pageTitle: 'Create New Value Pack',
    showButton: false,
  });
  const { handleSubmit, errors, register, setValue, clearErrors } = useForm({
    reValidateMode: 'onSubmit',
  });

  const onFormFieldsChange = (data) => {
    setAddValuePackFieldsClone(data);
  };

  const mapGeneralInformationForSaving = (generalInformation) => {
    const result = {
      packName: generalInformation.valuePackName,
      totalValue: Number(generalInformation.totalValue),
      valuePackQty: Number(generalInformation.valuePackQty),
      note: generalInformation.note,
    };

    return result;
  };

  const mapDetailInformationForSaving = (detailInformation) => {
    const result = detailInformation.map((item) => ({
      voucherValueType: item.voucherValueType.split('-')[0].trim(),
      value: item.value,
      quantity: item.quantity,
    }));

    return result;
  };

  const checkIsOverTotalValue = () => {
    let isOverValue = false;
    if (addValuePackFieldsClone) {
      const totalValueField = addValuePackFieldsClone.totalValue;
      if (
        totalValueField &&
        !(Number(valueToTalOnGrid) === Number(totalValueField))
      ) {
        openDialog({
          title: Message.ERROR,
          type: dialogConstant.type.ERROR,
          content:
            Message.ADD_VALUE_PACK.NOT_EQUAL_TO_TOTAL_VALUE_OF_VALUE_PACK,
          actions: [
            {
              name: Action.ok,
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {},
            },
          ],
        });

        isOverValue = true;
      }
    }

    return isOverValue;
  };

  const checkIsEmptyDataOnGrid = () => {
    let isEmptyDataOnGrid = false;
    if (
      isEmpty(addValuePackDataOnGrid) ||
      (addValuePackDataOnGrid && isEmpty(addValuePackDataOnGrid.data))
    ) {
      openDialog({
        title: Message.ERROR,
        type: dialogConstant.type.ERROR,
        content: Message.ADD_VALUE_PACK.NO_VOUCHER_IS_ADDED_INTO_THIS_PACK,
        actions: [
          {
            name: Action.ok,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {},
          },
        ],
      });

      isEmptyDataOnGrid = true;
    }

    return isEmptyDataOnGrid;
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

  const onSaveValuePack = () => {
    let saveParams = {};

    const isOverTotalValue = checkIsOverTotalValue();
    const isEmptyDataOnGrid = checkIsEmptyDataOnGrid();
    if (!isOverTotalValue && !isEmptyDataOnGrid) {
      const generalInformation = mapGeneralInformationForSaving(
        addValuePackFieldsClone
      );
      saveParams = { ...generalInformation };

      const detailInformation = mapDetailInformationForSaving(
        addValuePackDataOnGrid.data
      );
      saveParams.packVoucherDetails = [...detailInformation];

      addNewValuePack(saveParams)
        .then(() => {
          openDialog({
            title: Message.INFORMATION,
            type: dialogConstant.type.INFORMATION,
            content: Message.ADD_VALUE_PACK.CREATE_VALUE_PACK_SUCCESSFULLY,
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
        })
        .catch((res) => {
          showSystemErrorDialog(res);
        });
    }
  };

  const onChangeVoucherValueType = (e) => {
    const newFieldArray = onChangeInput(fieldOnTopGridArray, e);
    // Set new value to validate
    setValue(e.target.name, e.target.value);

    // Set new display value
    setFieldOnTopGridArray(newFieldArray);

    // Field can have its own on change handler
    if (e.target.customOnChange) {
      e.target.customOnChange(e, newFieldArray);
    }
  };

  const getValueOfVoucherType = (voucherType) => {
    if (
      fieldOnTopGridArray &&
      fieldOnTopGridArray[0] &&
      fieldOnTopGridArray[0].data
    ) {
      const matchedVoucherType = fieldOnTopGridArray[0].data.find(
        (item) => item.display === voucherType
      );

      return Number(matchedVoucherType.voucherValue);
    }
  };

  const getCalculatedValue = (rowData) => {
    const { voucherValueType } = rowData;
    const valueOfVoucherType = getValueOfVoucherType(voucherValueType);
    return Number((Number(rowData.quantity) * valueOfVoucherType).toFixed(1));
  };

  /**
   * Handler when changing value of any field inside the "Details Information" grid
   * @param {String} fieldName fieldName of target field
   * @param {String|Object|Array} newValue
   * @param {Object} rowData data of row which cause the change
   */
  const onFieldChange = (
    fieldName,
    newValue,
    rowData,
    customOnChange = null
  ) => {
    const dataDetail = cloneDeep(addValuePackDataOnGrid);
    const updatedIndex =
      dataDetail.data &&
      dataDetail.data.findIndex((el) => el.id === rowData.id);

    if (updatedIndex !== undefined && updatedIndex !== -1) {
      const tempData = rowData;
      // Update row data
      tempData[fieldName] = newValue;

      dataDetail.data[updatedIndex] = tempData;
      switch (fieldName) {
        case AddValuePackConstant.quantity:
          tempData[AddValuePackConstant.value] = getCalculatedValue(rowData);
          break;
        default:
          break;
      }
      setAddValuePackDataOnGrid(dataDetail);
    }

    if (customOnChange) {
      customOnChange();
    }
  };

  const updateValueTotalOnGrid = () => {
    const dataOnGrid = addValuePackDataOnGrid;
    let valueTotal = 0;

    if (dataOnGrid && dataOnGrid.data && dataOnGrid.data.length) {
      dataOnGrid.data.forEach((item) => {
        valueTotal = valueTotal + Number(item.value);
      });
    }

    setValueTotalOnGrid(valueTotal);
  };

  /**
   * Add new row data to detail grid.
   * Update id value
   * @param {Object} rowData
   */
  const handleAddItemByVoucherValueType = () => {
    let newDataOnGrid = [];

    const numOfData =
      addValuePackDataOnGrid &&
      addValuePackDataOnGrid.data &&
      addValuePackDataOnGrid.data.length;
    if (numOfData) {
      newDataOnGrid = addValuePackDataOnGrid.data;
    }
    if (fieldOnTopGridArray) {
      const selectedVoucherValueType = fieldOnTopGridArray[0].value;
      if (selectedVoucherValueType && selectedVoucherValueType.length) {
        selectedVoucherValueType.forEach((item) => {
          if (newDataOnGrid) {
            const sameVoucherTypeIndex = newDataOnGrid.findIndex(
              (el) => el.voucherTypeCode === item.value
            );

            // Check if the same voucher type is added, quantity will be increase by 1
            if (newDataOnGrid[sameVoucherTypeIndex]) {
              newDataOnGrid[sameVoucherTypeIndex].quantity =
                Number(newDataOnGrid[sameVoucherTypeIndex].quantity) + 1;
              newDataOnGrid[sameVoucherTypeIndex].value =
                Number(newDataOnGrid[sameVoucherTypeIndex].quantity) *
                Number(item.voucherValue);
            } else {
              newDataOnGrid.push({
                voucherValueType: item.display,
                id: newDataOnGrid.length + 1,
                voucherTypeCode: item.value,
                quantity: 1,
                value: 1 * Number(item.voucherValue),
              });
            }
          }
        });
      } else {
        openDialog({
          title: Message.ERROR,
          type: dialogConstant.type.ERROR,
          content: Message.ADD_VALUE_PACK.PLEASE_SELECT_VOUCHER_VALUE_TYPE,
          actions: [
            {
              name: Action.ok,
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {},
            },
          ],
        });
      }
    }

    // Re Update id after add item
    let resetId = 1;
    newDataOnGrid = newDataOnGrid.map((el) => {
      const temp = { ...el, id: resetId };
      resetId += 1;
      return temp;
    });

    setAddValuePackDataOnGrid({
      data: [...newDataOnGrid],
    });
  };

  const removeVoucherValueItems = (rowData) => {
    let newDataOnGrid = addValuePackDataOnGrid.data.filter(
      (item) => item.id !== rowData.id
    );

    // Re Update id after deleting rows
    let resetId = 1;
    newDataOnGrid = newDataOnGrid.map((el) => {
      const temp = { ...el, id: resetId };
      resetId += 1;
      return temp;
    });

    setAddValuePackDataOnGrid({
      data: [...newDataOnGrid],
    });
  };

  useEffect(() => {
    updateValueTotalOnGrid();
  }, [addValuePackDataOnGrid]);

  useEffect(() => {
    // Get combobox data and reload into state
    getVoucherValueType().then((res) => {
      setFieldOnTopGridArray((prevState) => {
        let formattedData = [];
        const data = [...prevState];
        if (res && res.data && res.data.length) {
          formattedData = res.data.map((item) => ({
            display: `${item.code} - ${item.display}`,
            value: item.code,
            voucherValue: item.value,
          }));
        }
        data.find(
          (obj) => obj.fieldName === AddValuePackConstant.voucherValueType
        )['data'] = formattedData;
        return [...data];
      });
    });
  }, []);

  return (
    <>
      <div>
        <PageHeader {...pageHeaderConfigs} />
        <form
          onSubmit={handleSubmit(() => {
            onSaveValuePack();
          })}
          noValidate
        >
          <div className={classes.valuePackAddSearchCover}>
            <Fieldset title={'General Information'}>
              <AddForm
                addFieldArray={addValuePackFields}
                onFormFieldsChange={onFormFieldsChange}
                classCustom={classes.addValuePackGeneralInformation}
                disableButtons={false}
                handleSubmit={handleSubmit}
                validation={validation}
                register={register}
                errors={errors}
                setValue={setValue}
                clearErrors={clearErrors}
              />
              <div className={classes.topToolbarOnGrid}>
                <div
                  className={`${classes.valuePackAddToolBar} add-value-pack-toolbar`}
                >
                  <span>
                    <Fields
                      conditionalArray={fieldOnTopGridArray}
                      onChange={(e) => onChangeVoucherValueType(e)}
                      errors={errors}
                    />
                  </span>
                  <span
                    className={classes.addItemBtn}
                    onClick={handleAddItemByVoucherValueType}
                  >
                    <Button
                      classCustom={classes.btnSecondaryTextOnly}
                      title="Add Item"
                      icon={<AddIcon />}
                    />
                  </span>
                </div>
              </div>
            </Fieldset>
          </div>

          <Fieldset title={'Detail Information'}>
            <div className={classes.addPackValueDetailGrid}>
              <TableGrid
                dataTable={addValuePackDataOnGrid}
                options={options}
                columns={columnsDefault(onFieldChange)}
                actions={actions(removeVoucherValueItems)}
                hidePagination={true}
                className="even-odd-columns"
                totalSummarizeData={totalSummarizeData}
              />
              <div className={classes.totalArea}>
                <div className="total-value-row">
                  <span className="total-value-label">
                    {totalSummarizeData.label}
                  </span>
                  <span className="total-value">{`${valueToTalOnGrid} ${AddValuePackConstant.valueUnit}`}</span>
                </div>
              </div>
            </div>
          </Fieldset>
          <div className={classes.btn}>
            <Button title="Save" className="btnPrimary" type="submit" />
          </div>
        </form>
      </div>
    </>
  );
};

ValuePackAdd.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default withTranslation()(withStyles(mainStyle)(ValuePackAdd));
