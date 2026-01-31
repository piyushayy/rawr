import { createClient } from "@/utils/supabase/server";
import LookbookForm from "./LookbookForm";

export default async function NewLookbookPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from('products').select('id, title').order('title');

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-4xl font-heading font-black uppercase mb-8">Add to Archive</h1>
            <LookbookForm products={products || []} />
        </div>
    );
}
