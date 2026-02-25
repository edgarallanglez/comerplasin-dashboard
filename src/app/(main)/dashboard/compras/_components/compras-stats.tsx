import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Compra } from "@/lib/api/bridge";

interface ComprasStatsProps {
    data: Compra[];
    topSuppliers: any[];
}

export function ComprasStats({ data, topSuppliers }: ComprasStatsProps) {
    const totalCompras = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSubtotal = data.reduce((acc, curr) => acc + curr.subtotal, 0);
    const totalOrders = new Set(data.map(d => d.CIDDOCUMENTO)).size;
    const uniqueSuppliers = topSuppliers.length; // Use topSuppliers count for accuracy
    const averageOrderValue = totalOrders > 0 ? totalCompras / totalOrders : 0;

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
            {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Compras (con IVA)</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">${totalCompras.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.length > 0 ? "Para el periodo seleccionado" : "No hay datos"}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Subtotal (sin IVA)</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">${totalSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.length > 0 ? "Para el periodo seleccionado" : "No hay datos"}
                    </p>
                </CardContent>
            </Card> */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{totalOrders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-lg sm:text-xl md:text-2xl font-bold">{uniqueSuppliers}</div>
                </CardContent>
            </Card>
        </div>
    );
}
