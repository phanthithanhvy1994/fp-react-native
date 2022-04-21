import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import PageHeader from '../../../shared/page-header/page-header.component';
import moment from 'moment';

import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../../shared/search-form/search-form.common';

import {
  deleteScrapStock,
  getScrapStockList,
  getBranchByUser,
  getScrapStockStatus,
} from '../../../../actions/scrap-stock-action';

import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';

import { Message } from '../../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../../util/constant';

import {
  PaginationConfiguration,
  ScrapStockConstant,
  dateFormat,
  userBranchInfo,
} from '../../../../constants/constants';

import { columns, options, fields, actions } from './scrap-stock-list.config';
import useStyle from './scrap-stock-list.style';
import {
  formatDropdownList,
  formatComboBox,
} from '../../../../util/format-util';

class ScrapStockList extends React.Component {
  constructor(props) {
    super(props);
    const fieldArray = fields.map((el) => {
      const temp = el;
      if (temp.fieldName === ScrapStockConstant.branch) {
        temp.customOnChange = this.onBranchChange;
      }
      temp.data = [];
      return temp;
    });
    this.state = {
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      scrapStockList: '',
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
    this.loadBranchByUser(this.loggedUser.userId, true);
    this.loadSSStatus();
    this.loadScrapStockList();
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  loadScrapStockList = (body) => {
    let params = body;
    if (!params) {
      params = {
        deleteFlag: 0,
        branchCode: { in: [this.loggedUser.branch] },
        maxResult: this.state.pageSize,
        pageSize: this.state.pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: this.state.currentPage,
      };
      // Default load data which are created in about 1 month
      params = setDateRangeRequestParams(
        params,
        {
          [ScrapStockConstant.searchFieldName.createDate]: {
            ge: this.state.defaultStartDate,
            le: this.state.defaultEndDate,
          },
        },
        ScrapStockConstant.searchFieldName.createDate
      );
      this.setState({ searchFieldsParam: params });
    }

    // Get all Scrap Stock
    getScrapStockList(params).then((res) => {
      const data = {
        totalItems: res.totalRecord || 0,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        maxResult: this.state.pageSize,
        data: res.data || [],
      };
      this.setState({ scrapStockList: data });
    });
  };

  loadBranchByUser = (userId, isSetDefaultBranch = false) => {
    getBranchByUser(userId).then((res) => {
      const defaultVal =
        (isSetDefaultBranch && {
          display: this.loggedUser.userName,
          value: this.loggedUser.branch,
          isArray: true,
        }) ||
        null;
      this.updateFieldArrayState(
        ScrapStockConstant.searchFieldName.branch,
        'data',
        formatDropdownList(res.data),
        defaultVal,
        true
      );
    });
  };

  loadSSStatus = () => {
    getScrapStockStatus().then((res) => {
      this.updateFieldArrayState(
        ScrapStockConstant.status,
        'data',
        formatComboBox(res.data)
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
      this.setState({ fieldArray: updateFieldArray });
    }
  };

  /**
   * Handle when clicking search btn on searchform
   * @param {Object} searchFields
   */
  onSearch = (searchFields) => {
    // Get data input search area
    const inputParams = this.getSearchParams(searchFields);
    this.setState({ searchFieldsParam: inputParams });
    this.loadScrapStockList(inputParams);
  };

  /**
   * Set request params and only push the property which has value into request params
   * @param {Object} fieldArr search fields on search form
   */
  getSearchParams = (fieldArr) => {
    let params = {
      currentPage: this.state.currentPage,
      maxResult: this.state.pageSize,
      countFlag: PaginationConfiguration.countFlag,
    };
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.branch
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.scrapStockNo
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.createDate
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.createdBy
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.status
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.materialDescription
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      ScrapStockConstant.searchFieldName.materialDocument
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
      this.loadScrapStockList(searchFieldsParam);
    });
  };
  onChangePage = (e, page) => {
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      currentPage: page,
    };
    this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.loadScrapStockList(searchFieldsParam);
    });
  };

  goToDetailPage = (item) => {
    // Go to detail page base on id
    this.props.history.push(`scrap-stock/detail/${item.transferRequestId}`);
  };

  confirmDeleteItem = (item) => {
    openDialog({
      title: Message.CONFIRM,
      type: dialogConstant.type.CONFIRM,
      content: Message.DELETE_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `Scrap Stock No.${item.scrapStockNo}`
      ),
      actions: [
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: this.props.t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            deleteScrapStock({ transferRequestId: item.transferRequestId })
              .then(() => {
                this.loadScrapStockList();
              })
              .catch(() => {
                openDialog({
                  title: Message.warning,
                  content: Message.DELETE_UNSUCCESSFULLY,
                  actions: [
                    {
                      name: this.props.t('Ok'),
                      type: dialogConstant.button.FUNCTION,
                      className: buttonConstant.type.PRIMARY,
                    },
                  ],
                });
              });
          },
        },
      ],
    });
  };

  goToEditPage = (item) => {
    // Go to edit page base on id
    this.props.history.push(`scrap-stock/edit/${item.transferRequestId}`);
  };

  /**
   * Handle for disable action button with condition
   * @param {Object} rowData
   * @param {String} actionName
   */
  handleDisableActionButton = (rowData, actionName) => {
    const { statusName } = rowData;
    let disabled = false;

    if (actionName === 'edit') {
      disabled = !(
        statusName === ScrapStockConstant.draft ||
        statusName === ScrapStockConstant.rejected
      );
    } else if (actionName === 'delete') {
      disabled = statusName !== ScrapStockConstant.draft;
    }

    return disabled;
  };

  render() {
    const { fieldArray, scrapStockList } = this.state;
    const { classes, history, isSearchPopup, handleRowClick } = this.props;
    const pageHeader = {
      pageTitle: 'Scrap Stock List',
      showButton: true,
      buttonTitle: 'Create Scrap Stock',
      buttonCustomClass: classes.btnAdd,
      buttonAction: () => history.push('scrap-stock/create'),
    };
    return (
      <div className={classes.scrapStock}>
        {this.isMounting && (
          <>
            {!isSearchPopup && <PageHeader {...pageHeader} />}
            <div className={classes.searchCover}>
              <SearchForm
                fieldArray={fieldArray}
                onSearch={this.onSearch}
                classCustom="user-search-bar"
                rowSize={3}
              ></SearchForm>
            </div>
            <div>
              {scrapStockList && (
                <TableGrid
                  defaultStyle={true}
                  columns={columns}
                  dataTable={scrapStockList}
                  options={options}
                  actions={actions(
                    this.confirmDeleteItem,
                    this.goToEditPage,
                    this.goToDetailPage,
                    this.handleDisableActionButton
                  )}
                  handleRowClick={handleRowClick}
                  onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
                  onChangePage={(e, page) => this.onChangePage(e, page)}
                  className="even-odd-columns"
                />
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

ScrapStockList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
  isSearchPopup: PropTypes.bool,
  handleRowClick: PropTypes.func,
};

export default withTranslation()(withStyles(useStyle)(ScrapStockList));
