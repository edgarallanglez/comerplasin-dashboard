"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
    saldo: {
        label: "Saldo",
        color: "#f59e0b",
    },
} satisfies ChartConfig;

interface AgingChartProps {
    data: any[];
}

const BUCKET_ORDER = ["NO_VENCIDO", "01-30", "31-60", "61-90", "90+", "SALDO_A_FAVOR"];
const BUCKET_LABELS: Record<string, string> = {
    "NO_VENCIDO": "No Vencido",
    "01-30": "1-30 días",
    "31-60": "31-60 días",
    "61-90": "61-90 días",
    "90+": "90+ días",
    "SALDO_A_FAVOR": "A Favor",
};

export function AgingChart({ data }: AgingChartProps) {
    const chartData = BUCKET_ORDER
        .map(bucket => {
            const item = data.find(d => d.bucket === bucket);
            const saldo = item?.saldo_total || 0;
            return {
                bucket: BUCKET_LABELS[bucket] || bucket,
                saldo: Math.abs(saldo),
                isNegative: saldo < 0,
            };
        })
        .filter(item => item.saldo > 0);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Antigüedad de Saldos</CardTitle>
                <CardDescription>Distribución por días de vencimiento</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="bucket"
                            tickFormatter={(value) => value}
                            angle={-15}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis
                            tickFormatter={(value) => `$${value.toLocaleString("es-MX")}`}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value, name, props) => {
                                        const isNegative = props.payload?.isNegative;
                                        const prefix = isNegative ? "(A favor) " : "";
                                        return `${prefix}$${Number(value).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
                                    }}
                                />
                            }
                        />
                        <Bar
                            dataKey="saldo"
                            fill="var(--color-saldo)"
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
