export enum OrderStatus {
  ALERT_RAISED = 'ALERT_RAISED',
  PENDING_PICKING = 'PENDING_PICKING',
  IN_TRANSIT = 'IN_TRANSIT',
  COMPLETED = 'COMPLETED'
}

export interface StageHistory {
  stage: string;
  timestamp: string;
  details?: string;
}

export interface ReplenishmentOrder {
  _id: string;
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
  created_at: string;
  updated_at: string;
  stage_history: StageHistory[];
}
