import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="flex flex-col gap-4 md:gap-6 p-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-[200px]" />
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-[250px]" />
                    <Skeleton className="h-10 w-[80px]" />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[120px]" />
                            <Skeleton className="h-10 w-10 rounded-lg" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[100px] mb-2" />
                            <Skeleton className="h-3 w-[140px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4">
                <Skeleton className="h-7 w-[200px]" />
                <Card>
                    <CardContent className="p-0">
                        <div className="w-full">
                            <div className="border-b p-4">
                                <div className="flex gap-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Skeleton key={i} className="h-4 w-[100px]" />
                                    ))}
                                </div>
                            </div>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="border-b p-4 last:border-0">
                                    <div className="flex gap-4">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                            <Skeleton key={j} className="h-4 w-[100px]" />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
