import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();
const fileSize = 5 * 1024 * 1024; // 5MB limit

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "rathore-motors-banda/vehicles",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "avif"],
    transformation: [
      // { width: 1200, height: 800, crop: 'limit' }, // Limit max dimensions
      { quality: "auto:good" }, // Optimize quality
      { fetch_format: "auto" }, // Auto-format based on browser support
    ],
    resource_type: "image",
  } as any,
});

// Configure multer with Cloudinary storage
export const upload = multer({
  storage: storage,
  limits: {
    fileSize, // 5MB limit
    files: 10, // Maximum 10 files
  },
  fileFilter: (req, file, cb) => {
    // Check file type

    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }

    // Check file size (additional check)
    if (file.size > fileSize) {
      return cb(new Error("File size too large. Maximum 5MB allowed"));
    }

    cb(null, true);
  },
});

// Cloudinary utility functions
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image");
  }
};

export const uploadSingleImage = async (
  file: Express.Multer.File
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "rathore-motors-banda/vehicles",
      transformation: [
        // { width: 1200, height: 800, crop: "limit" },
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
};

export default cloudinary;
