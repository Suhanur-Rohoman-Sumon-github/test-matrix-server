import express from 'express';
import { userControllers } from '../user/user.controller';
const router = express.Router();
router.get(
  '/my-insights',
  userControllers.getAdminInsitData
);

export const AdminRouter = router;