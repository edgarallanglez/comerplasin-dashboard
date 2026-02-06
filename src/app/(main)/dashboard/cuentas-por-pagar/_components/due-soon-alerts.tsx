import { AlertCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Cxp } from "@/lib/api/bridge";

interface DueSoonAlertsProps {
    data: Cxp[];
}

export function DueSoonAlerts({ data }: DueSoonAlertsProps) {
    if (data.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    Próximos Vencimientos (7 días)
                </CardTitle>
                <CardDescription>Documentos que vencen en los próximos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {data.slice(0, 5).map((doc) => {
                        const vencimiento = new Date(doc.CFECHAVENCIMIENTO);
                        const today = new Date();
                        const diffDays = Math.ceil((vencimiento.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                        return (
                            <Alert key={doc.CIDDOCUMENTO} className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                                <Calendar className="h-4 w-4 text-yellow-600" />
                                <AlertDescription className="ml-2">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-semibold">{doc.proveedor}</span>
                                            <span className="text-muted-foreground ml-2">({doc.CFOLIO})</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-yellow-700 dark:text-yellow-500">
                                                ${doc.saldo_pendiente.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {diffDays === 0 ? "Hoy" : diffDays === 1 ? "Mañana" : `${diffDays} días`}
                                            </span>
                                        </div>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        );
                    })}
                </div>
                {data.length > 5 && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Y {data.length - 5} documento{data.length - 5 !== 1 ? 's' : ''} más...
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
