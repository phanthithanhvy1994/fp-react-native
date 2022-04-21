import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import moment from 'moment';

import PropTypes from 'prop-types';
import PageHeader from '../../../shared/page-header/page-header.component';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';

import {
  getGoodsReceiptList,
  getBranchByUser,
  getGRType,
  getGRStatus,
  getGRVendor,
} from '../../../../actions/goods-receipt-action';

import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../../shared/search-form/search-form.common';

import {
  PaginationConfiguration,
  GRConstant,
  dateFormat,
  userBranchInfo,
} from '../../../../constants/constants';

import { columns, columnsForSearchPopup, options, fields, actions } from './goods-receipt-list.config';
import useStyle from './goods-receipt-list.style';
import {
  formatDropdownList,
  formatComboBox,
} from '../../../../util/format-util';

class GoodsReceiptList extends React.Component {
  constructor(props) {
    super(props);
    const fieldArray = fields(props.isSearchPopup).map((el) => {
      const temp = el;
      if (temp.fieldName === GRConstant.searchFieldName.branch) {
        temp.customOnChange = this.onBranchChange;
      }
      temp.data = [];
      return temp;
    });
    this.state = {
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      goodsReceiptList: '',
      fieldArray,
      searchFieldsParam: null,
      defaultStartDate: moment()
        .subtract(1, 'months')
        .format(dateFormat.yyyymmddStartDay),
      defaultEndDate: moment().format(dateFormat.yyyymmddEndDay),
    };
    this.loggedUser = JSON.parse(localStorage.getItem('userInfo'));
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    this.isMounting = true;
  }

