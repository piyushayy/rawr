import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import DeleteButton from "./DeleteButton";

export default async function AdminLookbookPage() {
    const supabase = await createClient();
    const { data: entries } = await supabase
        .from('lookbook_entries')
        .select(`
            *,
            product:products(title)
        `)
        .order('display_order', { ascending: true });

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-heading font-black uppercase">Lookbook Manager</h1>
                <Link href="/admin/lookbook/new">
                    <Button className="bg-rawr-black text-white hover:bg-gray-800">
                        <Plus className="w-4 h-4 mr-2" /> Add Look
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {entries?.map((entry) => (
                    <div key={entry.id} className="border-2 border-rawr-black bg-white group relative">
                        <div className="relative aspect-[3/4] w-full bg-gray-100">
                            <Image
                                src={entry.image_url}
                                alt={entry.title || 'Look'}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4 border-t-2 border-rawr-black">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="font-bold uppercase truncate">{entry.title || 'Untitled'}</p>
                                    <p className="text-xs text-gray-500">Order: {entry.display_order}</p>
                                </div>
                                <DeleteButton id={entry.id} />
                            </div>
                            {entry.product ? (
                                <div className="bg-gray-100 px-2 py-1 text-xs font-mono truncate">
                                    Link: {entry.product.title}
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 font-mono">No Product Linked</div>
                            )}
                        </div>
                    </div>
                ))}

                {entries?.length === 0 && (
                    <div className="col-span-full text-center py-20 text-gray-500 border-2 border-dashed border-gray-300">
                        No looks in the archive.
                    </div>
                )}
            </div>
        </div>
    );
}
