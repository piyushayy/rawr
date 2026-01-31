"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addAddress } from "./actions";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";

export function AddressForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await addAddress(formData);
        setIsLoading(false);

        if (result?.error) {
            toast.error(result.error);
        } else {
            toast.success("Address added successfully");
            setIsOpen(false);
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="w-full h-16 border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-rawr-black hover:text-rawr-black hover:bg-white transition-all gap-2"
            >
                <Plus className="w-5 h-5" />
                ADD NEW ADDRESS
            </Button>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-2 border-rawr-black p-6 bg-white shadow-[4px_4px_0px_0px_#050505]"
        >
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-xl uppercase">New Address</h3>
                <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 p-1 rounded">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="fullName" placeholder="Full Name" required className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />
                    <input name="phone" placeholder="Phone Number" required className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>

                <input name="addressLine1" placeholder="Address Line 1" required className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />
                <input name="addressLine2" placeholder="Address Line 2 (Optional)" className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />

                <div className="grid grid-cols-2 gap-4">
                    <input name="city" placeholder="City" required className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />
                    <input name="state" placeholder="State/Region" required className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </div>

                <input name="postalCode" placeholder="Postal/ZIP Code" required className="p-3 border-2 border-rawr-black w-full focus:outline-none focus:ring-2 focus:ring-gray-200" />

                <div className="flex items-center gap-2 mt-2">
                    <input type="checkbox" name="isDefault" id="isDefault" className="w-4 h-4 rounded border-gray-300 text-rawr-black focus:ring-rawr-black" />
                    <label htmlFor="isDefault" className="text-sm font-bold uppercase cursor-pointer">Set as default shipping address</label>
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-rawr-black text-white hover:bg-gray-800">
                        {isLoading ? "SAVING..." : "SAVE ADDRESS"}
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}
