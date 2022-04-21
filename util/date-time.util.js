import { dateFormat } from '../constants/constants';
import {formatDateString} from './date-util';

export const convertTimestampToString = (timestamp) => {
  // Return empty if there is no timestamp
  if (!timestamp) {
    return '';
  }

  // Return with format 'yyyyMMddHHmmss'
  return `${timestamp.getUTCFullYear()}${timestamp.getUTCMonth() + 1}${
    timestamp.getUTCDate().toString().length === 1 ? '0' : ''
  }${timestamp.getUTCDate()}000000`;
};

export const convertToDateServerFormat = (date) => {
  if (!date) {
    return '';
  }
  return (typeof date === 'string' &&
    date.match(dateFormat.serverFormatRegex) &&
    date) ||
    formatDateString(
      date,
      dateFormat.savingDateTime
    );
};
