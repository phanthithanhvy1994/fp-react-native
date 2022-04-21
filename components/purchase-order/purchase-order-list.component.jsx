import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from './purchase-order-list.style';
import {
  PaginationConfiguration,
  OrderConstant,
  userBranchInfo,
} from '../../constants/constants';
import { openDialog } from '../../redux/message-dialog/message-dialog.actions';
import {
  getPurchaseOrderList,
  getBranchByUser,
  getVendorByBranch,
  getOrderType,
  getStatus,
  deletePurchaseOrder,
} from '../../actions/purchase-order-action';
import TableGrid from '../shared/table-grid/table-grid.component';
import {
  columns,
  options,
  fields,
  actions,
} from './purchase-order-list.config';
import SearchForm from '../shared/search-form/search-form.component';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../shared/search-form/search-form.common';
import searchTitleStyle from '../../style/core/search/search-title';
import { getUserInfo } from '../../actions/auth-action';
import { Message } from '../../constants/messages';
import { dialogConstant, buttonConstant } from '../../util/constant';
import PageHeader from '../shared/page-header/page-header.component';
import { formatDropdownList, formatComboBox } from '../../util/format-util';

class PurchaseOrderList extends Component {
  isViewMounted = true;

  constructor(props) {
    super(props);

    const fieldArray = fields.map((el) => {
      const temp = el;
      temp.data = [];
      return temp;
    });
    this.state = {
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      purchaseOrderList: {},
      fieldArray,
      searchFieldsParam: null,
    };
    this.loggedUser = getUserInfo();
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
  }

  componentDidMount() {
    this.loadPurchaseOrderList();
    const promiseList = [
      this.loadBranchByUser(
        this.loggedUser.userId,
        true /** set default branch */
      ),
      this.loadVendorByBranch(this.loggedUser.branch),
      this.loadOrderType(),
      this.loadStatus(),
    ];

    Promise.all(promiseList).then((values) => {
      if (!this.isViewMounted) {
        return;
      }
      const defaultVal =
        (values[0].isSetDefaultBranch && {
          value: this.loggedUser.branch,
          isArray: true,
        }) ||
        null;
      this.updateMultipleFieldArrayState([
        {
          fieldName: OrderConstant.searchFieldName.branch,
          property: 'data',
          updatedData: formatDropdownList(values[0].data),

          //Commit test code
          defaultValue: defaultVal,
        },
        {
          fieldName: OrderConstant.searchFieldName.vendor,
          property: 'data',
          updatedData: formatDropdownList(values[1].data),
        },
        {
          fieldName: OrderConstant.searchFieldName.orderType,
          property: 'data',
          updatedData: formatDropdownList(values[2].data),
        },
        {
          fieldName: OrderConstant.searchFieldName.status,
          property: 'data',
          updatedData: formatComboBox(values[3].data),
        },
      ]);
    });
  }

  componentWillUnmount() {
    this.isViewMounted = false;
  }

  /**
   * Show delete message confirmation
   * @param {Object} data
   */
  showDeleteMessageConfirmation = (data) => {
    const detailNo = data.sapResquestNumber;
    openDialog({
      title: Message.CONFIRM,
      type: dialogConstant.type.CONFIRM,
      content: Message.DELETE_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `PO${detailNo ? ` <PO NO. ${detailNo}>` : ''}`
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
            deletePurchaseOrder(data.id)
              .then(() => {
                this.loadPurchaseOrderList(this.state.searchFieldsParam);
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

  goToEditPage = (purchaseOrderId) => {
    this.props.history.push(
      `/procurement/purchase-order/edit/${purchaseOrderId}`
    );
  };

  goToDetailPage = (purchaseOrderId) => {
    this.props.history.push(
      `/procurement/purchase-order/detail/${purchaseOrderId}`
    );
  };

  loadVendorByBranch = (branch) =>
    new Promise((resolve) =>
      getVendorByBranch()
        .then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );
  // new Promise(resolve => getVendorByBranch(branch).then(res =>
  //   resolve(res)
  // ));

  loadBranchByUser = (userId, isSetDefaultBranch = false) =>
    new Promise((resolve) =>
      getBranchByUser(userId)
        .then((res) => {
          resolve({ ...res, isSetDefaultBranch });
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadOrderType = () =>
    new Promise((resolve) =>
      getOrderType()
        .then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadStatus = () =>
    new Promise((resolve) =>
      getStatus()
        .then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );

  // Update list option data for combobox fields
  updateFieldArray = (
    fieldArray,
    fieldName,
    updatedPropertyName,
    updatedData,
    defaultValue = null
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
      detailData.defaultValue
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
        detail.defaultValue
      );
    });
    this.setState({ fieldArray: updatedFieldArray });
  };

  /**
   * Load purchase order list. Default load purchase order
   * which belongs to the branch that current logged user belongs to
   * @param {Object} body
   */
  loadPurchaseOrderList = (body) => {
    let params = body;
    if (!params) {
      params = {
        deleteFlag: 0,
        //Commit test code
        branchCode: { in: [this.loggedUser.branch] },
        maxResult: this.state.pageSize,
        pageSize: this.state.pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: this.state.currentPage,
      };
      this.setState({ searchFieldsParam: params });
    }

    getPurchaseOrderList(params).then((res) => {
      const data = {
        totalItems: res.totalRecord || 0,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        data: res.data || [],
      };
      this.setState({ purchaseOrderList: data });
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
      this.loadPurchaseOrderList(searchFieldsParam);
    });
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
      this.loadPurchaseOrderList(searchFieldsParam);
    });
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
    this.loadPurchaseOrderList(inputParams);
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
      OrderConstant.searchFieldName.branch
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.orderType
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.vendor
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.status
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.sapResquestNumber
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.createdBy
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.requestedDate
    );
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.deliveryDate
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      OrderConstant.searchFieldName.materialDescription
    );

    return params;
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
      disabled =
        statusName !== OrderConstant.draft &&
        statusName !== OrderConstant.rejected;
    } else if (actionName === 'delete') {
      disabled = statusName !== OrderConstant.draft;
    }

    return disabled;
  };

  goToAddPO = () => {
    this.props.history.push('/procurement/purchase-order/create');
  };

  render() {
    const { classes } = this.props;
    const { purchaseOrderList, fieldArray } = this.state;
    const pageHeader = {
      pageTitle: 'Purchase Order List',
      showButton: true,
      buttonTitle: 'Create Purchase Order',
      buttonCustomClass: classes.btnAdd,
      buttonAction: () => this.goToAddPO(),
    };

    return (
      <div>
        <PageHeader {...pageHeader} />
        <div className={classes.searchPOCover}>
          <SearchForm
            fieldArray={fieldArray}
            onSearch={this.onSearch}
            classCustom="user-search-bar"
          />
        </div>
        <div className={classes.purchaseOrderList}>
          {purchaseOrderList && (
            <TableGrid
              defaultStyle={true}
              columns={columns}
              dataTable={purchaseOrderList}
              options={options}
              actions={actions(
                this.showDeleteMessageConfirmation,
                this.goToEditPage,
                this.goToDetailPage,
                this.handleDisableActionButton
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

PurchaseOrderList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default withTranslation()(withStyles(mainStyle)(PurchaseOrderList));
