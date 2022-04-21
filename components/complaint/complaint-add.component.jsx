import React from 'react';
import isEmpty from 'lodash/isEmpty';
import SaveIcon from '@material-ui/icons/Save';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import find from 'lodash/find';
import { columns, options } from './complaint.config';
import TableGrid from '../shared/table-grid/table-grid.component';
import userService from '../../services/user-service';
import Button from '../shared/buttons/button.component';
import Fieldset from '../shared/fieldset/fieldset.component';
import './complaint.styles.scss';

export default class UserRole extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.state = {
      columnsUserRole: columns,
      userRoleList: [],
      itemsPerPage: 5,
    };
  }

  componentDidMount() {
    this.getUserRoleList(1);
  }

  getUserRoleList = (page = 1) => {
    const { itemsPerPage } = this.state;
    const param = {
      page,
      itemsPerPage,
    };
    userService.getUserRoleList(param).then(res => {
      this.setState({ userRoleList: res });
    });
  };

  onChangePage = (e, page) => {
    this.getUserRoleList(page);
  };

  onChangeRowsPerPage = e => {
    const itemsPerPage = e.target.value;

    this.setState({ itemsPerPage }, () => {
      this.getUserRoleList(1);
    });
  };

  attachFiles = (rowData, attachFiles) => {
    const { userRoleList } = this.state;
    const user = find(
      userRoleList.data,
      item => item.roleId === rowData.roleId
    );
    user.attachFiles = attachFiles;
  };

  deleteRow = oldData => {
    const { userRoleList } = this.state;
    const dataTemp = [...userRoleList.data];
    dataTemp.splice(dataTemp.indexOf(oldData), 1);
    userRoleList.data = dataTemp;

    return new Promise(resolve => {
      resolve();
      this.setState({ userRoleList });
    });
  };

  addComplaint = () => {
    console.log(this.tableRef);
  };

  render() {
    const { columnsUserRole, userRoleList } = this.state;
    return (
      <div className="complaint-add">
        {!isEmpty(userRoleList) ? (
          <Fieldset title="Details Information">
            <TableGrid
              ref={this.tableRef}
              columns={columnsUserRole(this.attachFiles)}
              dataTable={userRoleList}
              options={options}
              onChangePage={(e, page) => this.onChangePage(e, page)}
              onChangeRowsPerPage={e => this.onChangeRowsPerPage(e)}
              editable={{
                onRowDelete: oldData => this.deleteRow(oldData),
              }}
              hidePagination
              className="table"
              classCustom="tableNoneBorder"
            />
          </Fieldset>
        ) : (
          ''
        )}
        <div className="btn-group">
          <Button
            handleClick={this.addComplaint}
            title="Submit"
            className="btnPrimary"
            icon={faPaperPlane}
            isFontAwesome
          />
          <Button
            handleClick={this.addComplaint}
            title="Save"
            icon={<SaveIcon />}
            className="btnPrimary"
          />
        </div>
      </div>
    );
  }
}
