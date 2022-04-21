import ValuePackAddService from '../services/value-pack-add.service';

export const getVoucherValueType = params => {
  return ValuePackAddService.getVoucherValueType(params);
};

export const addNewValuePack = params => {
  return ValuePackAddService.addNewValuePack(params);
};
