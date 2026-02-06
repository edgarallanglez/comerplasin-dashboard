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

    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Inventario</h1>
                <div className="flex items-center gap-2">
                    <InventarioFilters warehouses={warehouses} />
                </div>
            </div>

            <InventarioStats data={data} />

            <div className="grid gap-4 min-w-0">
                <h2 className="text-xl font-semibold">Productos en inventario</h2>
                <InventarioTable data={data} />
            </div>
        </div>
    );
}

