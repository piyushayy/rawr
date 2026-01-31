import { checkAdmin } from "@/utils/admin";
import { Button } from "@/components/ui/button";

export default async function AdminSettingsPage() {
    await checkAdmin();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-heading font-black uppercase">Store Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Store Config */}
                <div className="bg-white border text-left border-gray-200 p-6 rounded-lg space-y-4">
                    <h3 className="font-bold uppercase text-lg border-b pb-2">General Configuration</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Store Name</label>
                        <input defaultValue="RAWR STORE" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Support Email</label>
                        <input defaultValue="help@rawr.store" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <Button>Save General</Button>
                </div>

                {/* Shipping */}
                <div className="bg-white border text-left border-gray-200 p-6 rounded-lg space-y-4">
                    <h3 className="font-bold uppercase text-lg border-b pb-2">Shipping Logic</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Free Shipping Threshold ($)</label>
                        <input type="number" defaultValue="150" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold uppercase">Standard Rate ($)</label>
                        <input type="number" defaultValue="15" className="w-full p-2 border border-gray-300 rounded" />
                    </div>
                    <Button>Save Shipping</Button>
                </div>

                {/* Taxes (Mock) */}
                <div className="bg-white border text-left border-gray-200 p-6 rounded-lg space-y-4">
                    <h3 className="font-bold uppercase text-lg border-b pb-2">Tax Settings</h3>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" className="w-5 h-5" defaultChecked />
                        <label className="text-sm font-bold uppercase">Enable Automatic Tax Calculation</label>
                    </div>
                    <p className="text-xs text-gray-500">Uses Stripe Tax (Mocked)</p>
                </div>

                {/* Maintenance Mode */}
                <div className="bg-red-50 border border-red-200 p-6 rounded-lg space-y-4">
                    <h3 className="font-bold uppercase text-lg border-b border-red-200 pb-2 text-red-800">Danger Zone</h3>
                    <Button variant="destructive" className="w-full">Enable Maintenance Mode</Button>
                    <p className="text-xs text-red-600">This will hide the shop from public view.</p>
                </div>
            </div>
        </div>
    );
}
