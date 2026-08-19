import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  let message = err.message;
  let code = err.code || 'INTERNAL_SERVER_ERROR';
  let field = err.field || null;

  if (err.name === 'ValidationError') {
    code = 'VALIDATION_FAILED';
    const firstError = Object.values(err.errors)[0] as any;
    message = firstError ? firstError.message : 'Validation failed';
    field = firstError ? firstError.path : null;
    res.status(400);
  } else if (err.code === 11000) {
    code = 'DUPLICATE_ENTRY';
    message = 'An entry with this unique value already exists.';
    field = Object.keys(err.keyValue)[0] || null;
    res.status(400);
  }

  res.status(res.statusCode || statusCode).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      field
    }
  });
};
