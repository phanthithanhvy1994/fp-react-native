import GoodsIssuesService from '../services/goods-issues-service';

export function getGoodsIssuesList(body) {
  return GoodsIssuesService.getGoodsIssuesList(body).then((res) => res);
}

export function deleteGoodsIssuesList(param) {
  return GoodsIssuesService.deleteGoodsIssuesList(param);
}

export function getGoodsIssuesType() {
  return GoodsIssuesService.getGoodsIssuesType();
}

export function getGoodsIssuesStatus() {
  return GoodsIssuesService.getGoodsIssuesStatus();
}

export function getBranchByUser(userId) {
  return GoodsIssuesService.getBranchByUser(userId).then(res => res);
}

export function addGoodsIssues(body) {
  return GoodsIssuesService.addGoodsIssues(body).then(res => res);
}
export function getValueGoodsIssuesDetails(recordId) {
  return GoodsIssuesService.getValueGoodsIssuesDetails(recordId).then(res => res);
}

export function saveGoodIssue(body, action, savingType) {
  return GoodsIssuesService.saveGoodIssue(body, action, savingType);
}

export function updateGoodsIssuesStatus(updateStatus) {
  return GoodsIssuesService.updateGoodsIssuesStatus(updateStatus);
}

export function updateGoodsIssues(body) {
  return GoodsIssuesService.updateGoodsIssues(body).then(res => res);
}

export function getHistoryData(params) {
  return GoodsIssuesService.getHistoryData(params);
}

export function getGoodsIssuesById(param) {
  return GoodsIssuesService.getGoodsIssuesById(param);
}

export function getMaterialList(params) {
  return GoodsIssuesService.getMaterialList(params);
}

export function getGIDepartment() {
  return GoodsIssuesService.getGIDepartment();
}

export function getGIBranch() {
  return GoodsIssuesService.getGIBranch();
}