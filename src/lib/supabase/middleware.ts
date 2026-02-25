
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isModuleAllowed, getAllowedModules } from '@/lib/rbac'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/login')
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/auth/v1/login'
        return NextResponse.redirect(url)
    }

    // Role-Based Access Control (RBAC) guard
    if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const email = user.email;
        const currentPath = request.nextUrl.pathname;

        // Check if the exact path is allowed
        if (!isModuleAllowed(email, currentPath)) {
            const allAllowed = getAllowedModules(email);
            const url = request.nextUrl.clone();

            // Redirect to their first available module, or fallback to root if empty
            if (Array.isArray(allAllowed) && allAllowed.length > 0) {
                url.pathname = allAllowed[0];
            } else {
                url.pathname = '/dashboard';
            }
            return NextResponse.redirect(url);
        }
    }

    return response
}
