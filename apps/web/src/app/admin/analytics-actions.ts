'use server'

import { createClient } from '@/utils/supabase/server'
import { checkAdmin } from '@/utils/admin'

export interface AnalyticsData {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    recentSales: { date: string, amount: number }[];
    topProducts: { name: string, sales: number }[];
    customerTiers: { name: string, value: number, fill: string }[];
}

export async function getAnalyticsData() {
    await checkAdmin();
    const supabase = await createClient();

    // 1. Total Stats
    const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, status')
        .neq('status', 'cancelled');

    const totalRevenue = orders?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
    const totalOrders = orders?.length || 0;

    // 2. Customers Count
    const { count: totalCustomers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

    // 3. Sales Over Time (Last 30 Days) - Simplified for demo
    // Ideally use a database function for aggregation, but JS reduce is fine for small datasets
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentOrders = orders?.filter(o => new Date(o.created_at) > last30Days) || [];

    // Group by Date (DD/MM)
    const salesMap = new Map<string, number>();
    recentOrders.forEach(o => {
        const date = new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        salesMap.set(date, (salesMap.get(date) || 0) + o.total_amount);
    });

    // Fill in last 7 days at least
    const recentSales = Array.from(salesMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .slice(-7); // Just last 7 entries for the chart

    // 4. Top Products (Mock or Real join)
    // Real join is expensive without a view. Let's fetch order_items.
    const { data: items } = await supabase
        .from('order_items')
        .select('product_id'); // We'd need product names too

    // For speed, let's just return mock "Top Products" or fetch simplified
    // A real implementation would allow complex aggregations.
    // Let's attempt a join.
    const { data: productSales } = await supabase
        .from('order_items')
        .select(`
            product_id,
            products (title)
        `);

    const productCount: Record<string, number> = {};
    productSales?.forEach((item: any) => {
        const name = item.products?.title || 'Unknown';
        productCount[name] = (productCount[name] || 0) + 1;
    });

    const topProducts = Object.entries(productCount)
        .map(([name, sales]) => ({ name, sales }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

    // 5. Customer Tiers (Initiate vs Member vs Elite)
    // We can count users based on clout_score
    // Unranked: < 100, Initiate: 100-500, Member: 500-2000, Elite: > 2000
    // Fetch all clout scores (efficient enough for < 10k users)
    const { data: profiles } = await supabase.from('profiles').select('clout_score');

    const tiers = {
        unranked: 0,
        initiate: 0,
        member: 0,
        elite: 0
    };

    profiles?.forEach(p => {
        const score = p.clout_score || 0;
        if (score > 2000) tiers.elite++;
        else if (score > 500) tiers.member++;
        else if (score > 100) tiers.initiate++;
        else tiers.unranked++;
    });

    const customerTiers = [
        { name: 'Unranked', value: tiers.unranked, fill: '#9ca3af' }, // Gray
        { name: 'Initiate', value: tiers.initiate, fill: '#000000' }, // Black
        { name: 'Member', value: tiers.member, fill: '#dc2626' },    // Red
        { name: 'Elite', value: tiers.elite, fill: '#fbbf24' },      // Gold
    ];

    return {
        totalRevenue,
        totalOrders,
        totalCustomers: totalCustomers || 0,
        recentSales,
        topProducts,
        customerTiers
    };
}
