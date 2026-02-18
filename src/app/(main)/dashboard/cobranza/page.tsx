import { bridgeApi } from "@/lib/api/bridge";
import { CobranzaChart } from "./_components/cobranza-chart";
import { CobranzaStats } from "./_components/cobranza-stats";
import { CobranzaTable } from "./_components/cobranza-table";
import { DateFilter } from "./_components/date-filter";
import { ClientFilter } from "../sales/_components/client-filter";
import { CobranzaClientTable } from "./_components/cobranza-client-table";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CobranzaPage({ searchParams }: PageProps) {
    const params = await searchParams

    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : undefined;
    const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
    const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;
    const cliente = typeof params.cliente === 'string' ? params.cliente : undefined;

    let data: import("@/lib/api/bridge").Cobranza[] = [];
    let clients: { id: number; nombre: string }[] = [];

    try {
        const [cobranzaData, clientsData] = await Promise.all([
            bridgeApi.getCobranza({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                cliente
            }),
            bridgeApi.getClientes(undefined, 1) // 1 = Clients
        ]);

        data = cobranzaData;
        clients = clientsData;
    } catch (error) {
        console.error("Failed to fetch data", error);
    }

    // --- Processing Data for Views ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // 1. Expired: Due date <= Today
    const expiredData = data.filter(item => {
        if (!item.fecha_vencimiento) return false;
        const vDate = new Date(item.fecha_vencimiento);
        // Treat as local date (assuming API returns UTC midnight for dates)
        const vDateLocal = new Date(vDate.getUTCFullYear(), vDate.getUTCMonth(), vDate.getUTCDate());

        return vDateLocal <= today;
    });

    // 2. Expiring Soon: Today < Due date <= Next Week
    const expiringSoonData = data.filter(item => {
        if (!item.fecha_vencimiento) return false;
        const vDate = new Date(item.fecha_vencimiento);
        const vDateLocal = new Date(vDate.getUTCFullYear(), vDate.getUTCMonth(), vDate.getUTCDate());

        return vDateLocal > today && vDateLocal <= nextWeek;
    });

    // 3. Client Summary
    const clientMap = new Map<string, { id: string; cliente: string; totalDebt: number; documents: number }>();

    data.forEach(item => {
        const clientName = item.cliente_name || "Desconocido";
        // Use client name as key for grouping
        if (!clientMap.has(clientName)) {
            clientMap.set(clientName, {
                id: clientName, // Using name as ID for this view
                cliente: clientName,
                totalDebt: 0,
                documents: 0
            });
        }

        const entry = clientMap.get(clientName)!;
        entry.totalDebt += item.saldo_pendiente || 0;
        entry.documents += 1;
    });

    const clientData = Array.from(clientMap.values()).sort((a, b) => b.totalDebt - a.totalDebt);

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Cobranza</h1>
                <div className="flex items-center gap-2">
                    <ClientFilter clients={clients} />
                    <DateFilter />
                </div>
            </div>

            <CobranzaStats data={data} />
            {/* <CobranzaChart data={data} /> */}

            <div className="grid gap-8 min-w-0">

                {/* 1. Expired Bills */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Facturas Vencidas
                    </h2>
                    <CobranzaTable data={expiredData} />
                </div>

                {/* 2. Expiring Soon (Next 7 days) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Próximos Vencimientos (7 días)
                    </h2>
                    <CobranzaTable data={expiringSoonData} />
                </div>

                {/* 3. Client Summary */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        Resumen por Cliente
                    </h2>
                    <CobranzaClientTable data={clientData} />
                </div>
            </div>
        </div>
    );
}
