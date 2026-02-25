"use client";

import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
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
    expiredDebt: number;
    documents: number;
}

export const clientDebtColumns: ColumnDef<ClientDebt>[] = [
    {
        accessorKey: "cliente",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
    },
    {
        accessorKey: "documents",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Facturas" />,
    },
    {
        accessorKey: "totalDebt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deuda Total" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalDebt"));
            return <div className="font-medium">{formatCurrency(amount)}</div>;
        },
    },
    {
        accessorKey: "expiredDebt",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Deuda Vencida" />,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("expiredDebt"));
            return (
                <div className={`font-semibold ${amount > 0 ? "text-destructive" : ""}`}>
                    {formatCurrency(amount)}
                </div>
            );
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

    // Calculate total of all rows (ignoring local table filters)
    const totalDebt = useMemo(() => {
        return data.reduce((sum, row) => sum + (row.totalDebt || 0), 0);
    }, [data]);

    const totalExpiredDebt = useMemo(() => {
        return data.reduce((sum, row) => sum + (row.expiredDebt || 0), 0);
    }, [data]);

    return (
        <div className="space-y-4 min-w-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 sm:gap-4">
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
                <div className="flex items-center gap-4 text-sm whitespace-nowrap overflow-x-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-semibold">{formatCurrency(totalDebt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Vencido:</span>
                        <span className={`font-semibold ${totalExpiredDebt > 0 ? "text-destructive" : ""}`}>
                            {formatCurrency(totalExpiredDebt)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto max-w-full">
                <DataTable table={table} columns={clientDebtColumns} />
            </div>
            <DataTablePagination table={table} />
        </div>
    );
}
