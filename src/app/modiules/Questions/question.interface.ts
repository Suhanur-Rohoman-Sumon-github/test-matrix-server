import { Types } from "mongoose";

export type TQuestions  = {
  question: string;
  options: string[]; 
  correct: number; 
  area?: string; 
  category: Types.ObjectId; 
}