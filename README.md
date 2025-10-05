# Project Sentry - Automated Inventory Replenishment System

A complete backend platform for UrbanStyle Apparel that automates the inventory replenishment process across retail stores and warehouses.

## Features

- **Low Stock Alert System**: Automatically detects when inventory falls below reorder thresholds
- **Transfer Order Management**: Creates and tracks transfer orders from warehouse to stores
- **Shipment Tracking**: Monitors shipments in transit with tracking numbers
- **Stock Receipt Confirmation**: Completes the replenishment cycle when stock arrives
- **Real-time Dashboard**: Beautiful frontend with live updates and status tracking
- **State Machine Architecture**: Ensures proper order lifecycle progression
- **MongoDB Integration**: Maintains a digital thread for all replenishment orders
- **Kafka Orchestration**: Event-driven architecture for stage transitions

## Architecture

### Four-Stage Replenishment Lifecycle

1. **ALERT_RAISED**: POS system detects low stock and creates replenishment request
2. **PENDING_PICKING**: Transfer order created, warehouse prepares shipment
3. **IN_TRANSIT**: Shipment dispatched with tracking number
4. **COMPLETED**: Stock received and inventory updated at store

### Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Express.js, Node.js, TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Message Queue**: Apache Kafka (KafkaJS)
- **State Management**: Client-side React hooks

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (connection string configured in .env)
- Apache Kafka (optional - runs in simulation mode if unavailable)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run server:dev
```

3. In a separate terminal, start the frontend:
```bash
npm run dev
```

4. Access the application at `http://localhost:5173`

## API Endpoints

### Create Low Stock Alert
```
POST /api/replenishment/alert
Body: {
  store_id: string,
  store_name: string,
  product_id: string,
  product_name: string,
  current_quantity: number,
  reorder_threshold: number,
  requested_quantity: number
}
```

### Create Transfer Order
```
POST /api/replenishment/transfer-order/:replenishment_id
Body: {
  warehouse_id: string,
  warehouse_stock: number
}
```

### Dispatch Shipment
```
POST /api/replenishment/dispatch/:replenishment_id
```

### Receive Stock
```
POST /api/replenishment/receive/:replenishment_id
```

### Get All Orders
```
GET /api/replenishment/orders
```

### Get Order by ID
```
GET /api/replenishment/orders/:replenishment_id
```

## Usage

1. **Create an Alert**: Click "Create Alert" to simulate a low stock condition
2. **Process Transfer Order**: Click on an order card and click "Create Transfer Order"
3. **Dispatch Shipment**: Once transfer order is created, click "Dispatch Shipment"
4. **Receive Stock**: When shipment arrives, click "Confirm Stock Received"

The dashboard automatically refreshes every 5 seconds to show real-time updates.

## Database Schema

### ReplenishmentOrder Model
- `replenishment_id`: Unique identifier (REP-xxxxx)
- `store_id`, `store_name`: Store information
- `product_id`, `product_name`: Product information
- `current_quantity`, `reorder_threshold`, `requested_quantity`: Inventory data
- `status`: Current stage (ALERT_RAISED | PENDING_PICKING | IN_TRANSIT | COMPLETED)
- `transfer_order_id`: Transfer order identifier (TO-xxxxx)
- `tracking_number`: Shipment tracking number (TRK-xxxxx)
- `warehouse_id`, `warehouse_stock`: Warehouse data
- `stage_history`: Array of stage transitions with timestamps

## Kafka Topics

- `low-stock-alert`: Published when alert is created
- `transfer-order-created`: Published when transfer order is created
- `shipment-dispatched`: Published when shipment is dispatched
- `stock-received`: Published when stock is received

## Project Structure

```
project-sentry/
├── server/
│   ├── config/
│   │   └── database.ts
│   ├── models/
│   │   └── ReplenishmentOrder.ts
│   ├── services/
│   │   └── replenishmentService.ts
│   ├── routes/
│   │   └── replenishment.ts
│   ├── kafka/
│   │   ├── kafkaClient.ts
│   │   └── topics.ts
│   └── index.ts
├── src/
│   ├── components/
│   │   ├── OrderCard.tsx
│   │   ├── OrderModal.tsx
│   │   └── CreateAlertModal.tsx
│   ├── api/
│   │   └── replenishment.ts
│   ├── types/
│   │   └── replenishment.ts
│   └── App.tsx
└── package.json
```

## Key Design Principles

- **Digital Thread**: Single source of truth for each replenishment order
- **Unique Identification**: Every order, transfer, and shipment has unique IDs
- **State Management**: Proper state transitions with validation
- **Traceability**: Complete audit trail via stage_history
- **Event-Driven**: Kafka topics enable loose coupling between stages
