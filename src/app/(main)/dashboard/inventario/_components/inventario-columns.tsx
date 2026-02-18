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
            const amount = parseFloat(row.getValue("existencia"));
            // Format to 2 decimal places
            return <div className="font-medium text-right font-mono">{amount.toFixed(2)}</div>;
        },
    },
    {
        accessorKey: "min_stock",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Min" className="justify-end" />
        ),
        cell: ({ row }) => {
            const amount = row.original.min_stock ?? 0;
            return <div className="text-right font-mono text-muted-foreground">{amount.toFixed(2)}</div>;
        },
    },
    {
        accessorKey: "max_stock",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Max" className="justify-end" />
        ),
        cell: ({ row }) => {
            const amount = row.original.max_stock ?? 0;
            return <div className="text-right font-mono text-muted-foreground">{amount.toFixed(2)}</div>;
        },
    },
    {
        accessorKey: "ultimo_costo",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Costo" className="justify-end" />
        ),
        cell: ({ row }) => {
            const amount = row.original.ultimo_costo ?? 0;
            return <div className="text-right font-mono">
                {new Intl.NumberFormat("es-MX", {
                    style: "currency",
                    currency: "MXN",
                }).format(amount)}
            </div>;
        },
    },
    {
        accessorKey: "status_producto",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" className="justify-end" />,
        cell: ({ row }) => {
            const status = row.original.status_producto;
            return (
                <div className="flex justify-center">
                    <Badge variant={status === 1 ? "default" : "secondary"}>
                        {status === 1 ? "Activo" : "Inactivo"}
                    </Badge>
                </div>
            );
        },
        size: 100,
    },
];
