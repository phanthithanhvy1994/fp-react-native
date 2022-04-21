import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as _ from 'lodash';
import { trackPromise } from 'react-promise-tracker';

import './branch-bom-price-form.style.scss';

import PageHeader from '../../../shared/page-header/page-header.component';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';

import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import {
  PaginationConfiguration,
  dateFormat,
  ActionType,
  BranchBOMPrice,
  ConfigEntity,
  BranchBOM
} from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { informationConvert, branchBOMSearchFields, customToolbarContent } from './branch-bom.config';
import {
  BRANCH_GROUP_CODE,
  CHANNEL,
  STATUS,
  LEVEL,
  CATEGORY_CODE,
  COMPANY_CODE,
} from '../branch-bom-price.constant';

import { getDataCompanyCode } from '../../../../actions/branch-bom-action';
import { getAllBranchGroup } from '../../../../actions/branch-group.action';
import { getAllChannel } from '../../../../actions/channel.action';
import { getAllStatus, updateStatusBranchBOMPrice } from '../../../../actions/branch-bom-price.action';
import {
  getBranchBomList,
  getDataBomBranchLevelType,
  getDataCategoryType,
} from '../../../../actions/branch-bom-action';

import useStyles from '../branch-bom-price-list.style';

import { convertItemDataStructure } from './branch-bom-price-edit.common';
import { formatDateString, covertStringToDate, convertToDateServerFormat } from '../../../../util/date-util';
import { formatComboBox, formatDropdownList } from '../../../../util/format-util';
import { calculateExVat } from '../branch-bom-price.util';
import PriceEdit from '../branch-bom-price-edit/price-edit/price-edit.component';

