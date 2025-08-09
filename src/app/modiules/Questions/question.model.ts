import { Schema, model } from "mongoose";
import { TQuestions } from "./question.interface";



const QuestionSchema = new Schema<TQuestions>(
  {
    question: { type: String, required: true },
    options: {
      type: [String],
      validate: {
        validator: (arr: string[]) => arr.length === 4,
        message: "Exactly 4 options are required",
      },
      required: true,
    },
    correct: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    area: { type: String },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

export const QuestionModel = model<TQuestions>("Question", QuestionSchema);
