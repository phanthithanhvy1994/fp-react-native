import { getMaterialImage } from '../../../../actions/material-action';
import { NumberConstant } from '../../../../constants/constants';

export const convertDataStructureForDetailGrid = data =>
  data.map(rowData => ({
    // id: rowData.goodsIssuesDetailId,
    no: rowData.no || rowData.lineNumber,
    common: {
      // Will use it when BE done
      imgUrl: `${getMaterialImage()}?sku=${rowData.sku}`,
      id: rowData.itemInfo && rowData.itemInfo.itemId,
    },
    ...rowData.itemInfo,
    ...rowData,
  }));

export const convertItemDataStructure = (data, information) =>
  data &&
  data.map(item => {
    const tempItem = {
      ...item,
      ...item.itemInfo,
      no: item.no || item.lineNumber,
      common: {
        // Will use it when BE done
        imgUrl: `${getMaterialImage()}?sku=${item.sku}`,
        id: item.itemId,
      },
      information: information.map(el => ({
        // Get value from item if only define label
        // else keep current value as label, and get item value
        label:
          (el.label && !el.value && item.itemInfo[el.label]) || el.label || '',
        value: (el.value && item[el.value]) || '',
        color: el.color,
      })),
    };
    return tempItem;
  });

export const getFinalBaseUnitValue = data => {
  const value =
    ((Number(data.orderQuantity) || 0) * (Number(data.numerator) || 0)) /
      Number(data.denominator || 1) +
    (Number(data.baseQuantity) || 0);

  return Number(
    parseFloat(value).toFixed(NumberConstant.normalDecimalCharacter)
  );
};