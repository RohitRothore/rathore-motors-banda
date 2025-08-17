import type { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
};

export default errorHandler;
