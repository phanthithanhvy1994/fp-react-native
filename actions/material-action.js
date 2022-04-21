import materialService from '../services/material-service';

export function getMaterialList(body) {
  return materialService.getMaterialList(body).then((res) => res);
}

export function getMaterialImage() {
  return materialService.getMaterialImage();
}

export function getMaterialType() {
  return materialService.getMaterialType().then((res) => res.data);
}

export function getMaterialGroup() {
  return materialService.getMaterialGroup().then((res) => res.data);
}

export function getMaterialDetail(body) {
  return materialService
    .getMaterialDetail({ id: body.common.id })
    .then((res) => res.data);
}
