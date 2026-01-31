"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Cobranza } from "@/lib/api/bridge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TruncatedCell } from "@/components/data-table/truncated-cell";

export const cobranzaColumns: ColumnDef<Cobranza>[] = [
  // {
  //   accessorKey: "id_movimiento",
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  //   cell: ({ row }) => <div className="w-20 font-medium">{row.original.id_movimiento}</div>,
  //   size: 80,
  // },
  {
    accessorKey: "id_documento",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Documento" />,
    cell: ({ row }) => <div className="w-24">{row.original.id_documento}</div>,
    size: 96,
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
    accessorKey: "fecha_vencimiento",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Vencimiento" />,
    cell: ({ row }) => {
      const vencimiento = new Date(row.original.fecha_vencimiento);
      const today = new Date();
      const isOverdue = vencimiento < today;
      
      return (
        <div className={`w-28 ${isOverdue ? "text-destructive font-medium" : ""}`}>
          {vencimiento.toLocaleDateString("es-MX", { timeZone: "UTC" })}
        </div>
      );
    },
    size: 112,
  },
  {
    accessorKey: "cliente_name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    cell: ({ row }) => <TruncatedCell value={row.original.cliente_name} maxWidth="200px" />,
    size: 200,
    filterFn: "includesString",
  },
  {
    accessorKey: "id_producto",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Producto" />,
    cell: ({ row }) => <TruncatedCell value={row.original.id_producto} maxWidth="250px" />,
    size: 250,
  },
  {
    accessorKey: "total",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Total" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right">
        ${row.original.total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "saldo_pendiente",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Saldo Pendiente" className="justify-end" />,
    cell: ({ row }) => (
      <div className="text-right font-semibold text-destructive">
        ${row.original.saldo_pendiente.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    ),
    size: 140,
  },
];
