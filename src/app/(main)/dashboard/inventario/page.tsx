import { bridgeApi } from "@/lib/api/bridge";
import { InventarioStats } from "./_components/inventario-stats";
import { InventarioTable } from "./_components/inventario-table";
import { InventarioFilters } from "./_components/inventario-filters";

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function InventarioPage({ searchParams }: PageProps) {
    const params = await searchParams;

    const producto = typeof params.producto === 'string' ? params.producto : undefined;
    const almacen = typeof params.almacen === 'string' ? params.almacen : undefined;
    const conStock = params.conStock === '1';

    // If conStock is checked, use minStock filter to show only items with stock > 0
    const minStock = conStock ? '0' : undefined;

    let data: import("@/lib/api/bridge").Inventario[] = [];
    let allData: import("@/lib/api/bridge").Inventario[] = [];

    try {
        // Get filtered data for display
        data = await bridgeApi.getInventario({ producto, almacen, minStock });

        // Get all data to extract warehouse list (only if filtering by almacen)
        if (almacen) {
            allData = await bridgeApi.getInventario({});
        } else {
            allData = data;
        }
    } catch (error) {
        console.error("Failed to fetch inventario data", error);
    }

    // Extract unique warehouses for the filter dropdown
    const warehouseMap = new Map<number, string>();
    allData.forEach(item => {
        if (!warehouseMap.has(item.id_almacen)) {
            warehouseMap.set(item.id_almacen, item.almacen);
        }
    });
    const warehouses = Array.from(warehouseMap.entries()).map(([id_almacen, almacen]) => ({
        id_almacen,
        almacen
    })).sort((a, b) => a.almacen.localeCompare(b.almacen));

    let productLabel = "Todos los productos";
    if (producto) {
        productLabel = `Producto ${producto}`;
    }

    let warehouseLabel = "Todos los almacenes";
    if (almacen) {
        const found = warehouses.find(w => w.id_almacen.toString() === almacen);
        if (found) {
            warehouseLabel = found.almacen;
        }
    }

    let stockLabel = conStock ? "En existencia (>0)" : "Todo el inventario";

    return (
        <div className="flex flex-col gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Inventario</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <InventarioFilters warehouses={warehouses} />
                </div>
            </div>

            <InventarioStats data={data} />

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold flex items-center gap-2 flex-wrap">
                    Productos en inventario
                    <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-1 rounded-md">
                        {warehouseLabel} • {productLabel} • {stockLabel}
                    </span>
                </h2>
                <InventarioTable data={data} />
            </div>
        </div>
    );
}

