import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { verify } from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import fetch from "node-fetch";

import { User, IUser } from "../models/userModel";
import {
  generateAcessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateTokens";
import { IDecodedToken, IGgPayload, IUserParams } from "../config/interfaces";
import sendMail from "../config/sendMail";
import { sendSMS, smsOTP, smsVerify } from "../config/sendSMS";
import { validPhone, validateEmail } from "../middleware/valid";

const client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`);
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

      res.json({ access_token, user });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async googleLogin(req: Request, res: Response) {
    try {
      const { id_token } = req.body;
      const verify = await client.verifyIdToken({
        idToken: id_token,
        audience: `${process.env.MAIL_CLIENT_ID}`,
      });

      const { email, email_verified, name, picture } = <IGgPayload>(
        verify.getPayload()
      );

      if (!email_verified)
        return res.status(500).json({ msg: "Email verification failed." });

      const password = email + "your google secret password";
      const passowordHash = await hash(password, 12);

      const user = await User.findOne({ account: email });

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name,
          account: email,
          password: passowordHash,
          avatar: picture,
          type: "google",
        };
        registerUser(user, res);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async facebookLogin(req: Request, res: Response) {
    try {
      const { accessToken, userID } = req.body;

      const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;

      const data = await fetch(URL)
        .then((res) => res.json())
        .then((res) => {
          return res;
        });

      const { email, name, picture } = data;

      const password = email + "your facebook secret password";
      const passowordHash = await hash(password, 12);

      const user = await User.findOne({ account: email });

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name,
          account: email,
          password: passowordHash,
          avatar: picture.data.url,
          type: "facebook",
        };
        registerUser(user, res);
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async loginSMS(req: Request, res: Response) {
    try {
      const { phone } = req.body;

      const data = await smsOTP(phone, "sms");

      res.json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async smsVerify(req: Request, res: Response) {
    try {
      const { phone, code } = req.body;

      const data = await smsVerify(phone, code);

      if (data?.valid)
        return res.status(400).json({ msg: "Invalid Authentication." });

      const password = phone + "your phone secret password";
      const passowordHash = await hash(password, 12);

      const user = await User.findOne({ account: phone });

      if (user) {
        loginUser(user, password, res);
      } else {
        const user = {
          name: phone,
          account: phone,
          password: passowordHash,
          type: "sms",
        };
        registerUser(user, res);
      }

      res.json(data);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

async function loginUser(user: IUser, password: string, res: Response) {
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    let msgError =
      user.type === "register"
        ? "Password or Email/Phone number is incorrect"
        : `Password or Email/Phone number is incorrect. This account login with ${user.type}`;

    return res.status(400).json({ msg: msgError });
  }

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

async function registerUser(user: IUserParams, res: Response) {
  const newUser = new User(user);
  await newUser.save();

  const access_token = generateAcessToken({ id: newUser._id });
  const refresh_token = generateRefreshToken({ id: newUser._id });

  res.cookie("refreshtoken", refresh_token, {
    httpOnly: true,
    path: `/api/refresh_token`,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
  });

  res.json({
    msg: "Login success",
    access_token,
    user: { ...newUser._doc, password: "" },
  });
}

export { AuthController };
