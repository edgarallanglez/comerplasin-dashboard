"use client";

import type { Cobranza } from "@/lib/api/bridge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { cobranzaColumns } from "./cobranza-columns";

interface CobranzaTableProps {
  data: Cobranza[];
}

export function CobranzaTable({ data }: CobranzaTableProps) {
  const table = useDataTableInstance({
    data,
    columns: cobranzaColumns,
    enableRowSelection: false,
    getRowId: (row) => row.id_movimiento.toString(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <DataTable table={table} columns={cobranzaColumns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
