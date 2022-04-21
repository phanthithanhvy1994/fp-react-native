import React, { createRef } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ImportIcon from '../../assets/importIcon.svg';
import ExportIcon from '../../assets/exportIcon.svg';
import SearchForm from '../shared/search-form/search-form.component';
import TableGrid from '../shared/table-grid/table-grid.component';
import PageHeader from '../shared/page-header/page-header.component';
import VoucherButton from './voucher-button/voucher-button.component';
import VoucherWithoutSO from './voucher-created-without-SO/voucher-created-without-SO.component';
import VoucherExport from './voucher-export/voucher-export.component';
import useStyles from './voucher-list.style';

import {
  PaginationConfiguration,
  Voucher,
  Action,
} from '../../constants/constants';

import searchTitleStyle from '../../style/core/search/search-title';
import Button from '../shared/buttons/button.component';
import ImportDataComponent from '../shared/import-data/import-data.component';
import EVoucherWithSO from '../voucher/voucher-created-with-SO/voucher-created-with-SO.component';
import {
  getVoucherList,
  getVoucherName,
  getVoucherChannel,
  getVoucherStatus,
  getVoucherMatDesc,
  exportVoucherExternal,
  importVoucher,
  getVoucherPromotion,
} from '../../actions/voucher-action';

import { reStructureFields } from '../voucher/voucher-list-util';
import {
  fields,
  options,
  columnsDefault,
  action,
  importHeaders,
  exportFields,
} from './voucher-list.config';
import { getDataCompanyCode } from '../../actions/branch-bom-action';
import { openDialog } from '../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../util/constant';
import { Message } from '../../constants/messages';
import { formatComboBox, formatDropdownList } from '../../util/format-util';
import { dateFormat } from '../../constants/constants';
import { formatDateString } from '../../util/date-util';

