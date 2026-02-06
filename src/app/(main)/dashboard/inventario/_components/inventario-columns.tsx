"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Inventario } from "@/lib/api/bridge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TruncatedCell } from "@/components/data-table/truncated-cell";
import { Badge } from "@/components/ui/badge";

export const inventarioColumns: ColumnDef<Inventario>[] = [
    {
        accessorKey: "codigo_producto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Código" />,
        cell: ({ row }) => <div className="w-24 font-medium">{row.original.codigo_producto}</div>,
        size: 100,
    },
    {
        accessorKey: "nombre_producto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
        cell: ({ row }) => <TruncatedCell value={row.original.nombre_producto} maxWidth="440px" />,
        size: 440,
        filterFn: "includesString",
    },
    {
        accessorKey: "almacen",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Almacén" />,
        cell: ({ row }) => <TruncatedCell value={row.original.almacen} maxWidth="280px" />,
        size: 280,
    },
    {
        accessorKey: "existencia",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Existencia" className="justify-end" />,
        cell: ({ row }) => {
            const stock = row.original.existencia;
            const isLow = stock < 10;
            return (
                <div className={`text-right font-medium ${isLow ? "text-destructive" : ""}`}>
                    {stock.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            );
        },
        size: 120,
    },
    {
        accessorKey: "status_producto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => {
            const status = row.original.status_producto;
            return (
                <Badge variant={status === 1 ? "default" : "secondary"}>
                    {status === 1 ? "Activo" : "Inactivo"}
                </Badge>
            );
        },
        size: 100,
    },
];
