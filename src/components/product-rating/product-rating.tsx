export interface IProductRating {
  _id: string;
  user: any;
  product: any;
  isActive: boolean;
  rating: number;
  reviewText: string;
  createdAt: string;
  updatedAt: string;
}
