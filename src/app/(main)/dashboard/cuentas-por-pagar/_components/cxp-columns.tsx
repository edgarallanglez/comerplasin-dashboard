"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Cxp } from "@/lib/api/bridge";
import { Badge } from "@/components/ui/badge";

export const cxpColumns: ColumnDef<Cxp>[] = [
    {
        accessorKey: "proveedor",
        header: "Proveedor",
        cell: ({ row }) => {
            const proveedor = row.getValue("proveedor") as string;
            return <div className="max-w-[250px] truncate font-medium" title={proveedor}>{proveedor}</div>;
        },
    },
    {
        accessorKey: "saldo_real",
        header: "Saldo Neto",
        cell: ({ row }) => {
            const saldo = row.getValue<number>("saldo_real");
            return (
                <span className="font-semibold text-red-600">
                    ${saldo.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
            );
        },
    },
    {
        accessorKey: "total_deudas",
        header: "Total Facturas",
        cell: ({ row }) => {
            const total = row.getValue<number>("total_deudas");
            return (
                <span className="text-muted-foreground">
                    ${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
            );
        },
    },
    {
        accessorKey: "total_pagos_creditos",
        header: "Pagos/Créditos",
        cell: ({ row }) => {
            const total = row.getValue<number>("total_pagos_creditos");
            if (total === 0) return <span className="text-muted-foreground">-</span>;
            return (
                <span className="text-green-600">
                    -${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </span>
            );
        },
    },
    {
        accessorKey: "saldo_vencido",
        header: "Vencido",
        cell: ({ row }) => {
            const vencido = row.getValue<number>("saldo_vencido");
            if (vencido === 0) return <span className="text-muted-foreground">-</span>;
            return (
                <Badge variant="destructive">
                    ${vencido.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </Badge>
            );
        },
    },
    {
        accessorKey: "documentos",
        header: "Docs",
        cell: ({ row }) => {
            return <span className="text-muted-foreground">{row.getValue("documentos")}</span>;
        },
    },
];
