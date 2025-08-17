import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import vehicleRoutes from "./routes/vehicleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Error Handler
app.use(errorHandler);

export default app;
