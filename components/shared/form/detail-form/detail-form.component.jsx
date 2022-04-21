import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { cloneDeep } from 'lodash';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';
import { withStyles } from '@material-ui/core';
import PropTypes, { func } from 'prop-types';
import FormFields from './form-fields.component';
import GenerelForm from './general-form';
import FormLabelFields from './form-label-fields.component';
import useStyles from './detail-form.style';
import Fieldset from '../../fieldset/fieldset.component';
import TableGrid from '../../table-grid/table-grid.component';
import {
  ActionType,
  ActionBottomGridButtonConstant,
  OrderConstant,
  Action,
  ButtonConstant,
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import ItemGrid from '../../table-grid/item-grid.component';
import Button from '../../buttons/button.component';
import AddHistory from '../../add-history/add-history.component';
import AddItems from './add-items/add-items.component';
import SearchPopup from './search-popup/search-popup.component';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import {
  getTaxAmount,
  getAmount,
  getFinalBaseUnitValue,
} from '../../../material/material.common';
import RouteLeavingGuard from '../../route/route-leaving-guard';

import ScanTimeLine from '../../scan-timeline/scan-timeline.component';
import store from '../../../../redux/store';
import ExportDataComponent from '../../export-data/export-data.component';

function useOnMount(handler) {
  return React.useEffect(handler, []);
}

var tempFieldArray = [];
var dataDetailsOnGrid = {};
var addItemsSelections = [];
var itemsSelectionsInitial = [];

function DetailForm(props) {
  const {
    classes,
    t,
    columnsDetail,
    validation,
    options,
    actions,
    fieldsLabelArray,
    totalSummarizeInGrid,
    addItemsFieldList,
    getAddItemsParams,
    // Handler loading data for add items popup
    loadAddItemsData,
    // handler load data for detail grid when clicking 'Load Items' btn if any
    getLoadedItemForDetailGrid,
    convertItemDataStructure,
    informationConvert,
    updateDataDetailsOnGrid,
    onCustomSaveDraft,
    onCustomSave,
    isNoHistory,
    rowSizePopUp,
    classPopUp,
    updateAddItemsSelections,
    customClassNameForDetailGrid,
    configItemDataOnGrid,
    classFormFieldCustom,
    isDetailsPage,
    bottomGridButtonsArray,
    updateStateAllFieldArray,
    updateFormFieldsArray,
    updateDataDetailsOnGridForEachPage,
    // Use for Add History section
    updateHistoryData,
    historyData,
    // Handler for Close, Print, Reject, Approve buttons at bottom grid
    onCustomClose,
    onCustomPrint,
    onCustomReject,
    onCustomApprove,
    onCustomEdit,
    onCustomConfirmPickUp,
    // Handler hidden Submit button
    isHiddenBtnSubmit,
    isConfigDisabledBtnSubmit,
    // Config for Scanning time-line on Details page
    isShowScanTimeLine,
    scanningTimeLineData,
    history,
    openSearchPopup,
    searchPopupChildComponentConfig,
    notAllowConfirmLeavePage,
    handleRowSelect,
    actionsBtnInGeneralForm,
    forceShowFormFields,
    // Config show pagination
    showPagination,
    // Config action change page on Paging
    onChangePage,
    onChangeRowsPerPage,
    // Config action change rows per page on Paging
    // true means the page has multiple add items popup with multiple entity
    isMultipleAddItemsEntity,
    // Config hide details information
    isHideDetailsInformation,
    // Config title Select Popup
    titleSelectPopup,
    isGoBack,
    // Func to hide/show inline row edit in grid
    isLineGridEditableHidden,
    // True to Allow edit in line in grid
    isGridEditable,
    // Handle row change in grid
    handleRowChange,
    customToolbarContent,
    // Custom handler after clicking the cart icon to add items
    afterAddItemsToListHandler,
    customConfirmRefreshAllDetailsListMessage,
    // Div contains label and compare number
    comparedInfoDiv,
    // Custom rowsPerPageOptions
    rowsPerPageOptionsCustom,
    // SHow total summarize data in associate column
    showTotalByColumn,
    numItemsInCart,
    isResetItems,
    isFormGeneral,
    updateIsResetItems,
    isConvertDataToGrid= false,
    convertDataToGrid,
    // force show route leaving guard when in detail page(not create/edit page)
    forceShowRouteLeavingGuard
  } = props;
  const {
    handleSubmit,
    errors,
    register,
    setValue,
    setError,
    clearErrors,
  } = useForm({
    reValidateMode: 'onSubmit',
  });

  const [isDisableSubmitButton, setIsDisableSubmitButton] = useState(false);
  const [isOpenAddItemsPopup, setIsOpenAddItemsPopup] = useState(false);
  const [isConfirmLeavePage, setIsConfirmLeavePage] = useState(
    !notAllowConfirmLeavePage
  );
  const { addToast } = useToasts();
  const [actionOfBottomGridButton, setActionOfBottomGridButton] = useState(
    null
  );

  useEffect(() => {
    clearErrors();
    if (validation) {
      validation.forEach((valid) => register(valid.name, valid.rule));
    }
  }, [validation, register, clearErrors]);

  useOnMount(() => {
    if (validation) {
      validation.forEach((valid) => register(valid.name, valid.rule));
    }
  });

  const onFormFieldsChange = (newFieldArray) => {
    tempFieldArray = newFieldArray;
    updateFormFieldsArray && updateFormFieldsArray(newFieldArray);
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
    customOnChange = null,
    isAttachedImagesField = false
  ) => {
    const currentState = store.getState();
    const detailFormStore = currentState && currentState.detailFormStore;
    const dataDetail = detailFormStore && cloneDeep(detailFormStore.dataDetailsOnGrid);
    if (isAttachedImagesField && newValue && newValue.length) {
      newValue.forEach((file) => {
        file.itemId = rowData.sku;
      });
    }
    const updatedIndex =
      dataDetail.data &&
      dataDetail.data.findIndex((el) => el.no === rowData.no);

    if (updatedIndex !== undefined && updatedIndex !== -1) {
      const tempData = rowData;
      // Update row data
      tempData[fieldName] = newValue;

      dataDetail.data[updatedIndex] = tempData;
      switch (fieldName) {
        case OrderConstant.quantity:
          tempData[OrderConstant.amount] = getAmount(rowData);
          tempData[OrderConstant.totalAmount] = getAmount(rowData);
          tempData[OrderConstant.taxAmount] = getTaxAmount(rowData);
          tempData[OrderConstant.finalBaseUnitValue] = getFinalBaseUnitValue(
            rowData
          );
          break;
        case OrderConstant.isFree:
          // Reset taxAmount, amount to 0 when isFree is checked
          tempData[OrderConstant.taxAmount] = getTaxAmount(rowData);
          tempData[OrderConstant.amount] = getAmount(rowData);
          tempData[OrderConstant.totalAmount] = getAmount(rowData);
          if (newValue) {
            tempData[OrderConstant.taxAmount] = 0;
            tempData[OrderConstant.amount] = 0;
            tempData[OrderConstant.totalAmount] = 0;
          }
          break;
        default:
          break;
      }
      updateDataDetailsOnGrid({ ...dataDetail });
    }

    if (customOnChange) {
      customOnChange(fieldName);
    }
  };

  const columns =
    typeof columnsDetail === 'function'
      ? columnsDetail(
        onFieldChange,
        configItemDataOnGrid,
        isDetailsPage,
        props.customRowImageClass,
        fieldsLabelArray,
        dataDetailsOnGrid
      )
      : columnsDetail;

  // Remove all selected row from data base on No value
  const removeHandler = (selectedRows, isEditing) => {
    // Show alert message when clicking remove item without selected row
    if (!selectedRows || selectedRows.length === 0) {
      openDialog({
        title: Message.warning,
        content: Message.CHOOSE_AT_LEAST_ONE,
        actions: [
          {
            name: Action.ok,
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });
    }

    if (!isEditing && selectedRows.length > 0) {
      // remove all deleted rows
      let data = dataDetailsOnGrid.data.filter(
        (el) => selectedRows.findIndex((sel) => sel.no === el.no) === -1
      );
      // Re Update no after deleting rows
      let resetNo = 1;
      data = data.map((el) => {
        const temp = { ...el, no: resetNo };
        resetNo += 1;
        return temp;
      });
      // Set state to update data on grid
      updateDataDetailsOnGrid({
        ...dataDetailsOnGrid,
        data,
        totalItems: data.length,
      });
      addItemsSelections = addItemsSelections.filter(
        (selection) =>
          data.findIndex(
            (el) => el.sku === selection.sku && el.entity === selection.entity
          ) !== -1
      );
      updateAddItemsSelections(addItemsSelections);
    }
  };

  const renderImage = (rowData, infoList, customClass) => {
    const infoListClone =
      typeof infoList === 'function' ? infoList(rowData) : infoList;
    return (
      // Mark mrp row to change the css of image
      <ItemGrid
        image={rowData.common.imgUrl}
        customClass={`${customClass || ''} ${rowData.mrp ? 'mrp' : ''}`}
      >
        {infoListClone.map((el) => (
          <div
            key={el.fieldName}
            className={`${classes.info} ${
              el.isMultipleField ? 'multi-fields-inline' : ''
            }`}
          >
            {
              // Display multiple fields in one line
              el.isMultipleField &&
                el.data.map((children) => (
                  <p key={children.fieldName}>
                    {children.label}: {rowData[children.fieldName]}
                  </p>
                ))
            }
            {
              // Display field which are have custom Display content
              el.noLabel && el.customDisplay
                ? `${el.customDisplay(rowData)}`
                : ''
            }
            {!el.isMultipleField && !el.customDisplay
              ? el.noLabel
                ? `${rowData[el.fieldName] || ''}`
                : `${el.label}: ${rowData[el.fieldName] || ''}`
              : ''}
          </div>
        ))}
      </ItemGrid>
    );
  };

  const openAddItems = () => {
    setIsOpenAddItemsPopup(true);
  };

  const handleClosePopup = () => {
    const list = (dataDetailsOnGrid && dataDetailsOnGrid.data) || [];
    openDialog({
      title: Message.CONFIRM,
      content: Message.CONFIRM_CLOSE_ADD_ITEM,
      actions: [
        {
          name: Action.cancel,
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: Action.ok,
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            updateAddItemsSelections([...list]);
            updateAddItemsSelectionsForDetailForm([...list]);
            setIsOpenAddItemsPopup(false);
          },
        },
      ],
    });
  };

  const closeSearchPopup = () => {
    props.updateOpenStateSearchPopup(false);
  };

  const onHandleCustomClose = () => {
    onCustomClose(fieldsLabelArray, dataDetailsOnGrid);
  };

  const onHandleCustomReject = (handleFor) => {
    onCustomReject(fieldsLabelArray, dataDetailsOnGrid, handleFor);
  };

  const onHandleCustomApprove = () => {
    onCustomApprove(fieldsLabelArray, dataDetailsOnGrid);
  };

  const onHandleCustomPrint = () => {
    onCustomPrint(fieldsLabelArray, dataDetailsOnGrid);
  };
  const onHandleCustomEdit = () => {
    // Direct to Edit Page
    const pathUrl = onCustomEdit();
    props.history.push(pathUrl);
  };

  const onHandleCustomConfirmPickUp = () => {
    onCustomConfirmPickUp(fieldsLabelArray, dataDetailsOnGrid);
  };

  const handleForBottomGridButton = (handleFor) => {
    switch (handleFor) {
      case ActionBottomGridButtonConstant.CLOSE:
        onHandleCustomClose();
        break;
      case ActionBottomGridButtonConstant.PRINT:
        onHandleCustomPrint();
        break;
      case ActionBottomGridButtonConstant.REJECT:
      case ActionBottomGridButtonConstant.CANCEL:
        onHandleCustomReject(handleFor);
        break;
      case ActionBottomGridButtonConstant.APPROVE:
        onHandleCustomApprove();
        break;
      case ActionBottomGridButtonConstant.EDIT:
        onHandleCustomEdit();
        break;
      case ActionBottomGridButtonConstant.CONFIRM_PICK_UP:
        onHandleCustomConfirmPickUp();
        break;
      default:
        break;
    }
  };

  const reloadDetailsList = () => {
    let count = 0;
    getLoadedItemForDetailGrid().then((data) => {
      const listData = data.map((el) => {
        count += 1;
        return { ...el, no: count };
      });
      // Update data on grid and recalculate summarize div
      updateDataDetailsOnGrid({
        ...dataDetailsOnGrid,
        data: listData,
      });
    });
  };

  const confirmRefreshAllDetailsList = () => {
    const customMessage = customConfirmRefreshAllDetailsListMessage;
    openDialog({
      title: Message.CONFIRM,
      content: customMessage || Message.PURCHASE_ORDER.REFRESH_ALL_DETAILS_LIST,
      disableBackdropClick: true,
      actions: [
        {
          name: t(Action.cancel),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: t(Action.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            reloadDetailsList();
          },
        },
      ],
    });
  };

  // When clicking 'Load Items' btn, send request to server
  // then set the result to the detail grid
  const loadItemHandler = () => {
    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length
    ) {
      confirmRefreshAllDetailsList();
    } else {
      reloadDetailsList();
    }
  };

  const getHistoryDataForSaving = () => {
    let historyDataForSaving = [];
    const isEmptyHistoryDataList = !historyData || historyData.length === 0;
    !isEmptyHistoryDataList &&
      historyData.forEach((el) => {
        if (el.newHistory) {
          historyDataForSaving.push({ comment: el.note });
        }
      });
    return historyDataForSaving;
  };

  const onHandleClickSubmit = () => {
    if (
      actionOfBottomGridButton === ActionBottomGridButtonConstant.SAVE_DRAFT
    ) {
      onSaveDraft();
    } else {
      // Handle for submit
      onSubmitFn();
    }
  };

  const onSaveDraft = () => {
    onCustomSaveDraft(
      tempFieldArray,
      dataDetailsOnGrid,
      getHistoryDataForSaving()
    )
      .then(() => {
        setIsConfirmLeavePage(false);
        history.goBack();
      })
      .catch(() => {
        // implement later
      });
  };

  const onSubmitFn = () => {
    onCustomSave(tempFieldArray, dataDetailsOnGrid, getHistoryDataForSaving())
      .then(() => {
        setIsConfirmLeavePage(false);
        if (isGoBack !== false) {
          history.goBack();
        }
      })
      .catch(() => {
        // implement later
      });
  };

  const renderBottomGridButtons = () => {
    let buttons = {};
    const { titleSubmit, isHiddenBtnDraft, titleSaveDraft } = props;

    // render button with config bottomGridButtons.
    // If has no config for bottomGridButtons, just display save and submit buttons
    if (isDetailsPage) {
      buttons =
        bottomGridButtonsArray &&
        bottomGridButtonsArray.map((item, index) => item.useExportCmp ?
          (<ExportDataComponent
            className={item.className}
            classCustom={item.classCustom}
            data={item.exportData}
            typeExport={item.typeExport}
            {...item.exportConfigs}
            disabled={!!item.disabled}
            hidden={!!item.hidden}
            unusedFields={item.unusedFields || []}
            isAOA={item.isAOA}
            fileName={item.fileName}
          />) : (
            <Button
              key={index}
              title={item.title}
              className={item.className}
              classCustom={item.classCustom}
              handleClick={
                item.customHandleClick
                  ? item.handleClick
                  : () => handleForBottomGridButton(item.handleFor)
              }
              hidden={item.hidden}
            />
          )
        );
    } else {
      buttons = (
        <>
          {!isHiddenBtnDraft && (
            <Button
              title={titleSaveDraft || 'Save Draft'}
              className="btnSecondary"
              type="submit"
              handleClick={() => {
                // if submit button is hidden, this button will handle for submit action
                if (isHiddenBtnSubmit) {
                  setActionOfBottomGridButton(
                    ActionBottomGridButtonConstant.SUBMIT
                  );
                } else {
                  setActionOfBottomGridButton(
                    ActionBottomGridButtonConstant.SAVE_DRAFT
                  );
                }
              }}
            />
          )}
          {!isHiddenBtnSubmit && (
            <Button
              title={titleSubmit || 'Submit'}
              className={isDisableSubmitButton ? 'btnDisable' : 'btnPrimary'}
              type="submit"
              disabled={isDisableSubmitButton || isConfigDisabledBtnSubmit}
              handleClick={() =>
                setActionOfBottomGridButton(
                  ActionBottomGridButtonConstant.SUBMIT
                )
              }
            />
          )}
        </>
      );
    }

    return buttons;
  };

  // Add render handler for columns which belongs to image info type
  columns.forEach((el, index) => {
    if (el.customType === 'imageInfo') {
      columns[index].render = (rowData) =>
        renderImage(rowData, el.infoList, props.customRowImageClass);
    }
  });

  // Sort history data on Add History section ascending by date time
  const sortHistoryByDateTime = (historyArray) =>
    historyArray.sort((a, b) => b.time - a.time);

  const onAddHistory = (addedHistoryData) => {
    if (historyData) {
      historyData.push(addedHistoryData);
      const newHistoryData = sortHistoryByDateTime(historyData);
      updateHistoryData(newHistoryData);
    } else {
      updateHistoryData([addedHistoryData]);
    }
  };

  useEffect(
    () => () => {
      updateStateAllFieldArray([]);
      updateDataDetailsOnGrid(null, false);
      // Update data on Add History section
      updateHistoryData(null);
      updateAddItemsSelections([]);
      tempFieldArray = [];
      dataDetailsOnGrid = {};
      addItemsSelections = [];
    },
    [
      updateStateAllFieldArray,
      updateDataDetailsOnGrid,
      updateHistoryData,
      updateAddItemsSelections,
    ]
  );


  const renderInformation = (fieldsLabel, forceShow) => {
    if (isDetailsPage || forceShow) {
      return (
        <FormLabelFields
          fieldsLabelArray={fieldsLabel}
          classFormFieldCustom={classFormFieldCustom}
        />
      );
    }
    if(isFormGeneral) {
      return (
        <GenerelForm
          classCustom="user-search-bar"
          errors={errors}
          setValue={setValue}
          setError={setError}
          clearErrors={clearErrors}
          onFormFieldsChange={onFormFieldsChange}
        />
      );
    }

    return (
      <FormFields
        classCustom="user-search-bar"
        errors={errors}
        setValue={setValue}
        setError={setError}
        clearErrors={clearErrors}
        onFormFieldsChange={onFormFieldsChange}
      />
    );
  };

  const updateDataDetailsOnGridForDetailForm = (dataDetail) => {
    dataDetailsOnGrid = dataDetail;
    updateDataDetailsOnGridForEachPage &&
      updateDataDetailsOnGridForEachPage(dataDetail);

    // Update add items selection
    if (!addItemsFieldList) {
      return;
    }

    if (
      dataDetailsOnGrid &&
      dataDetailsOnGrid.data &&
      dataDetailsOnGrid.data.length > 0
    ) {
      addItemsSelections = [];
      dataDetailsOnGrid.data.forEach((el) => {
        addItemsSelections.push({ ...el });
      });
      itemsSelectionsInitial = JSON.parse(JSON.stringify(addItemsSelections));
      // Don't update when add item popup is open
      !isOpenAddItemsPopup && updateAddItemsSelections(isResetItems ? [] : addItemsSelections);
      // Update isResetItems after reset
      isResetItems && updateIsResetItems && updateIsResetItems();
    } else {
      addItemsSelections = [];
      itemsSelectionsInitial = [];
      // Don't update when add item popup is open
      !isOpenAddItemsPopup && updateAddItemsSelections(addItemsSelections);
    }
  };

  const updateAddItemsSelectionsForDetailForm = (selections) => {
    addItemsSelections = selections;
  };

  /**
   * Update items list when click shopping cart on add item popup
   */
  const handleAddItemsToGrid = () => {
    const selections = [];
    let no = 0;
    addItemsSelections.forEach((selection) => {
      no += 1;
      // Added new line in detail grid if select new item
      const quantity = selection.quantity || 0;
      let newRowData = { ...selection };

      if (dataDetailsOnGrid && dataDetailsOnGrid.data) {
        const existIndex = dataDetailsOnGrid.data.findIndex(
          (el) => el.sku === selection.sku && el.entity === selection.entity
        );
        if (existIndex !== -1) {
          newRowData = {
            ...newRowData,
            ...dataDetailsOnGrid.data[existIndex],
          };
        }
      }
      newRowData.taxAmount = getTaxAmount(newRowData);
      newRowData.amount = getAmount(newRowData);
      newRowData.finalBaseUnitValue = getFinalBaseUnitValue(newRowData);
      newRowData.quantity = quantity;
      newRowData.no = no;
      selections.push(newRowData);
    });

    const dataList = (dataDetailsOnGrid && dataDetailsOnGrid.data) || [];
    const tempDataDetailsOnGrid = {
      ...dataDetailsOnGrid,
      data:
        (!isConvertDataToGrid ?(convertItemDataStructure &&
          convertItemDataStructure(selections, informationConvert))
          :convertDataToGrid(selections, informationConvert)) ||
        dataList,
    };
    updateDataDetailsOnGrid({
      ...tempDataDetailsOnGrid,
      totalItems: tempDataDetailsOnGrid.data.length,
    });
    updateAddItemsSelections(addItemsSelections);
    // Check item of selections to show message
    if (selections) {
      let isChanged = false;
      let msg = '';
      let itemSelectionList = selections.map(
        (item) => item.sku
      );

      for (let i = 0; i < itemsSelectionsInitial.length; i++) {
        if (!itemSelectionList.includes(itemsSelectionsInitial[i].sku)) {
          isChanged = true;
          break;
        }
      }
      if (isChanged) {
        msg = Message.CHANGED_SUCCESSFULLY;
      } else {
        msg = selections.length === itemsSelectionsInitial.length ? Message.NOTHING_CHANGED : msg = Message.ADDED_SUCCESSFULLY;
      }

      addToast(msg, {
        appearance: 'success',
        autoDismissTimeout: 2000,
        autoDismiss: true,
      });
    }
    // Close add items popup
    setIsOpenAddItemsPopup(false);
    afterAddItemsToListHandler &&
      afterAddItemsToListHandler(tempDataDetailsOnGrid);
  };

  /**
   * Display icon checked if select the item/ unchecked if the item has selected before.
   * Update number of selected items in shopping cart
   * @param {Object} rowData
   */
  const onClickItemHandler = (rowData) => {
    let existIndex = -1;
    let selections = [];
    if (addItemsSelections) {
      existIndex = addItemsSelections.findIndex(
        (el) => el.sku === rowData.sku && el.entity === rowData.entity
      );
    }

    // Remove check-icon if unselect the selected item
    if (existIndex !== -1) {
      selections = addItemsSelections.filter(
        (el) => el.sku !== rowData.sku || el.entity !== rowData.entity
      );
    } else {
      addItemsSelections.push({ ...rowData });
      selections = addItemsSelections;
    }
    updateAddItemsSelections([...selections]);
    return [...selections];
  };

  const hasScanningTimeLineData = scanningTimeLineData && scanningTimeLineData.length !== 0;

  return (
    <>
      <form
        onSubmit={handleSubmit(() => {
          onHandleClickSubmit();
        })}
        noValidate
        className={`${classes.form} ${classes.root}`}
      >
        {isDetailsPage && forceShowFormFields && (
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
        )}
        <Fieldset
          title={t('General Information')}
          customClasses={`${isDetailsPage ? 'detail-general-info' : ''}`}
        >
          {renderInformation(fieldsLabelArray)}
          <div className="general-action">
            {actionsBtnInGeneralForm &&
              actionsBtnInGeneralForm.map((el, i) => (
                <Button
                  key={i}
                  type={`${el.type || undefined}`}
                  className={`${
                    el.customClassName || ButtonConstant.type.PRIMARY
                  }`}
                  isFontAwesome={false}
                  title={el.title}
                  hidden={el.hidden}
                  classCustom={classes.btnSearch}
                  handleClick={
                    el.customHandler
                      ? (event) => {
                        event.preventDefault();
                        el.customHandler();
                      }
                      : null
                  }
                />
              ))}
          </div>
        </Fieldset>
        {!isHideDetailsInformation && (
          <Fieldset
            title={t('Details Information')}
            customClasses={customClassNameForDetailGrid}
          >
            <TableGrid
              columns={columns}
              options={options}
              removeHandler={removeHandler}
              addHandler={openAddItems}
              loadItemHandler={loadItemHandler}
              actions={(typeof actions === 'function' && actions()) || actions}
              setFormErrorFn={setError}
              // If have not config showPagination, default true
              hidePagination={!showPagination}
              onChangeRowsPerPage={onChangeRowsPerPage}
              onChangePage={onChangePage}
              classCustom="tableNoneBorder"
              totalSummarizeInGrid={totalSummarizeInGrid}
              handleRowSelect={handleRowSelect}
              handleRowChange={handleRowChange}
              updateDataDetailsOnGrid={updateDataDetailsOnGridForDetailForm}
              isEditableHidden={isLineGridEditableHidden}
              isEditable={isGridEditable}
              getIsDisableSubmitButton={setIsDisableSubmitButton}
              customToolbarContent={customToolbarContent}
              rowsPerPageOptionsCustom={rowsPerPageOptionsCustom}
              showTotalByColumn={showTotalByColumn}
            />
          </Fieldset>
        )}
        {isDetailsPage &&
          !isHideDetailsInformation &&
          isShowScanTimeLine &&
          hasScanningTimeLineData && (
          <ScanTimeLine scanningTimeData={scanningTimeLineData} />
        )}
        {comparedInfoDiv && <Fieldset
          title={comparedInfoDiv.title}
          customClasses={'detail-general-info form-compare'}
        >
          {renderInformation(comparedInfoDiv.data, true)}
        </Fieldset>}
        <div className={classes.btn}>{renderBottomGridButtons()}</div>
        <div>
          {!isNoHistory && (
            <AddHistory
              onAdd={(addedHistoryData) => onAddHistory(addedHistoryData)}
              historyListData={historyData}
              isViewMode={isDetailsPage}
            />
          )}
        </div>
      </form>
      <div>
        {isOpenAddItemsPopup && (
          <AddItems
            open={isOpenAddItemsPopup}
            fieldArray={(isOpenAddItemsPopup && addItemsFieldList) || []}
            handleClose={handleClosePopup}
            getAddItemsParams={getAddItemsParams}
            loadAddItemsData={loadAddItemsData}
            handleAddItemsToGrid={handleAddItemsToGrid}
            convertItemDataStructure={convertItemDataStructure}
            onClickItemHandler={onClickItemHandler}
            informationConvert={informationConvert}
            rowSize={rowSizePopUp}
            classPopUp={classPopUp}
            addItemsSelections={addItemsSelections}
            updateAddItemsSelectionsForDetailForm={
              updateAddItemsSelectionsForDetailForm
            }
            isHideBtnCollapse={true}
            isMultipleAddItemsEntity={isMultipleAddItemsEntity}
            titleSelectPopup={titleSelectPopup}
            getNumItemsInCart={numItemsInCart}
          />
        )}
      </div>
      <div>
        {!isDetailsPage && openSearchPopup && (
          <SearchPopup
            childComponent={searchPopupChildComponentConfig.component}
            open={openSearchPopup}
            handleClose={closeSearchPopup}
            classPopUp={classPopUp}
            title={searchPopupChildComponentConfig.title}
          />
        )}
      </div>
      {((!isDetailsPage && !notAllowConfirmLeavePage) || forceShowRouteLeavingGuard) && (
        <RouteLeavingGuard
          when={isConfirmLeavePage}
          navigate={(path) => props.history.push(path)}
          shouldBlockNavigation={(location) => {
            if (location.pathname !== window.location) {
              return true;
            }
            return false;
          }}
        />
      )}{' '}
    </>
  );
}

DetailForm.propTypes = {
  updateIsResetItems: PropTypes.func,
  numItemsInCart: PropTypes.func,
  onSubmit: PropTypes.func,
  classes: PropTypes.object,
  t: PropTypes.any,
  columnsDetail: PropTypes.any,
  validation: PropTypes.any,
  options: PropTypes.any,
  actions: PropTypes.any,
  updateStateFieldArray: PropTypes.any,
  rowSize: PropTypes.number,
  rowSizePopUp: PropTypes.number,
  classPopUp: PropTypes.any,
  customAddHandler: PropTypes.any,
  totalSummarizeInGrid: PropTypes.any,
  addItemsFieldList: PropTypes.any,
  getAddItemsParams: PropTypes.func,
  loadAddItemsData: PropTypes.func,
  convertItemDataStructure: PropTypes.func,
  informationConvert: PropTypes.any,
  updateDataDetailsOnGrid: PropTypes.func,
  updateStateAllFieldArray: PropTypes.func,
  onCustomSaveDraft: PropTypes.any,
  onCustomSave: PropTypes.any,
  isNoHistory: PropTypes.bool,
  addItemsSelections: PropTypes.any,
  updateAddItemsSelections: PropTypes.func,
  getLoadedItemForDetailGrid: PropTypes.any,
  customClassNameForDetailGrid: PropTypes.any,
  configItemDataOnGrid: PropTypes.any,
  classFormFieldCustom: PropTypes.string,
  bottomGridButtonsArray: PropTypes.array,
  history: PropTypes.object,
  updateHistoryData: PropTypes.func,
  historyData: PropTypes.any,
  isHiddenBtnSubmit: PropTypes.bool,
  isShowScanTimeLine: PropTypes.bool,
  scanningTimeLineData: PropTypes.array,
  isConfirmLeavePage: PropTypes.bool,
  notAllowConfirmLeavePage: PropTypes.any,
  customRowImageClass: PropTypes.any,
  actionsBtnInGeneralForm: PropTypes.any,
  // Function for update field array variable, not state data
  updateFormFieldsArray: PropTypes.func,
  // For detail page
  isDetailsPage: PropTypes.bool,
  onCustomClose: PropTypes.func,
  onCustomPrint: PropTypes.func,
  onCustomApprove: PropTypes.func,
  onCustomReject: PropTypes.func,
  onCustomConfirmPickUp: PropTypes.func,
  fieldsLabelArray: PropTypes.any,
  openSearchPopup: PropTypes.bool,
  updateOpenStateSearchPopup: PropTypes.func,
  searchPopupChildComponentConfig: PropTypes.any,
  handleRowSelect: PropTypes.func,
  // Function for update dataDetailsOnGrid variable, not state data
  updateDataDetailsOnGridForEachPage: PropTypes.func,
  // Function for update addItemsSelection variable, not state data
  // Since if using state data in this case, it'll cause performance issue
  updateAddItemsSelectionsForDetailForm: PropTypes.func,
  forceShowFormFields: PropTypes.bool,
  onChangePage: PropTypes.func,
  showPagination: PropTypes.bool,
  onChangeRowsPerPage: PropTypes.func,
  isMultipleAddItemsEntity: PropTypes.bool,
  onCustomEdit: PropTypes.any,
  isHideDetailsInformation: PropTypes.bool,
  titleSelectPopup: PropTypes.any,
  isGoBack: PropTypes.bool,
  titleSubmit: PropTypes.string,
  titleSaveDraft: PropTypes.string,
  isHiddenBtnDraft: PropTypes.bool,
  isLineGridEditableHidden: PropTypes.func,
  isGridEditable: PropTypes.bool,
  handleRowChange: PropTypes.func,
  afterAddItemsToListHandler: PropTypes.func,
  customConfirmRefreshAllDetailsListMessage: PropTypes.string,
  customToolbarContent: PropTypes.any,
  rowsPerPageOptionsCustom: PropTypes.array,
  isConfigDisabledBtnSubmit: PropTypes.bool,
  showTotalByColumn: PropTypes.bool,
  comparedInfoDiv: PropTypes.object,
  isResetItems: PropTypes.any,
  isFormGeneral: PropTypes.any,
  isConvertDataToGrid: PropTypes.any,
  convertDataToGrid: PropTypes.any,
  forceShowRouteLeavingGuard: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    // Data on Add History section
    historyData: state.detailFormStore.history,
    openSearchPopup: state.searchPopupStore.openSearchPopup,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateStateFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_DETAIL_FIELD_ARRAY, ...data }),
  updateStateAllFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_ALL_FIELD_ARRAY, data }),
  updateDataDetailsOnGrid: (data) =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),

  // Update data on Add History section
  updateHistoryData: (data) =>
    dispatch({ type: ActionType.UPDATE_HISTORY_DATA, history: data }),
  updateAddItemsSelections: (data) =>
    dispatch({
      type: ActionType.UPDATE_ADD_ITEMS_SELECTIONS,
      addItemsSelections: data,
    }),
  updateOpenStateSearchPopup: (data) =>
    dispatch({
      type: ActionType.UPDATE_OPEN_STATE_SEARCH_POPUP,
      openSearchPopup: data,
    }),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withStyles(useStyles)(DetailForm)));
