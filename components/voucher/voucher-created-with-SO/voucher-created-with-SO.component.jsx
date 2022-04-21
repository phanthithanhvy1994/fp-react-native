import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import EVoucherCreateSO from './e-voucher-form/e-voucher-form.component';
import { fieldArray, buttonDate } from './voucher-created-with-SO.config';

// NOT YET
function EVoucherWithSO(props) {
  const { isOpenMenu, t, onClose, detailData, saleOrderNo, isEditPage, onUpdated } = props;

  return (
    <>
      <EVoucherCreateSO
        isEditPage={isEditPage}
        isOpenMenu={isOpenMenu}
        onClose={onClose}
        fieldArray={fieldArray}
        fieldButton={buttonDate}
        detailData={detailData}
        saleOrderNo={saleOrderNo}
        onUpdated={onUpdated}
        titlePopup={t(isEditPage ? 'Update Voucher with SO' : 'Create E-Voucher with SO')}
      />
    </>
  );
}

EVoucherWithSO.propTypes = {
  isOpenMenu: PropTypes.bool,
  isEditPage: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdated: PropTypes.func,
  t: PropTypes.any,
  detailData: PropTypes.any,
  saleOrderNo: PropTypes.any,
};

export default withTranslation()(EVoucherWithSO);
