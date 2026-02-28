import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export const ShippingAccordion = () => {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border-t border-b border-rawr-black mt-8"
    >
      <AccordionItem value="item-1" className="border-b border-rawr-gray-200">
        <AccordionTrigger className="font-heading font-black uppercase text-sm hover:text-rawr-red hover:no-underline py-4">
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" /> Shipping & Delivery
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 font-body text-sm leading-relaxed pb-4">
          <p className="font-bold mb-2">Ships within 24 hours.</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Free Global Express Shipping on orders over $150.</li>
            <li>Standard Shipping: 3-5 business days via DHL/FedEx.</li>
            <li>Tracking provided immediately upon dispatch.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2" className="border-b border-rawr-gray-200">
        <AccordionTrigger className="font-heading font-black uppercase text-sm hover:text-rawr-red hover:no-underline py-4">
          <span className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" /> Returns & Refunds
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 font-body text-sm leading-relaxed pb-4">
          <p>Creating a seamless return experience.</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>14-Day Return Window (from delivery date).</li>
            <li>Store Credit immediately issued upon receiving return.</li>
            <li>Items must be unworn with original tags attached.</li>
            <li>Final Sale items are clearly marked.</li>
          </ul>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3" className="border-none">
        <AccordionTrigger className="font-heading font-black uppercase text-sm hover:text-rawr-red hover:no-underline py-4">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Authenticity Guarantee
          </span>
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 font-body text-sm leading-relaxed pb-4">
          <p className="mb-2">
            Every item is rigorously inspected by our team of experts.
          </p>
          <p>
            We guarantee 100% authenticity or your money back. Each purchase
            comes with a digital certificate of authenticity linked to your
            profile.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
