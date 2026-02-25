"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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

export function DateFilter({ hideDays }: { hideDays?: boolean }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const [filterMode, setFilterMode] = React.useState<"preset" | "custom">(
        (startDateParam && endDateParam && !hideDays) ? "custom" : "preset"
    );
    const [selectedYear, setSelectedYear] = React.useState<string>(
        yearParam || currentYear.toString()
    );
    const [selectedMonth, setSelectedMonth] = React.useState<string>(
        monthParam || "all"
    );
    const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date }>({
        from: startDateParam ? new Date(startDateParam) : undefined,
        to: endDateParam ? new Date(endDateParam) : undefined,
    });

    const applyPresetFilters = (year: string, month: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("year", year);
        params.delete("startDate");
        params.delete("endDate");

        if (month && month !== "all") {
            params.set("month", month);
        } else {
            params.delete("month");
        }

        router.push(`?${params.toString()}`);
    };

    const applyCustomFilters = (from?: Date, to?: Date) => {
        const params = new URLSearchParams(searchParams);
        params.delete("year");
        params.delete("month");

        if (from && to) {
            params.set("startDate", format(from, "yyyy-MM-dd"));
            params.set("endDate", format(to, "yyyy-MM-dd"));
        } else {
            params.delete("startDate");
            params.delete("endDate");
        }

        router.push(`?${params.toString()}`);
    };

    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        applyPresetFilters(year, selectedMonth);
    };

    const handleMonthChange = (month: string) => {
        setSelectedMonth(month);
        applyPresetFilters(selectedYear, month);
    };

    const handleModeChange = (mode: "preset" | "custom") => {
        setFilterMode(mode);
        if (mode === "preset") {
            applyPresetFilters(selectedYear, selectedMonth);
        } else if (dateRange.from && dateRange.to) {
            applyCustomFilters(dateRange.from, dateRange.to);
        }
    };

    const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
        if (range) {
            setDateRange(range);
            if (range.from && range.to) {
                applyCustomFilters(range.from, range.to);
            }
        }
    };

    return (
        <div className="flex items-center gap-2 flex-wrap">
            {!hideDays && (
                <Select value={filterMode} onValueChange={(v) => handleModeChange(v as "preset" | "custom")}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="preset">Año/Mes</SelectItem>
                        <SelectItem value="custom">Rango Custom</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {filterMode === "preset" ? (
                <>
                    <Select value={selectedYear} onValueChange={handleYearChange}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Año" />
                        </SelectTrigger>
                        <SelectContent>
                            {Array.from({ length: currentYear - 2019 + 1 }, (_, i) => currentYear - i).map((y) => (
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
                </>
            ) : (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from && dateRange.to ? (
                                <>
                                    {format(dateRange.from, "dd MMM yyyy", { locale: es })} -{" "}
                                    {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                                </>
                            ) : (
                                <span>Seleccionar rango</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="range"
                            selected={dateRange.from && dateRange.to ? { from: dateRange.from, to: dateRange.to } : undefined}
                            onSelect={handleDateRangeSelect}
                            numberOfMonths={2}
                            locale={es}
                            captionLayout="dropdown"
                            fromYear={2019}
                            toYear={new Date().getFullYear()}
                            disabled={(date) => date > new Date() || date < new Date("2019-01-01")}
                        />
                    </PopoverContent>
                </Popover>
            )}
        </div>
    );
}
