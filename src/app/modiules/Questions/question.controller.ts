import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendRespone";
import { QuestionServices } from "./question.service";
import { StatusCodes } from "http-status-codes";

const createQuestion = catchAsync(async (req, res) => {
  const result = await QuestionServices.createQuestionInDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Question created successfully",
    data: result,
  });
});

const getAllQuestions = catchAsync(async (req, res) => {
  const result = await QuestionServices.getAllQuestionsFromDB(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Questions fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleQuestion = catchAsync(async (req, res) => {
  const result = await QuestionServices.getSingleQuestionFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Question fetched successfully",
    data: result,
  });
});

const updateQuestion = catchAsync(async (req, res) => {
  const result = await QuestionServices.updateQuestionFromDB(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Question updated successfully",
    data: result,
  });
});

const deleteQuestion = catchAsync(async (req, res) => {
  const result = await QuestionServices.deleteQuestionFromDB(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Question deleted successfully",
    data: result,
  });
});

export const QuestionController = {
  createQuestion,
  getAllQuestions,
  getSingleQuestion,
  updateQuestion,
  deleteQuestion,
};
