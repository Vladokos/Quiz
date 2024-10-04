import { NextResponse } from "next/server";

import cookie from "cookie";
import bcrypt from "bcryptjs";

import { findUserByEmail, newTokens } from "@/lib/db/dbQueries";

export const POST = async (request: Request) => {
  try {
    const { email, password } = await request.json();

    const user = await findUserByEmail(email);

    if (user) {
      const passwordCompare = await bcrypt.compare(password, user.Password);

      if (passwordCompare) {
        const tokens = await newTokens(user.Email);

        const res = NextResponse.json(
          { message: "success"},
          { status: 201 }
        );

        res.headers.append(
          "Set-Cookie",
          cookie.serialize("accessToken", tokens!.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "strict",
            path: "/",
          })
        );

        res.headers.append(
          "Set-Cookie",
          cookie.serialize("refreshToken", tokens!.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "strict",
            path: "/",
          })
        );

        return res;
      } else {
        return NextResponse.json(
          { message: "Password or email is incorrect" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "User doesn't exist" },
        { status: 404 }
      );
    }
  } catch (error) {
    return new NextResponse("Error", { status: 500 });
  }
};
