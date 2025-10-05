import mongoose, { Schema, Document } from 'mongoose';

export enum OrderStatus {
  ALERT_RAISED = 'ALERT_RAISED',
  PENDING_PICKING = 'PENDING_PICKING',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED'
}

export interface IReplenishmentOrder extends Document {
  replenishment_id: string;
  store_id: string;
  store_name: string;
  product_id: string;
  product_name: string;
  current_quantity: number;
  reorder_threshold: number;
  requested_quantity: number;
  status: OrderStatus;
  transfer_order_id?: string;
  tracking_number?: string;
  warehouse_id?: string;
  warehouse_stock?: number;
  created_at: Date;
  updated_at: Date;
  stage_history: {
    stage: string;
    timestamp: Date;
    details?: string;
  }[];
}

const ReplenishmentOrderSchema: Schema = new Schema({
  replenishment_id: { type: String, required: true, unique: true },
  store_id: { type: String, required: true },
  store_name: { type: String, required: true },
  product_id: { type: String, required: true },
  product_name: { type: String, required: true },
  current_quantity: { type: Number, required: true },
  reorder_threshold: { type: Number, required: true },
  requested_quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.ALERT_RAISED
  },
  transfer_order_id: { type: String },
  tracking_number: { type: String },
  warehouse_id: { type: String },
  warehouse_stock: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  stage_history: [{
    stage: String,
    timestamp: { type: Date, default: Date.now },
    details: String
  }]
});

export default mongoose.model<IReplenishmentOrder>('ReplenishmentOrder', ReplenishmentOrderSchema);
