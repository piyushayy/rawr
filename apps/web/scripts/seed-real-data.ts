
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REAL_PRODUCTS = [
    // --- TOPS ---
    {
        title: "HEAVYWEIGHT PUFFER JACKET",
        price: 220,
        description: "Oversized, insulated warmth for the concrete jungle. Features a matte black finish, high funnel neck, and hidden interior pockets. Water-resistant nylon shell.",
        size: "L",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["100% Nylon Shell", "700 Fill Power", "YKK Zippers", "Cropped Fit"],
        measurements: { chest: "52", length: "26", sleeve: "25" },
        category: "outerwear",
        sold_out: false
    },
    {
        title: "ACID WASH VINTAGE TEE",
        price: 45,
        description: "Heavyweight cotton jersey with a unique acid wash treatment. Each piece is individually dyed for a 1-of-1 look. Boxy fit with dropped shoulders.",
        size: "M",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["280GSM Cotton", "Vintage Wash", "Puff Print Logo"],
        measurements: { chest: "48", length: "29" },
        category: "tops",
        sold_out: false
    },
    {
        title: "DISTRESSED FLANNEL SHIRT",
        price: 85,
        description: "Grunge aesthetic reimagined. Heavy brushed flannel with hand-distressed hems and bleach splatter details. Layer it or wear it solo.",
        size: "XL",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["100% Cotton", "Raw Hem", "Oversized Pocket"],
        measurements: { chest: "50", length: "31" },
        category: "tops",
        sold_out: false
    },
    {
        title: "ESSENTIAL HOODIE // NOIR",
        price: 110,
        description: "The daily driver. Double-lined hood, kangaroo pocket without the bulge. Premium french terry fleece that gets softer with every wash.",
        size: "L",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["400GSM French Terry", "Pre-shrunk", "Ribbed Cuffs"],
        measurements: { chest: "54", length: "28" },
        category: "tops",
        sold_out: false
    },

    // --- BOTTOMS ---
    {
        title: "CARGO PARACHUTE PANTS",
        price: 140,
        description: "Technical nylon trousers with exaggerated volume. Adjustable toggles at waist and ankles allow for a customized silhouette. Six functional pockets.",
        size: "32",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=1000",
            "https://images.unsplash.com/photo-1517445312882-5667b93c21b5?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["Nylon bleny", "Toggle Hem", "Water Repellent"],
        measurements: { waist: "32", inseam: "30" },
        category: "bottoms",
        sold_out: false
    },
    {
        title: "RAW DENIM JEANS // INDIGO",
        price: 180,
        description: "14oz Japanese selvedge denim. Unwashed, stiff, and ready to break in according to your lifestyle. Classic straight leg cut.",
        size: "34",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["14oz Selvedge", "Button Fly", "Leather Patch"],
        measurements: { waist: "34", inseam: "32" },
        category: "bottoms",
        sold_out: false
    },
    {
        title: "UTILITY SHORTS",
        price: 75,
        description: "Summer functionality. Ripstop cotton shorts with cargo pockets and integrated belt. Knee-length relaxed fit.",
        size: "M",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["Cotton Ripstop", "Magnetic Buckle", "Reinforced Seams"],
        measurements: { waist: "30-32", inseam: "9" },
        category: "bottoms",
        sold_out: false
    },

    // --- ACCESSORIES ---
    {
        title: "SILVER CHAIN NECKLACE",
        price: 95,
        description: "Sterling silver cuban link chain. Oxidation treated for a vintage, lived-in look. Heavy duty clap.",
        size: "OS",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["925 Sterling Silver", "50cm Length", "Made in Italy"],
        measurements: {},
        category: "accessories",
        sold_out: false
    },
    {
        title: "STRUCTURED TOTE BAG",
        price: 130,
        description: "Heavy canvas tote with leather handles. Large enough for a laptop and daily essentials. Printed branding on side.",
        size: "OS",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1597484662317-9bd7bdda2907?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["Heavy Cotton Canvas", "Internal Zip Pocket", "Reinforced Base"],
        measurements: {},
        category: "accessories",
        sold_out: false
    },
    {
        title: "BEANIE // CONCRETE",
        price: 40,
        description: "Ribbed knit beanie in a heather grey colorway. Short fisherman fit.",
        size: "OS",
        condition: "New",
        images: [
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&q=80&w=1000"
        ],
        details: ["Wool Blend", "Woven Label"],
        measurements: {},
        category: "accessories",
        sold_out: false
    }
];

async function seed() {
    console.log('🌱 Seeding Real World Data...');

    for (const product of REAL_PRODUCTS) {
        const { error } = await supabase
            .from('products')
            .insert(product);

        if (error) {
            console.error(`❌ Failed to insert ${product.title}:`, error.message);
        } else {
            console.log(`✅ Added ${product.title}`);
        }
    }

    console.log('🚀 Seeding complete.');
}

seed();
