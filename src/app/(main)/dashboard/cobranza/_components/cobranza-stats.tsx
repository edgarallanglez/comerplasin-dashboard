import { DollarSign, AlertCircle, Users, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cobranza } from "@/lib/api/bridge";

interface CobranzaStatsProps {
    data: Cobranza[];
}

export function CobranzaStats({ data }: CobranzaStatsProps) {
    const totalPendiente = data.reduce((acc, curr) => acc + (curr.saldo_pendiente || 0), 0);
    const totalCuentas = data.length;
    const uniqueClients = new Set(data.map(d => d.cliente_name)).size;

    const today = new Date();
    const vencidas = data.filter(item => {
        const vencimiento = new Date(item.fecha_vencimiento);
        return vencimiento < today;
    });
    const totalVencido = vencidas.reduce((acc, curr) => acc + curr.saldo_pendiente, 0);
    const cuentasVencidas = vencidas.length;

    const porVencer = data.filter(item => {
        const vencimiento = new Date(item.fecha_vencimiento);
        const diffDays = Math.ceil((vencimiento.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 30;
    });
    const totalPorVencer = porVencer.reduce((acc, curr) => acc + curr.saldo_pendiente, 0);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total por Cobrar</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">${totalPendiente.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.length > 0 ? "Saldo pendiente total" : "No hay datos"}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cuentas Vencidas</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">${totalVencido.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {cuentasVencidas} cuenta{cuentasVencidas !== 1 ? 's' : ''} vencida{cuentasVencidas !== 1 ? 's' : ''}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Por Vencer (30 días)</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                        <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">${totalPorVencer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    <p className="text-xs text-muted-foreground">
                        {porVencer.length} cuenta{porVencer.length !== 1 ? 's' : ''}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cuentas</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalCuentas}</div>
                    <p className="text-xs text-muted-foreground">
                        Documentos por cobrar
                    </p>
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
                    <div className="text-2xl font-bold">{uniqueClients}</div>
                    <p className="text-xs text-muted-foreground">
                        Con saldo pendiente
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
