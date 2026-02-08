
"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export function OverviewGraph({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return <div className="h-[350px] flex items-center justify-center text-gray-400 font-mono text-xs">NO DATA AVAILABLE</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                    contentStyle={{ background: '#050505', border: 'none', color: '#fff' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', textTransform: 'uppercase' }}
                />
                <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={{ fill: "#dc2626", r: 4 }}
                    activeDot={{ r: 6, fill: "#fff" }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}
