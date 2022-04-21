import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchForm from '../../shared/search-form/search-form.component';
import fields from './search-area/stock-search-fields';
import validation from './search-area/stock-search-valid';
import { columns, options } from './stock-list-config';
import TableGrid from '../../shared/table-grid/table-grid.component';
import ItemGrid from '../../shared/table-grid/item-grid.component';
import PageHeader from '../../shared/page-header/page-header.component';
import {
  searchStockItem,
  getBranchByUser,
  getStorageType,
  getMaterialGroup,
} from '../../../actions/stock-action';
import { StockConstant, userBranchInfo } from '../../../constants/constants';
import useStyles from './stock-list.style';
import { formatDropdownList, formatComboBox } from '../../../util/format-util';

class Stock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldArray: fields(this.onBranchChange),
      columnsStockList: columns,
      stockListData: {},
      searchParams: {},
      currentPage: StockConstant.paginateParams.CURRENT_PAGE,
      countFlag: StockConstant.paginateParams.COUNT_FLAG,
      pageSize: StockConstant.paginateParams.PAGE_SIZE,
    };
    this.fieldsInitial = [];
    // Temp data for testing
    this.loggedUser = JSON.parse(localStorage.getItem('userInfo'));
    // Temporary for testing
    this.loggedUser.branch = userBranchInfo.defaultBranch;
    this.isMounting = true;
  }

  componentDidMount() {
    this.loadDataComboBox().then(
      (res) => {
        const { fieldArray } = this.state;
        this.fieldsInitial = JSON.parse(JSON.stringify(fieldArray));
      }
    );
    this.renderItemColumn();

    const inputParams = {
      // Limit data per page
      currentPage: StockConstant.paginateParams.CURRENT_PAGE,
      maxResult: StockConstant.paginateParams.PAGE_SIZE,
      // Get total record
      countFlag: StockConstant.paginateParams.COUNT_FLAG,
      // Get data not delete
      deleteFlag: StockConstant.paginateParams.DELETE_FLAG,
      branchCode: { in: [this.loggedUser.branch] },
    };
    // Initial Stock List
    this.searchStockItem(inputParams);
  }

  loadDataComboBox = () => {
    const promise = new Promise((resolve, reject) => {
      Promise.all([
        getBranchByUser(this.loggedUser.userId),
        getStorageType(),
        getMaterialGroup()
      ]).then((res) => {
        const data = res[0].data.map((item) => ({
          display: item.display,
          value: item.value,
        }));
        const defaultVal = {
          display: this.loggedUser.userName,
          value: this.loggedUser.branch,
          isArray: true,
        } || null;

        this.updateFieldArrayState(
          'branch',
          'data',
          formatDropdownList(data),
          defaultVal
        );
        this.updateFieldArrayState(
          'storageType',
          'data',
          formatComboBox(res[1].data)
        );
        this.updateFieldArrayState(
          'materialGroup',
          'data',
          formatDropdownList(res[2].data)
        );
        resolve();
      });
    });
    return promise;
  }

  renderImage = (rowData, infoList, customClass) => {
    const infoListClone =
      typeof infoList === 'function' ? infoList(rowData) : infoList;

    const { classes } = this.props;
    return (
      <ItemGrid
        image={rowData?.itemVO?.imgUrl || ''}
        customClass={`${customClass || ''}`}
      >
        {infoListClone.map((el) => (
          <div key={el.fieldName} className={classes.info}>
            {el.noLabel
              ? `${(rowData.itemVO && rowData.itemVO[el.fieldName]) || ''}`
              : `${el.label}: ${(rowData.itemVO && rowData.itemVO[el.fieldName]) || ''}`}
          </div>
        ))}
      </ItemGrid>
    );
  };

  renderItemColumn = () => {
    const { columnsStockList } = this.state;
    // Add render handler for columns which belongs to image info type
    columnsStockList.forEach((el, index) => {
      if (el.customType === 'imageInfo') {
        columnsStockList[index].render = (rowData) =>
          this.renderImage(rowData, el.infoList);
      }
    });
  };

  onBranchChange = (e, newFieldArray) => {
    const { fieldArray } = this.state;
    const materialGroupField =
      newFieldArray?.filter(
        (field) => field.fieldName === 'materialGroup'
      )[0] || {};

    const branchField =
      newFieldArray?.filter((field) => field.fieldName === 'branch')[0] || {};
    if (
      !branchField.value ||
      (branchField.value &&
        (branchField.value.length > 1 || branchField.value.length === 0))
    ) {
      // disable and clear value of materialGroup group field when user select multiple branch or no branch
      materialGroupField.disabled = true;
      materialGroupField.value = null;
    } else {
      materialGroupField.disabled = false;
    }

    this.setState({ fieldArray });
  };

  // Update list option data for combobox fields
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
      this.setState({ fieldArray: [...updateFieldArray] });
    }
  };

  searchStockItem = (inputParams) => {
    // Call api
    searchStockItem(inputParams).then((res) => {
      // Map Params from api
      const data = {
        totalItems: res.totalRecord,
        currentPage: inputParams.currentPage,
        pageSize: inputParams.maxResult,
        data: res.data,
        pageOfItems: res.data,
      };
      this.setState({ stockListData: data });
    });
  };

  onSearch = (searchFields) => {
    const { pageSize } = this.state;
    const {
      branch,
      storageType,
      materialGroup,
      materialCode,
      materialDescription,
      minStockLevel,
      maxStockLevel,
    } = searchFields;
    // Map value
    const branchVal = branch && { in: branch.map((item) => item.value) };
    const storageTypeVal = storageType;
    const materialGroupVal = materialGroup && {
      in: materialGroup.map((item) => item.value),
    };
    const materialCodeVal = materialCode && { like: materialCode };
    const materialDescriptionVal = materialDescription && {
      like: materialDescription,
    };
    const minStockLevelVal = minStockLevel;
    const maxStockLevelVal = maxStockLevel;
    // Initial params
    const inputParams = {
      // Get data item
      branchCode: branchVal,
      storageType: storageTypeVal,
      materialGroup: materialGroupVal,
      materialCode: materialCodeVal,
      materialDescription: materialDescriptionVal,
      minStockLevel: minStockLevelVal,
      maxStockLevel: maxStockLevelVal,
      // Get page size
      maxResult: pageSize,
      currentPage: StockConstant.paginateParams.CURRENT_PAGE,
      // Get total record
      countFlag: StockConstant.paginateParams.COUNT_FLAG,
      // Get data not delete
      deleteFlag: StockConstant.paginateParams.DELETE_FLAG,
    };

    this.searchStockItem(inputParams);
    // Set search params for paging onChange
    this.setState({
      searchParams: inputParams,
      currentPage: StockConstant.paginateParams.CURRENT_PAGE,
    });
  };

  onClearFields = () => {
    // Reset all fields to be empty and default value (if any)
    this.setState({
      fieldArray: JSON.parse(JSON.stringify(this.fieldsInitial))
    });
  }

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
    };
    this.searchStockItem(inputParams);
    this.setState({ currentPage: pageNumber });
  };

  onChangeRowsPerPage = (e) => {
    // Get State
    const { countFlag: totalRecord, searchParams } = this.state;
    // Reload list
    const inputParams = {
      // Search Params
      ...searchParams,
      // Paging
      currentPage: StockConstant.paginateParams.CURRENT_PAGE,
      maxResult: e.target.value,
      countFlag: totalRecord,
    };
    this.searchStockItem(inputParams);
    // Update page size
    this.setState({
      pageSize: e.target.value,
      currentPage: StockConstant.paginateParams.CURRENT_PAGE,
    });
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  render() {
    const { classes } = this.props;
    const { stockListData, fieldArray } = this.state;
    const pageHeader = {
      pageTitle: `${StockConstant.pageTitle.stockList}`,
    };

    return (
      <> 
        { this.isMounting && (
          <>
            <PageHeader {...pageHeader} />
            <div className={classes.stockListSearchCover}>
              <SearchForm
                fieldArray={fieldArray}
                onSearch={this.onSearch}
                validation={validation}
                onClearCustom={this.onClearFields}
                classCustom="user-search-bar"
              ></SearchForm>
            </div>
            <div className={classes.stockListTbl}>
              <TableGrid
                columns={columns}
                dataTable={stockListData}
                options={options}
                onChangePage={this.onChangePage}
                onChangeRowsPerPage={this.onChangeRowsPerPage}
                className="table"
                defaultStyle={true}
              />
            </div>
          </>
        )}
      </>
    );
  }
}

Stock.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(Stock));
