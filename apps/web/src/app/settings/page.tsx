import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./SettingsForm";
import { DeleteAccount } from "./DeleteAccount";

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
                <h1 className="text-4xl md:text-6xl font-black uppercase mb-8 tracking-tight">
                    Account Settings
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Profile Section */}
                        <section>
                            <h2 className="text-xl font-bold uppercase mb-6 pb-2 border-b border-gray-100">
                                Personal Information
                            </h2>
                            <SettingsForm initialData={profile} />
                        </section>

                        {/* Danger Zone */}
                        <section>
                            <h2 className="text-xl font-bold uppercase text-red-600 mb-6 pb-2 border-b border-red-100">
                                Danger Zone
                            </h2>
                            <DeleteAccount />
                        </section>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            <h3 className="font-bold uppercase mb-2">Your Privacy</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">
                                At RAWR, we value your privacy. You have full control over your data.
                                Updating your profile here changes it across the entire platform immediately.
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                If you choose to delete your account, your personal data will be wiped.
                                Past orders will be anonymized for our accounting records.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
