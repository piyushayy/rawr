import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, MapPin, Package } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function AccountLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?message=Please login to access account");
    }

    return (
        <div className="min-h-screen bg-rawr-white">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 shrink-0 space-y-2">
                        <div className="p-4 border-2 border-rawr-black bg-white mb-6">
                            <p className="font-bold uppercase text-xs text-gray-500">Logged in as</p>
                            <p className="font-bold truncate" title={user.email}>{user.email}</p>
                        </div>

                        <Link href="/orders" className="block">
                            <Button variant="outline" className="w-full justify-start gap-3 h-12 border-2 border-rawr-black hover:bg-rawr-black hover:text-white transition-all text-left">
                                <Package className="w-4 h-4" />
                                Orders
                            </Button>
                        </Link>

                        <Link href="/account/addresses" className="block">
                            <Button variant="outline" className="w-full justify-start gap-3 h-12 border-2 border-rawr-black hover:bg-rawr-black hover:text-white transition-all text-left">
                                <MapPin className="w-4 h-4" />
                                Addresses
                            </Button>
                        </Link>

                        <Link href="/account/settings" className="block">
                            <Button variant="outline" className="w-full justify-start gap-3 h-12 border-2 border-rawr-black hover:bg-rawr-black hover:text-white transition-all text-left">
                                <User className="w-4 h-4" />
                                Settings
                            </Button>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
