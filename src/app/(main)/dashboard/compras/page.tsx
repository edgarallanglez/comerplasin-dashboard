import { bridgeApi } from "@/lib/api/bridge";
import { ComprasStats } from "./_components/compras-stats";
import { ComprasChart } from "./_components/compras-chart";
import { TopSuppliersChart } from "./_components/top-suppliers-chart";
import { TopProductsChart } from "./_components/top-products-chart";
import { ComprasTable } from "./_components/compras-table";
import { ComprasFilters } from "./_components/compras-filters";
import { ClientFilter } from "../sales/_components/client-filter";

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
    let proveedores: { id: number; nombre: string }[] = [];

    try {
        // Fetch raw data
        const [comprasData, topSuppliersData, topProductsData, proveedoresData] = await Promise.all([
            bridgeApi.getCompras({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                proveedor,
                producto
            }),
            bridgeApi.getCompras({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                proveedor,
                producto,
                top: 'suppliers',
                limit: '10'
            }),
            bridgeApi.getCompras({
                year: startDate && endDate ? undefined : year,
                month: startDate && endDate ? undefined : month,
                startDate,
                endDate,
                proveedor,
                producto,
                top: 'products',
                limit: '10'
            }),
            bridgeApi.getClientes(undefined, 2) // 2 = Proveedores (Providers)
        ]);

        data = comprasData;
        topSuppliers = topSuppliersData;
        topProducts = topProductsData;
        proveedores = proveedoresData;
    } catch (error) {
        console.error("Failed to fetch compras data", error);
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

    let providerLabel = "Todos los proveedores";
    if (proveedor && proveedores.length > 0) {
        const found = proveedores.find(p => p.id.toString() === proveedor);
        if (found) {
            providerLabel = found.nombre;
        }
    }

    let productLabel = "Todos los productos";
    if (producto) {
        productLabel = `Producto ${producto}`; // Using code since we don't have full product list
    }

    return (
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Compras</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    {/* <ClientFilter clients={proveedores} /> */}
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
                <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                    Transacciones Recientes
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {dateLabel} • {providerLabel} • {productLabel}
                    </span>
                </h2>
                <ComprasTable data={data} />
            </div>
        </div>
    );
}
