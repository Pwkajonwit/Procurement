import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_PREFIXES = ['/login', '/procurement', '/orders', '/projects', '/gantt'];

const isStaticAsset = (pathname: string) => /\.[a-zA-Z0-9]+$/.test(pathname);

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico' ||
        isStaticAsset(pathname)
    ) {
        return NextResponse.next();
    }

    const isAllowed = pathname === '/' || ALLOWED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
    if (isAllowed) return NextResponse.next();

    return NextResponse.redirect(new URL('/procurement', request.url));
}

export const config = {
    matcher: '/:path*',
};
