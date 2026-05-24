import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="pt-20">
      <section className="container-luxury py-16 max-w-4xl">
        <div className="mb-12">
          <p className="section-subheading mb-4">Welcome Back</p>
          <h1 className="section-heading">My Account</h1>
          <div className="gold-divider mt-6 !mx-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <nav className="space-y-1">
            {[
              { label: "Profile", href: "/account" },
              { label: "Orders", href: "/account/orders" },
              { label: "Wishlist", href: "/account/wishlist" },
              { label: "Addresses", href: "/account/addresses" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block nav-link py-3 border-b border-brand-gray-100 hover:text-brand-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="md:col-span-2">
            <h2 className="font-heading text-xl text-brand-blue mb-6">Profile Information</h2>
            <p className="font-body text-sm text-brand-gray-600">{user.email}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
