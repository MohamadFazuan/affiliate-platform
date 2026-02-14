import Stripe from "stripe";

// Initialize Stripe with API key from environment
export function getStripeClient(env: any): Stripe {
  const apiKey = env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY not configured");
  }
  return new Stripe(apiKey, {
    apiVersion: "2026-01-28.clover",
    httpClient: Stripe.createFetchHttpClient(),
  });
}

// Subscription tier price IDs
export const STRIPE_PRICE_IDS = {
  FREE: null, // Free tier doesn't need Stripe
  PRO: "STRIPE_PRICE_ID_PRO", // Replace with actual Stripe Price ID
  ENTERPRISE: "STRIPE_PRICE_ID_ENTERPRISE", // Replace with actual Stripe Price ID
};

// Create a checkout session for subscription
export async function createCheckoutSession(
  userId: number,
  email: string,
  priceId: string,
  tier: "pro" | "enterprise",
  env: any,
): Promise<{ sessionId: string; url: string }> {
  const stripe = getStripeClient(env);

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    client_reference_id: userId.toString(),
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${env.APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL}/pricing`,
    metadata: {
      userId: userId.toString(),
      tier,
    },
    subscription_data: {
      metadata: {
        userId: userId.toString(),
        tier,
      },
      trial_period_days: 14, // 14-day free trial
    },
  });

  return {
    sessionId: session.id,
    url: session.url!,
  };
}

// Create a billing portal session
export async function createPortalSession(
  customerId: string,
  env: any,
): Promise<{ url: string }> {
  const stripe = getStripeClient(env);

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.APP_URL}/settings`,
  });

  return { url: session.url };
}

// Get customer subscription details
export async function getSubscription(
  subscriptionId: string,
  env: any,
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient(env);
  return await stripe.subscriptions.retrieve(subscriptionId);
}

// Get customer details
export async function getCustomer(
  customerId: string,
  env: any,
): Promise<Stripe.Customer> {
  const stripe = getStripeClient(env);
  return (await stripe.customers.retrieve(customerId)) as Stripe.Customer;
}

// Cancel subscription
export async function cancelSubscription(
  subscriptionId: string,
  env: any,
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient(env);
  return await stripe.subscriptions.cancel(subscriptionId);
}

// Update subscription
export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
  env: any,
): Promise<Stripe.Subscription> {
  const stripe = getStripeClient(env);

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_behavior: "create_prorations",
  });
}

// List invoices for a customer
export async function listInvoices(
  customerId: string,
  limit: number = 10,
  env: any,
): Promise<Stripe.Invoice[]> {
  const stripe = getStripeClient(env);

  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });

  return invoices.data;
}

// Handle Stripe webhook events
export async function handleWebhookEvent(
  event: Stripe.Event,
  db: any,
): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const tier = session.metadata?.tier;
      const customerId = session.customer as string;
      const subscriptionId = session.subscription as string;

      if (userId && tier) {
        // Update user subscription in database
        await db
          .prepare(
            `UPDATE users 
             SET subscription_tier = ?, 
                 stripe_customer_id = ?, 
                 stripe_subscription_id = ?,
                 trial_ends_at = datetime('now', '+14 days'),
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
          )
          .bind(tier, customerId, subscriptionId, parseInt(userId))
          .run();
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Get user by customer ID
      const user = await db
        .prepare("SELECT id FROM users WHERE stripe_customer_id = ?")
        .bind(customerId)
        .first();

      if (user) {
        const status = subscription.status;
        const tier = subscription.metadata.tier || "free";

        await db
          .prepare(
            `UPDATE users 
             SET subscription_tier = ?,
                 subscription_status = ?,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
          )
          .bind(tier, status, user.id)
          .run();
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Get user by customer ID
      const user = await db
        .prepare("SELECT id FROM users WHERE stripe_customer_id = ?")
        .bind(customerId)
        .first();

      if (user) {
        // Downgrade to free tier
        await db
          .prepare(
            `UPDATE users 
             SET subscription_tier = 'free',
                 subscription_status = 'canceled',
                 stripe_subscription_id = NULL,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
          )
          .bind(user.id)
          .run();
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Get user by customer ID
      const user = await db
        .prepare("SELECT id FROM users WHERE stripe_customer_id = ?")
        .bind(customerId)
        .first();

      if (user) {
        // Update last payment date
        await db
          .prepare(
            `UPDATE users 
             SET last_payment_at = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
          )
          .bind(user.id)
          .run();
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      // Get user by customer ID
      const user = await db
        .prepare("SELECT id FROM users WHERE stripe_customer_id = ?")
        .bind(customerId)
        .first();

      if (user) {
        // Mark subscription as past_due
        await db
          .prepare(
            `UPDATE users 
             SET subscription_status = 'past_due',
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
          )
          .bind(user.id)
          .run();
      }
      break;
    }
  }
}
