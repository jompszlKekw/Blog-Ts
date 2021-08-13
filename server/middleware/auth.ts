import { Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

import { User } from "../models/userModel";
import { IDecodedToken, IReqAuth } from "../config/interfaces";

export async function auth(req: IReqAuth, res: Response, next: NextFunction) {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(400).json({ msg: "Invalid Authentication" });

    const decoded = <IDecodedToken>(
      verify(token, `${process.env.ACCESS_TOKEN_SECRET}`)
    );
    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication" });

    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json(err);
  }
}
