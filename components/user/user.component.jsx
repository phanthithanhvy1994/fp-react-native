import React, { useEffect, useState, useCallback } from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import SearchForm from '../shared/search-form/search-form.component';

import { 
  fields,
  options,
  columnsDefault,
  action
} from './search-area/user-search-fields';
// import validation from './search-area/user-search-valid';
import PageHeader from '../shared/page-header/page-header.component';
import useStyles from './user-list.style';
import { withStyles } from '@material-ui/styles';
import TableGrid from '../shared/table-grid/table-grid.component';
import { openDialog } from '../../redux/message-dialog/message-dialog.actions';
import { Message } from '../../constants/messages';
import {
  Action,
  UserConstant,
  dialogConstant,
  PaginationConfiguration
} from '../../constants/constants';
import { buttonConstant } from '../../util/constant';
import {
  getBranch,
  getUserList
} from '../../actions/user-action';
import {
  formatDropdownList,
} from '../../util/format-util';
import {
  mapPropertyForRequestParams,
  setPropertyForRequestParams,
  setDateRangeRequestParams,
} from '../shared/search-form/search-form.common';

// import './user.style.scss';

function User(props) {
  const { classes, history } = props;
  const [field, setField] = useState([...fields]);
  const [searchParams, setSearchParams] = useState({});
  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );
  const [userList, setUserList] = useState({});

  const onSearch = searchFields => {
    setSearchParams(searchFields);
    setCurrentPage(1);
  };

  useEffect(() => {
    Promise.all([
      getBranch()
    ]).then(res => {
      const newField = [...fields];
      newField.map(item => {
        if (item.fieldName === 'roleCode') {
          item.data = formatDropdownList(res[0].data);
        }
        if (item.fieldName === 'branchCode') {
          item.data = formatDropdownList(res[0].data);
        }
        if (item.fieldName === 'departmentCode') {
          item.data = formatDropdownList(res[0].data);
        }
        if (item.fieldName === 'accountStatus') {
          item.data = formatDropdownList(res[0].data);
        }
        return item;
      });
      setField(newField);
    });
  }, []);

  const getUser = useCallback(() => {
    let params = {
      pageSize: pageSize,
      maxResult: pageSize,
      deleteFlag: 0,
      countFlag: PaginationConfiguration.countFlag,
    };
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.userCode
    );
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.fullName
    );
    params = mapPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.roleCode
    );
    params = mapPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.branchCode
    );
    params = mapPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.departmentCode
    );
    params = setDateRangeRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.telephone
    );
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.email
    );
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.position
    );
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.division
    );
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.employeeID
    );
    params = setPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.username
    );
    params = mapPropertyForRequestParams(
      params,
      searchParams,
      UserConstant.searchFieldName.accountStatus
    );
    const filteredSearchParams = params;

    const body = {
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...filteredSearchParams,
    };

    //Load user list with condition search
    getUserList(body).then(res => {
      setUserList({
        ...res.data,
        data: res.data || [],
        totalItems: res.totalRecord || 0,
        currentPage,
        pageSize,
      });
    });
  }, [currentPage, pageSize, searchParams]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  /**
 * Go to detail page
 * @param {*} item 
 */
  const goToDetailPage = (item) => {
    history.push(`/account/user-list/detail/${item.id}`);
  };
  
  /**
   * Go to edit page
   * @param {*} item 
   */
  const goToEditPage = (item) => {
    history.push(`/account/user-list/edit/${item.id}`);
  };
  
  /**
  * Go to page create 
  */
  const goToNewPage = () => {
    history.push('/account/user-list/create');
  };

  /**
 * Pop up confirm delete item base on packNumber
 * @param {*} item
 */
  const confirmDeleteItem = (item) => {
    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      //TO DO
      content: Message.USER.DELETE_CONFIRM,
      actions: [
        {
          name: Action.cancel,
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.CANCEL,
        },
        {
          name: Action.ok,
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            console.log('Delete');
          },
        },
      ],
    });
  };

  /**
 * Event change page
 * @param {*} e 
 * @param {*} page 
 */
  const onChangePage = (e, page) => {
    setCurrentPage(page);
  };
  
  /**
   * Event change row page
   * @param {*} e 
   */
  const onChangeRowsPerPage = e => {
    const newPageSize = e.target.value;

    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const pageHeader = {
    pageTitle: 'User List',
    showButton: true,
    buttonTitle: 'Create User',
    buttonCustomClass: classes.btnAdd,
    buttonAction: () => goToNewPage(),
  };
  return (
    <>
      <div>
        <PageHeader {...pageHeader} />
        <div className={classes.searchUserCover}>
          <SearchForm
            fieldArray={field}
            onSearch={onSearch}
            classCustom="user-search-bar"
            rowSize={3}
          />

          <TableGrid
            defaultStyle={true}
            dataTable={userList}
            options={options}
            columns={columnsDefault}
            actions={action(
              goToDetailPage,
              goToEditPage,
              confirmDeleteItem)}
            className="even-odd-columns"
            onChangePage={(e, page) => onChangePage(e, page)}
            onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
          />
        </div>
      </div>
    </>
  );
}

User.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(User));
