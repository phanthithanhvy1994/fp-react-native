import BranchGroupService from '../services/branch-group.service';

const getAllBranchGroup = body => BranchGroupService.getAllBranchGroup(body);

export { getAllBranchGroup };
