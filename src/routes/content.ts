import { Router } from "express";
import {
  getContent,
  updateContent,
  publishContent,
  getAllContent,
} from "../controllers/contentController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.get("/", getAllContent);
router.get("/:section", getContent);
router.put("/:section", authMiddleware, updateContent);
router.post("/:section/publish", authMiddleware, publishContent);

export default router;
