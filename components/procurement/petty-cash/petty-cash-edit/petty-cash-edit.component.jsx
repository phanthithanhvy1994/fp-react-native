import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import PageHeader from '../../../shared/page-header/page-header.component';
import PettyCashForm from '../petty-cash-form/petty-cash-form.component';

const PettyCashEdit = props => {
  const { t } =props;
  const pageHeaderConfigs = {
    pageTitle: t('Edit PO Petty Cash'),
    showButton: false,
  };
  return (
    <>
      <PageHeader {...pageHeaderConfigs} />
      <div style={{ marginTop: '114px' }}>
        <PettyCashForm/>
      </div>
    </>
  );
};

PettyCashEdit.propTypes = {
  t: PropTypes.any
};

export default withTranslation()(PettyCashEdit);
