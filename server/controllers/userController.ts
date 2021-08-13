import { IReqAuth } from "./../config/interfaces";
import { Response } from "express";
import { User } from "../models/userModel";

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
}

export { UserController };
