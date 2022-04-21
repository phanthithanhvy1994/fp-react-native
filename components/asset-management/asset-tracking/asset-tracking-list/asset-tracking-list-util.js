import { dateFormat } from '../../../../constants/constants';
import { formatDateString } from '../../../../util/date-util';
const reStructureFields = (params) => {
  const newParams = params;
  let fieldsName = [];
  Object.keys(newParams).forEach((key) =>
    (newParams[key] === undefined || newParams[key] === '') &&
      key !== 'createdDate' && key !== 'submittedDate'
      ? fieldsName.push(key)
      : null
  );
  let reParams = {};
  reParams = {
    assetTransferNo: {
      like: params.assetTransferNo && params?.assetTransferNo.trim()
    },
    assetTrackingNo: {
      like: params.assetTrackingNo && params?.assetTrackingNo.trim()
    },
    createdBy: {
      like: params.createdBy && params?.createdBy.trim()
    },
    createdDateFrom: {
      ge:
        params.createdDate &&
        formatDateString(params?.createdDate.ge, dateFormat.savingDateTime),
    },
    createdDateTo: {
      le:
        params.createdDate &&
        formatDateString(params?.createdDate.le, dateFormat.savingDateTime),
    },
    status: {
      in: params.status && params.status?.map((param) => param.value),
    },
    assetTransferType: {
      in: params.assetTransferType && params.assetTransferType?.map((param) => param.value),
    },
  };

  const coverDataSearch = Object.keys(reParams)
    .filter((key) => !fieldsName.includes(key))
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: reParams[key],
      };
    }, {});
  return coverDataSearch;
};

export { reStructureFields };
