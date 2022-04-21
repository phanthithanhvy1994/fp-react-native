import DeliveryOrderService from '../services/delivery-order.service';

const getAllDeliveryOrder = body =>
  DeliveryOrderService.getAllDeliveryOrder(body);

const getDeliveryOrder = body => DeliveryOrderService.getDeliveryOrder(body);

const getDeliveryOrderStatus = () =>
  DeliveryOrderService.getDeliveryOrderStatus();

const getDeliveryOrderType = () => DeliveryOrderService.getDeliveryOrderType();

export {
  getAllDeliveryOrder,
  getDeliveryOrder,
  getDeliveryOrderStatus,
  getDeliveryOrderType,
};
