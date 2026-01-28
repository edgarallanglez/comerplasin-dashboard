import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-32" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-[120px]" />
                    <Skeleton className="h-10 w-[140px]" />
                </div>
            </div>

            {/* Stats Skeleton - 5 cols */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                <Skeleton className="h-4 w-24" />
                            </CardTitle>
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Sales Chart Skeleton */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        <Skeleton className="h-5 w-32" />
                    </CardTitle>
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[250px] w-full" />
                </CardContent>
            </Card>

            {/* Recent Transactions List Skeleton */}
            <div className="grid gap-4">
                <h2 className="text-xl font-semibold">
                    <Skeleton className="h-7 w-48" />
                </h2>
                <div className="rounded-md border bg-card text-card-foreground shadow-sm overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="flex gap-4">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </div>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 border-b last:border-0 flex gap-4 items-center">
                            <Skeleton className="h-4 w-12" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
