import { DollarSign, CreditCard, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PagoProveedor } from "@/lib/api/bridge";

interface PagosStatsProps {
    data: PagoProveedor[];
}

export function PagosStats({ data }: PagosStatsProps) {
    const totalPagado = data.reduce((acc, curr) => acc + curr.CTOTAL, 0);
    const numPagos = data.length;
    const uniqueSuppliers = new Set(data.map(d => d.CIDCLIENTEPROVEEDOR)).size;
    const promedioPago = numPagos > 0 ? totalPagado / numPagos : 0;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalPagado.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.length > 0 ? "Para el periodo seleccionado" : "No hay datos"}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Número de Pagos</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{numPagos}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proveedores Pagados</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueSuppliers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Promedio por Pago</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${promedioPago.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                </CardContent>
            </Card>
        </div>
    );
}
