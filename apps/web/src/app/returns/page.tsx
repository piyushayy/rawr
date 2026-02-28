import { Metadata } from "next";
import { RotateCcw, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Returns Policy | RAWR",
  description: "The fine print.",
};

export default function ReturnsPage() {
  return (
    <div className="bg-rawr-white min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-heading font-black uppercase text-center mb-16 text-rawr-black">
          Returns
        </h1>

        <div className="space-y-8">
          {/* The Philosophy */}
          <div className="bg-rawr-black text-white p-8 border-2 border-rawr-black shadow-[8px_8px_0px_0px_#888888]">
            <h2 className="text-3xl font-bold uppercase mb-4 flex items-center gap-4">
              <RotateCcw className="w-8 h-8 text-rawr-red" /> 30-Day Guarantee
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Thrift stores usually say "All Sales Final". We aren't a thrift
              store. We are an archive.
              <br />
              If you don't love it, you have <strong>30 days</strong> to return
              it for Store Credit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border-2 border-rawr-black p-8">
              <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2 text-green-600">
                <CheckCircle /> What You Can Return
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 font-medium">
                <li>Items in original condition</li>
                <li>Unwashed and unworn</li>
                <li>Original tags attached (if any)</li>
                <li>Within 30 days of delivery</li>
              </ul>
            </div>

            <div className="bg-white border-2 border-rawr-black p-8">
              <h3 className="text-xl font-bold uppercase mb-4 flex items-center gap-2 text-red-600">
                <XCircle /> What You Can't Return
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 font-medium">
                <li>Discounted "Final Sale" items</li>
                <li>Intimates or Swimwear</li>
                <li>Items damaged by you</li>
                <li>Returns after 30 days</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-100 border-2 border-dashed border-gray-400 p-8 text-center">
            <h3 className="text-2xl font-bold uppercase mb-4">How to Return</h3>
            <p className="text-gray-600 mb-6">
              1. Go to your{" "}
              <Link href="/account" className="underline font-bold">
                Account
              </Link>
              .<br />
              2. Select the order and click "Request Return".
              <br />
              3. We'll send you a prepaid label (deducted from refund).
              <br />
              4. Drop it off. Get paid in credit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
