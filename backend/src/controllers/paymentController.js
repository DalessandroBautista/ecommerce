const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Crear intent de pago de Stripe
// @route   POST /api/payments/create-payment-intent
// @access  Privado
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Crear PaymentIntent con el monto especificado
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe trabaja en centavos
      currency: 'usd',
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear intent de pago', error: error.message });
  }
};

// @desc    Procesar webhooks de Stripe
// @route   POST /api/payments/webhook
// @access  Público
const handleWebhook = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Manejar el evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Aquí puedes actualizar tu base de datos
      console.log('PaymentIntent fue exitoso:', paymentIntent.id);
      break;
    case 'payment_intent.payment_failed':
      console.log('Pago fallido');
      break;
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
};
