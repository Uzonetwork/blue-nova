import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { rateLimit, getIp } from "@/lib/rateLimit";
import type { CartItem } from "@/types";

// ── Input validation ──────────────────────────────────────────────────────────

const MAX_ITEMS = 50;
const MAX_ITEM_PRICE = 10_000_000; // ₦10,000,000 — sanity ceiling
const MAX_QUANTITY = 99;

function validateItems(items: unknown): items is CartItem[] {
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) return false;
  return items.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof item.productId === "string" && item.productId.length > 0 &&
      typeof item.name === "string" && item.name.length > 0 &&
      typeof item.price === "number" && item.price > 0 && item.price <= MAX_ITEM_PRICE &&
      typeof item.quantity === "number" && Number.isInteger(item.quantity) &&
        item.quantity >= 1 && item.quantity <= MAX_QUANTITY
  );
}

function validateAddress(addr: unknown): addr is Record<string, string> {
  if (!addr || typeof addr !== "object") return false;
  const a = addr as Record<string, unknown>;
  return (
    typeof a.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.email) &&
    typeof a.fullName === "string" && (a.fullName as string).length > 0
  );
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Rate limit: 10 checkout attempts per IP per minute
  if (!rateLimit(getIp(request), 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
    const origin =
      request.headers.get("origin") ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { items, shippingAddress } = body as {
      items: unknown;
      shippingAddress: unknown;
    };

    if (!validateItems(items)) {
      return NextResponse.json({ error: "Invalid or empty cart." }, { status: 400 });
    }

    if (!validateAddress(shippingAddress)) {
      return NextResponse.json({ error: "Invalid shipping address." }, { status: 400 });
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 50_000 ? 0 : 3_500;

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "ngn",
        product_data: {
          // Truncate name to Stripe's 250-char limit; strip control chars
          name: item.name.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 250),
          ...(item.image && typeof item.image === "string" ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "ngn",
          product_data: { name: "Delivery" },
          unit_amount: shipping * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: (shippingAddress as Record<string, string>).email,
      // {CHECKOUT_SESSION_ID} is a Stripe template variable — do not change it
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      metadata: {
        shipping_address: JSON.stringify(shippingAddress),
        items_summary: JSON.stringify(
          items.map((i) => ({ id: i.productId, name: i.name, qty: i.quantity }))
        ),
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    const e = err as { message?: string; type?: string; code?: string };
    // Log details server-side only — never send Stripe internals to the client
    console.error("[checkout/session]", { message: e?.message, type: e?.type, code: e?.code });
    return NextResponse.json(
      { error: "Unable to create checkout session. Please try again." },
      { status: 500 }
    );
  }
}
