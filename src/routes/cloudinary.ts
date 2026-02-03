import { Router } from "express";
import { generateSignature } from "../services/cloudinaryService";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/signature", authMiddleware, (req, res) => {
  try {
    const { timestamp, signature } = generateSignature();
    res.json({
      success: true,
      signature,
      timestamp,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET,
    });
  } catch (error) {
    console.error("Generate signature error:", error);
    res.status(500).json({ message: "Failed to generate upload signature" });
  }
});

export default router;
