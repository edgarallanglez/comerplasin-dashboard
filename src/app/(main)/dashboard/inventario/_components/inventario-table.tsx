"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import type { Inventario } from "@/lib/api/bridge";
import { inventarioColumns } from "./inventario-columns";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface InventarioTableProps {
    data: Inventario[];
}

export function InventarioTable({ data }: InventarioTableProps) {
    const table = useDataTableInstance({
        data,
        columns: inventarioColumns,
        enableRowSelection: false,
        getRowId: (row) => row.id_existencia.toString(),
    });

    return (
        <div className="space-y-4 min-w-0">
            <div className="flex items-center gap-2">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar por producto..."
                        value={(table.getColumn("nombre_producto")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("nombre_producto")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 w-full sm:w-[300px]"
                    />
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto max-w-full">
                <DataTable table={table} columns={inventarioColumns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
