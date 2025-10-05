import { Package, TrendingDown, Truck, CheckCircle, Clock } from 'lucide-react';
import { ReplenishmentOrder, OrderStatus } from '../types/replenishment';

interface OrderCardProps {
  order: ReplenishmentOrder;
  onClick: () => void;
}

const statusConfig = {
  [OrderStatus.ALERT_RAISED]: {
    label: 'Alert Raised',
    icon: TrendingDown,
    color: 'bg-red-100 text-red-700 border-red-300',
    iconColor: 'text-red-600'
  },
  [OrderStatus.PENDING_PICKING]: {
    label: 'Pending Picking',
    icon: Package,
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    iconColor: 'text-yellow-600'
  },
  [OrderStatus.IN_TRANSIT]: {
    label: 'In Transit',
    icon: Truck,
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    iconColor: 'text-blue-600'
  },
  [OrderStatus.COMPLETED]: {
    label: 'Completed',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700 border-green-300',
    iconColor: 'text-green-600'
  }
};

export default function OrderCard({ order, onClick }: OrderCardProps) {
  const config = statusConfig[order.status];
  const Icon = config.icon;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 cursor-pointer overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {order.product_name}
            </h3>
            <p className="text-sm text-gray-500">{order.store_name}</p>
          </div>
          <div className={`p-2 rounded-lg ${config.color.split(' ')[0]}`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Replenishment ID</span>
            <span className="font-mono text-xs text-gray-900">{order.replenishment_id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Quantity Requested</span>
            <span className="font-semibold text-gray-900">{order.requested_quantity} units</span>
          </div>
          {order.tracking_number && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tracking</span>
              <span className="font-mono text-xs text-blue-600">{order.tracking_number}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
            {config.label}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(order.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
