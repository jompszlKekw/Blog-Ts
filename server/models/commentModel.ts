import { Schema, model, Document } from "mongoose";

export interface IComment extends Document {
  user: string;
  blog_id: string;
  blog_user_id: string;
  content: string;
  replyCM: string[];
  reply_user: string;
  comment_root: string;
  _doc: object;
}

const commentSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    blog_id: { type: Schema.Types.ObjectId },
    blog_user_id: { type: Schema.Types.ObjectId },
    content: { type: String, required: true },
    replyCM: [{ type: Schema.Types.ObjectId, ref: "comment" }],
    reply_user: { type: Schema.Types.ObjectId, ref: "user" },
    comment_root: { type: Schema.Types.ObjectId, ref: "comment" },
  },
  { timestamps: true }
);

const Comment = model<IComment>("comment", commentSchema);
export { Comment };
