import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/arena", "/settings"];
const publicRoutes = ["/auth/login", "/auth", "/dashboard"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  // Redirect to homepage if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/dashboard"));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/arena", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
