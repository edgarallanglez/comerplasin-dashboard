"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { PagoProveedor } from "@/lib/api/bridge";
import { Badge } from "@/components/ui/badge";

export const pagosColumns: ColumnDef<PagoProveedor>[] = [
    {
        accessorKey: "CFECHA",
        header: "Fecha",
        cell: ({ row }) => {
            const date = new Date(row.getValue("CFECHA"));
            return date.toLocaleDateString("es-MX", { year: 'numeric', month: 'short', day: 'numeric' });
        },
    },
    {
        accessorKey: "CFOLIO",
        header: "Folio",
    },
    {
        accessorKey: "tipo_pago",
        header: "Tipo",
        cell: ({ row }) => {
            const tipo = row.getValue("tipo_pago") as string;
            return <Badge variant="default">{tipo}</Badge>;
        },
    },
    {
        accessorKey: "proveedor",
        header: "Proveedor",
        cell: ({ row }) => {
            const proveedor = row.getValue("proveedor") as string;
            return <div className="max-w-[250px] truncate" title={proveedor}>{proveedor}</div>;
        },
    },
    {
        accessorKey: "CREFERENCIA",
        header: "Referencia",
    },
    {
        accessorKey: "CNETO",
        header: "Neto",
        cell: ({ row }) => {
            return `$${row.getValue<number>("CNETO").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
    {
        accessorKey: "CIMPUESTO1",
        header: "IVA",
        cell: ({ row }) => {
            return `$${row.getValue<number>("CIMPUESTO1").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
    {
        accessorKey: "CTOTAL",
        header: "Total",
        cell: ({ row }) => {
            return `$${row.getValue<number>("CTOTAL").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
];
