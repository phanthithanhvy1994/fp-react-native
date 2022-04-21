import React, { useEffect, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core';

import {
  columns,
  options,
  fields,
  importHeaders
} from './petty-cash-list-head-office.config';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from './petty-cash-list-head-office.style';
import { PaginationConfiguration } from '../../../../constants/constants';
import { convertToDateServerFormat } from '../../../../util/date-util';
import { getAllBranchCombo } from '../../../../actions/branch.action';
import Button from '../../../shared/buttons/button.component';
import ImportDataComponent from '../../../shared/import-data/import-data.component';
import ImportIcon from '../../../../assets/importIcon.svg';

import Box from '@material-ui/core/Box';
import { formatDropdownList } from '../../../../util/format-util';

const PettyCashListHeadOffice = props => {
  const {
    t,
    classes,
  } = props;

  const [pettyCashList, setPettyCashList] = useState({});
  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  const [fieldArray, setFieldArray] = useState(fields);
  const [searchParams, setSearchParams] = useState({});
  const pettyCashRef = useRef();

  const getPettyCash = useCallback(() => {
    const filteredSearchParams = {
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
    };
    const body = {
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...filteredSearchParams,
    };
    //call api get list petty cash
    // then setPettyCashList
    setPettyCashList({
      data:[],
      totalItems:  0,
      currentPage,
      pageSize,
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
    getPettyCash();
  }, [getPettyCash]);

  useEffect(()=>{
    getAllBranchCombo().then(res =>
      setFieldArray((oldState)=>{
        const oldStateField= [...oldState];
        oldStateField[0].data = formatDropdownList(res.data);
        return oldStateField;
      }));
  },[]);

  //handle import data
  const handleImportData = (data) => {
  };

  const onSubmitImportData = data => {
  };

  const headerConfigs = {
    pageTitle: t('Petty Cash List ( Head Office )'),
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
      <Box className={classes.priceListToolBar} m={4}>
        <ImportDataComponent
          headers={importHeaders}
          updateImportData={handleImportData}
          ref={pettyCashRef}
        />

        <span onClick={onSubmitImportData}>
          <Button
            classCustom={classes.btnSecondaryTextOnly}
            type={null}
            title={t('Submit Reimbursement')}
            iconImg={ImportIcon}
          />
        </span>
      </Box>
      <TableGrid
        defaultStyle={true}
        columns={columns}
        dataTable={pettyCashList}
        options={options}
        className="even-odd-columns"
        onChangePage={(e, page) => onChangePage(e, page)}
        onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
      />
    </div>
  );
};

PettyCashListHeadOffice.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(PettyCashListHeadOffice));
