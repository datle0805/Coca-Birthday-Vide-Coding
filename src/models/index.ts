import mongoose, { Document, Schema } from 'mongoose';

export interface Milestone {
  monthNumber: number;
  label: string;
  title: string;
  description: string;
  badge: string;
  imageUrl: string;
}

export interface GalleryPhoto {
  url: string;
  alt: string;
  order: number;
}

export interface GrowthStat {
  label: string;
  value: string;
  progress: number;
  colorKey: string;
  detail: string;
}

export interface MemoryNote {
  title: string;
  text: string;
  author: string;
  order: number;
}

export interface BabyDocument extends Document {
  name: string;
  slug: string;
  birthDate: Date;
  birthTime?: string;
  birthWeightKg?: number;
  birthHeightCm?: number;
  zodiac?: string;
  heroImageUrl?: string;
  milestones: Milestone[];
  photos: GalleryPhoto[];
  growthStats: GrowthStat[];
  memories: MemoryNote[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<Milestone>(
  {
    monthNumber: { type: Number, required: true },
    label: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    badge: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { _id: false },
);

const GalleryPhotoSchema = new Schema<GalleryPhoto>(
  {
    url: { type: String, required: true },
    alt: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const GrowthStatSchema = new Schema<GrowthStat>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
    progress: { type: Number, required: true, min: 0, max: 1 },
    colorKey: { type: String, required: true },
    detail: { type: String, required: true },
  },
  { _id: false },
);

const MemoryNoteSchema = new Schema<MemoryNote>(
  {
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const BabySchema = new Schema<BabyDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    birthDate: { type: Date, required: true },
    birthTime: { type: String },
    birthWeightKg: { type: Number },
    birthHeightCm: { type: Number },
    zodiac: { type: String },
    heroImageUrl: { type: String },
    milestones: { type: [MilestoneSchema], default: [] },
    photos: { type: [GalleryPhotoSchema], default: [] },
    growthStats: { type: [GrowthStatSchema], default: [] },
    memories: { type: [MemoryNoteSchema], default: [] },
  },
  {
    timestamps: true,
  },
);

export const Baby =
  mongoose.models.Baby || mongoose.model<BabyDocument>('Baby', BabySchema);
