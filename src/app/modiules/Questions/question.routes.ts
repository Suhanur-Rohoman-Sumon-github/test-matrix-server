import express from "express";
import { QuestionController } from "./question.controller";

const router = express.Router();

router.post("/", QuestionController.createQuestion);
router.get("/", QuestionController.getAllQuestions);
router.get("/:id", QuestionController.getSingleQuestion);
router.patch("/:id", QuestionController.updateQuestion);
router.delete("/:id", QuestionController.deleteQuestion);

export const QuestionRoutes = router;
