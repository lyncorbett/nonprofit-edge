// api/create-checkout-session.ts
// Vercel Serverless Function for Stripe Checkout

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Price configuration - amounts in cents
const PRICES = {
  essential: {
    monthly: {
      amount: 7900, // $79.00
      interval: 'month' as const,
    },
    annual: {
      amount: 79000, // $790.00
      interval: 'year' as const,
    }
  },
  professional: {
    monthly: {
      amount: 15900, // $159.00
      interval: 'month' as const,
    },
    annual: {
      amount: 159000, // $1,590.00
      interval: 'year' as const,
    }
  },
  premium: {
    monthly: {
      amount: 32900, // $329.00
      interval: 'month' as const,
    },
    annual: {
      amount: 329000, // $3,290.00
      interval: 'year' as const,
    }
  }
};

const PLAN_NAMES = {
  essential: 'Essential',
  professional: 'Professional',
  premium: 'Premium'
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { plan, billingCycle, email, userId, successUrl, cancelUrl } = req.body;

    // Validate plan
    if (!PRICES[plan as keyof typeof PRICES]) {
      return res.status(400).json({ error: 'Invalid plan selected' });
    }

    const priceConfig = PRICES[plan as keyof typeof PRICES][billingCycle as 'monthly' | 'annual'];
    const planName = PLAN_NAMES[plan as keyof typeof PLAN_NAMES];

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `The Nonprofit Edge - ${planName} Plan`,
              description: `${billingCycle === 'annual' ? 'Annual' : 'Monthly'} subscription`,
            },
            unit_amount: priceConfig.amount,
            recurring: {
              interval: priceConfig.interval,
            },
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 3, // 3-day free trial
        metadata: {
          plan,
          billingCycle,
          userId: userId || '',
        },
      },
      metadata: {
        plan,
        billingCycle,
        userId: userId || '',
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
