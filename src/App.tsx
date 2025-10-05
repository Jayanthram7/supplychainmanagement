import { useState, useEffect } from 'react';
import { Package, RefreshCw, Plus, TrendingDown, Truck, CheckCircle, Clock } from 'lucide-react';
import { ReplenishmentOrder, OrderStatus } from './types/replenishment';
import { getAllOrders } from './api/replenishment';
import OrderCard from './components/OrderCard';
import OrderModal from './components/OrderModal';
import CreateAlertModal from './components/CreateAlertModal';

function App() {
  const [orders, setOrders] = useState<ReplenishmentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<ReplenishmentOrder | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<OrderStatus | 'ALL'>('ALL');

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOrderUpdate = async () => {
    await fetchOrders();
    if (selectedOrder) {
      const updatedOrder = orders.find(o => o.replenishment_id === selectedOrder.replenishment_id);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    alerts: orders.filter(o => o.status === OrderStatus.ALERT_RAISED).length,
    inTransit: orders.filter(o => o.status === OrderStatus.IN_TRANSIT).length,
    completed: orders.filter(o => o.status === OrderStatus.COMPLETED).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Package className="w-10 h-10 mr-3 text-blue-600" />
                Project Sentry
              </h1>
              <p className="text-gray-600 text-lg">
                Automated Inventory Replenishment System
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 flex items-center text-gray-700 font-medium"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Alert
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-red-600">{stats.alerts}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">In Transit</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === 'ALL'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter(OrderStatus.ALERT_RAISED)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === OrderStatus.ALERT_RAISED
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Alert Raised
              </button>
              <button
                onClick={() => setFilter(OrderStatus.PENDING_PICKING)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === OrderStatus.PENDING_PICKING
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pending Picking
              </button>
              <button
                onClick={() => setFilter(OrderStatus.IN_TRANSIT)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === OrderStatus.IN_TRANSIT
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Transit
              </button>
              <button
                onClick={() => setFilter(OrderStatus.COMPLETED)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filter === OrderStatus.COMPLETED
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading orders...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'ALL'
                ? 'Create your first low stock alert to get started.'
                : `No orders in ${filter.replace('_', ' ').toLowerCase()} status.`}
            </p>
            {filter === 'ALL' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center font-semibold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Alert
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onClick={() => setSelectedOrder(order)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleOrderUpdate}
        />
      )}

      {showCreateModal && (
        <CreateAlertModal
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchOrders}
        />
      )}
    </div>
  );
}

export default App;
