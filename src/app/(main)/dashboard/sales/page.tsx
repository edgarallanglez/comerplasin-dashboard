import { bridgeApi } from "@/lib/api/bridge";
import { SalesChart } from "./_components/sales-chart";
import { SalesStats } from "./_components/sales-stats";
import { SalesTable } from "./_components/sales-table";
import { DateFilter } from "./_components/date-filter";
import { ClientFilter } from "./_components/client-filter";

export const dynamic = 'force-dynamic'; // Force dynamic rendering for searchParams

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SalesPage({ searchParams }: PageProps) {
    const params = await searchParams

    // Default to current year if no year param provided
    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : undefined;
    const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
    const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;
    const cliente = typeof params.cliente === 'string' ? params.cliente : undefined;

    let data: import("@/lib/api/bridge").Sale[] = [];
    let clients: { id: number; nombre: string }[] = [];

    try {
        // Fetch data in parallel
        const [salesData, clientsData] = await Promise.all([
            bridgeApi.getSales({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                cliente
            }),
            bridgeApi.getClientes()
        ]);

        data = salesData;
        clients = clientsData;
    } catch (error) {
        console.error("Failed to fetch data", error);
    }

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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ventas</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <ClientFilter clients={clients} />
                    <DateFilter />
                </div>
            </div>

            <SalesStats data={data} />
            <SalesChart data={data} />

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                    Transacciones Recientes
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {dateLabel} • {clientLabel}
                    </span>
                </h2>
                <SalesTable data={data} />
            </div>
        </div>
    );
}