// TODO: waiting API call get level and category
class VoucherList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenMenu: false,
      isOpenExportDialog: false,
      isOpenEdit: false,
      voucherSearchFields: fields(),
      voucherList: {},
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: null,
      rowSelected: [],
      dataImport: [],
      dataExport: [],
      exportFieldData: [],
      rowData: {},
      typeExport: true,
      emailExport: '',
      error: {},
    };
    this.isMounting = true;
    this.ref = createRef();
  }

  componentDidMount = () => {
    const { currentPage, pageSize, typeExport } = this.state;
    const param = {
      currentPage,
      maxResult: pageSize,
      // TODO: waiting API fixed
      // countFlag: 1,
      // deleteFlag: 0,
    };
    this.loadDataFieldSearch();
    this.loadDataVoucherList(param);
    if (this.isMounting) {
      this.setState({
        exportFieldData: exportFields(typeExport),
      });
    }
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  loadDataVoucherList = paramSearch => {
    const { currentPage, pageSize } = this.state;
    getVoucherList(paramSearch).then(res => {
      const voucherData = {
        totalItems: res?.totalRecord,
        currentPage,
        pageSize,
        data: res.data,
      };
      if (this.isMounting) {
        this.setState({
          voucherList: voucherData,
        });
      }
    });
  };

  /**
   * Load option in combo box on server
   */
  loadDataFieldSearch = () => {
    Promise.all([
      getVoucherChannel(),
      getVoucherStatus(),
      getDataCompanyCode(),
      getVoucherMatDesc(),
      getVoucherName(),
      getVoucherPromotion()
    ]).then(
      (res) => {
        const channel = formatComboBox(res[0].data);
        const status = formatDropdownList(res[1].data);
        const companyCode = formatDropdownList(res[2].data);
        const voucherMat = formatDropdownList(res[3].data);
        const voucherName = formatComboBox(res[4].data);
        const getVoucherPromotion = formatComboBox(res[5].data);
        const voucherSearchFields = fields(
          voucherName,
          channel,
          status,
          companyCode,
          voucherMat,
          getVoucherPromotion
        );

        if (this.isMounting) {
          this.setState({
            voucherSearchFields
          });
        };
      }
    );
  }

  onChangePage = (e, page) => {
    const { pageSize, searchFieldsParam } = this.state;
    const searchParam = {
      ...searchFieldsParam,
      currentPage: page,
      maxResult: pageSize,
    };

    this.setState({ currentPage: page }, () => {
      this.loadDataVoucherList(searchParam);
    });
  };

  onChangeRowsPerPage = e => {
    const { searchFieldsParam } = this.state;
    const pageSize = e.target.value;
    const searchParam = {
      ...searchFieldsParam,
      currentPage: 1,
      maxResult: pageSize,
    };

    this.setState({ pageSize, currentPage: 1 }, () => {
      this.loadDataVoucherList(searchParam);
    });
  };

  onUpdated = () => {
    const { currentPage, pageSize, searchFieldsParam } = this.state;
    const searchParam = {
      ...searchFieldsParam,
      currentPage,
      maxResult: pageSize,
      // TODO: waiting API fixed
      // countFlag: 1,
      // deleteFlag: 0,
    };
    this.loadDataVoucherList(searchParam);
  };

  goToDetailPage = rowData => {
    const {searchFieldsParam} = this.state;
    this.props.history.push({
      pathname: `/voucher-management/voucher-list/detail/${rowData.voucherId}`,
      searchFieldsParam: searchFieldsParam,
    });
  };

  goToEditPage = rowData => {
    this.setState({
      isOpenEdit: true,
      rowData: rowData,
    });
  };

  // Show popup edit
  renderEditPopup = rowData => {
    const { isOpenEdit } = this.state;
    if (rowData?.voucherType === Voucher.e_Voucher && rowData.saleOrderNo) {
      return (
        <EVoucherWithSO
          isEditPage
          isOpenMenu={isOpenEdit}
          onClose={this.handleClosePopup}
          detailData={rowData}
          onUpdated={this.onUpdated}
        />
      );
    }
    return (
      <VoucherWithoutSO
        isOpenMenu={isOpenEdit}
        onClose={this.handleClosePopup}
        isEditPage
        detailData={rowData}
        onUpdated={this.onUpdated}
      />
    );
  };

  onSearch = param => {
    const { currentPage, pageSize } = this.state;
    const reStructureParam = reStructureFields(param);
    const searchParam = {
      ...reStructureParam,
      currentPage,
      maxResult: pageSize,
      // TODO: waiting API fixed
      // countFlag: 1,
      // deleteFlag: 0,
    };
    this.setState({ searchFieldsParam: reStructureParam });
    this.loadDataVoucherList(searchParam);
  };

  handleOpenPopup = isDialog => {
    this.setState({ isOpenMenu: isDialog });
  };

  handleClosePopup = () => {
    this.setState({
      isOpenMenu: false,
      isOpenExportDialog: false,
      isOpenEdit: false,
      error: {}
    });
  };

  //Import Export Data

  handleImportData = data => {
    this.setState({ dataImport: data });
  };

  replaceSpaceKeys(object) {
    Object.keys(object).forEach(function(key) {
      var newKey = key.replace(/\s+/g, '');
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
    return object;
  }

  filterDateImportData = date => {
    let dateParts;
    if (date.includes('.')) {
      dateParts = date.split('.');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    if (date.includes('/')) {
      dateParts = date.split('/');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    return date;
  };

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
    const formatData = dataImport.map(item => {
      const formatItem = this.replaceSpaceKeys(item);
      return {
        itemNo: item.itemNo,
        saleOrderNo: item.SaleOrderNo,
        voucherSerialNo: formatItem.VoucherSerialNo,
        status: formatItem.Status,
        validDateFrom: this.filterDateImportData(formatItem.ValidFrom),
        validDateTo: this.filterDateImportData(formatItem.ValidTo),
      };
    });

    const datImport = { voucherVOs: formatData };
    importVoucher(datImport).then(res => {
      if (!res.message) {
        openDialog({
          type: dialogConstant.type.INFO,
          title: Message.IMPORT_EXPORT.IMPORT_SUCCESSFUL,
          content: Message.IMPORT_EXPORT.IMPORT_SUCCESSFUL,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
      }
      else { 
        openDialog({
          type: dialogConstant.type.ERROR,
          title: Message.ERROR,
          content: res?.message.messages[0].messageContent,
          actions: [
            {
              name: 'OK',
              type: dialogConstant.button.FUNCTION,
              className: buttonConstant.type.PRIMARY,
            },
          ],
        });
      }
    });
  };

  exportData = () => {
    const { rowSelected, searchFieldsParam } = this.state;  
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
    }else { 
      const paramsExport = {
        voucherSCO:{
          voucherId: {
            in: rowSelected,
          },
          ...searchFieldsParam
        },
        typeInternal: 1,
      };
      const formattedData = [];
      exportVoucherExternal(paramsExport).then((res) => {
        if (!res.message) {
          res.data &&
            res.data.forEach((data) => {
              formattedData.push({
                voucherStatusName: data.voucherStatusName || '',
                voucherTypeName: data.voucherTypeName || '',
                voucherValue: data.voucherValue || '',
                voucherName: data.voucherName,
                voucherMatDesc: data.voucherValueTypeName || '',
                refNumber: data.refNumber || '',
                snPrefix: data.snPrefix || '',
                bookletCode: data.bookletCode || '',
                serialNo: data.serialNo,
                ValidFrom:  formatDateString(data.validFrom, dateFormat.mainDate, true),
                validTo:  formatDateString(data.validTo, dateFormat.mainDate, true),
                activeDate: data.activeDate || '',
                usedDate: data.usedDate || '',
                branchSold: data.branchSold || '',
                branchUsage: data.branchUsage || '',
                marketPlace: data.marketPlace || '',
                soldToPlace: data.soldToPlace || '',
                campaignName: data.campaignName || '',
                saleOrderNo: data.saleOrderNo || '',
                channel: data.channel || '',
                posId: data.posId || '',
                qcNo: data.qcNo || '',
                profitCenter: data.profitCenter || '',
                idRoundNo: data.idRoundNo || '',
                deferedDisc: data.deferedDisc || '',
                companyCode: data.companyName  || ''
              });
            });
        } else if (res.message) {
          openDialog({
            title: Message.INFORMATION,
            content: res?.message.messages[0].messageContent,
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
      });
    }
  };

  handleRowSelect = checkedRows => {
    const dataListExport = checkedRows.map(row => row.voucherId);
    this.setState({
      rowSelected: dataListExport,
    });
  };

  exportDataExternal = emailExport => {
    const { rowSelected } = this.state;
    const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let messageErr = '';
    const paramsExport = {
      voucherSCO:{
        voucherId: {
          in: rowSelected,
        }
      },
      typeInternal: 0,
      email: emailExport,
    };

    //Validation mail export
    if (emailExport.length > 1 && emailExport.match(mailformat)) {
      messageErr = '';
    } else if (emailExport.length) {
      messageErr = Message.IMPORT_EXPORT.VALIDATE_EMAIL;
    } else {
      messageErr = `Email ${Message.common.comMSG001}`;
    }

    this.setState({
      error: {
        isError: messageErr.length > 1 ? true : false,
        message: messageErr,
      },
    });
    if (messageErr.length < 1) {
      exportVoucherExternal(paramsExport).then(res => {
        if (!res.message) {
          openDialog({
            title: Message.CONFIRM,
            content: Message.VOUCHER.EXPORT,
            actions: [
              {
                name: this.props.t(Action.ok),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  this.handleClosePopup();
                },
              },
            ],
          });
        }
        else{
          openDialog({
            title: Message.ERROR,
            content: res.message.messages[0].messageContent,
            actions: [
              {
                name: this.props.t(Action.ok),
                type: dialogConstant.button.FUNCTION,
                className: buttonConstant.type.PRIMARY,
                action: () => {
                  this.handleClosePopup();
                },
              },
            ],
          });
        }
      });
    }
  };

  // Show Dialog Export
  renderDialogPopupExport = () => {
    const {
      dataExport,
      isOpenExportDialog,
      exportFieldData,
      typeExport,
      error,
    } = this.state;
    return dataExport.length > 0 ? (
      <VoucherExport
        error={error}
        isOpenExportDialog={isOpenExportDialog}
        exportFieldData={exportFieldData}
        typeExport={typeExport}
        dataExport={dataExport}
        handleClosePopup={this.handleClosePopup}
        exportDataExternal={this.exportDataExternal}
      />
    ) : (
      openDialog({
        type: dialogConstant.type.ERROR,
        title: Message.ERROR,
        content: Message.VOUCHER.NO_DATA_VOUCHER_EXPORT,
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
      })
    );
  };

  render() {
    const { t, classes, history } = this.props;
    const {
      voucherList,
      isOpenMenu,
      isOpenExportDialog,
      voucherSearchFields,
      isOpenEdit,
      rowData,
    } = this.state;
    const pageHeader = {
      pageTitle: 'Voucher List',
      showButton: false,
      customContent: (
        <VoucherButton
          history={history}
          handleOpenPopup={this.handleOpenPopup}
        />
      ),
    };

    return (
      <>
        {this.isMounting && (
          <div>
            <PageHeader {...pageHeader} />

            <div className={classes.searchCover}>
              <SearchForm
                fieldArray={voucherSearchFields}
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
                  iconImg={ExportIcon}
                  title={t('Export')}
                />
              </span>
            </Box>

            <TableGrid
              defaultStyle={true}
              dataTable={voucherList}
              options={options}
              columns={columnsDefault}
              actions={action(this.goToDetailPage, this.goToEditPage)}
              className="even-odd-columns"
              onChangePage={(e, page) => this.onChangePage(e, page)}
              onChangeRowsPerPage={e => this.onChangeRowsPerPage(e)}
              handleRowSelect={this.handleRowSelect}
            />
            <div>
              {isOpenMenu && (
                <VoucherWithoutSO
                  isOpenMenu={isOpenMenu}
                  onClose={this.handleClosePopup}
                  onUpdated={this.onUpdated}
                />
              )}
              {isOpenExportDialog && this.renderDialogPopupExport()}
              {isOpenEdit && this.renderEditPopup(rowData)}
            </div>
          </div>
        )}
      </>
    );
  }
}

VoucherList.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
  match: PropTypes.any,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default withTranslation()(withStyles(mainStyle)(VoucherList));
