const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');

const processPayment = async (req, res) => {
    try {
        const { amount } = req.body;


        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amounts in cents
            currency: 'usd',
            metadata: { integration_check: 'accept_a_payment' }
        });

        res.status(200).json({
            success: true,
            client_secret: paymentIntent.client_secret
        });
    } catch (error) {
        console.log("Stripe Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

const sendStripeApiKey = async (req, res) => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
};

module.exports = { processPayment, sendStripeApiKey };
