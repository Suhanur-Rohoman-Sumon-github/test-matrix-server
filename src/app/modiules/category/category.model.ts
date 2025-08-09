import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";



const CategorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: true,
      enum: ["A1", "B1", "C1"],
      unique: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export const CategoryModel = model<TCategory>("Category", CategorySchema);
