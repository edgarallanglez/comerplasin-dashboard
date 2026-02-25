import { bridgeApi } from "@/lib/api/bridge";
import { PagosStats } from "./_components/pagos-stats";
import { PagosChart } from "./_components/pagos-chart";
import { PaymentsBySupplierChart } from "./_components/payments-by-supplier-chart";
import { PagosTable } from "./_components/pagos-table";
import { PagosFilters } from "./_components/pagos-filters";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PagosProveedoresPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : undefined;
    const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
    const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;
    const proveedor = typeof params.proveedor === 'string' ? params.proveedor : undefined;

    let data: import("@/lib/api/bridge").PagoProveedor[] = [];
    let paymentsBySupplier: any[] = [];
    let proveedores: { id: number; nombre: string }[] = [];

    try {
        // Fetch raw data
        const [pagosData, paymentsBySupplierData, proveedoresData] = await Promise.all([
            bridgeApi.getPagosProveedores({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                proveedor
            }),
            bridgeApi.getPagosProveedores({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                groupBy: 'supplier'
            }),
            bridgeApi.getClientes(undefined, 2) // 2 = Proveedores (Providers)
        ]);

        data = pagosData;
        paymentsBySupplier = paymentsBySupplierData;
        proveedores = proveedoresData;
    } catch (error) {
        console.error("Failed to fetch pagos proveedores data", error);
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

    let supplierLabel = "Todos los proveedores";
    if (proveedor && proveedores.length > 0) {
        const found = proveedores.find(p => p.id.toString() === proveedor);
        if (found) {
            supplierLabel = found.nombre;
        }
    }

    return (
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Pagos a Proveedores</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <PagosFilters />
                </div>
            </div>

            <PagosStats data={data} />
            <PagosChart data={data} />

            <PaymentsBySupplierChart data={paymentsBySupplier} />

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                    Historial de Pagos
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {dateLabel} • {supplierLabel}
                    </span>
                </h2>
                <PagosTable data={data} />
            </div>
        </div>
    );
}
