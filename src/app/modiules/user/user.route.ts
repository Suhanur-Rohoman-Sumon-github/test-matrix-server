import express from 'express';
import { userControllers } from './user.controller';
const router = express.Router();


router.post(
  '/verify-email',
  userControllers.verifyEmail
);
router.get(
  '/verification-code/:userEmail',
  userControllers.getUserVerificationCode
);
router.get(
  '/allUser/pending-approval',
  userControllers.getPendingUsers
);

router.patch(
  '/allUser/update-Chanel/:userEmail',
  userControllers.updateMyTeligramChanel
);

export const userRouter = router;