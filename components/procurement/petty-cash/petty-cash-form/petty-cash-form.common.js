import { getMaterialImage } from '../../../../actions/material-action';
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
        label: (el.label && !el.value && item[el.label]) || el.label || '',
        value: (el.value && item[el.value]) || '',
        color: el.color,
      })),
    };
    return tempItem;
  });