  componentDidMount = () => {
    const { isSearchPopup } = this.props;
    let defaultSubmittedDate = {
      ge: this.state.defaultStartDate,
      le: this.state.defaultEndDate,
    };

    if (isSearchPopup) {
      defaultSubmittedDate = {};
    }

    this.loadBranchByUser(this.loggedUser.userId, true, isSearchPopup);
    this.loadGRType();
    // set default Status and disabled field if isSearchPopup
    this.loadGRStatus(isSearchPopup);
    this.loadGRVendor();
    this.getGoodsReceipt();

    this.updateFieldArrayState(
      GRConstant.searchFieldName.submittedDate,
      'value',
      defaultSubmittedDate
    );
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  getGoodsReceipt = (body) => {
    // Get all Goods Receipt
    const { isSearchPopup } = this.props;
    let params = body;
    if (!params) {
      params = {
        deleteFlag: 0,
        branch: { in: [this.loggedUser.branch] },
        sapExportedStatus: isSearchPopup && {
          in: [+GRConstant.searchPopup.defaultStatusValue],
        },
        goodReceiptType: isSearchPopup && {
          in: [GRConstant.searchPopup.defaultGoodReceiptType],
        },
        maxResult: this.state.pageSize,
        pageSize: this.state.pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: this.state.currentPage,
      };
      if (!isSearchPopup) {
        // Default load data which are created in about 1 month
        params = setDateRangeRequestParams(
          params,
          {
            [GRConstant.searchFieldName.submittedDate]: {
              ge: this.state.defaultStartDate,
              le: this.state.defaultEndDate,
            },
          },
          GRConstant.searchFieldName.submittedDate
        );
      }

      this.setState({ searchFieldsParam: params });
    } else {
      if (isSearchPopup) {
        params.branch = { in: [this.loggedUser.branch] };
        params.sapExportedStatus = {
          in: [+GRConstant.searchPopup.defaultStatusValue],
        };
        params.goodReceiptType = {
          in: [GRConstant.searchPopup.defaultGoodReceiptType],
        };
      }
    }
    getGoodsReceiptList(params).then((res) => {
      const data = {
        totalItems: res.totalRecord || 0,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        data: res.data || [],
      };

      this.setState({ goodsReceiptList: data });
    });
  };

  loadBranchByUser = (userId, isSetDefaultBranch = false, isPopup = false) => {
    getBranchByUser(userId).then((res) => {
      let defaultVal =
        (isSetDefaultBranch && {
          display: this.loggedUser.userName,
          value: this.loggedUser.branch,
          isArray: true,
        }) ||
        null;

      if (isPopup) {
        defaultVal = null;
      }

      this.updateFieldArrayState(
        GRConstant.searchFieldName.branch,
        'data',
        formatDropdownList(res.data),
        defaultVal,
        true
      );
    });
  };

  loadGRType = (param) => {
    getGRType(param).then((res) =>
      this.updateFieldArrayState(
        GRConstant.searchFieldName.type,
        'data',
        formatComboBox(res.data)
      )
    );
  };

  loadGRStatus = (isSetDefaultAndDisabledStatus = false) => {
    getGRStatus().then((res) => {
      const defaultVal =
        (isSetDefaultAndDisabledStatus && {
          display: GRConstant.searchPopup.defaultStatusDisplay,
          value: GRConstant.searchPopup.defaultStatusValue,
          isArray: true,
        }) ||
        null;
      this.updateFieldArrayState(
        GRConstant.status,
        'data',
        formatComboBox(res.data),
        defaultVal,
        true,
      );

      this.updateFieldArrayState(
        GRConstant.status,
        'disabled',
        isSetDefaultAndDisabledStatus
      );
    });
  };

  loadGRVendor = (param) => {
    getGRVendor(param).then((res) =>
      this.updateFieldArrayState(
        GRConstant.searchFieldName.vendor,
        'data',
        formatDropdownList(res.data)
      )
    );
  };

  // Update list option data for combobox fields
  updateFieldArrayState = (
    fieldName,
    updatedPropertyName,
    updatedData,
    defaultValue = null,
    resetValue = false
  ) => {
    const updateFieldArray = this.state.fieldArray;
    const fieldIndex = this.state.fieldArray.findIndex(
      (el) => el.fieldName === fieldName
    );
    const field = fieldIndex !== -1 && this.state.fieldArray[fieldIndex];

    if (field) {
      field[updatedPropertyName] = updatedData;
      updateFieldArray[fieldIndex] = field;
      // Set default value if any
      if (defaultValue) {
        const defaultVal = updatedData.find(
          (el) => el.value === defaultValue.value
        );
        updateFieldArray[fieldIndex].value =
          (defaultValue.isArray && [defaultVal]) || defaultVal;
        resetValue &&
          (updateFieldArray[fieldIndex].resetValue =
            (defaultValue.isArray && [defaultVal]) || defaultVal);
      }
      this.setState({ fieldArray: [...updateFieldArray] });
    }
  };

  onSearch = (searchFields) => {
    // Get data input search area
    const inputParams = this.getSearchParams(searchFields);
    this.setState({ searchFieldsParam: inputParams });
    this.getGoodsReceipt(inputParams);
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
    };
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.branch
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.goodReceiptNo
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.refNo
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.type
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.createdBy
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.submittedDate
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.status
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.deliveryNote
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.vendor
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.materialDescription
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.batchNo
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GRConstant.searchFieldName.materialDocument
    );
    return params;
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
      this.getGoodsReceipt(searchFieldsParam);
    });
  };
  onChangePage = (e, page) => {
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      currentPage: page,
    };
    this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.getGoodsReceipt(searchFieldsParam);
    });
  };
  goToDetailPage = (item) => {
    // Go to detail page base on id
    this.props.history.push(`goods-receipt/detail/${item.goodsReceiptId}`);
  };

  getCollapsedState = (collapsedState) => {
    this.setState({ collapsedSearchArea: collapsedState });
  };

  render() {
    const { fieldArray, goodsReceiptList, collapsedSearchArea } = this.state;
    const { t, classes, isSearchPopup, handleRowClick } = this.props;
    const pageHeader = {
      pageTitle: t('Goods Receipt List'),
      showButton: false,
    };

    return (
      <div
        className={
          isSearchPopup
            ? `${classes.searchGoodReceiptPopup} ${
                collapsedSearchArea ? 'collapsed-search-area' : ''
              }`
            : ''
        }
      >
        {this.isMounting && (
          <>
            {!isSearchPopup && <PageHeader {...pageHeader} />}

            <div
              className={
                isSearchPopup ? classes.searchCoverPopup : classes.searchCover
              }
            >
              <SearchForm
                fieldArray={fieldArray}
                onSearch={this.onSearch}
                getCollapsedState={this.getCollapsedState}
                classCustom="user-search-bar"
              ></SearchForm>
            </div>
            {goodsReceiptList && (
              <TableGrid
                columns={isSearchPopup ? columnsForSearchPopup : columns}
                dataTable={goodsReceiptList}
                options={options}
                defaultStyle={true}
                // Will hide actions columns if this is a popup
                actions={isSearchPopup ? [] : actions(this.goToDetailPage)}
                onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
                onChangePage={(e, page) => this.onChangePage(e, page)}
                handleRowClick={handleRowClick}
                className="even-odd-columns"
              />
            )}
          </>
        )}
      </div>
    );
  }
}

GoodsReceiptList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isSearchPopup: PropTypes.bool,
  handleRowClick: PropTypes.func,
};

export default withTranslation()(withStyles(useStyle)(GoodsReceiptList));
