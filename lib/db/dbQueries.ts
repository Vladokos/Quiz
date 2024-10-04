import {
  generateAccess,
  generateRefresh,
} from "@/src/app/components/jwt/jwtComponent";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import bcrypt from "bcryptjs";

export const findUserByEmail = async (email: string | null | undefined) => {
  try {
    if (email) {
      const user = await prisma.users.findUnique({
        where: {
          Email: email,
        },
      });
      
      return user;
    } else {
      return false;
    }
  } catch (error) {
    console.log(`find user by email error ${error}`);
  }
};

export const createUser = async (
  login: string,
  email: string,
  password: string
  //   providerId: number | null,
  //   provider: string | null,
  //   codeVerification: number | null
) => {
  try {
    const accessToken = generateAccess(email, login);
    const refreshToken = generateRefresh(email, login);

    const rounds: number = Number(process.env.ROUNDS);
    const hashedPassword = await bcrypt.hash(password, rounds);

    const hashedToken = await bcrypt.hash(refreshToken.token, rounds);

    const user = await prisma.users.create({
      data: {
        Login: login,
        Email: email,
        Password: hashedPassword,
        refreshToken: hashedToken,
        expires: refreshToken.expires.toString(),
      },
    });

    return {
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
    };
  } catch (error) {
    console.log(`create user error ${error}`);
  }
};

export const newTokens = async (email: string) => {
  try {
    const user = await findUserByEmail(email);

    if (user) {
      const accessToken = generateAccess(user.Email, user.Login);
      const refreshToken = generateRefresh(user.Email, user.Login);

      const rounds: number = Number(process.env.ROUNDS);

      const hashedToken = await bcrypt.hash(refreshToken.token, rounds);

      const updateUser = await prisma.users.update({
        where: {
          Id: user.Id,
        },
        data: {
          refreshToken: hashedToken,
          expires: refreshToken.expires.toString(),
        },
      });

      return {
        accessToken: accessToken.token,
        refreshToken: refreshToken.token,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
