
import { TExamStep } from "./category.interface";
import { ExamStepModel } from "./category.model";

const createCategoryInDB = async (payload: TExamStep) => {
  return await ExamStepModel.create(payload);
};

const getAllCategoriesFromDB = async () => {
  return await ExamStepModel.find();
};

const getSingleCategoryFromDB = async (id: string) => {
  return await ExamStepModel.findById(id);
};

const updateCategoryFromDB = async (id: string, payload: Partial<TExamStep>) => {
  return await ExamStepModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteCategoryFromDB = async (id: string) => {
  return await ExamStepModel.findByIdAndDelete(id);
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryFromDB,
  deleteCategoryFromDB,
};
