import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ComprasLoading() {
    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-32" />
                <div className="flex items-center gap-2 flex-wrap">
                    <Skeleton className="h-10 w-[140px]" /> {/* Mode selector */}
                    <Skeleton className="h-10 w-[120px]" /> {/* Year */}
                    <Skeleton className="h-10 w-[140px]" /> {/* Month */}
                </div>
            </div>

            {/* Stats Skeleton - 4 cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-28" />
                            </CardTitle>
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-32 mb-1" />
                            <Skeleton className="h-3 w-40" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Skeleton - 3 charts in grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle>
                                <Skeleton className="h-5 w-40" />
                            </CardTitle>
                            <Skeleton className="h-4 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-[300px] w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="grid gap-4 min-w-0">
                <Skeleton className="h-7 w-48" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-full" /> {/* Search bar */}
                    <div className="rounded-md border">
                        <div className="p-4 space-y-3">
                            {/* Table header */}
                            <div className="flex gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Skeleton key={i} className="h-4 flex-1" />
                                ))}
                            </div>
                            {/* Table rows */}
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <Skeleton key={j} className="h-8 flex-1" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full" /> {/* Pagination */}
                </div>
            </div>
        </div>
    );
}
