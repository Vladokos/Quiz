import jwt from "jsonwebtoken";

export const generateAccess = (email: string, login: string) => {
  const secret = process.env.SECRET!;
  const accessToken = jwt.sign(
    {
      email: email,
      login: login,
    },
    secret,
    { expiresIn: "7h" }
  );
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  const unixTimestampInSeconds = Math.floor(currentDate.getTime() / 1000);

  return { token: accessToken, expires: unixTimestampInSeconds };
};

export const generateRefresh = (email: string, login: string) => {
  const secret = process.env.REFRESH_SECRET!;
  const refreshToken = jwt.sign(
    {
      email: email,
      login: login,
    },
    secret,
    { expiresIn: "14d" }
  );
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  const unixTimestampInSeconds = Math.floor(currentDate.getTime() / 1000);

  return { token: refreshToken, expires: unixTimestampInSeconds };
};

