import React, { createRef } from 'react';

import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from './goods-issues-list.style';

import { buttonConstant } from '../../../../util/constant';
import {
  PaginationConfiguration,
  GoodsIssuesConstant,
  dialogConstant,
  userBranchInfo,  
} from '../../../../constants/constants';

import { Message } from '../../../../constants/messages';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';

import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../../../shared/search-form/search-form.common';

import { formatDropdownList, formatComboBox} from '../../../../util/format-util';

//Add new
import {
  fields,
  options,
  action,
  columnsDefault,

} from './goods-issues-list.config';
//Add New

import GoodsIssuesButton from '../../goods-issues-button/goods-issues-button.component';

import {
  getGoodsIssuesList,
  deleteGoodsIssuesList,
  getGoodsIssuesStatus,
  getGoodsIssuesType,
  getBranchByUser
} from '../../../../actions/goods-issues-action';

// TODO: waiting API call get level and category
class GoodsIssuesList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options,
      goodsIssuesList: {},
      fieldArray: [...fields],
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: null,
      defaultStatus: GoodsIssuesConstant.numberConstant.numberOfDraft,
      countFlag: 1,
    };

    // Get user login
    this.loggedUser = JSON.parse(localStorage.getItem('userInfo'));
    this.loggedUser.branch = userBranchInfo.defaultBranch;

    this.isMounting = true;
    this.ref = createRef();
    //Set value for reset data init
    this.fieldsInitial = [];
  }

  /**
   * Event of lifecycle : componentDidMount
   */
  componentDidMount = () => {
    // //Load data list 
    this.loadDataGoodsIssuesList();

    // //Load data form search
    this.loadAllSearchFld().then(
      () => {
        const { fieldArray } = this.state;
        this.fieldsInitial = JSON.parse(JSON.stringify(fieldArray));
      }
    );   
  };

  /**
   * Event of lifecycle : componentWillUnmount
   */
  componentWillUnmount() {
    this.isMounting = false;
  }

  /**
   * Load data Goods Issues List
   */
  loadDataGoodsIssuesList = (inputParams) => {
    const { currentPage, pageSize } = this.state;
    let params = inputParams;
    if (!params) {
      params = {
        maxResult: pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: PaginationConfiguration.currentPage,
        deleteFlag: 0,
        pageSize: PaginationConfiguration.itemsPerPage,
        branchCode: { in: [this.loggedUser.branch] },
      };
      // Check when will unmount
      if (this.isMounting) {
        this.setState({
          searchFieldsParam: params,
        });
      }
    }

    // Call request get list GoodsIssues
    getGoodsIssuesList(params).then((res) => {     
      if (res) {
        const goodsIssuesData = {
          totalItems: res.totalRecord || 0,
          currentPage,
          pageSize,
          data: res.data || [],
        };

        if (this.isMounting) {
          this.setState({
            goodsIssuesList: goodsIssuesData,
          });
        }
      }
    });
  };

  /**
   * Load data search
   */
  loadAllSearchFld = () => {
    const promise = new Promise((resolve, reject) => {

      Promise.all([
        getGoodsIssuesType(), //Type  : Get Type
        getBranchByUser(this.loggedUser.userId),    //Branch: Load data Branch follow by userId     
        getGoodsIssuesStatus() //Status: Get value Goods Issues Status 
      ]).then((res) => {

        // Branch 
        let defaultVal = {
          display: this.loggedUser.userName,
          value: this.loggedUser.branch,
          isArray: true,
        } || null;

        //Get value Goods Issues Status

        //1. Get Type      
        this.updateFieldArrayState(
          GoodsIssuesConstant.goodsIssuesType,
          'data',
          formatComboBox(res[0].data),
        );
        // Update value to field
        this.updateFieldArrayState(
          GoodsIssuesConstant.searchFieldName.goodsIssuesBranch,
          'data',
          formatDropdownList(res[1].data),
          defaultVal
        );
        this.updateFieldArrayState(
          GoodsIssuesConstant.searchFieldName.goodsIssuesStatus,
          'data',
          formatComboBox(res[2].data) 
        );
        resolve();
      });
    });

    return promise;
  };

  /**
   * Update list option data for combobox fields
   * @param {*} fieldName 
   * @param {*} updatedPropertyName 
   * @param {*} updatedData 
   * @param {*} defaultValue 
   */
  updateFieldArrayState = (
    fieldName,
    updatedPropertyName,
    updatedData,
    defaultValue = null
  ) => {
    const updateFieldArray = this.state.fieldArray;
    const fieldIndex = this.state.fieldArray.findIndex(
      (el) => el.fieldName === fieldName
    );
    const field = fieldIndex !== GoodsIssuesConstant.numberConstant.numberOneNegative && this.state.fieldArray[fieldIndex];

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
      this.setState({ fieldArray: updateFieldArray });
    }
  };

  /**
   * Go to detail page
   * @param {*} item 
   */
  goToDetailPage = (item) => {
    this.props.history.push(`/inventory/goods-issues/detail/${item.goodsIssuesId}`);
  };

  /**
   * Go to edit page
   * @param {*} item 
   */
  goToEditPage = (item) => {
    this.props.history.push(`/inventory/goods-issues/edit/${item.goodsIssuesId}`);
  };

  /**
  * Go to page create 
  */
  goToNewPage = () => {
    const { history } = this.props;
    history.push('/inventory/goods-issues/create');
  };

  /**
   * Handle when clicking search btn on search form
   * @param {Object} searchFields
   */
  onSearch = (searchFields) => {
    // Get data input search area
    const inputParams = this.getSearchParams(searchFields);

    this.setState({
      searchFieldsParam: inputParams,
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: PaginationConfiguration.currentPage,
      maxResult: PaginationConfiguration.itemsPerPage,
    }, () => {
      //Load data
      this.loadDataGoodsIssuesList(inputParams);
    });
  };

  /**
  * Set request params and only push the property which has value into request params
  * @param {Object} fieldArr search fields on search form
  */
  getSearchParams = (fieldArr) => {
    let params = {
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: PaginationConfiguration.currentPage,
      maxResult: PaginationConfiguration.itemsPerPage,
      deleteFlag: 0,
      countFlag: PaginationConfiguration.countFlag,      
    };

    // Department
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.department
    );
    // Branch
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.goodsIssuesBranch
    );
    // Goods Issues No.
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.giNo
    );
    // Created Date
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.createdDate
    );
    // Submitted Date
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.submittedDate
    );
    // Created By
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.createdBy
    );
    // Type
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.goodsIssuesType
    );
    // Status
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.goodsIssuesStatus
    );
    // Material Document
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.materialDocument
    );
    // Material Description
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      GoodsIssuesConstant.searchFieldName.materialDescription
    );
    // Return
    return params;
  };

  /**
   * Pop up confirm delete item base on packNumber
   * @param {*} item
   */
  confirmDeleteItem = (item) => {
    const { t } = this.props;
    const msg = Message.INVENTORY.CONFIRM_DELETE;

    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      content: msg.replace('%VPNo%', item?.goodsIssuesNumber || GoodsIssuesConstant.stringEmpty),
      actions: [
        {
          name: t(GoodsIssuesConstant.cancel),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: t(GoodsIssuesConstant.ok),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            const inputParams = {
              goodsIssuesId: item.goodsIssuesId,
            };
            deleteGoodsIssuesList(inputParams).then(() => {
              // const defaultStatus = this.state.defaultStatus;

              // Load data after delete
              this.loadDataGoodsIssuesList();
            });
          },
        },
      ],
    });
  };

  /**
   * Event change page
   * @param {*} e 
   * @param {*} page 
   */
  onChangePage = (e, page) => {
    // Get state
    const { pageSize, searchFieldsParam } = this.state;
    const inputParams = {
      ...searchFieldsParam,
      currentPage: page,
      maxResult: pageSize,
      countFlag: PaginationConfiguration.countFlag,
      deleteFlag: 0,
    };
    this.setState({ currentPage: page }, () => {this.loadDataGoodsIssuesList(inputParams);});
  };

  /**
   * Event change row page
   * @param {*} e 
   */
  onChangeRowsPerPage = (e) => {
    const pageSize = +e.target.value;
    const currentPage = PaginationConfiguration.currentPage;
    const inputParams = {
      ...this.state.searchFieldsParam,
      pageSize,
      currentPage,
      maxResult: pageSize,
    };
    this.setState({ pageSize, currentPage, searchFieldsParam: inputParams }, () => {
      this.loadDataGoodsIssuesList(inputParams);
    });
  };

  render() {
    const { t, classes, history } = this.props;

    const pageHeader = {
      pageTitle: t(GoodsIssuesConstant.titleGoodsIssues),
      showButton: false,
      customContent: (
        <GoodsIssuesButton
          history={history}
          handleNewGoodIssues={this.goToNewPage}
        />
      ),
    };

    const {goodsIssuesList,fieldArray,} = this.state;

    return (
      <div className={classes.searchGoodIssues} >

        {this.isMounting && (
          <div>
            <PageHeader {...pageHeader} />
            <div className="searchCover">
              <SearchForm
                fieldArray={fieldArray}
                onSearch={this.onSearch}
                classCustom="user-search-bar"
                rowSize={4}
              ></SearchForm>
            </div>

            <TableGrid
              defaultStyle={true}
              dataTable={goodsIssuesList}
              options={options}
              columns={columnsDefault}
              actions={action(this.goToDetailPage,
                this.goToEditPage,
                this.confirmDeleteItem)}
              className="even-odd-columns"
              onChangePage={(e, page) => this.onChangePage(e, page)}
              onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
            />
          </div>
        )}
      </div>
    );
  }
}

GoodsIssuesList.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(GoodsIssuesList));
