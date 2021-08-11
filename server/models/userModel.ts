import { Schema, model, Model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  account: string;
  password: string;
  avatar: string;
  role: string;
  type: string;
  _doc: object;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please your name"],
      trim: true,
      maxLength: [20, "You name is up to 20 chars long"],
    },
    account: {
      type: String,
      required: [true, "Please your Email or phone"],
      trim: true,
      unique: true,
    },
    password: { type: String, required: [true, "Please your password"] },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
    },
    role: { type: String, default: "user" },
    type: { type: String, default: "register" },
  },
  { timestamps: true }
);

const User: Model<IUser> = model("User", userSchema);
export { User };
