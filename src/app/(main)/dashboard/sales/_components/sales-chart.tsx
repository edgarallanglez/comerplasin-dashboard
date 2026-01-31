"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Sale } from "@/lib/api/bridge";

const chartConfig = {
    sales: {
        label: "Ventas",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

interface SalesChartProps {
    data: Sale[];
    title?: string;
    description?: string;
}

export function SalesChart({ data, title = "Ventas", description = "Ventas diarias" }: SalesChartProps) {
    // Aggregate data by date
    const chartData = React.useMemo(() => {
        const agg: Record<string, number> = {};
        data.forEach((sale) => {
            const date = sale.fecha.split('T')[0];
            agg[date] = (agg[date] || 0) + sale.total;
        });
        return Object.entries(agg)
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-sales)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-sales)" stopOpacity={0.1} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return date.toLocaleDateString("es-MX", {
                                    month: "short",
                                    day: "numeric",
                                    timeZone: "UTC",
                                });
                            }}
                        />
                        <YAxis
                            tickFormatter={(value) => 
                              `$${value.toLocaleString("es-MX")}`
                            }
                            axisLine={false}
                            tickLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("es-MX", {
                                            weekday: "short",
                                            month: "short",
                                            day: "numeric",
                                            timeZone: "UTC",
                                        });
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="total"
                            type="monotone"
                            fill="url(#fillSales)"
                            stroke="var(--color-sales)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
