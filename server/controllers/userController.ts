import { IReqAuth } from "./../config/interfaces";
import { Request, Response } from "express";
import { User } from "../models/userModel";
import { hash } from "bcrypt";

class UserController {
  async updateUser(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });

    try {
      const { avatar, name } = req.body;

      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          avatar,
          name,
        }
      );

      res.json({ msg: "Update Success" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async resetPassword(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });

    if (req.user.type !== "register")
      return res.status(400).json({
        msg: `Quick login account with ${req.user.type} can't use this function`,
      });

    try {
      const { password } = req.body;
      const passwordHash = await hash(password, 12);

      const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Reset password Success" });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
  async getUser(req: Request, res: Response) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export { UserController };
