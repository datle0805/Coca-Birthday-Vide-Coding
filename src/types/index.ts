import { BabyDocument } from '../models';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface BabyPayload {
  name: string;
  slug: string;
  birthDate: string;
  birthTime?: string;
  birthWeightKg?: number;
  birthHeightCm?: number;
  zodiac?: string;
  heroImageUrl?: string;
  milestones?: BabyDocument['milestones'];
  photos?: BabyDocument['photos'];
  growthStats?: BabyDocument['growthStats'];
  memories?: BabyDocument['memories'];
}