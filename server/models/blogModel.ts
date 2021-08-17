import { Schema, model } from "mongoose";

export interface IBlog {
  user: string;
  title: string;
  content: string;
  description: string;
  thumbnail: string;
  category: string;
}

const blogSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    title: {
      type: String,
      required: true,
      trim: true,
      minLength: 10,
      maxLength: 50,
    },
    content: { type: String, required: true, minLength: 500 },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 20,
      maxLength: 200,
    },
    thumbnail: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "category" },
  },
  { timestamps: true }
);

const Blog = model<IBlog>("Blog", blogSchema);
export { Blog };
