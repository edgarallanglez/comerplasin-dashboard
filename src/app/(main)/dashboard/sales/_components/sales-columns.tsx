"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Sale } from "@/lib/api/bridge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";

export const salesColumns: ColumnDef<Sale>[] = [
  {
    accessorKey: "id_movimiento",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="w-20 font-medium">{row.original.id_movimiento}</div>,
    size: 80,
  },
  {
    accessorKey: "fecha",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Fecha" />,
    cell: ({ row }) => (
      <div className="w-28">
        {new Date(row.original.fecha).toLocaleDateString("es-MX", { timeZone: "UTC" })}
      </div>
    ),
    size: 112,
  },
  {
    accessorKey: "cliente_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => <div className="max-w-[200px] truncate">{row.original.cliente_name}</div>,
    size: 200,
  },
  {
    accessorKey: "id_producto",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
    cell: ({ row }) => <div className="w-24">{row.original.id_producto}</div>,
    size: 96,
  },
  {
    accessorKey: "subtotal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Subtotal" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ${row.original.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total (con IVA)" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right font-medium">
        ${row.original.total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    ),
    size: 140,
  },
];
