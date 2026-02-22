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

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Metas de Venta</h1>
                <div className="flex items-center gap-2">
                    <DateFilter hideDays />
                </div>
            </div>

            <div className="min-w-0">
                <MetasTable data={data} year={parseInt(year)} month={parseInt(month)} />
            </div>
        </div>
    );
}
