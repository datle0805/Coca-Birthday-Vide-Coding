import { Request, Response } from "express";
import Image from "../models/Image";
import { deleteFromCloudinary } from "../services/cloudinaryService";

export const getImages = async (req: Request, res: Response) => {
  try {
    const { section } = req.query;
    const query = section ? { section, isActive: true } : { isActive: true };

    const images = await Image.find(query).sort({
      displayOrder: 1,
      uploadedAt: -1,
    });
    res.json({ success: true, images });
  } catch (error) {
    console.error("Get images error:", error);
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

export const createImage = async (req: Request, res: Response) => {
  try {
    const {
      publicId,
      url,
      section,
      type,
      metadata,
      alt,
      displayOrder,
      milestoneMonth,
    } = req.body;

    const image = new Image({
      publicId,
      url,
      section,
      type,
      metadata,
      alt,
      displayOrder: displayOrder || 0,
      milestoneMonth,
      isActive: true,
      uploadedBy: (req as any).user?.username || "admin",
    });

    await image.save();
    res.status(201).json({ success: true, image });
  } catch (error) {
    console.error("Create image error:", error);
    res.status(500).json({ message: "Failed to save image metadata" });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(image.publicId);

    // Delete from database
    await Image.findByIdAndDelete(id);

    res.json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    res.status(500).json({ message: "Failed to delete image" });
  }
};

export const reorderImages = async (req: Request, res: Response) => {
  try {
    const { orderedIds } = req.body;

    const updatePromises = orderedIds.map((id: string, index: number) =>
      Image.findByIdAndUpdate(id, { displayOrder: index })
    );

    await Promise.all(updatePromises);

    res.json({ success: true, message: "Images reordered successfully" });
  } catch (error) {
    console.error("Reorder images error:", error);
    res.status(500).json({ message: "Failed to reorder images" });
  }
};
