import { bridgeApi } from "@/lib/api/bridge";
import { MetasTable } from "./_components/metas-table";
import { DateFilter } from "../cobranza/_components/date-filter";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function MetasPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString();

    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : currentMonth;

    let data: import("@/lib/api/bridge").Meta[] = [];

    try {
        data = await bridgeApi.getMetas(year, month);
    } catch (error) {
        console.error("Failed to fetch metas data", error);
    }

    let dateLabel = "";
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const monthName = date.toLocaleString('es-MX', { month: 'long' });
    dateLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

    return (
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Metas de Venta</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <DateFilter hideDays />
                </div>
            </div>

            <div className="min-w-0 space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                    Cumplimiento de Metas
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {dateLabel} • Todos los agentes
                    </span>
                </h2>
                <MetasTable data={data} year={parseInt(year)} month={parseInt(month)} />
            </div>
        </div>
    );
}
