const { createClient } = require("@supabase/supabase-js");
const url = "https://nmujdicnzflgrawaoreo.supabase.co";
const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdWpkaWNuemZsZ3Jhd2FvcmVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM2MTI2NiwiZXhwIjoyMDg0OTM3MjY2fQ.a6RGEcFIDKIyKQKktVmdfeYB-VhwrW2VfM-ievIMKX0";
const supabase = createClient(url, key);

async function main() {
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
    if (bucketsErr) console.error(bucketsErr);
    else console.log("Buckets:", buckets.map(b => b.name));

    const { data: files } = await supabase.storage.from("products").list();
    console.log("Files in products bucket root:", files);

    if (files) {
        for (const f of files) {
            if (!f.id) { // It's a folder
                const { data: subFiles } = await supabase.storage.from("products").list(f.name);
                console.log(`Folder ${f.name} contains:`, subFiles);
                // Delete all files in folder
                if (subFiles && subFiles.length > 0) {
                    await supabase.storage.from("products").remove(subFiles.map(sf => `${f.name}/${sf.name}`));
                }
            }
        }
    }

    // Also query articles, maybe articles are "garbage" values?
    const { data: articles } = await supabase.from("articles").select("id");
    console.log("Articles:", articles?.length);
    if (articles && articles.length > 0) {
        await supabase.from("articles").delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

}

main();
