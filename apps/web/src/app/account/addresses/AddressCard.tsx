"use client";

import { Address } from "@/types";
import { Button } from "@/components/ui/button";
import { deleteAddress, setDefaultAddress } from "./actions";
import { toast } from "sonner";
import { Trash2, Home } from "lucide-react";
import { useState } from "react";

interface AddressCardProps {
    address: Address;
}

export function AddressCard({ address }: AddressCardProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        setIsLoading(true);
        const result = await deleteAddress(address.id);
        setIsLoading(false);
        if (result?.error) toast.error(result.error);
        else toast.success("Address deleted");
    };

    const handleSetDefault = async () => {
        setIsLoading(true);
        const result = await setDefaultAddress(address.id);
        setIsLoading(false);
        if (result?.error) toast.error(result.error);
        else toast.success("Default address updated");
    };

    return (
        <div className={`p-6 border-2 ${address.is_default ? 'border-rawr-red bg-red-50' : 'border-rawr-black bg-white'} relative`}>
            {address.is_default && (
                <span className="absolute -top-3 left-4 bg-rawr-red text-white px-2 py-1 text-xs font-bold uppercase">
                    Default Shipping
                </span>
            )}

            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className="font-bold uppercase text-lg">{address.full_name}</h4>
                    <p className="font-body text-gray-600">{address.phone}</p>
                </div>
                {address.is_default && <Home className="w-5 h-5 text-rawr-red" />}
            </div>

            <div className="space-y-1 text-sm font-medium mb-6">
                <p>{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>{address.city}, {address.state} {address.postal_code}</p>
                <p>{address.country}</p>
            </div>

            <div className="flex gap-2">
                {!address.is_default && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSetDefault}
                        disabled={isLoading}
                        className="flex-1 bg-white hover:bg-gray-100"
                    >
                        Set Default
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
