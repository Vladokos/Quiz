import { NextResponse } from "next/server";

import cookie from "cookie";

import { createUser, findUserByEmail } from "@/lib/db/dbQueries";

export const POST = async (request: Request) => {
  try {
    const { login, email, password } = await request.json();

    const user = await findUserByEmail(email);

    if (user) {
      return new NextResponse("User already created", {
        status: 300,
      });
    } else {
      const newUser = await createUser(login, email, password);

      if (newUser) {
        const res = NextResponse.json(
          { message: "success" },
          { status: 201 }
        );

        res.headers.append(
          "Set-Cookie",
          cookie.serialize("accessToken", newUser.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "strict",
            path: "/",
          })
        );

        res.headers.append(
          "Set-Cookie",
          cookie.serialize("refreshToken", newUser.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 7 * 24 * 60 * 60,
            sameSite: "strict",
            path: "/",
          })
        );

        return res;
      }
    }
  } catch (error) {
    return new NextResponse("Error", {status: 500});
  }
};
