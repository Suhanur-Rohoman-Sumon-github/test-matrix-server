import { Router } from 'express';
import { authRouter } from '../modiules/auth/auth.routes';
import { userRouter } from '../modiules/user/user.route';
import { CategoryRoutes } from '../modiules/category/category.routes';
import { QuestionRoutes } from '../modiules/Questions/question.routes';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRouter,
  },
  {
    path: '/users',
    route: userRouter,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/questions',
    route: QuestionRoutes,
  },
  
];

moduleRoutes.forEach((routes) => router.use(routes.path, routes.route));

export default router;
