// api/stripe-webhook.ts
// Handles Stripe webhook events for subscription management

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for admin operations
);

// Disable body parsing, we need raw body for webhook signature
export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawBody = await getRawBody(req);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout completed:', session.id);
      
      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      
      // Update user's organization with subscription info
      const { plan, billingCycle, userId } = session.metadata || {};
      
      if (userId) {
        // Get user to find their organization
        const { data: user } = await supabase
          .from('users')
          .select('organization_id')
          .eq('auth_user_id', userId)
          .single();

        if (user?.organization_id) {
          await supabase
            .from('organizations')
            .update({
              tier: plan,
              billing_cycle: billingCycle,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: subscription.id,
              subscription_status: subscription.status,
              trial_ends_at: subscription.trial_end 
                ? new Date(subscription.trial_end * 1000).toISOString()
                : null,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('id', user.organization_id);
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription updated:', subscription.id);

      // Update organization subscription status
      await supabase
        .from('organizations')
        .update({
          subscription_status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Subscription canceled:', subscription.id);

      // Update organization to free/canceled status
      await supabase
        .from('organizations')
        .update({
          subscription_status: 'canceled',
          tier: 'free', // Or handle differently
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment succeeded:', invoice.id);
      
      // Could send a receipt email here
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.log('Payment failed:', invoice.id);
      
      // Update status and potentially send dunning email
      if (invoice.subscription) {
        await supabase
          .from('organizations')
          .update({
            subscription_status: 'past_due',
          })
          .eq('stripe_subscription_id', invoice.subscription as string);
      }
      break;
    }

    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription;
      console.log('Trial ending soon:', subscription.id);
      
      // This fires 3 days before trial ends - send reminder email
      // You could trigger an email here via your email service
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
