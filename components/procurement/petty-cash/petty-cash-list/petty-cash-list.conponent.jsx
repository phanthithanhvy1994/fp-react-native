import React, { useCallback, useEffect, useRef, useState } from 'react';
import { withStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { getAllBranchCombo } from '../../../../actions/branch.action';
import { dialogConstant, PaginationConfiguration } from '../../../../constants/constants';
import { Message } from '../../../../constants/messages';
import { openDialog } from '../../../../redux/message-dialog/message-dialog.actions';
import { buttonConstant } from '../../../../util/constant';
import { convertToDateServerFormat } from '../../../../util/date-util';
import { formatDropdownList } from '../../../../util/format-util';
import PageHeader from '../../../shared/page-header/page-header.component';
import SearchForm from '../../../shared/search-form/search-form.component';
import TableGrid from '../../../shared/table-grid/table-grid.component';
import {
  actions,
  columns,
  fields,
  options
} from './petty-cash-list.config';
import {
  getPettyCashList,
  deletePettyCash,
} from '../../../../actions/petty-cash-action';
import useStyles from './petty-cash-list.style';

const PettyCashList = props => {
  const {
    t,
    classes,
    history,
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
    
  const loadPettyCashList = useCallback(() => {
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
    getPettyCashList(body)
      .then(res => 
      // then setPettyCashList
        setPettyCashList({
          data: res.data,
          totalItems:  0,
          currentPage,
          pageSize,
        })
      );
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

  const showDeleteMessageConfirmation = data =>{
    const detailNo = data.pettyCashId;
    openDialog({
      title: Message.CONFIRM,
      type: dialogConstant.type.CONFIRM,
      content: Message.DELETE_CONFIRM_INSTANCE.replace(
        '%INSTANCE%',
        `Petty Cash ${detailNo ? ` <NO. ${detailNo}>` : ''}`
      ),
      actions: [
        {
          name: t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
        {
          name: t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => deletePettyCash({id: detailNo})
            .then(res=> loadPettyCashList())
            .catch(res =>  openDialog({
              title: Message.warning,
              content: Message.DELETE_UNSUCCESSFULLY,
            }))
          ,
        },
      ],
    });
  };
  const goToEditPage = pettyCashId =>{
    history.push(
      `/procurement/petty-cash-at-branch/edit/${pettyCashId}`
    );
  };

  const goToDetailPage = pettyCashId =>{
    history.push(
      `/procurement/petty-cash-at-branch/detail/${pettyCashId}`
    );
  };

  const handleDisableActionButton = data =>{};
    
  useEffect(() => {
    loadPettyCashList();
  }, [loadPettyCashList]);
    
  useEffect(()=>{
    getAllBranchCombo().then(res =>
      setFieldArray((oldState)=>{
        const oldStateField= [...oldState];
        oldStateField[0].data= formatDropdownList(res.data);
        return oldStateField;
      }));
  },[]);

  //
  const goToAddPOPettyCash =()=>{
    history.push('/procurement/petty-cash-at-branch/create');
  };
    
  const headerConfigs = {
    pageTitle: t('Petty Cash List (At Branch)'),
    showButton: true,
    buttonTitle: 'Create PO Petty Cash',
    buttonCustomClass: classes.btnAdd,
    buttonAction: () => goToAddPOPettyCash(),
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
        dataTable={pettyCashList}
        options={options}
        className="even-odd-columns"
        onChangePage={(e, page) => onChangePage(e, page)}
        onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
        actions={actions(
          showDeleteMessageConfirmation,
          goToEditPage,
          goToDetailPage,
          handleDisableActionButton
        )}
      />
    </div>
  );
};

PettyCashList.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.any,
  history: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(PettyCashList));
