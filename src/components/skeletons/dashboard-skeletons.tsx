import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-32 mb-2" />
                        <Skeleton className="h-3 w-40" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-[350px] w-full" />
            </CardContent>
        </Card>
    );
}

export function TableSkeleton({ rows = 10 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-10 w-full" /> {/* Search bar */}
            <div className="rounded-md border">
                <div className="p-4 space-y-3">
                    {/* Table header */}
                    <div className="flex gap-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-4 flex-1" />
                        ))}
                    </div>
                    {/* Table rows */}
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex gap-4">
                            {Array.from({ length: 5 }).map((_, j) => (
                                <Skeleton key={j} className="h-8 flex-1" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            <Skeleton className="h-10 w-full" /> {/* Pagination */}
        </div>
    );
}
