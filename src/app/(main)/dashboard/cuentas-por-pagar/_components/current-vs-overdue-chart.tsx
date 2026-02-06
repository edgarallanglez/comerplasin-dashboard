"use client";

import { Pie, PieChart, Cell, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    corriente: {
        label: "Al Corriente",
        color: "#10b981",
    },
    vencido: {
        label: "Vencido",
        color: "#ef4444",
    },
    saldo_a_favor: {
        label: "A Favor",
        color: "#3b82f6",
    },
} satisfies ChartConfig;

interface CurrentVsOverdueChartProps {
    data: any[];
}

export function CurrentVsOverdueChart({ data }: CurrentVsOverdueChartProps) {
    const chartData = data
        .filter(item => item.saldo_total !== 0)
        .map(item => {
            let name = 'Otro';
            let fill = '#6b7280';

            if (item.estado === 'corriente') {
                name = 'Al Corriente';
                fill = 'var(--color-corriente)';
            } else if (item.estado === 'vencido') {
                name = 'Vencido';
                fill = 'var(--color-vencido)';
            } else if (item.estado === 'saldo_a_favor') {
                name = 'A Favor';
                fill = 'var(--color-saldo_a_favor)';
            }

            return {
                name,
                value: Math.abs(item.saldo_total),
                fill,
                isNegative: item.saldo_total < 0,
            };
        });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Estado de Cuentas</CardTitle>
                <CardDescription>Al corriente vs vencido</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={(entry) => {
                                const prefix = entry.isNegative ? '-' : '';
                                return `${prefix}$${entry.value.toLocaleString("es-MX")}`;
                            }}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name, props) => {
                                        const prefix = props.payload?.isNegative ? '-' : '';
                                        return `${prefix}$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
                                    }}
                                />
                            }
                        />
                        <Legend />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
