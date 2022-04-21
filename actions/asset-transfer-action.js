import AssetTransfer from '../services/asset-transfer-service';

export function getDataRequestFrom(body) {
  return AssetTransfer.getDataRequestFrom(body);
}

export function getDataRequestTo(body) {
  return AssetTransfer.getDataRequestTo(body);
}

export function getDataStatus(body) {
  return AssetTransfer.getDataStatus(body);
}

export function getDataType(body) {
  return AssetTransfer.getDataType(body);
}

export function getDataSAP(body) {
  return AssetTransfer.getDataSAP(body);
}

export function getDataBBS(body) {
  return AssetTransfer.getDataBBS(body);
}

export function getAssetTransferList(body) {
  return AssetTransfer.getAssetTransferList(body);
}

export function getAssetTransferDetail(id) {
  return AssetTransfer.getAssetTransferDetail(id);
}




