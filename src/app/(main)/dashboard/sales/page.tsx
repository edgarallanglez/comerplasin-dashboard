
import { bridgeApi } from "@/lib/api/bridge";
import { SalesChart } from "./_components/sales-chart";
import { SalesStats } from "./_components/sales-stats";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic'; // Force dynamic rendering for searchParams

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

import { DateFilter } from "./_components/date-filter";

// ...

export default async function SalesPage({ searchParams }: PageProps) {
    const params = await searchParams

    // Default to current year if no year param provided
    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : undefined;

    let data: import("@/lib/api/bridge").Sale[] = [];
    try {
        data = await bridgeApi.getSales({ year, month });
    } catch (error) {
        console.error("Failed to fetch sales data", error);
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
                <div className="flex items-center gap-2">
                    <DateFilter />
                </div>
            </div>

            <SalesStats data={data} />
            <SalesChart data={data} />

            {/* List Recent Transactions */}
            <div className="grid gap-4">
                <h2 className="text-xl font-semibold">Transacciones Recientes</h2>
                {/* Reusing a simple table or JSON dump for now */}
                <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-x-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Fecha</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Producto</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Subtotal</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Total (con IVA)</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {data.slice(0, 10).map((sale) => (
                                <tr key={sale.id_movimiento} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">{sale.id_movimiento}</td>
                                    <td className="p-4 align-middle">{new Date(sale.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" })}</td>
                                    <td className="p-4 align-middle">{sale.id_producto}</td>
                                    <td className="p-4 align-middle">${sale.subtotal.toFixed(2)}</td>
                                    <td className="p-4 align-middle">${sale.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
