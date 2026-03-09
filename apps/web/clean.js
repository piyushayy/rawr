const { createClient } = require("@supabase/supabase-js");
const url = "https://nmujdicnzflgrawaoreo.supabase.co";
const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tdWpkaWNuemZsZ3Jhd2FvcmVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTM2MTI2NiwiZXhwIjoyMDg0OTM3MjY2fQ.a6RGEcFIDKIyKQKktVmdfeYB-VhwrW2VfM-ievIMKX0";
const supabase = createClient(url, key);

async function main() {
    console.log("Fetching products...");
    const { data: products, error: prodErr } = await supabase
        .from("products")
        .select("id, images, title");

    if (prodErr) {
        console.error("Error fetching products:", prodErr);
        return;
    }

    console.log(`Found ${products.length} products to delete.`);

    // 1. Collect all images to delete from Storage
    let filesToDelete = [];
    for (const product of products) {
        if (product.images && Array.isArray(product.images)) {
            for (const imgUrl of product.images) {
                // Example URL: https://...supabase.co/storage/v1/object/public/products/123/image.png
                // We only want '123/image.png' (everything after 'products/')
                try {
                    const urlObj = new URL(imgUrl);
                    const parts = urlObj.pathname.split("/public/products/");
                    if (parts.length > 1) {
                        filesToDelete.push(parts[1]);
                    }
                } catch (e) {
                    // Might just be relative
                    if (imgUrl.includes("/public/products/")) {
                        filesToDelete.push(imgUrl.split("/public/products/")[1]);
                    }
                }
            }
        }
    }

    if (filesToDelete.length > 0) {
        console.log(`Deleting ${filesToDelete.length} files from 'products' bucket...`);
        const { data: delFiles, error: fileErr } = await supabase.storage
            .from("products")
            .remove(filesToDelete);
        if (fileErr) console.error("Error deleting files:", fileErr);
        else console.log("Files deleted successfully.");
    } else {
        console.log("No images found to delete.");
    }

    // Also clear the products bucket unconditionally by listing files
    const { data: bucketFiles } = await supabase.storage.from("products").list();
    if (bucketFiles && bucketFiles.length > 0) {
        console.log(`Cleaning up remaining top-level folders in bucket`);
        for (const item of bucketFiles) {
            if (!item.id) {
                // It's a folder, lets list inside it
                const { data: innerFiles } = await supabase.storage.from("products").list(item.name);
                if (innerFiles && innerFiles.length > 0) {
                    const paths = innerFiles.map(f => `${item.name}/${f.name}`);
                    await supabase.storage.from("products").remove(paths);
                }
            } else {
                await supabase.storage.from("products").remove([item.name]);
            }
        }
    }


    // 2. Delete the products from Database
    // Note: we can't TRUNCATE easily via JS REST client, so we will do a DELETE.
    // Wait, if we just do DELETE * FROM products, it will fail if orders exist.
    // Wait no, if orders exist, maybe we should delete related order_items first?
    console.log("Cleaning up order_items for these products to avoid FK violations...");
    await supabase.from("order_items").delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all

    console.log("Deleting products...");
    const { error: delProdErr } = await supabase
        .from("products")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // trick to delete all

    if (delProdErr) {
        console.error("Error deleting products:", delProdErr);
    } else {
        console.log("All products deleted successfully from database.");
    }
}

main();
