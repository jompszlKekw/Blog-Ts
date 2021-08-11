import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { verify } from "jsonwebtoken";
import { User, IUser } from "../models/userModel";
import {
  generateAcessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateTokens";
import { IDecodedToken } from "../config/interfaces";
import sendMail from "../config/sendMail";
import { sendSMS } from "../config/sendSMS";
import { validPhone, validateEmail } from "../middleware/valid";

const CLIENT_URL = `${process.env.BASE_URL}`;

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { name, account, password }: IUser = req.body;

      const user = await User.findOne({ account });
      if (user)
        return res
          .status(400)
          .json({ msg: "Email or phone number already exists" });

      const passwordHash = await hash(password, 12);

      const newUser = {
        name,
        account,
        password: passwordHash,
      };

      const active_token = generateActiveToken({ newUser });
      const url = `${CLIENT_URL}/active/${active_token}`;

      if (validateEmail(account)) {
        sendMail(account, url, "Verify your email address");
        return res.json({ msg: "Success! Please check your email." });
      } else if (validPhone(account)) {
        sendSMS(account, url, "Verify your phone number");
        return res.json({ msg: "Success! Please check your phone." });
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async activeAccount(req: Request, res: Response) {
    try {
      const { active_token } = req.body;

      const decoded = <IDecodedToken>(
        verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );

      const { newUser } = decoded;

      if (!newUser)
        return res.status(500).json({ msg: "Invalid authentication." });

      const user = new User(newUser);

      await user.save();

      res.json({ msg: "Account has been activated!" });
    } catch (err) {
      let errMsg;

      if (err.code === 11000) {
        errMsg = Object.keys(err.keyValue)[0] + " alredy exists";
      } else {
        let name = Object.keys(err.errors)[0];
        console.log({ name });
        errMsg = err.errors[`${name}`].message;
      }
      return res.status(500).json(err);
    }
  }
  async login(req: Request, res: Response) {
    try {
      const { account, password } = req.body;

      const user = await User.findOne({ account });
      if (!user)
        return res
          .status(400)
          .json({ msg: "Password or Email/Phone number is incorrect" });

      loginUser(user, password, res);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("refreshtoken", { path: `/api/refresh_token` });
      return res.json({ msg: "Logged out!" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async refreshToken(req: Request, res: Response) {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

      const decoded = <IDecodedToken>(
        verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      if (!decoded.id)
        return res.status(400).json({ msg: "Please login now!" });

      const user = await User.findById(decoded.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "This account does not exist" });

      const access_token = generateAcessToken({ id: user._id });

      res.json({ access_token });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

async function loginUser(user: IUser, password: string, res: Response) {
  const isMatch = await compare(password, user.password);
  if (!isMatch)
    return res
      .status(500)
      .json({ msg: "Password or Email/Phone number is incorrect" });

  const access_token = generateAcessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id });

  res.cookie("refreshtoken", refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
  });

  res.json({
    msg: "Login success",
    access_token,
    user: { ...user._doc, password: "" },
  });
}

export { AuthController };
