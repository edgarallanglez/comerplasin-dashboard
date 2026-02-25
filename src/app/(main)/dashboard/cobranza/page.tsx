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
    let clientSummaryData: import("@/lib/api/bridge").Cobranza[] = [];
    let clients: { id: number; nombre: string }[] = [];

    try {
        const [cobranzaData, unfilteredCobranzaData, clientsData] = await Promise.all([
            bridgeApi.getCobranza({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                cliente
            }),
            bridgeApi.getCobranza({
                cliente // Only pass cliente, ignore dates
            }),
            bridgeApi.getClientes(undefined, 1) // 1 = Clients
        ]);

        data = cobranzaData;
        clientSummaryData = unfilteredCobranzaData;
        clients = clientsData;
    } catch (error) {
        console.error("Failed to fetch data", error);
    }

    // --- Processing Data for Views ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // 1. Expired: Due date < Today (Strictly yesterday or older)
    const expiredData = data.filter(item => {
        if (!item.fecha_vencimiento) return false;
        const vDate = new Date(item.fecha_vencimiento);
        const vDateLocal = new Date(vDate.getUTCFullYear(), vDate.getUTCMonth(), vDate.getUTCDate());

        return vDateLocal < today;
    });

    // 2. Expiring Soon: Today <= Due date <= Next Week
    const expiringSoonData = data.filter(item => {
        if (!item.fecha_vencimiento) return false;
        const vDate = new Date(item.fecha_vencimiento);
        const vDateLocal = new Date(vDate.getUTCFullYear(), vDate.getUTCMonth(), vDate.getUTCDate());

        return vDateLocal >= today && vDateLocal <= nextWeek;
    });

    // 3. Client Summary
    const clientMap = new Map<string, { id: string; cliente: string; totalDebt: number; expiredDebt: number; documents: number }>();

    clientSummaryData.forEach(item => {
        const clientName = item.cliente_name || "Desconocido";
        // Use client name as key for grouping
        if (!clientMap.has(clientName)) {
            clientMap.set(clientName, {
                id: clientName, // Using name as ID for this view
                cliente: clientName,
                totalDebt: 0,
                expiredDebt: 0,
                documents: 0
            });
        }

        const entry = clientMap.get(clientName)!;
        entry.totalDebt += item.saldo_pendiente || 0;
        entry.documents += 1;

        if (item.fecha_vencimiento) {
            const vDate = new Date(item.fecha_vencimiento);
            const vDateLocal = new Date(vDate.getUTCFullYear(), vDate.getUTCMonth(), vDate.getUTCDate());
            if (vDateLocal < today) {
                entry.expiredDebt += item.saldo_pendiente || 0;
            }
        }
    });

    const clientData = Array.from(clientMap.values()).sort((a, b) => b.totalDebt - a.totalDebt);

    let dateLabel = "";
    if (startDate && endDate) {
        const formatStr = (ds: string) => {
            const parts = ds.split('-');
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            return ds;
        };
        dateLabel = `Del ${formatStr(startDate)} al ${formatStr(endDate)}`;
    } else if (month && year) {
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthName = date.toLocaleString('es-MX', { month: 'long' });
        dateLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
    } else {
        dateLabel = `Todo el año ${year}`;
    }

    let clientLabel = "Todos los clientes";
    if (cliente && clients.length > 0) {
        const found = clients.find(c => c.id.toString() === cliente);
        if (found) {
            clientLabel = found.nombre;
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cobranza</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <ClientFilter clients={clients} />
                    <DateFilter />
                </div>
            </div>

            <CobranzaStats data={data} />
            {/* <CobranzaChart data={data} /> */}

            <div className="grid gap-8 min-w-0">

                {/* 1. Expired Bills */}
                <div className="space-y-4 min-w-0">
                    <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                        Facturas Vencidas
                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {dateLabel} • {clientLabel}
                        </span>
                    </h2>
                    <CobranzaTable data={expiredData} />
                </div>

                {/* 2. Expiring Soon (Next 7 days) */}
                <div className="space-y-4 min-w-0">
                    <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                        Próximos Vencimientos (7 días)
                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            {dateLabel} • {clientLabel}
                        </span>
                    </h2>
                    <CobranzaTable data={expiringSoonData} />
                </div>

                {/* 3. Client Summary */}
                <div className="space-y-4 min-w-0">
                    <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                        Resumen por Cliente
                        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                            Histórico completo • {clientLabel}
                        </span>
                    </h2>
                    <CobranzaClientTable data={clientData} />
                </div>
            </div>
        </div>
    );
}
