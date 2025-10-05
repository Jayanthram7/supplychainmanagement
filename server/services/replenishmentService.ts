import ReplenishmentOrder, { OrderStatus } from '../models/ReplenishmentOrder';
import { sendKafkaMessage } from '../kafka/kafkaClient';
import { KAFKA_TOPICS } from '../kafka/topics';

export const createLowStockAlert = async (data: {
  store_id: string;
  store_name: string;
  product_id: string;
  product_name: string;
  current_quantity: number;
  reorder_threshold: number;
  requested_quantity: number;
}) => {
  const replenishment_id = `REP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const order = new ReplenishmentOrder({
    replenishment_id,
    ...data,
    status: OrderStatus.ALERT_RAISED,
    stage_history: [{
      stage: 'ALERT_RAISED',
      timestamp: new Date(),
      details: 'Low stock alert triggered by POS system'
    }]
  });

  await order.save();

  await sendKafkaMessage(KAFKA_TOPICS.LOW_STOCK_ALERT, {
    replenishment_id: order.replenishment_id,
    store_id: order.store_id,
    product_id: order.product_id,
    requested_quantity: order.requested_quantity
  });

  return order;
};

export const createTransferOrder = async (replenishment_id: string, warehouse_data: {
  warehouse_id: string;
  warehouse_stock: number;
}) => {
  const order = await ReplenishmentOrder.findOne({ replenishment_id });

  if (!order) {
    throw new Error('Replenishment order not found');
  }

  if (order.status !== OrderStatus.ALERT_RAISED) {
    throw new Error('Order is not in ALERT_RAISED status');
  }

  if (warehouse_data.warehouse_stock < order.requested_quantity) {
    throw new Error('Insufficient warehouse stock');
  }

  const transfer_order_id = `TO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  order.transfer_order_id = transfer_order_id;
  order.warehouse_id = warehouse_data.warehouse_id;
  order.warehouse_stock = warehouse_data.warehouse_stock;
  order.status = OrderStatus.PENDING_PICKING;
  order.updated_at = new Date();
  order.stage_history.push({
    stage: 'PENDING_PICKING',
    timestamp: new Date(),
    details: `Transfer order ${transfer_order_id} created from warehouse ${warehouse_data.warehouse_id}`
  });

  await order.save();

  await sendKafkaMessage(KAFKA_TOPICS.TRANSFER_ORDER_CREATED, {
    replenishment_id: order.replenishment_id,
    transfer_order_id,
    warehouse_id: warehouse_data.warehouse_id,
    quantity: order.requested_quantity
  });

  return order;
};

export const dispatchShipment = async (replenishment_id: string) => {
  const order = await ReplenishmentOrder.findOne({ replenishment_id });

  if (!order) {
    throw new Error('Replenishment order not found');
  }

  if (order.status !== OrderStatus.PENDING_PICKING) {
    throw new Error('Order is not in PENDING_PICKING status');
  }

  const tracking_number = `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  order.tracking_number = tracking_number;
  order.status = OrderStatus.IN_TRANSIT;
  order.updated_at = new Date();
  order.stage_history.push({
    stage: 'IN_TRANSIT',
    timestamp: new Date(),
    details: `Shipment dispatched with tracking number ${tracking_number}`
  });

  await order.save();

  await sendKafkaMessage(KAFKA_TOPICS.SHIPMENT_DISPATCHED, {
    replenishment_id: order.replenishment_id,
    tracking_number,
    store_id: order.store_id
  });

  return order;
};

export const receiveStock = async (replenishment_id: string) => {
  const order = await ReplenishmentOrder.findOne({ replenishment_id });

  if (!order) {
    throw new Error('Replenishment order not found');
  }

  if (order.status !== OrderStatus.IN_TRANSIT) {
    throw new Error('Order is not in IN_TRANSIT status');
  }

  order.status = OrderStatus.COMPLETED;
  order.updated_at = new Date();
  order.stage_history.push({
    stage: 'COMPLETED',
    timestamp: new Date(),
    details: 'Stock received and inventory updated at store'
  });

  await order.save();

  await sendKafkaMessage(KAFKA_TOPICS.STOCK_RECEIVED, {
    replenishment_id: order.replenishment_id,
    store_id: order.store_id,
    product_id: order.product_id,
    quantity_received: order.requested_quantity
  });

  return order;
};

export const getAllOrders = async () => {
  return await ReplenishmentOrder.find().sort({ created_at: -1 });
};

export const getOrderById = async (replenishment_id: string) => {
  return await ReplenishmentOrder.findOne({ replenishment_id });
};
