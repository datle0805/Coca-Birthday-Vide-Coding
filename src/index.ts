import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/database";
import routes from "./routes";
import authRoutes from "./routes/auth";
import imageRoutes from "./routes/images";
import contentRoutes from "./routes/content";
import cloudinaryRoutes from "./routes/cloudinary";
import { logger } from "./middleware";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(logger);

// Database Connection
connectDB();

// Routes
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Dashboard API endpoints ready`);
});
