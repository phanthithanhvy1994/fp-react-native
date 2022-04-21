import React, { createRef } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import SearchForm from '../../shared/search-form/search-form.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import PageHeader from '../../shared/page-header/page-header.component';
import CouponButton from '../coupon-button/coupon-button.component';
import useStyles from './coupon-list.style';
import {
  PaginationConfiguration,
  ButtonConstant,
  CouponConstant,
} from '../../../constants/constants';

import ImportIcon from '../../../assets/importIcon.svg';
import ExportIcon from '../../../assets/exportIcon.svg';

import searchTitleStyle from '../../../style/core/search/search-title';
import Button from '../../shared/buttons/button.component';
import ImportDataComponent from '../../shared/import-data/import-data.component';
import ExportDataComponent from '../../shared/export-data/export-data.component';
import {
  getCouponList,
  getCouponName,
  getCouponStatus,
  getCouponTypeList,
  getCompanyCode,
  getCouponListValueType,
  getCouponPromotion,
  importCoupon,
  exportCoupon,
} from '../../../actions/coupon-action';
import '../../coupon/coupon-button/coupon-button.scss';
import Fields from '../../shared/fields/fields.component';
import CouponScan from '../scan/coupon-scan.component';
import CouponAddNew from '../add/coupon-add.component';
import {
  fields,
  options,
  columnsDefault,
  action,
  exportConfigs,
  importHeaders,
  exportFields,
} from './coupon-list.config';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../shared/search-form/search-form.common';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { Message } from '../../../constants/messages';
import { formatDropdownList, formatComboBox } from '../../../util/format-util';

