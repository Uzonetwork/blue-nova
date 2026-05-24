import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

export const metadata: Metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: orders } = (await (supabase as any)
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })) as { data: OrderRow[] | null };

  return (
    <main className="pt-20">
      <section className="container-luxury py-16 max-w-4xl">
        <div className="mb-12">
          <p className="section-subheading mb-4">History</p>
          <h1 className="section-heading">My Orders</h1>
          <div className="gold-divider mt-6 !mx-0" />
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-brand-gray-500 text-sm mb-8">
              You haven&apos;t placed any orders yet.
            </p>
            <a href="/collections" className="btn-primary">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border border-brand-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-body text-xs tracking-widest uppercase text-brand-gold mb-1">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="font-heading text-lg text-brand-blue">${order.total}</p>
                  </div>
                  <span className="font-body text-xs tracking-widest uppercase text-brand-gray-500 border border-brand-gray-200 px-3 py-1">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
