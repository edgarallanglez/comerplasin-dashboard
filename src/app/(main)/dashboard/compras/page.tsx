import { bridgeApi } from "@/lib/api/bridge";
import { ComprasStats } from "./_components/compras-stats";
import { ComprasChart } from "./_components/compras-chart";
import { TopSuppliersChart } from "./_components/top-suppliers-chart";
import { TopProductsChart } from "./_components/top-products-chart";
import { ComprasTable } from "./_components/compras-table";
import { ComprasFilters } from "./_components/compras-filters";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ComprasPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const currentYear = new Date().getFullYear().toString();
    const year = typeof params.year === 'string' ? params.year : currentYear;
    const month = typeof params.month === 'string' ? params.month : undefined;
    const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
    const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;
    const proveedor = typeof params.proveedor === 'string' ? params.proveedor : undefined;
    const producto = typeof params.producto === 'string' ? params.producto : undefined;

    let data: import("@/lib/api/bridge").Compra[] = [];
    let topSuppliers: any[] = [];
    let topProducts: any[] = [];

    try {
        // Fetch raw data
        data = await bridgeApi.getCompras({
            year: startDate && endDate ? undefined : year,
            month: startDate && endDate ? undefined : month,
            startDate,
            endDate,
            proveedor,
            producto
        });

        // Fetch top suppliers
        topSuppliers = await bridgeApi.getCompras({
            year: startDate && endDate ? undefined : year,
            month: startDate && endDate ? undefined : month,
            startDate,
            endDate,
            proveedor,
            producto,
            top: 'suppliers',
            limit: '10'
        });

        // Fetch top products
        topProducts = await bridgeApi.getCompras({
            year: startDate && endDate ? undefined : year,
            month: startDate && endDate ? undefined : month,
            startDate,
            endDate,
            proveedor,
            producto,
            top: 'products',
            limit: '10'
        });
    } catch (error) {
        console.error("Failed to fetch compras data", error);
    }

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Compras</h1>
                <div className="flex items-center gap-2">
                    <ComprasFilters />
                </div>
            </div>

            <ComprasStats data={data} topSuppliers={topSuppliers} />
            <ComprasChart data={data} />

            <div className="grid gap-4 md:grid-cols-2">
                <TopSuppliersChart data={topSuppliers} />
                <TopProductsChart data={topProducts} />
            </div>

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold">Transacciones Recientes</h2>
                <ComprasTable data={data} />
            </div>
        </div>
    );
}
