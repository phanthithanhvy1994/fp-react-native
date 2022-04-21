import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import BranchBomGroupForm from '../branch-bom-group-form/branch-bom-group-form.component';
import PageHeader from '../../../shared/page-header/page-header.component';
import useStyles from './branch-bom-group-add-edit.style.';

function BranchBomGroupAddEdit(props) {
  const { t, isEditPage, isDetailPage, match, history, classes } = props;
  const idItem = match.params.id;
  const [branchBOMGroupCode, setBranchBOMGroupCode] = useState('');

  const getBranchBOMGroupCode = branchBOMGroupCode => {
    setBranchBOMGroupCode(branchBOMGroupCode);
  };

  let titlePage;
  if (isEditPage) {
    titlePage = t(`Edit Branch BOM Group <${branchBOMGroupCode}>`);
  } else if (isDetailPage) {
    titlePage = t(`View Branch BOM Group Details <${branchBOMGroupCode}>`);
  } else {
    titlePage = t('Create Branch BOM Group');
  }
  const pageHeader = {
    pageTitle: titlePage,
    showButton: false,
  };

  return (
    <div>
      <PageHeader {...pageHeader} />
      <div className={classes.searchCover}>
        <BranchBomGroupForm
          isEditPage={isEditPage}
          idItem={idItem}
          isDetailsPage={isDetailPage}
          history={history}
          getBranchBOMGroupCode={getBranchBOMGroupCode}
        />
      </div>
    </div>
  );
}

BranchBomGroupAddEdit.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailPage: PropTypes.any,
  history: PropTypes.object,
  match: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(BranchBomGroupAddEdit));
