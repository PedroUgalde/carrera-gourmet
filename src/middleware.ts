import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.length > 0 &&
    key.length > 0 &&
    !url.includes("xxx") &&
    !key.startsWith("eyJ...")
  );
}

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.next();
  }
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isVendorRoute = pathname.startsWith("/vendor");
  const isTouristRoute = pathname.startsWith("/tourist");
  const isProtected = isVendorRoute || isTouristRoute;

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && (isProtected || isAuthRoute)) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role;

    if (isAuthRoute && role) {
      const url = request.nextUrl.clone();
      url.pathname =
        role === "vendor" ? "/vendor/dashboard" : "/tourist/search";
      return NextResponse.redirect(url);
    }

    if (isVendorRoute && role !== "vendor") {
      const url = request.nextUrl.clone();
      url.pathname = "/tourist/search";
      return NextResponse.redirect(url);
    }

    if (isTouristRoute && role !== "tourist") {
      const url = request.nextUrl.clone();
      url.pathname = "/vendor/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/vendor/:path*",
    "/tourist/:path*",
    "/login",
    "/register",
  ],
};
