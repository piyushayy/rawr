'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";
import { AnalyticsData } from './analytics-actions';

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-rawr-black text-white p-2 border border-white text-xs font-mono uppercase">
                <p>{`${label || payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

export default function AdminDashboard({ data }: { data: AnalyticsData }) {
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-2 border-rawr-black shadow-[4px_4px_0px_0px_#000]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-rawr-red" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-black">${data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground font-mono">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-2 border-rawr-black shadow-[4px_4px_0px_0px_#000]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-black">{data.totalOrders}</div>
                        <p className="text-xs text-muted-foreground font-mono">+180 since launch</p>
                    </CardContent>
                </Card>
                <Card className="border-2 border-rawr-black shadow-[4px_4px_0px_0px_#000]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Customers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-black">{data.totalCustomers}</div>
                        <p className="text-xs text-muted-foreground font-mono">Growing the pack</p>
                    </CardContent>
                </Card>
                <Card className="border-2 border-rawr-black shadow-[4px_4px_0px_0px_#000]">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest">Conversion</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-heading font-black">3.2%</div>
                        <p className="text-xs text-muted-foreground font-mono">Industry avg: 1.5%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">

                {/* Revenue Chart */}
                <Card className="col-span-1 lg:col-span-4 border-2 border-rawr-black">
                    <CardHeader>
                        <CardTitle className="font-heading font-black uppercase">Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.recentSales}>
                                    <XAxis
                                        dataKey="date"
                                        stroke="#000"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#000"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="amount" fill="#050505" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="col-span-1 lg:col-span-3 border-2 border-rawr-black">
                    <CardHeader>
                        <CardTitle className="font-heading font-black uppercase">Top Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.topProducts.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-2 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-0">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded bg-rawr-black text-white flex items-center justify-center font-bold text-sm mr-3">
                                            {i + 1}
                                        </div>
                                        <div className="font-bold uppercase text-sm">{p.name}</div>
                                    </div>
                                    <div className="font-mono text-sm text-gray-500">{p.sales} sold</div>
                                </div>
                            ))}
                            {data.topProducts.length === 0 && (
                                <p className="text-gray-500 text-sm">No sales data yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Cohorts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-rawr-black">
                    <CardHeader>
                        <CardTitle className="font-heading font-black uppercase">Loyalty Cohorts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.customerTiers}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.customerTiers?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
