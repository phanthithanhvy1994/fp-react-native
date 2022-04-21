import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import map from 'lodash/map';

import TableSelection from '../shared/table-selection/table-selection.component';
import SearchForm from '../shared/search-form/search-form.component';
import MaterialDetail from './material-detail.component';
import validation from './search-area/material-list-search-valid';
import fieldArray from './search-area/material-list-search-fields';
import PageHeader from '../shared/page-header/page-header.component';

import {
  getMaterialList,
  getMaterialImage,
  getMaterialType,
  getMaterialGroup,
  getMaterialDetail,
} from '../../actions/material-action';

import useStyle from './material-list.style';
import { convertItemDataStructure } from './material.common';
import {
  PaginationConfiguration,
  CategoryConstant,
} from '../../constants/constants';
import { formatDropdownList } from '../../util/format-util';

class MaterialList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemsPerPage: PaginationConfiguration.itemsPerPage,
      isOpenDetailDialog: false,
      materialDetail: '',
      materialList: '',
      searchFields: [...fieldArray],
      searchFieldsParam: '',
      currentPage: PaginationConfiguration.currentPage,
      maxResult: PaginationConfiguration.itemsPerPage,
      countFlag: PaginationConfiguration.countFlag,
      pageSize: PaginationConfiguration.itemsPerPage,
    };
  }

  componentDidMount = () => {
    Promise.all([getMaterialGroup(), getMaterialType()]).then((res) => {
      const materialGroupData = res[0];
      const materialTypeData = res[1];

      const cloneFields = map(fieldArray, (item) => {
        if (item.fieldName === CategoryConstant.materialGroup) {
          return { ...item, data: formatDropdownList(materialGroupData) };
        }

        if (item.fieldName === CategoryConstant.materialType) {
          return { ...item, data: formatDropdownList(materialTypeData) };
        }

        return item;
      });

      this.setState({ searchFields: cloneFields });
    });

    const inputParams = {
      currentPage: this.state.currentPage,
      maxResult: this.state.maxResult,
      countFlag: this.state.countFlag,
    };

    this.getMaterialList(inputParams);
  };

  getMaterialList = (inputParams) => {
    getMaterialList(inputParams).then((res) => {
      const data = {
        totalItems: res.totalRecord,
        currentPage: this.state.currentPage,
        pageSize: this.state.pageSize,
        maxResult: this.state.maxResult,
        pageOfItems: convertItemDataStructure(res.data, [
          { label: 'sku', value: '' },
          { label: '', value: 'description' },
        ]),
      };
      this.setState({ materialList: data });
    });
  };

  onClickDetailDialog = (e) => {
    getMaterialDetail(e).then((res) => {
      const data = {
        // Will use it when BE done
        imgUrl: `${getMaterialImage()}?sku=${res.sku}`,
        details: [
          { label: 'Material Code', value: res.sku },
          { label: 'Material Description', value: res.description },
          { label: 'Volumn', value: res.volume },
          { label: 'Volumn Unit', value: res.volumeUnit },
          { label: 'Type', value: res.materialType },
          { label: 'Group', value: res.materialGroup },
        ],
      };
      this.setState({ materialDetail: data, isOpenDetailDialog: true });
    });
  };

  handleCloseDetailDialog = () => {
    this.setState({ isOpenDetailDialog: false });
  };

  onSearch = (searchFields) => {
    const defaultCurrenPage = PaginationConfiguration.currentPage;
    const inputParams = {
      // Search exactly for code
      sku: {
        like: searchFields.materialCode,
      },
      materialDescription: {
        // Search like with name
        like: searchFields.materialDescription,
      },
      materialType: { in: map(searchFields.materialType, 'value') },
      materialGroup: { in: map(searchFields.materialGroup, 'value') },
      maxResult: this.state.maxResult,
      countFlag: this.state.countFlag,
      currentPage: defaultCurrenPage,
    };
    this.setState({
      searchFieldsParam: inputParams,
      currentPage: defaultCurrenPage,
    });
    this.getMaterialList(inputParams);
  };

  onChangePage = (e, page) => {
    const { searchFieldsParam } = this.state;

    const searchParams = {
      sku: searchFieldsParam.sku,
      materialDescription: searchFieldsParam.materialDescription,
      materialType: searchFieldsParam.materialType,
      materialGroup: searchFieldsParam.materialGroup,
      currentPage: page,
      maxResult: this.state.maxResult,
      countFlag: this.state.countFlag,
    };

    this.setState({ currentPage: page });
    this.getMaterialList(searchParams);
  };

  onChangeRowsPerPage = (e) => {
    const { searchFieldsParam } = this.state;
    const defaultCurrenPage = PaginationConfiguration.currentPage;
    const itemsPerPage = e.target.value;
    const searchParams = {
      sku: searchFieldsParam.sku,
      materialDescription: searchFieldsParam.materialDescription,
      materialType: searchFieldsParam.materialType,
      materialGroup: searchFieldsParam.materialGroup,
      currentPage: defaultCurrenPage,
      maxResult: itemsPerPage,
      countFlag: this.state.countFlag,
    };
    this.setState({
      maxResult: itemsPerPage,
      pageSize: itemsPerPage,
      currentPage: defaultCurrenPage,
    });
    this.getMaterialList(searchParams);
  };

  render() {
    const {
      isOpenDetailDialog,
      materialDetail,
      materialList,
      searchFields,
    } = this.state;
    const { classes } = this.props;
    const pageHeader = {
      pageTitle: `${CategoryConstant.pageTitle.materialList}`,
    };
    return (
      <div className={classes.materialList}>
        <PageHeader {...pageHeader} />
        <div className={classes.materialListSearchCover}>
          {searchFields && (
            <SearchForm
              fieldArray={searchFields}
              validation={validation}
              onSearch={this.onSearch}
              classCustom={`${classes.searchForm} user-search-bar`}
            />
          )}
        </div>
        <TableSelection
          data={materialList}
          onChangePage={(e, page) => this.onChangePage(e, page)}
          onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
          onClick={(e) => this.onClickDetailDialog(e)}
        />

        <MaterialDetail
          open={isOpenDetailDialog}
          onClose={this.handleCloseDetailDialog}
          dataItem={materialDetail}
        />
      </div>
    );
  }
}

MaterialList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
};

export default withTranslation()(withStyles(useStyle)(MaterialList));
