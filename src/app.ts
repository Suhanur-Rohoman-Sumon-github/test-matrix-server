import express, { Application, Request, Response } from 'express';

import cors from 'cors';
import router from './app/routes/route';
import notFoundRoute from './app/middleware/notFoundRoute';
import handleGlobalError from './app/middleware/globalErrorHandler';

const app: Application = express();

// parser
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"], // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
    credentials: true, // allow cookies/auth headers if needed
  })
);

// Preflight requests for all routes


// Application routers
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send(`server  is building`);
});

// handle 404 route
app.use(notFoundRoute);
app.use(handleGlobalError);

export default app;
