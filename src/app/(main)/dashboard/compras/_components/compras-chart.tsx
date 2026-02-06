"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { Compra } from "@/lib/api/bridge";

const chartConfig = {
    compras: {
        label: "Compras",
        color: "#a1a1aa",
    },
} satisfies ChartConfig;

interface ComprasChartProps {
    data: Compra[];
}

export function ComprasChart({ data }: ComprasChartProps) {
    const chartData = React.useMemo(() => {
        const agg: Record<string, number> = {};
        data.forEach((compra) => {
            const date = compra.CFECHA.split('T')[0];
            agg[date] = (agg[date] || 0) + compra.total;
        });
        return Object.entries(agg)
            .map(([date, total]) => ({ date, total }))
            .sort((a, b) => a.date.localeCompare(b.date));
    }, [data]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Compras</CardTitle>
                <CardDescription>Compras diarias</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fillCompras" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-compras)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-compras)" stopOpacity={0.1} />
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
                            fill="url(#fillCompras)"
                            stroke="var(--color-compras)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
