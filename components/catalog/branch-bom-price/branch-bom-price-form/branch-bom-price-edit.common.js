export const convertItemDataStructure = (data, information, dateHeader) => {
  let no = 0;
  return data && data.map((item) => {
    no += 1;
    return {
      id: item.itemNo,
      lineNumber: no,
      no: no,
      common: {
        // Will use it when BE done
        // imgUrl: `${getMaterialImage()}?sku=${item.sku}`,
        imgUrl:
          'https://cdn.shopify.com/s/files/1/0532/2477/products/test-product.jpg?v=1432753385',
        id: item.itemNo,
      },
      information: information && information.map((el) => ({
        // Get value from item if only define label
        // else keep current value as label, and get item value
        label: (el.label && !el.value && item[el.label]) || el.label || '',
        value: (el.value && item[el.value]) || '',
        color: el.color,
      })),
      ...item,
      startDate: dateHeader ? dateHeader.startDate : item.startDate,
      endDate: dateHeader ? dateHeader.endDate : item.endDate,
      bomBranchCode: item.itemCode || item.bomBranchCode || item.sku,
      bomBranchName: item.itemName || item.bomBranchName || item.sku,
    } || [];
  });
};
