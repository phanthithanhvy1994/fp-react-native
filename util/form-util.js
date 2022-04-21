/* eslint-disable no-param-reassign */
import moment from 'moment';
import { generate } from 'generate-password';
import _ from 'lodash';
import { FieldConstant } from '../constants/constants';

export const validateEmail = email =>
  email && email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);

export const validatePhoneNo = phoneNo => {
  const phoneRegex = /^[+]*[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/g;
  return phoneNo && phoneNo.match(phoneRegex);
};

export const currentDateTime = () => new Date().toISOString();

const DateTimeConvertType = {
  DATE: 1,
  DATE_TIME: 2,
  YEAR: 3,
};

const convertDateTime = (date, convertType) => {
  if (date === '' || date === null || date === undefined) {
    return null;
  }
  switch (convertType) {
    case DateTimeConvertType.DATE:
      return moment(date).format('DD-MM-YYYY');
    case DateTimeConvertType.DATE_TIME:
      return moment(date).format('DD-MM-YYYY h:mm:ss a');
    case DateTimeConvertType.YEAR:
      return moment(date).format('YYYY');
    default:
      return null;
  }
};

export const isoToDate = isoDate => {
  if (!isoDate) {
    return '';
  }
  return convertDateTime(isoDate, DateTimeConvertType.DATE);
};

export const isoToDateTime = isoDate =>
  convertDateTime(isoDate, DateTimeConvertType.DATE_TIME);

export const isoToYear = isoDate =>
  convertDateTime(isoDate, DateTimeConvertType.YEAR);

export const generatePassword = () =>
  generate({
    length: 10,
    numbers: true,
    symbols: true,
    uppercase: true,
    strict: true,
  });

export const getNowTime = () => {
  const dateTime = new Date();
  return moment(dateTime).format('YYYYMMDD_HHmmss');
};

const defineFileName = fileName => {
  const splitName = _.split(fileName, '.');
  return `${splitName[0]}_${getNowTime()}.${splitName[1]}`;
};

export const downloadCSVFile = (data, fileName) => {
  const encodedUri = `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`;
  const link = document.createElement('a');
  link.setAttribute('href', `data:text/csv;charset=utf-8,${encodedUri}`);
  link.setAttribute('download', defineFileName(fileName));
  link.click();
};

export const paginate = (
  totalItems,
  currentPage = 1,
  pageSize = 10,
  maxPages = 10
) => {
  // calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  const items = [...Array(150).keys()].map(i => ({
    id: i + 1,
    name: `Item ${i + 1}`,
  }));
  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  let startPage: number;
  let endPage: number;
  if (totalPages <= maxPages) {
    // total pages less than max so show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // total pages more than max so calculate start and end pages
    const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // calculate start and end item indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // create an array of pages to ng-repeat in the pager control
  const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    i => startPage + i
  );

  const pageOfItems = items.slice(startIndex, endIndex + 1);

  // return object with all pager properties required by the view
  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    startPage,
    endPage,
    startIndex,
    endIndex,
    pages,
    pageOfItems,
  };
};

export const fakeApiUserRole = (
  totalItems,
  currentPage = 1,
  pageSize = 5,
  maxPages = 10
) => {
  // calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);
  const items = [...Array(50).keys()].map(i => ({
    roleId: i + 1,
    roleName: `aaa${i + 1}`,
    description: ' habitant et et fames ac turpis egestas',
    imageUrl: 'https://www.gstatic.com/webp/gallery/1.jpg',
  }));
  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  let startPage: number;
  let endPage: number;
  if (totalPages <= maxPages) {
    // total pages less than max so show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // total pages more than max so calculate start and end pages
    const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // calculate start and end item indexes
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // create an array of pages to ng-repeat in the pager control
  const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    i => startPage + i
  );

  const data = items.slice(startIndex, endIndex + 1);
  // return object with all pager properties required by the view
  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    startPage,
    endPage,
    startIndex,
    endIndex,
    pages,
    data,
  };
};

const getRangeFieldVal = (inputVal, operator) => {
  let value;
  // Get value with operator & update value obj
  switch (operator) {
    // SearchNumberVO case
    case FieldConstant.operator.number.LT.value:
      value = {
        lt: inputVal,
      };
      break;
    case FieldConstant.operator.number.GT.value:
      value = {
        gt: inputVal,
      };
      break;
    // SearchTextVo case
    case FieldConstant.operator.text.LIKE:
      value = {
        like: inputVal,
      };
      break;
    // SearchVO common case
    default:
      value = {
        eq: inputVal,
      };
      break;
  }
  return value;
};

const onChangeRangeField = (targetUpdate, name, updateVal) => {
  // Get index case Range Input
  const targetInd = targetUpdate.findIndex(
    field =>
      // eslint-disable-next-line no-prototype-builtins
      (field.hasOwnProperty('operator') && field.operator.fieldName === name) ||
      // eslint-disable-next-line no-prototype-builtins
      (field.hasOwnProperty('searchInput') &&
        field.searchInput.fieldName === name)
  );
  // Check component change value & update value
  if (targetUpdate[targetInd].operator.fieldName === name) {
    targetUpdate[targetInd].operator.value = updateVal;
  } else {
    targetUpdate[targetInd].searchInput.value = updateVal;
  }
  // Update value range field
  targetUpdate[targetInd].value = getRangeFieldVal(
    targetUpdate[targetInd].searchInput.value,
    targetUpdate[targetInd].operator.value
  );

  return targetUpdate;
};

export const deepCopy = item => JSON.parse(JSON.stringify(item));

export const onChangeInput = (fieldArray, event) => {
  const { value, name } = event.target;
  // Clone field array
  let targetUpdate = _.cloneDeep(fieldArray);
  // Determine typeof value to update
  // If value = null, do not update value
  // eslint-disable-next-line no-prototype-builtins
  const updateVal = value && (value.hasOwnProperty('key') ? value.key : value);
  // Get index of target
  const targetInd = targetUpdate.findIndex(field => field.fieldName === name);
  // Update value with case Range Input
  if (targetInd === -1) {
    targetUpdate = onChangeRangeField(targetUpdate, name, updateVal);
    return targetUpdate;
  }

  // Update date range fieldvalue
  if (
    targetUpdate[targetInd] &&
    targetUpdate[targetInd].fieldType === FieldConstant.type.RANGE_INPUT &&
    targetUpdate[targetInd].inputType === 'date'
  ) {
    const fieldRangeName = event.target.firstInRange ? 'ge' : 'le';
    targetUpdate[targetInd].value[fieldRangeName] = updateVal;
    return targetUpdate;
  }
  // Update value
  targetUpdate[targetInd].value = updateVal;
  return targetUpdate;
};

export const getStateFields = fieldArray => {
  const stateFields = fieldArray.reduce((map, obj) => {
    map[obj['fieldName']] = obj.value;
    return map;
  }, {});
  return stateFields;
};
