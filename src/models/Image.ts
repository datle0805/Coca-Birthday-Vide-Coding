import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
  publicId: string;
  url: string;
  section: "hero" | "milestones" | "gallery";
  type: "hero_main" | "milestone_card" | "gallery_photo";
  metadata: {
    width: number;
    height: number;
    format: string;
    resourceType: string;
  };
  alt: string;
  displayOrder: number;
  milestoneMonth?: string;
  isActive: boolean;
  uploadedAt: Date;
  uploadedBy: string;
}

const ImageSchema: Schema = new Schema({
  publicId: {
    type: String,
    required: true,
    unique: true,
  },
  url: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
    enum: ["hero", "milestones", "gallery"],
  },
  type: {
    type: String,
    required: true,
    enum: ["hero_main", "milestone_card", "gallery_photo"],
  },
  metadata: {
    width: Number,
    height: Number,
    format: String,
    resourceType: String,
  },
  alt: {
    type: String,
    default: "",
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  milestoneMonth: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  uploadedBy: {
    type: String,
    default: "admin",
  },
});

export default mongoose.model<IImage>("Image", ImageSchema);
