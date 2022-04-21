import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import BranchBOMPriceForm from '../branch-bom-price-form/branch-bom-price-form.component';

import { detailFields, detailOptions, bottomGridButtonsArray } from './branch-bom-price-detail.config';
import useStyles from '../branch-bom-price-list.style';
import { priceColumns } from './price.config';

import { getBranchBOMPrice } from '../../../../actions/branch-bom-price.action';

const BranchBOMPriceDetail = (props) => {
  const { location } = props;
  const pathname = location.pathname;

  const BOMPriceId =
    (location.state && location.state.id) || pathname.split('/').pop();

  const classFormFieldCustom = 'return-request-general-info-form';

  return (
    <BranchBOMPriceForm
      isEditPage={false}
      isDetailsPage={true}
      columns={priceColumns}
      tableOptions={detailOptions}
      classFormFieldCustom={classFormFieldCustom}
      getBranchBOMPrice={getBranchBOMPrice}
      BOMPriceId={BOMPriceId}
      fieldLabels={detailFields}
      bottomGridButtonsArray={bottomGridButtonsArray}
    />
  );
};

BranchBOMPriceDetail.propTypes = {
  classes: PropTypes.object,
  location: PropTypes.object,
};

export default withStyles(useStyles)(BranchBOMPriceDetail);
