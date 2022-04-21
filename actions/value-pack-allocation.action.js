import ValuePackAllocationService from '../services/value-pack-allocation.service';

export function getVPAllocationInformation(param) {
  return ValuePackAllocationService.getVPAllocationInformation(param);
}

export function getScanValuePackAllocationData(params) {
  return ValuePackAllocationService.getScanValuePackAllocationData(params);
}

export function saveValuePackAllocation(params) {
  return ValuePackAllocationService.saveValuePackAllocation(params);
}
