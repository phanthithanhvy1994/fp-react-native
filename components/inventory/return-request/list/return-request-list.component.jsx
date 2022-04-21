import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import PageHeader from '../../../shared/page-header/page-header.component';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import { Message } from '../../../../constants/messages';
import { getUserInfo } from '../../../../actions/auth-action';
import { dialogConstant, buttonConstant } from '../../../../util/constant';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import moment from 'moment';

import searchTitleStyle from '../../../../style/core/search/search-title';

import {
  getReturnRequestList,
  getBranchByLoggedUser,
  deleteReturnRequest,
  getVendorByBranch,
  getReason,
  getOrderType,
  getStatus,
} from '../../../../actions/return-request-action';

import {
  PaginationConfiguration,
  ReturnRequestConstant,
  dateFormat,
  userBranchInfo,
} from '../../../../constants/constants';

import {
  columns,
  options,
  fields,
  validation,
  actions,
} from './return-request-list.config';
import useStyles from './return-request-list.style';
import {
  formatDropdownList,
  formatComboBox,
} from '../../../../util/format-util';

class ReturnRequestList extends React.Component {
  isViewMounted = true;

  constructor(props) {
    super(props);
    this.state = {
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      maxResult: PaginationConfiguration.itemsPerPage,
      returnRequestList: {},
      returnRequestSearchFields: [...fields],
      searchParams: {},
      countFlag: ReturnRequestConstant.paginateParams.COUNT_FLAG,
    };

    this.loggedUser = getUserInfo();
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    this.loggedUser.userID = 1;
  }

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

  updateMultipleFieldArrayState = (detailsData) => {
    let updatedFieldArray = this.state.returnRequestSearchFields;
    detailsData.forEach((detail) => {
      updatedFieldArray = this.updateFieldArray(
        updatedFieldArray,
        detail.fieldName,
        detail.property,
        detail.updatedData,
        detail.defaultValue
      );
    });
    this.setState({ returnRequestSearchFields: updatedFieldArray });
  };

