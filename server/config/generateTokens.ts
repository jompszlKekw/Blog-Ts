import { Response } from 'express';
import { sign } from 'jsonwebtoken';

export function generateActiveToken(payload: object) {
  return sign(payload, `${process.env.ACTIVE_TOKEN_SECRET}`, {
    expiresIn: '5m',
  });
}

export function generateAcessToken(payload: object) {
  return sign(payload, `${process.env.ACCESS_TOKEN_SECRET}`, {
    expiresIn: '15m',
  });
}

export function generateRefreshToken(payload: object, res: Response) {
  const refresh_token = sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: '30d',
  });

  res.cookie('refreshtoken', refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
  });

  return refresh_token;
}
