import React from 'react';

import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from './asset-request-list.style';

import { buttonConstant } from '../../../../util/constant';
import {
  PaginationConfiguration,
  AssetRequestConstant,
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

import { 
  formatDropdownList,
  formatComboBox
} from '../../../../util/format-util';

import {
  fields,
  options,
  action,
  columnsDefault,
} from './asset-request-list.config';

import {
  getAssetRequestList,
  getAssetRequestStatus,
  getAssetLocation,
  getRequestBranch,
  deleteAssetRequest
} from '../../../../actions/asset-request-action';
import Button from '../../../shared/buttons/button.component';

class AssetRequestList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      options,
      assetRequestList: {},
      fieldArray: [...fields],
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: null,
    };

    // Get user login
    this.loggedUser = JSON.parse(localStorage.getItem('userInfo'));
    // TODO: Update default for logged user
    this.loggedUser.branch = userBranchInfo.defaultBranch;

    this.isMounting = true;
    //Set value for reset data init
    this.fieldsInitial = [];
  }

  componentDidMount = () => {
    //Load data list 
    this.loadDataAssetRequestList();

    //Load data form search
    this.loadAllSearchFld().then(
      () => {
        const { fieldArray } = this.state;
        this.fieldsInitial = JSON.parse(JSON.stringify(fieldArray));
      }
    );   
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  /**
   * Load data Asset Request List
   */
  loadDataAssetRequestList = (inputParams) => {
    const { pageSize } = this.state;
    let params = inputParams;

    if (!params) {
      params = {
        maxResult: pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage: PaginationConfiguration.currentPage,
        deleteFlag: 0,
        pageSize: PaginationConfiguration.itemsPerPage,
        branchCodeFrom: { in: [this.loggedUser.branch] },
      };
    }

    // Call request get list Asset Request
    getAssetRequestList(params).then((res) => {     
      if (res) {
        const assetRequestData = {
          totalItems: res.totalRecord || 0,
          currentPage: params.currentPage,
          pageSize,
          data: res.data || [],
        };
        if (this.isMounting) {
          this.setState({
            assetRequestList: assetRequestData,
            searchFieldsParam: params,
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
        getAssetRequestStatus(),
        getRequestBranch(this.loggedUser.userId),
        getAssetLocation()
      ]).then((res) => {

        // TODO: Update default value 
        let defaultVal = {
          display: this.loggedUser.userName,
          value: this.loggedUser.branch,
          isArray: true,
        } || null;

        // Update value to field
        this.updateFieldArrayState(
          AssetRequestConstant.searchFieldName.status,
          'data',
          formatComboBox(res[0].data)
        );
        this.updateFieldArrayState(
          AssetRequestConstant.searchFieldName.requestFrom,
          'data',
          formatDropdownList(res[1].data),
          defaultVal
        );
        this.updateFieldArrayState(
          AssetRequestConstant.searchFieldName.requestTo,
          'data',
          formatDropdownList(res[1].data) 
        );
        this.updateFieldArrayState(
          AssetRequestConstant.searchFieldName.assetLocation,
          'data',
          formatDropdownList(res[2].data) 
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
      }
      this.setState({ fieldArray: updateFieldArray });
    }
  };

  /**
   * Go to detail page
   * @param {*} item 
   */
  goToDetailPage = (item) => {
    this.props.history.push(`/asset-management/asset-request/view-asset-request-details/${item.id}`);
  };

  /**
   * Go to edit page
   * @param {*} item 
   */
  goToEditPage = (item) => {
    this.props.history.push(`/asset-management/asset-request/edit/${item.id}`);
  };

  /**
  * Go to page create 
  */
  goToCreatePage = () => {
    this.props.history.push('/asset-management/asset-request/create');
  };

  /**
   * Handle when clicking search btn on search form
   * @param {Object} searchFields
   */
  onSearch = (searchFields) => {
    // Get data input search area
    const inputParams = this.getSearchParams(searchFields);
    
    //Load data
    this.loadDataAssetRequestList(inputParams);
    this.setState({
      searchFieldsParam: inputParams,
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: PaginationConfiguration.currentPage,
      maxResult: PaginationConfiguration.itemsPerPage,
    });

  };

  /**
   * Clear data: init data default 
   */
  onClearFields = () => {
    // Reset all fields to be empty and default value (if any)
    this.setState({
      fieldArray: this.fieldsInitial
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

    params = setPropertyForRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.assetRequestNo
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.status
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.requestFrom
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.requestTo
    );
    
    // Created Date
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.createdDate
    );
    // Delivery Date
    params = setDateRangeRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.deliveryDate
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.approvedBy
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      AssetRequestConstant.searchFieldName.assetLocation
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
    const msg = Message.ASSET_REQUEST.CONFIRM_DELETE;

    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      content: msg.replace('%ARNo%', item?.assetRequestNo || ''),
      actions: [
        {
          name: t('Cancel'),
          type: dialogConstant.button.NONE_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: t('OK'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            const inputParams = {
              id: item?.id || '',
            };
            deleteAssetRequest(inputParams).then(() => {
              // Load data after delete
              this.loadDataAssetRequestList();
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
      maxResult: pageSize
    };
    this.setState({ currentPage: page }, () => {
      this.loadDataAssetRequestList(inputParams);
    });
  };

  /**
   * Event change row page
   * @param {*} e 
   */
  onChangeRowsPerPage = (e) => {
    // const pageSize = e?.target?.value;
    // this.setState({ pageSize, currentPage: 1 }, () => { });
    const pageSize = +e.target.value;
    const currentPage = PaginationConfiguration.currentPage;
    const inputParams = {
      ...this.state.searchFieldsParam,
      pageSize,
      currentPage,
      maxResult: pageSize,
    };
    this.setState({ pageSize, currentPage, searchFieldsParam: inputParams }, () => {
      this.loadDataAssetRequestList(inputParams);
    });
  };

  render() {
    const { t, classes } = this.props;
    const { assetRequestList, fieldArray } = this.state;

    const pageHeader = {
      pageTitle: t('Asset Request List'),
      showButton: false,
      customContent: (
        <div className={classes.createAssetRequestBtn}>
          <Button
            // title={t('Create Goods Issue')}
            title={t('Create Asset Request')}
            className="btnSecondary"
            classCustom={classes.btnAdd}
            handleClick={this.goToCreatePage}
          />
        </div>
      ),
    };

    return (
      <div className={classes.searchAssetRequest} >
        {this.isMounting && (
          <div>
            <PageHeader {...pageHeader} />
            <div className="searchCover">
              <SearchForm
                fieldArray={fieldArray}
                onSearch={this.onSearch}
                classCustom="user-search-bar"
                rowSize={4}
                onClearCustom={this.onClearFields}
              ></SearchForm>
            </div>

            <TableGrid
              defaultStyle={true}
              dataTable={assetRequestList}
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

AssetRequestList.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AssetRequestList));
