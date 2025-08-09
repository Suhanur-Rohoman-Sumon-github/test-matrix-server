import { Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notFoundRoute = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Route Not Found',
  });
};

export default notFoundRoute;
