
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FAQPage() {
    return (
        <div className="bg-rawr-white min-h-screen">
            <div className="bg-rawr-black text-white py-20 border-b-2 border-white">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-6xl font-heading font-black uppercase mb-4">
                        Protocol
                    </h1>
                    <p className="text-xl text-gray-400 font-bold max-w-2xl mx-auto">
                        Everything you need to know about joining the hierarchy.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 max-w-3xl">
                <Accordion type="single" collapsible className="w-full space-y-4">
                    <AccordionItem value="item-1" className="border-2 border-rawr-black bg-white px-4">
                        <AccordionTrigger className="font-heading font-bold text-xl uppercase hover:text-rawr-red">
                            When does the next drop go live?
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-gray-600">
                            Drops are announced via the "The Cult" newsletter 24 hours in advance. Once they are live, they are live until sold out. No restocks. Ever.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2" className="border-2 border-rawr-black bg-white px-4">
                        <AccordionTrigger className="font-heading font-bold text-xl uppercase hover:text-rawr-red">
                            How long does shipping take?
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-gray-600">
                            Domestic orders ship within 2-3 business days. International orders can take up to 10 days. You will receive a tracking number via email as soon as your package enters the system.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-2 border-rawr-black bg-white px-4">
                        <AccordionTrigger className="font-heading font-bold text-xl uppercase hover:text-rawr-red">
                            What is your return policy?
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-gray-600">
                            We accept returns for store credit only within 14 days of delivery. Items must be unworn, unwashed, and with original tags attached. Final sale items are not eligible for return.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4" className="border-2 border-rawr-black bg-white px-4">
                        <AccordionTrigger className="font-heading font-bold text-xl uppercase hover:text-rawr-red">
                            How do sizes run?
                        </AccordionTrigger>
                        <AccordionContent className="font-body text-gray-600">
                            Our fits are generally oversized/boxy. If you prefer a standard fit, size down. Check the size guide on each product page for specific measurements.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="mt-12 text-center bg-gray-100 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="font-heading font-bold text-2xl uppercase mb-2">Still confused?</h3>
                    <p className="text-gray-500 mb-6">Reach out to command.</p>
                    <Link href="/contact">
                        <Button className="bg-rawr-black text-white hover:bg-rawr-red uppercase font-bold px-8 h-12">
                            Contact Support
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
