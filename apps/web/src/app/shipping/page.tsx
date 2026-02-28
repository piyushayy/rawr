import { Metadata } from "next";
import { Truck, Globe, Clock, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy | RAWR",
  description: "How we get the goods to you.",
};

export default function ShippingPage() {
  return (
    <div className="bg-rawr-white min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-center mb-16 text-rawr-black">
          Shipping
        </h1>

        <div className="grid gap-8">
          <div className="bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505] flex gap-6">
            <div className="text-rawr-red shrink-0">
              <Clock className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-2">
                Processing Time
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We process orders within <strong>24-48 hours</strong>. Since
                everything is 1-of-1, we double check condition before packing.
                <br />
                Drops may take up to 72 hours due to high volume.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505] flex gap-6">
            <div className="text-rawr-red shrink-0">
              <Truck className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-2">
                Domestic Shipping
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We use UPS and USPS Priority.
                <br />
                <strong>Standard:</strong> 3-5 Business Days ($10 flat rate)
                <br />
                <strong>Express:</strong> 1-2 Business Days ($25)
                <br />
                <strong>Free Shipping:</strong> On orders over $150.
              </p>
            </div>
          </div>

          <div className="bg-white border-2 border-rawr-black p-8 shadow-[8px_8px_0px_0px_#050505] flex gap-6">
            <div className="text-rawr-red shrink-0">
              <Globe className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-2">
                International
              </h2>
              <p className="text-gray-600 leading-relaxed">
                We ship worldwide. International shipping is calculated at
                checkout based on weight and destination.
                <br />
                <span className="text-red-500 font-bold">NOTE:</span> Customs
                duties and taxes are the responsibility of the buyer.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-500 p-8 flex gap-6">
            <div className="text-yellow-600 shrink-0">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-2xl font-bold uppercase mb-2 text-yellow-800">
                Lost Packages
              </h2>
              <p className="text-yellow-900 leading-relaxed">
                Once the carrier scans the package, we are not responsible for
                lost or stolen items. We recommend adding shipping insurance at
                checkout for high-value orders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
