"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const MONTHS = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
];

export function DateFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    const [selectedYear, setSelectedYear] = React.useState<string>(
        yearParam || currentYear.toString()
    );
    const [selectedMonth, setSelectedMonth] = React.useState<string>(
        monthParam || "all"
    );

    const applyFilters = (year: string, month: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("year", year);

        if (month && month !== "all") {
            params.set("month", month);
        } else {
            params.delete("month");
        }

        router.push(`?${params.toString()}`);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        applyFilters(year, selectedMonth);
    };

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        applyFilters(selectedYear, month);
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={selectedYear} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                    {[currentYear, currentYear - 1, currentYear - 2].map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedMonth} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Mes" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todo el año</SelectItem>
                    {MONTHS.map((m) => {
                        const mVal = parseInt(m.value);
                        const isFuture =
                            parseInt(selectedYear) === currentYear && mVal > currentMonth;

                        return (
                            <SelectItem key={m.value} value={m.value} disabled={isFuture}>
                                {m.label}
                            </SelectItem>
                        );
                    })}
                </SelectContent>
            </Select>
        </div>
    );
}
