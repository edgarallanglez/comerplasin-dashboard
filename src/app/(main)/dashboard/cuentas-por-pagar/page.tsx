import { bridgeApi } from "@/lib/api/bridge";
import { CxpStats } from "./_components/cxp-stats";
import { AgingChart } from "./_components/aging-chart";
import { CurrentVsOverdueChart } from "./_components/current-vs-overdue-chart";
import { CxpTable } from "./_components/cxp-table";
import { CxpFilters } from "./_components/cxp-filters";
import { CxpFlowChart } from "./_components/cxp-flow-chart";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CxpPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const proveedor = typeof params.proveedor === 'string' ? params.proveedor : undefined;
    const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
    const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;

    // Default to current year if no date params provided
    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : (!startDate && !endDate ? currentYear : undefined);
    const month = typeof params.month === 'string' ? params.month : undefined;

    let data: import("@/lib/api/bridge").Cxp[] = [];
    let agingData: any[] = [];
    let statusData: any[] = [];
    let monthlyData: any[] = [];

    try {
        // Fetch supplier summary (net balances) with date filters
        data = await bridgeApi.getCxp({ proveedor, year, month, startDate, endDate });

        // Fetch aging buckets aggregation
        agingData = await bridgeApi.getCxp({ groupBy: 'bucket', proveedor, year, month, startDate, endDate });

        // Fetch current vs overdue summary
        statusData = await bridgeApi.getCxp({ groupBy: 'status', proveedor, year, month, startDate, endDate });

        // Fetch monthly flow data for the chart
        monthlyData = await bridgeApi.getCxp({ groupBy: 'monthly', year: year || currentYear, proveedor });
    } catch (error) {
        console.error("Failed to fetch CxP data", error);
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Cuentas por Pagar</h1>
                <CxpFilters />
            </div>

            <CxpStats data={data} />

            {/* <CxpFlowChart data={monthlyData} year={year || currentYear} /> */}

            <div className="grid gap-4 md:grid-cols-2">
                <AgingChart data={agingData} />
                <CurrentVsOverdueChart data={statusData} />
            </div>

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold">Saldos por Proveedor</h2>
                <CxpTable data={data} />
            </div>
        </div>
    );
}
