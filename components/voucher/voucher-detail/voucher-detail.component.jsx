import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DetailForm from '../../shared/form/detail-form/detail-form.component';
import {
  getVoucher,
  confirmVoucher,
  getVoucherDetailGrid,
  getVoucherStatus,
  editVoucher,
} from '../../../actions/voucher-action';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import {
  actions,
  options,
  fieldsLabelArrayPaperVoucher,
  fieldsLabelArrayEVoucher,
  columnsDetail,
  actionsBtnInGeneralForm,
  editSerialVoucher,
  voucherDetail,
  statusNameVoucher,
  rowsPerPageOptionsCustom,
  itemsPerPageCustom,
  columnPopupEdit,
  optionsPopupEdit,
  itemsPerPagePopup
} from './voucher-detail.config.js';
import PageHeader from '../../shared/page-header/page-header.component';
import {
  ActionType,
  ButtonConstant,
  PaginationConfiguration,
  Voucher,
  dateFormat,
} from '../../../constants/constants';
import { formatDateString, convertToDateServerFormat } from '../../../util/date-util';
import FormFields from '../../shared/form/detail-form/form-fields.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import Button from '../../shared/buttons/button.component';

import useStyles from '../voucher-list.style';
import TableGrid from '../../shared/table-grid/table-grid.component';

import { formatDropdownList } from '../../../util/format-util';
import searchTitleStyle from '../../../style/core/search/search-title';
import VoucherWithoutSO from '../voucher-created-without-SO/voucher-created-without-SO.component';
import EVoucherWithSO from '../voucher-created-with-SO/voucher-created-with-SO.component';

