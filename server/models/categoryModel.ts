import { Schema, model } from 'mongoose';

export interface ICategory {
  name: string;
}

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add one category'],
      trim: true,
      unique: true,
      maxLength: [50, 'Name is up to 50 chars long.'],
    },
  },
  { timestamps: true }
);

const Category = model<ICategory>('category', categorySchema);
export { Category };
