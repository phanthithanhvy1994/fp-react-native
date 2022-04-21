import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './pack-voucher-detail.style';
import PageHeader from '../../../shared/page-header/page-header.component';
import DetailForm from '../../../shared/form/detail-form/detail-form.component';
import {getValuePackDetails} from '../../../../actions/voucher-action';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/styles';
import {withTranslation} from 'react-i18next';
import { 
  ActionType, 
  PaginationConfiguration, 
  Voucher 
} from '../../../../constants/constants';
import {
  options,
  fieldsLabelArray,
  columnsDetail
} from './pack-voucher-detail.config';

class PackVoucherDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailData: {},
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: PaginationConfiguration.currentPage,
      dataTable: {},
      isSerialNo: false
    };
    this.isMounting = true;
    this.updateDataDetailsOnGrid = props.updateDataDetailsOnGrid;
  };

  /**
   * Load pack voucher details base on id
   * @param {object} inputParams 
   */
  loadPackVoucherDetails = (id, params) => {
    return new Promise((resolve, reject) => {
      getValuePackDetails(id, params).then(res => {
        const detailData = res.data;

        // Go to Error Page if have not data response
        if (!detailData) {
          this.props.history.push('/404');
          return resolve();
        }

        const packVoucherAllocations = detailData.packVoucherAllocations;
        const dataTable = {
          // Total items on grid table
          totalItems:  res?.totalRecord || 0,
          // Current page on paging
          currentPage: this.state.currentPage,
          // Page size on paging
          pageSize: this.state.pageSize,
          // Data on grid
          data: packVoucherAllocations,
          // Items on page
          pageOfItems: packVoucherAllocations,
        };
        const isSerialNo = packVoucherAllocations && packVoucherAllocations[0].serialNo;

        if (this.isMounting) {
          this.updateDataDetailsOnGrid(dataTable);
          this.setState({
            detailData,
            dataTable,
            isSerialNo
          });
        }
        resolve(detailData);
      });
    });
  };

  /**
   * Handle change page on paging
   * @param {*} e 
   * @param {*} page 
   */
  onChangePage = (e, page) => {
    const { pageSize } = this.state;
    const { match } = this.props;
    const searchParam = {
      currentPage: page,
      pageSize,
      countFlag: 1,
    };
    this.isMounting && this.setState({ currentPage: page}, () => {
      this.loadPackVoucherDetails(match.params.id, searchParam);
    });
  };

  /**
   * Handle change rows per page on paging
   * @param {*} e 
   */
  onChangeRowsPerPage = (e) => {
    const pageSize = e.target.value;
    const currentPage = PaginationConfiguration.currentPage;
    const { match } = this.props;
    const searchParam = {
      currentPage,
      pageSize,
      countFlag: 1,
    };

    this.isMounting && this.setState({ currentPage, pageSize}, () => {
      this.loadPackVoucherDetails(match.params.id, searchParam);
    });
  };

  componentDidMount = () => {
    const { match } = this.props;
    const { pageSize } = this.state;
    // id of records base on params URL
    const itemId = match.params.id;
    const inputParams = {
      // id: itemId || undefined,
      // Get page size
      maxResult: pageSize || undefined,
      // Get current page
      currentPage: Voucher.paginateParams.CURRENT_PAGE,
      // Get total records
      countFlag: Voucher.paginateParams.COUNT_FLAG,
    };

    this.loadPackVoucherDetails(itemId, inputParams);
  };

  componentWillUnmount() {
    this.isMounting = false;
  };

  render() {
    const { t, isDetailsPage, classes, dataDetailsOnGrid } = this.props;
    const { detailData, isSerialNo } = this.state;

    const pageHeader = {
      pageTitle: t('View Value Pack Details', {
        packNo: detailData.packNumber || '',
      }),
      showButton: false,
    };

    const listConfig = {
      // Option of Details form
      options,
      // Column in grid table
      columnsDetail,
      // Current screen is detail page
      isDetailsPage,
      // Field general information
      fieldsLabelArray: fieldsLabelArray(detailData),
      // Data grid on table
      dataDetailsOnGrid,
      // Config show paging
      showPagination: true,
      onChangePage: this.onChangePage,
      onChangeRowsPerPage: this.onChangeRowsPerPage,
      // Config hide details information
      isHideDetailsInformation: !isSerialNo
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.packVoucher}>
            <PageHeader {...pageHeader} />
            <div className={classes.searchCover}>
              <DetailForm {...listConfig} />
            </div>
          </div>
        )}
      </>
    );
  }
};

PackVoucherDetail.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
  isDetailsPage: PropTypes.any,
  updateDataDetailsOnGrid: PropTypes.any,
  match: PropTypes.object,
  dataDetailsOnGrid: PropTypes.any
};

function mapStateToProps(state) {
  return {
    // Get data details on grids from store map to props
    dataDetailsOnGrid: state.detailFormStore.dataDetailsOnGrid,
  };
}

const mapDispatchToProps = dispatch => ({
  // Update data of details information grid
  updateDataDetailsOnGrid: data =>
    dispatch({
      type: ActionType.UPDATE_DATA_DETAILS_ON_GRID,
      dataDetailsOnGrid: data,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(withStyles(useStyles)(PackVoucherDetail)));
