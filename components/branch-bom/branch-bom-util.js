import { dateFormat } from '../../constants/constants';
import { formatDateString } from '../../util/date-util';
const reStructureFields = (params) => {
  const newParams = params;
  let fieldsName = [];
  Object.keys(newParams).forEach((key) =>
    (newParams[key] === undefined || newParams[key] === '') &&
    key !== 'startDate'
      ? fieldsName.push(key)
      : fieldsName.concat(['startDate', 'toDate'])
  );
  let reParams = {};
  reParams = {
    level: {
      in: params.level && params.level?.map((param) => param.value),
    },
    status: {
      in:
        params.status && Array.isArray(params.status)
          ? params.status?.map((param) => param.value)
          : [params.status],
    },
    category: {
      in: params.category && params.category?.map((param) => param.value),
    },
    company: {
      in: params.company && params.company?.map((param) => param.value),
    },
    product: {
      in: params.product && params.product?.map((param) => param.value),
    },
    price: {
      in: params.price && params.price?.map((param) => param.value),
    },
    subCategory: {
      in: params.subCategory && params.subCategory?.map((param) => param.value),
    },
    bomBranchName: { like: params.bomBranchName && params?.bomBranchName },
    bomBranchCode: { like: params.bomBranchCode && params?.bomBranchCode },
    startDateFrom: {
      ge:
        params.startDate &&
        formatDateString(params?.startDate.ge, dateFormat.savingDateTime),
    },
    startDateTo: {
      le:
        params.startDate &&
        formatDateString(params?.startDate.le, dateFormat.savingDateTime),
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
