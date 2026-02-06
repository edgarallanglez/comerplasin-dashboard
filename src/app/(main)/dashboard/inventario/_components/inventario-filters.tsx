"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon, Search, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";

interface Warehouse {
    id_almacen: number;
    almacen: string;
}

interface InventarioFiltersProps {
    warehouses: Warehouse[];
}

export function InventarioFilters({ warehouses }: InventarioFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [producto, setProducto] = useState(searchParams.get("producto") || "");
    const currentAlmacen = searchParams.get("almacen") || "";
    const soloConStock = searchParams.get("conStock") === "1";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({
        from: startDateParam ? new Date(startDateParam) : undefined,
        to: endDateParam ? new Date(endDateParam) : undefined,
    });

    const updateParams = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        router.push(`?${params.toString()}`);
    }, [router, searchParams]);

    const handleSearch = () => {
        updateParams({ producto: producto || null });
    };

    const handleAlmacenChange = (value: string) => {
        updateParams({ almacen: value === "all" ? null : value });
    };

    const handleStockFilterChange = (checked: boolean) => {
        updateParams({ conStock: checked ? "1" : null });
    };

    const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
        if (range) {
            setDateRange(range);
            if (range.from && range.to) {
                updateParams({
                    startDate: format(range.from, "yyyy-MM-dd"),
                    endDate: format(range.to, "yyyy-MM-dd"),
                });
            }
        }
    };

    const clearDateRange = () => {
        setDateRange({ from: undefined, to: undefined });
        updateParams({ startDate: null, endDate: null });
    };

    const handleClear = () => {
        setProducto("");
        setDateRange({ from: undefined, to: undefined });
        router.push("/dashboard/inventario");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const hasFilters = searchParams.has("producto") || searchParams.has("almacen") || searchParams.has("conStock") || searchParams.has("startDate");

    return (
        <div className="flex items-center gap-3 flex-wrap">
            <Select value={currentAlmacen || "all"} onValueChange={handleAlmacenChange}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todos los almacenes" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Todos los almacenes</SelectItem>
                    {warehouses.map((w) => (
                        <SelectItem key={w.id_almacen} value={w.id_almacen.toString()}>
                            {w.almacen}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar producto..."
                    value={producto}
                    onChange={(e) => setProducto(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-8 w-64"
                />
            </div>
            <Button onClick={handleSearch} size="sm">
                Buscar
            </Button>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="conStock"
                    checked={soloConStock}
                    onCheckedChange={handleStockFilterChange}
                />
                <Label htmlFor="conStock" className="text-sm cursor-pointer whitespace-nowrap">
                    Solo con inventario
                </Label>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from && dateRange.to ? (
                            <>
                                {format(dateRange.from, "dd MMM", { locale: es })} -{" "}
                                {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                            </>
                        ) : (
                            <span>Rango (opcional)</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={handleDateRangeSelect}
                        numberOfMonths={2}
                        locale={es}
                        captionLayout="dropdown"
                        fromYear={2023}
                        toYear={new Date().getFullYear()}
                        disabled={(date) => date > new Date() || date < new Date("2023-01-01")}
                    />
                    {dateRange.from && dateRange.to && (
                        <div className="p-3 border-t">
                            <Button variant="outline" size="sm" onClick={clearDateRange} className="w-full">
                                Limpiar rango
                            </Button>
                        </div>
                    )}
                </PopoverContent>
            </Popover>
            {hasFilters && (
                <Button onClick={handleClear} variant="ghost" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Limpiar
                </Button>
            )}
        </div>
    );
}
