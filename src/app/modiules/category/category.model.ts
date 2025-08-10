import { Schema, model,  } from "mongoose";// Just for reference, not stored in DB
import { TExamStep } from "./category.interface";



const ExamStepSchema = new Schema<TExamStep>({
  step: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  levels: [{ type: String, required: true }], // e.g. ["A1", "A2"]
  description: { type: String, required: true },
  questions: { type: Number, required: true },
  timeLimit: { type: String, required: true },
  passingScore: { type: Number, required: true },
  advanceScore: { type: Number, required: true },
  color: { type: String, required: true },
  requirements: [{ type: String, required: true }],
}, {
  timestamps: true,
});

export const ExamStepModel = model<TExamStep>("ExamStep", ExamStepSchema);
