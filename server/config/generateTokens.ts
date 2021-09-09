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

export function generateRefreshToken(payload: object) {
  return sign(payload, `${process.env.REFRESH_TOKEN_SECRET}`, {
    expiresIn: '30d',
  });
}
