import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, getIp } from "@/lib/rateLimit";
import type { CartItem } from "@/types";

// ── Input validation ──────────────────────────────────────────────────────────

const MAX_ITEMS = 50;
const MAX_ITEM_PRICE = 10_000_000;
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
  return typeof a.fullName === "string" && (a.fullName as string).length > 0;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Rate limit: 10 checkout attempts per IP per minute
  if (!rateLimit(getIp(request), 10, 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  try {
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

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal >= 50_000 ? 0 : 3_500;
    const total = subtotal + shipping;
    const amountKobo = Math.round(total * 100);

    let orderId: string | null = null;

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: order } = await (supabase as any)
          .from("orders")
          .insert({
            user_id:          user.id,
            status:           "pending",
            total_amount:     total,
            shipping_address: shippingAddress,
          })
          .select("id")
          .single() as { data: { id: string } | null };

        if (order) orderId = order.id;
      }
    } catch {
      // Supabase unavailable or user not authenticated — continue as guest
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountKobo,
      currency: "ngn",
      metadata: {
        orderId:  orderId ?? "guest",
        items:    JSON.stringify(items.map((i) => ({ id: i.productId, qty: i.quantity }))),
        customer: (shippingAddress as Record<string, string>).fullName ?? "",
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId:      orderId ?? paymentIntent.id,
      total,
      shipping,
    });
  } catch (err) {
    // Log server-side only — never send Stripe internals to the client
    console.error("[checkout]", err instanceof Error ? err.message : "unknown error");
    return NextResponse.json({ error: "Unable to process checkout. Please try again." }, { status: 500 });
  }
}
