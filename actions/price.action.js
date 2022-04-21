// import priceService from '../services/branch-bom-price.service';

export const samplePrices = [
  {
    itemNo: 1,
    itemName: 'Item 1',
    price: 1000,
    startDate: '12.11.2020',
    endDate: '14.11.2020',
    description: 'No',
  },
  {
    itemNo: 2,
    itemName: 'Item 2',
    price: 1000,
    startDate: '12.11.2020',
    endDate: '14.11.2020',
    description: 'No',
  },
  {
    itemNo: 3,
    itemName: 'Item 3',
    price: 1000,
    startDate: '12.11.2020',
    endDate: '14.11.2020',
    description: 'No',
  },
  {
    itemNo: 4,
    itemName: 'Item 4',
    price: 1000,
    startDate: '12.11.2020',
    endDate: '14.11.2020',
    description: 'No',
  },
  {
    itemNo: 5,
    itemName: 'Item 5',
    price: 1000,
    startDate: '12.11.2020',
    endDate: '14.11.2020',
    description: 'No',
  },
];

const getAllPrice = (body) =>
  // return itemService.getAllItem(body);
  Promise.resolve({
    statis: 200,
    data: {
      itemDTOList: samplePrices,
      totalDo: samplePrices.length,
    },
  });

export { getAllPrice };
