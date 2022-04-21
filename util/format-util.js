import { NumberConstant } from '../constants/constants';

export const formatNumber = (
  number,
  numberDecimalCharacter = NumberConstant.numberDecimalCharacter
) => {
  const floatNumber = typeof +number === 'number' ? parseFloat(+number) : 0;
  const tempDecimalNumber = floatNumber.toFixed(numberDecimalCharacter);

  // Fortmat ex: 1,000,000.00
  return Number(tempDecimalNumber).toLocaleString('en');
};

export const formatPrice = (
  number,
  numberDecimalCharacter = NumberConstant.numberDecimalCharacter
) => {
  const price = formatNumber(number, numberDecimalCharacter);

  return `${price} ${NumberConstant.currency}`;
};

export const formatComboBox = (itemData) => {
  // Transform list data master to dropdown list
  const formatData = itemData?.map((item) => ({
    ...item,
    display: item.assetLocationName || item.categoryName || item.typeName || item.display,
    value: item.assetLocationCode || item.categoryCode || item.typeCode || item.value,
  }));
  return formatData || [];
};

export const formatDropdownList = (data) => {
  // Format support display code + description
  const formatData = formatComboBox(data).map((item) => ({
    ...item,
    display:
      item.display === 'N/A'
        ? `${item.value} `
        : `${item.value} - ${item.display}`,
  }));
  return formatData || [];
};

export const mapColumnAndDataForMessageSAP = (data) => {
  const messageTableTitle = 'Message from SAP';
  let columnsArray = [
    'TYPE',
    'MESSAGE',
    'MESSAGE_V1',
    'MESSAGE_V2',
    'MESSAGE_V3',
    'MESSAGE_V4',
    'PARAMETER',
    'ROW',
    'FIELD',
  ];

  let formatData = [];
  let dataArray = data;

  let messageTableColumns = columnsArray.map((item) => ({
    title: item,
    field: item,
    width: item === 'TYPE' ? 60 : undefined,
  }));

  dataArray.forEach((item) => {
    formatData.push(item.errorSAPRestVO);
  });

  let messageTableData = {
    data: formatData,
  };

  return { messageTableTitle, messageTableColumns, messageTableData };
};
