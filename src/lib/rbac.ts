export const ROLE_PERMISSIONS: Record<string, string[] | "ALL"> = {
    // Full Access
    "edgarallanglez@gmail.com": "ALL",
    "gerardo.carranza@comerplasin.com": "ALL",
    "atencionaclientes@comerplasin.com": "ALL",

    // Limited Access Groups
    "elizabeth.sanchez@comerplasin.com": [
        "/dashboard/sales",
        "/dashboard/metas"
    ],
    "virginia.soto@comerplasin.com": [
        "/dashboard/sales",
        "/dashboard/inventario",
        "/dashboard/compras"
    ]
};

/**
 * Returns the list of permitted module URLs for a given email address.
 * If the user has full access, returns 'ALL'.
 * If the user has no defined access, returns an empty array to hide all modules.
 */
export function getAllowedModules(email: string | undefined | null): string[] | "ALL" {
    if (!email) return [];

    const normalizedEmail = email.toLowerCase().trim();
    const permissions = ROLE_PERMISSIONS[normalizedEmail];

    return permissions || [];
}

/**
 * Helper to check if a specific URL is allowed for an email
 */
export function isModuleAllowed(email: string | undefined | null, url: string): boolean {
    if (!email) return false;

    const allowed = getAllowedModules(email);
    if (allowed === "ALL") return true;

    // Allow access to the root dashboard if they have at least one allowed module
    if (url === '/dashboard' || url === '/dashboard/') {
        return allowed.length > 0;
    }

    // Allow access if the requested URL starts with any of their allowed module paths
    return allowed.some(allowedPath => url.startsWith(allowedPath));
}