  componentDidMount = () => {
    const { currentPage, maxResult, countFlag } = this.state;

    const inputParams = {
      currentPage,
      maxResult,
      countFlag,
      branch: { in: [this.loggedUser.branch] },
    };
    this.setState({
      searchParams: inputParams,
    });
    // get Return Request list
    this.getReturnRequest(inputParams);

    const promiseList = [
      this.loadBranchByUser(
        this.loggedUser.userID,
        true /* true to set default branch */
      ),
      this.loadOrderType(),
      this.loadVendorByBranch(this.loggedUser.branch),
      this.loadReason(),
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
          fieldName: ReturnRequestConstant.branch,
          property: 'data',
          updatedData: formatDropdownList(values[0].data),
          defaultValue: defaultVal,
        },
        {
          fieldName: ReturnRequestConstant.orderType,
          property: 'data',
          updatedData: formatComboBox(values[1].data),
        },
        {
          fieldName: ReturnRequestConstant.vendor,
          property: 'data',
          updatedData: formatDropdownList(values[2].data),
        },
        {
          fieldName: ReturnRequestConstant.reason,
          property: 'data',
          updatedData: formatComboBox(values[3].data),
        },
        {
          fieldName: ReturnRequestConstant.status,
          property: 'data',
          updatedData: formatComboBox(values[4].data),
        },
      ]);
    });
  };

  componentWillUnmount() {
    this.isViewMounted = false;
  }

  getReturnRequest = (inputParams) => {
    // Get all Return Request
    getReturnRequestList(inputParams).then((res) => {
      const data = {
        totalItems: res.totalRecord,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        pageOfItems: res.data,
        data: res.data,
      };

      this.setState({ returnRequestList: data });
    });
  };

  loadReason = () =>
    new Promise((resolve) =>
      getReason()
        .then((res) => resolve(res))
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

  loadBranchByUser = (userId, isSetDefaultBranch = false) =>
    new Promise((resolve) =>
      getBranchByLoggedUser(userId)
        .then((res) => {
          resolve({ ...res, isSetDefaultBranch });
        })
        .catch(() => {
          resolve({ data: [] });
        })
    );

  loadVendorByBranch = (branch) =>
    new Promise((resolve) =>
      getVendorByBranch()
        .then((res) => resolve(res))
        .catch(() => {
          resolve({ data: [] });
        })
    );

  formatDateTimeToBackend = (inputDate) => {
    if (typeof inputDate === 'object') {
      return moment(inputDate).format(dateFormat.searchingDateTime);
    } else {
      const dateObj = moment(inputDate).format(dateFormat.yyyymmdd);
      return moment(dateObj).format(dateFormat.searchingDateTime);
    }
  };

  onSearch = (returnRequestSearchFields) => {
    const { pageSize } = this.state;
    const defaultCurrenPage = PaginationConfiguration.currentPage;
    const {
      branch,
      returnRequestNo,
      sapRequestNumber,
      materialDocument,
      batchNo,
      complaintNo,
      reason,
      materialDescription,
      createdDate,
      createdBy,
      orderType,
      vendor,
      goodsReceiptNo,
      status,
      creditNote,
      doNumber,
    } = returnRequestSearchFields;
    // Map value
    const branchVal = branch && { in: branch.map((item) => item.value) };
    const returnRequestNoVal = returnRequestNo && { like: returnRequestNo };
    const poStoReturnNoVal = sapRequestNumber && { like: sapRequestNumber };
    const materialDocumentVal = materialDocument && { like: materialDocument };
    const batchNoVal = batchNo && { like: batchNo };
    const reasonVal = reason && { eq: reason };
    const materialDescriptionVal = materialDescription && {
      like: materialDescription,
    };
    const complaintNoVal = complaintNo && { like: complaintNo };
    const createdDateFromVal = createdDate.ge
      ? {
          ge: this.formatDateTimeToBackend(createdDate.ge),
        }
      : null;
    const createdDateToVal = createdDate.le
      ? {
          le: this.formatDateTimeToBackend(createdDate.le),
        }
      : null;
    const createdByVal = createdBy && { like: createdBy };
    const orderTypeVal = orderType && {
      in: orderType.map((item) => item.value),
    };
    const vendorVal = vendor && {
      in: vendor.map((item) => item.value),
    };
    const goodsReceiptNoVal = goodsReceiptNo && { like: goodsReceiptNo };
    const statusVal = status && {
      in: status.map((item) => item.value),
    };
    const creditNoteVal = creditNote && { like: creditNote };
    const doNoVal = doNumber && { like: doNumber };
    // Initial params
    const inputParams = {
      // Get data item
      branch: branchVal || undefined,
      requestNumber: returnRequestNoVal || undefined,
      poStoReturnNo: poStoReturnNoVal || undefined,
      materialDocument: materialDocumentVal || undefined,
      batchNo: batchNoVal || undefined,
      reasonCode: reasonVal || undefined,
      materialDescription: materialDescriptionVal || undefined,
      complaintNo: complaintNoVal || undefined,
      createdDateFrom: createdDateFromVal || undefined,
      createdDateTo: createdDateToVal || undefined,
      createdBy: createdByVal || undefined,
      orderType: orderTypeVal || undefined,
      vendor: vendorVal || undefined,
      goodReceiptNo: goodsReceiptNoVal || undefined,
      status: statusVal || undefined,
      creditNote: creditNoteVal || undefined,
      doNumber: doNoVal || undefined,
      // Get page size
      maxResult: pageSize,
      currentPage: ReturnRequestConstant.paginateParams.CURRENT_PAGE,
      // Get total record
      countFlag: ReturnRequestConstant.paginateParams.COUNT_FLAG,
      // Get data not delete
      deleteFlag: ReturnRequestConstant.paginateParams.DELETE_FLAG,
    };

    this.getReturnRequest(inputParams);
    // Set search params for paging onChange
    this.setState({
      searchParams: inputParams,
      currentPage: defaultCurrenPage,
    });
  };

  onChangePage = (e, pageNumber) => {
    // Get state
    const { pageSize, countFlag: totalRecord, searchParams } = this.state;
    const inputParams = {
      // Search Params
      ...searchParams,
      // Paging
      currentPage: pageNumber,
      maxResult: pageSize,
      countFlag: totalRecord,
      deleteFlag: ReturnRequestConstant.paginateParams.DELETE_FLAG,
    };
    this.getReturnRequest(inputParams);
    this.setState({ currentPage: pageNumber });
  };

  onChangeRowsPerPage = (e) => {
    const itemsPerPage = e.target.value;
    const defaultCurrenPage = PaginationConfiguration.currentPage;
    this.setState({
      pageSize: itemsPerPage,
    });

    const { countFlag: totalRecord, searchParams } = this.state;
    // Reload list
    const inputParams = {
      // Search Params
      ...searchParams,
      // Paging
      currentPage: defaultCurrenPage,
      maxResult: e.target.value,
      countFlag: totalRecord,
      deleteFlag: ReturnRequestConstant.paginateParams.DELETE_FLAG,
    };
    this.getReturnRequest(inputParams);
    // Update page size
    this.setState({ pageSize: e.target.value, currentPage: defaultCurrenPage });
  };

  goToDetailPage = (data) => {
    // Go to detail page base on id
    this.props.history.push(
      `/inventory/return-request/detail/${data.returnRequestId}`
    );
  };

  goToEditPage = (data) => {
    // Go to edit page base on id
    this.props.history.push(
      `/inventory/return-request/edit/${data.returnRequestId}`
    );
  };

  /**
   * Show message dialog after delete record
   * @param {String} requestNumber
   */
  showDeletedMsgDialog = (requestNumber) => {
    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      type: dialogConstant.type.INFO,
      content: Message.DELETED_MSG_INSTANCE.replace(
        '%INSTANCE%',
        `Return Request ${requestNumber}`
      ),
      actions: [
        {
          name: this.props.t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
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
        statusName === ReturnRequestConstant.draft ||
        statusName === ReturnRequestConstant.rejected ||
        statusName === ReturnRequestConstant.failed
      );
    } else if (actionName === 'delete') {
      disabled = statusName !== ReturnRequestConstant.draft;
    }

    return disabled;
  };

  /**
   * Show delete message confirmation
   * @param {Object} data
   */
  confirmDelete = (data) => {
    const { searchParams, currentPage, maxResult, countFlag } = this.state;
    let searchParamsAfterDelete = {
      currentPage,
      maxResult,
      countFlag,
    };
    if (searchParams && searchParams.length) {
      searchParamsAfterDelete = searchParams;
    }
    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      type: dialogConstant.type.CONFIRM,
      content: Message.DELETE_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `Return Request: ${data.requestNumber}`
      ),
      actions: [
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: this.props.t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            if (data.returnRequestId) {
              deleteReturnRequest(data.returnRequestId).then((res) => {
                if (res.status === '200') {
                  this.showDeletedMsgDialog(data.requestNumber);
                  this.getReturnRequest(searchParamsAfterDelete);
                }
              });
            }
          },
        },
      ],
    });
  };

  goToAddReturnRequest = () => {
    this.props.history.push('/inventory/return-request/create');
  };

  render() {
    const { returnRequestSearchFields, returnRequestList } = this.state;
    const { classes } = this.props;
    const pageHeader = {
      pageTitle: 'Return Request List',
      showButton: true,
      buttonTitle: 'Create Return Request',
      buttonCustomClass: classes.btnAdd,
      buttonAction: () => this.goToAddReturnRequest(),
    };

    return (
      <div className={classes.returnRequestList}>
        <PageHeader {...pageHeader} />
        <div className={classes.returnRequestListSearchCover}>
          <SearchForm
            fieldArray={returnRequestSearchFields}
            onSearch={this.onSearch}
            validation={validation}
            classCustom="user-search-bar"
          ></SearchForm>
        </div>
        <div>
          {returnRequestList && (
            <TableGrid
              columns={columns}
              dataTable={returnRequestList}
              options={options}
              actions={actions(
                this.goToDetailPage,
                this.goToEditPage,
                this.confirmDelete,
                this.handleDisableActionButton
              )}
              onChangePage={this.onChangePage}
              onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
              defaultStyle={true}
              className="even-odd-columns"
            />
          )}
        </div>
      </div>
    );
  }
}

ReturnRequestList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default withTranslation()(withStyles(mainStyle)(ReturnRequestList));
