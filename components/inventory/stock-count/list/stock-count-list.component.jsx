import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';

import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import PageHeader from '../../../shared/page-header/page-header.component';

import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../../shared/search-form/search-form.common';

import {
  getStockCountList,
  deleteStockCount,
  getStockCountType,
  getAllStatus,
} from '../../../../actions/stock-count-action';
import {
  getAllBranchCombo
} from '../../../../actions/branch.action';

import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';

import { Message } from '../../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../../util/constant';

import {
  PaginationConfiguration,
  StockCount,
  userBranchInfo
} from '../../../../constants/constants';
import { getUserInfo } from '../../../../actions/auth-action';

import { columns, options, fields, actions } from './stock-count-list.config';
import useStyle from './stock-count-list.style';
import { formatComboBox, formatDropdownList } from '../../../../util/format-util';

class StockCountList extends React.Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    this.loggedUser = getUserInfo();
    this.loggedUser.branch = userBranchInfo.defaultBranch;

    const fieldArray = fields().map(el => {
      const temp = el;
      if (temp.fieldName === StockCount.searchFieldName.branch) {
        temp.customOnChange = this.onBranchChange;
      }
      temp.data = [];
      return temp;
    });
    this.state = {
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      stockCountList: '',
      fieldArray,
    };
  }

  componentDidMount = () => {
    this.getStockCount();
    Promise.all([
      this.loadAllBranch(),
      this.loadStockCountType(),
      this.loadAllStatus(),
    ]).then(values => {
      if (!this.isViewMounted) {
        return;
      }
      const defaultVal = {
        value: this.loggedUser.branch,
        isArray: true,
      };

      this.updateMultipleFieldArrayState([
        {
          fieldName: StockCount.searchFieldName.branch,
          property: 'data',
          updatedData: formatDropdownList(values[0].data),
          defaultValue: defaultVal,
          // keep defaultValue as initial value when reseting form
          isKeptInitialValue: true
        },
        {
          fieldName: StockCount.searchFieldName.stockCountType,
          property: 'data',
          updatedData: formatDropdownList(values[1].data),
        },
        {
          fieldName: StockCount.searchFieldName.status,
          property: 'data',
          updatedData: formatComboBox(values[2].data),
        }
      ]);
    });
  };

  getStockCount = inputParams => {
    if (!inputParams) {
      inputParams = {
        deleteFlag: 0,
        //Commit test code
        branchCode: { in: [this.loggedUser.branch] },
        maxResult: this.state.pageSize,
        pageSize: this.state.pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: this.state.currentPage,
      };
      this.setState({ searchFieldsParam: inputParams });
    }
    // Get all Stock Count
    getStockCountList(inputParams).then(res => {
      const data = {
        totalItems: res.totalRecord,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        pageOfItems: res.data,
        data: res.data,
      };

      this.setState({ stockCountList: data });
    });
  };

  loadAllBranch = (param) => {
    return new Promise(resolve =>
      getAllBranchCombo(param).then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );
  };

  loadStockCountType = (param) => {
    return new Promise(resolve =>
      getStockCountType(param).then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );
  };

  loadAllStatus = (param) => {
    return new Promise(resolve =>
      getAllStatus(param).then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );
  };

  componentWillUnmount() {
    this.isViewMounted = false;
  }

  // Update list option data for combobox fields
  updateFieldArray = (
    fieldArray,
    fieldName,
    updatedPropertyName,
    updatedData,
    defaultValue = null,
    isKeptInitialValue = false
  ) => {
    const updateFieldArray = fieldArray;
    const fieldIndex = fieldArray.findIndex((el) => el.fieldName === fieldName);
    const field = fieldIndex !== -1 && fieldArray[fieldIndex];

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

        isKeptInitialValue && (updateFieldArray[fieldIndex].resetValue = (defaultValue.isArray && [defaultVal]) || defaultVal);
      }
    }
    return updateFieldArray;
  };

  updateFieldArrayState = (detailData) => {
    const updatedFieldArray = this.updateFieldArray(
      this.state.fieldArray,
      detailData.fieldName,
      detailData.property,
      detailData.updatedData,
      detailData.defaultValue,
      detailData.isKeptInitialValue
    );
    return this.setState({ fieldArray: updatedFieldArray });
  };

  updateMultipleFieldArrayState = (detailsData) => {
    let updatedFieldArray = this.state.fieldArray;
    detailsData.forEach((detail) => {
      updatedFieldArray = this.updateFieldArray(
        updatedFieldArray,
        detail.fieldName,
        detail.property,
        detail.updatedData,
        detail.defaultValue,
        detail.isKeptInitialValue
      );
    });
    this.setState({ fieldArray: updatedFieldArray });
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

    params = mapPropertyForRequestParams(params, fieldArr, StockCount.searchFieldName.branch);
    params = mapPropertyForRequestParams(params, fieldArr, StockCount.searchFieldName.status);
    fieldArr.stockCountType && (params.stockCountType = fieldArr.stockCountType);
    params = setPropertyForRequestParams(params, fieldArr, StockCount.searchFieldName.requestNo);
    params = setPropertyForRequestParams(params, fieldArr, StockCount.searchFieldName.createdBy);
    params = setPropertyForRequestParams(params, fieldArr, StockCount.searchFieldName.approvedBy);
    params = setPropertyForRequestParams(params, fieldArr, StockCount.searchFieldName.materialDocumentNo);
    params = setDateRangeRequestParams(params, fieldArr, StockCount.searchFieldName.createdDate);

    return params;
  };

  /**
   * Handle when clicking search btn on searchform
   * @param {Object} searchFields
   */
  onSearch = (searchFields) => {
    let inputParams = this.getSearchParams(searchFields);
    inputParams = {
      ...inputParams,
      currentPage: 1,
    };
    this.setState({
      searchFieldsParam: inputParams,
      currentPage: 1,
    });
    this.getStockCount(inputParams);
  };

  /**
   * Reload data on grid when changing rows per page
   * @param {Object} e
   */
  onChangeRowsPerPage = (e) => {
    const pageSize = e.target.value;
    const currentPage = 1;
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      pageSize,
      currentPage: 1,
      maxResult: pageSize,
      deleteFlag: 0,
    };
    this.setState({ pageSize, currentPage, searchFieldsParam }, () => {
      this.getStockCount(searchFieldsParam);
    });
  };

  goToDetailPage = item => {
    // Go to detail page base on id
    this.props.history.push(`/end-of-day/stock-count/detail/${item.stockCountId}`);
  };

  goToEditPage = item => {
    // Go to edit page base on id
    this.props.history.push(`/end-of-day/stock-count/edit/${item.stockCountId}`);
  };

  showMessageConfirmation = item => {
    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      content: `Are you sure to delete this Stock Count Request: ${item.requestNo}?`,
      actions: [
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: this.props.t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            const inputParams = {
              roleId: item.roleId,
            };
            deleteStockCount(inputParams).then(() => {});
          },
        },
      ],
    });
  };

  /**
   * Show delete message confirmation
   * @param {Object} data
   */
  showDeleteMessageConfirmation = (data) => {
    openDialog({
      title: Message.CONFIRM,
      type: dialogConstant.type.CONFIRM,
      content: Message.DELETE_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `Stock Count Request: <${data.requestNo}>`
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
            deleteStockCount({
              stockCountId: data.stockCountId
            }).then(() => {
              this.getStockCount(this.state.searchFieldsParam);
            })
              .catch(() => {
                openDialog({
                  title: Message.warning,
                  content: Message.DELETE_UNSUCCESSFULLY,
                });
              });
          },
        },
      ],
    });
  };

  /**
   * Reload data on grid when changing page
   */
  onChangePage = (e, page) => {
    const searchFieldsParam = {
      ...this.state.searchFieldsParam,
      currentPage: page,
      deleteFlag: 0,
    };
    this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.getStockCount(searchFieldsParam);
    });
  };

  goToAddStockCount = () => {
    const { history } = this.props;
    history.push('/end-of-day/stock-count/create');
  };

  render() {
    const { fieldArray, stockCountList } = this.state;
    const { classes } = this.props;
    const pageHeader = {
      pageTitle: 'Stock Count List',
      showButton: true,
      buttonTitle: 'Create Stock Count',
      buttonCustomClass: classes.btnAdd,
      buttonAction: () => this.goToAddStockCount(),
    };
    return (
      <div>
        <PageHeader {...pageHeader} />
        <div className={classes.searchSCCover}>
          <SearchForm
            fieldArray={fieldArray}
            onSearch={this.onSearch}
            classCustom="user-search-bar"
          />
        </div>
        <div className={classes.stockCountList}>
          {stockCountList && (
            <TableGrid
              defaultStyle={true}
              columns={columns}
              dataTable={stockCountList}
              options={options}
              actions={actions(
                this.showDeleteMessageConfirmation,
                this.goToEditPage,
                this.goToDetailPage,
              )}
              onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
              onChangePage={(e, page) => this.onChangePage(e, page)}
              className="even-odd-columns"
            />
          )}
        </div>
      </div>
    );
  }
}

StockCountList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyle)(StockCountList));
