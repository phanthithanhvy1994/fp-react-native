import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import SearchForm from '../../shared/search-form/search-form.component';
import TableGrid from '../../shared/table-grid/table-grid.component';
import PageHeader from '../../shared/page-header/page-header.component';
import useStyles from './delivery-order-list.style';

import {
  columns,
  options,
  fields,
  actions,
} from './delivery-order-list.config';
import {
  getAllDeliveryOrder,
  getDeliveryOrderStatus,
  getDeliveryOrderType,
} from '../../../actions/delivery-order.action';
import { getAllBranchCombo } from '../../../actions/branch.action';
import { PaginationConfiguration } from '../../../constants/constants';
import { BRANCH, STATUS, TYPE } from './delivery-order.constant';

import { convertToDateServerFormat } from '../../../util/date-time.util';
import { formatDropdownList, formatComboBox } from '../../../util/format-util';

const DeliveryOrderList = (props) => {
  const { t } = useTranslation();
  const { classes } = props;

  const [deliveryOrderList, setDeliveryOrderList] = useState({});
  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  const [fieldArray, setFieldArray] = useState(
    fields.map((field) => ({
      ...field,
      classCustom: props.classes.fieldRoleName,
    }))
  );
  const [searchParams, setSearchParams] = useState({});

  const getDeliveryOrders = useCallback(() => {
    const filteredSearchParams = {
      poNumber: {
        like:
          searchParams.poNumber?.length > 0
            ? searchParams.poNumber?.trim()
            : undefined,
      },
      doNumber: {
        like:
          searchParams.doNumber?.length > 0
            ? searchParams.doNumber?.trim()
            : undefined,
      },
      status: {
        in:
          (Array.isArray(searchParams.status) &&
            searchParams.status.map((param) => param.value)) ||
          undefined,
      },
      type: {
        in:
          (Array.isArray(searchParams.doType) &&
            searchParams.doType.map((param) => param.value)) ||
          undefined,
      },
      branch: {
        in:
          (Array.isArray(searchParams.branchCode) &&
            searchParams.branchCode.map((param) => param.value)) ||
          undefined,
      },
      createdDate: {
        ge: convertToDateServerFormat(searchParams.createdDate?.ge) || undefined,
        le: convertToDateServerFormat(searchParams.createdDate?.le) || undefined,
      },
      deliveryDate: {
        ge:
        convertToDateServerFormat(searchParams.deliveryDate?.ge) || undefined,
        le:
        convertToDateServerFormat(searchParams.deliveryDate?.le) || undefined,
      },
      shipmentNo: {
        like:
          searchParams.shipmentNo?.length > 0
            ? searchParams.shipmentNo?.trim()
            : undefined,
      },
      yourRefer: {
        like:
          searchParams.yourRefer?.length > 0
            ? searchParams.yourRefer?.trim()
            : undefined,
      },
      ourRefer: {
        like:
          searchParams.ourRefer?.length > 0
            ? searchParams.ourRefer?.trim()
            : undefined,
      },
      materialDescription: {
        like:
          searchParams.materialDescription?.length > 0
            ? searchParams.materialDescription?.trim()
            : undefined,
      },
      sorters: [{'direction':'DESC','property':'createdDate'}],
    };

    const body = {
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...filteredSearchParams,
    };

    getAllDeliveryOrder(body).then((res) => {
      setDeliveryOrderList({
        data: res.data || [],
        totalItems: res.totalRecord || 0,
        currentPage,
        pageSize,
      });
    });
  }, [currentPage, pageSize, searchParams]);

  const onSearch = (searchFields) => {
    setSearchParams(searchFields);
    setCurrentPage(1);
  };

  const onChangePage = (e, page) => {
    setCurrentPage(page);
  };

  const onChangeRowsPerPage = (e) => {
    const newPageSize = e.target.value;

    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const goToDetailPage = (deliveryOrder) => {
    props.history.push({
      pathname: `/procurement/delivery-order/detail/${deliveryOrder.doId}`,
      state: { id: deliveryOrder.doId },
    });
  };

  useEffect(() => {
    getDeliveryOrders();
  }, [getDeliveryOrders]);

  useEffect(() => {
    // Get combobox data and reload into state
    Promise.all([
      getAllBranchCombo(),
      getDeliveryOrderStatus(),
      getDeliveryOrderType(),
    ]).then((res) => {
      setFieldArray((oldState) => {
        const data = [...oldState];
        // Rebuild Branch
        data.find((obj) => obj.fieldName === BRANCH)[
          'data'
        ] = formatDropdownList(res[0].data);

        // Rebuild Status
        data.find((obj) => obj.fieldName === STATUS)['data'] = formatComboBox(
          res[1].data
        );
        // Rebuild Type
        data.find((obj) => obj.fieldName === TYPE)['data'] = formatComboBox(
          res[2].data
        );
        return [...data];
      });
    });
  }, []);

  const headerConfigs = {
    pageTitle: t('Delivery Order List'),
    showButton: false,
  };

  return (
    <div>
      <PageHeader {...headerConfigs} />

      <div className={classes.searchCover}>
        <SearchForm
          fieldArray={fieldArray}
          onSearch={onSearch}
          classCustom="user-search-bar"
        />
      </div>
      <TableGrid
        defaultStyle={true}
        columns={columns}
        dataTable={deliveryOrderList}
        options={options}
        className="even-odd-columns"
        onChangePage={(e, page) => onChangePage(e, page)}
        onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
        actions={actions(goToDetailPage)}
      />
    </div>
  );
};

DeliveryOrderList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withStyles(useStyles)(DeliveryOrderList));
