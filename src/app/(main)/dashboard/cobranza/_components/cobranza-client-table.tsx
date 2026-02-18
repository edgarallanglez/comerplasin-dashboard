"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { formatCurrency } from "@/lib/utils";

export interface ClientDebt {
    id: string;
    cliente: string;
    totalDebt: number;
    documents: number;
}

export const clientDebtColumns: ColumnDef<ClientDebt>[] = [
    {
        accessorKey: "cliente",
        header: "Cliente",
    },
    {
        accessorKey: "documents",
        header: "Facturas",
    },
    {
        accessorKey: "totalDebt",
        header: "Deuda Total",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalDebt"));
            return <div className="font-medium">{formatCurrency(amount)}</div>;
        },
    },
];

interface CobranzaClientTableProps {
    data: ClientDebt[];
}

export function CobranzaClientTable({ data }: CobranzaClientTableProps) {

    const table = useDataTableInstance({
        data,
        columns: clientDebtColumns,
        enableRowSelection: false,
        getRowId: (row) => row.id,
    });

    const filterValue = (table.getColumn("cliente")?.getFilterValue() as string) ?? "";
    const isFiltering = filterValue.length > 0;

    // Calculate total of filtered rows
    const totalDebt = useMemo(() => {
        const filteredRows = table.getFilteredRowModel().rows;
        return filteredRows.reduce((sum, row) => sum + (row.original.totalDebt || 0), 0);
    }, [table.getFilteredRowModel().rows]);

    return (
        <div className="space-y-4 min-w-0">
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar por cliente..."
                        value={filterValue}
                        onChange={(event) =>
                            table.getColumn("cliente")?.setFilterValue(event.target.value)
                        }
                        className="pl-8 w-full sm:w-[300px]"
                    />
                </div>
                {isFiltering && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Total filtrado:</span>
                        <span className="font-semibold text-primary">{formatCurrency(totalDebt)}</span>
                    </div>
                )}
            </div>
            <div className="rounded-md border overflow-x-auto max-w-full">
                <DataTable table={table} columns={clientDebtColumns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
