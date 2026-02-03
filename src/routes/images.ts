import { Router } from "express";
import {
  getImages,
  createImage,
  deleteImage,
  reorderImages,
} from "../controllers/imageController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getImages);
router.post("/", authMiddleware, createImage);
router.delete("/:id", authMiddleware, deleteImage);
router.put("/reorder", authMiddleware, reorderImages);

export default router;
