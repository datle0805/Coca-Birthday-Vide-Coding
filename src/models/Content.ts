import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  section: "hero" | "about" | "milestones" | "gallery" | "footer";
  data: Record<string, any>;
  isPublished: boolean;
  updatedAt: Date;
  updatedBy: string;
}

const ContentSchema: Schema = new Schema({
  section: {
    type: String,
    required: true,
    enum: ["hero", "about", "milestones", "gallery", "footer"],
    unique: true,
  },
  data: {
    type: Schema.Types.Mixed,
    required: true,
    default: {},
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    default: "admin",
  },
});

export default mongoose.model<IContent>("Content", ContentSchema);
