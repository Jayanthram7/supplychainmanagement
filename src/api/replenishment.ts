const API_BASE_URL = 'https://supplychainmanagement-hy5c.onrender.com/api/replenishment';

export const createLowStockAlert = async (data: {
  store_id: string;
  store_name: string;
  product_id: string;
  product_name: string;
  current_quantity: number;
  reorder_threshold: number;
  requested_quantity: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/alert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const createTransferOrder = async (replenishment_id: string, data: {
  warehouse_id: string;
  warehouse_stock: number;
}) => {
  const response = await fetch(`${API_BASE_URL}/transfer-order/${replenishment_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const dispatchShipment = async (replenishment_id: string) => {
  const response = await fetch(`${API_BASE_URL}/dispatch/${replenishment_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const receiveStock = async (replenishment_id: string) => {
  const response = await fetch(`${API_BASE_URL}/receive/${replenishment_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
};

export const getAllOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders`);
  return response.json();
};

export const getOrderById = async (replenishment_id: string) => {
  const response = await fetch(`${API_BASE_URL}/orders/${replenishment_id}`);
  return response.json();
};
