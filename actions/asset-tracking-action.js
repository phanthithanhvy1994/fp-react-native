import AssetTracking from '../services/asset-tracking-service';

export function getAssetTrackingDetails(params) {
  return AssetTracking.getAssetTrackingDetails(params);
}

export function getAssetTrackingHistory(params) {
  return AssetTracking.getAssetTrackingHistory(params);
}

export function getAssetTrackingList(body) {
  return AssetTracking.getAssetTrackingList(body);
}

export function getDataStatus(body) {
  return AssetTracking.getDataStatus(body);
}
