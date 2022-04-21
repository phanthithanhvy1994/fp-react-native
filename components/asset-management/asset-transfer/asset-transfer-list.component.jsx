import React from 'react';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import SearchForm from '../../shared/search-form/search-form.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import { PaginationConfiguration } from '../../../constants/constants';
import { 
  titlePage, 
  fields, 
  columns,
  options,
  actions
} from './asset-transfer-list.config';
import { 
  getDataRequestFrom,
  getDataRequestTo,
  getDataStatus,
  getDataType,
  getDataSAP,
  getDataBBS,
  getAssetTransferList,
} from '../../../actions/asset-transfer-action';
import PageHeader from '../../shared/page-header/page-header.component';
import useStyles from './asset-transfer-list.style';
import { reStructureFields } from './asset-transfer-util';
import { formatComboBox, formatDropdownList } from '../../../util/format-util';

class AssetTransfer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fieldsSearchArr: fields(),
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      assetTransferList: {},
      searchFieldsParam: null,
    };
    this.isMounting = true;
  }

  componentDidMount = () =>{
    this.loadDataFieldsSearch();
    this.loadAssetTransfer();
  }
  
  componentWillUnmount() {
    this.isMounting = false;
  }

  loadAssetTransfer = (paramSearch) => {
    getAssetTransferList(paramSearch).then((res) => {
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

  loadDataFieldsSearch = async () => {
    let requestFrom = [];
    let requestTo = [];
    let status = [];
    let type = [];
    let sap = [];

    await getDataRequestFrom()
      .then((res) => {
        requestFrom = formatComboBox(res.data);
        return requestFrom;
      })
      .catch(console.error);

    await getDataRequestTo().then((res) => {
      requestTo = formatDropdownList(res.data);
      return requestTo;
    });

    await getDataStatus().then((res) => {
      status = formatDropdownList(res.data);
      return status;
    });

    await getDataType().then((res) => {
      type = formatDropdownList(res.data);
      return type;
    });

    await getDataSAP().then((res) => {
      sap = formatDropdownList(res.data);
      return sap;
    });

    getDataBBS()
      .then((res) => {
        const bbs = formatComboBox(res.data);
        const fieldsSearchArr = fields(
          requestFrom,
          requestTo,
          status,
          type,
          sap,
          bbs,
        );
        return this.isMounting ? this.setState({ fieldsSearchArr }) : [];
      })
      .catch(console.error);
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
    this.loadAssetTransfer(searchParam);
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
      this.loadAssetTransfer(searchParam);
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
      this.loadAssetTransfer(searchParam);
    });
  };

  goToDetailPage = (id) => {
    this.props.history.push(`/asset-management/asset-transfer/view-asset-transfer-details/${id}`);

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
        <div className={classes.assetTranferSearchCover}>
          <SearchForm
            fieldArray={fieldsSearchArr}
            onSearch={this.onSearch}
            // validation={validation}
            classCustom="user-search-bar"
          ></SearchForm>
        </div>
        <div className={classes.assetTranferTbl}>
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

AssetTransfer.propTypes = {
  history: PropTypes.any,
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(AssetTransfer));
