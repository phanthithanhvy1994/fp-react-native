import BranchBOMGroupService from '../services/branch-bom-group.service';

const getAllBranchBOMGroup = (body) =>
  BranchBOMGroupService.getAllBranchBOMGroup(body);

const getBranchBOMGroup = (params) =>
  BranchBOMGroupService.getBranchBOMGroup(params);

const addBranchBOMGroup = (body) =>
  BranchBOMGroupService.addBranchBOMGroup(body);

const updateBranchBOMGroup = (body) =>
  BranchBOMGroupService.updateBranchBOMGroup(body);

const deleteBranchBOMGroup = (body) =>
  BranchBOMGroupService.deleteBranchBOMGroup(body);

export {
  getAllBranchBOMGroup,
  getBranchBOMGroup,
  addBranchBOMGroup,
  updateBranchBOMGroup,
  deleteBranchBOMGroup,
};
