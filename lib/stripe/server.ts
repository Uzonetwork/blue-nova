import Stripe from "stripe";

// Server-only Stripe instance. Never import this from a client component.
// STRIPE_SECRET_KEY is not prefixed with NEXT_PUBLIC_ and is never sent to the browser.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiVersion: "2026-04-22.dahlia" as any,
});
