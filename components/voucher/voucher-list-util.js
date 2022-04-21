import { dateFormat } from '../../constants/constants';
import { formatDateString } from '../../util/date-util';
const reStructureFields = params => {
  const newParams = params;
  let fieldsName = [];
  Object.keys(newParams).forEach(key => {
    return (
      (newParams[key] === undefined || newParams[key] === '') &&
      fieldsName.push(key)
    );
  });
  let reParams = {};
  reParams = {
    companyCode: params.companyCode && {
      in: params.companyCode?.map(param => param.value),
    },
    createdDateFrom: params?.created_date?.ge && {
      ge:
        formatDateString(params?.created_date.ge, dateFormat.savingDateTime),
    },
    createdDateTo: params?.created_date?.le && {
      le:
        formatDateString(params?.created_date.le, dateFormat.savingDateTime),
    },
    validDateFromBegin: params?.valid_from?.ge && {
      ge:
        formatDateString(params?.valid_from.ge, dateFormat.savingDateTime),
    },
    validDateFromEnd: params?.valid_from?.le && {
      le:
        formatDateString(params?.valid_from.le, dateFormat.savingDateTime),
    },
    validDateToBegin: params?.valid_to?.ge && {
      ge:
        formatDateString(params?.valid_to.ge, dateFormat.savingDateTime),
    },
    validDateToEnd: params?.valid_to?.le && {
      le:
        formatDateString(params?.valid_to.le, dateFormat.savingDateTime),
    },
    activeDateFrom: params?.active_date?.ge && {
      ge:
        formatDateString(params?.active_date.ge, dateFormat.savingDateTime),
    },
    activeDateTo: params?.active_date?.le && {
      le:
        formatDateString(params?.active_date.le, dateFormat.savingDateTime),
    },
    usedDateFrom: params?.used_date?.ge && {
      ge:
        formatDateString(params?.used_date.ge, dateFormat.savingDateTime),
    },
    usedDateTo: params?.used_date?.le && {
      le:
        formatDateString(params?.used_date.le, dateFormat.savingDateTime),
    },
    expiredDateFrom: params?.expired_date?.ge && {
      ge:
        formatDateString(params?.expired_date.ge, dateFormat.savingDateTime),
    },
    expiredDateTo: params?.expired_date?.le && {
      le:
        formatDateString(params?.expired_date.le, dateFormat.savingDateTime),
    },
    channelVoucher: {
      in:
        params.channelVoucher &&
        params.channelVoucher?.map(param => param.value),
    },
    saleOrderNo: { like: params.saleOrderNo && params?.saleOrderNo?.trim() },
    voucherId: params?.voucherId && {
      in: params.voucherId?.map(param => +param.value),
    },
    bookletCode: { like: params.bookletCode && params?.bookletCode?.trim() },
    voucherSerialNo: {
      like: params.voucherSerialNo && params?.voucherSerialNo?.trim(),
    },
    voucherMatDesc: {
      in:
        params.voucherMatDesc &&
        params.voucherMatDesc?.map(param => param.value),
    },
    customerOrderNo: {
      like: params.customerOrderNo && params?.customerOrderNo?.trim(),
    },
    trackingNo: {
      like: params.trackingNo && params?.trackingNo?.trim(),
    },
    status: {
      in:
        params.status && params.status?.map(param => param.value),
    },
    promotion: {
      in:
        params.promotion && params.promotion?.map(param => param.value),
    },
    draftVoucher: { eq: params.draftVoucher ? 'Draft Voucher' : '' },
  };

  const coverDataSearch = Object.keys(reParams)
    .filter(key => !fieldsName.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: reParams[key],
      };
    }, {});
  return coverDataSearch;
};

export { reStructureFields };
