import { Request, Response } from "express";
import { Comment } from "../models/commentModel";
import { IReqAuth } from "../config/interfaces";

class CommentController {
  async createComment(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { content, blog_id, blog_user_id } = req.body;

      const newComment = new Comment({
        user: req.user._id,
        content,
        blog_id,
        blog_user_id,
      });

      await newComment.save();

      return res.json(newComment);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export { CommentController };
