// Si no hay clave de Stripe, usamos una implementación simulada
const stripe = process.env.STRIPE_SECRET_KEY
  ? require('stripe')(process.env.STRIPE_SECRET_KEY)
  : {
      paymentIntents: {
        create: async () => ({
          client_secret: 'mock_secret_key_for_development'
        })
      }
    };

const createPaymentIntent = async (amount) => {
  try {
    // Si no hay clave de Stripe, retornamos una respuesta simulada
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('Modo desarrollo: Usando intent de pago simulado');
      return {
        clientSecret: 'mock_secret_key_for_development',
        testMode: true
      };
    }
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe trabaja en centavos
      currency: 'usd',
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error('Error al crear intent de pago:', error);
    throw new Error('Error al procesar el pago');
  }
};

module.exports = {
  createPaymentIntent,
};
