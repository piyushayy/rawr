import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./ProfileForm";
import { redirect } from "next/navigation";

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
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-heading font-black uppercase mb-2">Account Settings</h2>
                <p className="text-gray-600">Manage your profile and preferences.</p>
            </div>

            <div className="bg-white border-2 border-rawr-black p-6">
                <h3 className="text-xl font-bold uppercase mb-6 border-b pb-2">Profile Information</h3>
                <ProfileForm user={user} profile={profile} />
            </div>

            <div className="bg-red-50 border-2 border-red-200 p-6 opacity-50 cursor-not-allowed">
                <h3 className="text-xl font-bold uppercase mb-2 text-red-800">Danger Zone</h3>
                <p className="text-sm text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button disabled className="bg-red-600 text-white px-4 py-2 font-bold uppercase text-sm rounded cursor-not-allowed">
                    Delete Account
                </button>
            </div>
        </div>
    );
}
