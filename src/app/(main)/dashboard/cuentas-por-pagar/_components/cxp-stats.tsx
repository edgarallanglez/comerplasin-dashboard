import { DollarSign, AlertCircle, Calendar, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Cxp } from "@/lib/api/bridge";

interface CxpStatsProps {
    data: Cxp[];
}

export function CxpStats({ data }: CxpStatsProps) {
    // Calculate totals from supplier-level data
    const saldoTotal = data.reduce((acc, curr) => acc + curr.saldo_real, 0);
    const totalDeudas = data.reduce((acc, curr) => acc + curr.total_deudas, 0);
    const totalPagos = data.reduce((acc, curr) => acc + curr.total_pagos_creditos, 0);
    const totalVencido = data.reduce((acc, curr) => acc + curr.saldo_vencido, 0);
    const totalDocs = data.reduce((acc, curr) => acc + curr.documentos, 0);
    const uniqueSuppliers = data.length;

    const proveedoresVencidos = data.filter(d => d.saldo_vencido > 0).length;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">CxP Neto</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${saldoTotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Facturas - Pagos aplicados
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Vencido</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-destructive">
                        ${totalVencido.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {proveedoresVencidos} proveedor{proveedoresVencidos !== 1 ? 'es' : ''}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <Calendar className="h-5 w-5 text-green-600" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        ${totalPagos.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Sin aplicar a facturas
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documentos</CardTitle>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalDocs}</div>
                    <p className="text-xs text-muted-foreground">
                        Pendientes
                    </p>
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
                    <div className="text-2xl font-bold">{uniqueSuppliers}</div>
                    <p className="text-xs text-muted-foreground">
                        Con saldo pendiente
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
