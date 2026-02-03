import { Request, Response } from "express";
import Content from "../models/Content";

// Default content for each section
const defaultContent: Record<string, any> = {
  hero: {
    babyName: "Baby Aurora",
    birthDate: "July 14, 2025",
    birthTime: "7:42 AM",
    weight: "3.4 kg",
    height: "50 cm",
    title: "Meet Baby Aurora, our tiny miracle.",
    subtitle: "Born • July 14, 2025 • 7:42 AM",
    description:
      "A cozy space to relive every first smile, sleepy yawn, and heart-melting giggle from newborn to one year old.",
    ctaPrimary: "View Milestones",
    ctaSecondary: "Photo Album",
    tagline1: "Soft clouds & sleepy dreams",
    tagline2: "Everyday magic, saved forever",
  },
  about: {
    title: "About Baby Aurora",
    heading: "A tiny person with a galaxy of personality.",
    description1:
      "From the very first sleepy stretch, Aurora filled our home with a gentle glow. This little corner of the internet is our living love letter – a place to gather her stories, celebrate her firsts, and remember how small her fingers once were.",
    description2:
      "Scroll through her first year as it unfolds: the soft newborn days, the delightful chaos of giggles and wiggles, and the quiet, everyday magic in between.",
    timelineTitle: "Year One Timeline",
    timelineRange: "0 → 12 months",
    milestones: [
      {
        label: "Newborn",
        age: "0 months",
        description: "Sleepy cuddles, soft sighs, and first hello.",
        icon: "👶",
      },
      {
        label: "Curious Koala",
        age: "3 months",
        description: "Wide eyes, gummy smiles, and rolling wiggles.",
        icon: "🧸",
      },
      {
        label: "Little Explorer",
        age: "6 months",
        description: "Sitting tall, grabbing toys, belly laughs.",
        icon: "🌈",
      },
      {
        label: "Busy Bumblebee",
        age: "9 months",
        description: "Crawling fast, babbling stories, clapping hands.",
        icon: "🐝",
      },
      {
        label: "First Birthday",
        age: "12 months",
        description: "Wobbly steps, cake crumbs, and so much wonder.",
        icon: "🎂",
      },
    ],
  },
  milestones: {
    title: "Milestones",
    heading: "Tiny firsts that feel enormous.",
    description:
      "Each card marks a chapter in Aurora's first year – a collection of wonderfully ordinary, unforgettable days.",
    cards: [
      {
        month: "1 Month",
        title: "First little smiles",
        description:
          "Sleepy half-smiles that slowly turned into bright, gummy grins.",
        badge: "Newborn magic",
        color: "from-sky-400/80 to-sky-300/70",
      },
      {
        month: "3 Months",
        title: "Finding her voice",
        description:
          "Soft coos, bubble sounds, and tiny conversations with the ceiling fan.",
        badge: "Chatty clouds",
        color: "from-rose-400/80 to-rose-300/70",
      },
      {
        month: "6 Months",
        title: "Sitting & giggling",
        description:
          "Wobbly sits, delighted squeals, and grabbing every toy in sight.",
        badge: "Little explorer",
        color: "from-amber-400/80 to-amber-300/70",
      },
      {
        month: "9 Months",
        title: "On the move",
        description:
          "Crawling after cats, pulling up on furniture, and clapping along to music.",
        badge: "Busy bee",
        color: "from-emerald-400/80 to-emerald-300/70",
      },
    ],
  },
  gallery: {
    title: "Photo Gallery",
    heading: "A little museum of tiny moments.",
    description:
      "Scroll through a soft, cozy wall of memories. Tap any photo to see it up close.",
  },
  footer: {
    title: "Made with love",
    heading: "Made with love by Mom & Dad.",
    message: "Thank you for visiting Aurora's first-year album.",
    copyright: "All photos and memories",
  },
};

export const getContent = async (req: Request, res: Response) => {
  try {
    const { section } = req.params;

    let content = await Content.findOne({ section });

    if (!content) {
      // Create default content if not exists
      content = new Content({
        section,
        data: defaultContent[section] || {},
        isPublished: true,
      });
      await content.save();
    }

    res.json({
      success: true,
      content: {
        section: content.section,
        data: content.data,
        isPublished: content.isPublished,
        updatedAt: content.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get content error:", error);
    res.status(500).json({ message: "Failed to fetch content" });
  }
};

export const updateContent = async (req: Request, res: Response) => {
  try {
    const { section } = req.params;
    const { data } = req.body;

    const content = await Content.findOneAndUpdate(
      { section },
      {
        data,
        isPublished: false,
        updatedAt: new Date(),
        updatedBy: (req as any).user?.username || "admin",
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "Content updated (staged)",
      content: {
        section: content.section,
        data: content.data,
        isPublished: content.isPublished,
        updatedAt: content.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({ message: "Failed to update content" });
  }
};

export const publishContent = async (req: Request, res: Response) => {
  try {
    const { section } = req.params;

    const content = await Content.findOneAndUpdate(
      { section },
      {
        isPublished: true,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.json({
      success: true,
      message: "Content published successfully",
      content: {
        section: content.section,
        data: content.data,
        isPublished: content.isPublished,
        updatedAt: content.updatedAt,
      },
    });
  } catch (error) {
    console.error("Publish content error:", error);
    res.status(500).json({ message: "Failed to publish content" });
  }
};

export const getAllContent = async (req: Request, res: Response) => {
  try {
    const contents = await Content.find();

    // Ensure all sections have content
    const sections = ["hero", "about", "milestones", "gallery", "footer"];
    const existingSections = contents.map((c) => c.section);

    for (const section of sections) {
      if (!existingSections.includes(section)) {
        const newContent = new Content({
          section,
          data: defaultContent[section] || {},
          isPublished: true,
        });
        await newContent.save();
        contents.push(newContent);
      }
    }

    res.json({
      success: true,
      contents: contents.map((c) => ({
        section: c.section,
        data: c.data,
        isPublished: c.isPublished,
        updatedAt: c.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get all content error:", error);
    res.status(500).json({ message: "Failed to fetch all content" });
  }
};
