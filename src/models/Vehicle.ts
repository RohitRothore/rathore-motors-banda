import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle {
  brand: string;
  fuelType: "Petrol" | "Diesel" | "Electric" | "Hybrid" | "CNG";
  images: string[];
  kmDriven?: number;
  mileage?: number;
  model: string;
  ownership?: "First" | "Second" | "Third";
  price: number;
  status: "Available" | "Sold";
  title: string;
  vehicleType: "Car" | "Truck" | "Bike" | "SUV" | "Van";
  year: number;
}

const vehicleSchema: Schema = new Schema(
  {
    brand: { type: String, required: true },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
      required: true,
    },
    images: [{ type: String }],
    kmDriven: { type: Number },
    mileage: { type: Number },
    model: { type: String, required: true },
    ownership: {
      type: String,
      enum: ["First", "Second", "Third"],
    },
    price: { type: Number, required: true },
    status: { type: String, enum: ["Available", "Sold"], default: "Available" },
    title: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: ["Car", "Truck", "Bike", "SUV", "Van"],
      required: true,
    },
    year: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle & Document>("Vehicle", vehicleSchema);
