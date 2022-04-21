import BranchBOMPriceService from '../services/branch-bom-price.service';

const sampleBOMToBOMPrices = [
  {
    itemNo: 22,
    itemName: 'Item 22',
    price: 2222,
    startDate: null,
    endDate: null,
    description: 'No',
  },
  {
    itemNo: 16,
    itemName: 'Item 16',
    price: 1666,
    startDate: null,
    endDate: null,
    description: 'No',
  },
  {
    itemNo: 50,
    itemName: 'Item 50',
    price: 5000,
    startDate: null,
    endDate: null,
    description: 'No',
  },
];

const getAllBranchBOMPrice = (body) =>
  BranchBOMPriceService.getAllBranchBOMPrice(body);

const getAllStatus = (body) =>
  BranchBOMPriceService.getBranchBOMPriceStatus(body);

const getBranchBOMPrice = (body) =>
  BranchBOMPriceService.getBranchBOMPrice(body);

const addBranchBOMPrice = (body) =>
  BranchBOMPriceService.addBranchBOMPrice(body);

const updateBranchBOMPrice = (body) =>
  BranchBOMPriceService.updateBranchBOMPrice(body);

const updateStatusBranchBOMPrice = (body) =>
  BranchBOMPriceService.updateStatusBranchBOMPrice(body);

const deleteBranchBOMPrice = (body) =>
  BranchBOMPriceService.deleteBranchBOMPrice(body);

const addBOMToBOMPrice = () =>
  Promise.resolve({
    data: sampleBOMToBOMPrices,
  });

export {
  getAllBranchBOMPrice,
  getBranchBOMPrice,
  getAllStatus,
  addBranchBOMPrice,
  updateBranchBOMPrice,
  updateStatusBranchBOMPrice,
  addBOMToBOMPrice,
  deleteBranchBOMPrice,
};
