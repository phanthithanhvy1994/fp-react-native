import React from 'react';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import VoucherForm from '../voucher-form/voucher-form.component';
import { fieldArray, buttonDate } from './voucher-created-without-SO.config';

// function useOnMount(handler) {
//   return React.useEffect(handler, []);
// }

// NOT YET
function VoucherWithoutSO(props) {
  const { isOpenMenu, t, onClose, isEditPage, detailData, onUpdated } = props;
  return (
    <>
      <VoucherForm
        isOpenMenu={isOpenMenu}
        isEditPage={isEditPage}
        onClose={onClose}
        fieldArray={fieldArray}
        fieldButton={buttonDate}
        detailData={detailData}
        onUpdated={onUpdated}
        titlePopup={t( isEditPage ? 'Update Voucher without SO' : 'Create Voucher without SO')}
      />
    </>
  );
}

VoucherWithoutSO.propTypes = {
  isOpenMenu: PropTypes.bool,
  isEditPage: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdated: PropTypes.func,
  detailData: PropTypes.any,
  t: PropTypes.any,
};

export default withTranslation()(VoucherWithoutSO);
