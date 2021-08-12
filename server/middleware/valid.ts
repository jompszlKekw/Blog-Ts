import { Request, Response, NextFunction } from "express";
import { IUser } from "./../models/userModel";

export async function validRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, account, password }: IUser = req.body;

  const errors: string[] = [];

  if (!name) {
    errors.push("Please add your name");
  } else if (name.length > 20) {
    errors.push("Your name is up to 20 chars long");
  }

  if (!account) {
    errors.push("Please add your email or phone number");
  } else if (!validPhone(account) && !validateEmail(account)) {
    errors.push("Email or phone number format is incorrect");
  }

  if (password.length < 6) {
    errors.push("password must be at least 6 chars");
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });
  next();
}

export function validPhone(phone: string) {
  const re = /^[+]/g;
  return re.test(phone);
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
