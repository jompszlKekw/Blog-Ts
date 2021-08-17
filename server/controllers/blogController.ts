import { Response } from "express";

import { Blog } from "../models/blogModel";
import { IReqAuth } from "../config/interfaces";

class BlogController {
  async createBlog(req: IReqAuth, res: Response) {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication." });

    try {
      const { title, content, description, thumbnail, category } = req.body;

      const newBlog = new Blog({
        user: req.user._id,
        title,
        content,
        description,
        thumbnail,
        category,
      });

      await newBlog.save();
      res.json({ newBlog });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
}

export { BlogController };
