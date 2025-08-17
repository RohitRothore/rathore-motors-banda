import type { Request, Response, NextFunction } from "express";
import Vehicle from "../models/Vehicle.js";
import { deleteImage } from "../config/cloudinary.js";
import { getFullPublicId } from "../utils/imageUtils.js";

export const getVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ success: true, data: vehicles });
  } catch (err) {
    next(err);
  }
};

export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isVehicleExists = await Vehicle.findOne({ title: req.body.title });
    if (isVehicleExists) {
      return res
        .status(400)
        .json({ success: false, message: "Vehicle already exists" });
    }

    // Extract image URLs from uploaded files
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls.push(...req.files.map((file: any) => file.path));
    }

    // Create vehicle with image URLs
    const vehicleData = {
      ...req.body,
      images: imageUrls,
    };

    const vehicle = new Vehicle(vehicleData);
    await vehicle.save();
    
    res.status(201).json({ 
      success: true, 
      data: vehicle,
      message: "Vehicle created successfully with images"
    });
  } catch (err) {
    next(err);
  }
};

export const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    // Extract image URLs from uploaded files
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls.push(...req.files.map((file: any) => file.path));
    }

    // If new images are uploaded, add them to existing images
    const updateData = { ...req.body };
    if (imageUrls.length > 0) {
      const existingVehicle = await Vehicle.findById(id);
      if (existingVehicle) {
        updateData.images = [...existingVehicle.images, ...imageUrls];
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle,
      message: "Vehicle updated successfully"
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    // Delete images from Cloudinary
    if (vehicle.images && vehicle.images.length > 0) {
      for (const imageUrl of vehicle.images) {
        if (!imageUrl) continue;
        try {
          const fullPublicId = getFullPublicId(imageUrl);
          if (fullPublicId) {
            await deleteImage(fullPublicId);
          }
        } catch (error) {
          console.error('Error deleting image:', error);
          // Continue with deletion even if image deletion fails
        }
      }
    }

    await Vehicle.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully"
    });
  } catch (err) {
    next(err);
  }
};

export const getVehicleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};

export const deleteVehicleImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, imageIndex } = req.params;
    
    const vehicle = await Vehicle.findById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found"
      });
    }

    const index = parseInt(imageIndex as string);
    if (index < 0 || index >= vehicle.images.length) {
      return res.status(400).json({
        success: false,
        message: "Invalid image index"
      });
    }

    // Delete image from Cloudinary
    const imageUrl = vehicle.images[index];
    if (imageUrl && typeof imageUrl === 'string') {
      try {
        const fullPublicId = getFullPublicId(imageUrl);
        if (fullPublicId) {
          await deleteImage(fullPublicId);
        }
      } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
      }
    }

    // Remove image from array
    vehicle.images.splice(index, 1);
    await vehicle.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: vehicle
    });
  } catch (err) {
    next(err);
  }
};
