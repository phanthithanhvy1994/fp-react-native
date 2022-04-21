import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import TableGrid from '../../shared/table-grid/table-grid.component';
import SearchForm from '../../shared/search-form/search-form.component';
import {
  columns,
  options,
  fields,
  actions,
  validation,
} from './branch-bom-price-list.config';
import useStyles from './branch-bom-price-list.style';
import { PaginationConfiguration } from '../../../constants/constants';
import BranchBOMPriceAdd from './branch-bom-price-add/branch-bom-price-add.component';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import PageHeader from '../../shared/page-header/page-header.component';

import { getDataCompanyCode } from '../../../actions/branch-bom-action';
import {
  getAllBranchBOMPrice,
  getAllStatus,
  deleteBranchBOMPrice,
} from '../../../actions/branch-bom-price.action';
import { getAllBranchGroup } from '../../../actions/branch-group.action';
import { getAllChannel } from '../../../actions/channel.action';
import { convertToDateServerFormat } from '../../../util/date-time.util';
import { showError } from './branch-bom-price.util';

import {
  BRANCH_GROUP,
  SEARCH_CHANNEL,
  STATUS,
  COMPANY_CODE,
} from './branch-bom-price.constant';
import { formatDropdownList, formatComboBox } from '../../../util/format-util';

const BranchBOMPriceList = (props) => {
  const { t } = useTranslation();
  const { classes } = props;

  const [branchBOMPriceList, setBranchBOMPriceList] = useState({});
  const [collapsedSearchArea, setCollapsedSearchArea] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );

  const [fieldArray, setFieldArray] = useState(
    fields.map((field) => ({
      ...field,
    }))
  );

  const [searchParams, setSearchParams] = useState({});

  const getBranchBOMPrices = useCallback(() => {
    const filteredSearchParams = {
      bomPrice:
        searchParams.bomPrice?.length > 0
          ? searchParams.bomPrice?.trim()
          : undefined,
      startDate: {
        ge: convertToDateServerFormat(searchParams.startDate?.ge) || undefined,
        le: convertToDateServerFormat(searchParams.startDate?.le) || undefined,
      },
      searchChannel: {
        in:
          (Array.isArray(searchParams.searchChannel) &&
            searchParams.searchChannel.map((param) => param.value)) ||
          undefined,
      },
      status: {
        in:
          (Array.isArray(searchParams.status) &&
            searchParams.status.map((param) => param.value)) ||
          undefined,
      },
      branchGroup: {
        in:
          (Array.isArray(searchParams.branchGroup) &&
            searchParams.branchGroup.map((param) => param.value)) ||
          undefined,
      },
      companyCode: {
        in:
          (Array.isArray(searchParams.companyCode) &&
            searchParams.companyCode.map((param) => param.value)) ||
          undefined,
      },
    };

    const body = {
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...filteredSearchParams,
    };

    getAllBranchBOMPrice(body).then((res) => {
      setBranchBOMPriceList({
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

  useEffect(() => {
    getBranchBOMPrices();
  }, [getBranchBOMPrices]);

  useEffect(() => {
    // Get combobox data and reload into state
    Promise.all([
      getAllBranchGroup(),
      getAllChannel(),
      getAllStatus(),
      getDataCompanyCode(),
    ]).then((res) => {
      setFieldArray((oldState) => {
        const data = [...oldState];
        // Rebuild Branch group
        data.find((obj) => obj.fieldName === BRANCH_GROUP)[
          'data'
        ] = formatDropdownList(res[0].data);

        // Rebuild Channel
        data.find((obj) => obj.fieldName === SEARCH_CHANNEL)[
          'data'
        ] = formatComboBox(res[1].data);

        // Rebuild Status
        data.find((obj) => obj.fieldName === STATUS)['data'] = formatComboBox(
          res[2].data
        );

        // Rebuild Company Code
        data.find((obj) => obj.fieldName === COMPANY_CODE)[
          'data'
        ] = formatDropdownList(res[3].data);

        return [...data];
      });
    });
  }, []);

  const goToDetailPage = (branchBOMPrice) => {
    props.history.push({
      pathname: `/catalog/branch-bom-price/detail/${branchBOMPrice.bomPriceId}`,
      state: {
        id: branchBOMPrice.bomPriceId,
      },
    });
  };

  const goToEditPage = (branchBOMPrice) => {
    props.history.push({
      pathname: `/catalog/branch-bom-price/edit/${branchBOMPrice.bomPriceId}`,
      state: {
        id: branchBOMPrice.bomPriceId,
      },
    });
  };

  const confirmDelete = (branchBOMPrice) => {
    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      content: Message.DELETE_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `Price List: <${branchBOMPrice.bomPriceName}>`
      ),
      actions: [
        {
          name: 'Cancel',
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: 'OK',
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            const body = {
              id: branchBOMPrice.bomPriceId,
            };
            deleteBranchBOMPrice(body).then(
              (res) => {
                if (res.status === '200') {
                  getBranchBOMPrices();
                }
              },
              (err) => {
                showError(err.messages[0].messageContent);
              }
            );
          },
        },
      ],
    });
  };

  const getCollapsedState = (collapsedState) => {
    setCollapsedSearchArea(collapsedState);
  };

  const pageHeaderConfigs = {
    pageTitle: t('Branch BOM Price List'),
    showButton: false,
    customContent: (
      <BranchBOMPriceAdd
        onSave={getBranchBOMPrices}
        BOMPriceList={branchBOMPriceList.data}
      />
    ),
  };

  return (
    <div>
      <PageHeader {...pageHeaderConfigs} />

      <div className={classes.searchCover}>
        <SearchForm
          fieldArray={fieldArray}
          onSearch={onSearch}
          classCustom="user-search-bar"
          validation={validation}
          getCollapsedState={getCollapsedState}
        />
      </div>
      <div className={`${classes.BOMPriceList} ${collapsedSearchArea ? 'collapsed-search-area' : ''}`}>
        <TableGrid
          columns={columns}
          dataTable={branchBOMPriceList}
          options={options}
          defaultStyle={true}
          className="even-odd-columns"
          onChangePage={(e, page) => onChangePage(e, page)}
          onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
          actions={actions(goToDetailPage, goToEditPage, confirmDelete)}
        />
      </div>
    </div>
  );
};

BranchBOMPriceList.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withStyles(useStyles)(BranchBOMPriceList));
