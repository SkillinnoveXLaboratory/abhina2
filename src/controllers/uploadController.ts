import { Request, Response, NextFunction } from 'express';
import cloudinary from 'cloudinary';

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'des50gqzc',
  api_key: process.env.CLOUDINARY_API_KEY || '583754567739653',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'rXLKWOSg_D5J3YSaXR5RHT1Z3e0'
});

export const uploadImage = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: null,
      error: { code: 'FILE_REQUIRED', message: 'Please upload a file key named "file"', field: 'file' }
    });
  }

  // Upload to Cloudinary stream
  const uploadStream = cloudinary.v2.uploader.upload_stream(
    { folder: 'abhina-trust-uploads', resource_type: 'auto' },
    (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          data: null,
          error: { code: 'CLOUDINARY_ERROR', message: error.message, field: null }
        });
      }
      res.json({
        success: true,
        data: { url: result?.secure_url },
        meta: null,
        error: null
      });
    }
  );

  uploadStream.end(req.file.buffer);
};
