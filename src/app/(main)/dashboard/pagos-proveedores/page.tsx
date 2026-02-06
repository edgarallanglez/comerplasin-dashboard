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

    try {
        // Fetch raw data
        data = await bridgeApi.getPagosProveedores({
            year: startDate && endDate ? undefined : year,
            month: startDate && endDate ? undefined : month,
            startDate,
            endDate,
            proveedor
        });

        // Fetch payments by supplier
        paymentsBySupplier = await bridgeApi.getPagosProveedores({
            year: startDate && endDate ? undefined : year,
            month: startDate && endDate ? undefined : month,
            startDate,
            endDate,
            groupBy: 'supplier'
        });
    } catch (error) {
        console.error("Failed to fetch pagos proveedores data", error);
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Pagos a Proveedores</h1>
                <div className="flex items-center gap-2">
                    <PagosFilters />
                </div>
            </div>

            <PagosStats data={data} />
            <PagosChart data={data} />

            <PaymentsBySupplierChart data={paymentsBySupplier} />

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold">Historial de Pagos</h2>
                <PagosTable data={data} />
            </div>
        </div>
    );
}