let fieldArray = [];
let dataDetailsOnGrid = {};
let dateHeaderInitial = {};
let branchGroupList = {};
const BranchBOMPriceForm = (props) => {
  const { t } = useTranslation();
  const {
    classes,
    customActions,
    isEditPage,
    headerFields,
    tableOptions,
    columns,
    validation,
    history,
    isDetailsPage,
    updateAllFieldArray,
    updateDataDetailsOnGrid,
    getUpdatedBOMPrice,
    BOMPriceId,
    getBranchBOMPrice,
    updateMultipleDetailFieldArray,
    fieldLabels,
    bottomGridButtonsArray,
    updateAddItemsSelections,
  } = props;

  // Hide inline edit row in grid
  const isEditableHidden = (rowData) => {
    return +rowData?.level === 1;
  };

  const ref = useRef(null);

  const [importPriceList, setImportPriceList] = useState({});
  const [grandParentOpenStatus, setGrandParentOpenStatus] = useState(false);
  const [branchBOM, setBranchBOM] = useState(null);
  const [status, setStatus] = useState(BranchBOMPrice.status.draft);
  const [header, setHeader] = useState('');

  const [dateHeader, setDateHeader] = useState({
    startDate: '',
    endDate: '',
  });
  const [pageHeaderConfigs, setPageHeaderConfigs] = useState({
    pageTitle: `${isDetailsPage ? 'View' : 'Edit'} Branch BOM Price List`,
    showButton: false,
  });
  const [fieldsLabelArray, setFieldsLabelArray] = useState([]);

  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );

  const [branchBOMFieldArray, setBranchBOMFieldArray] = useState(
    branchBOMSearchFields
  );

  const [originBOMPrice, setOriginBOMPrice] = useState(null);

  useEffect(() => {
    isDetailsPage && getAllBranchGroup().then(
      (res) => {
        res?.data && res.data.map(
          (item) => branchGroupList[item['typeCode']] = item['typeName']
        );
      }
    );
  }, [isDetailsPage]);

  // Load detail data
  useEffect(() => {
    getBranchBOMPrice({
      id: BOMPriceId,
    }).then((res) => {
      if (res.status === '200') {
        setStatus(res.data?.status || BranchBOMPrice.status.draft);
        setHeader(res.data.bomPriceName);
        setPageHeaderConfigs((prevState) => {
          return {
            ...prevState,
            pageTitle: t(`${isDetailsPage ? 'View' : 'Edit'} Branch BOM Price List`, {
              bomPriceName: res.data.bomPriceName,
            }),
          };
        });

        dateHeaderInitial = {
          startDate: res.data.startDate,
          endDate: res.data.endDate,
        };

        updateDataDetailsOnGrid({
          maxResult: PaginationConfiguration.itemsPerPage,
          pageSize: PaginationConfiguration.itemsPerPage,
          countFlag: PaginationConfiguration.countFlag,
          currentPage: PaginationConfiguration.currentPage,
          totalItems: res.data && res.data.bomPriceDetailVO.length,
          data: res.data.bomPriceDetailVO && convertItemDataStructure([ ...res.data.bomPriceDetailVO ], false, dateHeaderInitial)
        });

        setDateHeader(dateHeaderInitial);

        setOriginBOMPrice({ ...res.data });
        isDetailsPage && setFieldsLabelArray(fieldLabels(res.data, branchGroupList));

        isEditPage && updateAllFieldArray((() => {
          const newState = headerFields(res.data?.status).map((field) => {
            if (
              field.fieldName === 'startDate' ||
              field.fieldName === 'endDate'
            ) {
              return {
                ...field,
                value: covertStringToDate(
                  res.data[field.fieldName],
                  dateFormat.savingDateTime
                ),
              };
            }

            return {
              ...field,
              value: res.data[field.fieldName],
            };
          });
          return newState;
        })());
      }
    });
  }, [BOMPriceId, t, status]);

  // Update form fields array when fieldArray in redux store change
  const updateFormFieldsArray = (newFieldArray) => {
    let newStartDate = '';
    let newEndDate = '';

    newFieldArray?.length && newFieldArray.map(
      (item) => {
        if (item.fieldName === BranchBOMPrice.startDate) {
          newStartDate = convertToDateServerFormat(item.value);
        }
        if (item.fieldName === BranchBOMPrice.endDate) {
          newEndDate = convertToDateServerFormat(item.value);
        }
        return item;
      }
    );
    // update data details on grid if change date in fields array
    if (dataDetailsOnGrid?.data && (dateHeader.startDate !== newStartDate || dateHeader.endDate !== newEndDate)) {
      const newData = dataDetailsOnGrid.data.map(
        (item) => {
          item.startDate = newStartDate;
          item.endDate = newEndDate;
          return item;
        }
      );
      updateDataDetailsOnGrid({
        ...dataDetailsOnGrid,
        data: newData
      });
      setDateHeader({
        startDate: newStartDate,
        endDate: newEndDate,
      });
    }
    // update form fields array
    fieldArray = [...newFieldArray];
  };

  // Update form data detail when dataDetailsOnGrid in redux store change
  const updateDataDetailsOnGridForEachPage = (newDataDetailsOnGrid) => {
    dataDetailsOnGrid = newDataDetailsOnGrid && JSON.parse(JSON.stringify(newDataDetailsOnGrid));
  };

  useEffect(() => {
    // Get combobox data and reload into state
    isEditPage &&
      Promise.all([
        getAllBranchGroup(),
        getAllChannel(),
        getAllStatus(),
        getDataCompanyCode(),
      ]).then((res) => {
        updateMultipleDetailFieldArray([{
          fieldName: BRANCH_GROUP_CODE,
          property: 'data',
          updatedData: formatDropdownList(res[0].data)
        }, {
          fieldName: CHANNEL,
          property: 'data',
          updatedData: formatComboBox(res[1].data)
        }, {
          fieldName: STATUS,
          property: 'data',
          updatedData: formatComboBox(res[2].data)
        }, {
          fieldName: COMPANY_CODE,
          property: 'data',
          updatedData: formatDropdownList(res[3].data)
        }]);
      });
  });

  // Get combobox data for add items popup and update field array for its search form
  useEffect(() => {
    isEditPage &&
      Promise.all([getDataBomBranchLevelType(), getDataCategoryType()]).then(
        (res) => {
          setBranchBOMFieldArray((prevState) => {
            const data = [...prevState];
            // Rebuild Level
            data.find((obj) => obj.fieldName === LEVEL)['data'] = formatDropdownList(res[0].data);

            // Rebuild Category
            data.find((obj) => obj.fieldName === CATEGORY_CODE)['data'] =
            formatDropdownList(res[1].data);
            return data;
          });
        }
      );
  }, [isEditPage]);

  const customEdit = (data) => {
    // Data latest are update in dataDetailsOnGrid, get info from it to display in the popup
    const tempIndex = dataDetailsOnGrid && dataDetailsOnGrid.data
      && dataDetailsOnGrid.data.findIndex(
        el => ((el.bomBranchCode || el.itemCode || el.sku) === (data.bomBranchCode || data.itemCode || data.sku) &&
        (el.startDate === data.startDate))
      );
    const tempData = tempIndex !== -1 && dataDetailsOnGrid.data[tempIndex];
    setBranchBOM(tempData || {});
    setGrandParentOpenStatus(true);
  };

  /**
   * Handle action of View button on View Branch BOM Price List
   * @param {Object} rowData 
   */
  const handleViewDetail = (rowData) => {
    setBranchBOM(rowData || {});
    setGrandParentOpenStatus(true);
  };
  
  const getDialogStatusGrandParent = (status) => {
    if (status) {
      return;
    }

    setGrandParentOpenStatus(false);
  };

  const getUpdatedPriceItem = (data) => {
    const tempData = (dataDetailsOnGrid && dataDetailsOnGrid.data) || [];
    const indexRowChange = tempData.findIndex(
      el => (el.bomBranchCode || el.itemCode || el.sku) === (data.bomBranchCode || data.itemCode || data.sku)
    );
    tempData[indexRowChange] = data;
    updateDataDetailsOnGrid({
      ...dataDetailsOnGrid,
      data: [ ...tempData ]
    });
  };

  const handleEditData = (editData) => {
    updateDataDetailsOnGrid({
      ...dataDetailsOnGrid,
      data: [ ...editData ]
    });
  };

  const filterExportData = (data) => {
    const formattedData = [];

    data && data.forEach((item) => {
      formattedData.push({
        itemCode: item.bomBranchCode || item.itemCode || item.sku,
        itemName: item.bomBranchName,
        subCode: '',
        subName: '',
        level: item.level || '',
        indicator: item.indicatorName || '',
        price: item.price || 0,
        taxCode: item.taxCode || BranchBOMPrice.taxCodes.O7,
        categoryName: item.categoryName,
      });

      if (+item.level === 1) {
        item.childBomPriceDetailVO = item.childBomPriceDetailVO || item.bomBranchDetailRestVOs || [];
      } else {
        item.childBomPriceDetailVO = [];
      }

      if (item.childBomPriceDetailVO?.length > 0) {
        formattedData.push(
          ...item.childBomPriceDetailVO.map((itemChild) =>({
            itemCode: item.itemCode || item.bomBranchCode || item.sku,
            itemName: item.itemName || item.bomBranchName,
            subCode:  itemChild.itemCode || itemChild.bomBranchCode || itemChild.sku,
            subName:  itemChild.itemName,
            level: itemChild.level || '',
            indicator: itemChild.indicatorName || '',
            price: itemChild.price || 0,
            categoryName: itemChild.categoryName,
          }))
        );
        return;
      }
    });

    return formattedData;
  };

  const replaceSpaceKeys = (object) => {
    Object.keys(object).forEach(function(key) {
      var newKey = key.replace(/\s+/g, '');
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
    return {
      itemCode: object.BranchBOMCode,
      itemName: object.BranchBOMName,
      subCode: object.SubBOMCode,
      subName: object.SubBOMName,
      level: object.Level,
      indicator: object.Indicator,
      price: object.Price,
      taxCode: object.TaxCode !== BranchBOMPrice.taxCodes.OX ? BranchBOMPrice.taxCodes.O7 : object.TaxCode,
      categoryName: object.Category,
    };
  };

  const filterImportData = (data) => {
    let formattedData = [];
    data
      .map((item) => {
        item = replaceSpaceKeys(item);
        return {
          ...item,
          sku: item.itemCode,
          entity: ConfigEntity.BOM_BRANCH,
          childBomPriceDetailVO: [],
          exVat: item.taxCode === BranchBOMPrice.taxCodes.O7 ? (calculateExVat(item.price) || 0) : 0,
        };
      })
      .forEach((item) => {
        if (item.subCode.length > 0 && formattedData[formattedData.length - 1]) {
          formattedData[formattedData.length - 1].childBomPriceDetailVO.push(
            {
              itemCode: item.subCode,
              itemName: item.subName,
              level: item.level || '',
              indicator: item.indicatorName || '',
              price: item.price || 0,
              taxCode: '',
              exVat: formattedData[formattedData.length - 1].taxCode === BranchBOMPrice.taxCodes.O7 ? (calculateExVat(item.price) || 0) : 0,
              categoryName: item.categoryName,
            }
          );

          return;
        }
        if (item.subCode.length === 0) {
          formattedData.push(item);
        }
      });
    return formattedData;
  };

  const handleImportData = (data) => {
    setImportPriceList(filterImportData(data));
  };

  const importData = () => {
    if (_.isEmpty(importPriceList)) {
      openDialog({
        type: dialogConstant.type.ERROR,
        title: 'No file selection',
        content: 'Please choose a file to import!',
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
          },
        ],
      });

      return;
    }

    const formattedImportPriceList = importPriceList.map((priceList) => {
      return {
        ...priceList,
      };
    });

    let tempData = [];
    if (dataDetailsOnGrid && dataDetailsOnGrid.data) {
      // Filter Record have Branch BOM Code
      const listTotalData = [
        ...dataDetailsOnGrid.data,
        ...formattedImportPriceList,
      ];
      for (let i = 0; i < listTotalData.length; i++) {
        for (let j = i + 1; j < listTotalData.length; j++) {
          if (
            (listTotalData[i].itemCode || listTotalData[i].bomBranchCode || listTotalData[i].sku) !== undefined &&
            (listTotalData[i].itemCode || listTotalData[i].bomBranchCode || listTotalData[i].sku) === 
            (listTotalData[j].itemCode || listTotalData[j].bomBranchCode || listTotalData[j].sku)
          ) {
            listTotalData.splice(i, 1);
            if(i > 0){
              i -= 1;
              j = 0;
            }
            else{
              i = 0;
              j = 0;
            }
          }
        }
      }
      tempData = listTotalData;
    } else {
      tempData = [...formattedImportPriceList];
    }

    //Recalculate exVat when import
    for (let i = 0; i < tempData.length; i++ ) {
      let element = tempData[i];
      if (element.childBomPriceDetailVO && +element.level === 1 && element.taxCode === BranchBOMPrice.taxCodes.O7) {
        const firstLevel2 = element.childBomPriceDetailVO[0];
        let totalChildrenExVat = 0;
        if(element.childBomPriceDetailVO.length > 0) {
          element.childBomPriceDetailVO.forEach(el => {
            totalChildrenExVat += (el.exVat && +el.exVat) || 0;
          });
        }

        if (firstLevel2) {
          // Decide to plus/minus
          firstLevel2.exVat = +(+firstLevel2.exVat + (calculateExVat(element.price) - totalChildrenExVat)).toFixed(2);
        }
      }
    }
    updateDataDetailsOnGrid({
      currentPage,
      pageSize,
      totalItems: tempData.length,
      data: convertItemDataStructure([ ...tempData], false, dateHeaderInitial)
    });
    setImportPriceList({});
    ref.current.clearFileName();

    openDialog({
      type: dialogConstant.type.INFO,
      title: 'Import successfully',
      content: 'Import successfully!',
      actions: [
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  const onChangePage = (e, page) => {
    setCurrentPage(page);
    updateDataDetailsOnGrid({
      ...dataDetailsOnGrid,
      currentPage: page
    });
  };

  const onChangeRowsPerPage = (e) => {
    const newPageSize = e.target.value;

    setPageSize(newPageSize);
    setCurrentPage(1);
    updateDataDetailsOnGrid({
      ...dataDetailsOnGrid,
      pageSize: newPageSize,
      currentPage: 1
    });
  };

  const loadAddItemsData = (params) => {

    // Only load Branch BOM have status "Active" and "Confirm"
    params.status = {
      in: [
        BranchBOM.status.confirmed,
        BranchBOM.status.active
      ]
    };

    params.flagDetail = 1;

    return trackPromise(
      getBranchBomList(params).then(
        (res) =>
          new Promise((resolve) => {
            resolve(res);
          })
      )
    );
  };

  const getAddItemsParams = (params) => {
    return {
      bomBranch:
        params.bomBranch?.length > 0 ? params.bomBranch?.trim() : undefined,
      level: {
        in:
          (Array.isArray(params.level) &&
            params.level.map((param) => param.value)) ||
          undefined,
      },
      category: {
        in:
          (Array.isArray(params.categoryCode) &&
            params.categoryCode.map((param) => param.value)) ||
          undefined,
      },
    };
  };

  const filterDetail = (detail) => {
    return detail.map((field) => {
      return {
        ...field,
        childBomPriceDetailVO: field.childBomPriceDetailVO?.map(el => ({
          ...el,
          itemCode: el.bomBranchCode || el.subCode || el.itemCode,
          itemName: el.bomBranchName || el.itemName
        })),
        startDate: field.startDate,
        endDate: field.endDate,
        itemType: 2,
        exVat: calculateExVat(field.price),
        taxCode: field.taxCode || BranchBOMPrice.taxCodes.O7,
        itemCode: field.itemCode || field.bomBranchCode || field.sku,
        itemName: field.itemName || field.bomBranchName,
      };
    });
  };

  const mapGeneralInformationForSaving = (generalInformation) => {
    const result = {};
    generalInformation.forEach((el) => {
      switch (el.fieldName) {
        case BranchBOMPrice.endDate:
        case BranchBOMPrice.startDate:
          result[el.fieldName] =
            el.value &&
            formatDateString(el.value, dateFormat.savingDateTime);
          break;
        default:
          result[el.fieldName] =
            typeof el.value === 'string' ? el.value.trim() : el.value;
          break;
      }
    });
    return result;
  };
  const getStatusMessage = (status) => {
    switch (status) {
      case BranchBOMPrice.status.active:
        return Message.BRANCH_BOM_PRICE.INACTIVE_CONFIRM;
      case BranchBOMPrice.status.inactive:
        return Message.BRANCH_BOM_PRICE.ACTIVE_CONFIRM;
      case BranchBOMPrice.status.confirm:
        return Message.BRANCH_BOM_PRICE.PR_CONFIRM;
      case BranchBOMPrice.status.closed:
        return Message.BRANCH_BOM_PRICE.CLOSE_CONFIRM;
      default:
        return Message.BRANCH_BOM_PRICE.SAVE_CONFIRM;
    }
  };

  const saveBOMGroup = () => {
    let msg = getStatusMessage();
    openDialog({
      title: Message.CONFIRM,
      content: msg.replace('%PR%', header),
      type: dialogConstant.type.CONFIRM,
      actions: [
        {
          name: 'Cancel',
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            return;
          },
        },
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            let updatedBOMPriceHeaders = mapGeneralInformationForSaving(
              fieldArray
            );

            const updatedBOMPrice = {
              ...updatedBOMPriceHeaders,
              bomPriceDetailVO: filterDetail(
                dataDetailsOnGrid && dataDetailsOnGrid.data
              ),
            };

            const statusActiveValue = fieldArray
              .filter((field) => field.fieldName === 'status')[0]
              .data.filter(
                (status) =>
                  status.display === 'Active' || status.display === 'Confirmed'
              )
              .map((item) => +item.value);
            return getUpdatedBOMPrice(
              originBOMPrice,
              updatedBOMPrice,
              statusActiveValue
            );
          },
        },
      ],
    });
    return getUpdatedBOMPrice();
  };

  const onCustomEdit = () => {
    return `/catalog/branch-bom-price/edit/${BOMPriceId}`;
  };

  const changeStatusPrice = (activeStatus) => {

    let status = activeStatus;

    const body = {
      bomPriceId: BOMPriceId,
      status
    };
    let msg = getStatusMessage(status);
    openDialog({
      title: Message.CONFIRM,
      content: msg.replace('%PR%', header),
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
            if (
              status === BranchBOMPrice.status.confirm ||
              status === BranchBOMPrice.status.active
            ) {
              if (originBOMPrice.bomPriceDetailVO.length > 0) {
                // If change status to Confirm and start date equal to current date, set status to Active
                const currentDate = formatDateString(
                  Date.now(),
                  dateFormat.savingDate
                );
                const startDate = dateHeader.startDate.substring(0, 8);
                const endDate = dateHeader.endDate.substring(0, 8);

                if (currentDate >= startDate && currentDate <= endDate) {
                  body.status = BranchBOMPrice.status.active;
                }

                if (currentDate > endDate) {
                  body.status = BranchBOMPrice.status.expired;
                }

                updateStatusBranchBOMPrice(body).then(() => {
                  setStatus(body.status);
                });
              } else {
                openDialog({
                  type: dialogConstant.type.ERROR,
                  title: Message.ERROR,
                  content:
                    status === BranchBOMPrice.status.confirm
                      ? Message.BRANCH_BOM_PRICE.CAN_NOT_CONFIRM
                      : Message.BRANCH_BOM_PRICE.CAN_NOT_ACTIVATE,
                  actions: [
                    {
                      name: 'OK',
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                    },
                  ],
                });
              }
            } else {
              updateStatusBranchBOMPrice(body).then(() => {
                setStatus(status);
              });
            }
          },
        },
      ],
    });
  };
  /**
   * Check if any line in grid has category which not sastified the channel.
   * Raise error if assign an items "Resto Product with Packaging" to the channel which is
   * NOT in [Take Away/Delivery/Delivery Lineman/Delivery Grab]
   * @param {Object} newDataDetailsOnGrid
   */
  const afterAddItemsToListHandler = (newDataDetailsOnGrid) => {
    const channelIndex = fieldArray.findIndex(el => el.fieldName === 'channel');
    const channelValue = fieldArray[channelIndex].value && fieldArray[channelIndex].value.toString();
    // No need to check category if channel is [Take Away, Delivery, Delivery Lineman, Delivery Grab]
    if (channelValue && BranchBOMPrice.listChannelCodeAllowRestoCategory.indexOf(channelValue) !== -1) {
      return;
    }

    if (newDataDetailsOnGrid && newDataDetailsOnGrid.data) {
      const tempList = [...newDataDetailsOnGrid.data];
      // List that has item with category NOT "resto product packaging"
      const tempListAfterRemoveResto = tempList.filter(el => 
        (el.productName && el.productName.toLowerCase()) !== BranchBOMPrice.categoryName.restoPackaging.toLowerCase()
      );
      // List that has item with "resto product packaging" category
      const tempListResto = tempList.filter(el => 
        (el.productName && el.productName.toLowerCase()) === BranchBOMPrice.categoryName.restoPackaging.toLowerCase()
      ).map(el => el.bomBranchCode || el.itemCode || el.sku);

      if (tempListResto.length > 0) {
        openDialog({
          type: dialogConstant.type.ERROR,
          title: Message.ERROR,
          content: Message.BRANCH_BOM_PRICE.INVALID_ITEM_WITH_CATEGORY.replace('%BRANCH_BOM_CODE%', tempListResto.join(',')),
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
        updateDataDetailsOnGrid({
          ...newDataDetailsOnGrid,
          totalItems: tempListAfterRemoveResto.length,
          data: tempListAfterRemoveResto
        });
        updateAddItemsSelections(tempListAfterRemoveResto.map(el => {
          return {
            id: el.id,
            sku: el.sku,
            entity: el.entity
          };
        }));
      }
    }
  };

  const handleCustomRow = rowData => {
    const endDate = dateHeader.endDate.substring(0,8);
    const currentDate = formatDateString(Date.now(), dateFormat.savingDate);
    if (isEditPage) {
      if (rowData.price === 0 || !rowData.price) {
        return {
          backgroundColor: '#FFDDDD',
        };
      } else if (endDate < currentDate) {
        return {
          backgroundColor: '#FFF5EB',
        };
      }
    } else {
      if (endDate < currentDate) {
        return {
          backgroundColor: '#FFF5EB',
        };
      }
    }
  };

  const listConfig = {
    history,
    actions: isEditPage ? customActions && customActions(customEdit) : null,
    options: tableOptions(handleCustomRow),
    validation,
    informationConvert: informationConvert,
    columnsDetail: isEditPage ? columns : columns(handleViewDetail)|| [],
    titleSubmit: 'Save',
    isHiddenBtnDraft: true,
    addItemsFieldList: branchBOMFieldArray,
    isNoHistory: true,
    showPagination: true,
    customToolbarContent: isEditPage && customToolbarContent(handleImportData, ref, importData, filterExportData),
    isGridEditable: !!isEditPage,
    convertItemDataStructure,
    getAddItemsParams: getAddItemsParams,
    loadAddItemsData: loadAddItemsData,
    onCustomSave: saveBOMGroup,
    onChangePage,
    onChangeRowsPerPage,
    updateFormFieldsArray,
    updateDataDetailsOnGridForEachPage,
    isLineGridEditableHidden: isEditableHidden,
    handleRowChange: handleEditData,
    afterAddItemsToListHandler,
    // FOR DETAIL PAGE
    isDetailsPage,
    fieldsLabelArray,
    bottomGridButtonsArray: bottomGridButtonsArray && bottomGridButtonsArray(status, changeStatusPrice),
    onCustomEdit,
  };

  return (
    <div className={`${classes.branchBomPrice} ${classes.branchBomPriceEdit}`}>
      <PageHeader {...pageHeaderConfigs} />
      <DetailForm {...listConfig} />
      <div className={classes.hiddenArea}>
        <PriceEdit
          isEditPage={isEditPage}
          grandParentOpenStatus={grandParentOpenStatus}
          getDialogStatusGrandParent={getDialogStatusGrandParent}
          parentBranchBOM={branchBOM}
          getUpdatedPriceItem={getUpdatedPriceItem}
        />
      </div>
    </div>
  );
};
BranchBOMPriceForm.propTypes = {
  customClass: PropTypes.string,
  customActions: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  isEditPage: PropTypes.bool,
  pageTitle: PropTypes.string,
  headerFields: PropTypes.any,
  tableOptions: PropTypes.any,
  dataTable: PropTypes.object,
  exportConfigs: PropTypes.object,
  columns: PropTypes.any,
  validation: PropTypes.array,
  pageHeaderConfigs: PropTypes.object,
  classFormFieldCustom: PropTypes.string,
  getUpdatedBOMPrice: PropTypes.func,
  getNewPriceItem: PropTypes.func,
  isDetailsPage: PropTypes.bool,
  updateAllFieldArray: PropTypes.func,
  updateDataDetailsOnGrid: PropTypes.func,
  BOMPriceId: PropTypes.any,
  getBranchBOMPrice: PropTypes.func,
  updateMultipleDetailFieldArray: PropTypes.func,
  fieldLabels: PropTypes.func,
  bottomGridButtonsArray: PropTypes.any,
  updateAddItemsSelections: PropTypes.func
};

const mapDispatchToProps = (dispatch) => ({
  updateAllFieldArray: (data) =>
    dispatch({ type: ActionType.UPDATE_ALL_FIELD_ARRAY, fieldArray: data }),
  updateDataDetailsOnGrid: (data) =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
  updateAllAddItemsFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_ALL_ADD_ITEMS_FIELD_ARRAY,
      fieldArray: data,
    }),
  updateMultipleDetailFieldArray: (data) =>
    dispatch({
      type: ActionType.UPDATE_MULTIPLE_DETAIL_FIELD_ARRAY,
      detailsData: data,
    }),
  updateAddItemsSelections: (data) =>
    dispatch({
      type: ActionType.UPDATE_ADD_ITEMS_SELECTIONS,
      addItemsSelections: data,
    }),
});

export default connect(null, mapDispatchToProps)(withRouter(withStyles(useStyles)(BranchBOMPriceForm)));
