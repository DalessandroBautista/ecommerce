const Order = require('../models/orderModel');
const { createPaymentIntent } = require('../services/paymentService');

// @desc    Crear nueva orden
// @route   POST /api/orders
// @access  Privado
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No hay items en la orden' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener orden por ID
// @route   GET /api/orders/:id
// @access  Privado
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Actualizar orden a pagada
// @route   PUT /api/orders/:id/pay
// @access  Privado
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Actualizar orden a entregada
// @route   PUT /api/orders/:id/deliver
// @access  Privado/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Orden no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener ordenes del usuario
// @route   GET /api/orders/myorders
// @access  Privado
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Obtener todas las ordenes
// @route   GET /api/orders
// @access  Privado/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error del servidor', error: error.message });
  }
};

// @desc    Crear intent de pago
// @route   POST /api/orders/:id/create-payment
// @access  Privado
const createPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    
    // Verificar que la orden pertenece al usuario
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const paymentIntent = await createPaymentIntent(order.totalPrice);
    res.json(paymentIntent);
  } catch (error) {
    res.status(500).json({ message: 'Error en el proceso de pago', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  createPayment,
};
