"use client";

import { ShoppingCart, CreditCard } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const MONTH_NAMES_ES = [
    "", "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

interface MonthlyData {
    mes: number;
    mes_nombre: string;
    compras: number;
    pagos: number;
}

interface CxpFlowChartProps {
    data: MonthlyData[];
    year: string;
}

const chartConfig = {
    compras: {
        label: "Compras",
        color: "var(--chart-1)",
    },
    pagos: {
        label: "Pagos",
        color: "var(--chart-2)",
    },
} as ChartConfig;

export function CxpFlowChart({ data, year }: CxpFlowChartProps) {
    // Transform data for the chart - pagos should be negative
    const chartData = data.map(item => ({
        month: MONTH_NAMES_ES[item.mes] || item.mes_nombre.substring(0, 3),
        compras: item.compras,
        pagos: -item.pagos, // Make negative for the stacked chart
    }));

    const totalCompras = data.reduce((acc, item) => acc + (item.compras || 0), 0);
    const totalPagos = data.reduce((acc, item) => acc + (item.pagos || 0), 0);

    // Calculate max value for Y axis
    const maxValue = Math.max(
        ...chartData.map(d => d.compras),
        ...chartData.map(d => Math.abs(d.pagos))
    );
    const yAxisMax = Math.ceil(maxValue / 1000000) * 1000000;
    const yAxisTicks = [-yAxisMax, -yAxisMax / 2, 0, yAxisMax / 2, yAxisMax];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Flujo de Compras vs Pagos</CardTitle>
                <CardDescription>Compras y pagos a proveedores por mes en {year}</CardDescription>
            </CardHeader>
            <CardContent>
                <Separator />
                <div className="flex items-start justify-between gap-2 py-5 md:items-stretch md:gap-0">
                    <div className="flex flex-1 items-center justify-center gap-2">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chart-1">
                            <ShoppingCart className="size-5 stroke-background" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs uppercase">Compras</p>
                            <p className="font-medium tabular-nums">{formatCurrency(totalCompras, { noDecimals: true })}</p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-auto! self-stretch" />
                    <div className="flex flex-1 items-center justify-center gap-2">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-chart-2">
                            <CreditCard className="size-5 stroke-background" />
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs uppercase">Pagos</p>
                            <p className="font-medium tabular-nums">{formatCurrency(totalPagos, { noDecimals: true })}</p>
                        </div>
                    </div>
                </div>
                <Separator />
                <ChartContainer className="max-h-72 w-full mt-4" config={chartConfig}>
                    <BarChart
                        stackOffset="sign"
                        margin={{ left: -15, right: 0, top: 25, bottom: 0 }}
                        accessibilityLayer
                        data={chartData}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => {
                                const abs = Math.abs(value);
                                let formatted: string;
                                if (abs >= 1000000) {
                                    formatted = `${(abs / 1000000).toFixed(1)}M`;
                                } else if (abs >= 1000) {
                                    formatted = `${(abs / 1000).toFixed(0)}k`;
                                } else {
                                    formatted = `${abs}`;
                                }
                                return value < 0 ? `-${formatted}` : formatted;
                            }}
                            ticks={yAxisTicks}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(value, name) => {
                                        const absValue = Math.abs(Number(value));
                                        return [formatCurrency(absValue), name === 'pagos' ? 'Pagos' : 'Compras'];
                                    }}
                                />
                            }
                        />
                        <ReferenceLine y={0} stroke="var(--border)" />
                        <Bar dataKey="compras" stackId="a" fill={chartConfig.compras.color} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="pagos" stackId="a" fill={chartConfig.pagos.color} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
