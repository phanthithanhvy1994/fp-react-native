import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import BranchBomForm from '../branch-bom-form/branch-bom-form.component';
import PageHeader from '../../shared/page-header/page-header.component';
import useStyles from './branch-bom-add-edit.style';
function BranchBomAddEdit(props) {
  const { t, isDetailPage, match, history, classes } = props;
  const idItem = match.params.id;
  const [branchBOMCode, setBranchBOMCode] = useState('');

  const getBranchBOMCode = branchBOMCode => {
    setBranchBOMCode(branchBOMCode);
  };

  let titlePage;
  if (idItem && !isDetailPage) {
    titlePage = t('Branch BOM Edit');
  } else if (isDetailPage) {
    titlePage = t(`View Branch BOM Details <Branch BOM NO.${branchBOMCode}>`);
  } else {
    titlePage = t('Create Branch BOM');
  }
  const pageHeader = {
    pageTitle: titlePage,
    showButton: false,
  };

  return (
    <div className={classes.branchBomFrom}>
      <PageHeader {...pageHeader} />
      <div className={classes.searchCover}>
        <BranchBomForm
          isEditPage={(idItem && !isDetailPage) || false}
          idItem={idItem}
          isDetailsPage={isDetailPage}
          history={history}
          getBranchBOMCode={getBranchBOMCode}
        />
      </div>
    </div>
  );
}

BranchBomAddEdit.propTypes = {
  t: PropTypes.any,
  classes: PropTypes.object,
  isEditPage: PropTypes.any,
  isDetailPage: PropTypes.any,
  history: PropTypes.object,
  match: PropTypes.any,
};

export default withTranslation()(withStyles(useStyles)(BranchBomAddEdit));
