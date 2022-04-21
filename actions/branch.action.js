import BranchService from '../services/branch.service';

const getAllBranchCombo = body => BranchService.getAllBranchCombo(body);

export { getAllBranchCombo };
