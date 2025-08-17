import express from "express";
import { 
  getVehicles, 
  createVehicle, 
  updateVehicle, 
  deleteVehicle, 
  getVehicleById, 
  deleteVehicleImage 
} from "../controllers/vehicleController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { handleUploadError, validateUploadedFiles } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getVehicles);
router.get("/:id", getVehicleById);

// Protected routes with image upload
router.post("/", protect, handleUploadError, validateUploadedFiles, createVehicle);
router.put("/:id", protect, handleUploadError, updateVehicle);
router.delete("/:id", protect, deleteVehicle);
router.delete("/:id/images/:imageIndex", protect, deleteVehicleImage);

export default router;
