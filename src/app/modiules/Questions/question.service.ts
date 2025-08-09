import { TQuestions } from "./question.interface";
import { QuestionModel } from "./question.model";

const createQuestionInDB = async (payload: TQuestions) => {
  return await QuestionModel.create(payload);
};

const getAllQuestionsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  if (query.category) {
    filter.category = query.category;
  }

  const questions = await QuestionModel.find(filter)
    .populate("category", "name description")
    .sort({ createdAt: -1 });

  const count = await QuestionModel.countDocuments(filter);
  return { data: questions, meta: { total: count } };
};

const getSingleQuestionFromDB = async (id: string) => {
  return await QuestionModel.findById(id).populate("category", "name description");
};

const updateQuestionFromDB = async (id: string, payload: Partial<TQuestions>) => {
  return await QuestionModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteQuestionFromDB = async (id: string) => {
  return await QuestionModel.findByIdAndDelete(id);
};

export const QuestionServices = {
  createQuestionInDB,
  getAllQuestionsFromDB,
  getSingleQuestionFromDB,
  updateQuestionFromDB,
  deleteQuestionFromDB,
};
