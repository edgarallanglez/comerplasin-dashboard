import { Package, Warehouse, AlertTriangle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Inventario } from "@/lib/api/bridge";

interface InventarioStatsProps {
    data: Inventario[];
}

export function InventarioStats({ data }: InventarioStatsProps) {
    const totalProducts = data.length;
    const totalStock = data.reduce((acc, curr) => acc + curr.existencia, 0);
    const lowStockProducts = data.filter(d => d.existencia < 10 && d.existencia > 0).length;
    const outOfStock = data.filter(d => d.existencia <= 0).length;
    const uniqueWarehouses = new Set(data.map(d => d.id_almacen)).size;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Package className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalProducts.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.length > 0 ? "Productos en inventario" : "No hay datos"}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Existencia Total</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalStock.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        Unidades en stock
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{lowStockProducts}</div>
                    <p className="text-xs text-muted-foreground">
                        Productos con menos de 10 unidades
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sin Stock</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{outOfStock}</div>
                    <p className="text-xs text-muted-foreground">
                        Productos agotados
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Almacenes</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Warehouse className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueWarehouses}</div>
                    <p className="text-xs text-muted-foreground">
                        Almacenes activos
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
