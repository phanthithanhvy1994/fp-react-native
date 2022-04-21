import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import moment from 'moment';

import PropTypes from 'prop-types';
import PageHeader from '../../../shared/page-header/page-header.component';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';

import {
  getAssetReceiptList,
  getBranchByUser,
  getGRType,
  getARStatus,
  getGRVendor,
} from '../../../../actions/asset-receipt-action';

import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../../shared/search-form/search-form.common';

import {
  PaginationConfiguration,
  dateFormat,
  userBranchInfo,
  AssetReceiptConstant,
} from '../../../../constants/constants';

import { columns, columnsForSearchPopup, options, fields, actions } from './asset-receipt-list.config';
import useStyle from './asset-receipt-list.style';
import {
  formatDropdownList,
  formatComboBox,
} from '../../../../util/format-util';

class AssetReceiptList extends React.Component {
  constructor(props) {
    super(props);
    const fieldArray = fields(props.isSearchPopup).map((el) => {
      const temp = el;
      if (temp.fieldName === AssetReceiptConstant.searchFieldName.branch) {
        temp.customOnChange = this.onBranchChange;
      }
      temp.data = [];
      return temp;
    });
    this.state = {
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      assetReceiptList: '',
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
    // this.loadGRType();
    // set default Status and disabled field if isSearchPopup
    this.loadARStatus();
    // this.loadGRVendor();
    this.getGoodsReceipt();

    // this.updateFieldArrayState(
    //   AssetReceiptConstant.searchFieldName.submittedDate,
    //   'value',
    //   defaultSubmittedDate
    // );
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  /**
   * getGoodsReceipt
   * @param {*} body 
   */
  getGoodsReceipt = (body) => {
    // Get all Goods Receipt
    const { isSearchPopup } = this.props;
    let params = body;
    if (!params) {
      params = {
        deleteFlag: 0,
        branch: { in: [this.loggedUser.branch] },
        statusName: isSearchPopup && {
          in: [+AssetReceiptConstant.searchPopup.defaultStatusValue],
        },
        goodReceiptType: isSearchPopup && {
          in: [AssetReceiptConstant.searchPopup.defaultGoodReceiptType],
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
            [AssetReceiptConstant.searchFieldName.createdDate]: {
              ge: this.state.defaultStartDate,
              le: this.state.defaultEndDate,
            },
          },
          AssetReceiptConstant.searchFieldName.createdDate
        );
      }

      this.setState({ searchFieldsParam: params });
    }

    /**
     * Get Asset Receipt list
     */
    getAssetReceiptList(params).then((res) => {
      const data = {
        totalItems: res.totalRecord || 0,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        data: res.data || [],
      };

      this.setState({ assetReceiptList: data });
    });
  };

  /**
   * Load data Branch By User
   * @param {*} userId 
   * @param {*} isSetDefaultBranch 
   * @param {*} isPopup 
   */
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
        AssetReceiptConstant.searchFieldName.branch,
        'data',
        formatDropdownList(res.data),
        defaultVal,
        true
      );
    });
  };

  /**
   * Load Asset Receipt Status
   */
  loadARStatus = () => {
    getARStatus().then((res) => {
      this.updateFieldArrayState(
        AssetReceiptConstant.status,
        'data',
        formatComboBox(res.data),
        // defaultVal,
        true,
      );
    });
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

  /**
   * Search event
   * @param {*} searchFields 
   */
  onSearch = (searchFields) => {
    // Get data input search area
    const inputParams = this.getSearchParams(searchFields);
    this.setState({
      searchFieldsParam: inputParams,
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: 1,
      maxResult: PaginationConfiguration.itemsPerPage,
    });
    this.getGoodsReceipt(inputParams);
  };

  /**
   * Set request params and only push the property which has value into request params
   * @param {Object} fieldArr search fields on search form
   */
  getSearchParams = (fieldArr) => {
    let params = {
      currentPage: 1,
      pageSize: this.state.pageSize,
      maxResult: this.state.pageSize,
      deleteFlag: 0,
      countFlag: PaginationConfiguration.countFlag,
    };
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.branch
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.assetReceiptNo
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.assetTransferNo
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.branchCodeFrom
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.createdBy
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.createdDate
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.submittedDate
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.statusType
    );

    params = setPropertyForRequestParams(
      params,
      fieldArr,
      AssetReceiptConstant.searchFieldName.fixzyNo
    );

    return params;
  };

  /**
   * Change Rows Per Page Event
   * @param {*} e 
   */
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

  /**
   * Change page event
   * @param {*} e 
   * @param {*} page 
   */
  onChangePage = (e, page) => {
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      currentPage: page,
    };
    this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.getGoodsReceipt(searchFieldsParam);
    });
  };

  /**
   * Go to page detail
   * @param {*} item 
   */
  goToDetailPage = (item) => {
    // Go to detail page base on id
    this.props.history.push(`asset-receiving/detail/${'1'}`);
  };

  getCollapsedState = (collapsedState) => {
    this.setState({ collapsedSearchArea: collapsedState });
  };

  render() {
    const { fieldArray, assetReceiptList, collapsedSearchArea } = this.state;
    const { t, classes, isSearchPopup, handleRowClick } = this.props;
    const pageHeader = {
      pageTitle: t('Asset Receipt List'),
      showButton: false,
    };

    return (
      <div
        className={
          isSearchPopup
            ? `${classes.searchGoodReceiptPopup} ${collapsedSearchArea ? 'collapsed-search-area' : ''
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
            {assetReceiptList && (
              <TableGrid
                columns={isSearchPopup ? columnsForSearchPopup : columns}
                dataTable={assetReceiptList}
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

AssetReceiptList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isSearchPopup: PropTypes.bool,
  handleRowClick: PropTypes.func,
};

export default withTranslation()(withStyles(useStyle)(AssetReceiptList));
