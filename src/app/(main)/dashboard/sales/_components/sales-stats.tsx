import { DollarSign, CreditCard, ShoppingCart, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Sale } from "@/lib/api/bridge";

interface SalesStatsProps {
    data: Sale[];
}

export function SalesStats({ data }: SalesStatsProps) {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSubtotal = data.reduce((acc, curr) => acc + curr.subtotal, 0);
    const totalOrders = data.length;
    const uniqueCustomers = new Set(data.map(d => d.id_cliente)).size;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de ventas (con IVA)</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
                    <div className="text-2xl font-bold">${totalSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.length > 0 ? "Para el periodo seleccionado" : "No hay datos"}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Ordenes</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor promedio de orden</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueCustomers}</div>
                </CardContent>
            </Card>
        </div>
    );
}
