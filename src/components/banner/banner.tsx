// banner.ts
export interface Banner {
  _id: string;
  bannerImages: { url: string }[];
  title: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
