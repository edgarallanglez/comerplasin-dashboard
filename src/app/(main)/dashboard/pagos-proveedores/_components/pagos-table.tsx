"use client";

import type { PagoProveedor } from "@/lib/api/bridge";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { pagosColumns } from "./pagos-columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PagosTableProps {
    data: PagoProveedor[];
}

export function PagosTable({ data }: PagosTableProps) {
    const table = useDataTableInstance({
        data,
        columns: pagosColumns,
        enableRowSelection: false,
        getRowId: (row) => row.CIDDOCUMENTO.toString(),
    });

    return (
        <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-2">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar por proveedor..."
                        value={(table.getColumn("proveedor")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("proveedor")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 w-full sm:w-[300px]"
                    />
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto max-w-full">
                <DataTable table={table} columns={pagosColumns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}

