import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AddressForm } from "./AddressForm";
import { AddressCard } from "./AddressCard";
import { Address } from "@/types";

export default async function AddressesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: addresses, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  if (error) {
    console.error(error);
    return <div>Error loading addresses</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-black uppercase mb-2">
          My Addresses
        </h2>
        <p className="text-gray-600">Manage your shipping destinations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        {addresses?.map((address: Address) => (
          <AddressCard key={address.id} address={address} />
        ))}

        {/* Add New (Always visible at end or start? Let's keep it as a card) */}
        <div className="h-full min-h-[200px]">
          <AddressForm />
        </div>
      </div>
    </div>
  );
}
