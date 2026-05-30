import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  // Xử lý upload file
  async uploadFile(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            format: 'webp',
          },
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined,
          ) => {
            if (error) {
              return reject(error);
            }
            if (!result) {
              return reject(new Error('Unknown error during upload'));
            }
            resolve(result.secure_url);
          },
        )
        .end(file.buffer);
    });
  }

  // Xử lý upload base64
  async uploadBase64(base64String: string): Promise<string> {
    const result = await cloudinary.uploader.upload(base64String, {
      resource_type: 'image',
    });
    return result.secure_url;
  }
}
