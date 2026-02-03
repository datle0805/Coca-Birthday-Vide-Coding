import { Request, Response } from 'express';
import { Baby } from '../models';
import { ApiResponse, BabyPayload } from '../types';

export class BabyController {
  /**
   * Get the active baby profile (for now we assume a single baby, by slug).
   * Frontend can call /api/baby?slug=aurora or just /api/baby for the first record.
   */
  public async getBaby(
    req: Request,
    res: Response<ApiResponse<any>>,
  ): Promise<Response> {
    try {
      const { slug } = req.query as { slug?: string };

      const baby = slug
        ? await Baby.findOne({ slug })
        : await Baby.findOne().sort({ createdAt: 1 });

      if (!baby) {
        return res.status(404).json({
          success: false,
          message: 'Baby profile not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: baby,
      });
    } catch (error) {
      console.error('Error fetching baby profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch baby profile',
      });
    }
  }

  /**
   * Create or update a baby profile by slug.
   * If a document with the same slug exists, we update it; otherwise we create it.
   */
  public async upsertBaby(
    req: Request<unknown, unknown, BabyPayload>,
    res: Response<ApiResponse<any>>,
  ): Promise<Response> {
    try {
      const {
        name,
        slug,
        birthDate,
        birthTime,
        birthHeightCm,
        birthWeightKg,
        zodiac,
        heroImageUrl,
        milestones,
        photos,
        growthStats,
        memories,
      } = req.body;

      if (!name || !slug || !birthDate) {
        return res.status(400).json({
          success: false,
          message: 'name, slug, and birthDate are required',
        });
      }

      const payload = {
        name,
        slug,
        birthDate: new Date(birthDate),
        birthTime,
        birthHeightCm,
        birthWeightKg,
        zodiac,
        heroImageUrl,
        milestones,
        photos,
        growthStats,
        memories,
      };

      const baby = await Baby.findOneAndUpdate({ slug }, payload, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });

      return res.status(200).json({
        success: true,
        data: baby,
        message: 'Baby profile saved successfully',
      });
    } catch (error) {
      console.error('Error saving baby profile:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to save baby profile',
      });
    }
  }
}