import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { upload } from '../config/cloudinary.js';

// Middleware to handle multer errors
export const handleUploadError = (req: Request, res: Response, next: NextFunction) => {
  upload.array('images', 10)(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      switch (err.code) {
        case 'LIMIT_FILE_SIZE':
          return res.status(400).json({
            success: false,
            message: 'File too large. Maximum file size is 5MB'
          });
        case 'LIMIT_FILE_COUNT':
          return res.status(400).json({
            success: false,
            message: 'Too many files. Maximum 10 images allowed'
          });
        case 'LIMIT_UNEXPECTED_FILE':
          return res.status(400).json({
            success: false,
            message: 'Unexpected file field'
          });
        default:
          return res.status(400).json({
            success: false,
            message: 'File upload error'
          });
      }
    } else if (err) {
      // Other errors (file type, etc.)
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed'
      });
    }
    
    // No error, proceed to next middleware
    next();
  });
};

// Middleware to validate uploaded files
export const validateUploadedFiles = (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one image is required'
    });
  }

  const files = req.files as Express.Multer.File[];
  
  // Validate each file
  for (const file of files) {
    if (!file.mimetype.startsWith('image/')) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed'
      });
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB allowed'
      });
    }
  }

  next();
};

// Middleware for single file upload
export const uploadSingle = (fieldName: string = 'image') => {
  return (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({
          success: false,
          message: 'File upload error'
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed'
        });
      }
      next();
    });
  };
}; 