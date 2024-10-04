import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import * as jose from "jose";

import cookie from "cookie";

interface JWTerror extends Error {
  code: string;
  name: string;
  claim: string;
  reason: string;
  payload: {
    email: string;
    login: string;
    iat: number;
    exp: number;
  };
}

interface responseRefresh {
  msg: string;
  status: number;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export async function middleware(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    const accessToken = req.cookies.get("accessToken")?.value;

    const url = req.nextUrl.clone();
    const pathName = url.pathname;

    if (pathName !== "/signIn" && url.pathname !== "/signUp") {
      if (refreshToken && accessToken) {
        const verifyToken = await jose.jwtVerify(
          refreshToken,
          new TextEncoder().encode(process.env.REFRESH_SECRET!)
        );

        const verifyTokenAccessToken = await jose.jwtVerify(
          accessToken,
          new TextEncoder().encode(process.env.SECRET!)
        );

        if (verifyToken && verifyTokenAccessToken) {
          return NextResponse.next();
        } else {
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
      } else {
        url.pathname = "/signIn";
        return NextResponse.redirect(url);
      }
    }
  } catch (error) {
    const er = error as JWTerror;

    const url = req.nextUrl.clone();

    url.pathname = "/signIn";

    if (er.claim === "exp") {
      const path = req.nextUrl.clone().toString();

      const response = await fetch(`${process.env.HOST}/api/refreshTokens`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: er.payload.email,
        }),
      });

      const responseJSON: responseRefresh = await response.json();

      const res = NextResponse.redirect(path);
      res.headers.append(
        "Set-Cookie",
        cookie.serialize("refreshToken", responseJSON.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );

      res.headers.append(
        "Set-Cookie",
        cookie.serialize("accessToken", responseJSON.tokens.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 7 * 24 * 60 * 60,
          sameSite: "strict",
          path: "/",
        })
      );

      return res;
    }
    const res = NextResponse.redirect(url);
    res.headers.append(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 0,
        sameSite: "strict",
        path: "/",
      })
    );
    res.headers.append(
      "Set-Cookie",
      cookie.serialize("accessToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 0,
        sameSite: "strict",
        path: "/",
      })
    );

    return res;
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
