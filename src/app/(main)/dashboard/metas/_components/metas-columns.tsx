"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Meta } from "@/lib/api/bridge";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TruncatedCell } from "@/components/data-table/truncated-cell";
import { formatCurrency } from "@/lib/utils";

const getMonthName = (monthIndex: number) => {
    const date = new Date();
    date.setMonth(monthIndex - 1);
    return date.toLocaleString('es-MX', { month: 'long' });
};

export const getMetasColumns = (year: number, month: number): ColumnDef<Meta>[] => {
    const prevYear = year - 1;
    const monthName = getMonthName(month);
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    return [
        {
            accessorKey: "cliente_name",
            header: ({ column }) => <DataTableColumnHeader column={column} title="Cliente" />,
            cell: ({ row }) => <TruncatedCell value={row.original.cliente_name} maxWidth="300px" />,
            size: 300,
            filterFn: "includesString",
        },
        {
            accessorKey: "venta_anio_anterior",
            header: ({ column }) => <DataTableColumnHeader column={column} title={`Venta ${prevYear}`} className="justify-end" />,
            cell: ({ row }) => <div className="text-right font-mono">{formatCurrency(row.original.venta_anio_anterior)}</div>,
            size: 150,
        },
        {
            accessorKey: "venta_anio_actual",
            header: ({ column }) => <DataTableColumnHeader column={column} title={`Venta ${year}`} className="justify-end" />,
            cell: ({ row }) => <div className="text-right font-mono font-medium">{formatCurrency(row.original.venta_anio_actual)}</div>,
            size: 150,
        },
        {
            accessorKey: "venta_mes_anterior",
            header: ({ column }) => <DataTableColumnHeader column={column} title={`${capitalizedMonth} ${prevYear}`} className="justify-end" />,
            cell: ({ row }) => <div className="text-right font-mono">{formatCurrency(row.original.venta_mes_anterior)}</div>,
            size: 150,
        },
        {
            accessorKey: "venta_mes_anterior_actual",
            header: ({ column }) => {
                const date = new Date();
                date.setMonth(month - 2); // One month before the selected month
                const prevCurMonthName = date.toLocaleString('es-MX', { month: 'long' });
                const prevCurMonthCapitalized = prevCurMonthName.charAt(0).toUpperCase() + prevCurMonthName.slice(1);
                const isDecemberPrev = (month - 2) < 0;
                const yearForPrevCur = isDecemberPrev ? year - 1 : year;
                return <DataTableColumnHeader column={column} title={`${prevCurMonthCapitalized} ${yearForPrevCur}`} className="justify-end" />;
            },
            cell: ({ row }) => <div className="text-right font-mono">{formatCurrency(row.original.venta_mes_anterior_actual)}</div>,
            size: 150,
        },
        {
            accessorKey: "venta_mes_actual",
            header: ({ column }) => <DataTableColumnHeader column={column} title={`${capitalizedMonth} ${year}`} className="justify-end" />,
            cell: ({ row }) => {
                const current = row.original.venta_mes_actual;
                const previous = row.original.venta_mes_anterior;
                const isHigher = current >= previous;

                return (
                    <div className={`text-right font-mono font-bold ${isHigher ? "text-green-600" : "text-yellow-600"}`}>
                        {formatCurrency(current)}
                    </div>
                );
            },
            size: 150,
        },
    ];
};
