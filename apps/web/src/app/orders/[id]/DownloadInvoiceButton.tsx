"use client";

import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/helpers/billing";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DownloadInvoiceButton({ order }: { order: any }) {
    return (
        <div className="bg-white border-2 border-rawr-black p-8 flex justify-between items-center">
            <div>
                <h3 className="font-bold uppercase text-xl">Need an invoice?</h3>
                <p className="text-gray-500">Download a PDF copy of your receipt.</p>
            </div>
            <Button
                variant="outline"
                onClick={() => generateInvoice(order)}
            >
                Download PDF
            </Button>
        </div>
    );
}
