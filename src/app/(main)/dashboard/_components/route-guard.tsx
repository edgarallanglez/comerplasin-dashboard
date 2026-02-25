"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isModuleAllowed, getAllowedModules } from "@/lib/rbac";

export function RouteGuard({ userEmail }: { userEmail: string | undefined }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (!userEmail || !pathname.startsWith("/dashboard")) return;

        if (!isModuleAllowed(userEmail, pathname)) {
            const allowed = getAllowedModules(userEmail);
            if (Array.isArray(allowed) && allowed.length > 0) {
                router.replace(allowed[0]);
            } else {
                router.replace("/dashboard");
            }
        }
    }, [pathname, userEmail, router]);

    return null;
}
