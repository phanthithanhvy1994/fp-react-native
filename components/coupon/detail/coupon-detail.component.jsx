import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect, useDispatch } from 'react-redux';
import { DialogActions, withStyles } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DetailForm from '../../shared/form/detail-form/detail-form.component';
import { 
  getCouponDetailsById,
  confirmCoupon,
  getCouponStatus,
  editStatusCoupon,
  getCouponDetailGrid
} from '../../../actions/coupon-action';
import {
  actions,
  options,
  fieldsLabelArrayCoupon,
  columnsDetail,
  actionsBtnInGeneralForm,
  editSerialCoupon,
  columnPopupEdit,
  optionsPopupEdit
} from './coupon-detail.config.js';
import PageHeader from '../../shared/page-header/page-header.component';
import { ActionType, ButtonConstant, CouponConstant, dateFormat, PaginationConfiguration } from '../../../constants/constants';
import FormFields from '../../shared/form/detail-form/form-fields.component';
import Fieldset from '../../shared/fieldset/fieldset.component';
import Button from '../../shared/buttons/button.component';
import CouponAddNew from '../add/coupon-add.component';
import TableGrid from '../../shared/table-grid/table-grid.component';

import useStyles from './coupon-detail.style';

import searchTitleStyle from '../../../style/core/search/search-title';
import {openDialog} from '../../../redux/message-dialog/message-dialog.actions';
import {Message} from '../../../constants/messages';
import {buttonConstant, dialogConstant} from '../../../util/constant';
import {formatComboBox} from '../../../util/format-util';
import {formatDateString} from '../../../util/date-util';

