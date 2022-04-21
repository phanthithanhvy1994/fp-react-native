import { getMaterialImage } from '../../actions/material-action';
import { OrderConstant, NumberConstant } from '../../constants/constants';

export const getTaxAmount = data => {
  const taxAmount =
    !data.isFree &&
    (Number(data.quantity) || 0) *
      (Number(data.price) || 0) *
      (Number(data.tax) || 0);

  return taxAmount
    ? Number(
      parseFloat(taxAmount).toFixed(NumberConstant.normalDecimalCharacter)
    )
    : 0;
};

export const getAmount = data => {
  const amount =
    (!data.isFree &&
    (data.damagedQty && +data.damagedQty !== 0) ? (Number(data.unitPrice) || Number(data.price) || 0) * (Number(data.damagedQty || 0)) :
      (Number(data.unitPrice) || Number(data.price) || 0) * (Number(data.quantity) || 0)) || 0; 

  return amount
    ? Number(parseFloat(amount).toFixed(NumberConstant.normalDecimalCharacter))
    : 0;
};

export const getFinalBaseUnitValue = (data, qtyFieldName) => {
  const quantity = (qtyFieldName && data[qtyFieldName]) || data.quantity;
  const value =
    ((Number(quantity) || 0) * (Number(data.numerator) || 0)) /
      Number(data.denominator || 1) +
    (Number(data.returnQtyBu) || 0);

  return Number(
    parseFloat(value).toFixed(NumberConstant.normalDecimalCharacter)
  );
};

/**
 * A item which display an image and its info need below structure
 * to render a correct UI, so need to convert data before using it
 * @param {Array} data list of material data
 * @param {Array} information list of information that want
 * to display below an image
 */
export const convertItemDataStructure = (data, information, quantityName, parentData) =>
  data &&
  data.map(item => {
    const tempItem = {
      ...item,
      no: item.no || item.lineItem || item.lineNumber,
      common: {
        // Will use it when BE done
        imgUrl: `${getMaterialImage()}?sku=${item.sku}`,
        id: item.itemId,
      },
      information: information.map(el => ({
        // Get value from item if only define label
        // else keep current value as label, and get item value
        label: (el.label && !el.value && item[el.label]) || el.label || '',
        value: (el.value && item[el.value]) || '',
        color: el.color,
      })),
      sku: item.sku || item.materialCode,
      quantity: item[quantityName || OrderConstant.quantity],
      orderType: (parentData && parentData.orderType) || ''
    };
    tempItem.taxAmount = getTaxAmount(tempItem);
    tempItem.amount = getAmount(tempItem);
    return tempItem;
  });
