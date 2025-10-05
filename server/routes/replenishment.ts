import express from 'express';
import {
  createLowStockAlert,
  createTransferOrder,
  dispatchShipment,
  receiveStock,
  getAllOrders,
  getOrderById
} from '../services/replenishmentService.js';

const router = express.Router();

router.post('/alert', async (req, res) => {
  try {
    const order = await createLowStockAlert(req.body);
    res.status(201).json({
      success: true,
      message: 'Low stock alert created successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/transfer-order/:replenishment_id', async (req, res) => {
  try {
    const { replenishment_id } = req.params;
    const order = await createTransferOrder(replenishment_id, req.body);
    res.status(200).json({
      success: true,
      message: 'Transfer order created successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/dispatch/:replenishment_id', async (req, res) => {
  try {
    const { replenishment_id } = req.params;
    const order = await dispatchShipment(replenishment_id);
    res.status(200).json({
      success: true,
      message: 'Shipment dispatched successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.post('/receive/:replenishment_id', async (req, res) => {
  try {
    const { replenishment_id } = req.params;
    const order = await receiveStock(replenishment_id);
    res.status(200).json({
      success: true,
      message: 'Stock received successfully',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await getAllOrders();
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/orders/:replenishment_id', async (req, res) => {
  try {
    const { replenishment_id } = req.params;
    const order = await getOrderById(replenishment_id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
