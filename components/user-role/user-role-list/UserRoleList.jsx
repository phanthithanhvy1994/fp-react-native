import React, { Component } from 'react';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import TableGrid from '../../shared/table-grid/table-grid.component';
import SearchForm from '../../shared/search-form/search-form.component';
import Button from '../../shared/buttons/button.component';

import { columns, options, fields, actions } from './user-role-list.config';
import {
  getAllUserRole,
  deleteUserRole,
} from '../../../actions/user-role-action';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { Message } from '../../../constants/messages';
import useStyles from '../../../style/core/user-role/user-role-list';
import { PaginationConfiguration } from '../../../constants/constants';

class UserRoleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRoleList: {},
      fieldArray: fields.map(field => ({
        ...field,
        classCustom: props.classes.fieldRoleName,
      })),
      pageSize: PaginationConfiguration.itemsPerPage,
      currentPage: PaginationConfiguration.currentPage,
      searchParams: {},
    };
  }

  componentDidMount() {
    // this.getUserRoles();
  }

  getUserRoles() {
    const { pageSize, currentPage, searchParams } = this.state;
    const body = {
      deleteFlag: 0,
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...searchParams,
    };

    getAllUserRole(body).then(res => {
      const userRoleList = {
        data: res.data,
        totalItems: res.totalRecord,
        currentPage,
        pageSize,
      };
      this.setState({ userRoleList });
    });
  }

  showMessageConfirmation = item => {
    openDialog({
      title: Message.DELETE_CONFIRM_TITLE,
      content: Message.DELETE_CONFIRM,
      actions: [
        {
          name: this.props.t('Ok'),
          type: dialogConstant.button.FUNCTION,
          className: buttonConstant.type.PRIMARY,
          action: () => {
            const inputParams = {
              roleId: item.roleId,
            };
            deleteUserRole(inputParams).then(() => {
              this.getUserRoles();
            });
          },
        },
        {
          name: this.props.t('Cancel'),
          type: dialogConstant.button.NO_FUNCTION,
          className: buttonConstant.type.PRIMARY,
        },
      ],
    });
  };

  onSearch = searchFields => {
    const searchParams = {
      roleName: {
        like: searchFields.roleName,
      },
      description: {
        like: searchFields.description,
      },
    };
    this.setState({ searchParams, currentPage: 1 }, () => this.getUserRoles());
  };

  onChangePage = (e, page) => {
    this.setState({ currentPage: page }, () => {
      this.getUserRoles();
    });
  };

  onChangeRowsPerPage = e => {
    const pageSize = e.target.value;
    this.setState({ pageSize, currentPage: 1 }, () => {
      this.getUserRoles();
    });
  };

  goToEditPage = roleId => {
    this.props.history.push(`/user-role/edit/${roleId}`);
  };

  render() {
    const { t, classes, history } = this.props;
    const { userRoleList, fieldArray } = this.state;

    return (
      <div>
        <div className={`${classes.titlePage} subtitle`}>
          {t('User Role List')}
          <Button
            title={t('Create user role')}
            className="btnPrimary"
            classCustom={classes.btnAdd}
            icon={faPlus}
            isFontAwesome={true}
            handleClick={() => history.push('/user-role/create')}
          />
        </div>
        <div className={classes.searchCover}>
          <SearchForm
            fieldArray={fieldArray}
            onSearch={this.onSearch}
            rowSize={4}
          />
        </div>
        <TableGrid
          columns={columns}
          dataTable={userRoleList}
          options={options}
          actions={actions(this.showMessageConfirmation, this.goToEditPage)}
          onChangePage={(e, page) => this.onChangePage(e, page)}
          onChangeRowsPerPage={e => this.onChangeRowsPerPage(e)}
          className="even-odd-columns"
        />
      </div>
    );
  }
}
UserRoleList.propTypes = {
  t: PropTypes.any,
  i18n: PropTypes.any,
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withTranslation()(withStyles(useStyles)(UserRoleList));
