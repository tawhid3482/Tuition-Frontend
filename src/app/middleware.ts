import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND_BASE_API = process.env.NEXT_PUBLIC_BACKEND_BASE_API?.replace(/\/$/, "");

const hasValidSession = async (req: NextRequest) => {
  if (!BACKEND_BASE_API) {
    return false;
  }

  try {
    const response = await fetch(`${BACKEND_BASE_API}/auth/session`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as {
      data?: { isAuthenticated?: boolean };
    };

    return Boolean(payload?.data?.isAuthenticated);
  } catch {
    return false;
  }
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isDashboardPath = pathname.startsWith("/dashboard");

  if (!isDashboardPath) {
    return NextResponse.next();
  }

  const isAuthenticated = await hasValidSession(req);

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
