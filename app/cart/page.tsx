import { Metadata } from "next";

export const metadata: Metadata = { title: "Your Bag" };

export default function CartPage() {
  return (
    <main className="pt-20">
      <section className="container-luxury py-16">
        <div className="text-center mb-12">
          <p className="section-subheading mb-4">Review</p>
          <h1 className="section-heading">Your Bag</h1>
          <div className="gold-divider mt-6" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <p className="font-body text-brand-gray-500 text-sm text-center py-16">
              Your bag is empty.
            </p>
          </div>
          <div className="lg:col-span-1">
            <div className="border border-brand-gray-200 p-8">
              <h2 className="font-heading text-xl text-brand-blue mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between font-body text-sm text-brand-gray-600">
                  <span>Subtotal</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between font-body text-sm text-brand-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="border-t border-brand-gray-200 pt-4 mb-8">
                <div className="flex justify-between font-heading text-lg text-brand-blue">
                  <span>Total</span>
                  <span>$0</span>
                </div>
              </div>
              <a href="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
