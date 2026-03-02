import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | RAWR",
  description: "By joining the pack, you agree to the conditions.",
};

export default function TermsPage() {
  return (
    <div className="bg-rawr-white min-h-screen py-20 font-body">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-16 border-b-4 border-rawr-black pb-8">
          <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-rawr-black mb-4">
            Terms of Service
          </h1>
          <p className="text-xl font-bold text-gray-500 uppercase tracking-widest">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <article className="prose prose-lg prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-h2:text-rawr-red max-w-none text-gray-700">
          <section className="mb-12">
            <h2>1. The Agreement</h2>
            <p>
              By accessing, browsing, or purchasing anything from RAWR STORE ("the Site"), you are engaging in our "Service" and agree to be bound by the following terms and conditions. If you do not agree to all the terms and conditions of this agreement, then you must leave this site immediately and drop your cart.
            </p>
          </section>

          <section className="mb-12">
            <h2>2. Limited Drops & Scarcity</h2>
            <p>
              RAWR relies on extreme rarity. Products are sold on a first-come, first-served basis. We do not guarantee item availability once placed in your cart. An item is only legally yours once checkout completes and a confirmation email is triggered. We reserve the right to cancel any fraudulent or heavily botted orders without notice.
            </p>
          </section>

          <section className="mb-12">
            <h2>3. Intellectual Property</h2>
            <p>
              All designs, logos, graphics, garment mockups, and text are exclusively owned by RAWR STREAMWARE. Any unauthorized reproduction, reselling of knock-offs, or use of our branding will be met with severe legal consequences.
            </p>
          </section>

          <section className="mb-12">
            <h2>4. Pricing & Errors</h2>
            <p>
              We reserve the right to modify prices at any time. If an item is listed at an incorrect price due to a typographical error or system glitch, we hold the right to cancel the order and issue a full refund.
            </p>
          </section>

          <section className="mb-12">
            <h2>5. Shipping & Liability</h2>
            <p>
              Once an order is handed over to our shipping carriers (USPS, FedEx, DHL), RAWR is no longer liable for stolen packages or delays. If a tracking number is marked as "Delivered", we will not issue refunds or replacements for claimed missing items. Ensure your address is perfectly accurate before confirming your order.
            </p>
          </section>

          <section className="mb-12">
            <h2>6. User Content & CRM Tagging</h2>
            <p>
              By creating an account, you consent to our internal tracking systems analyzing your purchases to unlock tiers and benefits. We use your data to improve our service and provide tailored Clout rankings.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
