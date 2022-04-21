import React, { useEffect, useState, useCallback } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import useStyles from './branch-bom-group-list.style';

import TableGrid from '../../shared/table-grid/table-grid.component';
import SearchForm from '../../shared/search-form/search-form.component';
import PageHeader from '../../shared/page-header/page-header.component';

import {
  columns,
  options,
  fields,
  actions,
} from './branch-bom-group-list.config';
import { PaginationConfiguration, BranchBOM } from '../../../constants/constants';
import { Message } from '../../../constants/messages';
import { dialogConstant, buttonConstant } from '../../../util/constant';
import { openDialog } from '../../../redux/message-dialog/message-dialog.actions';

import { showError } from './branch-bom-group.util';
import {
  getAllBranchBOMGroup,
  deleteBranchBOMGroup,
  getBranchBOMGroup
} from '../../../actions/branch-bom-group.action';
import { getDataBomBranchLevelType } from '../../../actions/branch-bom-action';

import { formatComboBox } from '../../../util/format-util';

const BranchBOMGroupList = (props) => {
  const { t } = useTranslation();
  const { classes } = props;

  const [branchBOMGroupList, setBranchBOMGroupList] = useState({});
  const [currentPage, setCurrentPage] = useState(
    PaginationConfiguration.currentPage
  );
  const [pageSize, setPageSize] = useState(
    PaginationConfiguration.itemsPerPage
  );

  const [fieldArray, setFieldArray] = useState(
    fields.map((field) => ({
      ...field,
      classCustom: `${props.classes.fieldRoleName} ${field.classCustom}`,
    }))
  );

  const [searchParams, setSearchParams] = useState({});

  const getBranchBOMGroups = useCallback(() => {
    const body = {
      maxResult: pageSize,
      currentPage,
      countFlag: PaginationConfiguration.countFlag,
      ...searchParams,
    };

    body['bomGroupCode'] = {
      like: searchParams.bomGroupCode?.trim() || undefined,
    };

    body['bomGroupName'] = {
      like: searchParams.bomGroupName?.trim() || undefined,
    };

    body['level'] = {
      in: BranchBOM.levels.level_2
      // (Array.isArray(searchParams.level) &&
      //   searchParams.level.map((param) => +param.value)) ||
      // undefined,
    };

    getAllBranchBOMGroup(body).then((res) => {
      setBranchBOMGroupList({
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
    getBranchBOMGroups();
  }, [getBranchBOMGroups]);

  useEffect(() => {
    // Get combobox data and reload into state
    getDataBomBranchLevelType().then((res) => {
      setFieldArray((oldState) => {
        const data = [...oldState];
        // Rebuild Branch group
        data.find((obj) => obj.fieldName === 'level')['data'] = formatComboBox(
          res.data.filter((status) => +status.typeId !== 1)
        );

        return [...data];
      });
    });
  }, []);

  const goToAddPage = () => {
    props.history.push('/catalog/branch-bom-group/Create-Branch-BOM-Group');
  };

  const goToDetailPage = (branchBOMGroup) => {
    props.history.push({
      pathname: `/catalog/branch-bom-group/View-Branch-BOM-Details/${branchBOMGroup.bomGroupId}`,
      state: {
        branchBOMGroup,
      },
    });
  };

  const goToEditPage = (branchBOMGroup) => {
    getBranchBOMGroup({ id: branchBOMGroup.bomGroupId }).then((res) => {
      if (res.data.existed === BranchBOM.existsInBranchBom) {
        showError(
          `${Message.BRANCH_BOM_GROUP.NOT_EDIT}`.replace(
            '<bomGroupName>',
            `${branchBOMGroup.bomGroupName}`
          ).replace(
            '<bomGroupCode>',
            `${branchBOMGroup.bomGroupCode}`
          )
        );
      } else {
        props.history.push({
          pathname: `/catalog/branch-bom-group/Edit-Branch-BOM-Group/${branchBOMGroup.bomGroupId}`,
          state: {
            id: branchBOMGroup.bomGroupId,
          },
        });
      }
    });
  };

  const confirmDelete = (branchBOMGroup) => {
    getBranchBOMGroup({ id: branchBOMGroup.bomGroupId }).then((res) => {
      if (res.data.existed === BranchBOM.existsInBranchBom) {
        showError(
          `${Message.BRANCH_BOM_GROUP.NOT_DELETE}`.replace(
            '<bomGroupName>',
            `${branchBOMGroup.bomGroupName}`
          ).replace(
            '<bomGroupCode>',
            `${branchBOMGroup.bomGroupCode}`
          )
        );
      } else {
        openDialog({
          title: Message.DELETE_CONFIRM_TITLE,
          content: Message.BRANCH_BOM_GROUP.DELETE.replace(
            '<bomGroupName>',
            branchBOMGroup.bomGroupName
          ).replace(
            '<bomGroupCode>',
            `${branchBOMGroup.bomGroupCode}`
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
                  bomGroupId: branchBOMGroup.bomGroupId,
                };
                deleteBranchBOMGroup(body).then(
                  () => {
                    getBranchBOMGroups();
                  },
                  (err) => {
                    showError(err.messages[0].messageContent);
                  }
                );
              },
            },
          ],
        });
      }
    });
  };

  const pageHeaderConfigs = {
    pageTitle: t('Branch BOM Group List'),
    showButton: true,
    buttonTitle: t('Create Branch BOM Group'),
    buttonAction: goToAddPage,
  };

  return (
    <div className={classes.branchBomGroup}>
      <PageHeader {...pageHeaderConfigs} />

      <div className={classes.searchCover}>
        <SearchForm
          fieldArray={fieldArray}
          onSearch={onSearch}
          classCustom="user-search-bar"
        />
      </div>
      <TableGrid
        columns={columns}
        dataTable={branchBOMGroupList}
        options={options}
        defaultStyle={true}
        onChangePage={(e, page) => onChangePage(e, page)}
        onChangeRowsPerPage={(e) => onChangeRowsPerPage(e)}
        actions={actions(goToDetailPage, goToEditPage, confirmDelete)}
      />
    </div>
  );
};

BranchBOMGroupList.propTypes = {
  classes: PropTypes.object,
  history: PropTypes.object,
};

export default withRouter(withStyles(useStyles)(BranchBOMGroupList));
