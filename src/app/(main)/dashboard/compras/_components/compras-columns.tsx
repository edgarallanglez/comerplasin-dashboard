"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Compra } from "@/lib/api/bridge";
import { Badge } from "@/components/ui/badge";

export const comprasColumns: ColumnDef<Compra>[] = [
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
        accessorKey: "tipo_concepto",
        header: "Tipo",
        cell: ({ row }) => {
            const tipo = row.getValue("tipo_concepto") as string;
            const variant = tipo === "COMPRA" ? "default" : tipo === "NC_PROVEEDOR" ? "destructive" : "secondary";
            return <Badge variant={variant}>{tipo}</Badge>;
        },
    },
    {
        accessorKey: "proveedor",
        header: "Proveedor",
        cell: ({ row }) => {
            const proveedor = row.getValue("proveedor") as string;
            return <div className="max-w-[200px] truncate" title={proveedor}>{proveedor}</div>;
        },
    },
    {
        accessorKey: "CNOMBREPRODUCTO",
        header: "Producto",
        cell: ({ row }) => {
            const producto = row.getValue("CNOMBREPRODUCTO") as string;
            return <div className="max-w-[200px] truncate" title={producto}>{producto}</div>;
        },
    },
    {
        accessorKey: "cantidad",
        header: "Cantidad",
        cell: ({ row }) => {
            return row.getValue<number>("cantidad").toLocaleString("es-MX", { minimumFractionDigits: 2 });
        },
    },
    {
        accessorKey: "precio_unitario",
        header: "Precio Unit.",
        cell: ({ row }) => {
            return `$${row.getValue<number>("precio_unitario").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
    {
        accessorKey: "subtotal",
        header: "Subtotal",
        cell: ({ row }) => {
            return `$${row.getValue<number>("subtotal").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
    {
        accessorKey: "iva",
        header: "IVA",
        cell: ({ row }) => {
            return `$${row.getValue<number>("iva").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            return `$${row.getValue<number>("total").toLocaleString("es-MX", { minimumFractionDigits: 2 })}`;
        },
    },
];
