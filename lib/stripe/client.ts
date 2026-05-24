import { loadStripe } from "@stripe/stripe-js";

// Singleton Stripe.js promise — safe to use in browser/client components.
// Only the NEXT_PUBLIC_ publishable key is referenced here.
let stripePromise: ReturnType<typeof loadStripe>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
