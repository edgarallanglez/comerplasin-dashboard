"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    total: {
        label: "Total Compras",
        color: "#10b981",
    },
} satisfies ChartConfig;

interface TopProductsChartProps {
    data: any[];
}

export function TopProductsChart({ data }: TopProductsChartProps) {
    const chartData = data.map(item => ({
        producto: item.CNOMBREPRODUCTO,
        total: item.total_compras,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 Productos</CardTitle>
                <CardDescription>Por monto total de compras</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            tickFormatter={(value) => `$${value.toLocaleString("es-MX")}`}
                        />
                        <YAxis
                            type="category"
                            dataKey="producto"
                            width={150}
                            tickFormatter={(value) => value.length > 20 ? value.substring(0, 20) + '...' : value}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value) => `$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
                                />
                            }
                        />
                        <Bar dataKey="total" fill="var(--color-total)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