// TODO: waiting API call get level and category
class CouponList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDialog: false,
      isEditPage: false,
      isOpenExportDialog: false,
      bomSearchFields: [],
      couponList: {},
      fieldArray: fields(),
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: null,
      rowSelected: [],
      dataImport: [],
      dataExport: [],
      exportFieldData: [],
      isShowScanPopup: false,
      rowData: {}
    };
    this.isMounting = true;
    this.ref = createRef();
  }

  componentDidMount = () => {
    const typeExport = CouponConstant.internal;
    this.loadDataCouponList();
    this.loadAllSearchFld();
    if (this.isMounting) {
      this.setState({
        exportFieldData: exportFields(typeExport),
      });
    }
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  onChangeType = (e, newFieldArray) => {
    const { fieldArray, listCouponName } = this.state;

    let couponName = [];
    if (e.target.value) {
      e.target.value.forEach((cat) => {
        couponName = couponName.concat(cat.childTypes).map((item) => ({
          ...item,
          value: item.code,
        }));
      });
    }
    if (e.target.value.length === 0) {
      couponName = listCouponName;
    }
    const fieldCategory =
      newFieldArray?.filter((field) => field.fieldName === 'couponCode')[0] ||
      {};
    fieldCategory.data = couponName;
    this.setState({ couponCode: couponName, fieldArray });
  };

  loadAllSearchFld = async () => {
    let companyCode = {};
    let couponType = [];
    let couponCode = [];
    let couponValueType = [];
    let couponDetailStatus = [];
    let promotionCode = [];

    await getCompanyCode().then((res) => {
      let listData = formatDropdownList(res.data);
      const defaultVal = listData.find(
        (el) => el.value === CouponConstant.defaultCompany
      );
      companyCode.defaultVal = [defaultVal];
      companyCode.data = listData;
      return companyCode;
    });
    await getCouponStatus().then((res) => {
      couponDetailStatus = formatDropdownList(res.data);
      return couponDetailStatus;
    });
    await getCouponTypeList().then((res) => {
      couponType = formatComboBox(res.data);
      return couponType;
    });
    await getCouponListValueType().then((res) => {
      couponValueType = formatComboBox(res.data);
      return couponValueType;
    });
    await getCouponPromotion().then((res) => {
      const formatData =
        res.data &&
        res.data.map((item) => ({
          ...item,
          display: item.value,
          value: item.code,
        }));
      promotionCode = formatComboBox(formatData);
      return promotionCode;
    });
    await getCouponName().then((res) => {
      const formatData =
        res.data &&
        res.data.map((item) => ({
          ...item,
          display: item.display,
          value: item.code,
        }));
      this.setState({ listCouponName: formatData });
      couponCode = formatData;
      return couponCode;
    });
    const fieldArray = fields(
      companyCode,
      couponType,
      couponCode,
      couponValueType,
      couponDetailStatus,
      promotionCode,
      this.onChangeType
    );
    return this.isMounting ? this.setState({ fieldArray }) : [];
  };

  loadDataCouponList = (body) => {
    let params = body;
    if (!params) {
      params = {
        deleteFlag: 0,
        maxResult: this.state.pageSize,
        pageSize: this.state.pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: this.state.currentPage,
      };
    }
    getCouponList(params).then((res) => {
      const couponData = {
        totalItems: res.totalRecord || 0,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        maxResult: this.state.pageSize,
        data: res.data || [],
      };
      if (this.isMounting) {
        this.setState({
          couponList: couponData,
        });
      }
    });
  };

  onUpdate = () => {
    const { currentPage, pageSize, searchFieldsParam } = this.state;
    const searchParam = {
      ...searchFieldsParam,
      currentPage,
      maxResult: pageSize,
    };
    this.loadDataCouponList(searchParam);
  };

  onChangeRowsPerPage = (e) => {
    const pageSize = e.target.value;
    const currentPage = 1;
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      pageSize,
      currentPage,
      maxResult: pageSize,
    };
    this.setState({ pageSize, currentPage, searchFieldsParam }, () => {
      this.loadDataCouponList(searchFieldsParam);
    });
  };
  onChangePage = (e, page) => {
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      currentPage: page,
    };
    this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.loadDataCouponList(searchFieldsParam);
    });
  };

  goToDetailPage = (item) => {
    this.props.history.push(
      `/coupon-management/coupon-list/detail/${item.couponId}`
    );
  };

  goToScanPage = (couponData) => {
    this.setIsShowScanPopup(true, couponData);
  };

  /**
   * Handle when clicking search btn on searchform
   * @param {Object} searchFields
   */
  onSearch = (searchFields) => {
    // Get data input search area
    const inputParams = this.getSearchParams(searchFields);
    this.setState({ searchFieldsParam: inputParams });
    this.loadDataCouponList(inputParams);
  };
  /**
   * Set request params and only push the property which has value into request params
   * @param {Object} fieldArr search fields on search form
   */
  getSearchParams = (fieldArr) => {
    let params = {
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
      maxResult: this.state.pageSize,
      deleteFlag: 0,
      countFlag: PaginationConfiguration.countFlag,
      draftCoupon: fieldArr.draftCoupon
        ? CouponConstant.searchFieldName.draftCoupon.true
        : CouponConstant.searchFieldName.draftCoupon.false,
    };

    params = setDateRangeRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.validFrom
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.validTo
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.createdDate
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.activeDate
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.usedDate
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.expiredDate
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.couponCode
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.couponSerialNo
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.couponType
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.couponValueType
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.promotionCode
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.couponStatus
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.companyCode
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      CouponConstant.searchFieldName.bookletCode
    );
    return params;
  };

  handleOpenPopup = (isDialog) => {
    this.setState({
      isOpenDialog: isDialog,
      isEditPage: false,
      rowData: {},
    });
  };

  showEditDialog = (item) => {
    this.setState({
      isEditPage: true,
      isOpenDialog: true,
      rowData: item,
    });
  };

  handleClosePopup = () => {
    this.setState({
      isOpenDialog: false,
      isEditPage: false,
      rowData: {},
      isOpenExportDialog: false });
  };

  handleImportData = (data) => {
    this.setState({ dataImport: data });
  };

  replaceSpaceKeys(object) {
    Object.keys(object).forEach(function (key) {
      var newKey = key.replace(/\s+/g, '');
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
    return object;
  }

  importData = () => {
    const { dataImport } = this.state;
    if (dataImport.length === 0) {
      openDialog({
        type: dialogConstant.type.ERROR,
        title: Message.IMPORT_EXPORT.NO_FILE_SELECT,
        content: Message.IMPORT_EXPORT.CHOOSE_FILE_IMPORT,
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
    const formatData = dataImport.map((item) => {
      const formatItem = this.replaceSpaceKeys(item);
      return {
        itemNo: item.itemNo,
        couponSerialNo: formatItem.CouponSerialNo,
        couponStatus: formatItem.Status,
        validDateFrom: (formatItem.ValidFrom && formatItem.ValidFrom) || '',
        validDateTo: (formatItem.ValidTo && formatItem.ValidTo) || '',
      };
    });
    const datImport = { couponVOs: formatData };
    importCoupon(datImport)
      .then((res) => {
        let msg = res.message
          ? res.message.messages[0].messageContent
          : Message.COUPON.UPDATE_SUCCESSFULLY;
        let type = res.message
          ? dialogConstant.type.ERROR
          : dialogConstant.type.INFO;
        let title = res.message ? Message.ERROR : Message.INFORMATION;
        openDialog({
          type: type,
          title: title,
          content: msg,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {
                this.handleClosePopup();
                this.loadDataCouponList(this.state.searchFieldsParam);
              },
            },
          ],
        });
      })
      .catch((res) => {
        openDialog({
          type: dialogConstant.type.ERROR,
          title: Message.ERROR,
          content: res.messages[0].messageContent,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
              action: () => {
                this.handleClosePopup();
              },
            },
          ],
        });
      });
  };

  exportData = () => {
    const { rowSelected } = this.state;
    if (rowSelected.length === 0) {
      openDialog({
        type: dialogConstant.type.ERROR,
        title: Message.ERROR,
        content: Message.COUPON.NO_DATA_EXPORT,
        actions: [
          {
            name: 'OK',
            type: dialogConstant.button.FUNCTION,
            className: buttonConstant.type.PRIMARY,
            action: () => {
              this.handleClosePopup();
            },
          },
        ],
      });
      return;
    } else {
      const paramsExport = {
        couponId: {
          in: rowSelected,
        },
      };
      const formattedData = [];
      exportCoupon(paramsExport).then((res) => {
        if (!res.message) {
          res.data &&
            res.data.forEach((data) => {
              formattedData.push({
                couponSerialNo: data.couponSerialNo || '',
                couponName: data.couponName || '',
                couponType: data.couponType || '',
                serialCodeType: data.serialCodeType || '',
                couponValueType: data.couponValueType || '',
                couponValue: data.couponValue || '',
                validFrom: data.validFrom || '',
                validTo: data.validTo || '',
                status: data.status || '',
                soldDate: data.soldDate || '',
                usagedDate: data.usagedDate || '',
                branchSold: data.branchSold || '',
                branchUsage: data.branchUsage || '',
                createDate: data.createDate || '',
                companyCode: data.companyCode || '',
              });
            });
        } else if (res.message) {
          openDialog({
            title: Message.INFORMATION,
            content: res.message.messages[0].messageContent,
            actions: [
              {
                name: this.props.t('OK'),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  this.handleClosePopup();
                },
              },
            ],
          });
          return;
        }
        this.setState({
          dataExport: formattedData,
          isOpenExportDialog: true,
        });
        return true;
      });
    }
  };

  // Function change date format for export data
  convertDateExportData = (dateString) => {
    if (!dateString || dateString?.length === 0) {
      return '';
    }

    const dateParts = dateString.split('-');
    return `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
  };

  handleRowSelect = (checkedRows) => {
    const dataListExport = checkedRows.map((row) => row.couponId);
    this.setState({
      rowSelected: dataListExport,
    });
  };

  // Popup export Data
  handleChangeExport = (e, isRadio) => {
    const { exportFieldData } = this.state;
    if (isRadio) {
      exportFieldData.find((field) => field.fieldName === 'type').value =
        e.target.value;
    } else {
      const name = e.target.name;
      exportFieldData.find((field) => field.fieldName === name).value =
        e.target.value;
    }

    this.setState({
      exportFieldData: exportFieldData,
    });
  };

  renderFields = (exportFields) => {
    const array = [];
    let index = 0;
    // Check to separate fields which have separateInOnline is true
    exportFields.forEach((el) => {
      if (el.separateInOneLine) {
        array[index] = [el];
        index++;
      } else {
        if (!array[index]) {
          array[index] = [el];
        } else {
          array[index].push(el);
        }
      }
    });

    // Return row
    return array.map((item) => (
      <Fields
        key={item.id}
        conditionalArray={item}
        onChange={this.handleChangeExport}
      />
    ));
  };

  closeScanPopup = (detailData) => {
    this.setState({
      isShowScanPopup: false
    });
    this.loadDataCouponList(this.state.searchFieldsParam);
  };

  setIsShowScanPopup = (isShow, couponData) => {
    this.setState({
      isShowScanPopup: isShow ? { couponData } : isShow
    });
  };

  render() {
    const { t, classes, history } = this.props;
    const {
      couponList,
      isOpenExportDialog,
      dataExport,
      exportFieldData,
      fieldArray,
      isOpenDialog,
      rowData,
      isEditPage
    } = this.state;
    const pageHeader = {
      pageTitle: 'Coupon List',
      showButton: false,
      customContent: (
        <CouponButton
          history={history}
          handleOpenPopup={this.handleOpenPopup}
        />
      ),
    };
    const isShowScanPopup = this.state.isShowScanPopup;
    return (
      <div className={classes.coupon}>
        {this.isMounting && (
          <div>
            <PageHeader {...pageHeader} />
            <div className="searchCover">
              <SearchForm
                fieldArray={fieldArray}
                onSearch={this.onSearch}
                classCustom="user-search-bar"
                rowSize={3}
              ></SearchForm>
            </div>
            <Box className={classes.priceListToolBar} m={4}>
              <ImportDataComponent
                headers={importHeaders}
                updateImportData={this.handleImportData}
                ref={this.ref}
              />
              <span onClick={this.importData}>
                <Button
                  classCustom={classes.btnSecondaryTextOnly}
                  type={null}
                  title={t('Import file')}
                  iconImg={ImportIcon}
                />
              </span>
              <span onClick={this.exportData}>
                <Button
                  classCustom={classes.btnSecondaryTextOnly}
                  title={t('Export')}
                  iconImg={ExportIcon}
                />
              </span>
            </Box>

            <TableGrid
              defaultStyle={true}
              dataTable={couponList}
              options={options}
              columns={columnsDefault}
              actions={action(this.goToDetailPage, this.showEditDialog, this.goToScanPage)}
              className="even-odd-columns"
              onChangePage={(e, page) => this.onChangePage(e, page)}
              onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
              handleRowSelect={this.handleRowSelect}
            />
            <div>
              {isOpenExportDialog && (
                <Dialog
                  className={`${classes.detailDialog} ${classes.exportCoupon} `}
                  open={isOpenExportDialog}
                  onClose={this.handleClosePopup}
                >
                  <div className={`${classes.titlePage} subtitle`}>
                    <DialogTitle id="customized-dialog-title">
                      {t('Export Coupon')}
                    </DialogTitle>
                    <span onClick={this.handleClosePopup}>
                      <CloseIcon className="btnPrimary" />
                    </span>
                  </div>
                  <DialogContent dividers>
                    {this.renderFields(exportFieldData)}
                    <div className={classes.btnDiv}>
                      <Button
                        handleClick={this.handleClosePopup}
                        className={ButtonConstant.type.NEUTRAL}
                        isFontAwesome={false}
                        title="Cancel"
                        disabled={false}
                        classCustom={classes.btnClear}
                      />
                      <ExportDataComponent
                        classCustom={classes.btnSearch}
                        className={ButtonConstant.type.PRIMARY}
                        data={dataExport}
                        {...exportConfigs}
                        typeExport={true}
                        title="Export"
                        isFontAwesome={false}
                        closePopup={this.handleClosePopup}
                        isExport={this.exportData}
                        exportFileNameHaveDate={true}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            {isShowScanPopup && <CouponScan
              open={!!isShowScanPopup}
              showScanPopupParams={(!isShowScanPopup || isShowScanPopup === true) ? {} : isShowScanPopup}
              handleClose={this.closeScanPopup}
              setIsShowScanPopup={this.setIsShowScanPopup}
              parentScope={this}
            />}
            {isOpenDialog && <CouponAddNew
              isOpenDialog={isOpenDialog}
              onClose={this.handleClosePopup}
              onUpdate={this.onUpdate}
              detailData={rowData}
              isEditPage={isEditPage}
            />}
          </div>
        )}
      </div>
    );
  }
}

CouponList.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default withTranslation()(withStyles(mainStyle)(CouponList));
