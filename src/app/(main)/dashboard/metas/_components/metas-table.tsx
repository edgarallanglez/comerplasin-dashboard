"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getMetasColumns } from "./metas-columns";
import { Meta } from "@/lib/api/bridge";
import { useMemo } from "react";

interface MetasTableProps {
    data: Meta[];
    year: number;
    month: number;
}

export function MetasTable({ data, year, month }: MetasTableProps) {
    const columns = useMemo(() => getMetasColumns(year, month), [year, month]);

    const table = useDataTableInstance({
        data,
        columns,
        enableRowSelection: false,
        getRowId: (row) => row.id_cliente.toString(),
        defaultPageSize: 20,
    });

    return (
        <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrar por cliente..."
                            value={(table.getColumn("cliente_name")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("cliente_name")?.setFilterValue(event.target.value)
                            }
                            className="pl-8 w-full"
                        />
                    </div>
                    <div className="relative w-full md:max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filtrar por agente..."
                            value={(table.getColumn("agente")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("agente")?.setFilterValue(event.target.value)
                            }
                            className="pl-8 w-full"
                        />
                    </div>
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto max-w-full">
                <DataTable table={table} columns={columns} />
            </div>
            <DataTablePagination table={table} noSelection />
        </div>
    );
}
