import moment from 'moment';
import { dateFormat } from '../constants/constants';

export const formatDateString = (dateString, format, isSplit = false) => {
  const convertFormat = format || dateFormat.mainDateTime;
  // The datetime string return from server is same this one : '20201112000000'
  // Set isSplit to true to split the above string and convert dateformat
  const date =
    dateString &&
    (isSplit && dateString.length === 14
      ? `${dateString.substring(0, 8)} ${dateString.substring(8, 14)}`
      : dateString);
  return (date && moment(date).format(convertFormat)) || '';
};

export const covertStringToDate = (date, convertFormat) => {
  return (date && moment(date, convertFormat).toDate()) || '';
};

/**
 * Convert from object or string to date string
 */
export const convertToDateString = (date, format, isSplit = false) => {
  // Data return from server will be '20201112000000', should split it to format correctly
  const shouldSplit = !!(typeof date === 'string' && date.match(dateFormat.serverFormatRegex));

  return (date &&
    formatDateString(
      typeof date === 'object'
        ? date.toLocaleDateString()
        : date,
      format || dateFormat.savingDateTime,
      isSplit || shouldSplit
    )) || '';
};

export const convertToDateServerFormat = (date) => {
  return (typeof date === 'string' &&
    date.match(dateFormat.serverFormatRegex) &&
    date) ||
    formatDateString(
      date || Date.now(),
      dateFormat.savingDateTime
    );
};

export const convertToExport = (date) => {
  const input = date;
  const [day, month, year] = input.split('.');
  return `${year}/${month}/${day}`;
};
