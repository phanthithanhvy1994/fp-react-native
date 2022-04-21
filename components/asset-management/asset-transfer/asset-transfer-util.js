import { dateFormat } from '../../../constants/constants';
import { formatDateString } from '../../../util/date-util';
const reStructureFields = (params) => {
  const newParams = params;
  let fieldsName = [];
  Object.keys(newParams).forEach((key) =>
    (newParams[key] === undefined || newParams[key] === '') &&
    key !== 'createdDate' && key !== 'submittedDate'
      ? fieldsName.push(key)
      :null
  );
  let reParams = {};
  reParams = {
    requestFromBranch: {
      in: params.requestFromBranch && params.requestFromBranch?.map((param) => param.value),
    },
    requestToBranch: {
      in: params.requestToBranch && params.requestToBranch?.map((param) => param.value),
    },
    assetTransferNo: {
      like: params.assetTransferNo && params?.assetTransferNo.trim()
    },
    assetRequestNo: {
      like: params.assetRequestNo && params?.assetRequestNo.trim()
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
    submittedDateFrom: {
      ge:
        params.submittedDate &&
        formatDateString(params?.submittedDate.ge, dateFormat.savingDateTime),
    },
    submittedDateTo: {
      le:
        params.submittedDate &&
        formatDateString(params?.submittedDate.le, dateFormat.savingDateTime),
    },
    status: {
      in: params.status && params.status?.map((param) => param.value),
    },
    ssdNo: {
      like: params.SsdNo && params?.SsdNo.trim()
    },
    assetTransferType: {
      in: params.assetTransferType && params.assetTransferType?.map((param) => param.value),
    },
    sap: {
      in: params.sap && params.sap?.map((param) => param.value),
    },
    bbs: {
      like: params.bbs && params?.bbs.trim()
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
