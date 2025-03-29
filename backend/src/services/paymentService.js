// Si no hay clave de Stripe, usamos una implementación simulada
let stripe;
if (process.env.STRIPE_SECRET_KEY) {
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
} else {
  console.warn('¡ADVERTENCIA! No se encontró clave de Stripe. Los pagos no funcionarán correctamente.');
  // Alternativa: lanzar un error si estamos en producción
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Falta configurar la clave de Stripe en producción');
  }
  
  // Implementación simulada solo para desarrollo
  stripe = {
    paymentIntents: {
      create: async () => ({
        client_secret: 'mock_secret_key_for_development'
      })
    }
  };
}

/**
 * Crea un intent de pago con Stripe
 * @param {Number} amount - Monto a cobrar (en pesos)
 * @returns {Object} Intent de pago
 */
const createPaymentIntent = async (amount) => {
  try {
    // Verificar que la clave de Stripe está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      // En producción deberíamos lanzar un error
      if (process.env.NODE_ENV === 'production') {
        throw new Error('La clave de Stripe no está configurada');
      }
      
      // En desarrollo podemos usar un simulador
      console.warn('Usando simulador de pagos (no hay clave de Stripe configurada)');
      return {
        clientSecret: 'test_secret_' + Math.random().toString(36).substring(2, 15),
        amount: Math.round(amount * 100), // Convertir a centavos
        id: 'mock_payment_intent_' + Date.now(),
        status: 'requires_payment_method',
        _isMock: true
      };
    }
    
    // Crear intent de pago real con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convertir a centavos
      currency: 'mxn', 
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      id: paymentIntent.id,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Error al crear intent de pago:', error);
    throw error;
  }
};

module.exports = {
  createPaymentIntent,
};