var fieldArray = [];
const DetailVoucher = props => {
  const { match, isDetailsPage, classes, t, history } = props;

  const [detailData, setDetailData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [rowsEdited, setRowsEdited] = useState([]);
  const [isEvoucher, setIsVoucher] = useState(false);
  const [fieldsLabelArray, setFieldsLabelArray] = useState([]);
  const [confirmed, setConfirmed] = useState(false);
  const [status, setStatus] = useState([]);
  const [errMessage, setErrMessage] = useState({});
  const [isEditItem, setIsEditItem] = useState(false);
  const [dataPopupEdit, setDataPopupEdit] = useState({});
  const [pageSize, setPageSize] = useState(itemsPerPageCustom);
  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSizePopup, setPageSizePopup] = useState(itemsPerPagePopup);
  const [currentPagePopup, setCurrentPagePopup] = useState(
    PaginationConfiguration.currentPage
  );
  const { handleSubmit, errors, setError, setValue, clearErrors } = useForm({
    reValidateMode: 'onSubmit',
  });
  const dispatch = useDispatch();

  const updateDataDetailsOnGrid = useCallback(
    data => {
      dispatch({
        type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
        dataDetailsOnGrid: data,
      });
    },
    [dispatch]
  );

  const updateStateFieldArray = useCallback(
    data => {
      dispatch({
        type: ActionType.UPDATE_ALL_FIELD_ARRAY,
        fieldArray: data,
      });
    },
    [dispatch]
  );

  const updateDetailFieldArray = useCallback(
    data => {
      dispatch({
        type: ActionType.UPDATE_DETAIL_FIELD_ARRAY,
        ...data,
      });
    },
    [dispatch]
  );

  const loadVoucher = useCallback(
    (id, params, searchFieldsParam) => {
      return new Promise((resolve, reject) => {
        getVoucher(id)
          .then(res => {
            const detailData = res.data;
            const isEVoucher = detailData.voucherType === Voucher.e_Voucher;
            setDetailData(res.data);
            setIsVoucher(isEVoucher);
            setConfirmed(detailData.update === 0 ? true : false);
            setFieldsLabelArray(
              isEVoucher
                ? fieldsLabelArrayEVoucher(detailData)
                : fieldsLabelArrayPaperVoucher(detailData)
            );
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
        const detailParams = {
          ...params,
          ...searchFieldsParam,
          voucherId: {
            eq: id,
          },
        };
        getVoucherDetailGrid(detailParams).then(res => {
          const dataTable = {
            totalItems: res.totalRecord,
            currentPage,
            pageSize: params.maxResult,
            ...params,
            data: res.data || [],
          };
          updateDataDetailsOnGrid(dataTable);
        });
      });
    },
    [updateDataDetailsOnGrid]
  );

  useEffect(() => {
    const itemId = match.params.id;
    const searchParam = {
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
    };
    const searchFieldsParam = history.location.searchFieldsParam;
    loadVoucher(itemId, searchParam, searchFieldsParam);
  }, [
    match.params.id,
    loadVoucher,
    currentPage,
    pageSize,
    confirmed,
    isEditItem,
    history
  ]);

  useEffect(() => {
    // Get combobox data and reload into state
    getVoucherStatus().then(res => setStatus(formatDropdownList(res.data)));
  }, []);

  const editItemHandler = (rowData) => {
    if(rowData){
      setRowsEdited(rowData);
      setDataPopupEdit({
        totalItems: rowData.length,
        currentPage: currentPagePopup,
        pageSize: pageSizePopup,
        dataEdit: [rowData],
        data: [rowData].slice(0, currentPagePopup * pageSizePopup)
      });
    }
    else{
      setDataPopupEdit({
        // data: rowsSelected,
        data: rowsSelected.slice(0, currentPagePopup * pageSizePopup),
        dataEdit: rowsSelected, 
        totalItems: rowsSelected.length,
        currentPage: currentPagePopup,
        pageSize: pageSizePopup,
      });
    }
    setIsOpen(true);
    updateStateFieldArray(
      editSerialVoucher(status, onChangeValidFrom, isEvoucher, rowsSelected)
    );
  };

  const editVoucherDetail = () => {
    setIsOpenEdit(true);
  };

  const onUpdated = () => {
    const itemId = match.params.id;
    const searchParam = {
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
    };

    loadVoucher(itemId, searchParam);
  };

  const renderEditPopup = () => {
    if (detailData?.saleOrderNo) {
      return (
        <EVoucherWithSO
          isEditPage={true}
          isOpenMenu={isOpenEdit}
          onClose={handleClose}
          detailData={detailData}
          onUpdated={onUpdated}
        />
      );
    }
    return (
      <VoucherWithoutSO
        isOpenMenu={isOpenEdit}
        onClose={handleClose}
        isEditPage
        detailData={detailData}
        onUpdated={onUpdated}
      />
    );
  };

  const viewSaleOrderDetail = () => {
    const saleOrderNo = detailData.saleOrderNo;
    history.push(`/voucher-management/voucher-list/sale-order-detail/${saleOrderNo}`);
  };

  const onCustomSave = () => {
    const id = detailData.voucherId;
    const promise = new Promise((resolve, reject) => {
      openDialog({
        title: Message.CONFIRM,
        content: Message.VOUCHER.VOUCHER_CONFIRM.replace(
          '%VOUCHER%',
          detailData.voucherName
        ),
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
              confirmVoucher(id).then((res) => {
                if (res.message) {
                  openDialog({
                    title: Message.ERROR,
                    content: res.message.messages[0].messageContent,
                    actions: [
                      {
                        name: 'OK',
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                        action: () => {
                          setConfirmed(true);
                          resolve();
                        },
                      },
                    ],
                  });
                } else {
                  openDialog({
                    title: Message.CONFIRM,
                    content: Message.VOUCHER.CONFIRM_VOUCHER,
                    actions: [
                      {
                        name: 'OK',
                        type: dialogConstant.button.FUNCTION,
                        className: buttonConstant.type.PRIMARY,
                        action: () => {
                          setConfirmed(true);
                          resolve();
                        },
                      },
                    ],
                  });
                }
              });
            },
          },
        ],
      });
    });
    return promise;
  };

  const handleRowSelect = checkedRows => {
    setRowsSelected(checkedRows);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsOpenEdit(false);
    setErrMessage({});
    setIsEditItem(false);
  };

  const validationStatusEdit = (statusDataChecked, statusChange, validTo, validFrom, isEVoucher) => {
    let errMessage = {};
    const statusName = statusNameVoucher[statusChange];

    if ( // Current Status Active. Change status is not In-Active
      (statusDataChecked.includes(voucherDetail.Active) &&
        statusChange !== voucherDetail.In_Active &&
        statusChange)
    ) {
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS.replace(
          '<StatusName>',
          ` ${statusName}`
        ),
      };
    } else if (validTo && validFrom && !isEVoucher && convertToDateServerFormat(validTo) < convertToDateServerFormat(validFrom)) {
      errMessage = {
        err: true,
        Message: Message.VOUCHER.INVALID_DATE_RANGE
      };
    } else if (validTo && validTo <= new Date(Date.now())) {
      errMessage = {
        err: true,
        Message: Message.VOUCHER.INVALID_VALID_TO
      };
    }else if( // Current Status In-Active. Change status is not Active
      (statusDataChecked.includes(voucherDetail.In_Active) &&
        statusChange !== voucherDetail.Active &&
        statusChange)
    ) {
    } else if ( // Current Status Expired. Change status is not ValidTo (P-Voucher)
      statusDataChecked.includes(voucherDetail.Expired) &&
      !validTo && !isEVoucher
    ) {
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_VALID_TO,
      };
    } else if ( // Current Status Expired. Change status is not ValidTo (E-Voucher)
      statusDataChecked.includes(voucherDetail.Expired) &&
      isEVoucher
    ) {
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_EXPIRED_EVOUCHER.replace(
          '<StatusName>',
          ` ${statusName}`
        ),
      };
    } else if ( // Current Status Used => Can't change status
      statusDataChecked.includes(voucherDetail.Used)
    ) {
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS_USED,
      };
    } 
    else if ( // Current Status is normal => Can't change In-Active status
      statusChange === voucherDetail.Active && 
      !statusDataChecked.includes(voucherDetail.In_Active)
    ) {
      const normalStatus =  statusNameVoucher[statusDataChecked[0]];
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS_CHANGE_ACTIVE.replace(
          '<StatusName>',
          ` ${normalStatus}`
        ),
      };
    }
    else if ( // Current Status is normal => Can't change Active status
      statusChange === voucherDetail.In_Active && 
      !(statusDataChecked.includes(voucherDetail.Active) ||
        statusDataChecked.includes(voucherDetail.Ready_To_Sale))
    ) {
      const normalStatus =  statusNameVoucher[statusDataChecked];
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS_CHANGE_INACTIVE.replace(
          '<StatusName>',
          ` ${normalStatus}`
        ),
      };
    }
    else if ( 
      statusDataChecked.includes(voucherDetail.Ready_To_Sale) &&
      statusChange !== voucherDetail.In_Active
    ){
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS_CHANGE_READY_TO_SAVE.replace(
          '<StatusName>',
          ` ${statusName}`
        ),
      };
    }
    setErrMessage(errMessage);
    return errMessage;
  };

  const onSaveEditItem = () => {
    const itemId = match.params.id;
    const searchParam = {
      currentPage,
      pageSize,
      countFlag: 1,
    };
    const isEVoucher = detailData.voucherType === Voucher.e_Voucher;
    const serialNos = dataPopupEdit.dataEdit.map(item => item.serialNo);
    // const statusDataChecked = rowsSelected.map(item => item.voucherStatus);
    const statusDataChecked = rowsSelected.length > 0 ? 
      rowsSelected.map(item => item.voucherStatus)
      : [rowsEdited.voucherStatus];
    const status = fieldArray.find(
      item => item.fieldName === voucherDetail.status
    ).value;
    const validFrom = fieldArray.find(
      item => item.fieldName === voucherDetail.validFrom
    ).value;
    const validTo = fieldArray.find(
      item => item.fieldName === voucherDetail.validTo
    ).value;
    const dataEditItem = {
      serialNos: serialNos,
    };
    if (status) {
      dataEditItem.status = status;
    } else if (
      statusDataChecked.find(status => status === voucherDetail.Expired) &&
      validTo && !status
    ) {
      dataEditItem.status = voucherDetail.Active;
    }

    if (validFrom) {
      dataEditItem.validFrom = formatDateString(
        validFrom,
        dateFormat.savingDateTime
      );
    }
    if (validTo) {
      dataEditItem.validTo = formatDateString(
        validTo,
        dateFormat.savingDateTime
      );
    }
    
    if(!status && !validTo && !validFrom){
      openDialog({
        title: Message.ERROR,
        content: Message.COUPON.VALIDATION_NOTHING_CHANGE,
        type: dialogConstant.type.ERROR,
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

    const message = validationStatusEdit(statusDataChecked, status, validTo, validFrom, isEVoucher);
    if (!message.err) {
      editVoucher(dataEditItem).then(res => {
        if (!res.message) {
          openDialog({
            title: Message.CONFIRM,
            content: Message.VOUCHER.CONFIRM_EDIT_STATUS,
            actions: [
              {
                name: 'OK',
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  setIsOpen(false);
                  setRowsSelected([]);
                  loadVoucher(itemId, searchParam);
                },
              },
            ],
          });
        }
        if (res.message) {
          openDialog({
            title: Message.ERROR,
            content: res?.message.messages[0].messageContent,
            actions: [
              {
                name: 'OK',
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  setIsOpen(false);
                },
              },
            ],
          });
        }
      });
    }
  };

  const onFormFieldsChange = data => {
    fieldArray = data;
  };

  const onChangeValidFrom = e => {
    updateDetailFieldArray({
      fieldName: voucherDetail.validTo,
      property: 'minDate',
      updatedData: e.target.value < Date.now() ? Date.now() : e.target.value,
    });
  };

  const onChangePage = (e, page) => {
    const searchParam = {
      currentPage: page,
      maxResult: pageSize,
      countFlag: 1,
    };
    setCurrentPage(page);
    loadVoucher(match.params.id, searchParam);
  };

  const onChangeRowsPerPage = e => {
    const pageSizeChange = e.target.value;
    // const currentPage = PaginationConfiguration.currentPage;
    const searchParam = {
      currentPage: 1,
      maxResult: pageSizeChange,
      countFlag: 1,
    };

    setPageSize(+pageSizeChange);
    setCurrentPage(1);
    loadVoucher(match.params.id, searchParam);
  };

  const onChangePagePopup = (e, page) => {
    setCurrentPagePopup(page);
    setDataPopupEdit({
      totalItems: rowsSelected.length,
      currentPage: page,
      pageSize: pageSizePopup,
      dataEdit: rowsSelected, 
      data: rowsSelected.slice(((page -1) * pageSizePopup), page * pageSizePopup)
    });
  };

  const onChangeRowsPerPagePopup = (e) =>{
    const pageSizeChange = e.target.value;
    setCurrentPagePopup(1);
    setPageSizePopup(pageSizeChange);
    setDataPopupEdit({
      totalItems: rowsSelected.length,
      currentPage: 1,
      pageSize: pageSizeChange,
      dataEdit: rowsSelected, 
      data: rowsSelected.slice((0 * pageSizeChange), 1 * pageSizeChange)
    });
  };

  const pageHeader = {
    pageTitle: `Voucher Details <${detailData.voucherName}>`,
    showButton: false,
  };
  const isEVoucher = detailData.voucherType === Voucher.e_Voucher;
  const listConfig = {
    history,
    options,
    actions: actions(editItemHandler, rowsSelected),
    columnsDetail: columnsDetail(isEVoucher),
    actionsBtnInGeneralForm: actionsBtnInGeneralForm(
      viewSaleOrderDetail,
      editVoucherDetail,
      confirmed,
      isEvoucher,
      detailData
    ),
    isGoBack: false,
    isDetailsPage,
    onCustomSave: onCustomSave,
    handleRowSelect: handleRowSelect,
    // Config show paging
    showPagination: true,
    onChangePage: onChangePage,
    onChangeRowsPerPage: onChangeRowsPerPage,
    rowsPerPageOptionsCustom,
  };

  return (
    <>
      <div>
        <PageHeader {...pageHeader} />
        <div className={`${classes.searchCover} ${classes.voucherDetail} ${!isEVoucher ? 'p-voucher' : ''}`}>
          <DetailForm {...listConfig} fieldsLabelArray={fieldsLabelArray} />
        </div>
        {isOpen && (
          <Dialog
            className={`${classes.detailDialog} ${classes.exportVoucher} `}
            open={isOpen}
          >
            <div className={`${classes.titlePage} subtitle`}>
              <DialogTitle id="customized-dialog-title">
                {t(
                  `Edit Voucher <Voucher Serial NO ${detailData.voucherSerialNo}>`
                )}
              </DialogTitle>
              <span onClick={handleClose} className={classes.closePopupBtn}>
                <CloseIcon className="btnPrimary" />
              </span>
            </div>
            <DialogContent dividers>
              <form
                className={`${classes.infoDetail} popupEdit`}
                onSubmit={handleSubmit(() => {
                  onSaveEditItem();
                })}
                noValidate
              >
                <Fieldset title={'General Information'}>
                  <FormFields
                    classCustom="user-search-bar"
                    errors={errors}
                    setValue={setValue}
                    setError={setError}
                    clearErrors={clearErrors}
                    onFormFieldsChange={onFormFieldsChange}
                  />
                  {errMessage.err && (
                    <span className="showErrPopup">{errMessage.Message}</span>
                  )}
                </Fieldset>
                <Fieldset
                  title="Details Information"
                  customClasses="detail-list-info scan-popup"
                >
                  <TableGrid
                    defaultStyle={true}
                    dataTable={dataPopupEdit}
                    columns={columnPopupEdit}
                    options={optionsPopupEdit}
                    onChangePage={(e, page) => onChangePagePopup(e, page)}
                    onChangeRowsPerPage={e => onChangeRowsPerPagePopup(e)}
                  />
                </Fieldset>
                <span className={`${classes.btnSave} ${classes.btnPopupEdit}`}>
                  <Button
                    className={ButtonConstant.type.NEUTRAL}
                    isFontAwesome={false}
                    title="Cancel"
                    disabled={false}
                    classCustom={classes.btnClear}
                    handleClick={handleClose}
                  />
                  <Button
                    type="submit"
                    className={ButtonConstant.type.PRIMARY}
                    isFontAwesome={false}
                    title="Save"
                    classCustom={classes.btnPrimary}
                  />
                </span>
              </form>
            </DialogContent>
          </Dialog>
        )}
        {isOpenEdit && renderEditPopup()}
      </div>
    </>
  );
};
// }

DetailVoucher.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailsPage: PropTypes.any,
  match: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default connect()(
  withTranslation()(withStyles(mainStyle)(DetailVoucher))
);
