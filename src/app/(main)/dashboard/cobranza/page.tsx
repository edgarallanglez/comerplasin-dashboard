import { bridgeApi } from "@/lib/api/bridge";
import { CobranzaChart } from "./_components/cobranza-chart";
import { CobranzaStats } from "./_components/cobranza-stats";
import { CobranzaTable } from "./_components/cobranza-table";
import { DateFilter } from "./_components/date-filter";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CobranzaPage({ searchParams }: PageProps) {
    const params = await searchParams

    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : undefined;

    let data: import("@/lib/api/bridge").Cobranza[] = [];
    try {
        data = await bridgeApi.getCobranza({ year, month });
    } catch (error) {
        console.error("Failed to fetch cobranza data", error);
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Cobranza</h1>
                <div className="flex items-center gap-2">
                    <DateFilter />
                </div>
            </div>

            <CobranzaStats data={data} />
            <CobranzaChart data={data} />

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold">Cuentas por Cobrar</h2>
                <CobranzaTable data={data} />
            </div>
        </div>
    );
}
