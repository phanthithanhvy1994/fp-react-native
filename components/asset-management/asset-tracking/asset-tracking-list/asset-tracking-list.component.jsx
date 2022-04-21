import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import { PaginationConfiguration, AssetTrackingConstant, dateFormat } from '../../../../constants/constants';
import {
  setDateRangeRequestParams,
} from '../../../shared/search-form/search-form.common';
import {
  titlePage,
  fields,
  columns,
  options,
  actions
} from './asset-tracking-list.config';
import {
  // getDataRequestFrom,
  // getDataRequestTo,
  getDataStatus,
  // getDataType,
  // getDataSAP,
  // getDataBBS,
  getAssetTrackingList,
} from '../../../../actions/asset-tracking-action';
import PageHeader from '../../../shared/page-header/page-header.component';

import useStyles from './asset-tracking-list.style';
import { reStructureFields } from './asset-tracking-list-util';
import { formatComboBox } from '../../../../util/format-util';
// import { formatDateString } from '../../../../util/date-util';
import moment from 'moment';

class AssetTransferTrackingList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldsSearchArr: [...fields],
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      assetTransferList: {},
      searchFieldsParam: null,
      defaultStartDate: moment()
        .subtract(1, 'months')
        .format(dateFormat.yyyymmddStartDay),
      // defaultStartDate: moment().format(dateFormat.yyyymmddEndDay),
      defaultEndDate: moment().format(dateFormat.yyyymmddEndDay),
    };
    this.isMounting = true;
    this.isSearchDefault = true;
  }

  componentDidMount = () => {
    //Load data field Search
    this.loadDataFieldsSearch();

    let defaultCreatedDate = {
      ge: this.state.defaultStartDate,
      le: this.state.defaultEndDate,
    };

    if (!this.isSearchDefault) {
      defaultCreatedDate = {};
    }

    //Load data  Asset Tracking List
    this.loadAssetTrackingList();
  }

  componentWillUnmount() {
    this.isMounting = false;
  }

  /**
   * Load data  Asset Tracking List
   * @param {*} paramSearch 
   */
  loadAssetTrackingList = (paramSearch) => {

    let params = paramSearch;

    if (!paramSearch) {
      if (this.isSearchDefault) {

        // Get value param Create date 
        params =
        {
          [AssetTrackingConstant.searchFieldName.assetTrackingCreateDate]: {
            ge: this.state.defaultStartDate,
            le: this.state.defaultEndDate,
          },
        };

        // Set value create date to params
        const reStructureParam = reStructureFields(params);
        const searchParam = {
          ...reStructureParam,
        };
        this.setState({ searchFieldsParam: reStructureParam });
        params = searchParam;
      }
    }

    // Get data Asset Tracking List
    getAssetTrackingList(params).then((res) => {
      const { currentPage, pageSize } = this.state;
      const data = {
        totalItems: res.totalRecord,
        currentPage,
        pageSize,
        data: res.data || [],
      };
      if (this.isMounting) {
        this.setState({
          assetTransferList: data,
        });
      }
    });
  }

  /**
   * Load daa for Filed Search
   */
  loadDataFieldsSearch = () => {
    const promiseList = [
      getDataStatus(),
    ];

    Promise.all(promiseList).then((values) => {
      if (!this.isMounting) {
        return;
      }
      this.updateMultipleFieldArrayState([
        {
          fieldName: AssetTrackingConstant.searchFieldName.assetTrackingStatus,
          property: 'data',
          updatedData: formatComboBox(values[0].data),
        },

      ]);
    });
  };

  /**
   * Update MultipleFieldArrayState
   * @param {*} detailsData 
   */
  updateMultipleFieldArrayState = (detailsData) => {
    let updatedFieldArray = this.state.fieldsSearchArr;
    detailsData.forEach((detail) => {
      updatedFieldArray = this.updateFieldArray(
        updatedFieldArray,
        detail.fieldName,
        detail.property,
        detail.updatedData,
        detail.defaultValue
      );
    });
    this.setState({ fieldsSearchArr: updatedFieldArray });
  };

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

    this.setState({ fieldArray: [...updateFieldArray] });
    return updateFieldArray;
  };

  /**
   * Search Event
   * @param {*} param 
   */
  onSearch = (param) => {
    const { currentPage, pageSize } = this.state;
    const reStructureParam = reStructureFields(param);
    const searchParam = {
      ...reStructureParam,
      currentPage: 1,
      pageSize: PaginationConfiguration.itemsPerPage,
      maxResult: PaginationConfiguration.itemsPerPage,
      countFlag: 1,
      deleteFlag: 0,
    };
    this.setState({
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      maxResult: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: reStructureParam,
    });
    
    // Set value
    this.isSearchDefault = false;

    // Get data list with params Search
    this.loadAssetTrackingList(searchParam);
  };

  /**
   * Change page event
   * @param {*} e 
   * @param {*} page 
   */
  onChangePage = (e, page) => {
    const { pageSize, searchFieldsParam } = this.state;
    const searchParam = {
      ...searchFieldsParam,
      currentPage: page,
      maxResult: pageSize,
      countFlag: 1,
      deleteFlag: 0,
    };
    this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.loadAssetTrackingList(searchParam);
    });
  };

  /**
   * Change Rows Per Page event
   * @param {*} e 
   */
  onChangeRowsPerPage = (e) => {
    const { currentPage, searchFieldsParam } = this.state;
    const pageSize = e.target.value;
    const searchParam = {
      ...searchFieldsParam,
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
      deleteFlag: 0,
    };
    this.setState({ pageSize, currentPage, searchFieldsParam }, () => {
      this.loadAssetTrackingList(searchParam);
    });
  };

  /**
   * Go to Detail page 
   * @param {*} assetTrackingId 
   */
  goToDetailPage = (assetTrackingId) => {
    this.props.history.push(`/asset-management/asset-tracking/detail/${assetTrackingId}`);

  }

  render() {
    const { classes } = this.props;
    const { fieldsSearchArr, assetTransferList } = this.state;
    const pageHeader = {
      pageTitle: `${titlePage}`,
    };
    return (
      <>
        <PageHeader {...pageHeader} />
        <div className={classes.assetTrackingSearchCover}>
          <SearchForm
            fieldArray={fieldsSearchArr}
            onSearch={this.onSearch}
            // validation={validation}
            classCustom="user-search-bar"
          ></SearchForm>
        </div>
        <div className={classes.assetTransferTbl}>
          <TableGrid
            columns={columns}
            dataTable={assetTransferList}
            options={options}
            onChangePage={this.onChangePage}
            onChangeRowsPerPage={this.onChangeRowsPerPage}
            className="even-odd-columns"
            actions={actions(
              this.goToDetailPage,
              this.goToEditPage,
              this.confirmDeleteItem,
              this.handleDisableActionButton
            )}
            defaultStyle={true}
          />
        </div>
      </>
    );
  }
}

AssetTransferTrackingList.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AssetTransferTrackingList));
