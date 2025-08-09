import { TCategory } from "./category.interface";
import { CategoryModel } from "./category.model";

const createCategoryInDB = async (payload: TCategory) => {
  return await CategoryModel.create(payload);
};

const getAllCategoriesFromDB = async () => {
  return await CategoryModel.find().sort({ createdAt: -1 });
};

const getSingleCategoryFromDB = async (id: string) => {
  return await CategoryModel.findById(id);
};

const updateCategoryFromDB = async (id: string, payload: Partial<TCategory>) => {
  return await CategoryModel.findByIdAndUpdate(id, payload, { new: true });
};

const deleteCategoryFromDB = async (id: string) => {
  return await CategoryModel.findByIdAndDelete(id);
};

export const CategoryServices = {
  createCategoryInDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryFromDB,
  deleteCategoryFromDB,
};
