import { X, Package, Warehouse, Truck, CheckCircle, Clock } from 'lucide-react';
import { ReplenishmentOrder, OrderStatus } from '../types/replenishment';
import { createTransferOrder, dispatchShipment, receiveStock } from '../api/replenishment';
import { useState } from 'react';

interface OrderModalProps {
  order: ReplenishmentOrder;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderModal({ order, onClose, onUpdate }: OrderModalProps) {
  const [loading, setLoading] = useState(false);
  const [warehouseId, setWarehouseId] = useState('WH-001');
  const [warehouseStock, setWarehouseStock] = useState(1000);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCreateTransferOrder = async () => {
    setLoading(true);
    try {
      await createTransferOrder(order.replenishment_id, {
        warehouse_id: warehouseId,
        warehouse_stock: warehouseStock
      });
      onUpdate();
    } catch (error) {
      console.error('Error creating transfer order:', error);
    }
    setLoading(false);
  };

  const handleDispatchShipment = async () => {
    setLoading(true);
    try {
      await dispatchShipment(order.replenishment_id);
      onUpdate();
    } catch (error) {
      console.error('Error dispatching shipment:', error);
    }
    setLoading(false);
  };

  const handleReceiveStock = async () => {
    setLoading(true);
    try {
      await receiveStock(order.replenishment_id);
      onUpdate();
    } catch (error) {
      console.error('Error receiving stock:', error);
    }
    setLoading(false);
  };

  const getActionButton = () => {
    switch (order.status) {
      case OrderStatus.ALERT_RAISED:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warehouse ID
                </label>
                <input
                  type="text"
                  value={warehouseId}
                  onChange={(e) => setWarehouseId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Stock
                </label>
                <input
                  type="number"
                  value={warehouseStock}
                  onChange={(e) => setWarehouseStock(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleCreateTransferOrder}
              disabled={loading}
              className="w-full bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center font-semibold disabled:opacity-50"
            >
              <Package className="w-5 h-5 mr-2" />
              Create Transfer Order
            </button>
          </div>
        );
      case OrderStatus.PENDING_PICKING:
        return (
          <button
            onClick={handleDispatchShipment}
            disabled={loading}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-semibold disabled:opacity-50"
          >
            <Truck className="w-5 h-5 mr-2" />
            Dispatch Shipment
          </button>
        );
      case OrderStatus.IN_TRANSIT:
        return (
          <button
            onClick={handleReceiveStock}
            disabled={loading}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center font-semibold disabled:opacity-50"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Confirm Stock Received
          </button>
        );
      case OrderStatus.COMPLETED:
        return (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-semibold">Order Completed</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Replenishment ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">{order.replenishment_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-semibold text-gray-900">{order.product_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Store</p>
                <p className="font-semibold text-gray-900">{order.store_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Store ID</p>
                <p className="font-mono text-sm font-semibold text-gray-900">{order.store_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Quantity</p>
                <p className="font-semibold text-red-600">{order.current_quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Reorder Threshold</p>
                <p className="font-semibold text-gray-900">{order.reorder_threshold} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Requested Quantity</p>
                <p className="font-semibold text-blue-600">{order.requested_quantity} units</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Created</p>
                <p className="text-sm text-gray-900">{formatDate(order.created_at)}</p>
              </div>
            </div>

            {order.transfer_order_id && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Transfer Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{order.transfer_order_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Warehouse ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">{order.warehouse_id}</p>
                  </div>
                </div>
              </div>
            )}

            {order.tracking_number && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <p className="font-mono text-lg font-bold text-blue-600">{order.tracking_number}</p>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Stage History
            </h3>
            <div className="space-y-3">
              {order.stage_history.map((stage, index) => (
                <div key={index} className="flex items-start bg-gray-50 rounded-lg p-4">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{stage.stage}</p>
                    <p className="text-sm text-gray-600 mt-1">{stage.details}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(stage.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );
}
