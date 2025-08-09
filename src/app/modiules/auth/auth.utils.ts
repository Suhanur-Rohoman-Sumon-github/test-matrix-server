import jwt, { SignOptions, Secret } from 'jsonwebtoken';

type JwtPayload = {
  userId?: string;
  role: string;
  email?: string;
};

export const createToken = (
  jwtPayload: JwtPayload,
  secretKey: Secret,
  expiresIn: SignOptions['expiresIn'],
): string => {
  return jwt.sign(jwtPayload, secretKey, {
    expiresIn,
  });
};
