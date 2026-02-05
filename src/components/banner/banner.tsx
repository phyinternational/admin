// banner.ts
export interface Banner {
  _id: string;
  bannerImages: string[];
  title: string;
  content: string;
  meaning?: string;
  isActive: boolean;
  position: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
