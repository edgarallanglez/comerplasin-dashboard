"use client";

import type { Sale } from "@/lib/api/bridge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { salesColumns } from "./sales-columns";

interface SalesTableProps {
  data: Sale[];
}

export function SalesTable({ data }: SalesTableProps) {
  const table = useDataTableInstance({
    data,
    columns: salesColumns,
    enableRowSelection: false,
    getRowId: (row) => row.id_movimiento.toString(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <DataTable table={table} columns={salesColumns} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