var fieldArray = [];
var dataDetailsOnGrid = {};
const DetailCoupon = (props) => {
  const { match, isDetailsPage, classes, t, history } = props;

  const [detailData, setDetailData] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [isEdited, setIsEdited] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [rowsSelected, setRowsSelected] = useState([]);
  const [errMessage, setErrMessage] = useState({});
  const [status, setStatus] = useState([]);
  const [fieldsLabelArray, setFieldsLabelArray] = useState([]);
  const [dataPopupEdit, setDataPopupEdit] = useState({});
  const [rowsEdited, setRowsEdited] = useState([]);
  const { handleSubmit, errors, setError, setValue, clearErrors } = useForm({
    reValidateMode: 'onSubmit',
  });

  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  const [pageSizePopup, setPageSizePopup] = useState(
    PaginationConfiguration.itemsPerPage);
  const [currentPagePopup, setCurrentPagePopup] = useState(
    PaginationConfiguration.currentPage
  );

  const dispatch = useDispatch();

  const updateDataDetailsOnGrid = useCallback(
    (data) => {
      dispatch({
        type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
        dataDetailsOnGrid: data,
      });
    },
    [dispatch]
  );

  // Update form data detail when dataDetailsOnGrid in redux store change
  const updateDataDetailsOnGridForEachPage = (newDataDetailsOnGrid) => {
    dataDetailsOnGrid = newDataDetailsOnGrid && JSON.parse(JSON.stringify(newDataDetailsOnGrid));
  };

  const updateStateFieldArray = useCallback(
    data => {
      dispatch({
        type: ActionType.UPDATE_ALL_FIELD_ARRAY,
        fieldArray: data,
      });
    },
    [dispatch]
  );

  const updateHistoryData = useCallback(
    (data) => {
      dispatch({ type: ActionType.UPDATE_HISTORY_DATA, history: data });
    },
    [dispatch]
  );

  useEffect(() => {
    // Get combobox data and reload into state
    getCouponStatus().then(res => setStatus(formatComboBox(res.data)));
  }, []);

  const onChangePage = (e, page) => {
    const searchParam = {
      currentPage: page,
      maxResult: pageSize,
      countFlag: 1,
    };
    setCurrentPage(page);
    loadCoupon(match.params.id, searchParam);
  };

  const onChangeRowsPerPage = e => {
    const pageSizeChange = e.target.value;
    // const currentPage = PaginationConfiguration.currentPage;
    const searchParam = {
      currentPage: 1,
      maxResult: pageSizeChange,
      countFlag: 1,
    };

    setCurrentPage(1);
    setPageSize(+pageSizeChange);
    loadCoupon(match.params.id, searchParam);
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

  const loadCoupon = useCallback(
    (couponId, params) => {
      return new Promise((resolve, reject) => {
        getCouponDetailsById({ id: couponId })
          .then((res) => {
            if (!res.data) {
              this.props.history.push('/404');
            }
            const detailData = res.data;
            setDetailData(res.data);
            // TODO: Will set confirmed base on update in response API.
            // setConfirmed(!detailData.update || false);
            setConfirmed((detailData?.couponDetailVos?.length > 0) || false);
            setFieldsLabelArray(fieldsLabelArrayCoupon(detailData));
            if (detailData.historyData) {
              updateHistoryData(detailData.historyData);
            }
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });

        const detailParams = {
          ...params,
          couponId: +couponId
        };
        getCouponDetailGrid(detailParams).then(res => {
          const dataTable = {
            totalItems: res.totalRecord,
            currentPage,
            pageSize: detailParams.maxResult,
            ...params,
            data: res.data || [],
          };
          updateDataDetailsOnGrid(dataTable);
        });
      });
    },
    [updateDataDetailsOnGrid, updateHistoryData]
  );

  useEffect(() => {
    const itemId = match.params.id;
    const searchParam = {
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
    };
    loadCoupon(itemId, searchParam);
  }, [match.params.id, loadCoupon, confirmed, isEdited]);

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
        data: rowsSelected.slice(0, currentPagePopup * pageSizePopup),
        dataEdit: rowsSelected, 
        totalItems: rowsSelected.length,
        currentPage: currentPagePopup,
        pageSize: pageSizePopup,
      });
    }
    setIsOpen(true);
    updateStateFieldArray(
      editSerialCoupon(status, rowsSelected)
    );
  };

  const validationStatusEdit = (statusDataChecked, statusChange, validTo) => {
    let errMessage = {};
    const statusName = CouponConstant.statusName[statusChange];
    // Case: When current status is Active or Inactive
    if (
      (statusDataChecked.includes(CouponConstant.fieldEdit.active) &&
        statusChange !== CouponConstant.fieldEdit.in_Active && statusChange !== CouponConstant.fieldEdit.active &&
        statusChange) ||
      (statusDataChecked.includes(CouponConstant.fieldEdit.in_Active) &&
        statusChange !== CouponConstant.fieldEdit.active && statusChange !== CouponConstant.fieldEdit.in_Active &&
        statusChange)
    ) {
      const msg = (statusDataChecked.includes(CouponConstant.fieldEdit.active) ? Message.COUPON.VALIDATION_ACTIVE_STATUS : Message.COUPON.VALIDATION_INACTIVE_STATUS);
      errMessage = {
        err: true,
        Message: msg.replace(
          '<StatusName>',
          ` ${statusName}`
        ),
      };
    } else 
    // Case: when current status is expired and not change valid to
    if (
      statusDataChecked.find(status => status === CouponConstant.fieldEdit.expired) &&
      !validTo
    ) {
      errMessage = {
        err: true,
        Message: Message.COUPON.VALIDATION_VALID_TO,
      };
    } else
    // Current Status Used => Can't change status
    if ( statusDataChecked.includes(CouponConstant.fieldEdit.used)&&
        statusChange !== CouponConstant.fieldEdit.used
    ) {
      errMessage = {
        err: true,
        Message: Message.COUPON.VALIDATION_NOT_CHANGE_USED,
      };
    } 
    else if ( // Current Status is normal => Can't change In-Active status
      statusChange === CouponConstant.fieldEdit.active &&
      !statusDataChecked.includes(CouponConstant.fieldEdit.in_Active)
    ) {
      const normalStatus =  CouponConstant.statusName[statusDataChecked[0]];
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS_CHANGE_ACTIVE.replace(
          '<StatusName>',
          ` ${normalStatus}`
        ),
      };
    }
    else if ( // Current Status is normal => Can't change Active status
      statusChange === CouponConstant.fieldEdit.in_Active &&
      !(statusDataChecked.includes(CouponConstant.fieldEdit.active) || 
        statusDataChecked.includes(CouponConstant.fieldEdit.ready_To_Sale))
    ) {
      const normalStatus =  CouponConstant.statusName[statusDataChecked];
      errMessage = {
        err: true,
        Message: Message.VOUCHER.VALIDATION_STATUS_CHANGE_INACTIVE.replace(
          '<StatusName>',
          ` ${normalStatus}`
        ),
      };
    }
    setErrMessage(errMessage);
    return errMessage;
  };
  
  const showEditCouponDetail = (show = true) => {
    setIsOpenEdit(show);
  };
  const onUpdate = () => {
    const itemId = match.params.id;
    const searchParam = {
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
    };
    loadCoupon(itemId, searchParam);
  };
  const onCustomSave = () => {
    const id = detailData.couponId;
    const promise = new Promise((resolve, reject) => {
      openDialog({
        title: Message.CONFIRM,
        content: Message.COUPON.COUPON_CONFIRM.replace(
          '%COUPON%',
          detailData.couponName
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
              confirmCoupon(id).then((res) => {
                if (!res.message) {
                  openDialog({
                    title: Message.INFORMATION,
                    content: Message.COUPON.CONFIRM_COUPON,
                    type: dialogConstant.type.INFO,
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

  const handleRowSelect = (checkedRows) => {
    setRowsSelected(checkedRows);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setErrMessage({});
  };

  const onSaveEditItem = () => {
    const serialNos = dataPopupEdit.dataEdit.map(item => item.serialNo);
    const statusDataChecked = rowsSelected.length > 0 ?
      rowsSelected.map(item => item.status)
      : [rowsEdited.status];
    
    const status = fieldArray.find(item => item.fieldName === CouponConstant.fieldEdit.status).value;
    const validFrom = fieldArray.find(item => item.fieldName === CouponConstant.fieldEdit.validFrom).value;
    const validTo = fieldArray.find(item => item.fieldName === CouponConstant.fieldEdit.validTo).value;

    const dataEditItem = {
      serialNos: serialNos,
    };

    if (status) {
      dataEditItem.status = status;
    } else if (
      statusDataChecked.find(status => status === CouponConstant.fieldEdit.expired) &&
      validTo && !status
    ){
      dataEditItem.status = CouponConstant.fieldEdit.active;
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
    
    // Case: when valid to less than valid from
    if ((validTo - validFrom) < 0) {
      openDialog({
        title: Message.ERROR,
        content: Message.COUPON.ERROR_END_DAY,
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
    else if(!status && !validTo && !validFrom){
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

    const message = validationStatusEdit(statusDataChecked, status, validTo);

    if (!message.err) {
      editStatusCoupon(dataEditItem).then(res => {
        let edited = isEdited;
        if (!res.message) {
          openDialog({
            title: Message.INFORMATION,
            content: Message.COUPON.UPDATE_SUCCESSFULLY,
            type: dialogConstant.type.INFO,
            actions: [
              {
                name: 'OK',
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  setIsOpen(false);
                  setRowsSelected([]);
                  setIsEdited(!edited);
                },
              },
            ],
          });
        }
        if (res.message) {
          openDialog({
            title: Message.ERROR,
            content: res?.message.messages[0].messageContent,
            type: dialogConstant.type.ERROR,
            actions: [
              {
                name: 'OK',
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  setIsOpen(true);
                },
              },
            ],
          });
        }
      });
    }
  };

  const onFormFieldsChange = (data) => {
    fieldArray = data;
  };

  const pageHeader = {
    pageTitle: `Coupon Details <${detailData.couponName}>`,
    showButton: false,
  };
  const listConfig = {
    history,
    options,
    actions: actions(editItemHandler, rowsSelected, detailData),
    columnsDetail: columnsDetail(status),
    actionsBtnInGeneralForm: actionsBtnInGeneralForm(
      showEditCouponDetail,
      confirmed
    ),
    isGoBack: false,
    isDetailsPage,
    onCustomSave: onCustomSave,
    handleRowSelect: handleRowSelect,
    showPagination: true,
    updateDataDetailsOnGridForEachPage,
    onChangePage,
    onChangeRowsPerPage
  };
  return (
    <>
      <div className={classes.couponDetail}>
        <PageHeader {...pageHeader} />
        <div className={'searchCover'}>
          <DetailForm {...listConfig} fieldsLabelArray={fieldsLabelArray} />
        </div>
        {
          isOpenEdit && (
            <CouponAddNew
              isOpenDialog={isOpenEdit}
              onClose={() => showEditCouponDetail(false)}
              onUpdate={onUpdate}
              detailData={detailData}
              isEditPage
            />
          )
        }
        {isOpen && (
          <Dialog
            className={`${classes.detailDialog} ${classes.exportCoupon} `}
            open={isOpen}
            onClose={handleCancel}
            disableBackdropClick={true}
          >
            <div className={`${classes.titlePage} ${classes.titleEdit} subtitle`}>
              <DialogTitle id="customized-dialog-title" title={ detailData.couponSerialNo }>
                {t('Edit Coupon', {
                  no: detailData.couponSerialNo,
                })}
              </DialogTitle>
              <span onClick={handleCancel} className={classes.closePopupBtn}>
                <CloseIcon className="btnPrimary" />
              </span>
            </div>
            <DialogContent dividers>
              <div className={classes.editInfo}>
                <form
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
                      columns={columnPopupEdit}
                      options={optionsPopupEdit}
                      dataTable={dataPopupEdit}
                      onChangePage={(e, page) => onChangePagePopup(e, page)}
                      onChangeRowsPerPage={e => onChangeRowsPerPagePopup(e)}
                    />
                  </Fieldset>
                  <DialogActions className={classes.btnPopupEdit}>
                    <span>
                      <Button
                        className={ButtonConstant.type.NEUTRAL}
                        isFontAwesome={false}
                        title="Cancel"
                        disabled={false}
                        classCustom={classes.btnClear}
                        handleClick={handleCancel}
                      />
                      <Button
                        type="submit"
                        className={ButtonConstant.type.PRIMARY}
                        isFontAwesome={false}
                        title="Save"
                        classCustom={classes.btnPrimary}
                      />
                    </span>
                  </DialogActions>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

DetailCoupon.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailsPage: PropTypes.any,
  match: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default connect()(
  withTranslation()(withStyles(mainStyle)(DetailCoupon))
);
