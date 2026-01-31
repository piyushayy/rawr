-- Insert seed data for products
insert into public.products (id, title, price, description, size, condition, images, details, measurements, sold_out, category, drop_date)
values
  (
    '1',
    'ACID WASH OVERSIZED TEE',
    45,
    'Heavyweight cotton jersey. Hand-treated acid wash finish. Boxy fit. Dropped shoulders. Each piece is unique due to the treatment process. This is not a shirt; it''s a statement of decay.',
    'XL',
    '10/10 (Deadstock)',
    ARRAY['https://placehold.co/600x800/111/FFF?text=ACID+FRONT', 'https://placehold.co/600x800/222/FFF?text=ACID+BACK'],
    ARRAY['100% Cotton', 'Weight: 280 GSM', 'Made in Los Angeles'],
    '{"chest": "26\"", "length": "30\"", "sleeve": "9.5\""}',
    false,
    'tops',
    '2026-02-01'
  ),
  (
    '2',
    'DISTRESSED DENIM JACKET',
    120,
    'Vintage Levis type III trucker jacket, heavily distressed and oil-stained manually. Patched with deadstock canvas. This jacket has lived a life before you.',
    'L',
    '7/10 (Vintage Distressed)',
    ARRAY['https://placehold.co/600x800/222/FFF?text=DENIM+FRONT', 'https://placehold.co/600x800/333/FFF?text=DENIM+BACK'],
    ARRAY['100% Cotton Denim', 'Vintage 1990s', 'Custom Distressing'],
    '{"chest": "24\"", "length": "26\"", "sleeve": "25\""}',
    false,
    'outerwear',
    '2026-02-01'
  ),
  (
    '3',
    'LEATHER BIKER PANTS',
    85,
    'Genuine leather pants with padded knees. High waist, taper fit. These require commitment to wear. Not for the faint of heart.',
    '32',
    '8/10 (Minor Scuffs)',
    ARRAY['https://placehold.co/600x800/333/FFF?text=LEATHER+FRONT', 'https://placehold.co/600x800/444/FFF?text=LEATHER+BACK'],
    ARRAY['Genuine Cowhide', 'YKK Zippers', 'Polyester Lining'],
    '{"chest": "N/A", "length": "42\"", "waist": "32\"", "inseam": "32\""}',
    true,
    'bottoms',
    '2026-01-15'
  ),
  (
    '4',
    'GRUNGE KNIT SWEATER',
    65,
    'Mohair blend striped sweater. Loose gauge knit. Intentionally snagged details. Looks like you slept in it under a bridge in Seattle, 1993.',
    'L',
    '9/10',
    ARRAY['https://placehold.co/600x800/444/FFF?text=KNIT+FRONT', 'https://placehold.co/600x800/555/FFF?text=KNIT+DETAIL'],
    ARRAY['30% Mohair, 70% Acrylic', 'Relaxed Fit', 'Elongated Sleeves'],
    '{"chest": "25\"", "length": "29\"", "sleeve": "26\""}',
    false,
    'tops',
    '2026-02-01'
  ),
  (
    '5',
    'COMBAT BOOTS',
    150,
    'Austrian military surplus paratrooper boots. Steel toe. Full grain leather. Built to stomp.',
    'US 10',
    '8/10 (Broken In)',
    ARRAY['https://placehold.co/600x800/555/FFF?text=BOOTS', 'https://placehold.co/600x800/666/FFF?text=SOLE'],
    ARRAY['Full Grain Leather', 'Vibram Sole', 'Speed Hooks'],
    '{"chest": "N/A", "length": "N/A"}',
    false,
    'accessories',
    '2026-02-01'
  );
