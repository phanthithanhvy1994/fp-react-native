import React from 'react';
import { Box, withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import PageHeader from '../../shared/page-header/page-header.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import useStyles from './value-pack-list.style';
import Button from '../../shared/buttons/button.component';
import { Message } from '../../../constants/messages';
import { withTranslation } from 'react-i18next';
import ExportDataComponent from '../../shared/export-data/export-data.component';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { buttonConstant } from '../../../util/constant';
import { formatComboBox } from '../../../util/format-util';
import SearchForm from '../../shared/search-form/search-form.component';
import {
  getPackValueList,
  getValuePackTypeStatus,
  deletePackValue,
} from '../../../actions/voucher-action';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
} from '../../shared/search-form/search-form.common';
import {
  fields,
  columnsDetail,
  actions,
  options,
  exportConfigs,
} from './value-pack-list.config';
import {
  PaginationConfiguration,
  PackVoucherConstant,
  ButtonConstant,
  dialogConstant,
} from '../../../constants/constants';

class ValuePackList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      packValueList: {},
      fieldsArray: [...fields],
      currentPage: PaginationConfiguration.currentPage,
      pageSize: PaginationConfiguration.itemsPerPage,
      searchFieldsParam: null,
      dataExport: [],
      exportFieldData: [],
    };
    this.isMounting = true;
  }

  /**
   * Load list pack value on table grid
   * @param {*} body
   */
  loadDataPackValueList = (body) => {
    const { currentPage, pageSize } = this.state;
    let params = body;

    // If params is empty, set config to params before call request
    if (!params) {
      params = {
        maxResult: pageSize,
        countFlag: PaginationConfiguration.countFlag,
        currentPage,
      };

      // Check when will unmount
      if (this.isMounting) {
        this.setState({
          searchFieldsParam: params,
        });
      }
    }

    // Call request get list pack value
    getPackValueList(params).then((res) => {
      const packValueData = {
        totalItems: res?.totalRecord || 0,
        currentPage,
        pageSize,
        data: res.data || [],
      };

      if (this.isMounting) {
        this.setState({
          packValueList: packValueData,
        });
      }
    });
  };

  /**
   * Get combo by class: status of pack value
   */
  loadPackValueStatus = () => {
    const { fieldsArray } = this.state;
    const { statusName } = PackVoucherConstant.searchFieldName;

    // Call request get combo status
    getValuePackTypeStatus().then((res) => {
      const data = formatComboBox(res?.data);

      fieldsArray.find((obj) => obj.fieldName === statusName)['data'] = data;
      if (this.isMounting) {
        this.setState({
          fieldsArray,
        });
      }
    });
  };

  componentDidMount = () => {
    this.loadDataPackValueList();
    this.loadPackValueStatus();
  };

  componentWillUnmount() {
    this.isMounting = false;
  }

  /**
   * Handle when clicking search btn on search form
   * @param {Object} searchFields
   */
  onSearch = (searchFields) => {
    const inputParams = this.getSearchParams(searchFields);

    this.setState({
      searchFieldsParam: inputParams,
    });
    this.loadDataPackValueList(inputParams);
  };

  /**
   * Set request params and only push the property which has value into request params
   * @param {Object} fieldArr search fields on search form
   */
  getSearchParams = (fieldArr) => {
    const { currentPage, pageSize } = this.state;
    let params = {
      currentPage,
      maxResult: pageSize,
      countFlag: PaginationConfiguration.countFlag,
    };

    params = setPropertyForRequestParams(
      params,
      fieldArr,
      PackVoucherConstant.searchFieldName.packNumber,
      PackVoucherConstant.searchFieldName.packNumberCustom
    );
    params = setPropertyForRequestParams(
      params,
      fieldArr,
      PackVoucherConstant.searchFieldName.packName,
      PackVoucherConstant.searchFieldName.packNameCustom,
    );
    params = mapPropertyForRequestParams(
      params,
      fieldArr,
      PackVoucherConstant.searchFieldName.statusName,
      PackVoucherConstant.searchFieldName.statusNameCustom,
    );
    return params;
  };

  /**
   * Handle change current page
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
    };
    this.isMounting && this.setState({ currentPage: page, searchFieldsParam }, () => {
      this.loadDataPackValueList(searchParam);
    });
  };

  /**
   * Handle change rows per page
   * @param {*} e
   */
  onChangeRowsPerPage = (e) => {
    const { searchFieldsParam } = this.state;
    const pageSize = e.target.value;
    const currentPage = 1;
    const searchParam = {
      ...searchFieldsParam,
      currentPage,
      maxResult: pageSize,
      countFlag: 1,
    };
    this.isMounting && this.setState({ pageSize, currentPage, searchFieldsParam }, () => {
      this.loadDataPackValueList(searchParam);
    });
  };

  /**
   * Handle go to details value pack base on packNumber record
   * @param {*} item
   */
  goToDetailPage = (item) => {
    const { history } = this.props;

    history.push(
      `/voucher-management/value-pack-list/value-pack-detail/${item.packVoucherId}`
    );
  };

  /**
   * Pop up confirm delete item base on packNumber
   * @param {*} item
   */
  confirmDeleteItem = (item) => {
    const msg = Message.VOUCHER.CONFIRM_DELETE_VALUE_PACK;

    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      content: msg.replace('%VPNo%', item.packNumber),
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
            const inputParams = {
              id: item.packVoucherId,
            };
            deletePackValue(inputParams).then(() => {
              this.loadDataPackValueList();
            });
          },
        },
      ],
    });
  };

  /**
   * Handle go to value pack allocation
   */
  goToValuePackAllocation = () => {
    const { history } = this.props;

    history.push('/voucher-management/value-pack-list/allocation');
  };

  /**
   * Handle go to create new value pack
   */
  goToCreateNewValuePack = () => {
    const { history } = this.props;

    history.push('/voucher-management/value-pack-list/create-new-value-pack');
  };

  /**
   * Handle select row when export file
   * @param {*} checkedRows
   */
  handleRowSelect = (checkedRows) => {
    const { packValueList } = this.state;
    const dataListExport = checkedRows.map((row) => row.packVoucherId);
    const dataExport = packValueList.data?.filter(
      (item) => (dataListExport.includes(item.packVoucherId)))?.map(
      (packValue) => ({
        packNumber: packValue.packNumber,
        packName: packValue.packName,
        totalValue: packValue.totalValue,
        status: packValue.statusName,
        note: packValue.note,
      })
    );
    this.setState({
      dataExport
    });
  };

  render() {
    const { classes, t, history } = this.props;
    const { packValueList, fieldsArray, dataExport } = this.state;

    const pageHeader = {
      pageTitle: t('Value Pack List'),
      showButton: false,
      customContent: (
        <div className="btn-group">
          <Button
            title={t('Create New Value Pack')}
            className={'btnSecondary'}
            handleClick={() => {
              this.goToCreateNewValuePack();
            }}
          />
          <Button
            title={t('Value Pack Allocation')}
            className="btnSecondary"
            classCustom={classes.btnAdd}
            isFontAwesome={true}
            handleClick={() =>
              history.push('/voucher-management/value-pack-list/allocation')
            }
          />
        </div>
      ),
    };

    return (
      <>
        {this.isMounting && (
          <div className={classes.packValueList}>
            <PageHeader {...pageHeader} />

            <div className={classes.searchCover}>
              <SearchForm
                fieldArray={fieldsArray}
                onSearch={this.onSearch}
                classCustom={'user-search-bar'}
                isPopup={true}
              ></SearchForm>
            </div>

            <Box className={classes.voucherPackListToolBar} m={4}>
              <ExportDataComponent
                // classCustom={classes.btnSearch}
                className={ButtonConstant.type.NEUTRAL}
                data={dataExport}
                {...exportConfigs}
                typeExport={true}
                title={t('Export')}
                isFontAwesome={true}
              />
            </Box>

            <TableGrid
              defaultStyle={true}
              dataTable={packValueList}
              options={options}
              columns={columnsDetail}
              actions={actions(
                this.goToDetailPage,
                this.confirmDeleteItem,
                this.goToValuePackAllocation
              )}
              className="even-odd-columns"
              onChangePage={(e, page) => this.onChangePage(e, page)}
              onChangeRowsPerPage={(e) => this.onChangeRowsPerPage(e)}
              handleRowSelect={this.handleRowSelect}
            />
          </div>
        )}
      </>
    );
  }
}

ValuePackList.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(ValuePackList));
