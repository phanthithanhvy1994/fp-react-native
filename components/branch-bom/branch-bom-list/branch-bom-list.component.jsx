import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchForm from '../../shared/search-form/search-form.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import PageHeader from '../../shared/page-header/page-header.component';
import {
  columnsDefault,
  options,
  actions,
  fields,
} from './branch-bom-list.config';
import { reStructureFields } from '../../branch-bom/branch-bom-util';
import {
  getBranchBomList,
  deletedBranchBom,
  getDataStatusType,
  getDataBomBranchLevelType,
  getDataCompanyCode,
  getDataProductType,
  getDataPriceType,
  getDataSubCategoryType,
} from '../../../actions/branch-bom-action';
import useStyles from './branch-bom-list.style';
import {
  PaginationConfiguration,
  BranchBOM,
} from '../../../constants/constants';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';

import searchTitleStyle from '../../../style/core/search/search-title';
import './branch-bom-list.style.scss';
import { formatComboBox, formatDropdownList } from '../../../util/format-util';

// TODO: waiting API call get level and category
class BranchBomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bomSearchFields: fields(),
      bomListData: {},
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: null,
    };
    this.isMounting = true;
  }

  componentDidMount() {
    const { currentPage, pageSize } = this.state;
    const param = {
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
      deleteFlag: 0,
    };
    this.loadDataFieldsSearch();
    this.loadBranchBom(param);
  }

  componentWillUnmount() {
    this.isMounting = false;
  }

  // TODO: waiting API get Branch BOM list
  loadBranchBom = (paramSearch) => {
    getBranchBomList(paramSearch).then((res) => {
      const { currentPage, pageSize } = this.state;
      const data = {
        totalItems: res.totalRecord,
        currentPage,
        pageSize,
        data: res.data || [],
      };
      if (this.isMounting) {
        this.setState({
          bomListData: data,
        });
      }
    });
  };

  loadDataFieldsSearch = async () => {
    let level = [];
    let companyCode = [];
    let product = [];
    let price = [];
    let subCategory = [];

    await getDataBomBranchLevelType()
      .then((res) => {
        level = formatComboBox(res.data);
        return level;
      })
      .catch(console.error);
    await getDataCompanyCode().then((res) => {
      companyCode = formatDropdownList(res.data);
      return companyCode;
    });
    await getDataProductType().then((res) => {
      product = formatDropdownList(res.data);
      return product;
    });

    await getDataPriceType().then((res) => {
      price = formatDropdownList(res.data);
      return price;
    });
    await getDataSubCategoryType().then((res) => {
      subCategory = formatDropdownList(res.data);
      return subCategory;
    });

    getDataStatusType()
      .then((res) => {
        const status = formatComboBox(res.data);
        const bomSearchFields = fields(
          level,
          status,
          companyCode,
          product,
          price,
          subCategory,
          this.onChangeProduct
        );
        return this.isMounting ? this.setState({ bomSearchFields }) : [];
      })
      .catch(console.error);
  };

  goToAddBranchBOM = () => {
    this.props.history.push('/catalog/branch-bom/create');
  };

  onChangeProduct = (e, newFieldArray) => {
    const { bomSearchFields } = this.state;
    let category = [];
    if (e.target.value) {
      e.target.value.forEach((cat) => {
        category = category.concat(cat.childCategories);
      });
    }
    const fieldCategory =
      newFieldArray?.filter((field) => field.fieldName === 'category')[0] || {};
    fieldCategory.data = formatDropdownList(category);
    if (category.length > 0) {
      fieldCategory.disabled = false;
    } else {
      fieldCategory.disabled = true;
    }

    this.setState({ category: formatComboBox(category), bomSearchFields });
  };

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
      this.loadBranchBom(searchParam);
    });
  };

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
      this.loadBranchBom(searchParam);
    });
  };

  handleDisableActionButton = (rowData, actionName) => {
    const { status } = rowData;
    let disabled = false;

    if (actionName === 'edit') {
      disabled = !(
        status === BranchBOM.status.draft ||
        status === BranchBOM.status.unconfirmed
      );
    } else if (actionName === 'delete') {
      disabled = status !== BranchBOM.status.draft;
    }

    return disabled;
  };

  goToDetailPage = (branchBomId) => {
    this.props.history.push(`/catalog/branch-bom/detail/${branchBomId}`);
  };

  goToEditPage = (data) => {
    this.props.history.push(`/catalog/branch-bom/edit/${data.id}`);
  };

  confirmDeleteItem = (data) => {
    const { currentPage, pageSize, searchFieldsParam } = this.state;
    const searchParam = {
      ...searchFieldsParam,
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
      deleteFlag: 0,
    };
    const id = { id: data.id };
    openDialog({
      title: Message.CONFIRM,
      content: Message.BRANCH_BOM.DELETE_CONFIRM.replace(
        '<BOM Code>',
        ` ${data.id}`
      ).replace(
        '<BOM Name>',
        ` ${data.bomBranchName}`
      ),
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
            deletedBranchBom(id)
              .then(() => {
                this.loadBranchBom(searchParam);
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

  onSearch = (param) => {
    const { currentPage, pageSize } = this.state;
    const reStructureParam = reStructureFields(param);
    const searchParam = {
      ...reStructureParam,
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
      deleteFlag: 0,
    };
    this.setState({ searchFieldsParam: reStructureParam });
    this.loadBranchBom(searchParam);
  };

  render() {
    const { classes } = this.props;
    const { bomSearchFields, bomListData } = this.state;
    const pageHeader = {
      pageTitle: 'Branch BOM List',
      showButton: true,
      buttonTitle: 'Create Branch BOM',
      buttonCustomClass: classes.btnAdd,
      buttonAction: () => this.goToAddBranchBOM(),
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.branchBomList}>
            <PageHeader {...pageHeader} />

            <div className={classes.searchCover}>
              <SearchForm
                fieldArray={bomSearchFields}
                onSearch={this.onSearch}
                classCustom="user-search-bar branch-bom-list"
                rowSize={3}
              ></SearchForm>
            </div>
            <TableGrid
              defaultStyle={true}
              dataTable={bomListData}
              columns={columnsDefault}
              options={options}
              className="even-odd-columns"
              actions={actions(
                this.goToDetailPage,
                this.goToEditPage,
                this.confirmDeleteItem,
                this.handleDisableActionButton
              )}
              onChangePage={(e, page) => this.onChangePage(e, page)}
              onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
            />
          </div>
        )}
      </>
    );
  }
}

BranchBomList.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

const mainStyle = Object.assign(searchTitleStyle, useStyles);
export default withTranslation()(withStyles(mainStyle)(BranchBomList));
